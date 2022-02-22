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
      <p class="${selector}__paragraph">Version {{ version$ | push }}</p>
      <div [innerHTML]="privacyPolicy$ | push"></div>
    </eo-scroll-view>
  `,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
        width: calc(200 * var(--watt-space-xs));
        > .${selector}__heading { // Overrides Angular Material styles for the h1 element
          @include watt.typography-watt-headline-1;
          text-transform: none; // Override .watt-headline-1
        }
        .${selector}__paragraph {
          @include watt.typography-watt-text-s;
          color: var(--watt-color-neutral-grey-600);
        }
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EoPrivacyPolicyComponent {
  headline$: Observable<string> = this.store.headline$;
  version$: Observable<string> = this.store.version$;
  privacyPolicy$: Observable<string> = this.store.privacyPolicy$;

  constructor(private store: EoPrivacyPolicyStore) { }
}

@NgModule({
  imports: [EoScrollViewScam, PushModule],
  providers: [EoPrivacyPolicyStore],
  declarations: [EoPrivacyPolicyComponent],
  exports: [EoPrivacyPolicyComponent]
})
export class EoPrivacyPolicyScam {}
