import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, Observable, switchMap, tap } from 'rxjs';
import {
  MeteringPointDto,
  MeteringPointHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface MeteringPointState {
  readonly meteringPoint?: MeteringPointDto;
  readonly meteringPointNotFound: boolean;
  readonly isLoading: boolean;
  readonly hasError: boolean;
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
  meteringPointNotFound: false,
  isLoading: false,
  hasError: false,
};

@Injectable()
export class DhMeteringPointDataAccessApiStore extends ComponentStore<MeteringPointState> {
  meteringPoint$ = this.select((state) => state.meteringPoint).pipe(
    filter((meteringPointId) => !!meteringPointId)
  );

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadMeteringPointData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1MeteringPointGetByGsrnGet(id).pipe(
            tapResponse(
              (meteringPointData) => {
                this.setLoading(false);

                this.updateMeteringPointData(meteringPointData);
              },
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

  private updateMeteringPointData = this.updater(
    (
      state: MeteringPointState,
      meteringPointData: MeteringPointDto | undefined
    ): MeteringPointState => ({
      ...state,
      meteringPoint: meteringPointData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): MeteringPointState => ({
      ...state,
      isLoading,
    })
  );

  private updateMeteringPointNotFound = this.updater(
    (state, meteringPointNotFound: boolean): MeteringPointState => ({
      ...state,
      meteringPointNotFound,
    })
  );

  private upateError = this.updater(
    (state: MeteringPointState, hasError: boolean): MeteringPointState => ({
      ...state,
      meteringPoint: undefined,
      hasError,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.setLoading(false);

    const noMeteringPointData = undefined;
    this.updateMeteringPointData(noMeteringPointData);

    const meteringPointNotFound = error.status === HttpStatusCode.NotFound;
    this.updateMeteringPointNotFound(meteringPointNotFound);

    const otherResponseError = !meteringPointNotFound;
    this.upateError(otherResponseError);
  };

  private resetState = () => this.setState(initialState);
}
