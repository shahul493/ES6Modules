var test = require('tape');
var modul = require('../');
var gulp;

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var stream = require('stream');

process.chdir('./test');
exec('mkdir test && mkdir dist && mkdir build');

function checkFile(t, file, msg) {
  try {
    t.ok(fs.statSync(file).isFile(), msg);
  } catch (ex) {
    t.error(ex, msg);
  }
}

function checkImmutable(t, ob, field, alias) {
  var remember = ob[field];
  ob[field] = 'something else';
  t.equal(remember, ob[field], alias + '.' + field + ' should be immutable');
}

test('gulp compliance test', function (t) {
  t.plan(8);

  t.equal(typeof modul, "function", 'plugin should be a function');
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }

  t.equal(typeof gulp.task, "function", 'gulp.task should be a function');
  t.equal(typeof gulp.src, "function", 'gulp.src should be a function');
  t.equal(typeof gulp.src('./**').on, 'function', 'gulp.src(\'./**\') should return a readable stream');
  t.equal(typeof gulp.dest, "function", 'gulp.dest should be a function');
  t.equal(typeof gulp.dest('./').on, 'function', 'gulp.dest(\'./\') should return a writable stream');
  t.equal(typeof gulp.watch, "function", 'gulp.watch should be a function');
  
  exec('mocha --reporter spec gulp-test/test', function(err, stdout, stderr) {
    t.error(err, 'the original gulp tests should not return any errors');
  });
});

test('gulp.src()', function (t) {
  t.plan(1);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }

  t.equal(typeof gulp.src().on, 'function', 'gulp.src() should return a readable stream');
  
});

test('gulp.dest()', function (t) {
  t.plan(1);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }
  
  t.equal(typeof gulp.dest().on, 'function', 'gulp.dest() should return a writable stream');
  
});

test('gulp.name', function (t) {
  t.plan(3);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }
  
  checkImmutable(t, gulp, 'name', 'gulp');
  t.equal(typeof gulp.name, 'string', 'gulp.name should be a string value');
  t.equal(gulp.name, 'gulp-loader-test-0.0.0.js', 'gulp.name should be in accorance with package.json file');
  
});

test('gulp.main', function (t) {
  t.plan(3);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }
  
  checkImmutable(t, gulp, 'main', 'gulp');
  t.equal(typeof gulp.main, 'string', 'gulp.main should be a string value');
  t.equal(gulp.main, 'src/main.js', 'gulp.main should default to src/main.js if "main" is not set in package.json');
  
});

test('gulp.debug', function (t) {
  t.plan(2);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }
  
  checkImmutable(t, gulp, 'debug', 'gulp');
  t.equal(typeof gulp.debug, 'boolean', 'gulp.debug should be a boolean value');
  
});

test('gulp.dirs', function (t) {
  t.plan(13);
  if (typeof gulp === 'undefined') {
    gulp = modul();
  }
  
  checkImmutable(t, gulp, 'dirs', 'gulp');
  
  checkImmutable(t, gulp.dirs, 'source', 'gulp.dirs');
  t.equal(typeof gulp.dirs.source, 'string', 'gulp.dirs.source should be a string value');
  t.equal(gulp.dirs.source, 'src', 'gulp.dirs.source should default to src if the corresponding setting is not set in package.json');
  
  checkImmutable(t, gulp.dirs, 'build', 'gulp.dirs');
  t.equal(typeof gulp.dirs.build, 'string', 'gulp.dirs.build should be a string value');
  t.equal(gulp.dirs.build, 'build', 'gulp.dirs.source should default to build if the corresponding setting is not set in package.json');
  
  checkImmutable(t, gulp.dirs, 'test', 'gulp.dirs');
  t.equal(typeof gulp.dirs.test, 'string', 'gulp.dirs.test should be a string value');
  t.equal(gulp.dirs.test, 'test', 'gulp.dirs.test should default to src if the corresponding setting is not set in package.json');
  
  checkImmutable(t, gulp.dirs, 'dist', 'gulp.dirs');
  t.equal(typeof gulp.dirs.dist, 'string', 'gulp.dirs.dist should be a string value');
  t.equal(gulp.dirs.dist, 'dist', 'gulp.dirs.dist should default to dist if the corresponding setting is not set in package.json');
  
});

test('> gulp clean', function(t) {
  var testFile = './build/not-cleaned';
  fs.open(testFile, 'w', 0666, function(err, fd) {
    if (err) t.fail('Couldn\'t create file to test clean task.');
    
    var buffer = new Buffer('something');
    
    fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
      if (err) t.fail('Couldn\'t write to file');
      
      exec('gulp clean', function(err, stdout, stderr) {
        t.plan(2);
        fs.exists(testFile, function(exists) {
          t.notOk(exists, 'File should no longer exist after clean is executed');
        });
        fs.exists(path.dirname(testFile), function(exists) {
          t.ok(exists, 'Folder should still exist after clean is executed');
        });
      });
    });
  });
});

test('> gulp clean:test', function(t) {
  var testFile = './test/not-cleaned';
  fs.open(testFile, 'w', 0666, function(err, fd) {
    if (err) t.fail('Couldn\'t create file to test clean task.');
    
    var buffer = new Buffer('something');
    
    fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
      if (err) t.fail('Couldn\'t write to file');
      
      exec('gulp clean:test', function(err, stdout, stderr) {
        t.plan(2);
        fs.exists(testFile, function(exists) {
          t.notOk(exists, 'File should no longer exist after clean is executed');
        });
        fs.exists(path.dirname(testFile), function(exists) {
          t.ok(exists, 'Folder should still exist after clean is executed');
        });
      });
    });
  });
});

