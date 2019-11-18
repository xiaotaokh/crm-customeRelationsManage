const fs = require('fs');
const path = require('path');
const Router = require("koa-router");
const router = Router();

// 获取 数据文件
function getList() {
	let file = fs.readFileSync(path.resolve(__dirname, '../../data/customer.json'), 'utf-8');
	let list = JSON.parse(file.toString());
	return list
}

// 写入 数据文件
function writeList(list) {
	fs.writeFileSync(path.resolve(__dirname, '../../data/customer.json'), list, 'utf-8');
}

router.post('/query', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	let list = getList()
	let data = {
		code: 200,
		message: 'ok',
		data: list.reverse()
	};
	ctx.body = JSON.stringify(data);
});

router.post('/update', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	let list = getList()
	let id = ctx.request.body.id
	let index = list.findIndex(f => f.id === id)
	list[index] = ctx.request.body
	writeList(JSON.stringify(list, 4, 4))
	let data = {
		code: 200,
		message: 'ok',
		data: ctx.request.body
	};
	ctx.body = JSON.stringify(data);
});

router.post('/insert', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	let list = getList()
	let id = list.length + 1
	list.push({
		id: id,
		...ctx.request.body
	})
	writeList(JSON.stringify(list, 4, 4))
	let data = {
		code: 200,
		message: 'ok',
		data: {
			id: id
		}
	};
	ctx.body = JSON.stringify(data);
});

router.post('/delete', function (ctx, next) {
	ctx.set('Content-Type', 'application/json');
	let list = getList()
	let id = ctx.request.body.id
	let index = list.findIndex(f => f.id === id)
	list.splice(index, 1)
	writeList(JSON.stringify(list, 4, 4))
	let data = {
		code: 200,
		message: 'ok',
		data: {}
	};
	ctx.body = JSON.stringify(data);
});

exports = module.exports = router;
