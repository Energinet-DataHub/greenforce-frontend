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
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UserRoleInfoDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserRolesManagementState {
  readonly roles: UserRoleInfoDto[]
  readonly totalUserRolesCount: number;
  readonly requestState: LoadingState | ErrorState;
  readonly pageNumber: number;
  readonly pageSize: number;
}

const initialState: DhUserRolesManagementState = {
  roles: [],
  totalUserRolesCount: 0,
  requestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
};

@Injectable()
export class DhAdminUserRolesManagementDataAccessApiStore extends ComponentStore<DhUserRolesManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  roles$ = this.select((state) => state.roles);
  totalUserCount$ = this.select((state) => state.totalUserRolesCount);

  // 1 needs to be substracted here because our endpoint's `pageNumber` param starts at `1`
  // whereas the paginator's `pageIndex` property starts at `0`
  paginatorPageIndex$ = this.select((state) => state.pageNumber - 1);
  pageSize$ = this.select((state) => state.pageSize);

  constructor(
    private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getRoles = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      withLatestFrom(this.state$),
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap(([, state]) =>
        this.httpClientUserRole
          .v1MarketParticipantUserRoleGetAllGet()
          .pipe(
            tapResponse(
              (response) => {
                console.log(response);
                this.updateUserRoles(
                  [{ name: 'Role1', description: 'Text1', eicFunction: 'Agent', id: '1', status: 0 }]
                )
                this.setLoading(LoadingState.LOADED);
              },
              () => {
                this.setLoading(LoadingState.LOADED);
                this.updateUserRoles(
                  [{ name: 'Role1', description: 'Text1', eicFunction: 'Agent', id: '1', status: 0 },
                  { name: 'Role2', description: 'Text2', eicFunction: 'Agent', id: '2', status: 0 },
                  { name: 'Role3', description: 'Text3', eicFunction: 'Agent', id: '3', status: 0 },
                  { name: 'Role4', description: 'Text4', eicFunction: 'Agent', id: '4', status: 0 },
                  { name: 'Role5', description: 'Text5', eicFunction: 'Agent', id: '5', status: 0 },
                  { name: 'Role6', description: 'Text6', eicFunction: 'Agent', id: '6', status: 0 },
                  { name: 'Role7', description: 'Text7', eicFunction: 'Agent', id: '7', status: 0 },
                  { name: 'Role8', description: 'Text8', eicFunction: 'Agent', id: '8', status: 0 },
                  { name: 'Role9', description: 'Text9', eicFunction: 'Agent', id: '9', status: 0 },
                  { name: 'Role10', description: 'Text10', eicFunction: 'Agent', id: '10', status: 0 },
                  { name: 'Role11', description: 'Text11', eicFunction: 'Agent', id: '11', status: 0 },
                  { name: 'Role12', description: 'Text12', eicFunction: 'Agent', id: '12', status: 0 },
                  { name: 'Role13', description: 'Text13', eicFunction: 'Agent', id: '13', status: 0 },
                  { name: 'Role14', description: 'Text14', eicFunction: 'Agent', id: '14', status: 0 },
                  { name: 'Role15', description: 'Text15', eicFunction: 'Agent', id: '15', status: 0 },
                  { name: 'Role16', description: 'Text16', eicFunction: 'Agent', id: '16', status: 0 },
                  { name: 'Role17', description: 'Text17', eicFunction: 'Agent', id: '17', status: 0 },
                  { name: 'Role18', description: 'Text18', eicFunction: 'Agent', id: '18', status: 0 },
                  { name: 'Role19', description: 'Text19', eicFunction: 'Agent', id: '19', status: 0 },
                  { name: 'Role20', description: 'Text20', eicFunction: 'Agent', id: '20', status: 0 },
                  { name: 'Role21', description: 'Text21', eicFunction: 'Agent', id: '21', status: 0 },
                  { name: 'Role22', description: 'Text22', eicFunction: 'Agent', id: '22', status: 0 },
                  { name: 'Role23', description: 'Text23', eicFunction: 'Agent', id: '23', status: 0 },
                  { name: 'Role24', description: 'Text24', eicFunction: 'Agent', id: '24', status: 0 },
                  { name: 'Role25', description: 'Text25', eicFunction: 'Agent', id: '25', status: 0 },
                  { name: 'Role26', description: 'Text26', eicFunction: 'Agent', id: '26', status: 0 },
                  { name: 'Role27', description: 'Text27', eicFunction: 'Agent', id: '27', status: 0 },
                  { name: 'Role28', description: 'Text28', eicFunction: 'Agent', id: '28', status: 0 },
                  { name: 'Role29', description: 'Text29', eicFunction: 'Agent', id: '29', status: 0 },
                  { name: 'Role30', description: 'Text30', eicFunction: 'Agent', id: '30', status: 0 },
                  { name: 'Role31', description: 'Text31', eicFunction: 'Agent', id: '31', status: 0 },
                  { name: 'Role32', description: 'Text32', eicFunction: 'Agent', id: '32', status: 0 },
                  { name: 'Role33', description: 'Text33', eicFunction: 'Agent', id: '33', status: 0 },
                  { name: 'Role34', description: 'Text34', eicFunction: 'Agent', id: '34', status: 0 },
                  { name: 'Role35', description: 'Text35', eicFunction: 'Agent', id: '35', status: 0 },
                  { name: 'Role36', description: 'Text36', eicFunction: 'Agent', id: '36', status: 0 },
                  { name: 'Role37', description: 'Text37', eicFunction: 'Agent', id: '37', status: 0 },
                  { name: 'Role38', description: 'Text38', eicFunction: 'Agent', id: '38', status: 0 },
                  { name: 'Role39', description: 'Text39', eicFunction: 'Agent', id: '39', status: 0 },
                  { name: 'Role40', description: 'Text40', eicFunction: 'Agent', id: '40', status: 0 },
                  { name: 'Role41', description: 'Text41', eicFunction: 'Agent', id: '41', status: 0 },
                  { name: 'Role42', description: 'Text42', eicFunction: 'Agent', id: '42', status: 0 },
                  { name: 'Role43', description: 'Text43', eicFunction: 'Agent', id: '43', status: 0 },
                  { name: 'Role44', description: 'Text44', eicFunction: 'Agent', id: '44', status: 0 },
                  { name: 'Role45', description: 'Text45', eicFunction: 'Agent', id: '45', status: 0 },
                  { name: 'Role46', description: 'Text46', eicFunction: 'Agent', id: '46', status: 0 },
                  { name: 'Role47', description: 'Text47', eicFunction: 'Agent', id: '47', status: 0 },
                  { name: 'Role48', description: 'Text48', eicFunction: 'Agent', id: '48', status: 0 },
                  { name: 'Role49', description: 'Text49', eicFunction: 'Agent', id: '49', status: 0 },
                  { name: 'Role50', description: 'Text50', eicFunction: 'Agent', id: '50', status: 0 },
                  { name: 'Role51', description: 'Text51', eicFunction: 'Agent', id: '51', status: 0 },
                  { name: 'Role52', description: 'Text52', eicFunction: 'Agent', id: '52', status: 0 },
                  { name: 'Role53', description: 'Text53', eicFunction: 'Agent', id: '53', status: 0 },
                  { name: 'Role54', description: 'Text54', eicFunction: 'Agent', id: '54', status: 0 },
                  { name: 'Role55', description: 'Text55', eicFunction: 'Agent', id: '55', status: 0 },
                  { name: 'Role56', description: 'Text56', eicFunction: 'Agent', id: '56', status: 0 },
                  { name: 'Role57', description: 'Text57', eicFunction: 'Agent', id: '57', status: 0 },
                  { name: 'Role58', description: 'Text58', eicFunction: 'Agent', id: '58', status: 0 },
                  { name: 'Role59', description: 'Text59', eicFunction: 'Agent', id: '59', status: 0 },
                  { name: 'Role60', description: 'Text60', eicFunction: 'Agent', id: '60', status: 0 },
                  { name: 'Role61', description: 'Text61', eicFunction: 'Agent', id: '61', status: 0 },
                  { name: 'Role62', description: 'Text62', eicFunction: 'Agent', id: '62', status: 0 },
                  { name: 'Role63', description: 'Text63', eicFunction: 'Agent', id: '63', status: 0 },
                  { name: 'Role64', description: 'Text64', eicFunction: 'Agent', id: '64', status: 0 },
                  { name: 'Role65', description: 'Text65', eicFunction: 'Agent', id: '65', status: 0 },
                  { name: 'Role66', description: 'Text66', eicFunction: 'Agent', id: '66', status: 0 },
                  { name: 'Role67', description: 'Text67', eicFunction: 'Agent', id: '67', status: 0 },
                  { name: 'Role68', description: 'Text68', eicFunction: 'Agent', id: '68', status: 0 },
                  { name: 'Role69', description: 'Text69', eicFunction: 'Agent', id: '69', status: 0 },
                  { name: 'Role70', description: 'Text70', eicFunction: 'Agent', id: '70', status: 0 },
                  { name: 'Role71', description: 'Text71', eicFunction: 'Agent', id: '71', status: 0 },
                  { name: 'Role72', description: 'Text72', eicFunction: 'Agent', id: '72', status: 0 },
                  { name: 'Role73', description: 'Text73', eicFunction: 'Agent', id: '73', status: 0 },
                  { name: 'Role74', description: 'Text74', eicFunction: 'Agent', id: '74', status: 0 },
                  { name: 'Role75', description: 'Text75', eicFunction: 'Agent', id: '75', status: 0 },
                  { name: 'Role76', description: 'Text76', eicFunction: 'Agent', id: '76', status: 0 },
                  { name: 'Role77', description: 'Text77', eicFunction: 'Agent', id: '77', status: 0 },
                  { name: 'Role78', description: 'Text78', eicFunction: 'Agent', id: '78', status: 0 },
                  { name: 'Role79', description: 'Text79', eicFunction: 'Agent', id: '79', status: 0 },
                  { name: 'Role80', description: 'Text80', eicFunction: 'Agent', id: '80', status: 0 },
                  { name: 'Role81', description: 'Text81', eicFunction: 'Agent', id: '81', status: 0 },
                  { name: 'Role82', description: 'Text82', eicFunction: 'Agent', id: '82', status: 0 },
                  { name: 'Role83', description: 'Text83', eicFunction: 'Agent', id: '83', status: 0 },
                  { name: 'Role84', description: 'Text84', eicFunction: 'Agent', id: '84', status: 0 },
                  { name: 'Role85', description: 'Text85', eicFunction: 'Agent', id: '85', status: 0 },
                  { name: 'Role86', description: 'Text86', eicFunction: 'Agent', id: '86', status: 0 },
                  { name: 'Role87', description: 'Text87', eicFunction: 'Agent', id: '87', status: 0 },
                  { name: 'Role88', description: 'Text88', eicFunction: 'Agent', id: '88', status: 0 },
                  { name: 'Role89', description: 'Text89', eicFunction: 'Agent', id: '89', status: 0 },
                  { name: 'Role90', description: 'Text90', eicFunction: 'Agent', id: '90', status: 0 },
                  { name: 'Role91', description: 'Text91', eicFunction: 'Agent', id: '91', status: 0 },
                  { name: 'Role92', description: 'Text92', eicFunction: 'Agent', id: '92', status: 0 },
                  { name: 'Role93', description: 'Text93', eicFunction: 'Agent', id: '93', status: 0 },
                  { name: 'Role94', description: 'Text94', eicFunction: 'Agent', id: '94', status: 0 },
                  { name: 'Role95', description: 'Text95', eicFunction: 'Agent', id: '95', status: 0 },
                  { name: 'Role96', description: 'Text96', eicFunction: 'Agent', id: '96', status: 0 },
                  { name: 'Role97', description: 'Text97', eicFunction: 'Agent', id: '97', status: 0 },
                  { name: 'Role98', description: 'Text98', eicFunction: 'Agent', id: '98', status: 0 },
                  { name: 'Role99', description: 'Text99', eicFunction: 'Agent', id: '99', status: 0 },
                  { name: 'Role100', description: 'Text100', eicFunction: 'Agent', id: '100', status: 0 },
                  { name: 'Role101', description: 'Text101', eicFunction: 'Agent', id: '101', status: 0 }]
                )
                //this.handleError();
              }
            )
          )
      )
    )
  );

  readonly updatePageMetadata = this.effect(
    (trigger$: Observable<{ pageIndex: number; pageSize: number }>) =>
      trigger$.pipe(
        tap(({ pageIndex, pageSize }) => {
          // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
          // whereas our endpoint's `pageNumber` param starts at `1`
          this.patchState({ pageNumber: pageIndex + 1, pageSize });
        })
      )
  );

  private updateUserRoles = this.updater(
    (
      state: DhUserRolesManagementState,
      response: UserRoleInfoDto[]
    ): DhUserRolesManagementState => ({
      ...state,
      roles: response,
      totalUserRolesCount: response.length,
      pageNumber: 1
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserRolesManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUserRoles([]);
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);

  ngrxOnStoreInit(): void {
    this.getRoles();
  }
}
