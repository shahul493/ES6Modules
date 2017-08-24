var run = function(exports, require, module, __filename, __dirname) {
  module.exports = function(something) {
    return something;
  };
};
// this return statement is tolerated by node, but not by replacement require function
// therefore, it should be detected as a syntax error
return run(exports, require, module, __filename, __dirname);