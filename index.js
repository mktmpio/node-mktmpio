var fs = require('fs');
var home = require('userhome');
var https = require('https');
var yaml = require('js-yaml');

var confFile = home('.mktmpio.yml');
var conf = {};
try {
  conf = yaml.safeLoad(fs.readFileSync(confFile, 'utf8'));
} catch (e) {
  conf = {};
}

exports.create = createInstance;
exports.destroy = destroyInstance;

function createInstance(instanceType, callback) {
  https.request({
    hostname: 'mktmp.io',
    port: 443,
    path: '/api/v1/new/' + instanceType,
    method: 'POST',
    headers: {
      'X-Auth-Token': conf.token || process.env.MKTMPIO_TOKEN,
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
      'X-Auth-Token': conf.token || process.env.MKTMPIO_TOKEN,
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
