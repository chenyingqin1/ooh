<template>
	<view class="page">
		<view class="moreList bt">
			<navigator hover-class="none" url="/pages/statement/statement" >
				<view class="item">知识产权申明<text class="icon"></text></view>
			</navigator>
			<navigator hover-class="none" url="/pages/about/about" >
				<view class="item">关于我们<text class="icon"></text></view>
			</navigator>
			<view class="item">Help<text class="icon"></text></view>
			<view class="item">GPS定位<text class="icon"></text></view>
		</view>
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
				isReady: false
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
