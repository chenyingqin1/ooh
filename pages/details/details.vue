<template>
	<view class="page">
		<view class="contentBox">
			<view class="detailsInfo">
				<view class="title">
					<view class="name">任务名称：2018-coke-地铁测试-上海-1</view>
					<view class="time">
						<view>2018-05-15 至 2018-05-20</view>
					</view>
				</view>
				<view class="info">
					<view>媒体规格：Bus Shelter</view>
					<view>媒体规格：Bus Shelter</view>
					<view>任务地址：黄剖南路</view>
					<view>活动名称：地铁测试</view>
				</view>
			</view>
			<view class="monitorStage">
				<view class="condition">
					<view class="title">监播阶段</view>
					<view class="content clearfloat">
						<view class="tab cur" >
							<view class="n">上刊（2）</view>
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
				currentIndex: 0,
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
		
		},
		onShow: function() {
			
		},
		onLoad: function(options) {
			
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
