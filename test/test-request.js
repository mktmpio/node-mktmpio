// Copyright Datajin Technologies, Inc. 2016. All Rights Reserved.
// Node module: mktmpio
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var mockServer = require('./mock').server;
var request = require('../lib/request');
var tap = require('tap');

tap.test('happy path', function(t) {
  mockServer(200, {'Content-Type': 'application/json'}, {result: 'success'}, function(opts) {
    var req = {
      hostname: opts.hostname,
      port: opts.port,
      protocol: opts.protocol,
      path: '/',
      method: 'POST',
      headers: {
        'X-Auth-Token': 'XXXXXXX',
        'User-Agent': 'node-mktmpio/1.2.3',
      },
    };
    request(req, function(err, res) {
      t.ifErr(err, 'no error');
      t.match(res, {result: 'success'});
      t.end();
    });
  });
});
