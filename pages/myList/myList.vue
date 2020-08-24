<template>
	<view class="page">
		<view class="header">
			<view class="tab">
				<view v-for="(item, index) in tabList" :key="index" @click="tabChange(index)" :class="{cur:currentIndex == index}">{{item}}</view>
			</view>
			<view class="icon" :class="{cur:present}" @click="textSwitch"></view>
		</view>
		<view style="height: 110rpx"></view>
		<scroll-view class="scroll" :scroll-y="true" :style="{height: systemInfo.windowHeight-scrollViewheight +'px'}" :enable-back-to-top="true" refresher-enabled="true" :refresher-triggered="triggered" @refresherrefresh="onRefresh" @scrolltolower="updateRefresh" @refresherrestore="onRestore" >
			<block v-if="currentIndex == 0">
				<view class="listWrap" :class="{cur:present}" v-if="taskfileList.length > 0" >
					<view class="item" :class="{cur:present}" v-for="(item, index) in taskfileList" :key="index">
						<view class="block" @click="goPictureDet(item)" v-if="!present">
							<view class="checkBox" :class="{cur:item.checkBox}" @click.stop="selectCh(index)"></view>
							<view class="title">
								<view class="name">
									<!-- <view>品牌：{{item.brandName}}</view> -->
									<view class="brand"><image class="icon" mode="aspectFit" :src="item.Brandlogo">{{item.brandName}}</view>
									<view class="state">
										<text class="stateNane" :class="{cur:item.status == '-2'}">{{item.status | statusName}}</text>
									</view>
								</view>
								<view class="time">任务名称：{{item.taskName}}</view>
							</view>
							<view class="info">
								<view>时间：{{timestampToTime(item.shootTime)}}</view>
								<view>地址：{{item.taskLocation}}</view>
								<view class="flex-box">
									<view class="flex-one">文件类型：{{item.spotClassTypeName}}</view>
									<view class="flex-one">监播阶段：{{item.monitorStageName}}</view>
								</view>
							</view>
						</view>
						<view class="block1" @click="goPictureDet(item)" v-if="present">
							<view class="state">
								<text class="stateNane">{{item.status | statusName}}</text>
							</view>
							<view class="checkBox s" :class="{cur:item.checkBox}" @click.stop="selectCh(index)"></view>
							<view class="img">
								<image class="iv" mode="aspectFill" v-if="item.spotClassTypeName.indexOf('图片') != -1" :src="item.fileUrl">
								<video class="iv" id="myVideo" v-if="item.spotClassTypeName.indexOf('视频') != -1" :src="item.fileUrl" :controls="false" :show-center-play-btn="false"></video>
								<image class="icon" v-if="item.spotClassTypeName.indexOf('视频') != -1" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/icon_play.png">
							</view>
						</view>
					</view>
				</view>
				<view class="noData" v-else><image mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/no-task-list.png" /></view>
			</block>
			<block  v-if="currentIndex == 1">
				<view class="listWrap" :class="{cur:present}">
					<view class="item" v-if="spotFilesList.length > 0" :class="{cur:present}" @click="goPictureDet(item)" v-for="(item, index) in spotFilesList" :key="index">
						<view class="block cur" v-if="!present">
							<image class="iconYs" v-if="item.status == 1" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/yishen.png">
							<view class="title">
								<view class="name">
									<!-- <view>品牌：{{item.brandName}}</view> -->
									<view class="brand"><image class="icon" mode="aspectFit" :src="item.Brandlogo">{{item.brandName}}</view>
								</view>
								<view class="time">任务名称：{{item.taskName}}</view>
							</view>
							<view class="info">
								<view>时间：{{timestampToTime(item.shootTime)}}</view>
								<view>地址：{{item.taskLocation}}</view>
								<view class="flex-box">
									<view class="flex-one">文件类型：{{item.spotClassTypeName}}</view>
									<view class="flex-one">监播阶段：{{item.monitorStageName}}</view>
								</view>
							</view>
						</view>
						<view class="block1" v-if="present">
							<view class="img">
								<image class="iv" mode="aspectFill" v-if="item.spotClassTypeName.indexOf('图片') != -1" :src="item.fileUrl">
								<video class="iv" id="myVideo" v-if="item.spotClassTypeName.indexOf('视频') != -1" :src="item.fileUrl" :controls="false" :show-center-play-btn="false"></video>
								<image class="icon" v-if="item.spotClassTypeName.indexOf('视频') != -1" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/icon_play.png">
								<image class="iconYs" v-if="item.status == 1" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/yishen.png">
							</view>
						</view>
					</view>
					<view class="noData" v-else><image mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/no-task-list.png" /></view>
				</view>
			</block>
		</scroll-view>
		<view v-if="currentIndex == 0" style="height: 80rpx;"></view>
		<view class="operation" v-if="currentIndex == 0">
			<view class="selectAll" @click="selectAllCh"><text class="icon" :class="{cur:selectAllCheck}"></text>全选</view>
			<view class="but" @click="deleteCh">删除</view>
			<view class="but cur" @click="submitCh">提交</view>
		</view>
	</view>
