import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { ChargeLinksHttp } from './api/charge-links-http.service';
import { ChargesHttp } from './api/charges-http.service';
import { MarketParticipantHttp } from './api/market-participant-http.service';
import { MarketParticipantGridAreaHttp } from './api/market-participant-grid-area-http.service';
import { MarketParticipantGridAreaOverviewHttp } from './api/market-participant-grid-area-overview-http.service';
import { MarketParticipantUserHttp } from './api/market-participant-user-http.service';
import { MarketParticipantUserOverviewHttp } from './api/market-participant-user-overview-http.service';
import { MarketParticipantUserRoleAssignmentHttp } from './api/market-participant-user-role-assignment-http.service';
import { MarketParticipantUserRoleTemplateHttp } from './api/market-participant-user-role-template-http.service';
import { MessageArchiveHttp } from './api/message-archive-http.service';
import { MeteringPointHttp } from './api/metering-point-http.service';
import { TokenHttp } from './api/token-http.service';
import { WholesaleBatchHttp } from './api/wholesale-batch-http.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
