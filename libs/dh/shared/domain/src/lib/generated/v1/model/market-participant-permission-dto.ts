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
import { MarketParticipantEicFunction } from './market-participant-eic-function';


export interface MarketParticipantPermissionDto { 
    id: number;
    name: string;
    description: string;
    created: string;
    assignableTo: Array<MarketParticipantEicFunction>;
}


