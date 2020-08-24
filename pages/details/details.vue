<template>
	<view class="page">
		<view class="contentBox">
			<view class="detailsInfo" v-show="taskDetail.name">
				<view class="title">
					<view class="name">任务名称：{{taskDetail.name}}</view>
					<view class="time">
						<view>{{taskDetail.startDate}} 至 {{taskDetail.endDate}}</view>
					</view>
				</view>
				<view class="info">
					<view>广告主：{{taskDetail.client}}</view>
					<view>品牌：{{taskDetail.brandName}}</view>
					<view>媒体规格：{{taskDetail.mediaName}}</view>
					<view>任务地址：{{taskDetail.location}}</view>
					<view>活动名称：{{taskDetail.campaignName}}</view>
					<view>说明：{{taskDetail.description}}</view>
				</view>
			</view>
			<view class="monitorStage">
				<view class="condition">
					<view class="title">监播阶段</view>
					<block v-for="(item, index) in taskDetail.monitorStages" :key="index">
						<view class="content clearfloat">
							<view class="tab" :class="{cur: item.IsEnabled == true}" @click="tabChange(index)">
								<view class="n">{{item.displayName}}
									<block v-if="item.value != '0'">（{{item.value}})</block>
								</view>
							</view>
							<view class="fileList clearfloat" v-show="currentIndex == index">
								<view class="item" v-for="(v, i) in item.spotFiles" :key="i">
									<view class="name">{{v.spotClassTypeName}}</view>
									<view class="file" :class="{cur:v.fileUrl}" @click="operationImage(item, v, index, i)">
										<block v-if="v.fileUrl">
											<text class="reviewed" v-if="v.status == 1">已审</text>
											<text class="isImgLists" v-if="v.imgList.length > 1"></text>
											<image class="icon y" mode="widthFix" v-if="v.status == 0" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/yun.png">
											<image class="icon" mode="widthFix" @click.stop="deleteCh(item, v)" v-if="v.status == 0 || v.status == -1 || v.status == -2" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/del.png">
											<image class="img" mode="aspectFill" v-if="v.fileUrl && v.spotClassTypeName.indexOf('图片') != -1" :src="v.fileUrl">
											<video class="img" v-if="v.spotClassTypeName == '视频'" :src="v.fileUrl" :show-center-play-btn="false" :custom-cache="false" :controls="controls" bindended="endAction"></video>
											<!-- <image class="img" mode="aspectFill" v-if="v.fileUrl" :src="v.thumbnailUrl"> -->
											<video id="myvideo" v-if="isShow && v.spotClassTypeName == '视频'" :src="v.fileUrl" autoplay="true" :bindfullscreenchange="fullScreen"  :bindended="closeVideo"  controls></video>
											<image class="video" v-if="v.spotClassTypeName == '视频'" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/icon_play.png">
										</block>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
		<view class="but" @click="submitCh">提交</view>
	</view>
