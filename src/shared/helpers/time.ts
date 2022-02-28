export function getTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getThirtyDaysAgo() {
  return new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
}

export function getSevenDaysAgo() {
  return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
}

export function getTwentyFourHoursAgo() {
  return new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
}

export function getRemainingTimeBetweenTwoDates(futureUint256: any, pastOrNowUint256: any) {
  // get total seconds between the times
  var delta = Math.abs(futureUint256 - pastOrNowUint256) / 1000;

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  return `${days} days ${hours} hours ${minutes} minutes`;
}
