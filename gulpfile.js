function cleanDist() {
    return del("dist");
}


function images() {
    return src("src/images/**/*")
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest("dist/images"));
}


function scripts() {
    return src([
        "src/js/script.js",
    ])
        .pipe(webpack({
            // Any configuration options...
        }))
        .pipe(babel({
            presets: ["@babel/preset-env"]
          }))
        .pipe(concat("script.min.js"))
        .pipe(uglify())
        .pipe(dest("src/js"))
        .pipe(browserSync.stream());
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

function styles() {
    return src("src/scss/style.scss")
        .pipe(scss({outputStyle: "compressed", importer: tildeImporter}))
        .pipe(concat("style.min.css"))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 10 version"]
        }))
        .pipe(dest("src/css"))
        .pipe(browserSync.stream());
}

function watching() {
    watch(["src/scss/**/*.scss"], styles);
    watch(["src/*.html"]).on("change",browserSync.reload);
    watch(["src/js/**/*.js", "!src/js/script.min.js"],scripts);
}


exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;
exports.images = images;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts ,browsersync, watching);