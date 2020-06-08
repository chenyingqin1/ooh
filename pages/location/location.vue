<template>
	<view class="page">
		<view class="explain">【说明】</br>若网络或GPS信号不稳定时，则默认该定位地址</view>
		<view class="outLogin" @click="outLogin">获取定位</view>
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
				
			}
		},
		computed: {
		
		},
		onShow: function() {
			
		},
		onLoad: function(options) {
			wx.getLocation({
				type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				success: function (res) {
			        console.log(res)
				},
			})
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
			
		},

	}
</script>
<style lang="scss">
	page {
		background: #edecea;
	}
</style>
<style lang="scss" scoped>
	@import './location.scss';
</style>
