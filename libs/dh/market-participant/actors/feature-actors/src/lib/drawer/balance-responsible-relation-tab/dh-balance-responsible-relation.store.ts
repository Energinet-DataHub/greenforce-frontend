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
import { computed, inject } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, distinctUntilKeyChanged, pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import {
  BalanceResponsibilityAgreement,
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhBalanceResponsibleRelationFilters,
  DhBalanceResponsibleRelations,
} from './dh-balance-responsible-relation';

type BalanceResponsbleRelationsState = {
  relations: DhBalanceResponsibleRelations;
  loading: boolean;
  error: boolean;
  filters: DhBalanceResponsibleRelationFilters;
};

const initialSignalState: BalanceResponsbleRelationsState = {
  relations: [],
  loading: false,
  error: false,
  filters: {
    actorId: null,
    eicFunction: null,
    status: null,
    energySupplierWithNameId: null,
    gridAreaId: null,
    balanceResponsibleWithNameId: null,
    search: null,
  },
};

export const DhBalanceResponsibleRelationsStore = signalStore(
  withState(initialSignalState),
  withComputed(({ filters, relations }) => ({
    filteredRelations: computed(() =>
      relations().filter(
        (relation) => applyFilter(filters(), relation) && applySearch(filters(), relation)
      )
    ),
  })),
  withMethods((store, apollo = inject(Apollo)) => ({
    updateFilters: (filters: DhBalanceResponsibleRelationFilters): void => {
      patchState(store, (state) => ({ ...state, filters: { ...state.filters, ...filters } }));
    },
    loadByFilters: rxMethod<DhBalanceResponsibleRelationFilters>(
      pipe(
        distinctUntilKeyChanged('actorId'),
        tap(() => patchState(store, { loading: true, error: false })),
        switchMap((filters) => {
          return apollo
            .watchQuery({
              query: GetBalanceResponsibleRelationDocument,
              variables: { id: filters.actorId ?? '' },
            })
            .valueChanges.pipe(
              catchError(() => {
                patchState(store, (state) => ({
                  ...state,
                  error: true,
                  loading: false,
                  relations: [],
                }));
                return EMPTY;
              }),
              tap((data) => {
                const relations = data?.data?.actorById?.balanceResponsibleAgreements;

                patchState(store, (state) => ({
                  ...state,
                  relations: relations ?? [],
                  loading: false,
                  error: false,
                }));
              })
            );
        })
      )
    ),
  }))
);

const applySearch = (
  filters: DhBalanceResponsibleRelationFilters,
  balanceResponsibilityAgreement: BalanceResponsibilityAgreement
) => {
  const { search, eicFunction } = filters;
  const { gridAreaId, balanceResponsibleWithName, energySupplierWithName } =
    balanceResponsibilityAgreement;

  if (search === null || search === undefined) {
    return true;
  }

  if (gridAreaId === search) {
    return true;
  }

  if (
    eicFunction === EicFunction.EnergySupplier &&
    balanceResponsibleWithName?.actorName.value
      ?.toLocaleLowerCase()
      .includes(search.toLocaleLowerCase())
  ) {
    return true;
  }

  return (
    eicFunction === EicFunction.BalanceResponsibleParty &&
    energySupplierWithName?.actorName.value
      ?.toLocaleLowerCase()
      .includes(search.toLocaleLowerCase())
  );
};

const applyFilter = (
  {
    balanceResponsibleWithNameId,
    energySupplierWithNameId,
    gridAreaId: gridAreaIdFilter,
    status,
  }: DhBalanceResponsibleRelationFilters,
  balanceResponsibilityAgreement: BalanceResponsibilityAgreement
) => {
  const { gridAreaId, balanceResponsibleWithName, energySupplierWithName } =
    balanceResponsibilityAgreement;

  if (
    energySupplierWithNameId === null &&
    balanceResponsibleWithNameId === null &&
    status === null &&
    gridAreaIdFilter === null
  )
    return true;

  if (balanceResponsibleWithNameId === balanceResponsibleWithName?.id) {
    return true;
  }

  if (energySupplierWithNameId === energySupplierWithName?.id) {
    return true;
  }

  if (status === balanceResponsibilityAgreement.status) return true;

  return gridAreaId === gridAreaIdFilter;
};
