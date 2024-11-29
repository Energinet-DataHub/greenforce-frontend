import { aggregateCertificatesMocks } from './lib/aggregate-certificates';
import { aggregateClaimsMocks } from './lib/aggregate-claims';
import { aggregateTransfersMocks } from './lib/aggregate-transfers';
import { authMocks } from './lib/auth';
import { authorizationMocks } from './lib/authorization';
import { certificatesMocks } from './lib/certificates';
import { claimsMocks } from './lib/claims';
import { meteringPointsMocks } from './lib/metering-points';
import { transferMocks } from './lib/transfer';
import { serviceProviderTermsMocks } from './lib/service-provider-terms';

export const mocks = [
  aggregateCertificatesMocks,
  aggregateClaimsMocks,
  aggregateTransfersMocks,
  authMocks,
  certificatesMocks,
  claimsMocks,
  meteringPointsMocks,
  transferMocks,
  authorizationMocks,
  serviceProviderTermsMocks,
];
