import Vue from 'vue'
import {getFetch,postFetch} from '@/util/request_UT.js'
export default {
	namespaced: true,
	state: {
		campaigninfo:{},
	},
	mutations: {
		init(state, data){
			
		},
		setCampaigninfo(state, data){
            Vue.set(state, 'campaigninfo', data)
            uni.setStorageSync('campaigninfo', state);
		}
	},
	actions: {
		init(context, data){
			context.commit("init")
		},
		getCampaigninfo(context, data){
			getFetch('campaign.info.query', data.parms, (data2) => {
				let val = data2.data;
				context.commit("setCampaigninfo",val);
				if(data.callback){
					data.callback(val);
				}
			});
		}
	},
}