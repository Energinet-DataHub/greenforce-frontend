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
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import {
  BalanceResponsibilityAgreement,
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhBalanceResponsibleRelationFilters,
  DhBalanceResponsibleRelations,
} from './dh-balance-responsible-relation';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  dhGroupByMarketParticipant,
  dhGroupByType,
} from '../util/dh-group-balance-responsible-relations';

type BalanceResponsbleRelationsState = {
  relations: DhBalanceResponsibleRelations;
  loadingState: LoadingState | ErrorState;
  filters: DhBalanceResponsibleRelationFilters;
};

const initialSignalState: BalanceResponsbleRelationsState = {
  relations: [],
  loadingState: LoadingState.INIT,
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
  withComputed(({ loadingState, filters, relations }) => ({
    filteredRelations: computed(() =>
      relations().filter(
        (relation) => applyFilter(filters(), relation) && applySearch(filters(), relation)
      )
    ),
    isLoading: computed(() => loadingState() === LoadingState.LOADING),
    hasError: computed(() => loadingState() === ErrorState.GENERAL_ERROR),
  })),
  withComputed(({ filteredRelations, filters }) => ({
    filteredAndGroupedRelations: computed(() => {
      if (filters().eicFunction === EicFunction.EnergySupplier)
        return dhGroupByMarketParticipant(
          dhGroupByType(filteredRelations()),
          'balanceResponsibleWithName'
        );

      return dhGroupByMarketParticipant(
        dhGroupByType(filteredRelations()),
        'energySupplierWithName'
      );
    }),
    isEmpty: computed(() => filteredRelations().length === 0),
  })),
  withMethods((store, apollo = inject(Apollo)) => ({
    updateFilters: (filters: DhBalanceResponsibleRelationFilters): void => {
      patchState(store, (state) => ({ ...state, filters: { ...state.filters, ...filters } }));
    },
    loadByFilters: rxMethod<DhBalanceResponsibleRelationFilters>(
      pipe(
        distinctUntilKeyChanged('actorId'),
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
                  loadingState: ErrorState.GENERAL_ERROR,
                  relations: [],
                }));
                return EMPTY;
              }),
              tap((data) => {
                if (data.loading) {
                  patchState(store, (state) => ({ ...state, loadingState: LoadingState.LOADING }));
                  return;
                }

                if (data.error || data.errors) {
                  patchState(store, (state) => ({
                    ...state,
                    loadingState: ErrorState.GENERAL_ERROR,
                  }));
                  return;
                }

                const relations = data?.data?.actorById?.balanceResponsibleAgreements;

                patchState(store, (state) => ({
                  ...state,
                  relations: relations ?? [],
                  loadingState: LoadingState.LOADED,
                }));
              })
            );
        })
      )
    ),
  })),
  withHooks({ onInit: (store) => store.loadByFilters(store.filters) })
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
