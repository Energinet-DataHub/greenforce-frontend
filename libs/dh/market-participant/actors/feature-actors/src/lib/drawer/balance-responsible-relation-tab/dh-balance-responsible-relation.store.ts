import { Injectable } from '@angular/core';
import { DhBalanceResponsibleRelationFilters } from './dh-balance-responsible-relation';
import { ComponentStore } from '@ngrx/component-store';

interface DhOutgoingMessagesState {
  filters: DhBalanceResponsibleRelationFilters;
}

const initialState: DhOutgoingMessagesState = {
  filters: {
    status: null,
    energySupplierWithNameId: null,
    gridAreaId: null,
    balanceResponsibleWithNameId: null,
    search: null,
  },
};

@Injectable()
export class DhBalanceResponsibleRelationsStore extends ComponentStore<DhOutgoingMessagesState> {
  readonly filters$ = this.select(({ filters }) => filters);

  readonly queryVariables$ = this.select(
    this.filters$,
    (filters) => ({
      filters,
    }),
    { debounce: true }
  );

  constructor() {
    super(initialState);
  }
}
