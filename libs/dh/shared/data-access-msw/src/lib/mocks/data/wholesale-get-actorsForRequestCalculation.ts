import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { ActorForRequestCalculation } from '@energinet-datahub/dh/wholesale/domain';

export const GetActorsForRequestCalculation: ActorForRequestCalculation[] = [
  {
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '8200000001553',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '7914351637149',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '3583430789310',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.EnergySupplier,
    value: '1193300930098',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.EnergySupplier,
    value: '0781383147284',
    displayValue: '-',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.BalanceResponsibleParty,
    value: '9561643029441',
    displayValue: 'Navn Ændret',
    __typename: 'Actor',
  },
  {
    marketRole: EicFunction.EnergySupplier,
    value: '9561643029441',
    displayValue: '12341312',
    __typename: 'Actor',
  },
];
