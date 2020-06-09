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
					<view>广告主：{{item.client}}</view>
					<view>品牌：{{item.brandName}}</view>
					<view>媒体规格：{{item.mediaName}}</view>
					<view>任务地址：{{item.location}}</view>
					<view>活动名称：{{item.campaignName}}</view>
					<view>说明：{{item.description}}</view>
				</view>
			</view>
			<view class="monitorStage">
				<view class="condition">
					<view class="title">监播阶段</view>
					<view class="content clearfloat">
						<view class="tab cur" >
							<view class="n">上刊（2）</view>
						</view>
						<view class="fileList clearfloat">
							<view class="item">
								<view class="name">图片1</view>
								<view class="file">
									<text class="reviewed">已审</text>
									<!-- <image class="icon" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/del.png"> -->
									<image class="img" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg">
								</view>
							</view>
							<view class="item clearfloat">
								<view class="name">图片2</view>
								<view class="file">
									<image class="icon" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/lock.png">
									<image class="img" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg">
								</view>
							</view>
							<view class="item clearfloat">
								<view class="name">图片2</view>
								<view class="file">
									<image class="icon" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/lock.png">
									<image class="img" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg">
								</view>
							</view>
							<view class="item clearfloat">
								<view class="name">图片3</view>
								<view class="file" @click="goPhotoSubmission(false)">
									
								</view>
							</view>
						</view>
					</view>
					<view class="content clearfloat">
						<view class="tab" >
							<view class="n">下刊</view>
							<!-- <view class="t">{{journaldata.time}}</view> -->
						</view>
						<view class="fileList clearfloat">
							<view class="item">
								<view class="name">图片1</view>
								<view class="file">
									<text class="reviewed">已审</text>
									<!-- <image class="icon" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/del.png"> -->
									<image class="img" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg">
								</view>
							</view>
							<view class="item clearfloat">
								<view class="name">图片2</view>
								<view class="file">
									<image class="icon" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/lock.png">
									<image class="img" mode="aspectFill" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg">
								</view>
							</view>
							<view class="item clearfloat">
								<view class="name">图片3</view>
								<view class="file" @click="goPhotoSubmission(true)">
									
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
		<view class="but">提交</view>
	</view>
</template>
<script>
	import allPage from "@/mixin/allPage_MX";
	export default {
		mixins: [allPage],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				options:null,
				currentIndex: 0,
				taskDetail:{},
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
			
		},
		onLoad: function(options) {
			this.options = options;
			this.getData();
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
				new Promise(resolve => {
					let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"pageNo":"1","pageSize":"12","keyword":"","taskId":"' + this.options.id + '"}';
					this.$store.dispatch('myList/getTaskfileList', {parms,
						callback: (res1) => {
							console.log(res1);
							if (res1.errorCode == 0) {
								let data = res1.spotFileResult.spotFiles;
								resolve(data)
							}else{
								uni.showToast({
									title: res1.errorMsg,
									icon: 'none',
									mask: true
								})
							}
						},
					})
				}).then(res1 => {
					let parms = '},"taskQuery":{"taskId":' + this.options.id + '}';
					this.$store.dispatch('details/getTaskDetail', {parms,
						callback: (res2) => {
							console.log(res2);
							if (res2.errorCode == 0) {
								let data = res2.taskResult.tasks[0];
								for(let i=0; i<data.monitorStages.length; i++){
									data.monitorStages[i].spotFiles = []
									for(let s=0; s<data.monitorStages[i].value2; s++){
										let index = s+1;
										data.monitorStages[i].spotFiles.push({
											"spotClassType": index,
											"spotClassTypeName": "图片" + index,
										})
									}
									for(let z=0; z<data.monitorStages[i].spotFiles.length; z++){
										for(let j=0; j<res1.length; j++){
											if(data.monitorStages[i].displayName == res1[j].monitorStageName && data.monitorStages[i].spotClassTypeName == data.monitorStages[i].spotFiles[z].spotClassTypeName){
												data.monitorStages.spotFiles.push(res1[j])
											}
										}
									}
								}
								console.log(data)
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
				})
				
			},
			tabChange(index){
				this.currentIndex = index;
			},
			goPhotoSubmission(cameraType){
				uni.navigateTo({
				    url: "/pages/photoSubmission/photoSubmission?cameraType=" + cameraType + "&implement=1"
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
