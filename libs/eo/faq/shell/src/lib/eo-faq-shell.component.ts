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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-faq-shell',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <div class="watt-space-stack-xl">
      <div class="watt-space-stack-m">
      <a
        (click)="scrollToTargetElement(what_is_energy_origin)"
        >What is Energy Origin?</a
      >
      </div>
      <div class="watt-space-stack-m">
        <a
          (click)="scrollToTargetElement(who_can_access_the_platform)"
        >Who can access the platform?</a
        >
      </div>
      <div class="watt-space-stack-m">
        <a
          (click)="scrollToTargetElement(where_does_the_data_come_from)"
        >Where does the data come from?</a
        >
      </div>
      <div class="watt-space-stack-m">
        <a
          (click)="scrollToTargetElement(how_can_i_influence_the_development)"
        >How can I influence the development?</a
        >
      </div>
      <div class="watt-space-stack-m">
        <a
          (click)="scrollToTargetElement(where_can_i_read_more)"
        >Where can I read more?</a
        >
      </div>
    </div>

    <h2 #what_is_energy_origin>What is Energy Origin?</h2>
    <p>
      The aim of the Energy Origin platform is to create transparency on the
      origin of energy for all energy consumers and to facilitate a market for
      for green energy. Currently, we are working on data related to electricity
      consumption. Upon login, you will soon be able to access your hourly
      electricity declaration and corresponding emissions for 2021
    </p>

    <h2 #who_can_access_the_platform>Who can access the platform?</h2>
    <p>
      Currently, the platform only offers company login via NemID. Later on, it
      will be possible for private individuals to login via NemID / MitID
    </p>

    <h2 #where_does_the_data_come_from>Where does te data come from?</h2>
    <p>
      All data related to metering points, consumption and production is served
      by the Energinet DataHub. Data related to the origin of energy and
      corresponding emissions stem from Energi Data Service
    </p>

    <h2 #how_can_i_influence_the_development>
      How can I influence the development?
    </h2>
    <p>
      You are more than welcome to participate in our LinkedIn user group, a
      digital forum for users, in which we post sketches, questions and gather
      ideas and suggestions for new development and improvements. It’s
      non-binding and you can either just follow along without getting involved
      or comment when you have time
    </p>

    <h2 #where_can_i_read_more>Where can I read more?</h2>
    <p>
      You can read more about the history and intention of Energy Origin on our
      website:
      <a href="https://energinet.dk" target="_blank"
        >Origins of energy | Energinet</a
      >
    </p>
  `,
})
export class EoFaqShellComponent {
  scrollToTargetElement(targetElement: HTMLHeadingElement): void {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

@NgModule({
  declarations: [EoFaqShellComponent],
})
export class EoFaqShellScam {}
