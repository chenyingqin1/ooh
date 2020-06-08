function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function base64Decode(input) {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	while (i < input.length) {
		enc1 = _keyStr.indexOf(input.charAt(i++));
		enc2 = _keyStr.indexOf(input.charAt(i++));
		enc3 = _keyStr.indexOf(input.charAt(i++));
		enc4 = _keyStr.indexOf(input.charAt(i++));
		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		output = output + String.fromCharCode(chr1);
		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}
	}
	var utftext = output;

	var string = "";
	var i = 0;
	var c = 0;
	var c2 = 0;
	var c3 = 0;
	while (i < utftext.length) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if ((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i + 1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utftext.charCodeAt(i + 1);
			c3 = utftext.charCodeAt(i + 2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return output;
};

 // 倒计时
function otimeFn(endtime, countdownValue) {
	let time = endtime.replace(/\-/g, "/"); //把日期格式转为/,不然在ios设备读取不到
	let diff = new Date(endtime).getTime() - new Date().getTime();
	if (diff/1000 > countdownValue*60*60) {  //设置倒计时在距离开抢多少时间内显示
		clearInterval(this.inters);
		return false;
	}
	this.isShowTimes = true;
	if (diff < 0) return false;
	//计算出相差天数  
	let days = Math.floor(diff / (24 * 3600 * 1000));
	//计算出小时数  
	let leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
	let hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数  
	let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
	let minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数  
	let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
	let seconds = Math.round(leave3 / 1000);
	days = days < 10 ? '0' + days : days;
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	let otime = { days: days, hours: hours, minutes: minutes, seconds: seconds };
	return otime;
}

function getCurrentTime(){
	function getNow(s) {
	    return s < 10 ? '0' + s: s;
	}
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
	return now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	base64Decode: base64Decode,
	otimeFn: otimeFn,
	getCurrentTime: getCurrentTime,
}
