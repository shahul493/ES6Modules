module.exports = ->
  console.log JSON.stringify {
    name: gulp.name
    main: gulp.main
    debug: gulp.debug
    dirs: gulp.dirs
  }