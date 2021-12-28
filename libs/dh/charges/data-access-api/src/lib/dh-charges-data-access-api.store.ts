import { Injectable } from '@angular/core';
import { ChargeLinkDto, ChargeLinksHttp, ChargeType } from '@energinet-datahub/dh/shared/data-access-api';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface ChargesState {
  readonly charges?: Array<ChargeLinkDto>;
  readonly chargesNotFound: boolean;
  readonly isLoading: boolean;
  readonly hasError: boolean;
}

const initialState: ChargesState = {
  charges: undefined,
  chargesNotFound: false,
  isLoading: false,
  hasError: false,
};

@Injectable()
export class DhChargesDataAccessApiStore extends ComponentStore<ChargesState>{
  tariffs$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) => charges.filter(charge => charge.chargeType === ChargeType.D01))
  );

  subscriptions$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) => charges.filter(charge => charge.chargeType === ChargeType.D02))
  );

  fees$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) => charges.filter(charge => charge.chargeType === ChargeType.D03))
  );

  isLoading$ = this.select((state) => state.isLoading);
  chargesNotFound$ = this.select((state) => state.chargesNotFound);
  hasError$ = this.select((state) => state.hasError);

  constructor(private httpClient: ChargeLinksHttp) {
    super(initialState);
  }

  readonly loadChargesData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1ChargeLinksGet(id).pipe(
            tapResponse(
              (chargesData) => {
                this.setLoading(false);

                this.updateChargesData(chargesData);
              },
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

  private updateChargesData = this.updater(
    (
      state: ChargesState,
      chargesData: Array<ChargeLinkDto> | undefined
    ): ChargesState => ({
      ...state,
      charges: chargesData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ChargesState => ({
      ...state,
      isLoading,
    })
  );

  private updateChargesNotFound = this.updater(
    (state, chargesNotFound: boolean): ChargesState => ({
      ...state,
      chargesNotFound,
    })
  );

  private upateError = this.updater(
    (state: ChargesState, hasError: boolean): ChargesState => ({
      ...state,
      charges: undefined,
      hasError,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.setLoading(false);

    const noChargesData = undefined;
    this.updateChargesData(noChargesData);

    const chargesNotFound = error.status === HttpStatusCode.NotFound;
    this.updateChargesNotFound(chargesNotFound);

    const otherResponseError = !chargesNotFound;
    this.upateError(otherResponseError);
  };

  private resetState = () => this.setState(initialState);
}
