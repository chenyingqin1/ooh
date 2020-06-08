<template>
	<view class="page">
		<view class="about bt">
			<view class="con">
				Posterscope是全球领先的户外传播代理公司。
			</view>
			<view class="con">
				Posterscope全球营业额超过22亿美元，我们有
				700多名员工分布在32个国家、53个营业点。
			</view>
			<view class="con">
				我们致力于在相互联结的经济时代中，不断开创对
				户外传播角色的认识，帮助客户实现简明、实效的户外
				投放。
			</view>
			<view class="con">
				过去我们常说历史成就现在，而今，未来将决定现
				世的走向。
			</view>
			<view class="con">
				我们的独到之处在于，更加了解新技术的应用及消
				费者在户外的行为，并将两者结合，为广告主创造户外
				传播新机会。
			</view>
			<view class="edition">版本号：01.01.0320</view>
		</view>
		<view class="outLogin" @click="outLogin">退出登录</view>
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
			outLogin(){
				uni.reLaunch({
					url: '/pages/login/login'
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
	@import './about.scss';
</style>
