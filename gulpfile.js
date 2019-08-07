// 依赖定义
const { watch, dest, src, series, parallel } = require('gulp');
const browserSync = require('browser-sync');
const reload      = browserSync.reload;
const browserify  = require('browserify');
const source      = require('vinyl-source-stream');
const tsify       = require('tsify');
const babel       = require('gulp-babel');
const buffer      = require('gulp-buffer');
const minify      = require('gulp-clean-css');
const rename      = require('gulp-rename');
const sass        = require('gulp-sass');
const uglify      = require('gulp-uglify-es').default;

// 定义配置
const CONF = {
    prod : false && 'production' === process.env.NODE_ENV ? true : false,
    path : {
        base  : './src/',
        dist  : './dist/',
        script: 'script/',
        style : 'style/',
    },
    file : {
        entrance: 'excel',
        srcJs : ['**/*.ts', '**/*.js'], // , '!**/*.min.js'
		srcCss: '**/*.scss',
        js    : '**/*.min.js',
		css   : '**/*.min.css',
		min   : '.min',
		img   : '**/(*.jpg|*.jpeg|*.png|*.gif|*.webp)',
		html  : '**/*.html',
    },
};

// 任务定义
exports.default  = series(
    parallel(taskCompileSass, taskCompileTs),
    taskCopyFile,
    taskServer,
    taskLivereload,
    taskWatch,
    taskDefault,
);
exports.ts       = taskCompileTs;
exports.css      = taskCompileSass;
exports.compile  = parallel(taskCompileSass, taskCompileTs);
exports.run      = taskServer;
exports.test     = taskWatch;
exports.build    = series(
    parallel(taskCompileSass, taskCompileTs),
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
        CONF.file.css,
        CONF.file.html,
        CONF.file.img,
        CONF.file.js,
    ], {cwd: CONF.path.dist}).on('change', reload);

    cb();
}

function taskWatch(cb) {
    console.log('--- Watch Start...');

    watch(CONF.file.srcCss, {cwd: CONF.path.base}, taskCompileSass);
    watch(CONF.file.srcJs, {cwd: CONF.path.base}, taskCompileTs);
    watch(CONF.file.html, {cwd: CONF.path.base}, taskCopyFile);

    cb();
}

function taskCompileTs() {
    console.log('--- Compile Typesctipt...');

    let stream = browserify({
            basedir     : CONF.path.base,
            entries     : [`${CONF.path.script}${CONF.file.entrance}.ts`],
            standalone  : CONF.file.entrance,
            debug       : !CONF.prod,
        })
        .plugin(tsify, {
            target        : 'es2015',
            noImplicitAny : true,
            removeComments: true,
        })
        .transform('babelify', {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
                    },
                }],
            ]
        })
        .bundle()
        .pipe(source(`${CONF.file.entrance}${CONF.file.min}.js`));

    if(CONF.prod)
        stream
            .pipe(buffer())
            .pipe(uglify());

    stream
        // .pipe(rename({ suffix: CONF.file.min }))
        .pipe(dest(CONF.path.script, {cwd: CONF.path.dist}));

    return stream;
}

function taskCompileSass() {
    console.log('--- Compile Sass...');

    let stream = src(CONF.file.srcCss, {cwd: CONF.path.base + CONF.path.style})
        .pipe(sass());

    if(CONF.prod) stream.pipe(minify());

    stream
        .pipe(rename({ suffix: CONF.file.min }))
        .pipe(dest(CONF.path.style, {cwd: CONF.path.dist}));

    return stream;
}

function taskCopyFile(cb) {
    console.log('--- Copy Files...');

    return src([
        CONF.file.html,
        CONF.file.img,
    ], {cwd: CONF.path.base})
        .pipe(dest(CONF.path.dist));
}
