path = require 'path'
fs   = require 'fs'
gulpfile = require './gulpfile'

parent = path.dirname gulpfile.filename
filename = path.resolve parent, './package.json'

while not (fs.existsSync(filename) and fs.statSync(filename).isFile())
  parent = path.dirname parent
  filename = path.resolve parent, './package.json'

module.exports = require filename