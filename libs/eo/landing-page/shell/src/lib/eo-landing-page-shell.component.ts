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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WattButtonModule } from '@energinet-datahub/watt';
import { WattButtonVariant } from '@energinet-datahub/watt';

const selector = 'eo-landingpage-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        header {
          display: flex;
          justify-content: space-between;
          padding: 0 20px 0 20px;
          align-items: center;
          height: 64px;
          background: #FFF;
        }
      }
    `,
  ],
  template: `
    <header>
      <nav>
        <img src="assets/energyorigin-logo.png" />
      </nav>
      <nav>
        <watt-button [variant]=buttonVariant>START</watt-button>
      </nav>
    </header>
  `,
})
export class EoLandingPageShellComponent implements OnInit {
  DEFAULT_ERROR_MESSAGE = 'Der opstod en ukendt fejl, prøv venligst igen.';

  // TODO Get messages from i18n
  // The backend also provides fallback messages in case any
  // error code is unknown to the frontend.
  ERROR_MESSAGES: { [key: string]: string } = {
    E0: 'Ukendt fejl fra Identity Provider',
    E1: 'Login afbrudt af bruger',
    E3: 'CPR validering fejlede',
    E500: 'Internal fejl',
    E501: 'Der opstod en fejl hos Identity Provider',
    E505: 'Kunne ikke kommunikere med Identity Provider',
  };

  readonly buttonVariant: WattButtonVariant = 'primary';
  errorMessage?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if ('error_code' in params) {
        if (params.error_code in this.ERROR_MESSAGES) {
          this.errorMessage = this.ERROR_MESSAGES[params.error_code];
        } else if ('error' in params) {
          this.errorMessage = params.error;
        } else {
          this.errorMessage = this.DEFAULT_ERROR_MESSAGE;
        }
      } else {
        this.errorMessage = '';
      }
    });
  }
}


// @todo: JAN K -> Forstå denne her export(?)
@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [WattButtonModule], // Import modules used in this view here
})
export class EoLandingPageShellScam {}
