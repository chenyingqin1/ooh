<template>
	<view class="page">
		<view class="imgInfo">
			<view class="imgList">
				<view class="list">
					<view class="name">拍摄时间 {{selectTempFlie.shootTime?timestampToTime(selectTempFlie.shootTime):''}}</view>
					<scroll-view :scroll-x="true">
						<view class="imgBox" :class="{cur:selectImgIndex == index}" v-for="(item, index) in spareFlie" :key="index" @click="selectImgCh(index)" @longpress="longpressCh(index)">
							<image class="img" v-if="cameraType == '2'" mode="aspectFill" :src="item.fileUrl">
							<video class="img" v-if="cameraType == '1'" :src="item.fileUrl" :controls="false" :show-center-play-btn="false"></video>
							<image class="icon" v-if="cameraType == '1'" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/icon_play.png">
						</view>
					</scroll-view>
				</view>
				<image class="img" v-if="cameraType == '2'" mode="aspectFill" @click="flieBrowse" :src="selectTempFlie.fileUrl">
				<video class="video" v-if="cameraType == '1' && selectTempFlie.location" :src="selectTempFlie.fileUrl"></video>
				<image class="img" v-if="cameraType == '1' && !selectTempFlie.location" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg">
			</view>
			<view class="info">
				<view><text>拍摄地点</text>{{selectTempFlie.location}}</view>
				<view class="flex-box"><text>说明</text><input class="flex-one input" type="text" :value="selectTempFlie.description"></view>
			</view>
		</view>
		<view class="operation flex-box">
			<view class="flex-one" @click="chooseWxImageVideo">{{cameraType == '2' ? '继续拍照' : '继续拍视频'}}</view>
			<view class="flex-one cur" @click="submit">确认</view>
		</view>
	</view>
