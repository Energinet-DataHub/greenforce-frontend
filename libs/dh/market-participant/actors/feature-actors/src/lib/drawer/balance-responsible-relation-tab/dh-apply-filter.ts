/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
