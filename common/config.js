let config={
	// 测试
	sumbitUrl: "https://oohtest.dentsuaegis.cn:8081/restserver/oohapp",//api开头一段
	// 正式版
	// sumbitUrl: "https://oohmonitoring.dentsuaegis.cn:8081/restserver/oohapp",//api开头一段
	// ---------------------------
	appkey: "HDdancI123!",
	production: true,//是否线上环境，线上打包设成true,本机调试false
	platform:1,//0本机，1t版,2v版,3p版
	
	
}
module.exports = config;
