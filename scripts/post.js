// Copyright Datajin Technologies, Inc. 2015,2016. All Rights Reserved.
// Node module: mktmpio
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var crypto = require('crypto');
var fs = require('fs');
var qs = require('querystring');
var request = require('https').request;
var pkg = require('../package.json');
var nodeUA = 'node/' + process.version;
var name = process.env.npm_package_name || 'mktmpio';
var version = process.env.npm_package_version || pkg.version;
var lifecycle = process.env.npm_lifecycle_event || 'post-install';
var userAgent = process.env.npm_config_user_agent || nodeUA;

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

function recordEvent() {
  var params = {
    v: '1',
    tid: 'UA-63367092-1',
    ds: 'npm',
    cid: uuid(),
    ua: userAgent,
    t: 'event',
    ec: 'npm',
    ea: lifecycle,
    el: name + '@' + version,
  };
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
  req.on('error', debug ? console.error : noop)
     .on('response', debug ? dumpResponse : noop)
     .end(postData);
}

function uuid() {
  var rnd = crypto.randomBytes(16);
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
  rnd.shift();
  return rnd.join('-');
}

function dumpResponse(res) {
  console.log('RESP:', res.statusCode);
  res.on('data', console.log.bind(console, 'RESP: %s'));
}

function noop() {}
