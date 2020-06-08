import config from '@/common/config'
module.exports = {
	components:{},
	data() {
		return {
			shareTitle:'',
			shareImage:'',
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
	    if (res.from === 'button') {// 来自页面内分享按钮
	      console.log(res.target)
	    }
		
	    return {
	      title: this.shareTitle,
		  imageUrl:this.shareImage,
	      path: shareURL
	    }
	  }
}