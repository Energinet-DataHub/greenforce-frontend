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
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  AddressDto,
  ChangeOrganizationDto,
  ContactCategory,
  CreateOrganizationDto,
  MarketParticipantHttp,
  OrganizationStatus,
} from '@energinet-datahub/dh/shared/domain';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

export interface OrganizationChanges {
  organizationId?: string;
  name?: string;
  businessRegisterIdentifier?: string;
  address: AddressDto;
  domain?: string;
  comment?: string;
  status?: OrganizationStatus;
}

export interface ContactChanges {
  isValid: boolean;
  category?: ContactCategory;
  name?: string;
  email?: string;
  phone?: string | null;
}

export interface MarketParticipantEditOrganizationState {
  isLoading: boolean;
  isEditing: boolean;

  // Changes
  changes: OrganizationChanges;

  // Validation
  validation?: { error: string };
}

const initialState: MarketParticipantEditOrganizationState = {
  isLoading: false,
  isEditing: false,
  changes: { address: { country: 'DK' }, status: OrganizationStatus.New },
};

@Injectable()
export class DhMarketParticipantEditOrganizationDataAccessApiStore extends ComponentStore<MarketParticipantEditOrganizationState> {
  isLoading$ = this.select((state) => state.isLoading);
  isEditing$ = this.select((state) => state.isEditing);
  validation$ = this.select((state) => state.validation);
  changes$ = this.select((state) => state.changes);

  constructor(private httpClient: MarketParticipantHttp) {
    super(initialState);
  }

  readonly getOrganizationAndContacts = this.effect(
    (organizationId$: Observable<string>) =>
      organizationId$.pipe(
        tap(() => this.patchState({ isLoading: true })),
        switchMap((organizationId) => {
          if (!organizationId) {
            this.patchState({
              isLoading: false,
              changes: {
                address: { country: 'DK' },
                status: OrganizationStatus.New,
              },
            });
            return EMPTY;
          }
          return this.getOrganization(organizationId).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
              this.patchState({
                validation: {
                  error: parseErrorResponse(errorResponse),
                },
              });
              return EMPTY;
            })
          );
        }),
        tap(() => this.patchState({ isLoading: false }))
      )
  );

  readonly save = this.effect((onSaveCompletedFn$: Observable<() => void>) =>
    onSaveCompletedFn$.pipe(
      tap(() => this.patchState({ isLoading: true, validation: undefined })),
      withLatestFrom(this.changes$),
      switchMap(([onSaveCompletedFn, progress]) =>
        of(progress).pipe(
          switchMap((changes) => this.saveOrganization(changes)),
          tapResponse(
            (state) => {
              this.patchState({
                isLoading: !state.organizationSaved,
              });
              onSaveCompletedFn();
            },
            (errorResponse: HttpErrorResponse) => {
              this.patchState({
                isLoading: false,
                validation: {
                  error: parseErrorResponse(errorResponse),
                },
              });
            }
          )
        )
      )
    )
  );

  private readonly saveOrganization = (
    organizationChanges: OrganizationChanges
  ) => {
    if (organizationChanges.organizationId !== undefined) {
      return this.httpClient
        .v1MarketParticipantOrganizationUpdateOrganizationPut(
          organizationChanges.organizationId,
          organizationChanges as ChangeOrganizationDto
        )
        .pipe(map(() => ({ ...organizationChanges, organizationSaved: true })));
    }

    return this.httpClient
      .v1MarketParticipantOrganizationCreateOrganizationPost(
        organizationChanges as CreateOrganizationDto
      )
      .pipe(
        map((organizationId) => ({
          ...organizationChanges,
          organizationSaved: true,
          organizationId,
        }))
      );
  };

  private readonly getOrganization = (organizationId: string) =>
    this.httpClient
      .v1MarketParticipantOrganizationGetOrganizationGet(organizationId)
      .pipe(
        tap((organization) =>
          this.patchState({
            isEditing: true,
            changes: { ...organization },
          })
        )
      );

  readonly setMasterDataChanges = (changes: OrganizationChanges) =>
    this.patchState({
      changes,
    });
}
