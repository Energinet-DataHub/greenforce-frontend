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
