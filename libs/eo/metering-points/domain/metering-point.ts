import { EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';

export type MeteringPointType = 'Consumption' | 'Production';

export interface MeteringPoint {
  /** Unique ID of the metering point - Global Service Relation Number */
  gsrn: string;
  /** Name of the area the metering point is registered in */
  gridArea: string;
  /** Type of metering point, ie. consumption or production */
  type: MeteringPointType;
  address: {
    /** Address line, ie. 'Dieselstraße 28' */
    address1: string;
    /** Extra address line for floor, side and such, ie. '3. Stock */
    address2: string | null;
    /** Local area description, ie. 'Niedersachsen' */
    locality: string | null;
    /** City name, ie. 'Wolfsburg' */
    city: string;
    /** Postcode, ie. '38446' */
    postalCode: string;
    /** Country-code, ie. 'DE' */
    country: string;
  };
  technology: {
    aibFueldCode: string;
    aibTechCode: AibTechCode;
  };
  subMeterType: 'Virtual' | 'Physical';
}

export enum AibTechCode {
  Solar = 'T010000',
  Wind = 'T020000',
  Other = 'T070000',
}

export interface EoMeteringPoint extends MeteringPoint {
  /** Granular certificate contract on metering point */
  contract?: EoCertificateContract;
  /** Indicates whether a contract status is loading for the meteringpoint */
  loadingContract: boolean;
}
