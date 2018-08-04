# Grunt 常用插件

> 本案例用到的插件

- grunt-contrib-concat (文件合并)
- grunt-contrib-uglify　(js压缩)
- grunt-contrib-jsHint (js语法检查)
- grunt-contrib-cssmin (css压缩)
- grunt-contrib-watch (自动化更新)

> 本案例没用到的插件

- grunt-contrib-clean
- grunt-contrib-copy
- grunt-contrib-imagemin

## 热加载

> 本案例用到的插件

- grunt-contrib-connect
- connect-livereload
- serve-index
- serve-static

```javascript
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
```

```javascript
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
```

```javascript
connect: {
    options: {
        // 服务器端口号
        port: 9000,
        // 服务器地址
        hostname: 'localhost',
        // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard
        base: '.'
    },
    livereload: {
        options: {
            // 通过LiveReload脚本，让页面重新加载。
            middleware: lrMiddleware
        }
    }
},
```

```javascript
watch: {
    client: {
        files: ['src/js/*.js', 'src/css/*.css', 'src/*.html'],
        options: {
            livereload: lrPort
        }
    },
}
```

##　项目执行
`npm run dev`