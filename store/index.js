import Vue from 'vue'
import Vuex from 'vuex'

import userLogin from './userLogin_ST.js'
import home from './home_ST.js'
import myList from './myList_ST.js'
import speed from './speed_ST.js'
import details from './details_ST.js'
Vue.use(Vuex)

let store = new Vuex.Store({
	state: {
		
	},
	modules: {
		userLogin,
		home,
		myList,
		speed,
		details
	},
	mutations: {
		
	},
	actions: {
		
	}
})
store.dispatch("userLogin/init")
store.dispatch("home/init")
store.dispatch("myList/init")
store.dispatch("speed/init")
store.dispatch("details/init")
export default store
