<template>
	<view class="page">
		<!-- 欢迎页 --> 
		<view v-if="!isGuid" class="welcomePage">
			<image mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/guide.png">
		</view>
		<!-- 登录页 -->
		<view v-if="!islogin && isGuid" class="signBox"> 
			<view class="loginBg">  
				<image class="img" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/login-bg.png">  
			</view>  
			<view class="loginInfo">
				<view class="list">
					<image class="icon" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/user-icon.png">
					<input class="input" v-model="loginName" placeholder="请输入账号" />
				</view>
				<view class="list">
					<image class="icon" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/password-icon.png">
					<input class="input" type="password" v-model="loginPsw" placeholder="请输入账号" />
				</view>
				 <!--按钮-->  
				<button class="loginBtn" @click="goLogin">登录</button>  
			</view>  
		</view>  
	</view>
</template>
<script>
	const md5 = require('@/util/md5.js')
	import allPage from "@/mixin/allPage_MX";
	import {postFetch} from '@/util/request_UT'
	export default {
		mixins: [allPage],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				isGuid: false,
				loginName:'',
				loginPsw:''
			}
		},
		computed: {
		
		},
		onShow: function() {
		},
		onLoad: function(options) {
			//欢迎页过渡
			setTimeout(() => {
				this.isGuid =  true;
			}, 1500);
			// 登录过的拿缓存密码
			this.loginName = uni.getStorageSync('loginName') ? uni.getStorageSync('loginName') : '';
			this.loginPsw = uni.getStorageSync('loginPsw') ? uni.getStorageSync('loginPsw') : '';
		},
		methods: {
			goLogin(){
				let _this = this;
				wx.login({
					success: function (res) {
						console.log(res)
						if (res.code) {
							if(_this.loginName == ''){
								uni.showModal({
									content: '请输入账号',
									showCancel:false
								});
								return false;
							}else if(_this.loginPsw == ''){
								uni.showModal({
									content: '请输入密码',
									showCancel:false
								});
								return false;
							}
							
							let password = md5.hex_md5(_this.loginPsw);
							password = password.toUpperCase();
							let parms = '"applyType":"1","JsCode":"' + res.code + '","user": {"loginName" : "' + _this.loginName + '","password" : "' + password + '"}'
							_this.$store.dispatch('userLogin/getUserLogin', {parms,
								callback: (res) => {
									console.log(res)
									if(res.errorCode != 0){
										uni.showModal({
											content: res.errorMsg,
											showCancel:false
										});
										return false;
									}
									uni.setStorageSync('islogin', true);
									uni.setStorageSync('loginName', _this.loginName);
									uni.setStorageSync('loginPsw', _this.loginPsw);
									uni.showToast({
										title: '登录成功',
										icon: 'none',
										mask: true
									})
									uni.switchTab({
									    url: '/pages/index/index'
									});
								},
							})
						}
					}
				});
			}
		},

	}
</script>

<style lang="scss">
	page {
		  background-color: #eeedeb;
	}
</style>
<style lang="scss" scoped>
	@import './login.scss';
</style>
