import {
  DhBalanceResponsibleRelation,
  DhBalanceResponsibleRelationFilters,
} from './dh-balance-responsible-relation';

export const dhApplyFilter = (
  filters: DhBalanceResponsibleRelationFilters,
  balanceResponsibilityAgreement: DhBalanceResponsibleRelation
) => {
  const { gridArea, balanceResponsibleWithName, energySupplierWithName, status } =
    balanceResponsibilityAgreement;

  const {
    energySupplierWithNameId,
    balanceResponsibleWithNameId,
    status: statusFilter,
    gridAreaCode,
  } = filters;

  if (checkifAllAreNull(filters)) return true;

  return (
    (isNullOrUndefined(statusFilter) || statusFilter?.includes(status)) &&
    (isNullOrUndefined(energySupplierWithNameId) ||
      energySupplierWithName?.id === energySupplierWithNameId) &&
    (isNullOrUndefined(gridAreaCode) || gridArea?.code === gridAreaCode) &&
    (isNullOrUndefined(balanceResponsibleWithNameId) ||
      balanceResponsibleWithName?.id === balanceResponsibleWithNameId)
  );
};

const isNullOrUndefined = <T>(value: T | null | undefined) => {
  return value === null || value === undefined;
};

const checkifAllAreNull = ({
  energySupplierWithNameId,
  balanceResponsibleWithNameId,
  status,
  gridAreaCode,
}: DhBalanceResponsibleRelationFilters) => {
  return (
    energySupplierWithNameId === null &&
    balanceResponsibleWithNameId === null &&
    status === null &&
    gridAreaCode === null
  );
};
