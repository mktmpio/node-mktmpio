// Copyright Datajin Technologies, Inc. 2015. All Rights Reserved.
// Node module: mktmpio
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var tap = require('tap');

tap.test('require', function(t) {
  t.plan(1);
  t.doesNotThrow(function() {
    require('../');
  });
});
