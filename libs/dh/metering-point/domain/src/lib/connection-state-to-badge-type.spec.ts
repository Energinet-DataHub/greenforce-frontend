import {
  ConnectionState,
  connectionStateToBadgeType,
} from './connection-state-to-badge-type';

describe(connectionStateToBadgeType.prototype.name, () => {
  it(`Given connection state is "Not used"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.NotUsed);

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Disconnected"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.Disconnected
    );

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Closed down"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.ClosedDown
    );

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Connected"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.Connected
    );

    expect(actualBadgeType).toBe('success');
  });

  it(`Given connection state is "New"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.New);

    expect(actualBadgeType).toBe('success');
  });

  it(`When an unknown connection state is specified
    Then an error is thrown"`, () => {
    expect(() => connectionStateToBadgeType('test')).toThrowError(
      /unknown connection state/i
    );
  });
});
