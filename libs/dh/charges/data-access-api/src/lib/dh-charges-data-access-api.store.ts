import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpErrorResponse } from '@angular/common/http';
import { ChargeV1Dto, ChargesHttp } from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap, map, filter } from 'rxjs';

interface ChargesState {
  readonly charges?: Array<ChargeV1Dto>;
  readonly isLoading: boolean;
}

const initialState: ChargesState = {
  charges: undefined,
  isLoading: false,
};

@Injectable()
export class DhChargesDataAccessApiStore extends ComponentStore<ChargesState> {
  all$ = this.select((state) => state.charges);
  isLoading$ = this.select((state) => state.isLoading);

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly loadChargesData = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => {
        this.resetState();

        this.setLoading(true);
      }),
      switchMap(() =>
        this.httpClient.v1ChargesGet().pipe(
          tapResponse(
            (chargesData) => {
              this.setLoading(false);

              this.updateChargesData(chargesData);
            },
            (error: HttpErrorResponse) => {
              this.setLoading(false);
            }
          )
        )
      )
    );
  });

  private updateChargesData = this.updater(
    (
      state: ChargesState,
      chargesData: Array<ChargeV1Dto> | undefined
    ): ChargesState => ({
      ...state,
      charges: chargesData || [],
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ChargesState => ({
      ...state,
      isLoading: isLoading,
    })
  );

  private resetState = () => this.setState(initialState);
}
