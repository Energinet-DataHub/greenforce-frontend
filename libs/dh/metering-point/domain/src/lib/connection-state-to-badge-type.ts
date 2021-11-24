import { WattBadgeType } from '@energinet-datahub/watt';

export enum ConnectionState {
  'NotUsed' = 'Not used',
  'ClosedDown' = 'Closed down',
  'New' = 'New',
  'Connected' = 'Connected',
  'Disconnected' = 'Disconnected',
}

/**
 *
 * @throws {Error} if the specified connection state has an unknown value.
 */
export function connectionStateToBadgeType(
  connectionState: string
): WattBadgeType {
  switch (connectionState) {
    case ConnectionState.ClosedDown:
    case ConnectionState.Disconnected:
    case ConnectionState.NotUsed:
      return 'warning';
    case ConnectionState.Connected:
    case ConnectionState.New:
      return 'success';
    default:
      throw new Error(`Unknown connection state: ${connectionState}`);
  }
}
