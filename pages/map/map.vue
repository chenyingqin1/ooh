<template>
	<view class="page flex-box flex-col" hover-class="none" hover-stop-propagation="false">
		<map id="map" class="map flex-one" :longitude="selectTempFlie.gcj02lon" :latitude="selectTempFlie.gcj02lat" :markers="markers" :polyline="polyline" scale="13" show-location></map>
		<image class="icon" @click="clickcontrol" mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/map_location.png" />
		<view class="tips">距离 {{selectTempFlie.distanceName}}</view>
	</view>
</template>
<script>
	import allPage from "@/mixin/allPage_MX";
	import config from '@/common/config.js'
	export default {
		mixins: [allPage],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				latitude: null,   //默认定位纬度
				longitude: null,  //默认定位经度
				markers: [],
				polyline:[]
			}
		},
		computed: {
			selectTempFlie() {
				return this.$store.state.details.selectTempFlie
			},
			taskDetailInfo() {
				return this.$store.state.details.taskDetailInfo
			},
		},
		onShow: function() {
			console.log(this.taskDetailInfo)
			let _this = this;
			wx.getLocation({
				type: "wgs84",
				success: function (res) {
					_this.latitude = res.latitude;
					_this.longitude = res.longitude;
					_this.markers = [
					{
						id: 0,
						iconPath: "https://oohmonitoring.dentsuaegis.cn:8081/images/icons/map_pai.png",
						latitude: _this.selectTempFlie.gcj02lat,
						longitude: _this.selectTempFlie.gcj02lon,
						width: 50,  //图片显示宽度
						height: 50  //图片显示高度
					},
					{
						id: 1,
						iconPath: "https://oohmonitoring.dentsuaegis.cn:8081/images/icons/map_task.png",
						latitude: _this.taskDetailInfo.taskResult.tasks[0].gcj02lat,
						longitude: _this.taskDetailInfo.taskResult.tasks[0].gcj02lon,
						width: 50,  //图片显示宽度
						height: 50  //图片显示高度
					}]
					_this.polyline = [{
						points: [{
							latitude: _this.selectTempFlie.gcj02lat,
							longitude: _this.selectTempFlie.gcj02lon,
						},{
							latitude: _this.taskDetailInfo.taskResult.tasks[0].gcj02lat,
							longitude: _this.taskDetailInfo.taskResult.tasks[0].gcj02lon,
						}],
						color: "#ff0000",
						width: 2,
					}]
				}
			})
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
			clickcontrol(e) {
			    let mpCtx = wx.createMapContext("map");
			    mpCtx.moveToLocation();
			},
		},

	}
</script>
<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		.map{
			width: 100%;
			position: relative;
		}
		.tips{
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			background: #fff;
			padding-left: 40rpx;
		}
		.icon{
			position: absolute;
			bottom: 150rpx;
			right: 20rpx;
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>
