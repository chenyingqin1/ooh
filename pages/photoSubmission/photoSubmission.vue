<template>
	<view class="page">
		<view class="imgInfo">
			<view class="imgList">
				<view class="list">
					<view class="name">拍摄时间 {{SelectTempFlie.time}}</view>
					<view class="imgs clearfloat">
						<image v-for="(item, index) in spareFlie" :key="index" @click="selectImgCh(index)" @longpress="longpressCh(index)" class="img" :class="{cur:selectImgIndex == index}" :src="item.img">
					</view>
				</view>
				<image v-if="options.cameraType == true" class="img" mode="widthFix" @click="flieBrowse" :src="SelectTempFlie.url">
				<video v-if="options.cameraType == false" class="video" :src="SelectTempFlie.url"></video>
			</view>
			<view class="info">
				<view><text>拍摄地点</text>{{SelectTempFlie.address}}</view>
				<view><text>说明</text><input class="input" type="text" :value="SelectTempFlie.remarks"></view>
			</view>
		</view>
		<view class="operation flex-box">
			<view class="flex-one" @click="chooseWxImageVideo">继续拍照</view>
			<view class="flex-one cur">确认</view>
		</view>
	</view>
</template>
<script>
	import allPage from "@/mixin/allPage_MX";
	import util from '@/common/util.js'
	export default {
		mixins: [allPage],
		components: {
			
		},
		beforeCreate() {

		},
		data() {
			return {
				selectImgIndex: 0,
				SelectTempFlie:{  
					url: '',
					time: '',
					address: '',
					remarks: '',
				},
				spareFlie:[
				// 	{
				// 	img: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/detail-example.jpg',
				// 	time: '2020-05-12 23:12:32',
				// },
				],
			}
		},
		computed: {
		
		},
		onShow: function() {
			if(this.options.implement == 1){
				this.chooseWxImageVideo()
			}
		},
		destroyed: function(){
			
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
			// 拍摄图片选择
			selectImgCh(index){
				this.selectImgIndex = index;
				this.SelectTempFlie = this.spareFlie[index];
			},
			// 图片浏览
			flieBrowse(){
				uni.previewImage({
					current: this.SelectTempFlie.url, // 当前显示图片的http链接
					// urls: imgList // 需要预览的图片http链接列表
				})
			},
			// 图片长按删除
			longpressCh(index){
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否确认删除图片？',
					success (res) {
						if (res.confirm) {
							_this.spareFlie.splice(index, 1);
							_this.SelectTempFlie = _this.spareFlie.length > 0 ? _this.spareFlie[0] : {url: '',time: ''};
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			chooseWxImageVideo(){
				var _this = this;
				this.options.implement = 0;
				// 获取当前定位坐标,成功后才执行拍照/视频
				wx.getLocation({
					type: 'wgs84',
					success: function (res1) {
				        console.log(res1)
						if(_this.options.cameraType){
							// 拉起拍照功能
							uni.chooseImage({
								sizeType: ['original'],
								sourceType: ['camera'],
								success: function(res2) {
									// _this.$store.dispatch('userLogin/getUserLogin', {parms,
									// 	callback: (res) => {
									// 	},
									// })
									console.log(res2);
									_this.spareFlie.unshift({
										url: res2.tempFilePaths[0],
										time: _this.getCurrentTime(),
										address: '中国广东省广州市海珠区小港路119号',
										remarks: '1_122478389848989,133.87898983',
									})
									_this.SelectTempFlie = _this.spareFlie[0];
								}
							})
						}else{
							uni.chooseVideo({
								sourceType: ['camera'],
								maxDuration: 60,
								camera: 'back',
								success(res2) {
									console.log(res)
									_this.spareFlie.unshift({
										url: res2.tempFilePaths[0],
										time: _this.getCurrentTime(),
										address: '中国广东省广州市海珠区小港路119号',
										remarks: '1_122478389848989,133.87898983',
									})
									_this.SelectTempFlie = _this.spareFlie[0];
								}
							})
						}
					},
				})
			},
			// 获取当前时间
			getCurrentTime(){
				let myDate = new Date();
				//获取当前年
				let year=myDate.getFullYear();
				//获取当前月
				let month=myDate.getMonth()+1;
				//获取当前日
				let date=myDate.getDate(); 
				let h=myDate.getHours();       //获取当前小时数(0-23)
				let m=myDate.getMinutes();     //获取当前分钟数(0-59)
				let s=myDate.getSeconds();  
				return year+'-'+this.getNow(month)+"-"+this.getNow(date)+" "+this.getNow(h)+':'+this.getNow(m)+":"+this.getNow(s);
			},
			getNow(s) {
				return s < 10 ? '0' + s: s;
			}
		},

	}
</script>
<style lang="scss" scoped>
	@import './photoSubmission.scss';
</style>
