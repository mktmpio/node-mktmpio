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

tap.test('application error', function(t) {
  mockServer(200, {'Content-Type': 'application/json'}, {error: 'bad stuff'}, function(opts) {
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
      t.type(err, Error);
      t.match(err, {message: 'bad stuff'});
      t.match(res, {error: 'bad stuff'});
      t.end();
    });
  });
});

tap.test('parse error', function(t) {
  mockServer(200, {'Content-Type': 'application/json'}, 'not actually JSON', function(opts) {
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
      t.type(err, Error);
      t.match(err, {name: /SyntaxError/, message: /token/});
      t.match(res, 'not actually JSON');
      t.end();
    });
  });
});
