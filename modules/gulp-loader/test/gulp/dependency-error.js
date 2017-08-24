// TASK dependency-error

var faulty = require('../lib/syntax-error');
var rename = require('../lib/rename');

module.exports = function() {
	return gulp.src()
      .pipe(rename(faulty('shouldnt-exist.js')))
      .pipe(gulp.dest());
};
