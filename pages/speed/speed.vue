<template>
	<view class="page">
		<view class="title flex-box">
			<view class="flex-two">活动名称</view>
			<view class="flex-one">上刊</view>
			<view class="flex-one">下刊</view>
		</view>
		<view style="height: 88rpx;"></view>
		<scroll-view class="scroll" :scroll-y="true" :style="{height: systemInfo.windowHeight-44 +'px'}" :enable-back-to-top="true" refresher-enabled="true" :refresher-triggered="triggered" @refresherrefresh="onRefresh" @scrolltolower="updateRefresh" @refresherrestore="onRestore" >
			<view class="info">
				<view class="list flex-box" v-for="(item, index) in campaignList" :key="index">
					<view class="flex-two">{{item.name}}</view>
					<view class="flex-one" v-for="(v, i) in item.monitorStages" :key="i" v-if="v.displayName == '上刊' || v.displayName == '下刊'">{{v.value}}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import allPage from "@/mixin/allPage_MX"
	export default {
		mixins: [allPage],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				pageNo: 1,
				pageSize: 12,
				campaignList: [],
				list: [{
					name: '地铁测试',
					time: '0/2',
					time1: '0/2',
				},{
					name: '2018 Bmw Pitch',
					time: '0/2',
					time1: '0/2',
				},{
					name: 'ITTest2017',
					time: '0/2',
					time1: '0/2',
				}],
				triggered: false,
				updateLock: false,
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.userLogin.systemInfo
			},
		},
		onShow: function() {
			// Object.assign(this.$data,this.$options.data())
			this.onRefresh();
		},
		onLoad: function(options) {
			// this.getData();
			// setTimeout(() => {
				// this.triggered = true;
			// }, 1000)
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
				if(!this.updateLock){
					this.updateLock = true;
				}else{
					return;
				}
				let parms = '},"campaignQuery":{"pageNo":' + this.pageNo + ',"pageSize":' + this.pageSize +'}';
				this.$store.dispatch('speed/getCampaigninfo', {parms,
					callback: (res) => {
						console.log(res);
						if (res.errorCode == 0) {
							let data = res.campaignResult.campaignInfos;
							this.campaignList.push(...data)
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
			onRefresh() {
				if (this.freshing) return;
				this.updateLock = false;
				this.freshing = true;
				if (!this.triggered){//界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;  
				};
				this.pageNo = 1;
				this.campaignList = [];
				this.getData();
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			// 上拉加载
			updateRefresh() {
				this.pageNo++;
				this.getData();
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
	@import './speed.scss';
</style>
