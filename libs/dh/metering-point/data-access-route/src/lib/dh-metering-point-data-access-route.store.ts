import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { map, Observable } from 'rxjs';
import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';

interface RouterState {
  readonly meteringPointId: string;
}

const initialState: RouterState = {
  meteringPointId: '',
};

@Injectable()
export class DhMeteringPointDataAccessRouteStore extends ComponentStore<RouterState> {
  meteringPointId$: Observable<string> = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam])
  );

  constructor(private route: ActivatedRoute) {
    super(initialState);
  }
}
