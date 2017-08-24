check = (bool, message) ->
  if bool
    gulp.util.log 'yes ' + message
  else
    gulp.util.log 'no ' + message
  
module.exports = (done) ->
  check (typeof require is 'function'),
    'require should be a function'
  check (typeof require.resolve is 'function'),
    'require.resolve should be a function'
  check (require.main == process.mainModule),
    'main should be a process.mainModule'
  check (typeof require.extensions is 'object'),
    'module.extensions should be an object map'
  check (typeof require.cache is 'object'),
    'module.cache should be an object map'
  done()