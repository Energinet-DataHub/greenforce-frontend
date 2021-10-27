import { NgModule } from '@angular/core';
import { RX_ANGULAR_CONFIG, RxAngularConfig } from '@rx-angular/cdk';

@NgModule({
  providers: [
    {
      provide: RX_ANGULAR_CONFIG,
      useValue: {
        primaryStrategy: 'global', // or 'native'?
      } as RxAngularConfig<string>,
    },
  ],
})
export class EttRxAngularTestingModule {}
