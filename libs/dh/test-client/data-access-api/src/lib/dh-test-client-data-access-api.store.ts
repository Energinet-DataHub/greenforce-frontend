/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import {
  SendMessageTemplateDTO,
  SendMessageTemplateListDTO,
  SendMessageResultDTO,
  TestClientHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export const enum ErrorState {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  OTHER_ERROR = 'OTHER_ERROR',
}

interface SendMessageTemplateState {
  readonly sendMessageTemplate?: SendMessageTemplateDTO;
  readonly sendMessageTemplateList?: SendMessageTemplateListDTO;
  readonly sendMessageResult?: SendMessageResultDTO;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: SendMessageTemplateState = {
sendMessageTemplate: undefined,
sendMessageTemplateList: undefined,
  sendMessageResult: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhTestClientDataAccessApiStore extends ComponentStore<SendMessageTemplateState> {

  sendMessageTemplate$: Observable<SendMessageTemplateDTO> = this.select(
    (state) => state.sendMessageTemplate
  ).pipe(
    filter((sendMessageTemplate) => !!sendMessageTemplate),
    map((sendMessageTemplate) => sendMessageTemplate as SendMessageTemplateDTO)
  );

  sendMessageTemplateList$: Observable<SendMessageTemplateListDTO> = this.select(
    (state) => state.sendMessageTemplateList
  ).pipe(
    filter((sendMessageTemplateList) => !!sendMessageTemplateList),
    map((sendMessageTemplateList) => sendMessageTemplateList as SendMessageTemplateListDTO)
  );

  sendMessageResult$: Observable<SendMessageResultDTO> = this.select(
    (state) => state.sendMessageResult
  ).pipe(
    //!! is to avoid null right?
    filter((sendMessageResult) => !!sendMessageResult),
    map((sendMessageResult) => sendMessageResult as SendMessageResultDTO)
  );

  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  sendMessageNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasError$ = this.select(
    (state) => state.requestState === ErrorState.OTHER_ERROR
  );

  constructor(private httpClient: TestClientHttp) {
    super(initialState);
  }

  readonly getSendMessageTemplate = this.effect(
    (sendMessageTemplateId: Observable<string>) => {
      return sendMessageTemplateId.pipe(
        tap(() => {
          this.resetState();
          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1TestClientGetSendMessageTemplateDTOGet(id).pipe(
            tapResponse(
              (sendMessageTemplateData) => {
                this.setLoading(false);

                this.updateSendMessageTemplateData(sendMessageTemplateData);
              },
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

  // readonly getSendMessageTemplateList = this.effect(
  //   (sendMessageTemplddateId: Observable) => {
  //     return sendMessageTemplddateId.pipe(
  //       tap(() => {
  //         this.resetState();
  //         this.setLoading(true);
  //       }),
  //       switchMap(() =>
  //         this.httpClient.v1TestClientGetSendMessageTemplateListDTOGet().pipe(
  //           tapResponse(
  //             (sendMessageTemplateListData) => {
  //               this.setLoading(false);

  //               this.updateSendMessageTemplateListData(sendMessageTemplateListData);
  //             },
  //             (error: HttpErrorResponse) => this.handleError(error)
  //           )
  //         )
  //       )
  //     );
  //   }
  // );


  readonly getSendMessage = this.effect(
    (sendMessageTemplateObs: Observable<SendMessageTemplateDTO>) => {
      return sendMessageTemplateObs.pipe(
        tap(() => {
          //this.resetState();
          //console.error(temp);
          this.setLoading(true);
        }),
        switchMap((sendMessageTemplateDto) =>
          this.httpClient.v1TestClientSendMessagePost(sendMessageTemplateDto).pipe(
            tapResponse(
              (sendMessageResultData) => {
                console.error(sendMessageResultData);
                this.setLoading(false);
                this.updateSendMessageResultData(sendMessageResultData);
              },
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

  // readonly getDynamicRules = this.effect(
  //   () =>
  //   this.httpClient.v1TestClientGetDynamicValidationsGet().pipe(

  //       tap((temp) => {
  //         //this.resetState();
  //         const scriptElem = document.createElement('script');
  //         scriptElem.text = "function LogItXIGATEST() { alert('called');}";
  //         scriptElem.type = 'text/javascript';
  //         document.body.appendChild(scriptElem);
  //         console.error('added script');
  //       }),
  //       tap(() => {
  //         console.error('temp ttttt');
  //         //eval('LogItXIGATEST()');
  //         //LogItXIGATEST('called');
  //       })
  // ));

  // private loadExternalScript(url: string) {
  //   const body = <HTMLDivElement> document.body;
  //   const script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = url;
  //   script.async = true;
  //   script.defer = true;
  //   body.appendChild(script);
  // }

  private updateSendMessageResultData = this.updater(
    (
      state: SendMessageTemplateState,
      sendMessageResultData: SendMessageResultDTO | undefined
    ): SendMessageTemplateState => ({
      ...state,
      sendMessageResult: sendMessageResultData,
    })
  );

  private updateSendMessageTemplateListData = this.updater(
    (
      state: SendMessageTemplateState,
      sendMessageTemplateListData: SendMessageTemplateListDTO | undefined
    ): SendMessageTemplateState => ({
      ...state,
      sendMessageTemplateList: sendMessageTemplateListData,
    })
  );



  public updateSendMessageTemplateData = this.updater(
    (
      state: SendMessageTemplateState,
      sendMessageTemplateData: SendMessageTemplateDTO | undefined
    ): SendMessageTemplateState => ({
      ...state,
      sendMessageTemplate: sendMessageTemplateData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): SendMessageTemplateState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private updateSendMessageTemplateNotFound = this.updater(
    (state): SendMessageTemplateState => ({
      ...state,
      requestState: ErrorState.NOT_FOUND_ERROR,
    })
  );

  private upateError = this.updater(
    (state: SendMessageTemplateState): SendMessageTemplateState => ({
      ...state,
      sendMessageTemplate: undefined,
      requestState: ErrorState.OTHER_ERROR,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.setLoading(false);

    const sendMessageTemplateData = undefined;
    this.updateSendMessageTemplateData(sendMessageTemplateData);

    if (error.status === HttpStatusCode.NotFound) {
      this.updateSendMessageTemplateNotFound();
    } else {
      this.upateError();
    }
  };

  private resetState = () => this.setState(initialState);


  public sendMessageSimple( sendMessageTemplateDto :SendMessageTemplateDTO) : void
  {
    this.httpClient.v1TestClientSendMessagePost(sendMessageTemplateDto).pipe(
      tapResponse(
        (sendMessageResultData) => {
          console.error(sendMessageResultData);
          this.setLoading(false);
          this.updateSendMessageResultData(sendMessageResultData);
        },
        (error: HttpErrorResponse) => this.handleError(error)
      )
    ).subscribe();
  }

  public getMessageMessageTemplateList() : void
  {
    this.httpClient.v1TestClientGetSendMessageTemplateListDTOGet().pipe(
      tapResponse(
        (sendMessageTempListData) => {
          //console.error(sendMessageTempListData);
          this.setLoading(false);
          this.updateSendMessageTemplateListData(sendMessageTempListData);
        },
        (error: HttpErrorResponse) => this.handleError(error)
      )
    ).subscribe();
  }

}
