/**
 * DataHub BFF
 * Backend-for-frontend for DataHub
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MarketParticipantAddressDto } from './market-participant-address-dto';


export interface MarketParticipantOrganizationDto { 
    organizationId: string;
    name: string;
    businessRegisterIdentifier: string;
    domain: string;
    status: string;
    address: MarketParticipantAddressDto;
}


