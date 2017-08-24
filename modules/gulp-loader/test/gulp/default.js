// TASK default

var rename = require('../lib/rename');

module.exports = function() {
	return gulp.src()
      .pipe(rename({
        prefix: "copied-"
      }))
      .pipe(gulp.dest());
};
