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
import {
  EoInfoBoxComponent,
  EoMediaModule,
  EoStackComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoStackComponent, EoMediaModule, RouterModule, EoInfoBoxComponent],
  selector: 'eo-introduction-page',
  styles: [
    `
      :host {
        display: grid;
        gap: var(--watt-space-l);
        grid-template-columns: 578px 354px; // Magic UX Numbers
      }

      * + h1,
      * + h3,
      * + h4,
      * + .case,
      * + .goal-7,
      * + eo-info-box {
        margin-block-start: var(--watt-space-l);
      }

      .case {
        display: flex;
        background-color: var(--watt-color-primary-light);

        .text {
          padding: var(--watt-space-m);

          h4 {
            font-weight: bold;
            text-transform: uppercase;
          }
        }
      }

      .title-container {
        h1 {
          color: var(--watt-color-primary-light);
          line-height: normal;
          font-size: 48px; // Magic UX Number
        }

        p {
          display: block;
          color: var(--watt-color-primary-dark);
        }
      }

      .goal-7 {
        border: solid 1px #fab800;

        p {
          padding: var(--watt-space-m);
        }
      }
    `,
  ],
  template: `
    <div>
      <eo-info-box>
        <img
          width="383"
          src="/assets/images/landing-page/landing-page-graph-of-energy-with-dashboard.png"
          alt="Energy Origin graph of energy"
        />
        <h3>Hvad kan du bruge energioprindelse.dk til?</h3>
        <eo-stack size="M">
          <p>
            energioprindelse.dk er hovedsageligt beregnet til, at du kan
            <b>dokumentere</b>, hvor grøn du er. Du kan se alle
            <b>dine data</b> og bruge dem i andre systemer.
          </p>
          <p>
            Det betyder overordnet at du kan se din andel
            <b>vedvarende energi, emissioner, forbrugs- og produktionsdata</b>.
            Derudover kan du også se dine <b>certifikater</b>, både dem du selv
            har produceret, og dem du har købt.
          </p>
          <p>Alle disse informationer kan du f.eks. bruge i din CSR-rapport.</p>
        </eo-stack>
      </eo-info-box>
      <eo-info-box>
        <h3>Grøn energi med EnergiOprindelse</h3>
        <eo-stack size="M">
          <p>
            Energiforbrugere oplever et stigende behov for kendskab til deres
            energis oprindelse, både for at kunne holde øje med deres
            <b>forbrug</b>, og for at kunne dokumentere hvor grønne de er, dvs.
            andelen af <b>vedvarende</b> energi og mængden af <b>emissioner</b>.
          </p>
          <p>
            Indtil nu har det <b>ikke været muligt at vide</b>, om ens energi
            faktisk ér grøn, når det forbruges. Det skyldes, at man i dag kun
            har mulighed for at købe oprindelsesgarantier, der baseres på
            <b>årsbasis</b>. Dvs. at man får en garanti for, at der findes nok
            vedvarende energi i nettet for året, til at matche ens forbrug - men
            det betyder desværre ikke, at energien faktisk var grøn på
            forbrugstidspunktet.
          </p>
          <p>
            Den usikkerhed gør EnergiOprindelse op med, for med platformen kan
            energi, samt dens tilsvarende CO2-udledning, spores fra produktion
            til forbrug helt ned på <b>timeniveau</b>.
          </p>
        </eo-stack>
      </eo-info-box>
      <eo-info-box>
        <h3>Hvordan kan du blive grønnere?</h3>
        <eo-stack size="M">
          <p>
            Helt overordnet kan du blive mere grøn ved at:
            <br />- <b>Flytte</b> dit forbrug <br />- <b>Producere</b> din egen
            energi <br />- Bruge <b>mindre</b> energi <br />- Købe grønne
            <b>certifikater</b>
          </p>
          <p>
            Flere af disse muligheder kræver, at strømmen er produceret samtidig
            med, at den bliver forbrugt. Denne
            <a routerLink="../{{ routes.simultaneity }}">samtidighed</a> kan du
            læse mere om, da det er en af de væsentlige ting i det nye
            certifikat.
          </p>
        </eo-stack>
      </eo-info-box>
      <div class="case">
        <img alt="Iværksætter case" src="/assets/images/help/ivan_case.jpg" />
        <div class="text">
          <h4>Case</h4>
          <p>
            Ivan Iværksætter prøver at lave energistyring ved at flytte sit
            forbrug til tidspunkter, hvor strømmen er mere grøn. Han har også
            investeret i solceller for at producere grøn strøm til sit eget
            forbrug. Begge dele kan han tjekke resultatet af på
            energioprindelse.dk.
          </p>
        </div>
      </div>

      <eo-info-box>
        <h3>GO- vs. GC-certifikater</h3>
        <eo-stack size="M">
          <p>
            GO står for Guarantees of Origin, og er en oprindelsesgaranti, som
            dokumenterer og garanterer, at der er produceret strøm fra
            vedvarende energikilder. Garantien udstedes på årsbasis i Danmark af
            Energinet.
          </p>
          <p>
            Med denne nye platform introduceres GC-certifikaterne, der er
            baseret på GO, og de to vil fungere parallelt. De nye
            GC-certifikater giver mere værdi, da de håndterer
            <a routerLink="../{{ routes.simultaneity }}">samtidighed</a> og
            <a routerLink="../{{ routes.geography }}"
              >geografiske begrænsninger</a
            >.
          </p>
        </eo-stack>
      </eo-info-box>
    </div>
    <div>
      <div class="title-container">
        <eo-stack size="M">
          <h1>Grøn energi</h1>
          <p>
            Med denne platform har du mulighed for at spore din energis
            oprindelse og se din andel af vedvarende energi og dine emissioner
            baseret på dit forbrug i den enkelte time.
          </p></eo-stack
        >
      </div>
      <div class="goal-7">
        <img alt="UN climate goal 7" src="/assets/images/help/goal_7.png" />
        <p>
          Bæredygtig energi er et af FN's 17 verdensmål, som indgår i
          udviklingsdagsordenen for bæredygtig udvikling frem mod 2030. Målet
          med verdensmål 7 er at sikre overkommelig, pålidelig, bæredygtig og
          moderne energi for alle. Verdensmål 7 har helt specifikt fokus på
          vedvarende energi og emissioner, som kan ses her på platformen. [<a
            href="https://www.verdensmaalene.dk/maal/7"
            target="_blank"
            rel="noopener noreferrer"
            >verdensmaalene.dk/maal/7</a
          >]
        </p>
      </div>
      <eo-info-box variant="dark">
        <img
          alt="Law Paragraph icon"
          src="/assets/images/help/law_paragraph.png"
        />
        <h3>Aftale om et grønt og sikkert Danmark</h3>
        <p>
          Et bredt flertal i Folketinget er blevet enige om, at Danmark i 2030
          skal have firedoblet produktion af sol- og vindenergi på land samt
          mulighed for femdobling af havvindemøllestrøm. Der er derfor for alvor
          sat turbo på den grønne omstilling.
        </p>
      </eo-info-box>
      <eo-info-box variant="dark">
        <img alt="Power to X icon" src="/assets/images/help/power_to_x.png" />
        <h3>Power-to-X: Sikkerhed for grøn oprindelse</h3>
        <eo-stack size="M">
          <p>
            EU Kommissionen skal beskrive metode, der kan dokumentere, at strøm
            taget fra elnettet produceres samtidigt med produktion af grøn brint
            til transport. (EU-direktiv ark. 27)
          </p>
          <p>Dette vil netop kunne gøres med EnergiOprindelse.</p>
        </eo-stack>
      </eo-info-box>
      <eo-info-box variant="light">
        <h3>CSR-rapport</h3>
        <p>
          Corporate Social Responsibility, eller CSR som forkortelse, er
          virksomheders sociale ansvar. Dette bliver ofte nedskrevet som en del
          af virksomheders forretningsstrategi. I Danmark er det desuden lov, at
          visse virksomheder skal aflevere en rapportering om samfundsansvar
          inden for en række punkter. Et af punkterne er om brug af energi.
        </p>
      </eo-info-box>
      <eo-info-box variant="light">
        <h3>Timedeklarationen</h3>
        <eo-stack size="M">
          <p>
            Ny deklaration der baseres på faktiske time-for-time overblik af
            leveret strøm.
          </p>
          <p>
            Læs mere om timedeklaration her:
            <a
              href="https://energinet.dk/El/Gron-el/Deklarationer"
              target="_blank"
              rel="noopener noreferrer"
              >Deklarationer</a
            >
          </p>
        </eo-stack>
      </eo-info-box>
    </div>
  `,
})
export class EoIntroductionPageComponent {
  routes = eoRoutes;
}
