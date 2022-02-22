import {ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation} from '@angular/core';
import {EoPrivacyPolicyStore} from './eo-privacy-policy.store';
import {EoScrollViewScam} from '@energinet-datahub/eo/shared/atomic-design/atoms';
import {Observable} from 'rxjs';
import {PushModule} from '@rx-angular/template';

const selector = 'eo-privacy-policy';

@Component({
  selector,
  template: `
    <h1 class="${selector}__heading">{{ headline$ | push }}</h1>
    <eo-scroll-view>
      <div [innerHTML]="terms$ | push"></div>
    </eo-scroll-view>
  `,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
        width: calc(200 * var(--watt-space-xs));
        > .${selector}__heading {
          text-transform: none; // Override .watt-headline-1
          margin-bottom: var(--watt-space-l);
        }
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EoPrivacyPolicyComponent {
  version$: Observable<string> = this.store.version$;
  headline$: Observable<string> = this.store.headline$;
  terms$: Observable<string> = this.store.privacyPolicy$;

  constructor(private store: EoPrivacyPolicyStore) { }
}

@NgModule({
  imports: [EoScrollViewScam, PushModule],
  providers: [EoPrivacyPolicyStore],
  declarations: [EoPrivacyPolicyComponent],
  exports: [EoPrivacyPolicyComponent]
})
export class EoPrivacyPolicyScam {}
