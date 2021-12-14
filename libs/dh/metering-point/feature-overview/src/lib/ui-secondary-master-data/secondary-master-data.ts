import { AssetType, ConnectionType, DisconnectionType, NetSettlementGroup } from "@energinet-datahub/dh/shared/data-access-api";


export interface SecondaryMasterData {
    netSettlementGroup?: NetSettlementGroup;
    disconnectionType?: DisconnectionType;
    connectionType?: ConnectionType;
    gridAreaName?: string;
    gridAreaCode?: string;
    capacity?: number | null;
    assetType?: AssetType;
    ratedCapacity?: number | null;
    ratedCurrent?: number | null;
    gsrnNumber?: string;
    productId?: string;
    streetCode?: string;
    municipalityCode?: number | null;
    countryCode?: string;
}