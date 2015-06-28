'use strict';

var fs = require('fs');
var home = require('userhome');
var http = require('http');
var https = require('https');
var url = require('url');
var WebSocket = require('faye-websocket');
var yaml = require('js-yaml');

var confFile = home('.mktmpio.yml');
var conf = {};
try {
  conf = yaml.safeLoad(fs.readFileSync(confFile, 'utf8'));
} catch (e) {
  conf = {};
}
conf.url = url.parse(process.env.MKTMPIO_URL ||
                     conf.url ||
                     'https://mktmp.io/api/v1');
conf.token = process.env.MKTMPIO_TOKEN || conf.token;
if (!conf.url.port) {
  conf.url.port = /https/.test(conf.url.protocol) ? 443 : 80;
}
var request = /https/.test(conf.url.protocol) ? https.request : http.request;

exports.create = createInstance;
exports.destroy = destroyInstance;
exports.attach = attachToInstance;

function createInstance(instanceType, callback) {
  request({
    hostname: conf.url.hostname,
    port: conf.url.port,
    path: conf.url.pathname + '/new/' + instanceType,
    method: 'POST',
    headers: {
      'X-Auth-Token': conf.token,
      'User-Agent': 'node-mktmpio/' + require('./package.json').version,
    },
  }, function(res) {
    collectJSON(res, callback);
  }).end();
}

function destroyInstance(instanceId, callback) {
  request({
    hostname: conf.url.hostname,
    port: conf.url.port,
    path: conf.url.pathname + '/i/' + instanceId,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': conf.token,
      'User-Agent': 'node-mktmpio/' + require('./package.json').version,
    },
  }, function(res) {
    collectJSON(res, callback);
  }).end();
}

function collectJSON(res, callback) {
  var buf = '';
  res.on('data', function(d) {
    buf += d;
  });
  res.on('end', function() {
    var err = null;
    try {
      buf = buf.length > 0 ? JSON.parse(buf) : {};
    } catch (e) {
      err = e;
    }
    callback(err, buf);
  });
}

function attachToInstance(instanceId, callback) {
  var wsUrl = url.format({
    protocol: conf.url.protocol.replace('http', 'ws'),
    hostname: conf.url.hostname,
    port: conf.url.port === 443 ? 8443 : conf.url.port,
    pathname: '/ws',
    query: {id: instanceId},
  });
  var headers = {
    'X-Auth-Token': conf.token,
    'User-Agent': 'node-mktmpio/' + require('./package.json').version,
  };
  var ws = new WebSocket.Client(wsUrl, [], {headers: headers});
  ws.once('open', function() {
    callback(null, ws);
  });
  ws.once('error', callback);
}
