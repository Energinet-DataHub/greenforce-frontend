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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { eoFaqRoutePath } from '@energinet-datahub/eo/shared/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-faq-shell',
  styles: [
    `
      :host {
        display: block;
        max-width: 1040px; // Magic number by designer
      }

      .faq-link a {
        color: var(--watt-color-primary);
        text-decoration: none;
      }

      h3 {
        margin-top: var(--watt-space-xl);
        margin-bottom: var(--watt-space-s);
      }
    `,
  ],
  template: `
    <div class="watt-space-stack-m faq-link">
      <a href="${eoFaqRoutePath}#what-is-energy-origin">
        What is Energy Origin?
      </a>
    </div>
    <div class="watt-space-stack-m faq-link">
      <a href="${eoFaqRoutePath}#who-can-access-the-platform">
        Who can access the platform?
      </a>
    </div>
    <div class="watt-space-stack-m faq-link">
      <a href="${eoFaqRoutePath}#where-does-the-data-come-from">
        Where does the data come from?
      </a>
    </div>
    <div class="watt-space-stack-m faq-link">
      <a href="${eoFaqRoutePath}#how-can-i-influence-the-development">
        How can I influence the development?
      </a>
    </div>
    <div class="watt-space-stack-m faq-link">
      <a href="${eoFaqRoutePath}#where-can-i-read-more">
        Where can I read more?
      </a>
    </div>

    <h3 id="what-is-energy-origin">What is Energy Origin?</h3>
    <p>
      The aim of the Energy Origin platform is to create transparency on the
      origin of energy for all energy consumers and to facilitate a market for
      for green energy. Currently, we are working on data related to electricity
      consumption. Upon login, you will soon be able to access your hourly
      electricity declaration and corresponding emissions for 2021.
    </p>

    <h3 id="who-can-access-the-platform">Who can access the platform?</h3>
    <p>
      Currently, the platform only offers company login via NemID. Later on, it
      will be possible for private individuals to login via NemID / MitID.
    </p>

    <h3 id="where-does-the-data-come-from">Where does the data come from?</h3>
    <p>
      All data related to metering points, consumption and production is served
      by the Energinet DataHub. Data related to the origin of energy and
      corresponding emissions stems from Energi Data Service.
    </p>

    <h3 id="how-can-i-influence-the-development">
      How can I influence the development?
    </h3>
    <p>
      You are more than welcome to participate in our LinkedIn user group, a
      digital forum for users, in which we post sketches, questions and gather
      ideas and suggestions for new development and improvements. It's
      non-binding and you can either just follow along without getting involved
      or comment when you have time.
    </p>

    <h3 id="where-can-i-read-more">Where can I read more?</h3>
    <p>
      You can read more about the history and intention of Energy Origin on our
      website:
      <a
        href="https://en.energinet.dk/Energy-data/DataHub/Energy-Origin"
        target="_blank"
        rel="noopener noreferrer"
      >
        Origins of energy | Energinet
      </a>
    </p>
  `,
})
export class EoFaqShellComponent {}

@NgModule({
  declarations: [EoFaqShellComponent],
})
export class EoFaqShellScam {}
