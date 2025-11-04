import { dayjs } from '@energinet/watt/core/date';
import { capitalize } from '@energinet-datahub/dh/shared/util-text';
import { ChargeResolution } from '@energinet-datahub/dh/shared/domain/graphql';

const formatTime = (index: number, resolution: ChargeResolution) => {
  const today = dayjs();
  switch (resolution) {
    case 'QuarterHourly':
      return `${today.minute(index * 15).format('mm')} — ${today.minute((index + 1) * 15).format('mm')}`;
    case 'Hourly':
      return `${today.hour(index).format('HH')} — ${today.hour(index + 1).format('HH')}`;
    case 'Daily':
      return today.date(index + 1).format('DD');
    case 'Monthly':
      return capitalize(today.month(index).format('MMMM'));
    case 'Unknown':
      return index + 1;
  }
};

export default formatTime;
