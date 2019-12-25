// 时间日期格式化功能

function unifyDate(time) {
  if (/^\d+$/.test(time)) {
    time *= String(time).length === 10 ? 1000 : 1;
  }
  return new Date(time);
};
function cutFill(str, len = 2) {
  str = String(str || '');
  const strLen = str.length;
  if(strLen === len) return str;
  if(strLen < len) {
    return new Array(len - strLen).fill('0').join('') + str; // 补零
  }
  return str.substring(strLen-len, strLen); // 裁切
};
const weekday = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六'
];
export function timeFormat(time, format = 'yyyy-MM-dd hh:mm:ss') {
  const date = unifyDate(time);
  const fullTime = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    w: weekday[date.getDay()]
  };
  let ret = String(format);
  for (const _k in fullTime) {
    ret = ret.replace(new RegExp('(' + _k +')+', 'g'), matchStr => cutFill(fullTime[_k], matchStr.length));
  }
  return ret;
};

// 一分钟（毫秒数）
export const oneMinute = 1000 * 60;
// 一小时（毫秒数）
export const oneHour = oneMinute * 60;
// 一天（毫秒数）
export const oneDay = oneHour * 24;
// 一周（毫秒数）
export const oneWeek = oneDay * 7;

export function timeHuman(time, formats = {}) {
  formats = Object.assign({
    today: '今天 hh:mm',
    yesterday: '昨天 hh:mm',
    week: 'ww hh:mm',
    year: 'MM月dd日 hh:mm',
    default: 'yyyy年MM月dd日 hh:mm'
  }, formats);
  // 当前所处日期的0点时间戳 
  const todayDate = new Date();
  const todayZero = +new Date(timeFormat(+todayDate, 'yyyy-MM-dd 00:00:00'));
  const timeDate = unifyDate(time);
  if (timeDate > todayZero) {
    // 1.当天的显示具体的时间，小时：分钟（24小时制）
    return timeFormat(time, formats.today);
  }
  if(timeDate > todayZero - oneDay) {
    // 2.前一天的显示昨天
    return timeFormat(time, formats.yesterday);
  }
  if(timeDate > todayDate - oneWeek) {
    // 3.一周以内，昨天之前的，显示星期几
    return timeFormat(time, formats.week);
  }
  if(timeDate.getFullYear() === todayDate.getFullYear()) {
    // 4.再往前的本年度时间显示月份+日期
    return timeFormat(time, formats.year);
  }
  // 5.跨年的时间显示年+月+日期
  return timeFormat(time, formats.default);
};
