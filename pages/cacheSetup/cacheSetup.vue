<template>
	<view class="page">
		<view class="moreList bt">
			<view class="item">拍摄缓存位置
				<radio-group class="uni-list" @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in checkboxItems" :key="item.value">
						<radio :value="item.value" :checked="item.checked"></radio>{{item.name}}
					</label>
				</radio-group>
			</view>
			<view class="item" @click="clearCache">清理图片缓存<text class="icon"></text></view>
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
				checkboxItems: [{
						name: '服务器',
						value: '1',
						checked: false,
					},
					{
						name: '手机',
						value: '2',
						checked: false,
					}
				],
				temporaryFileList: [],
			}
		},
		computed: {
			userLogin() {
				return this.$store.state.userLogin.userLogin
			},
		},
		onShow: function() {
			this.getTaskfileFilequery();
			this.$set(this.checkboxItems[this.userLogin.user.CaptureCacheMode-1], 'checked', true)
			console.log(this.checkboxItems)
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
			//查获取所有临时文件数据
			getTaskfileFilequery() {
				let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"taskIdStr":""}';
				this.$store.dispatch('details/getTaskfileFilequery', {
					parms,
					callback: (res) => {
						console.log('文件list', res)
						this.temporaryFileList = res;
					}
				})
			},
			// 切换拍摄缓存位置
			radioChange(evt) {
				let val = evt.target.value;
				if (val == 1 && this.temporaryFileList.length > 0) {
					uni.showModal({
						content: '请先提交本地待上传文件',
						showCancel:false,
						success: (res)=>{
							uni.switchTab({ 
								url: "/pages/more/more"
							})
						}
					});
					return false;
				}
				this.userLogin.user.CaptureCacheMode = val;
				let parms = ',"openid":"' + this.userLogin.user.openid + '","CaptureCacheMode":"' + val + '"}';
				this.$store.dispatch('userLogin/setCaptureCacheMode', {
					parms,
					callback: (res) => {
						console.log(res)
					}
				})
			},
			// 清理图片缓存
			clearCache() {
				console.log('文件list', this.temporaryFileList)
				if (this.temporaryFileList.length > 0) {
					uni.showModal({
						title: '提示',
						content: '是否确认清理缓存图片？',
						success: (resm) => {
							if(resm.confirm){
								let ids = [];
								for(let i=0; i<this.temporaryFileList.length; i++){
									if(!this.temporaryFileList[i].isSelect){
										ids.push(this.temporaryFileList[i].id)
									}
								}
								if(!ids.length){
									uni.showToast({
										title: '暂无缓存图片',
										icon: 'none',
										mask: true
									})
									return false;
								}
								let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFile":{"id":"' + ids.join(',') + '"}';
								this.$store.dispatch('myList/taskfileDelete', {parms,
									callback: (res1) => {
										console.log(res1);
										if (res1.errorCode == 0) {
											for(let i=0; i<this.temporaryFileList.length; i++){
												if(!this.temporaryFileList[i].isSelect){
													wx.removeSavedFile({
														filePath: this.temporaryFileList[i].fileUrl,
													});
												}
											}
											uni.showModal({
												content: '已清理'+ids.length+'张缓存图片',
												showCancel:false,
												complete:function(){}
											});
										}else{
											uni.showToast({
												title: res1.errorCode,
												icon: 'none',
												mask: true
											})
										}
									},
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: '暂无缓存图片',
						icon: 'none',
						mask: true
					})
				}
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
	@import './cacheSetup.scss';
</style>
