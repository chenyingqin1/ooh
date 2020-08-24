import Vue from 'vue'
import {getFetch,postFetch} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		systemInfo:{},
		userLogin:{},
	},
	mutations: {
		init(state, data){
			
		},
		setUserLogin(state, data){
            Vue.set(state, 'userLogin', data)
            uni.setStorageSync('userLogin', state);
		}
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		getUserLogin(context, data){
			getFetch('user.login', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setUserLogin",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 用户设置缓存模式
		setCaptureCacheMode(context, data){
			getFetch('user.setCaptureCacheMode', data.parms, (data2) => {
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		}
	},
}