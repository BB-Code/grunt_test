var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
module.exports = function (grunt) {
    // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    // 使用connect-livereload模块，生成一个与LiveReload脚本
    // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
    var lrMiddleware = function (connect, options) {
        return [
            // 把脚本，注入到静态文件中
            lrSnippet,
            // 静态文件服务器的路径
            serveStatic(options.base[0]),
            // 启用目录浏览(相当于IIS中的目录浏览)
            serveIndex(options.base[0])
        ];
    };
    // Project configuration.
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/built.js',
            },
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'dist/js/built.min.js': ['dist/js/built.js']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/js/*.js']
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/built.css': ['src/css/*.css']
                }
            }
        },
        connect: {
            options: {
                // 服务器端口号
                port: 8000,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                hostname: 'localhost',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: '.'
            },
            livereload: {
                options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: lrMiddleware
                }
            }
        },
        watch: {
            client: {
                files: ['src/js/*.js', 'src/css/*.css', 'src/*.html'],
                options: {
                    livereload: lrPort
                }
            },
            scripts: {
                files: ['src/js/*.js', 'src/css/*.css'],
                tasks: ['concat', 'uglify', 'jshint', 'cssmin'],
                options: {
                    spawn: false,//变量更新(false效率高，部分更新) true全量更新
                },
            }
        },
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // 默认被执行的任务列表，同步执行任务，注意执行命令的顺序
    grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'cssmin']);
    grunt.registerTask('mywatch', ['default', 'connect', 'watch']);

};
