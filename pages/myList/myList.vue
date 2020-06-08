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
									<view>品牌：{{item.brandName}}</view>
									<view class="state">
										<text class="stateNane">待发送</text>
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
								<text class="stateNane">待发送</text>
							</view>
							<view class="checkBox s" :class="{cur:item.checkBox}" @click.stop="selectCh(index)"></view>
							<image class="img" mode="aspectFill" v-if="item.spotClassTypeName.indexOf('图片') != -1" :src="item.fileUrl">
							<video class="img" id="myVideo" v-if="item.spotClassTypeName.indexOf('视频') != -1" :src="item.fileUrl" :controls="false"></video>
						</view>
					</view>
				</view>
				<view class="noData" v-else><image mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/no-task-list.png" /></view>
			</block>
			<block  v-if="currentIndex == 1">
				<view class="listWrap" :class="{cur:present}">
					<view class="item" v-if="spotFilesList.length > 0" :class="{cur:present}" @click="goPictureDet(item)" v-for="(item, index) in spotFilesList" :key="index">
						<view class="block cur" v-if="!present">
							<view class="title">
								<view class="name">
									<view>品牌：{{item.brandName}}</view>
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
							<image class="img" mode="aspectFill" v-if="item.spotClassTypeName.indexOf('图片') != -1" :src="item.fileUrl">
							<video class="img" id="myVideo" v-if="item.spotClassTypeName.indexOf('视频') != -1" :src="item.fileUrl" :controls="false"></video>
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
				taskfileList: [],
				spotFilesList: [],
				selectAllCheck: false,
				selectData: [],
				triggered: false,
				updateLock: false,
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
				this.updateLock = false;
				this.freshing = true;
				if (!this.triggered){//界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;  
				};
				this.pageNo = 1;
				this.taskfileList = [];
				this.spotFilesList = [];
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
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":' + ids + '}';
				uni.showModal({  
					// title: '删除确认',  
					cancelText:'确定',  
					confirmText:'取消',  
					content: '确定删除选中的任务吗？',  
					success: (res) => {  
						if (!res.confirm) {  
							this.$store.dispatch('myList/taskfileDelete', {parms,
								callback: (res) => {
									console.log(res);
									if (res.errorCode == 0) {
										for(let i=0; i<this.taskfileList.length; i++){
											for(let j=0; j<this.selectData.length; j++){
												if(this.taskfileList[i].id == this.selectData[j].id){
													this.taskfileList.splice(i,1)
												}
											}
										}
										uni.showToast({
											title: '删除成功',
											icon: 'none',
											mask: true
										})
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
				uni.showLoading({
					title: '提交中..'
				});
				let bl = false;
				console.log(this.selectData)
				for(let i=0; i<this.selectData.length; i++){ 
					let item = this.selectData[i];
					let parms = '},"spotFile":{"verificationCode":"' + md5.hex_md5(item.fileUrl) + '","taskId":"' + item.taskId + '","shootTime":"' + item.shootTime + '","lat":"' + item.lat + '","lon":"' + item.lon + '","location":"' + item.location + '","monitorStage":"' + item.monitorStage + '","spotClassType":"' + item.spotClassType + '","fileType":"' + item.fileType + '","description":"' + item.description + '","phoneSystem":"' + item.phoneSystem + '","phoneSystemVersion":"' + item.phoneSystemVersion + '","phoneModel":"' + item.phoneModel + '"}';
					let inparm = {
						spotfile: item.fileUrl,
					}
					this.$store.dispatch('myList/spotFileUploadAll', {parms,
						callback: (res) => {
							console.log(res);
							if (res.errorCode != 0) {
								uni.showToast({
									title: res.errorMsg,
									icon: 'none',
									mask: true
								})
								bl = true;
							}
						},inparm
					})
					if(bl){
						break;
					}
				}
				if(!bl){
					uni.showToast({
						title: '提交成功',
						icon: 'none',
						mask: true
					})
				}
				uni.hideLoading();
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
