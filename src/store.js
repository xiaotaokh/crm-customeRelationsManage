import Vue from 'vue'
import Vuex from 'vuex'
import localStore from 'store'		// 浏览器存储

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {},
	},
	mutations: {
		// 登录的个人信息
		user(state, params) {
			localStore.set('user', params);
			state.user = params;
		}
	},
	actions: {},
	getters: {
		// 登录的个人信息
		user: (state) => {
			return state.user || localStore.get('user')
		}
	}
})
