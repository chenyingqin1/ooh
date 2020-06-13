<template>
	<view class="page">
		<view class="contentBox">
			<view class="detailsInfo">
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
							<view class="tab" :class="{cur: currentIndex == index}" @click="tabChange(index)">
								<view class="n">{{item.displayName}}<block v-if="item.value != '0'">（{{item.value}})</block></view>
							</view>
							<view class="fileList clearfloat" v-show="currentIndex == index">
								<view class="item" v-for="(v, i) in item.spotFiles" :key="i">
									<view class="name">{{v.spotClassTypeName}}</view>
									<view class="file" :class="{cur:v.fileUrl}" @click="operationImage(item, v, i)">
										<block v-if="v.fileUrl">
											<text class="reviewed" v-if="v.status == 1">已审</text>
											<text class="isImgLists" v-if="v.imgList.length > 1"></text>
											<image class="icon y" mode="widthFix" v-if="v.status == 0" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/yun.png">
											<image class="icon" mode="widthFix" @click.stop="deleteCh(item, v)" v-if="v.status == 0 || v.status == -1 || v.status == -2" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/del.png">
											<image class="img" mode="aspectFill" v-if="v.fileUrl && v.spotClassTypeName.indexOf('图片') != -1" :src="v.fileUrl">
											<video class="img" :custom-cache="false" :id="'myvideo' + i" v-if="v.spotClassTypeName == '视频'" :show-center-play-btn="false" :controls="controls" bindended="endAction" :src="v.fileUrl"></video>
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
				journalList: [{
					'name': '上刊（2）',
					'time': '05.01-05.01'
				},{
					'name': '监播1',
					'time': '05.01-05.02'
				},{
					'name': '监播2',
					'time': '05.01-05.03'
				},{
					'name': '下刊',
					'time': '05.01-05.04'
				}],
				showList:['中国', '美国', '巴西', '日本'],
			}
		},
		computed: {
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
		},
		onShow: function() {
			this.getData();
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
			getData(){
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"taskQuery":{"taskId":' + this.options.id + '}';
				this.$store.dispatch('details/getTaskDetail', {parms,
					callback: (res2) => {
						console.log(res2);
						if (res2.errorCode == 0) {
							let data = res2.taskResult.tasks[0];
							for(let i=0; i<data.monitorStages.length; i++){
								if(data.monitorStages[i].IsEnabled == true){
									this.currentIndex = i;
								}
							}
							this.taskDetail = data;
						}else{
							uni.showToast({
								title: res2.errorMsg,
								icon: 'none',
								mask: true
							})
						}
					},
				})
			},
			// 删除
			deleteCh(item, v){
				console.log(item)
				// if(!item.IsEnabled){
				// 	return false;
				// }
				uni.showModal({
					cancelText:'确定',  
					confirmText:'取消',  
					content: '确定删除该文件吗？',  
					success: (res) => {  
						if (!res.confirm) {  
							if(v.status == -1 || v.status == -2){
								let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"taskId":' + v.taskId + ', "spotClassType":' + v.spotClassType + ', "monitorStage":' + v.monitorStage + '}';
								this.$store.dispatch('myList/taskfileDelete', {parms,
									callback: (res) => {
										this.getData()
									},
								})
							}else if(v.status == 0){
								let parms = '},"spotFile":{"id":' + v.id + '}';
								this.$store.dispatch('details/fileDelete', {parms,
									callback: (res) => {
										this.getData()
									},
								})
							}
						}  
					}  
				}) 
			},
			// 图片/视频点击
			operationImage(item, v, index){
				console.log(v)
				// if(!item.IsEnabled){
				// 	return false;
				// }
				if(v.status == 1){
					if(v.spotClassTypeName == '视频'){
						this.controls = true;
						let id = 'myvideo'+index;
						let videoContext = wx.createVideoContext(id, this);
						videoContext.requestFullScreen();//执行全屏方法
					}else{
						uni.previewImage({
							urls: [v.fileUrl],
							current: 0
						})
					}
				}else{
					this.$store.state.details.seleSpotFile = v; //选中的文件信息
					let isFile = v.fileUrl ? false : true;
					let cameraType = v.spotClassTypeName == '视频' ? 1 : 2;
					uni.navigateTo({
					    url: "/pages/photoSubmission/photoSubmission?implement=" + isFile + "&cameraType=" + cameraType
					})
				}
			},
			// 提交
			submitCh(){
				console.log(this.taskDetail)
				let index = '-1';
				// 查找当前监播阶段
				for(let i=0; i<this.taskDetail.monitorStages.length; i++){
					if(this.taskDetail.monitorStages[i].IsEnabled == true){
						index = i;
					}
				}
				index = 0;
				// if(index != '-1'){
					uni.showToast({
						title: '提交中，请勿关闭当前页面',
						icon: 'none',
						mask: true
					})
					let bl = false;
					for(let i=0; i<this.taskDetail.monitorStages[index].spotFiles.length; i++){
						let item = this.taskDetail.monitorStages[index].spotFiles[i];
						if(item.status == -1 || item.status == -2){
							let parms = '},"spotFile":{"verificationCode":"' + md5.hex_md5(item.fileUrl) + '","taskId":"' + item.taskId + '","shootTime":"' + item.shootTime + '","lat":"' + item.lat + '","lon":"' + item.lon + '","location":"' + item.location + '","monitorStage":"' + item.monitorStage + '","spotClassType":"' + item.spotClassType + '","fileType":"' + item.fileType + '","description":"' + item.description + '","phoneSystem":"' + item.phoneSystem + '","phoneSystemVersion":"' + item.phoneSystemVersion + '","phoneModel":"' + item.phoneModel + '"}';
							let fileUrl = item.fileUrl;
							bl = true;
							new Promise((resolve, reject) => {
								this.$store.dispatch('myList/spotFileUploadAll', {parms, fileUrl,
									callback: (res) => {
										console.log(res);
										res = JSON.parse(res)
										if (res.errorCode == 0) {
											resolve(item)
										} else {
											reject(item)
										}
										uni.showToast({
											title: res.errorMsg,
											icon: 'none',
											mask: true
										})
									}
								})
							}).then((item) => {
								this.fileUpdateStatus('-2', item)
							}).catch((item) =>{
								this.fileUpdateStatus('0', item)
							})
						}
					}
					if(!bl){
						uni.showToast({
							title: '暂无待提交图片或视频!',
							icon: 'none',
							mask: true
						})
					}
				// }
			},
			// 更新文件状态
			fileUpdateStatus(status, item){
				console.log(item)
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":' + item.id + ',"status":"' + status + '"}';
				this.$store.dispatch('details/taskfileUpdateStatus', {parms,
					callback: (res) => {
						this.getData();
					}
				})
			},
			tabChange(index){
				this.currentIndex = index;
			},
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
