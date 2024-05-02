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
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';

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
        tap(() => patchState(store, (state) => ({ ...state, loadingState: LoadingState.LOADING }))),
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
