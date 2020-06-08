<script>
import config from './common/config.js'
import {setAccessKey,setAccessToken,setAppId} from '@/util/request_UT.js'

    export default {
		data() {
			return {
				myOptions:'',
			}
		},
		//每次从外面进入
        onLaunch: function(options) {
			console.log('onLaunchOptions',options)
			this.myOptions = options;
			// 通知用户更新小程序
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
			    console.log(res.hasUpdate)
			})
			updateManager.onUpdateReady(function () {
			    uni.showModal({
			        title: '更新提示',
			        content: '新版本已经准备好，是否重启应用？',
			        success: function (res) {
						if (res.confirm) {
						   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						   updateManager.applyUpdate()
						}
					}
			     })
			})
			updateManager.onUpdateFailed(function () {
				// 新版本下载失败
			})
        },
        onShow: function() {
			
        },
		methods: {
			
		},
        onHide: function() {
            console.log('App Hide')
        },
    }
</script>

<style>
    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/uni.css';
	
	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}
	
	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.icon-you:before {
		content: "\e606";
	}

    /*  #endif  */
	
	.icon-xuanzhong2:before {
		content: "\e62f";
	}
	
	.icon-jia2:before {
		content: "\e60a";
	}
	
	.icon-jia1:before {
		content: "\e61c";
	}
	
	.icon--jianhao:before {
		content: "\e60b";
	}
	.icon-fork:before {
	    content: "\E61B";
	}
	
</style>
