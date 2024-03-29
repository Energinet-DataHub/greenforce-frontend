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
import { MarketParticipantUserStatus } from './market-participant-user-status';


export interface MarketParticipantUserOverviewFilterDto { 
    actorId?: string | null;
    searchText?: string | null;
    userRoleIds: Array<string>;
    userStatus: Array<MarketParticipantUserStatus>;
}


