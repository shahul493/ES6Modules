/*jslint node: true*/
require('coffee-script/register');
var extend = require('extend');
var exec   = require('child_process').exec;

var load = require('./loader');
var wrapper = require('./wrapper');

var defaults = {
  folder: './gulp',
  gulp: wrapper
};

module.exports = function (options) {
    exec('npm view gulp-loader version', {timeout: 500}, function(err, stdout, stderr) {
      if (err) return;
      var current = require(__dirname+'/package.json').version;
      var latest = stdout.toString().trim();
      var semver = require('semver');
      if (semver.valid(latest)) {
        if (semver.gt(latest, current)) {
            wrapper.util.log(wrapper.util.colors.yellow('[gulp-loader] An updated version is available. Download it now from https://www.npmjs.org/package/gulp-loader !'));
        } else if (semver.lt(latest, current)) {
          wrapper.util.log(wrapper.util.colors.yellow('[gulp-loader] You are using a pre-release version of gulp-loader. Do you know what you\'re doing?'));
        } else {
          wrapper.util.log('[gulp-loader] Up to date');
        }
      } else {
        wrapper.util.log(wrapper.util.colors.yellow('[gulp-loader] Could\'t get a proper version number. Maybe you should check it yourself?'));
      }
    });
    return load(extend({}, defaults, options));
};