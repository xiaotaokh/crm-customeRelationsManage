const Router = require("koa-router");
const router = Router();
const customer = require('./customer/customer')

router.post('/action', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	var data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

// 登录
router.post('/login', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	var data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

// 注销
router.post('/logout', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	var data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

// 客户管理
router.post('/customer', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	var data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

router.use('/customer', customer.routes());

exports = module.exports = router;
