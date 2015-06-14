'use strict';

var tap = require('tap');

tap.test('require', function(t) {
  t.plan(1);
  t.doesNotThrow(function() {
    require('../');
  });
});
