import Vue from 'vue'
import {getFetch,postFetch,globalUploadFile} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		taskDetailInfo:{},
		seleSpotFile:{},
		positionInfo:{},
		cameraType:null,
		selectTempFlie:null,
		temporaryFileList:null,
		seleSpotFilesIndex:null,
	},
	mutations: {
		init(state, data){
			
		},
		setTaskDetail(state, data){
            Vue.set(state, 'taskDetailInfo', data)
            uni.setStorageSync('taskDetailInfo', state);
		},
		setPosition(state, data){
            Vue.set(state, 'positionInfo', data)
            uni.setStorageSync('positionInfo', state);
		},
		setTaskfileFilequery(state, data){
            Vue.set(state, 'temporaryFileList', data)
            uni.setStorageSync('temporaryFileList', state);
		},
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		// 获取任务详情
		getTaskDetail(context, data){
			getFetch('task.detail.query', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setTaskDetail",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 获取详细地址
		getPosition(context, data){
			getFetch('spot.position.query', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setPosition",val);
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 文件信息暂存
		taskfileSave(context, data){
			postFetch('spot.taskfile.save', data.parms, (data2) => {
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 文件信息暂存实时模式
		taskfileUploadAll(context, data){
			globalUploadFile('spot.taskfile.upload.all', data.parms, data.fileUrl, (data2) => {
				console.log(data2)
				let val =  JSON.parse(data2.data);
				if(data.callback){
					data.callback(val);
				}
			},data.inparm);
		},
		taskfileUploadAlls(context, data){
			postFetch('spot.taskfile.upload.all', data.parms, (data2) => {
				let val =  data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 删除文件信息
		fileDelete(context, data){
			getFetch('spot.file.delete', data.parms, (data2) => {
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 更新文件状态
		taskfileUpdateStatus(context, data){
			getFetch('spot.taskfile.updateStatus', data.parms, (data2) => {
				let val = data2.data;
				if(data.callback){
					data.callback(val);
				}
			});
		},
		// 查询本机临时文件
		getTaskfileFilequery(context, data){
			getFetch('spot.taskfile.filequery', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setTaskfileFilequery",val.spotFileResult.spotFiles);
				if(data.callback){
					data.callback(val.spotFileResult.spotFiles);
				}
			});
		},
	},
}