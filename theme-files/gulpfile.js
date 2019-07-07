// Modules
var gulp = require("gulp");
var gulpif = require("gulp-if");
var livereload = require("gulp-livereload");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpackRun = webpack(webpackConfig);
var webpackAdminConfig = require("./admin-webpack.config");
var webpackAdminRun = webpack(webpackAdminConfig);
var sass = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var gcmq = require("gulp-group-css-media-queries");
var concat = require("gulp-concat");
var minifyCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var imageminPngquant = require("imagemin-pngquant");
var imageminZopfli = require("imagemin-zopfli");
var imageminMozjpeg = require("imagemin-mozjpeg"); //need to run 'brew install libpng'
var imageminGiflossy = require("imagemin-giflossy");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var uncss = require("gulp-uncss");
var jsonfile = require("jsonfile");

// File locations
var themeRoot = "";
var sassFiles = `src/scss/**/*.scss`;
var sassMainFile = `src/scss/style.scss`;
var adminSassMainFile = `src/scss/admin.scss`;
var cssDestination = `${themeRoot}`;
var adminCssDestination = `${themeRoot}`;
var jsDestination = `${themeRoot}/js/main`;
var adminJsDestination = `${themeRoot}/js/admin`;
var jsFiles = `src/js/**/*.js`;
var images = `src/images/**/*.+(png|jpg|gif|svg)`;
var imagesDestination = `${themeRoot}/images`;
var phpFiles = `${themeRoot}/**/*.php`;

// clean js folder
gulp.task("cleanJs", function() {
    return gulp
        .src(jsDestination, {
            read: false
        })
        .pipe(clean());
});

// clean admin js folder
gulp.task("cleanAdminJs", function() {
    return gulp
        .src(adminJsDestination, {
            read: false
        })
        .pipe(clean());
});

// updateCacheBusting
gulp.task("updateCacheBusting", function() {
    var filepath = "wp-content/themes/myracing-new/cache-busting.json";
    var object;

    jsonfile.readFile(filepath, function(error, obj) {
        if (error) console.log(error);

        var css =
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);

        var js =
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);

        obj["js"] = js;
        obj["css"] = css;

        jsonfile.writeFile(filepath, obj, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("js ", "hash set to", js);
                console.log("css ", "hash set to", css);
            }
        });
    });
});

// Webpack
gulp.task("webpack", ["cleanJs"], function(done) {
    webpackRun.run(function(err, stats) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log(stats.toString());
            livereload.reload();
        }
        done();
    });
});

// Webpack Admin
gulp.task("webpack-admin", ["cleanAdminJs"], function(done) {
    webpackAdminRun.run(function(err, stats) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log(stats.toString());
            livereload.reload();
        }
        done();
    });
});

// SASS to CSS
gulp.task("sass", function() {
    return gulp
        .src(sassMainFile)
        .pipe(sass())
        .on("error", err => {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(prefix("last 3 versions"))
        .pipe(concat("style.css"))
        .pipe(gcmq())
        .pipe(minifyCSS())
        .pipe(gulp.dest(cssDestination))
        .pipe(livereload());
});

// Admin SASS to CSS
gulp.task("adminSass", function() {
    return gulp
        .src(adminSassMainFile)
        .pipe(sass())
        .on("error", err => {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(prefix("last 3 versions"))
        .pipe(concat("admin.css"))
        .pipe(gcmq())
        .pipe(minifyCSS())
        .pipe(gulp.dest(adminCssDestination))
        .pipe(livereload());
});

// Admin SASS to CSS
gulp.task("ampSass", function() {
    return gulp
        .src(ampSassMainFile)
        .pipe(sass())
        .on("error", err => {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(prefix("last 3 versions"))
        .pipe(concat("amp.css"))
        .pipe(gcmq())
        .pipe(
            uncss({
                html: [
                    "amp-test-html/1.html",
                    "amp-test-html/2.html",
                    "amp-test-html/3.html",
                    "amp-test-html/4.html",
                    "amp-test-html/5.html",
                    "amp-test-html/6.html"
                ]
            })
        )
        .pipe(minifyCSS())
        .pipe(rename("amp.php"))
        .pipe(gulp.dest(ampCssDestination))
        .pipe(livereload());
});

// reload on PHP change
gulp.task("reload", () => {
    livereload.reload();
});

// Image optimization
gulp.task("images", function() {
    return gulp
        .src(images)
        .pipe(
            cache(
                imagemin([
                    //png
                    imageminPngquant({
                        speed: 1,
                        quality: 98
                    }),
                    imageminZopfli({
                        more: true
                    }),
                    //gif
                    imagemin.gifsicle({
                        interlaced: true,
                        optimizationLevel: 3
                    }),
                    imageminGiflossy({
                        optimizationLevel: 3,
                        optimize: 3,
                        lossy: 2
                    }),
                    //svg
                    imagemin.svgo({
                        plugins: [
                            {
                                removeViewBox: false
                            }
                        ]
                    }),
                    //jpg lossless
                    imagemin.jpegtran({
                        progressive: true
                    }),
                    //jpg
                    imageminMozjpeg({
                        quality: 90
                    })
                ])
            )
        )
        .pipe(gulp.dest(imagesDestination));
});

// watch command
gulp.task("default", ["updateCacheBusting", "sass", "webpack"], function() {
    livereload.listen({
        start: true
    });
    gulp.watch(sassFiles, ["sass"]);
    gulp.watch(jsFiles, ["webpack"]);
    gulp.watch(images, ["images"]);
    gulp.watch(phpFiles, ["reload"]);
});

// admin watch command
gulp.task(
    "admin",
    ["updateCacheBusting", "adminSass", "webpack-admin"],
    function() {
        livereload.listen({
            start: true
        });
        gulp.watch(sassFiles, ["adminSass"]);
        gulp.watch(jsFiles, ["webpack-admin"]);
        gulp.watch(phpFiles, ["reload"]);
    }
);

// amp watch command
gulp.task("amp", ["ampSass"], function() {
    livereload.listen({
        start: true
    });
    gulp.watch(sassFiles, ["ampSass"]);
    gulp.watch(phpFiles, ["reload"]);
});

// Build
gulp.task("build", [
    "sass",
    "adminSass",
    "ampSass",
    "webpack",
    "webpack-admin"
]);
