const Router = require("koa-router");
const router = Router();
// const alarmProcess = require('../security/alarm/alarmProcess')

router.post('/action', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	var data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

// router.use('/alarm', alarmProcess.routes());
exports = module.exports = router;
