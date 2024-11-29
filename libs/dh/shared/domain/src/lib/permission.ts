export const permissions = [
  'grid-areas:manage',
  'actors:manage',
  'users:manage',
  'users:view',
  'user-roles:manage',
  'calculations:manage',
  'settlement-reports:manage',
  'esett-exchange:manage',
  'request-aggregated-measured-data:view',
  'actor-credentials:manage',
  'imbalance-prices:manage',
  'actor-master-data:manage',
  'delegation:manage',
  'delegation:view',
  'users:reactivate',
  'balance-responsibility:view',
  'request-wholesale-settlement:view',
  'calculations:view',
  'imbalance-prices:view',
  'fas',
] as const;

export type Permission = (typeof permissions)[number];
