import config from '@/common/config'
module.exports = {
	components:{},
	data() {
		return {
			shareTitle: '户外监播',
			shareImage: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/guide.png',
			shareURL: '/pages/login/login'
		}
	},
	onLoad:function(options){
		
	},
	onShow: function() {
		let _this = this;
		uni.getSystemInfo({
			success(res) {
				_this.$store.state.userLogin.systemInfo = res;
			}
		});
		// 我的清单右上角添加文本
		if(wx.getStorageSync("taskfileListNumber")){
			let taskfileListNumber = wx.getStorageSync("taskfileListNumber");
			uni.setTabBarBadge({//tabbar右上角添加文本
				index: 1,
				text: String(taskfileListNumber)
			})
		}
	},
	methods: {
		go(url){
			uni.reLaunch({
			    url: url
			});
		},
		back(){
			uni.navigateBack()
		}
	},
	computed:{
		
	},
	onShareAppMessage(res) {
	    return {
			title: this.shareTitle,
			imageUrl:this.shareImage,
			path: this.shareURL
	    }
	  }
}