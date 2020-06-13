import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import qs from 'qs'
const config= require("@/common/config.js");
const utils = require('@/util/util.js');
const md5 = require('@/util/md5.js')

export const getFetch =  async (method, parm, callback, inparm) => {
	try{
		let ts = utils.getTimestamp();
		let uid;
		if(method != 'user.login'){
			if(uni.getStorageSync('userLogin')){
				uid = uni.getStorageSync('userLogin').userLogin.user.uid;
			}else{
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return false;
			}
		}
		let sign = md5.hex_md5(config.sumbitUrl + "?" + "method=" + method + "&appkey=" + config.appkey + "&ts=" + ts);
		let id = utils.guid();
		let data;
		if(method == 'user.login'){
			data = '{"id": "' + id + '",' + parm + '}';
		}else{
			data = '{"id": "' + id + '","user": {"uid": "' + uid + '"' + parm + '}';
		}
		let header = {
			"method": method,
			"appkey": config.appkey,
			"ts": ts,
			"sign": sign,
			"data": data,
		}
		if(inparm){
			header = Object.assign(header, inparm)
		}
		const res = await uni.request({
			url: config.sumbitUrl,
			method:'GET',
			data: header,
			success: (data) => {
				callback(data);
			},
			fail({ errMsg }) {
				console.log('request fail', errMsg)
			}
		});
	}catch(e){
		return {
			code:-1,
			message:e.message,
			status:false,
		};
	}
};

export const postFetch =  async (method, parm, callback, inparm) => {
	try{
		let ts = utils.getTimestamp();
		let uid;
		if(method != 'user.login'){
			if(uni.getStorageSync('userLogin')){
				uid = uni.getStorageSync('userLogin').userLogin.user.uid;
			}else{
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return false;
			}
		}
		let sign = md5.hex_md5(config.sumbitUrl + "?" + "method=" + method + "&appkey=" + config.appkey + "&ts=" + ts);
		let id = utils.guid();
		let data;
		if(method == 'user.login'){
			data = '{"id": "' + id + '",' + parm + '}';
		}else{
			data = '{"id": "' + id + '","user": {"uid": "' + uid + '"' + parm + '}';
		}
		let header = {
			"method": method,
			"appkey": config.appkey,
			"ts": ts,
			"sign": sign,
			"data": data,
		}
		if(inparm){
			header = Object.assign(header, inparm)
		}
		const res = await uni.request({
			url: config.sumbitUrl,
			method:'POST',
			data: header,
			success: (data) => {
				callback(data);
			},
			fail({ errMsg }) {
				console.log('request fail', errMsg)
			}
		});
	}catch(e){
		return {
			code:-1,
			message:e.message,
			status:false,
		};
	}
};

export const globalUploadFile =  async (method, parm, filePath, callback, inparm) => {
	try{
		let ts = utils.getTimestamp();
		let uid;
		if(method != 'user.login'){
			if(uni.getStorageSync('userLogin')){
				uid = uni.getStorageSync('userLogin').userLogin.user.uid;
			}else{
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return false;
			}
		}
		let sign = md5.hex_md5(config.sumbitUrl + "?" + "method=" + method + "&appkey=" + config.appkey + "&ts=" + ts);
		let id = utils.guid();
		let data;
		if(method == 'user.login'){
			data = '{"id": "' + id + '",' + parm + '}';
		}else{
			data = '{"id": "' + id + '","user": {"uid": "' + uid + '"' + parm + '}';
		}
		let header = {
			"method": method,
			"appkey": config.appkey,
			"ts": ts,
			"sign": sign,
			"data": data,
		}
		if(inparm){
			header = Object.assign(header, inparm)
		}
		const res = await uni.uploadFile({
			url: config.sumbitUrl,
			filePath: filePath,
			name: 'spotfile',
			formData: header,
			success: (data) => {
				callback(data);
			},
			fail: (errMsg) => {
				console.log('request fail', errMsg)
			}
		});
		res.onProgressUpdate((res) => {
			uni.showLoading({
				title: res.progress
			});
			if(res.progress == 100){
				uni.hideLoading()
			}
		})
	}catch(e){
		return {
			code:-1,
			message:e.message,
			status:false,
		};
	}
};