</template>
<script>
	import allPage from "@/mixin/allPage_MX";
	import util from '@/common/util.js'
	import publicCheck from "@/mixin/publicCheck_MX.js";
	export default {
		mixins: [allPage,publicCheck],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				options: null,
				selectImgIndex: 0,
				selectTempFlie:{  
					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
					shootTime: '',
					location: '',
					description: '',
				},
				spareFlie:[],
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.userLogin.systemInfo
			},
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
			seleSpotFile() {
				return this.$store.state.details.seleSpotFile
			},
			cameraType() {
				return this.$store.state.details.cameraType
			},
		},
		onShow: function() {
			
		},
		destroyed: function(){
			
		},
		onLoad: function(options) {
			console.log(this.cameraType)
			this.options = options;
			if(this.options.implement == "true"){
				this.chooseWxImageVideo();
			}else{
				this.spareFlie = this.seleSpotFile.imgList;
				for(let i=0; i<this.seleSpotFile.imgList.length; i++){
					if(this.seleSpotFile.imgList[i].isSelect){
						this.selectTempFlie = this.seleSpotFile.imgList[i];
						this.selectImgIndex = i;
					}
				}
				console.log(this.selectTempFlie)
			}
		},
		onReady: function() {
			
		},
		onHide: function(options) {
			
		},
		onReachBottom: function(options) {
			
		},

		onPullDownRefresh() {
			
		},
		mounted() {
			
		},
		watch: {
			
		},
		onPageScroll: function(e) {
			
		},
		methods: {
			// 图片视频选择
			selectImgCh(index){
				this.selectImgIndex = index;
				for(let i=0; i<this.spareFlie.length; i++){
					this.spareFlie[i].isSelect = false;
				}
				this.spareFlie[index].isSelect = true;
				this.selectTempFlie = this.spareFlie[index];
			},
			// 图片浏览
			flieBrowse(){
				uni.previewImage({
					current: this.selectTempFlie.fileUrl,
					urls: [this.selectTempFlie.fileUrl],
				})
			},
			// 图片长按删除
			longpressCh(index){
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否确认删除图片？',
					success (res) {
						if (res.confirm) {
							_this.spareFlie.splice(index, 1);
							_this.selectTempFlie = _this.spareFlie.length > 0 ? _this.spareFlie[0] : {fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',shootTime: ''};
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			// 确认
			submit(){ 
				console.log(this.spareFlie)
				new Promise(resolve => {
					// 先删除已存的所有图片
					let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"taskId":' + this.seleSpotFile.taskId + ', "spotClassType":' + this.seleSpotFile.spotClassType + ', "monitorStage":' + this.seleSpotFile.monitorStage + '}';
					this.$store.dispatch('myList/taskfileDelete', {parms,
						callback: (res1) => {
							console.log(res1);
							resolve(res1)
						},
					})
				}).then(res => {
					// 重新提交现所有的图片
					uni.showLoading({
						title: '提交中'
					});
					let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFiles":'+ JSON.stringify(this.spareFlie) + '';
					this.$store.dispatch('details/taskfileSave', {parms,
						callback: (res2) => {
							console.log(res2);
							if (res2.errorCode == 0) {
								wx.navigateBack({
									delta: 1,  // 返回上一级页面。
									success: function() {
										console.log('成功！')
									}
								})
							}else{
								uni.showToast({
									title: res2.errorMsg,
									icon: 'none',
									mask: true
								})
							}
							uni.hideLoading();
						},
					})
				})
			},
			// 唤起手机拍照/视频功能
			chooseWxImageVideo(){
				var _this = this;
				this.options.implement = "false";
				// 获取当前定位坐标,成功后才执行拍照/视频
				wx.getLocation({
					type: 'wgs84',
					success: function (res1) {
				        console.log(res1)
						// 通过经纬度获取详细地址
						let parms = '},"position":{"lat":"' + res1.latitude + '", "lng":"' + res1.longitude + '"}';
						_this.$store.dispatch('details/getPosition', {parms,
							callback: (res2) => {
								console.log(res2)
								if(res2.errorCode == 0){
									for(let i=0; i<_this.spareFlie.length; i++){
										_this.spareFlie[i].isSelect= false;
									}
									let commonList = {
										taskId: _this.seleSpotFile.taskId,
										shootTime: _this.dateToUnix(_this.getCurrentTime()),
										lat: res1.latitude,
										lon: res1.longitude,
										location: res2.spotLocation,
										monitorStage: _this.seleSpotFile.monitorStage,
										spotClassType: _this.seleSpotFile.spotClassType,
										description: res1.latitude + ',' + res1.longitude,
										phoneSystem: '微信小程序',
										phoneSystemVersion: _this.systemInfo.model.replace(/[@<>#\$%\^&\*]+/g, ''),
										phoneModel: '12.4 【'+ _this.systemInfo.version +'】',
										isSelect: true,
									}
									if(_this.cameraType == 2){ // 拍照功能
										uni.chooseImage({
											sizeType: ['original','compressed'],
											sourceType: ['camera'],
											success: function(res3) {
												console.log(res3);
												_this.spareFlie.unshift({
													...commonList,
													fileUrl: res3.tempFiles[0].path,
													thumbnailUrl: res3.tempFiles[0].path,
													fileSize: res3.tempFiles[0].size,
												})
												_this.selectTempFlie = _this.spareFlie[0];
												console.log(_this.selectTempFlie)
											}
										})
									}else{ // 视频功能
										uni.chooseVideo({
											sourceType: ['camera'],
											maxDuration: 60,
											camera: 'back',
											success(res3) {
												console.log(res3)
												_this.spareFlie.unshift({
													...commonList,
													fileUrl: res3.tempFilePath,
													thumbnailUrl: res3.tempFilePath,
													fileSize: res3.size,
												})
												_this.selectTempFlie = _this.spareFlie[0];
												console.log(_this.spareFlie)
											}
										})
									}
								}
							},
						})
						
					},
				})
			},
			// 获取当前时间
			getCurrentTime(){
				let myDate = new Date();
				//获取当前年
				let year=myDate.getFullYear();
				//获取当前月
				let month=myDate.getMonth()+1;
				//获取当前日
				let date=myDate.getDate(); 
				let h=myDate.getHours();       //获取当前小时数(0-23)
				let m=myDate.getMinutes();     //获取当前分钟数(0-59)
				let s=myDate.getSeconds();  
				return year+'-'+this.getNow(month)+"-"+this.getNow(date)+" "+this.getNow(h)+':'+this.getNow(m)+":"+this.getNow(s);
			},
			getNow(s) {
				return s < 10 ? '0' + s: s;
			}
		},

	}
</script>
<style lang="scss" scoped>
	@import './photoSubmission.scss';
</style>
