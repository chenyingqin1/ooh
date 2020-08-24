<template>
	<view class="page">
		<view class="imgInfo">
			<view class="imgList">
				<image v-if="pictureDetInfo.spotClassTypeName.indexOf('图片') != -1" class="img" mode="widthFix" @click="flieBrowse" :src="pictureDetInfo.fileUrl">
				<video v-if="pictureDetInfo.spotClassTypeName == '视频'" class="video" :src="pictureDetInfo.fileUrl"></video>
			</view>
			<view class="info cur">
				<view><text>拍摄时间</text>{{timestampToTime(pictureDetInfo.shootTime)}}</view>
				<view><text>拍摄地址</text>{{pictureDetInfo.taskLocation}}</view>
				<view class="clearfloat"><view class="more" @click="$refs.popup.open()">展开更多信息<image class="img" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/top.png" /></view></view>
			</view>
		</view>
		<uniPopup ref="popup" type="bottom">
			<view class="info p">
				<view class="clearfloat"><view class="more" @click="$refs.popup.close()">收起<image class="img" src="https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/bottom.png" /></view></view>
				<view class="flex-box"><text>品牌</text><block class="flex-one">{{pictureDetInfo.brandName}}</block></view>
				<view class="flex-box"><text>任务名称</text><block class="flex-one">{{pictureDetInfo.taskName}}</block></view>
				<view class="flex-box"><text>拍摄时间</text><block class="flex-one">{{timestampToTime(pictureDetInfo.shootTime)}}</block></view>
				<view class="flex-box"><text>拍摄地点</text><block class="flex-one">{{pictureDetInfo.taskLocation}}</block></view>
				<view class="flex-box"><text>拍摄说明</text><block class="flex-one">{{pictureDetInfo.description}}</block></view>
				<view class="flex-box"><text>文件类型</text><block class="flex-one">{{pictureDetInfo.spotClassTypeName}}</block></view>
				<view class="flex-box"><text>文件大小</text><block class="flex-one">{{getFileSize(pictureDetInfo.fileSize)}}</block></view>
			</view>
		</uniPopup>
	</view>
</template>
<script>
	import uniPopup from "@/components/uni/uni-popup/uni-popup.vue"
	import util from '@/common/util.js'
	import allPage from "@/mixin/allPage_MX";
	import publicCheck from "@/mixin/publicCheck_MX.js";
	export default {
		mixins: [allPage,publicCheck],
		components: {
			uniPopup,
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
			}
		},
		computed: {
			pictureDetInfo() {
				return this.$store.state.myList.pictureDetInfo
			},
		},
		onShow: function() {
			
		},
		destroyed: function(){
			
		},
		onLoad: function(options) {
			console.log(this.pictureDetInfo)
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
			// 图片浏览
			flieBrowse(){
				uni.previewImage({
					current: this.pictureDetInfo.fileUrl,
					urls: [this.pictureDetInfo.fileUrl],
				})
			},
		},
	}
</script>
<style lang="scss" scoped>
	@import './pictureDet.scss';
</style>