test('> gulp clean:dist', function(t) {
  var testFile = './dist/not-cleaned';
  fs.open(testFile, 'w', 0666, function(err, fd) {
    if (err) t.fail('Couldn\'t create file to test clean task.');
    
    var buffer = new Buffer('something');
    
    fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
      if (err) t.fail('Couldn\'t write to file');
      
      exec('gulp clean:dist', function(err, stdout, stderr) {
        t.plan(2);
        fs.exists(testFile, function(exists) {
          t.notOk(exists, 'File should no longer exist after clean is executed');
        });
        fs.exists(path.dirname(testFile), function(exists) {
          t.ok(exists, 'Folder should still exist after clean is executed');
        });
      });
    });
  });
});

test('> gulp [default]', function(t) {  
  fs.exists('./src/dummy.js', function(exists) {
    if (!exists)  {
      t.fail('Cannot perform test if source file is not present');
    } else {
      t.plan(4);
      exec('gulp clean', function(err, stdout, stderr) {
        t.error(err, '\'gulp clean\' should execute without errors');
        fs.exists('./build/copied-dummy.js', function(exists) {
          t.notOk(exists, 'File should not exist after cleanup');

          exec('gulp', function(err, stdout, stderr) {
            t.error(err, '\'gulp\' should execute without errors');

            checkFile(t, './build/copied-dummy.js', 'gulp should have copied file to build dir');
          });
        });
      });
    }
  });
});

test('> gulp deploy', function(t) {  
  fs.exists('./build/copied-dummy.js', function(exists) {
    if (!exists)  {
      t.fail('Cannot perform test if built file is not present');
      t.end();
    } else {
      t.plan(4);
      exec('gulp clean:test', function(err, stdout, stderr) {
        t.error(err, '\'gulp clean:test\' should execute without errors');
        fs.exists('./test/copied-dummy.js', function(exists) {
          t.notOk(exists, 'File should not exist after cleanup');

          exec('gulp deploy', function(err, stdout, stderr) {
            t.error(err, '\'gulp deploy\' should execute without errors');

            checkFile(t, './test/copied-dummy.js', 'gulp should have copied file to test dir');
          });
        });
      });
    }
  });
});

test('> gulp --target=production deploy', function(t) {  
  fs.exists('./build/copied-dummy.js', function(exists) {
    if (!exists)  {
      t.fail('Cannot perform test if built file is not present');
      t.end();
    } else {
      t.plan(4);
      exec('gulp clean:dist', function(err, stdout, stderr) {
        t.error(err, '\'gulp clean:dist\' should execute without errors');
        fs.exists('./dist/copied-dummy.js', function(exists) {
          t.notOk(exists, 'File should not exist after cleanup');

          exec('gulp --target=production deploy', function(err, stdout, stderr) {
            t.error(err, '\'gulp --target=production deploy\' should execute without errors');

            checkFile(t, './dist/copied-dummy.js', 'gulp should have copied file to dist dir');
          });
        });
      });
    }
  });
});

test('robustness test', function (t) {
  t.plan(2);
  
  try {
    var gulp = modul();
    t.pass('Could load gulp-loader even though some tasks contained syntax errors');
  } catch (e) {
    t.fail('tasks shouldn\'t fail to load even though one of them contains an error');
  }

  exec('gulp dependency-error', function (error, stdout, stderr) {
    t.ok(error instanceof Error, 'gulp command should throw en error');
  });

});

test('coffeescript test', function (t) {
  t.plan(2);

  exec('gulp coffee', function (error, stdout, stderr) {
    t.error(error, 'gulp command should execute without errors');
    t.ok(stdout.match(/\n\[(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]\] yes\n/), 'coffeescript task should execute without problems');
  });

});

test('configurability test', function(t) {
  t.plan(8);
  
  exec('gulp', {cwd: path.resolve('./settings')}, function (error, stdout, stderr) {
    
    t.error(error, 'gulp command should execute without errors');
    var match = stdout.match(/\n{[^\n]*\n/);
    t.ok(match, 'coffeescript task should execute without problems');
    var dump = JSON.parse(match[0].trim());
    
    t.equal(dump.main, 'index.js', 'gulp.main should match the setting in package.json');
    t.equal(dump.name, 'gulp-loader-test-settings@0.0.1.coffee', 'gulp.name should be according to the settings in package.json');
    
    t.equal(dump.dirs.source, '.', 'gulp.dirs.source should match the setting in package.json');
    t.equal(dump.dirs.build, 'tmp', 'gulp.dirs.build should match the setting in package.json');
    t.equal(dump.dirs.test, 'debug', 'gulp.dirs.test should match the setting in package.json');
    t.equal(dump.dirs.dist, 'production', 'gulp.dirs.dist should match the setting in package.json');
  });
});

test('module shim test', function (t) {
  t.plan(6);

  exec('gulp check-module-shim', function (error, stdout, stderr) {
    t.error(error, 'gulp command should execute without errors');
    var actualOutput = false;
    stdout.split('\n').forEach(function(line) {
      if (line.match(/\[(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]\] Starting 'check-module-shim'.../)) {
        actualOutput = true;
      } else if (actualOutput) {
        if (line.match(/\[(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]\] Finished 'check-module-shim' after [^\n]*/)) {
          actualOutput = false;
        } else {
          var m = line.match(/\[(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]\] ((yes)|(no)) ([^\n]*)/);
          if (m) {
            t.equal(m[4], 'yes', m[7]);
          }
        }
      }
    });
  });

});