const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



/*******获取当前时间**********/
function getTimestamp() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var day = d.getDay();
  var Hours = d.getHours();
  //获取当前小时数(0-23)
  var Minutes = d.getMinutes();
  //获取当前分钟数(0-59)
  var Seconds = d.getSeconds();
  //获取当前秒数(0-59)
  var curDateTime = year;
  if (month > 9)
    curDateTime = curDateTime + "-" + month;
  else
    curDateTime = curDateTime + "-" + "0" + month;
  if (date > 9)
    curDateTime = curDateTime + "-" + date;
  else
    curDateTime = curDateTime + "-" + "0" + date;
  if (Hours > 9)
    curDateTime = curDateTime + " " + Hours;
  else
    curDateTime = curDateTime + " " + "0" + Hours;
  if (Minutes > 9)
    curDateTime = curDateTime + ":" + Minutes;
  else
    curDateTime = curDateTime + ":" + "0" + Minutes;
  if (Seconds > 9)
    curDateTime = curDateTime + ":" + Seconds;
  else
    curDateTime = curDateTime + ":" + "0" + Seconds;
  return curDateTime;
}
//时间戳
function getTimestamps() {
  return Date.parse(new Date());
}
//时间戳转时间（年月日）
function getLocalTime(nS) {
  return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
//时间戳转时间（yy:mm:ss）
function getLocalTime2(nS) {
  return new Date(parseInt(nS)).Format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.Format = function (fmt) {//author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
function bytesToSize(bytes) {
  if (bytes === 0)
    return '0 B';
  var k = 1000, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
/*******获取当前时间**********/


function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


module.exports = {
  formatTime: formatTime,
  getTimestamp: getTimestamp,
  guid: guid
}
