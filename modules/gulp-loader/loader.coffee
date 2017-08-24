fs   = require 'fs'
path = require 'path'
gulp = require './wrapper'
Module = require './Module'
gulpfile = require './gulpfile'

module.exports = ({folder, gulp}) ->
  folder = path.resolve folder
  gulp.util.log 'Loading tasks from '+ (gulp.util.colors.magenta folder)
  try
    files = fs.readdirSync folder
    files.forEach (relative) ->
      try
        file = path.resolve folder, relative
        if fs.statSync(file).isFile()
          ext = path.extname file
          name = path.basename file, ext
          if ext is '.js' or /\.((lit)?coffee|coffee\.md)$/.test file
            gulp.util.log 'Found task \'' + (gulp.util.colors.cyan name) + '\''
            try
              taskModule = new Module(file, gulpfile)
              taskModule.load file
              task = taskModule.exports
              gulp.task name, task.dependencies ? [], task
            catch ex
              gulp.task name, [], () ->
                position = ex.stack.split('\n')[1].trim()
                
                gulp.util.log [
                  gulp.util.colors.red(ex.name + ': ' + ex.message)
                  ' in task \''
                  gulp.util.colors.cyan name
                  '\' '
                  position
                ].join ''
                throw ex
      catch ex
        throw new gulp.util.PluginError 'gulp-tasks', ex
  catch ex
    throw new gulp.util.PluginError 'gulp-tasks', ex
  return gulp