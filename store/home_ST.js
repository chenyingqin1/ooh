import Vue from 'vue'
import {getFetch,postFetch} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		isRefresh:false,
		taskList:[],
		FilterList:[],
	},
	mutations: {
		init(state, data){
			
		},
		setTaskList(state, data){
            Vue.set(state, 'taskList', data)
            uni.setStorageSync('taskList', state);
		},
		setFilter(state, data){
            Vue.set(state, 'FilterList', data)
            uni.setStorageSync('FilterList', state);
		},
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		getTaskList(context, data){
			getFetch('spot.task.query', data.parms, (data2) => {
				console.log(data2)
				let val = data2.data;
				context.commit("setTaskList",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		getFilter(context, data){
			getFetch('filter.params.get', data.parms, (data2) => {
				console.log(data2)
				let val = data2.data;
				context.commit("setFilter",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
	},
}