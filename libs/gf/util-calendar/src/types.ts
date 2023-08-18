export type Calendar = {
  today: Date;
};

export type Month = {
  calendar: Calendar;
  startOfMonth: Date;
  start: Date;
  end: Date;
};
