import {
  BalanceResponsibleType,
  GridAreaDto,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

const storageDocumentLink =
  'https://localhost:5001/v1/EsettExchange/StorageDocument?documentId=390254675-3';

export const eSettBalanceResponsibleMessages: BalanceResponsibleType[] = [
  {
    __typename: 'BalanceResponsibleType',
    id: '1',
    receivedDateTime: new Date('2021-02-01T00:00:00.000Z'),
    supplier: {
      __typename: 'ActorNumber',
      value: '123',
    },
    balanceResponsible: {
      __typename: 'ActorNumber',
      value: '321',
    },
    gridArea: {
      __typename: 'GridAreaDto',
      code: '344',
      name: 'N1 A/S',
    } as GridAreaDto,
    meteringPointType: TimeSeriesType.Production,
    validFromDate: new Date('2021-02-01T10:00:00.000Z'),
    validToDate: new Date('2021-05-02T00:00:00.000Z'),
    getStorageDocumentLink: storageDocumentLink,
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: '321 - Test Balance Ansvarlig',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: '123 - Test Supplier',
    },
  },
  {
    __typename: 'BalanceResponsibleType',
    id: '2',
    receivedDateTime: new Date('2022-01-01T00:00:00.000Z'),
    supplier: {
      __typename: 'ActorNumber',
      value: '111',
    },
    balanceResponsible: {
      __typename: 'ActorNumber',
      value: '222',
    },
    gridArea: {
      __typename: 'GridAreaDto',
      code: '999',
      name: 'N2 A/S',
    } as GridAreaDto,
    meteringPointType: TimeSeriesType.Production,
    validFromDate: new Date('2022-01-01T10:00:00.000Z'),
    validToDate: null,
    getStorageDocumentLink: storageDocumentLink,
    balanceResponsibleWithName: {
      __typename: 'ActorNameDto',
      value: '222 - Test Balance Ansvarlig 2',
    },
    supplierWithName: {
      __typename: 'ActorNameDto',
      value: '111 - Test Supplier 2',
    },
  },
];
