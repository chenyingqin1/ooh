import Vue from 'vue'
import App from './App'

import store from './store'
import config from './common/config.js'
import VueClipboard from 'vue-clipboard2'
import './style/iconfont.css'
import './common/common.scss'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
Vue.use(VueClipboard);
Vue.prototype.$SDK = wx || my;

App.mpType = 'app'
if(config.dummy&&!config.production){dummy();};
const app = new Vue({
	store,
	...App
})
app.$mount()
