/**
 * 模拟的静态服务器
 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const moment = require('moment')
const conf = require('./env');
const Koa = require('koa');
const etag = require('koa-etag');
const serve = require('koa-static');
const Router = require('koa-router');
const proxy = require('koa-proxies');
const favicon = require('koa-favicon');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get');
// const historyFallback = require('koa2-history-api-fallback');
const schedule = require('node-schedule');

// const login = require('./login/login');							// 登录
const api = require('./api/api');												// api

const router = Router();
let app = new Koa();

// 跨域
router.use('*', function (ctx, next) {
	ctx.set('Cache-Control', 'no-cache');
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	next();
});

// 处理请求
app.use(bodyParser());

router.use('/api', api.routes());											// api

app.use(router['routes']());

let opt = {
	publicPath: path.resolve(__dirname, '../dist'),
	index: '/index.html',
	favicon: '/favicon.ico',
	proxy: conf.proxy.target,	// 后台代理地址
	port: conf.port, 					// 访问端口
};

// // http代理转发
// app.use(proxy('/api', {
// 	target: opt.proxy,
// 	changeOrigin: true,
// 	// agent: new httpsProxyAgent('http://1.2.3.4:88'),
// 	// rewrite: path => path.replace(/^\/octocat(\/|\/\w+)?$/, '/vagusx'),
// 	// logs: true
// }));

// gzip压缩
app.use(compress({
	flush: require('zlib').Z_SYNC_FLUSH
}))

// etag缓存控制
app.use(conditional());
app.use(etag());

// HTML5 history api
// app.use(historyFallback());

// favicon
app.use(favicon(opt.publicPath + opt.favicon));

// 静态资源
app.use(serve(opt.publicPath, {extensions: ['html']}));

app.on('error', function(err){
	console.error('server error', err);
});

// 定时器
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, 2, 4];	// 周一, 周三, 周五备份
rule.hour = 23;
rule.minute = 0;
// rule.second = 5

const job = schedule.scheduleJob(rule, () => {
	let date = new Date()
	let source = path.resolve(__dirname, './data/customer.json')
	let target = path.resolve(__dirname, './bak/customer/' + moment(date).format("YYYY-MM-DD") + '.json')
	fs.copyFileSync(source, target);
});

app.listen(opt.port);

console.log('服务器已启动开始监听 :)  浏览器地址栏访问: localhost:' + opt.port);
