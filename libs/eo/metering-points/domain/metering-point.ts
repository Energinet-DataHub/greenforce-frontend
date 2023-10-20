import { EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';
import { MeteringPoint } from '../data-access-api';

export interface EoMeteringPoint extends MeteringPoint {
  /** Granular certificate contract on metering point */
  contract?: EoCertificateContract;
  /** Indicates whether a contract status is loading for the meteringpoint */
  loadingContract: boolean;
}
