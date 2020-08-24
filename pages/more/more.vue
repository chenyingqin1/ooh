<template>
	<view class="page">
		<view class="moreList bt">
			<navigator hover-class="none" url="/pages/statement/statement" >
				<view class="item">知识产权申明<text class="icon"></text></view>
			</navigator>
			<navigator hover-class="none" url="/pages/about/about" >
				<view class="item">关于我们<text class="icon"></text></view>
			</navigator>
			<view class="item" @click="onHelp">Help<text class="icon"></text></view>
			<view class="item">GPS定位<text class="icon"></text></view>
			<navigator hover-class="none" url="/pages/cacheSetup/cacheSetup" >
				<view class="item">缓存设置<text class="icon"></text></view>
			</navigator>
		</view>
		<view class="videoLayer" @click="close" v-if="isShow"></view>
		<video id="videoId" v-if="isShow" :src="videoUrl" autoplay="true" :bindfullscreenchange="fullScreen"  :bindended="closeVideo"  controls></video>
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
				isReady: false,
				isShow: false,
				videoUrl: '',
			}
		},
		computed: {
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
		},
		onShow: function() {
			this.videoUrl = config.videoUrl;
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
			onHelp(){
				// let videoContext = wx.createVideoContext('videoId', this);
				// videoContext.requestFullScreen(); //执行全屏方法
				this.isShow = true;
			},
			close() {
				this.isShow = false;
			},
			/**关闭视屏 */
			// closeVideo() {
			// 	//执行退出全屏方法
			// 	let videoContext = wx.createVideoContext('videoId', this);
			// 	videoContext.exitFullScreen();     
			// 	this.isShow = false;
			// },
			// /**视屏进入、退出全屏 */
			// fullScreen(e){
			// 	let isFull = e.detail.fullScreen;
			// 	//视屏全屏时显示加载video，非全屏时，不显示加载video
			// 	this.isShow = isFull;
			// },
		},

	}
</script>
<style lang="scss">
	page {
		background: #edecea;
	}
</style>
<style lang="scss" scoped>
	@import './more.scss';
</style>
