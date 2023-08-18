import { Calendar } from './types';
import * as dateFns from './date-fns';
import * as Month from './month';

/**
 *
 */
export const make = (today: Date): Calendar => ({ today });

/**
 *
 */
export const getCurrentMonth = (calendar: Calendar) => Month.make(calendar, calendar.today);
