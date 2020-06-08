import {logTag,errorTag} from '@/util/log_UT.js'
export const getLocation = (callback) => {
	logTag("获取坐标","获取坐标")
	uni.getLocation({
	    type: 'gcj02',
	    success: function (res) {
	        logTag('当前位置的经度：',res.longitude);
	        logTag('当前位置的纬度：',res.latitude);
			if(callback){
				callback({lat:res.latitude,lon:res.longitude})
			}
	    },
		fail(e){
			errorTag("获取坐标错误",e)
			if(callback){
				callback(null,e)
			}
		}
	});
	
	};