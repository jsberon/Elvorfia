const gulp = require('gulp');
const jsonlint = require('gulp-jsonlint');
const prettier = require('gulp-prettier');
const eslint = require("gulp-eslint");
const eslintIfFixed = require('gulp-eslint-if-fixed');

/**
 * Gulp Configuration JSON
 */
const config = {
    paths: {
        json: 'app_elvorfia/**/*.json',
        scripts: {
            client: 'app_elvorfia/static/javascripts/**/*.js',
            server: ['app_elvorfia/routes/**/*.js', 'app_elvorfia/scripts/**/*.js'],
        },
        stylesheets: 'app_elvorfia/static/stylesheets/**/*.scss',
        views: 'app_elvorfia/views/**/*.hbs',
    },
};

/* Gulp Task Utility functions */

const jsonlintTask = function() {
    return gulp
        .src(config.paths.json)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
};

const prettierHtml = function(source) {
    return gulp
        .src(source, { base: './' })
        .pipe(
            prettier({
                parser: 'html',
                singleQuote: true,
                tabWidth: 4,
                printWidth: 1000,
            }),
        )
        .pipe(gulp.dest('./'));
};

const prettierBabel = function(source) {
    return gulp
        .src(source, { base: './' })
        .pipe(
            prettier({
                parser: 'babel',
                singleQuote: true,
                tabWidth: 4,
                printWidth: 1000,
                trailingComma: 'all',
            }),
        )
        .pipe(gulp.dest('./'));
};

const prettierScss = function(source) {
    return gulp
        .src(source, { base: './' })
        .pipe(
            prettier({
                parser: 'scss',
                singleQuote: true,
                tabWidth: 4,
                printWidth: 1000,
            }),
        )
        .pipe(gulp.dest('./'));
};

const prettierScriptsServerTask = function() {
    return prettierBabel(config.paths.scripts.server);
};

const prettierScriptsClientTask = function() {
    return prettierBabel(config.paths.scripts.client);
};

const prettierViewsTask = function() {
    return prettierHtml(config.paths.views);
};

const prettierStylesheetsTask = function() {
    return prettierScss(config.paths.stylesheets);
};

const prettierScriptsTask = gulp.parallel(prettierScriptsServerTask, prettierScriptsClientTask);
const prettierTask = gulp.parallel(prettierViewsTask, prettierScriptsTask, prettierStylesheetsTask);

const eslintFunction = function(source, toggleFix) {
    var blob = gulp.src(source)
        .pipe(eslint())
        .pipe(eslint.format());
    if (toggleFix) {
        blob.pipe(eslintIfFixed(function(file) {
            return file.base;
        }));
	} else {
		blob.pipe(eslint.failAfterError());
	}
    return blob;
}

const eslintServerTask = function() {
    return eslintFunction(config.paths.scripts.server, false);
};

const eslintClientTask = function() {
    return eslintFunction(config.paths.scripts.client, false);
};

const eslintServerFixTask = function() {
    return eslintFunction(config.paths.scripts.server, true);
};

const eslintClientFixTask = function() {
    return eslintFunction(config.paths.scripts.client, true);
};

const eslintTask = gulp.parallel(eslintServerTask, eslintClientTask);
const eslintFixTask = gulp.parallel(eslintServerFixTask, eslintClientFixTask);

/* Gulp Task Definition */

gulp.task('jsonlint', jsonlintTask);

gulp.task('prettier', prettierTask);
gulp.task('prettier-scripts', prettierScriptsTask);
gulp.task('prettier-scripts-server', prettierScriptsServerTask);
gulp.task('prettier-scripts-client', prettierScriptsClientTask);
gulp.task('prettier-views', prettierViewsTask);
gulp.task('prettier-stylesheets', prettierStylesheetsTask);

gulp.task('eslint', eslintTask);
gulp.task('eslint-fix', eslintFixTask);
gulp.task('eslint-server', eslintServerTask);
gulp.task('eslint-server-fix', eslintServerFixTask);
gulp.task('eslint-client', eslintClientTask);
gulp.task('eslint-client-fix', eslintClientFixTask);

gulp.task('default', gulp.series(prettierTask, gulp.parallel(jsonlintTask, eslintTask)));
