import { WattBadgeType } from '@energinet-datahub/watt';

enum ConnectionState {
  'NotUsed' = 'Not used',
  'ClosedDown' = 'Closed down',
  'New' = 'New',
  'Connected' = 'Connected',
  'Disconnected' = 'Disconnected',
}

export function connectionStateToBadgeType(
  connectionState: string
): WattBadgeType {
  switch (connectionState) {
    case ConnectionState['ClosedDown']:
    case ConnectionState['Disconnected']:
    case ConnectionState['NotUsed']:
      return 'warning';
    case ConnectionState['Connected']:
    case ConnectionState['New']:
      return 'success';
    default:
      throw new Error('Connection state cannot be empty');
  }
}
