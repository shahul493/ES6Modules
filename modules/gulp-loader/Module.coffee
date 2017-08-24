BuiltinModule = require 'module'
assert = (require 'assert').ok
vm = require 'vm'

NativeModule = do (natives = Object.keys process.binding 'natives') ->
  exists: (name) -> name in natives

wrapper = require './wrapper'
Sandbox = require './Sandbox'

class Module extends BuiltinModule
  require: (path) ->
    assert typeof path is 'string', 'path must be a string'
    assert path, 'missing path'
    
    if path is 'gulp'
      return wrapper
    
    if path is 'gulp-util'
      return wrapper.util
    
    filename = BuiltinModule._resolveFilename path, @
    if NativeModule.exists filename
      return BuiltinModule._load.call @, path, @
    
    cached = BuiltinModule._cache[filename]
    if cached
      return cached.exports
      
    BuiltinModule._cache[filename] = module = new Module(filename, @)
    
    hadException = yes
    try
      module.load filename
      hadException = false
    finally
      if hadException
        delete BuiltinModule._cache[filename]
    
    return module.exports
    
  load: (filename) ->
    BuiltinModule.prototype.load.call @, filename
    
  _compile: (content, filename) ->
    self = @
    content = content.replace /^\#\!.*/, ''
    
    require = (path) ->
      self.require path
    
    require.resolve = (request) ->
      BuiltinModule._resolveFilename request, self
    require.main = process.mainModule
    require.extensions = BuiltinModule._extensions
    require.cache = BuiltinModule._cache
    
    sandbox = new Sandbox({
      filename
      module: self
      require
      imports: {gulp: wrapper}
      })
    
    vm.runInNewContext content, sandbox, filename
    
module.exports = Module