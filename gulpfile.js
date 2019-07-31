// 依赖定义
const { watch, dest, src, series, parallel } = require('gulp');
const browserSync = require('browser-sync');
const reload      = browserSync.reload;
const typescript  = require('gulp-typescript');
const babel       = require('gulp-babel');
const sass        = require('gulp-ruby-sass');
const rename      = require('gulp-rename');
const uglify      = require('gulp-uglify');
const minify      = require('gulp-minify-css');

// 定义配置
const CONF = {
    prod : false && 'production' === process.env.NODE_ENV ? true : false,
    path : {
        base  : './src/',
        dist  : './dist/',
        style : 'style/',
        script: 'script/',
    },
    file : {
        html  : '**/*.html',
        css   : '**/*.css',
        minCss: '**/*.min.css',
        srcCss: '**/*.scss',
        js    : '**/*.js',
        minJs : '**/*.min.js',
        srcJs : '**/*.js',
        srcTs : '**/*.ts',
        min   : '.min',
        img   : '**/(*.jpg|*.jpeg|*.png|*.gif|*.webp)',
    },
};

// 任务定义
exports.default  = series(
    parallel(taskCompileSass, taskCompileTs),
    parallel(taskCssMinify, taskJsMinify),
    taskCopyFile,
    taskServer,
    taskLivereload,
    taskWatch,
    taskDefault,
);
exports.ts       = series(taskCompileTs, taskJsMinify);
exports.compile  = parallel(taskCompileSass, taskCompileTs);
exports.compress = parallel(taskCssMinify, taskJsMinify);
exports.watchcss = series(taskCompileSass, taskCssMinify);
exports.run      = taskServer;
exports.test     = taskWatch;
exports.build    = series(
    parallel(taskCompileSass, taskCompileTs),
    parallel(taskCssMinify, taskJsMinify),
    taskCopyFile,
);

// 任务列表
function taskDefault(cb) {
    console.log('--- Complete!');
    cb();
}

function taskServer(cb) {
    console.log('--- Server Start...');

    browserSync({
        server: {
            baseDir: CONF.path.dist
        },
        port: 80,
    });

    cb();
}

function taskLivereload(cb) {
    console.log('--- Livereload Start...');

    watch([
        CONF.file.html,
        CONF.file.minCss,
        CONF.file.minJs,
        CONF.file.img
    ], {cwd: CONF.path.dist}, function(cb) {
        setTimeout(reload, 1000);
        // reload();
        cb();
    });

    cb();
}

function taskWatch(cb) {
    console.log('--- Watch Start...');

    watch(CONF.path.style + CONF.file.srcCss, {cwd: CONF.path.base}, series(taskCompileSass, taskCssMinify));
    watch(CONF.path.script + CONF.file.srcTs, {cwd: CONF.path.base}, series(taskCompileTs, taskJsMinify));
    watch(CONF.file.html, {cwd: CONF.path.base}, taskCopyFile);

    cb();
}

function taskCompileTs(cb) {
    console.log('--- Compile Typesctipt...');

    src(CONF.path.base + CONF.path.script + CONF.file.srcTs)
        .pipe(typescript({
            // module: 'commonJs',
            target: 'es2015',
            sourceMap: true,
            noImplicitAny: true,
            removeComments: true,
        }))
        .pipe(dest(CONF.path.dist + CONF.path.script));
    src(CONF.path.base + CONF.path.script + CONF.file.js)
        .pipe(dest(CONF.path.dist + CONF.path.script));

    cb();
}

function taskJsMinify(cb) {
    console.log('--- Compress JS...');

    if(CONF.prod) {
        src([CONF.path.script + CONF.file.js, '!'+ CONF.path.script + CONF.file.minJs], {cwd: CONF.path.dist})
            // .pipe(babel({
            //     babelrc: false,
            //     presets: ['es2015'],
            //     comments: false,
            // }))
            .pipe(uglify())
            .pipe(rename({ suffix: CONF.file.min }))
            .pipe(dest(CONF.path.dist + CONF.path.script));
    }else {
        src([CONF.path.script + CONF.file.js, '!'+ CONF.path.script + CONF.file.minJs], {cwd: CONF.path.dist})
            .pipe(rename({ suffix: CONF.file.min }))
            .pipe(dest(CONF.path.dist + CONF.path.script));
    }

    cb();
}

function taskCompileSass(cb) {
    console.log('--- Compile Sass...');

    sass(CONF.path.base + CONF.path.style + CONF.file.srcCss)
        .pipe(dest(CONF.path.dist + CONF.path.style));

    cb();
}

function taskCssMinify(cb) {
    console.log('--- Compress CSS...');

    if(CONF.prod) {
        src([
            CONF.path.style + CONF.file.css,
            '!'+ CONF.path.style + CONF.file.minCss
        ], {cwd: CONF.path.dist})
            .pipe(minify({
                keepSpecialComments: '*'
            }))
            .pipe(rename({ suffix: CONF.file.min }))
            .pipe(dest(CONF.path.dist + CONF.path.style));
    }else {
        src([
            CONF.path.style + CONF.file.css,
            '!'+ CONF.path.style + CONF.file.minCss
        ], {cwd: CONF.path.dist})
            .pipe(rename({ suffix: CONF.file.min /* extname: '.min.css' */ }))
            .pipe(dest(CONF.path.dist + CONF.path.style));
    }

    cb();
}

function taskCopyFile(cb) {
    console.log('--- Copy Files...');

    src([
        CONF.file.html,
        CONF.file.img
    ], {cwd: CONF.path.base})
        .pipe(dest(CONF.path.dist));

    cb();
}
