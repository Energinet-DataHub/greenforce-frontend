import { WattRange, dayjs } from '@energinet-datahub/watt/date';

export function dhIsPeriodOneFullMonth(period: WattRange<Date>): boolean {
  const isStartOfMonth = dayjs(period.start).isSame(dayjs(period.start).startOf('month'));
  const isEndOfMonth = dayjs(period.end).isSame(dayjs(period.end).endOf('month'));

  const areWithinTheSameMonth = dayjs(period.start).isSame(dayjs(period.end), 'month');

  return isStartOfMonth && isEndOfMonth && areWithinTheSameMonth;
}
