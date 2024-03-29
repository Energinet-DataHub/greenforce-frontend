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
import { MarketParticipantUserRoleStatus } from './market-participant-user-role-status';
import { MarketParticipantPermissionDetailsDto } from './market-participant-permission-details-dto';
import { MarketParticipantEicFunction } from './market-participant-eic-function';


export interface MarketParticipantUserRoleWithPermissionsDto { 
    id: string;
    name: string;
    description: string;
    eicFunction: MarketParticipantEicFunction;
    status: MarketParticipantUserRoleStatus;
    permissions: Array<MarketParticipantPermissionDetailsDto>;
}
export namespace MarketParticipantUserRoleWithPermissionsDto {
}



