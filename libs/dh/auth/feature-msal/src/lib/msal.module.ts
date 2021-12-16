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
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MsalInterceptorConfiguration } from "@azure/msal-angular";
import { IPublicClientApplication } from "@azure/msal-browser";
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from "./msal-constants";
import { MsalBroadcastService } from "./msal.broadcast.service";
import { MsalGuard } from "./msal.guard";
import { MsalGuardConfiguration } from "./msal.guard.config";
import { MsalService } from "./msal.service";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        MsalGuard,
        MsalBroadcastService
    ]
})
export class MsalModule {
    static forRoot(
        msalInstance: IPublicClientApplication,
        guardConfig: MsalGuardConfiguration,
        interceptorConfig: MsalInterceptorConfiguration
    ): ModuleWithProviders<MsalModule> {
        return {
            ngModule: MsalModule,
            providers: [
                {
                    provide: MSAL_INSTANCE,
                    useValue: msalInstance
                },
                {
                    provide: MSAL_GUARD_CONFIG,
                    useValue: guardConfig
                },
                {
                    provide: MSAL_INTERCEPTOR_CONFIG,
                    useValue: interceptorConfig
                },
                MsalService
            ]
        };
    }

}
