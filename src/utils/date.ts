import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

// TODO: constantsでもいいな
export const hyphenFormat = "YYYY-MM-DD";

export const YESTERDAY = dayjs().subtract(1, "day").format(hyphenFormat);
export const TOMORROW = dayjs().add(1, "day").format(hyphenFormat);

export const calcFromNow = (date: string) => {
  const target = dayjs(date);
  const now = dayjs();
  const yearDiff = now.diff(target, "year");
  if (yearDiff > 0) return `${yearDiff}年前`;
  const monthDiff = now.diff(target, "month");
  if (monthDiff > 0) return `${monthDiff}ヶ月前`;
  const dayDiff = now.diff(target, "day");
  if (dayDiff > 0) return `${dayDiff}日前`;
  const hourDiff = now.diff(target, "hour");
  if (hourDiff > 0) return `${hourDiff}時間前`;
  const minuteDiff = now.diff(target, "minute");
  if (minuteDiff > 0) return `${minuteDiff}分前`;
  return "1分以内";
};

/** 呼び出す側で現在日時をインスタンス化して渡す 22:45 ~ 23:05までをニュースシェアの時間とみなす */
export const isStartedNewsShare = (now: Dayjs) =>
  now >= dayjs().hour(22).minute(45) && now <= dayjs().hour(23).minute(5);
