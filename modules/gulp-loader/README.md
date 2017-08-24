gulp-loader
===========

[![Build Status](https://travis-ci.org/call-a3/gulp-loader.svg?tag=1.1.2)](https://travis-ci.org/call-a3/gulp-loader)
[![Dependency Status](https://david-dm.org/call-a3/gulp-loader.svg)](https://david-dm.org/call-a3/gulp-loader) [![devDependency Status](https://david-dm.org/call-a3/gulp-loader/dev-status.svg)](https://david-dm.org/call-a3/gulp-loader#info=devDependencies)

Gulp plugin that wraps gulp and loads tasks from a specified folder. Task definitions are compatible with [gulp-task-loader](https://www.npmjs.org/package/gulp-task-loader).

## Installation

[![gulp-loader](https://nodei.co/npm/gulp-loader.png?mini=true)](https://nodei.co/npm/gulp-loader)

## Usage
Just write this in your gulpfile.js
```javascript
/* 
  instead of require('gulp') and then defining tasks on it
  just write the following 
*/
require('gulp-loader')();
```

Now create a folder next to your gulpfile.js called `gulp` and have them contain tasks like this:
```javascript
/*
  no need to require('gulp')
  because gulp is already defined in the scope of the module
*/
module.exports = function () {
	gulp.src('...')
	// your gulp task here
		.pipe(gulp.dest('...'));
}
    
// the following line is optional
module.exports.dependencies = ['dep1', 'dep2'];
```
(Note: this setup is compatible with [gulp-task-loader](https://www.npmjs.org/package/gulp-task-loader).)
You can also write tasks in coffeescript.

## Extra features
gulp-loader wraps the gulp library in a backwards-compatible way and exposes it to the tasks. 
This means you can define your tasks as if gulp was pre-loaded, but you can also use some shortcuts or extra features.

### gulp.util
This exposes the gulp-util library. In other words, you can use `gulp.util` instead of
```
var gutil = require('gulp-util');
gutil.log(); // or whatever gulp-util function you would use
```

### gulp.debug
Contains a boolean indicating if the build should assume a develop/debug environment. The default is to assume debugging is needed unless `--target=production` was provided on the command line. You can use this to adjust build behaviour based on whether debugging is required.

```bash
# Usage on the terminal looks like the following
gulp --target=production $task
```

### gulp.name
Contains a string that represents the name of the package. This consists of package.name + '@' + package.version + '.js', wherein package is loaded from package.json. The character '@' can be replaced by another by setting the option `gulp.name.infix`. Similarly, the extension can be set differently by setting the option `gulp.name.extension`.

### gulp.dirs
A hash containing `source`, `test`, `build` and `dist` values. These are set from values in the "gulp" entry in package.json using the same names and default to 'src', 'test', 'build' and 'dist' respectively. Each of these folders is resolved relative to the parent of gulpfile.js.

### gulp.main
Returns the full pathname of package.main or `gulp.dirs.source + '/main.js'` if none is set in package.json.

### gulp.src()
You can use the gulp.src() function without globPattern parameters. This defaults to streaming every file in the `gulp.dirs.source` folder. You can also still use the function as you would the normal gulp.src(globPattern) function.

### gulp.dest()
You can use the gulp.dest() function without path parameter. This defaults to streaming every file to the `gulp.dirs.build` folder. You can also still use the function as you would the normal gulp.dest(path) function.

### gulp.deploy()
The gulp.deploy() function works similarly to gulp.dest(). This streams every file to the `gulp.dirs.test` or `gulp.dirs.dist` folder, depending on the value of `gulp.debug`.

### gulp.task('clean')
By default, the task 'clean' is defined. This clears every file from the `gulp.dirs.build` folder. This tasks also comes in the variants `clean:test` and `clean:dist` to clear the directories `gulp.dirs.test` or `gulp.dirs.dist` respectively.

### gulp.task('deploy')
By default, the task 'deploy' is defined. This moves every file from the `gulp.dirs.build` folder into either `gulp.dirs.test` or `gulp.dirs.dist`, depending on the value of `gulp.debug`.

### _Other features_

_As this tool is currently in a alpha stage, I am also very open to feature requests at this stage. If you want to request a feature, I would prefer it if you did so by creating a test for it and created a pull request for it. If you do this, use 'FR ' + description of your feature as the title of the pull request._

_If you REALLY want a certain feature to get incorporated quickly, you can ofcourse implement it yourself ;) However, I will NOT accept features that aren't accompagnied by their own tests._

## License
[MIT](http://github.com/call-a3/gulp-loader/blob/master/LICENSE)
