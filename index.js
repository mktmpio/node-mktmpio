'use strict';

var fs = require('fs');
var home = require('userhome');
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
conf.url = process.env.MKTMPIO_URL || conf.url || 'https://mktmp.io/';
conf.token = process.env.MKTMPIO_TOKEN || conf.token;

exports.create = createInstance;
exports.destroy = destroyInstance;
exports.attach = attachToInstance;

function createInstance(instanceType, callback) {
  https.request({
    hostname: 'mktmp.io',
    port: 443,
    path: '/api/v1/new/' + instanceType,
    method: 'POST',
    headers: {
      'X-Auth-Token': conf.token,
      'User-Agent': 'mktmpio/' + require('./package.json').version,
    },
  }, function(res) {
    collectJSON(res, callback);
  }).end();
}

function destroyInstance(instanceId, callback) {
  https.request({
    hostname: 'mktmp.io',
    port: 443,
    path: '/api/v1/i/' + instanceId,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': conf.token,
      'User-Agent': 'mktmpio/' + require('./package.json').version,
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
  var wsUrl = url.parse(conf.url);
  wsUrl.protocol = wsUrl.protocol.replace('http', 'ws');
  if (/mktmp\.io/.test(wsUrl.hostname)) {
    wsUrl.port = 8443;
    delete wsUrl.host;
  }
  wsUrl.pathname = '/ws';
  wsUrl.query = {
    id: instanceId,
  };
  wsUrl = url.format(wsUrl);
  var headers = {
    'X-Auth-Token': conf.token,
    'User-Agent': 'mktmpio/' + require('./package.json').version,
  };
  var ws = new WebSocket.Client(wsUrl, [], {headers: headers});
  ws.on('open', function() {
    callback(null, ws);
  });
}
