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
				<view class="fileBox">
					<image class="img" v-if="cameraType == '2'" mode="aspectFill" @click="flieBrowse" :src="selectTempFlie.fileUrl">
					<video class="video" v-if="cameraType == '1' && selectTempFlie.location" :src="selectTempFlie.fileUrl"></video>
					<image class="img" v-if="cameraType == '1' && !selectTempFlie.location" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg">
					<image class="icon" v-if="selectTempFlie.lat" @click.stop="map" :src="selectTempFlie.mapImgUrl">
					<view class="num" v-if="userLogin.user.CaptureCacheMode != 1">{{userLogin.user.PhotosNum - (temporaryFileList.length + newSpareFlie.length) < 0 ? 0 : userLogin.user.PhotosNum - (temporaryFileList.length + newSpareFlie.length)}}/{{userLogin.user.PhotosNum}}</view>
				</view>
			</view>
			<view class="info">
				<view><text>拍摄地点</text>{{selectTempFlie.location}}</view>
				<!-- <view class="flex-box"><text>说明</text><input class="flex-one input" type="text" :value="selectTempFlie.description"></view> -->
				<view class="flex-box"><text>说明</text><view class="flex-one" :style="{background: selectTempFlie.descriptionColour}">{{selectTempFlie.description}}</view></view>
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
				selectImgIndex: null,
				selectTempFlie:{  
					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
					shootTime: '',
					location: '',
					description: '',
				},
				seleSpotFile:null,
				spareFlie:[],
				newSpareFlie:[], //新增的文件
				isClickSubmit: false, //是否点击确认
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.userLogin.systemInfo
			},
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
			// seleSpotFile() {
			// 	return this.$store.state.details.seleSpotFile
			// },
			cameraType() {
				return this.$store.state.details.cameraType
			},
			temporaryFileList() {
				return this.$store.state.details.temporaryFileList
			},
			seleSpotFilesIndex() {
				return this.$store.state.details.seleSpotFilesIndex
			},
		},
		onShow: function() {
			this.getTaskfileFilequery()
			if (this.userLogin.user.CaptureCacheMode == 1) {
				wx.setNavigationBarTitle({
					title: '文件提交' 
				})
			} else {
				wx.setNavigationBarTitle({
					title: '文件提交（手机）' 
				})
			}
		},
		destroyed: function(){
			
		},
		onLoad: function(options) {
			console.log(this.temporaryFileList.length , this.spareFlie.length)
			console.log(this.cameraType)
			this.options = options;
			this.seleSpotFile = this.$store.state.details.seleSpotFile;
			if(this.options.implement == "true"){
				this.chooseWxImageVideo();
			}else{
				console.log(this.seleSpotFile);
				this.setData();
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
		destroyed() {
			if (!this.isClickSubmit) {
				this.newSpareFlie.forEach((val) => {
					wx.removeSavedFile({
						filePath: val.fileUrl,
					});
				})
			};
		},
		methods: {
			// 数据初始化处理
			setData() {
				new Promise(resolve => {
					for(let i = 0; i < this.seleSpotFile.imgList.length; i++){
						// 判断文件/目录是否存在
						let _this = this;
						let fileUrl = this.seleSpotFile.imgList[i].fileUrl;
						if (fileUrl && (fileUrl.indexOf('wxfile') != -1 || fileUrl.indexOf('http://store') != -1 || fileUrl.indexOf('http://tmp') != -1)) {
							if (this.seleSpotFile.imgList[i].spotClassTypeName == '视频') {
								wx.getVideoInfo({
									src: fileUrl,
									success (res) {
										_this.spareFlie.push(_this.seleSpotFile.imgList[i]);
									},
									complete (res) {
										if (_this.seleSpotFile.imgList.length == i+1) {
											resolve();
										}
									}
								})
							} else {
								wx.getImageInfo({
									src: fileUrl,
									success (res) {
										_this.spareFlie.push(_this.seleSpotFile.imgList[i]);
									},
									complete (res) {
										if (_this.seleSpotFile.imgList.length == i+1) {
											resolve();
										}
									}
								})
							}
						} else {
							this.spareFlie.push(this.seleSpotFile.imgList[i]);
							if (_this.seleSpotFile.imgList.length == i+1) {
								resolve();
							}
						}
					}
				}).then(res => {
					console.log(this.spareFlie)
					// 默认数据赋值
					// this.selectTempFlie = this.spareFlie[0];
					// this.selectImgIndex = 0;
					for (let j = 0; j < this.spareFlie.length; j++) {
						if(this.spareFlie[j].isSelect){
							this.selectTempFlie = this.spareFlie[j];
							this.selectImgIndex = j;
							// break;
						}
					}
					console.log(this.selectTempFlie)
				})
			},
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
				let text = this.cameraType == '1' ? '视频' : '图片';
				uni.showModal({
					title: '提示',
					content: '是否确认删除'+ text +'？',
					success (res) {
						if (res.confirm) {
							let data = _this.spareFlie[index];
							wx.removeSavedFile({
								filePath: data.fileUrl,
							});
							if (data.id) {
								if (data.status == -1 || data.status == -2) {
									// let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"taskId":' + data.taskId +
									// 	', "spotClassType":' + data.spotClassType + ', "monitorStage":' + data.monitorStage + '}';
									let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"id":' + data.id + '}';
									_this.$store.dispatch('myList/taskfileDelete', {
										parms,
										callback: (res) => {
											_this.temporaryFileListOp(index);
										},
									})
								} else if (data.status == 0) {
									let parms = '},"spotFile":{"id":' + data.id + '}';
									_this.$store.dispatch('details/fileDelete', {
										parms,
										callback: (res) => {
											_this.temporaryFileListOp(index);
										},
									})
								}
							} else {
								for (let i = 0; i < _this.newSpareFlie.length; i++) {
									if (_this.newSpareFlie[i].fileUrl == _this.spareFlie[index].fileUrl) {
										_this.newSpareFlie.splice(i, 1);
									}
								}
								_this.spareFlie.splice(index, 1);
								if (_this.spareFlie.length > 0) {
									_this.selectImgCh(0)
								} else {
									_this.selectTempFlie = {fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',shootTime: ''}
								}
							}
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			temporaryFileListOp(index) {
				for (let i = 0; i < this.temporaryFileList.length; i++) {
					if (this.temporaryFileList[i].fileUrl == this.spareFlie[index].fileUrl) {
						this.temporaryFileList.splice(i, 1);
					}
				}
				this.spareFlie.splice(index, 1);
				if (this.spareFlie.length > 0) {
					this.selectImgCh(0)
				} else {
					this.selectTempFlie = {fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',shootTime: ''}
				}
			},
			// 地图查看
			map(){
				this.$store.state.details.selectTempFlie = this.selectTempFlie;
				uni.navigateTo({
				    url: "/pages/map/map"
				})
			},
			// 确认
			submit(){
				console.log(this.spareFlie)
				if (!this.spareFlie.length) { return false }
				this.isClickSubmit = true;
				// 重新提交现所有的图片
				uni.showLoading({
					title: '提交中'
				});
				for (let z=0; z<this.spareFlie.length; z++) {
					this.spareFlie[z].isSelect = false;
					if (this.selectTempFlie.id == this.spareFlie[z].id) {
						this.spareFlie[z].isSelect = true;
						console.log('this.spareFlie[z]', this.spareFlie[z])
					}
				}
				if (this.userLogin.user.CaptureCacheMode == 1) {
					new Promise(resolve => {
						for (let i = 0; i < this.spareFlie.length; i++) {
							let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":'+ JSON.stringify(this.spareFlie[i]) + '';
							let fileUrl = this.spareFlie[i].fileUrl;
							console.log(parms)
							if (!this.spareFlie[i].UploadStatus || this.spareFlie[i].UploadStatus == 0) {
								this.$store.dispatch('details/taskfileUploadAll', {parms, fileUrl,
									callback: (res2) => {
										console.log(res2);
										wx.removeSavedFile({
											filePath: fileUrl,
										});
										if (res2.errorCode == 0) {
											if (this.spareFlie.length == i+1) {
												resolve();
											}
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
							} else {
								this.$store.dispatch('details/taskfileUploadAlls', {parms,
									callback: (res2) => {
										console.log(res2);
										if (res2.errorCode == 0) {
											if (this.spareFlie.length == i+1) {
												resolve();
											}
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
							}
						}
					}).then(res => {
						wx.navigateBack({
							delta: 1,  // 返回上一级页面。
							success: function() {
								console.log('成功！')
							}
						})
					})
					
				} else {
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
				}
			},
			// 唤起手机拍照/视频功能
			chooseWxImageVideo(){
				console.log('临时文件总数', this.temporaryFileList.length + this.newSpareFlie.length)
				if (this.temporaryFileList.length + this.newSpareFlie.length  > this.userLogin.user.PhotosNum - 1) {
					uni.showToast({
						title: '拍照数量不能超出' + this.userLogin.user.PhotosNum + '个,请先提交现有的拍照。',
						icon: 'none',
						mask: true
					})
					return false;
				}
				// pc打开不予执行
				if(this.systemInfo.platform == "windows"){
					uni.showToast({
						title: '非法操作，不允许PC端上传！',
						icon: 'none',
						mask: true
					})
					return false
				}
				var _this = this;
				this.options.implement = "false";
				// 获取当前定位坐标,成功后才执行拍照/视频
				wx.getLocation({
					type: 'gcj02',
					success: function (res1) {
				        console.log(res1)
						// 通过经纬度获取详细地址
						let parms = '},"position":{"lat":"' + res1.latitude + '", "lng":"' + res1.longitude + '", "taskId":"' + _this.seleSpotFile.taskId + '", "type":"GCJ02"}';
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
										lat: res2.lat,
										lon: res2.lon,
										gcj02lat: res1.latitude,
										gcj02lon: res1.longitude,
										location: res2.spotLocation,
										monitorStage: _this.seleSpotFile.monitorStage,
										spotClassType: _this.seleSpotFile.spotClassType,
										description: res2.lat + ',' + res2.lon,
										phoneSystem: '微信小程序',
										phoneSystemVersion: _this.systemInfo.model.replace(/[@<>#\$%\^&\*]+/g, ''),
										phoneModel: '12.4 【'+ _this.systemInfo.version +'】',
										isSelect: true,
										mapImgUrl: res2.mapImgUrl,
										distanceName: res2.distanceName,
									}
									if(_this.cameraType == 2){ // 拍照功能
										uni.chooseImage({
											sizeType: ['original'],
											sourceType: ['camera'],
											success: function(res3) {
												console.log(res3);
												// 保存文件到本地
												uni.saveFile({
													tempFilePath: res3.tempFilePaths[0],
													success (res4) {
														console.log(res4)
														let item = {
															...commonList,
															fileUrl: res4.savedFilePath,
															thumbnailUrl: res4.savedFilePath,
															fileSize: res3.tempFiles[0].size,
														}
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":'+ JSON.stringify(item) + '';
														let fileUrl = item.fileUrl;
														if (_this.userLogin.user.CaptureCacheMode == 1) {
															// 点击使用照片后,上传服务器
															_this.$store.dispatch('details/taskfileUploadAll', {parms, fileUrl,
																callback: (res2) => {
																	console.log(res2);
																	wx.removeSavedFile({
																		filePath: fileUrl,
																	});
																	if (res2.errorCode == 0) {
																		// 重新获取最新的那条选中数据,渲染页面
																		let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + _this.options.id + '}';
																		_this.$store.dispatch('details/getTaskDetail', {parms,
																			callback: (res2) => {
																				console.log('res2', res2)
																				_this.selectImgIndex = null;
																				_this.selectTempFlie = {  
																					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
																					shootTime: '',
																					location: '',
																					description: '',
																				};
																				_this.spareFlie = [],
																				_this.$set(_this, 'seleSpotFile', res2.taskResult.tasks[0].monitorStages[_this.seleSpotFilesIndex[0]].spotFiles[_this.seleSpotFilesIndex[1]])
																			
																				_this.setData();
																			},
																		})
																	} else {
																		uni.showToast({
																			title: res2.errorMsg,
																			icon: 'none',
																			mask: true
																		})
																	}
																},
															})
														} else {
															// 点击使用照片后,上传服务器
															_this.$store.dispatch('details/taskfileUploadAlls', {parms,
																callback: (res2) => {
																	console.log(res2);
																	if (res2.errorCode == 0) {
																		// 重新获取最新的那条选中数据,渲染页面
																		let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + _this.options.id + '}';
																		_this.$store.dispatch('details/getTaskDetail', {parms,
																			callback: (res2) => {
																				console.log(res2)
																				_this.selectImgIndex = null;
																				_this.selectTempFlie = {  
																					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
																					shootTime: '',
																					location: '',
																					description: '',
																				};
																				_this.spareFlie = [],
																				_this.$set(_this, 'seleSpotFile', res2.taskResult.tasks[0].monitorStages[_this.seleSpotFilesIndex[0]].spotFiles[_this.seleSpotFilesIndex[1]])
																				
																				_this.setData();
																			},
																		})
																	} else {
																		uni.showToast({
																			title: res2.errorMsg,
																			icon: 'none',
																			mask: true
																		})
																	}
																},
															})
														}
														console.log(_this.selectTempFlie)
													},
													fail (res) {
														console.log(res)
													}
												})
											}
										})
									}else{ // 视频功能
										uni.chooseVideo({
											sourceType: ['camera'],
											maxDuration: 60,
											camera: 'back',
											success(res3) {
												console.log(res3)
												if (res3.size < 200000) {
													wx.removeSavedFile({
														filePath: res3.tempFilePath,
													});
													uni.showToast({
														title: '拍摄时间太短请重拍。',
														icon: 'none',
														mask: true,
														duration: 5000,
													})
													return false
												}
												// 保存文件到本地
												uni.saveFile({
													tempFilePath: res3.tempFilePath,
													success (res4) {
														console.log(res4)
														let item = {
															...commonList,
															fileUrl: res4.savedFilePath,
															thumbnailUrl: res4.savedFilePath,
															fileSize: res3.size,
														}
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":'+ JSON.stringify(item) + '';
														let fileUrl = item.fileUrl;
														if (_this.userLogin.user.CaptureCacheMode == 1) {
															// 点击使用照片后,上传服务器
															_this.$store.dispatch('details/taskfileUploadAll', {parms, fileUrl,
																callback: (res2) => {
																	console.log(res2);
																	wx.removeSavedFile({
																		filePath: fileUrl,
																	});
																	if (res2.errorCode == 0) {
																		// 重新获取最新的那条选中数据,渲染页面
																		let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + _this.options.id + '}';
																		_this.$store.dispatch('details/getTaskDetail', {parms,
																			callback: (res2) => {
																				console.log('res2', res2)
																				_this.selectImgIndex = null;
																				_this.selectTempFlie = {  
																					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
																					shootTime: '',
																					location: '',
																					description: '',
																				};
																				_this.spareFlie = [],
																				_this.$set(_this, 'seleSpotFile', res2.taskResult.tasks[0].monitorStages[_this.seleSpotFilesIndex[0]].spotFiles[_this.seleSpotFilesIndex[1]])
																			
																				_this.setData();
																			},
																		})
																	} else {
																		uni.showToast({
																			title: res2.errorMsg,
																			icon: 'none',
																			mask: true
																		})
																	}
																},
															})
														} else {
															// 点击使用照片后,上传服务器
															_this.$store.dispatch('details/taskfileUploadAlls', {parms,
																callback: (res2) => {
																	console.log(res2);
																	if (res2.errorCode == 0) {
																		// 重新获取最新的那条选中数据,渲染页面
																		let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + _this.options.id + '}';
																		_this.$store.dispatch('details/getTaskDetail', {parms,
																			callback: (res2) => {
																				console.log(res2)
																				_this.selectImgIndex = null;
																				_this.selectTempFlie = {  
																					fileUrl: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/pv-bg.jpg',
																					shootTime: '',
																					location: '',
																					description: '',
																				};
																				_this.spareFlie = [],
																				_this.$set(_this, 'seleSpotFile', res2.taskResult.tasks[0].monitorStages[_this.seleSpotFilesIndex[0]].spotFiles[_this.seleSpotFilesIndex[1]])
																				
																				_this.setData();
																			},
																		})
																	} else {
																		uni.showToast({
																			title: res2.errorMsg,
																			icon: 'none',
																			mask: true
																		})
																	}
																},
															})
														}
														console.log(_this.spareFlie)
													},
													fail(error){
														console.log(error)
													}
												})
											}
										})
									}
								}
							},
						})
					},
					fail(e){
						console.log('获取坐标错误', e)
						uni.showModal({
							content: '需要获取您的位置用于在户外监播拍照模块记录您拍照的地点，若不允许，将无法拍照成功。',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success(res) {
											console.log(res.authSetting)
										}
									})
								}
							}
						})
					}
				})
			},
			//查获取所有临时文件数据
			getTaskfileFilequery() {
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"taskIdStr":""}';
				this.$store.dispatch('details/getTaskfileFilequery', {
					parms,
					callback: (res) => {
						console.log('文件list', res)
					}
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
