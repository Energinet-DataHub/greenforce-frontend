import { Calendar, Month } from './types';
import * as dateFns from './date-fns';

export const make = (calendar: Calendar, month: Date): Month => {
  const startOfMonth = dateFns.startOfMonth(month);
  return {
    calendar,
    startOfMonth,
    start: dateFns.startOfISOWeek(startOfMonth),
    end: dateFns.endOfISOWeek(dateFns.addWeeks(startOfMonth, 5)),
  };
};

export const next = (month: Month) =>
  make(month.calendar, dateFns.addMonths(month.startOfMonth, 1));

export const previous = (month: Month) =>
  make(month.calendar, dateFns.subMonths(month.startOfMonth, 1));

export const today = (month: Month) => make(month.calendar, month.calendar.today);

export const toArray = (month: Month) =>
  dateFns
    .eachWeekOfInterval({ start: month.start, end: month.end }, { weekStartsOn: 1 })
    .map((startOfWeek) => ({
      startOfWeek,
      number: dateFns.getISOWeek(startOfWeek),
      days: dateFns
        .eachDayOfInterval({ start: startOfWeek, end: dateFns.endOfISOWeek(startOfWeek) })
        .map((startOfDay) => ({
          startOfDay,
          date: dateFns.getDate(startOfDay),
          day: dateFns.getDay(startOfDay),
          isCurrentMonth: dateFns.isSameMonth(startOfDay, month.startOfMonth),
          isToday: dateFns.isSameDay(startOfDay, month.calendar.today),
          isWeekend: dateFns.isWeekend(startOfDay),
        })),
    }));
