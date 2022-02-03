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
