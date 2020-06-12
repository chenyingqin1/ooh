import config from '@/common/config'
module.exports = {
	components:{},
	data() {
				return {
					
				}
			},
	onShow: function() {

	},
	mounted(){

	},
	methods: {
        //校验身份证
        isCardID(sId){
            // console.log(sId)
            let aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
            let iSum=0 ;
            if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(sId)) return false;
            sId=sId.replace(/x$/i,"a");
            if(aCity[parseInt(sId.substr(0,2))]==null) return false;
            let sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
            let d=new Date(sBirthday.replace(/-/g,"/")) ;
            if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
            for(let i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
            if(iSum%11!=1) return false;
            //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
            return true;
        },
        // 手机校验
        checkPhone(code){
            if(!code) return true;
            if(!(/^1[3|4|5|7|8|9|6]\d{9}$/.test(code))) return false;
            return true;
        },
        // 护照校验
        checkPassport(code){
            if(!code) return false;
            if(!/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/.test(code)) return "护照号码格式错误";
            return true;
        },
        // 军官证校验
        isCardNo(code) {
            if(!code) return false;
            if(!/[\u4e00-\u9fa5](字第){1}(\d{4,8})(号?)$/.test(code)) return false;
            return true;
        },
        // 港澳通行证校验
        HKMPass(code) {
            if(!code) return false;
            if(!/^[HMChmc]{1}([0-9]{10}|[0-9]{8})$/.test(code)) return false;
            return true;
        },
        // 台湾通行证校验
        TaiwanPass(code) {
            if(!code) return "请输入台湾通行证";
            if(!/^[0-9]{8}$/.test(code)) return false;
            if(!/^[0-9]{10}$/.test(code)) return false;
            return true;
        },
        // 台胞证校验
        CellSyndrome(code){
            if(!code) return "请输入台胞证";
            if(!/^[a-zA-Z0-9]{5,21}$/.test(code)) return false;
            return true;
        },
        // 回乡证校验
        ReturnHome(code){
            if(!code) return "请输入回乡证证";
            if(!/^[a-zA-Z0-9]{5,21}$/.test(code)) return false;
            return true;
        },
		timestampToTime(timestamp){
			let date = new Date(Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear();
			let M = date.getMonth()+1;
			let D = date.getDate();
			let h = date.getHours();
			let m = date.getMinutes();
			let s = date.getSeconds();
			return Y +'-'+ this.add(M) +'-'+ this.add(D) +' '+ this.add(h) +':'+ this.add(m) +':'+ this.add(s);
		},
		add(m) {
			return m<10?'0'+m:m;
		},
		// 文件大小转换
		getFileSize(fileByte){
		    var fileSizeByte = fileByte;
		    var fileSizeMsg = "";
		    if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
		    else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
		    else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
		    else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
		    else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
		    else fileSizeMsg = "文件超过1TB";
		    return fileSizeMsg;
		},
		// 时间转时间戳
		dateToUnix(string) {
			let f = string.split(' ', 2);
			let d = (f[0] ? f[0] : '').split('-', 3);
			let t = (f[1] ? f[1] : '').split(':', 3);
			return (new Date(
				parseInt(d[0], 10) || null,
				(parseInt(d[1], 10) || 1) - 1,
				parseInt(d[2], 10) || null,
				parseInt(t[0], 10) || null,
				parseInt(t[1], 10) || null,
				parseInt(t[2], 10) || null
				)).getTime();
		},
	},
	computed:{

	}
}
