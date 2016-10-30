// Copyright Datajin Technologies, Inc. 2016. All Rights Reserved.
// Node module: mktmpio
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var http = require('http');

exports.server = mockServer;

function mockServer(status, headers, body, callback) {
  var server = http.createServer(function(req, res) {
    res.writeHead(status, headers);
    if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
      body = JSON.stringify(body, null, 2);
    }
    res.end(body);
    server.close();
  });
  server.listen(0, '127.0.0.1', function() {
    callback({
      hostname: '127.0.0.1',
      port: this.address().port,
      protocol: 'http:',
    });
  });
}
