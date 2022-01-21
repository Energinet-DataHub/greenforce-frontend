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
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { HttpRequest } from '@angular/common/http';
import {
  PopupRequest,
  RedirectRequest,
  InteractionType,
  SilentRequest,
} from '@azure/msal-browser';
import { MsalService } from './msal.service';

export declare type MsalInterceptorAuthRequest =
  | Omit<PopupRequest, 'scopes'>
  | Omit<RedirectRequest, 'scopes'>
  | Omit<SilentRequest, 'scopes'>;

export type MsalInterceptorConfiguration = {
  interactionType: InteractionType.Popup | InteractionType.Redirect;
  protectedResourceMap: Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >;
  authRequest?:
    | MsalInterceptorAuthRequest
    | ((
        msalService: MsalService,
        req: HttpRequest<unknown>,
        originalAuthRequest: MsalInterceptorAuthRequest
      ) => MsalInterceptorAuthRequest);
};

export type ProtectedResourceScopes = {
  httpMethod: string;
  scopes: Array<string>;
};

export type MatchingResources = {
  absoluteResources: Array<string>;
  relativeResources: Array<string>;
};