</template>
<script>
	const md5 = require('@/util/md5.js')
	import allPage from "@/mixin/allPage_MX";
	import publicCheck from "@/mixin/publicCheck_MX.js";
	export default {
		mixins: [allPage,publicCheck],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				scrollViewheight: 100,
				currentIndex: 0,
				tabList: ['待发送', '已完成'],
				present: false,
				pageNo: 1,
				pageSize: 12,
				statusName: '',
				taskfileList: [],
				spotFilesList: [],
				selectAllCheck: false,
				selectData: [],
				triggered: false,
				updateLock: false,
				noGet: false,
			}
		},
		filters: {
			statusName: function(state) {
				return state == -1 ? "待发送" :
					state == -2 ? "发送失败" : ""
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.userLogin.systemInfo
			},
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
		},
		onShow: function() {
			if(this.currentIndex == 0 && this.taskfileList.length != wx.getStorageSync("taskfileListNumber") && this.noGet){
				this.onRefresh()
			}
		},
		onLoad: function(options) {
			this.getData();
		},
		mounted() {
			
		},
		watch: {
			
		},
		onPageScroll: function(e) {
			
		},
		onHide: function(){
			this.noGet = true;
		},
		methods: {
			getData(){
				if(!this.updateLock){
					this.updateLock = true;
				}else{
					return;
				}
				uni.showLoading({
					title: '加载中'
				});
				if(this.currentIndex == 0){
					this.getTaskfileData();
				}else{
					this.getSpotFilesData();
				}
			},
			// 待发送
			getTaskfileData(){
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"pageNo":' + this.pageNo + ',"pageSize":' + this.pageSize + ',"keyword":""}';
				this.$store.dispatch('myList/getTaskfileList', {parms,
					callback: (res) => {
						console.log(res);
						if (res.errorCode == 0) {
							let data = res.spotFileResult.spotFiles;
							for(let i=0; i<data.length; i++){
								data[i].checkBox = false;
							}
							this.taskfileList.push(...data)
							if(data.length){
								this.updateLock = false;
							}
						}else{
							uni.showToast({
								title: res.errorMsg, 
								icon: 'none',
								mask: true
							})
						}
						this.triggered = false;
						this.freshing = false;
						uni.hideLoading();
					},
				})
			},
			// 已完成
			getSpotFilesData(){
				let parms = '},"spotFileQuery":{"pageNo":' + this.pageNo + ',"pageSize":' + this.pageSize + ',"keyword":""}';
				this.$store.dispatch('myList/getSpotFilesList', {parms,
					callback: (res) => {
						console.log(res);
						if (res.errorCode == 0) {
							let data = res.spotFileResult.spotFiles;
							this.spotFilesList.push(...data)
							if(data.length){
								this.updateLock = false;
							}
						}else{
							uni.showToast({
								title: res.errorMsg,
								icon: 'none',
								mask: true
							})
						}
						this.triggered = false;
						this.freshing = false;
						uni.hideLoading();
					},
				})
			},
			// 查看图片
			goPictureDet(item){
				this.$store.state.myList.pictureDetInfo = item;
				uni.navigateTo({
				    url: "/pages/pictureDet/pictureDet"
				})
			},
			// 触发下拉刷新
			onRefresh() {
				if (this.freshing) return;
				this.selectAllCheck = false;
				this.updateLock = false;
				this.freshing = true;
				if (!this.triggered){//界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;  
				};
				this.pageNo = 1;
				this.taskfileList = [];
				this.spotFilesList = [];
				// 调用allPage里面的myListTips重新赋值角标
				this.myListTips();
				this.getData();
			},
			// 上拉加载
			updateRefresh() {
				this.pageNo++;
				this.getData();
			},
			// 下拉刷新复位
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			// 状态切换
			tabChange(index){
				this.currentIndex = index;
				this.onRefresh();
				this.scrollViewheight = index == 0 ? 100 : 60;
			},
			// 图文呈现切换
			textSwitch(){
				this.present = !this.present;
			},
			// 任务选择
			selectCh(index){
				this.$set(this.taskfileList[index], 'checkBox', !this.taskfileList[index].checkBox);
				// 全选状态联动
				let b1 = false;
				for(let i=0; i<this.taskfileList.length; i++){
					if(!this.taskfileList[i].checkBox){
						b1 = true;
						break;
					}
				}
				this.selectAllCheck = b1 ? false : true;
				// 获取选中数据
				this.selectData = [];
				for(let j=0; j<this.taskfileList.length; j++){
					if(this.taskfileList[j].checkBox){
						this.selectData.push(this.taskfileList[j])
					}
				}
				console.log(this.selectData)
			},
			// 全选
			selectAllCh(){
				this.selectAllCheck = !this.selectAllCheck;
				for(let i=0; i<this.taskfileList.length; i++){
					this.$set(this.taskfileList[i], 'checkBox', this.selectAllCheck);
				}
				// 获取选中数据
				this.selectData = this.selectAllCheck ? this.taskfileList : [];
			},
			// 删除
			deleteCh(){
				if(!this.selectData.length){
					uni.showModal({
						content: '请选择要删除的任务。',
						showCancel:false
					});
					return false;
				}
				console.log(this.selectData)
				let ids = [];
				for(let i=0; i<this.selectData.length; i++){
					ids.push(this.selectData[i].id)
				}
				ids.join(',')
				console.log(ids)
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":"' + ids + '"}';
				uni.showModal({
					content: '确定删除选中的任务吗？',  
					success: (res) => {  
						if (res.confirm) {
							this.$store.dispatch('myList/taskfileDelete', {parms,
								callback: (res) => {
									console.log(res);
									if (res.errorCode == 0) {
										uni.showToast({
											title: '删除成功',
											icon: 'none',
											mask: true
										})
										// 提交前删除任务下的所有临时文件
										this.selectData.forEach((val) => {
											if (val.UploadStatus == 0) {
												// 删除存储的垃圾数据
												wx.removeSavedFile({
													filePath: val.fileUrl,
												});
											}
										})
										this.onRefresh();
									}else{
										uni.showToast({
											title: res.errorCode,
											icon: 'none',
											mask: true
										})
									}
								},
							}) 
						} else {  
							//取消  
						}  
					}  
				}) 
			},
			// 提交
			submitCh(){
				if(!this.selectData.length){
					uni.showModal({
						content: '请选择要提交的任务。',
						showCancel:false
					});
					return false;
				}
				uni.showToast({
					title: '提交中，请勿关闭当前页面',
					icon: 'none',
					mask: true
				})
				this.getTaskfileFilequery();
				console.log(this.selectData);
				for(let i=0; i<this.selectData.length; i++){ 
					let item = this.selectData[i];
					let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"verificationCode":"' + md5.hex_md5(item.fileUrl) + '","taskId":"' + item.taskId + '","shootTime":"' + item.shootTime + '","lat":"' + item.lat + '","lon":"' + item.lon + '","location":"' + item.location + '","monitorStage":"' + item.monitorStage + '","spotClassType":"' + item.spotClassType + '","fileType":"' + item.fileType + '","description":"' + item.description + '","phoneSystem":"' + item.phoneSystem + '","phoneSystemVersion":"' + item.phoneSystemVersion + '","phoneModel":"' + item.phoneModel + '","id":"' + item.id + '"}';
					let fileUrl = item.fileUrl;
					if (item.UploadStatus == 0) {
						new Promise((resolve, reject) => {
							this.$store.dispatch('myList/spotFileUploadAll', {parms, fileUrl,
								callback: (res) => {
									console.log(res);
									res = JSON.parse(res)
									uni.showToast({
										title: res.errorMsg,
										icon: 'none',
										mask: true
									})
									setTimeout(()=>{ //为了不让提示信息一闪而过
										if (res.errorCode == 0) {
											resolve(item)
											// 提交前删除任务下的所有临时文件
											this.selectData.forEach((val) => {
												// 删除存储的垃圾数据
												wx.removeSavedFile({
													filePath: val.fileUrl,
												});
											})
										} else {
											reject(item)
										}
									},1000);
								}
							})
						}).then((item) => {
							this.fileUpdateStatus('0', item)
						}).catch((item) =>{
							this.fileUpdateStatus('-2', item)
						})
					} else {
						new Promise((resolve, reject) => {
							this.$store.dispatch('myList/spotFileUploadAlls', {parms,
								callback: (res) => {
									console.log(res);
									uni.showToast({
										title: res.errorMsg,
										icon: 'none',
										mask: true
									})
									setTimeout(()=>{ //为了不让提示信息一闪而过
										if (res.errorCode == 0) {
											resolve(item)
											// 提交前删除任务下的所有临时文件
											this.selectData.forEach((val) => {
												// 删除存储的垃圾数据
												wx.removeSavedFile({
													filePath: val.fileUrl,
												});
											})
										} else {
											reject(item)
										}
									},1000);
								}
							})
						}).then((item) => {
							this.fileUpdateStatus('0', item)
						}).catch((item) =>{
							this.fileUpdateStatus('-2', item)
						})
					}
				}
			},
			// 更新文件状态
			fileUpdateStatus(status, item){
				console.log(item)
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":' + item.id + ',"status":"' + status + '"}';
				this.$store.dispatch('details/taskfileUpdateStatus', {parms,
					callback: (res) => {
						this.onRefresh();
					}
				})
			},
			getTaskfileFilequery() {
				// 删除任务下的所有临时文件
				let ids = [];
				for (let j=0; j<this.selectData.length; j++) {
					ids.push(this.selectData[j].taskId)
				}
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"taskIdStr":"' + ids.join(',') +'"}';
				this.$store.dispatch('details/getTaskfileFilequery', {
					parms,
					callback: (res) => {
						console.log('文件list', res)
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
	@import './myList.scss';
</style>
