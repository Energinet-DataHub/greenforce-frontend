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
import { MarketParticipantGridAreaAuditLogEntryField } from './market-participant-grid-area-audit-log-entry-field';


export interface MarketParticipantGridAreaAuditLogEntryDto { 
    timestamp: string;
    oldValue: string;
    newValue: string;
    gridAreaId: string;
    auditIdentityId: string;
    field: MarketParticipantGridAreaAuditLogEntryField;
}
export namespace MarketParticipantGridAreaAuditLogEntryDto {
}



