type TimeType = "day" | "hour" | "minute" | "second";

const now = new Date();

const Tenbelow = (value: number) => {
  if (Number(value) < 10) {
    return `0${value}`;
  }
  return value;
};

export const TimeFormat = (date: any) => {
  let Year = date.getFullYear();
  let Mouth = Tenbelow(date.getMonth() + 1);
  let Day = Tenbelow(date.getDate());
  let Hour = Tenbelow(date.getHours());
  let Minutes = Tenbelow(date.getMinutes());
  let Seconds = Tenbelow(date.getSeconds());
  return `${Year}-${Mouth}-${Day} ${Hour}:${Minutes}:${Seconds}`;
};

export const cur_befTime = (value: number, timeType: TimeType) => {
  switch (timeType) {
    case "day":
      return TimeFormat(new Date(now.setDate(now.getDate() - value)));
    case "hour":
      return TimeFormat(new Date(now.setHours(now.getHours() - value)));
    case "minute":
      return TimeFormat(new Date(now.setMinutes(now.getMinutes() - value)));
    case "second":
      return TimeFormat(new Date(now.setSeconds(now.getSeconds() - value)));
  }
};

export const monthFristDay = () =>
  TimeFormat(new Date(now.getFullYear(), now.getMonth(), 1));
