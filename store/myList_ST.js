import Vue from 'vue'
import {getFetch,postFetch,globalUploadFile} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		taskfileList:[],
		spotFilesList:[],
		pictureDetInfo:{},
	},
	mutations: {
		init(state, data){
			
		},
		setTaskfileList(state, data){
            Vue.set(state, 'taskfileList', data)
            uni.setStorageSync('taskfileList', state);
		},
		setSpotFilesList(state, data){
            Vue.set(state, 'spotFilesList', data)
            uni.setStorageSync('spotFilesList', state);
		},
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		getTaskfileList(context, data){
			getFetch('spot.taskfile.query', data.parms, (data2) => {
				console.log(data2)
				let val = data2.data;
				context.commit("setTaskfileList",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		getSpotFilesList(context, data){
			getFetch('spot.file.query', data.parms, (data2) => {
				console.log(data2)
				let val = data2.data;
				context.commit("setSpotFilesList",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		taskfileDelete(context, data){
			getFetch('spot.taskfile.delete', data.parms, (data2) => {
				console.log(data2)
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		},
		spotFileUploadAll(context, data){
			globalUploadFile('spot.file.upload.all', data.parms, data.fileUrl, (data2) => {
				console.log(data2)
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			},data.inparm);
		},
	},
}