import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';

@Injectable()
export class DhMeteringPointDataAccessRouteStore {
  meteringPointId$: Observable<string> = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam])
  );

  constructor(private route: ActivatedRoute) {}
}
