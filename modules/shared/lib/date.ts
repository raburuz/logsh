import dayjsPackage from "dayjs"
import isTodayPlugin from "dayjs/plugin/isToday";
import isYesterdayPlugin from "dayjs/plugin/isYesterday";

dayjsPackage.extend(isTodayPlugin);
dayjsPackage.extend(isYesterdayPlugin);

export const dayjs = dayjsPackage

export const niceDate = ( date: string | Date) => {

  const isRightNow = dayjs(date).diff(dayjs(), 'minute') > -1; // less than a minute ago
  const isLessThanOneHour = dayjs(date).diff(dayjs(), 'minute') > -60; // less than one hour ago 
  
  const isToday = dayjs(date).isToday();
  const isYesterday = dayjs(date).isYesterday();
  const isNotTodayOrYesterday = !isToday && !isYesterday;
  const isCurrentYear = dayjs(date).year() === dayjs().year();

  if(isRightNow) return 'now';
  if(isLessThanOneHour) {
    const minutesAgo = Math.abs(dayjs(date).diff(dayjs(), 'minute'));
    return `${minutesAgo}m ago`;
  }
  if(isToday) return dayjs(date).format('H.mm a');
  if(isYesterday) return dayjs(date).format('[Yest ·] H.mm a');
  if(isNotTodayOrYesterday && isCurrentYear) return dayjs(date).format('D MMM');
  if(!isCurrentYear) return dayjs(date).format('D MMM YYYY');

}