</template>
<script>
	const md5 = require('@/util/md5.js')
	import allPage from "@/mixin/allPage_MX";
	export default {
		mixins: [allPage],
		components: {

		},
		beforeCreate() {

		},
		data() {
			return {
				options: null,
				currentIndex: null,
				taskDetail: {},
				controls: false,
				isShow: false,
				temporaryFileList: [],
				suo: false,
			}
		},
		computed: {
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
		},
		onShow: function() {
			this.getData();
			this.getTaskfileFilequery();
		},
		onLoad: function(options) {
			this.options = options;
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
			getData() {
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + this.options.id + '}';
				this.$store.dispatch('details/getTaskDetail', {
					parms,
					callback: (res2) => {
						console.log(res2);
						const fs = wx.getFileSystemManager();
						if (res2.errorCode == 0) {
							let data = res2.taskResult.tasks[0];
							let bl = false;
							for (let i = 0; i < data.monitorStages.length; i++) {
								if (data.monitorStages[i].IsEnabled == true && !bl) {
									this.currentIndex = i;
									bl = true;
								}
								// 查看默认数据的临时图片是否还存在，如果不存在直接删除所有图片
								for(let j = 0; j < data.monitorStages[i].spotFiles.length; j++){
									let spotFiles = data.monitorStages[i].spotFiles[j];
									if (spotFiles.fileUrl && (spotFiles.fileUrl.indexOf('wxfile') != -1 || spotFiles.fileUrl.indexOf('http://store') != -1 || spotFiles.fileUrl.indexOf('http://tmp') != -1)) {
										let _this = this;
										if (spotFiles.spotClassTypeName == '视频') {
											wx.getVideoInfo({
												src: spotFiles.fileUrl,
												success (res) {},
												fail (res) {
													console.log(res)
													// if (res.errMsg.indexOf('not found') == -1) { return false };
													spotFiles.fileUrl = '';
													data.monitorStages[i].value--;
													if (spotFiles.status == -1 || spotFiles.status == -2) {
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"taskId":' + spotFiles.taskId +
															', "spotClassType":' + spotFiles.spotClassType + ', "monitorStage":' + spotFiles.monitorStage + '}';
														_this.$store.dispatch('myList/taskfileDelete', {
															parms,
															callback: (res) => {
																
															},
														})
													} else if (spotFiles.status == 0) {
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"id":' + spotFiles.id + '}';
														_this.$store.dispatch('details/fileDelete', {
															parms,
															callback: (res) => {
																
															},
														})
													}
												}
											})
										} else {
											wx.getImageInfo({
												src: spotFiles.fileUrl,
												success (res) {},
												fail (res) {
													console.log(res)
													// if (res.errMsg.indexOf('not found') == -1) { return false };
													spotFiles.fileUrl = '';
													data.monitorStages[i].value--;
													if (spotFiles.status == -1 || spotFiles.status == -2) {
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"taskId":' + spotFiles.taskId +
															', "spotClassType":' + spotFiles.spotClassType + ', "monitorStage":' + spotFiles.monitorStage + '}';
														_this.$store.dispatch('myList/taskfileDelete', {
															parms,
															callback: (res) => {
																
															},
														})
													} else if (spotFiles.status == 0) {
														let parms = ',"openid":"' + _this.userLogin.user.openid + '"},"spotFile":{"id":' + spotFiles.id + '}';
														_this.$store.dispatch('details/fileDelete', {
															parms,
															callback: (res) => {
																
															},
														})
													}
												}
											})
										}
									}
								}
							}
							this.taskDetail = data;
							console.log(this.taskDetail)
						} else {
							uni.showToast({
								title: res2.errorMsg,
								icon: 'none',
								mask: true
							})
						}
					},
				})
			},
			// 查看默认数据的临时图片是否还存在，如果不存在直接删除所有图片
			getFileSystemManager(v){
				if(!v.fileUrl) {return false}; 
				const fs = wx.getFileSystemManager();
				fs.access({
					path: v.fileUrl,
					success:function(res) {
						if(res.errMsg.indexOf('fail no such file or directory') != -1){
							console.log('getFileSystemManager',res)
							if (v.status == -1 || v.status == -2) {
								let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"taskId":' + v.taskId +
									', "spotClassType":' + v.spotClassType + ', "monitorStage":' + v.monitorStage + '}';
								this.$store.dispatch('myList/taskfileDelete', {
									parms,
									callback: (res) => {
										// this.getData()
										return false
									},
								})
							} else if (v.status == 0) {
								let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":' + v.id + '}';
								this.$store.dispatch('details/fileDelete', {
									parms,
									callback: (res) => {
										// this.getData()
										return false
									},
								})
							}
							
						}else{
							return true
						}
					},
					fail: function (errmsg) {
						console.log(errmsg)
					},
				})
			},
			// 删除
			deleteCh(item, v) {
				console.log(item)
				console.log(v)
				if (!item.IsEnabled) {
					return false;
				}
				uni.showModal({
					content: '确定删除【'+ v.spotClassTypeName +'】图片吗？',
					success: (res) => {
						if (res.confirm) {
							if (v.UploadStatus) {
								wx.removeSavedFile({
									filePath: v.fileUrl,
								});
							}
							if (v.status == -1 || v.status == -2) {
								let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"taskId":' + v.taskId +
									', "spotClassType":' + v.spotClassType + ', "monitorStage":' + v.monitorStage + '}';
								this.$store.dispatch('myList/taskfileDelete', {
									parms,
									callback: (res) => {
										this.getData();
										this.getTaskfileFilequery();
									},
								})
							} else if (v.status == 0) {
								let parms = '},"spotFile":{"id":' + v.id + '}';
								this.$store.dispatch('details/fileDelete', {
									parms,
									callback: (res) => {
										this.getData();
										this.getTaskfileFilequery();
									},
								})
							}
						}
					}
				})
			},
			// 图片/视频点击
			operationImage(item, v, index, index1) {
				console.log(v)
				console.log(item)
				if (item.IsEnabled && item.IsFinishAhead && v.status != 1) {
					if (this.temporaryFileList.length >= 9 && !v.fileUrl && v.imgList.length == 0) {
						uni.showToast({
							title: '拍照数量不能超出9个,请先提交现有的拍照。',
							icon: 'none',
							mask: true
						})
						return false;
					}
					this.$store.state.details.seleSpotFilesIndex = [index, index1]; //缓存选中的数据下标
					console.log(this.$store.state.details.seleSpotFilesIndex)
					this.$store.state.details.seleSpotFile = v; //选中的文件信息
					let isFile = v.fileUrl || v.imgList.length ? false : true;
					this.$store.state.details.cameraType = v.spotClassTypeName == '视频' ? 1 : 2;
					uni.navigateTo({
						url: "/pages/photoSubmission/photoSubmission?implement=" + isFile +"&id=" + this.options.id
					})
				} else if (item.IsEnabled && !item.IsFinishAhead) {
					uni.showToast({
						title: '请先完成上刊的拍摄与审核。',
						icon: 'none',
						mask: true
					})
					return false;
				} else {
					if (v.fileUrl) {
						if (v.spotClassTypeName == '视频') {
							this.controls = true;
							// let id = 'myvideo' + index;
							let videoContext = wx.createVideoContext('myvideo', this);
							videoContext.requestFullScreen(); //执行全屏方法
							this.isShow = true;
						} else {
							uni.previewImage({
								current: v.fileUrl,
								urls: [v.fileUrl],
							})
						}
					} else {
						let isEnabledIndex = null;
						let title = '该监播阶段不能操作';
						for (let i = 0; i < this.taskDetail.monitorStages.length; i++) {
							if (this.taskDetail.monitorStages[i].IsEnabled) {
								isEnabledIndex = i;
								break;
							}
						}
						if (index < isEnabledIndex) {
							title = '已经错过了监播阶段，不能进行上传或删除操作！'
						} else if (index > isEnabledIndex) {
							title = '还未到时间监播阶段不能提前操作！'
						}
						uni.showToast({
							title: title,
							icon: 'none',
							mask: true
						})
					}
				}
			},
			/**关闭视屏 */
			closeVideo() {
				//执行退出全屏方法
				let videoContext = wx.createVideoContext('myvideo', this);
				videoContext.exitFullScreen();     
			},
			/**视屏进入、退出全屏 */
			fullScreen(e){
				let isFull = e.detail.fullScreen;
				//视屏全屏时显示加载video，非全屏时，不显示加载video
				this.isShow = isFull;
			},
			// 提交
			submitCh() {
				console.log(this.taskDetail)
				if (this.suo) {
					return false;
				}
				this.suo = true;
				uni.showToast({
					title: '提交中，请勿关闭当前页面',
					icon: 'none',
					mask: true
				})
				uni.showLoading({
					title: '提交中..'
				});
				// 提交前删除任务下的所有临时文件
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"taskIdStr":"' + this.options.id + '"}';
				this.$store.dispatch('details/getTaskfileFilequery', {
					parms,
					callback: (res) => {
						const removeSavedFileList = res;
						let bl = [];
						for (let j = 0; j < this.taskDetail.monitorStages.length; j++) {
							for (let i = 0; i < this.taskDetail.monitorStages[j].spotFiles.length; i++) {
								let item = this.taskDetail.monitorStages[j].spotFiles[i];
								if (item.status == -1 || item.status == -2) {
									let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"verificationCode":"' + md5.hex_md5(item.fileUrl) + '","taskId":"' + item.taskId +
											'","shootTime":"' + item.shootTime + '","lat":"' + item.lat + '","lon":"' + item.lon + '","location":"' + item.location +
											'","monitorStage":"' + item.monitorStage + '","spotClassType":"' + item.spotClassType + '","fileType":"' + item
											.fileType + '","description":"' + item.description + '","phoneSystem":"' + item.phoneSystem +
											'","phoneSystemVersion":"' + item.phoneSystemVersion + '","phoneModel":"' + item.phoneModel + '","id":"' + item.id + '"}';
									let fileUrl = item.fileUrl;
									//文件在本地未上传到服务器，调uni.uploadFile
									if (item.UploadStatus == 0) {
										bl.push(i);
										new Promise((resolve, reject) => {
											this.$store.dispatch('myList/spotFileUploadAll', {
												parms,
												fileUrl,
												callback: (res) => {
													console.log(res);
													res = JSON.parse(res)
													if (res.errorCode == 0) {
														// 提交成功后,删除任务缓存本地图片
														removeSavedFileList.forEach((val) => {
															wx.removeSavedFile({
																filePath: val.fileUrl,
															});
														})
														resolve(item)
													} else {
														reject(item)
													}
													uni.showToast({
														title: res.errorMsg,
														icon: 'none',
														mask: true
													})
													uni.hideLoading();
												}
											})
										}).then((item) => {
											this.fileUpdateStatus('0', item)
										}).catch((item) => {
											this.fileUpdateStatus('-2', item)
										})
									} else {
										bl.push(i);
										new Promise((resolve, reject) => {
											this.$store.dispatch('myList/spotFileUploadAlls', {
												parms,
												callback: (res) => {
													console.log(res);
													if (res.errorCode == 0) {
														// 提交成功后,删除任务缓存本地图片
														removeSavedFileList.forEach((val) => {
															wx.removeSavedFile({
																filePath: val.fileUrl,
															});
														})
														resolve(item)
													} else {
														reject(item)
													}
													uni.showToast({
														title: res.errorMsg,
														icon: 'none',
														mask: true
													})
													uni.hideLoading();
												}
											})
										}).then((item) => {
											this.fileUpdateStatus('0', item)
										}).catch((item) => {
											this.fileUpdateStatus('-2', item)
										})
									}       
								}
							}
						}
						if (bl.length == 0) {
							uni.showToast({
								title: '暂无待提交图片或视频!',
								icon: 'none',
								mask: true
							})
						}
					}
				})
				
			},
			// 更新文件状态
			fileUpdateStatus(status, item) {
				console.log(item)
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":' + item.id + ',"status":"' + status +
					'"}';
				this.$store.dispatch('details/taskfileUpdateStatus', {
					parms,
					callback: (res) => {
						uni.switchTab({
							url: '/pages/index/index'
						})
						this.suo = false;
						this.$store.state.home.isRefresh = true;
					}
				})
			},
			tabChange(index) {
				this.currentIndex = index;
			},
			//查获取所有临时文件数据
			getTaskfileFilequery() {
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"taskIdStr":""}';
				this.$store.dispatch('details/getTaskfileFilequery', {
					parms,
					callback: (res) => {
						console.log('文件list', res)
						this.temporaryFileList = res;
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #edecea;
	}
</style>
<style lang="scss" scoped>
	@import './details.scss';
</style>
