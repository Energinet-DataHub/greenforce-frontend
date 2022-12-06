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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoStackComponent, RouterModule],
  selector: 'eo-simultaneity-page',
  styles: [
    `
      :host {
        display: grid;
        grid-auto-flow: column;
        gap: var(--watt-space-l);
        grid-template-columns: 600px 360px; // Magic UX Numbers
      }

      .column {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
      }

      .text-box {
        padding: var(--watt-space-m);
      }

      .info-box {
        padding: var(--watt-space-m);
        background-color: var(--watt-color-primary-dark);
        color: white;

        span {
          color: white;
        }
      }
    `,
  ],
  template: `
    <div class="column">
      <div class="text-box">
        <h3>Houston, we have a problem!</h3>
        <eo-stack size="M">
          <p>
            I elsystemet, som det er i dag, mangler der en sammenhæng i tid,
            mellem produktion og forbrug. Selvom du køber “grønne certifikater”
            for f.eks. 100% af dit energiforbrug, så er det slet ikke en garanti
            for at den strøm som du trækker ud af kontakten er “grøn”.
          </p>
          <p>
            Et eksempel på to forbrugere, som umiddelbart ser ud til at have den
            samme grønne profil, når man ser på årsbasis, hvor billedet er et
            helt andet, når vi ser det på timebasis. Hvis vi siger de bruger 10
            enheder strøm hver.
          </p>
          <img
            alt="Hourly declaration"
            src="/assets/images/help/hour_declaration.png"
          />
        </eo-stack>
      </div>
      <div class="text-box">
        <h3>Flyt energiforbruget for en grønnere profil</h3>
        <eo-stack size="M">
          <p>
            Med det nuværende energisystem, hvor energiforbrug baseres på et
            årsgennemsnit, kan to energiforbrugere begge have en lignende grøn
            profil, uanset hvornår de placerer deres forbrug. Men virkeligheden
            kan være en helt anden. For hvis én forbruger oftest placerer
            energiforbruget på blæsende solskinsdage og en anden på vindstille
            gråvejrsdage, vil profilerne af det reelle forbrug være forskelligt.
          </p>
          <p>
            Med EnergiOprindelse bliver det lettere at flytte sit forbrug, da
            man kan se energiforbruget helt ned på time basis. Derved får man
            mulighed for at flytte sit forbrug til mere klimavenlige
            tidspunkter.
          </p>
          <img
            alt="Move consumption"
            src="/assets/images/help/move_consumption.png"
            style="display:block; margin-left: auto; margin-right: auto;"
          />
        </eo-stack>
      </div>
      <h4>
        <a class="link" routerLink="../{{ routes.introduction }}">
          << Tilbage til Introduktion til EnergiOprindelse
        </a>
      </h4>
    </div>
    <div class="column">
      <div>
        <eo-stack size="M">
          <p
            class="watt-headline-1"
            style="color: var(--watt-color-primary-light);"
          >
            Samtidighed
          </p>
          <p style="color: var(--watt-color-primary-dark);">
            Det er helt afgørende for den grønne omstilling af energisystemet,
            at vi kan dokumentere, at vi faktisk bruger strømmen, når den er
            grøn.
          </p>
        </eo-stack>
      </div>
      <div class="info-box">
        <span class="watt-headline-3">
          Vi danner grundlaget for at kunne træffe de grønne valg</span
        >
        <p>
          Et tættere match mellem produktion og forbrug kan blive fundamentet
          for et mere fleksibelt elmarked, hvor man som forbruger har incitament
          til at forbruge grøn el, når det er gunstigt og dermed være med til at
          gøre en forskel.
        </p>
      </div>
    </div>
  `,
})
export class EoSimultaneityPageComponent {
  routes = eoRoutes;
}
