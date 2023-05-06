export default function roundOFF(date, offset = 0) {
  let start = new Date(date);
  start.setHours(0, 0, 0, 0);
  let nDay = start.getDay() - 1;
  if (nDay == -1) {
    nDay = 6;
  }
  start.setDate(start.getDate() - nDay + offset);
  return start;
}
