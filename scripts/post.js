'use strict';

var _ = require('lodash');
var fs = require('fs');
var request = require('https').request;
var qs = require('querystring');
var uuid = require('node-uuid');

var debug = /test/.test(process.env.NODE_ENV);
var inRepo = false;
try {
  inRepo = fs.statSync('.git').isDirectory();
} catch (e) {
  inRepo = false;
}

if (!inRepo || debug) {
  recordEvent();
}

return;

function recordEvent() {
  var params = _.omit({
    v: '1',
    tid: 'UA-63367092-1',
    ds: 'npm',
    cid: uuid.v4(),
    ua: process.env.npm_config_user_agent,
    t: 'event',
    ec: 'npm',
    ea: process.env.npm_lifecycle_event,
    el: process.env.npm_package_name + '@' + process.env.npm_package_version,
  }, _.isUndefined);
  var postData = qs.stringify(params);
  var reqOpts = {
    host: 'www.google-analytics.com',
    path: debug ? '/debug/collect' : '/collect',
    method: 'POST',
  };
  var req = request(reqOpts);
  req.setTimeout(500, function() {
    if (debug) {
      console.log('connection timed out', arguments);
    }
    process.exit(0);
  });
  req.on('error', debug ? console.error : _.noop)
     .on('response', debug ? dumpResponse : _.noop)
     .end(postData);
}

function dumpResponse(res) {
  console.log('RESP:', res.statusCode);
  res.on('data', console.log.bind(console, 'RESP: %s'));
}
