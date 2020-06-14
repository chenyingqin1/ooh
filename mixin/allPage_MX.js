import config from '@/common/config'
module.exports = {
	components:{},
	data() {
		return {
			shareTitle: '户外监播',
			shareImage: 'https://oohmonitoring.dentsuaegis.cn:8081/images/OSicons/guide.png',
			shareURL: '/pages/login/login',
			canSharePage:[
				'pages/index/index','pages/myList/myList'
			],
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
		let pages = getCurrentPages()
		this.pageURL = pages[pages.length-1].route
		if(this.canSharePage.indexOf(this.pageURL)!=-1){
			let parms = ',"openid":"' + this.userLogin.user.openid + '"},"spotFileQuery":{"pageNo":"1","pageSize":"50","keyword":""}';
			this.$store.dispatch('myList/getTaskfileList', {parms,
				callback: (res) => {
					console.log(res);
					if (res.errorCode == 0) {
						let data = res.spotFileResult.spotFiles;
						uni.setStorageSync('taskfileListNumber', data.length);
						let taskfileListNumber = wx.getStorageSync("taskfileListNumber");
						if(wx.getStorageSync("taskfileListNumber")){
							uni.setTabBarBadge({//tabbar右上角添加文本
								index: 1,
								text: "" + wx.getStorageSync("taskfileListNumber") + ""
							})
						}else{
							wx.removeTabBarBadge({//移除tabbar右上角的文本
								index: 1,
							})
						}
					}else{
						
					}
				},
			})
		}else{
			if(wx.getStorageSync("taskfileListNumber")){
				uni.setTabBarBadge({//tabbar右上角添加文本
					index: 1,
					text: "" + wx.getStorageSync("taskfileListNumber") + ""
				})
			}else{
				uni.setTabBarBadge({//tabbar右上角添加文本
					index: 1,
				})
			}
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
		userLogin() {
			return this.$store.state.userLogin.userLogin
		},
	},
	onShareAppMessage(res) {
	    return {
			title: this.shareTitle,
			imageUrl:this.shareImage,
			path: this.shareURL
	    }
	  }
}