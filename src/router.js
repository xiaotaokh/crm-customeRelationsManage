import Vue from 'vue'
import store from './store'
import Router from 'vue-router'

Vue.use(Router);

// test 测试页面
import Demo from './views/demo'
import DemoFilter from './views/demo/filter'
import DemoRequest from './views/demo/request'
import DemoChart from './views/demo/chart'
import DemoDialog from './views/demo/dialog'

// 根页面
import main from '@/views/main.vue'
import empty from '@/views/empty.vue'

// 登录
const login = resolve => require(['@/views/login/login.vue'], resolve);

// 错误页面
const page404 = resolve => require(['@/views/common/page-404.vue'], resolve);
const page403 = resolve => require(['@/views/common/page-403.vue'], resolve);
const page500 = resolve => require(['@/views/common/page-500.vue'], resolve);

// 事件中心
const customer = resolve => require(['@/views/customer/customer.vue'], resolve);

const router = new Router({
	routes: [
		{
			path: '/', redirect: '/login', name: '/'
		},
		{
			path: '/main', name: 'main', component: main,
			children: [
				{
					path: '/', redirect: 'customer',
				},
				// 客户管理
				{
					path: 'customer', name: 'customer', component: customer, meta: {name: '客户管理'},
				}
			]
		},
		{
			path: '*', component: page404
		},
		{
			path: '/login', name: 'login', component: login
		},
		{
			path: '/404', name: 'page-404', component: page404
		},
		{
			path: '/403', name: 'page-403', component: page403
		},
		{
			path: '/500', name: 'page-500', component: page500
		},
		{
			path: '/demo', name: 'demo', component: Demo,
			children: [
				{
					path: 'filter', name: 'demo.filter', component: DemoFilter
				},
				{
					path: 'request', name: 'demo.request', component: DemoRequest
				},
				{
					path: 'chart', name: 'demo.chart', component: DemoChart
				},
				{
					path: 'dialog', name: 'demo.dialog', component: DemoDialog
				},
			]
		}
	]
});

// 被忽略的路由地址
const ignore = [
	'/', 'login', 'page-404', 'page-403', 'page-500',
	'demo', 'demo.filter', 'demo.request', 'demo.chart', 'demo.dialog'
]

/**
 * 主要用来拦截路由的钩子
 * @param to Route: 即将要进入的目标 路由对象
 * @param from: Route: 当前导航正要离开的路由
 * @param next: Function: 一定要调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
	// // 控制页面权限
	// // @特殊处理, 过滤无关路由, 可以显示的路由, 权限内的路由
	// let permission = Vue.prototype.localStore.get("permission") || store.state.permission;
	// let per = permission[to.name]
	// if (ignore.indexOf(to.name) !== -1 || to.meta.show || per && per.query) {
	// 	next();
	// } else {
	// 	if (!to.name) {
	// 		router.push({name: 'page-404'});
	// 	} else {
	// 		router.push({name: 'page-403'});
	// 	}
	// }
	next()
});

export default router
