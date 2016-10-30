// Copyright Datajin Technologies, Inc. 2016. All Rights Reserved.
// Node module: mktmpio
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var http = require('http');
var https = require('https');

module.exports = exports = request;

function request(opts, callback) {
  var realRequest = /https/.test(opts.protocol) ? https.request : http.request;
  realRequest(opts, function(res) {
    collectJSON(res, function(err, data) {
      callback(err, data);
    });
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
