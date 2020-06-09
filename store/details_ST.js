import Vue from 'vue'
import {getFetch,postFetch} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		taskDetailInfo:{},
	},
	mutations: {
		init(state, data){
			
		},
		setTaskDetail(state, data){
            Vue.set(state, 'taskDetailInfo', data)
            uni.setStorageSync('taskDetailInfo', state);
		}
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		getTaskDetail(context, data){
			getFetch('task.detail.query', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setTaskDetail",val);
				if(data.callback){
					data.callback(val);
				}
			});
		}
	},
}