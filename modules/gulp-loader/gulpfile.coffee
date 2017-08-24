path = require 'path'

gulpfile = module

while path.basename(gulpfile?.filename).toLowerCase() isnt 'gulpfile.js'
  if gulpfile.parent?
    gulpfile = gulpfile.parent
  else
    break

module.exports = gulpfile