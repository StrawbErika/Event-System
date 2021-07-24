export const startTimeChecker = (time, endTime, onError) => {
  if (time.hour < 8) {
    onError("startTime", "Cannot create before 8");
    return false;
  } else if (endTime && time.hour > endTime.hour) {
    onError("startTime", "Cannot have start time after end time");
    return false;
  } else if (
    endTime &&
    time.hour === endTime.hour &&
    (time.minute > endTime.minute || time.minute === endTime.minute)
  ) {
    onError("startTime", "Cannot have start time after end time");
    return false;
  } else {
    return true;
  }
};

export const endTimeChecker = (time, startTime, onError) => {
  if (time.hour > 20 || (time.hour === 20 && time.minute > 0)) {
    onError("endTime", "Cannot create past 8");
    return false;
  } else if (time.hour < 8 || (time.hour === 8 && time.minute === 0)) {
    onError("endTime", "Cannot create past 8");
    return false;
  } else if (startTime && time.hour < startTime.hour) {
    onError("endTime", "Cannot have end time after start time");
    return false;
  } else if (
    startTime &&
    time.hour === startTime.hour &&
    (time.minute < startTime.minute || time.minute === startTime.minute)
  ) {
    onError("endTime", "Cannot have end time after start time");
    return false;
  } else {
    return true;
  }
};

export const reformatTime = (time) => {
  let timeString = time.toString().substring(16, 21);
  const timeSplit = timeString.split(":");
  const hour = timeSplit[0];
  const minute = timeSplit[1];
  return {
    display: timeString,
    hour: parseInt(hour),
    minute: parseInt(minute),
  };
};

export const dateChecker = (date, onError) => {
  const today = new Date();
  const todayTime = today.getTime();
  const dateTime = date.getTime(date) + 23 * 60 * 60 * 1000; //Adds 23hrs into the date (since date's time is always 00)
  if (todayTime > dateTime) {
    onError("date", "Cannot create an event in the past");
    return false;
  } else {
    return true;
  }
};

export const reformatDate = (date) => {
  return date.toString().substring(0, 15);
};
