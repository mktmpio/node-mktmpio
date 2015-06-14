#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var cp = require('child_process');
var debug = require('debug')('mktmpio:cli');
var mktmpio = require('../');

var args = _.takeWhile(process.argv, _.negate(literalSeparator)).slice(2);
var subShell = _.drop(process.argv, args.length + 3);

var instanceType = args[0];
mktmpio.create(instanceType, function(err, res) {
  if (err || res.error) {
    console.error('error creating instance:', err || res.error);
    return process.exit(1);
  }
  var instance = res;
  debug('created instance', instance);
  if (subShell.length <= 0) {
    subShell = res.remoteShell || subShell;
  }
  if (Object.keys(subShell).length > 0) {
    spawnSubShell(subShell, instance, function(err) {
      if (err) {
        console.error('Error spawning sub shell:', err);
        return;
      }
      mktmpio.destroy(res.id, function(err, res) {
        if (err || res.error) {
          console.error('error terminating service:', err || res.error);
        } else {
          console.log('instance %s terminated', instance.id);
        }
      });
    });
  }
});

function spawnSubShell(cmd, instance, callback) {
  var env = _.pick(instance, ['username', 'password', 'host', 'port']);
  env = _.mapKeys(env, function(v, key) {
    return makeEnv(instance.type, key);
  });
  if (cmd.env) {
    _.assign(env, cmd.env);
  }
  debug('spawning shell with env:', env);
  if (cmd.cmd) {
    cmd = cmd.cmd;
  }
  cmd = _.map(cmd, String);
  var opts = {
    env: _.defaults(env, process.env),
    stdio: 'inherit',
  };
  debug('spawning subshell:', cmd);
  setTimeout(function() {
    var child = cp.spawn(_.head(cmd), _.tail(cmd), opts);
    child.on('exit', callback);
    child.on('error', callback);
  }, 200);
}

function literalSeparator(str) {
  return str === '--';
}

function makeEnv(pre, name) {
  return pre.toUpperCase() + '_' + name.toUpperCase();
}
