import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

interface RouterState {
  readonly meteringPointId: string;
}

const initialState: RouterState = {
  meteringPointId: '',
};

@Injectable()
export class DhMeteringPointDataAccessRouteStore extends ComponentStore<RouterState> {
  meteringPointId$ = this.select((state) => state.meteringPointId);

  constructor() {
    super(initialState);
  }
}
