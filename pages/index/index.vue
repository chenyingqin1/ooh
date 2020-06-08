<template>
	<view class="page">
		<view class="header">
			<view class="input">
				<i class="icon"></i>
				<input class="i" placeholder="任务地址" v-model="searchKey" type="text" @confirm="onRefresh" confirm-type="search" />
			</view>
			<view class="switch"><text class="name">所有任务</text><switch class="section-right" color="#398188" @change="switchChange" /></view>
			<view class="screen" @click="$refs.popup.open()">筛选<i class="icon"></i></view>
		</view>
		<view style="height: 90rpx;"></view>
		<scroll-view class="scroll" :scroll-y="true" :style="{height: systemInfo.windowHeight-50 +'px'}" :enable-back-to-top="true" refresher-enabled="true" :refresher-triggered="triggered" @refresherrefresh="onRefresh" @scrolltolower="updateRefresh" @refresherrestore="onRestore" >
			<view class="listWrap" v-if="taskList.length > 0">
				<view class="block" @click="goDetails" v-for="(item,index) in taskList" :key='index'>
					<view class="title">
						<view class="name">任务名称：{{item.name}}</view>
						<view class="time">
							<view>{{item.startDate}} 至 {{item.endDate}}</view>
							<view class="state">
								<!-- <image class="fei" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/send.png"> -->
								<text class="stateNane">{{item.status | statusName}}</text>
							</view>
						</view>
					</view>
					<view class="info">
						<view class="flex-box">
							<view class="flex-one">广告主：{{item.client}}</view>
							<view class="flex-one">品牌：{{item.brandName}}</view>
						</view>
						<view>媒体规格：{{item.mediaName}}</view>
						<view>任务地址：{{item.location}}</view>
						<view>活动名称：{{item.campaignName}}</view>
					</view>
					<view class="flex-box operation">
						<view class="flex-one but" v-for="(item1, index1) in item.monitorStages" :key="index" :class="{cur: item1.value >= 2}">{{item1.displayName}}<text class="icon"></text></view>
					</view>
				</view>
			</view>
			<view class="noData" v-else><image mode="widthFix" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/no-task-list.png" /></view>
			<!-- <image class="goTopIcon" @click.stop="goTopCh()" src="https://oohmonitoring.dentsuaegis.cn:8081/images/icons/goTop1.png" /> -->
		</scroll-view>
		<uniPopup ref="popup" type="right">
			<scroll-view class="scroll searchPopup" :style="{height: systemInfo.windowHeight-50 +'px'}" :scroll-y="true" :show-scrollbar="true">
				<view class="condition">
					<view class="title">投放时间</view>
					<view class="content flex-box">
						<view class="flex-one timeBox">
							<input class="time" :value="startDate" @click="openCalendar('start')" type="text" disabled placeholder="开始时间">
							<text class="eliminate" @click="emptyTime('start')" v-if="startDateEliminate"></text>
						</view>
						<text class="i">-</text>
						<view class="flex-one timeBox">
							<input class="time" :value="endDate"  @click="openCalendar('end')" type="text" disabled placeholder="结束时间">
							<text class="eliminate" @click="emptyTime('end')" v-if="endDateEliminate"></text>
						</view>
					</view>
				</view>
				<view class="condition" v-for="(item1, index1) in filterList" :key="index1" :class="{cur:!item1.open}">
					<view class="title clearfloat">{{item1.typeClass}}<text class="w" v-if="item1.all" :class="{cur:!item1.open}" @click="telescoping(index1)">全部</text></view>
					<view class="content clearfloat">
						<view v-for="(item2, index2) in item1.typeName" :key="index2" @click="selectCh(index1,index2)" :class="[{cur:item2.select},{p: item1.width == 1}]">{{item2.displayName}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="searchOperation flex-box">
				<view class="flex-one" @click="reset">重置</view>
				<view class="flex-one cur" @click="onRefresh">确定</view>
			</view>
		</uniPopup>
		<uni-calendar ref="calendar" :insert="false" @confirm="confirmCalendar"/>
	</view>
</template>
<script>
	import uniPopup from "@/components/uni/uni-popup/uni-popup.vue"
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import allPage from "@/mixin/allPage_MX";
	import config from '@/common/config.js'
	export default {
		mixins: [allPage],
		components: {
			uniPopup,
			uniCalendar
		},
		beforeCreate() {
			
		},
		data() {
			return {
				isReady: false,
				taskList: [],
				pageNo: 1,
				pageSize: 12,
				searchKey: '',
				isAllTask: false,
				clickTime: '',
				startDate: '',
				endDate: '',
				statusName: '',
				filterList: [],
				triggered: false,
				updateLock: false,
			}
		},
		filters: {
			statusName: function(state) {
				return state == 0 ? "未完成" :
					state == 1 ? "待审核" :
					state == 2 ? "待重拍" : 
					state == 3 ? "已完成" : ""
			}
		},
		computed: {
			systemInfo() {
				return this.$store.state.userLogin.systemInfo
			},
			startDateEliminate(){
				if(this.startDate){
					return true
				}else{
					return false
				}
			},
			endDateEliminate(){
				if(this.endDate){
					return true
				}else{
					return false
				}
			},
		},
		onShow: function() {
			
		},
		onLoad: function(options) {
			this.getData();
			this.getFilterList();
		},
		onReady: function() {
			
		},
		mounted() {
			
		},
		watch: {
			
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
				let startDateStr = this.startDate ? ',"startDate":"' + this.startDate + '" ' : ''; //开始时间
				let endDateStr = this.endDate ? ',"endDate":"' + endDate + '"' : ''; //结束时间
				let pageNo = this.pageNo; //页码
				let pageSize = this.pageSize; //页数
				let searchKey = this.searchKey; //任务地址
				let type = this.isAllTask ? 0 : 1; //所有任务
				let campaigns = ''; //活动名称
				let cities = ''; //城市
				let medias = ''; //媒体规格
				let brands = ''; //品牌
				let campaigntypes = ''; //活动类型
				let clients = ''; //客户
				for(let i=0; i<this.filterList.length; i++){
					for(let j=0; j<this.filterList[i].typeName.length; j++){
						if(this.filterList[i].typeName[j].select){
							switch (this.filterList[i].type) {
								case 'campaigns':
									campaigns += '"'+this.filterList[i].typeName[j].id+'",'
									break;
								case 'cities':
									cities += '"'+this.filterList[i].typeName[j].id+'",'
									break;
								case 'medias':
									medias += '"'+this.filterList[i].typeName[j].id+'",'
									break;
								case 'brands':
									brands += '"'+this.filterList[i].typeName[j].id+'",'
									break;
								case 'campaigntypes':
									campaigntypes += '"'+this.filterList[i].typeName[j].id+'",'
									break;
								case 'clients':
									clients += '"'+this.filterList[i].typeName[j].id+'",'
									break;
							}
						}
					}
				}
				let parms = '},"taskQuery":{"pageNo":' + pageNo + ',"pageSize":' + pageSize + ',"keyword":"' + searchKey + '" ' + startDateStr + endDateStr + ',"campaigns":[' + campaigns.substring(0,campaigns.length-1) + '],"cities":[' + cities.substring(0,cities.length-1) + '],"medias":[' + medias.substring(0,medias.length-1) + '],"brands":[' + brands.substring(0,brands.length-1) + '],"Campaigntypes":[' + campaigntypes.substring(0,campaigntypes.length-1) + '],"Clients":[' + clients.substring(0,clients.length-1) + '],"type":"' + type + '"}';
				this.$store.dispatch('home/getTaskList', {parms,
					callback: (res) => {
						console.log(res);
						if (res.errorCode == 0) {
							let data = res.taskResult.tasks;
							this.taskList.push(...data)
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
			// 获取过滤信息
			getFilterList(){
				let parms = '}';
				this.$store.dispatch('home/getFilter', {parms,
					callback: (res) => {
						console.log(res);
						if (res.errorCode == 0) {
							let data = res.filter;
							for(let key in data){
								for(let i=0; i<data[key].length; i++){
									data[key][i].select = false;
								}
							}
							this.filterList.push(
								{open: true,typeClass: '媒体规格',type: 'medias',typeName: data.medias,width:0,all:true},
								{open: true,typeClass: '城市',type: 'cities',typeName: data.cities,width:0},
								{open: true,typeClass: '活动名称 (Campaign)',type: 'campaigns',typeName: data.campaigns,width:1,all:true},
								{open: true,typeClass: '客户',type: 'clients',typeName: data.clients,width:0},
								{open: true,typeClass: '活动类型',type: 'campaigntypes',typeName: data.campaigntypes,width:0},
								{open: true,typeClass: '品牌',type: 'brands',typeName: data.brands,width:0},
							)
						}else{
							uni.showToast({
								title: res.errorMsg,
								icon: 'none',
								mask: true
							})
						}
					},
				})
			},
			// 弹出时间选择框
			openCalendar(res){
				this.$refs.calendar.open();
				this.clickTime = res;
			},
			// 选择时间
			confirmCalendar(e){
				console.log(e)
				if(this.clickTime == 'start'){
					this.startDate = e.fulldate;
				}else{
					this.endDate = e.fulldate;
				}
			},
			// 去详情
			goDetails(){
				uni.navigateTo({
				    url: "/pages/details/details"
				})
			},
			// 搜索条件收缩
			telescoping(index){
				this.$set(this.filterList[index], 'open', !this.filterList[index].open);
			},
			// 开始时间清空
			emptyTime(res){
				if(res == 'start'){
					this.startDate = '';
				}else{
					this.endDate = '';
				}
			},
			// 选择条件选中
			selectCh(index1, index2){
				this.$set(this.filterList[index1].typeName[index2], 'select', !this.filterList[index1].typeName[index2].select);
				this.$forceUpdate();
				console.log(this.filterList)
			},
			// 重置条件
			reset(){
				this.startDate = '';
				this.endDate = '';
				for(let i=0; i<this.filterList.length; i++){
					for(let j=0; j<this.filterList[i].typeName.length; j++){
						this.$set(this.filterList[i].typeName[j], 'select', false);
					}
				}
			},
			// 所有任务switch
			switchChange(e){
				this.isAllTask = e.detail.value;
				this.onRefresh();
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
				this.taskList = [];
				this.$refs.popup.close();
				this.getData();
			},
			// 下拉刷新复位
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
	@import './index.scss';
</style>
