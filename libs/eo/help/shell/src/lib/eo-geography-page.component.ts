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
  EoStackComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoStackComponent, RouterModule, EoInfoBoxComponent],
  selector: 'eo-geography-page',
  styles: [
    `
      :host {
        display: grid;
        gap: var(--watt-space-l);
        grid-template-columns: 10fr 6fr; // Magic UX Numbers
      }

      * + h1,
      * + h3,
      * + h4,
      * + .case,
      * + figure,
      * + .nav-link,
      * + eo-info-box {
        margin-block-start: var(--watt-space-l);
      }

      figure {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--watt-space-s);
      }

      .nav-link {
        display: block;
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
    `,
  ],
  template: `
    <div>
      <eo-info-box>
        <h3>Strøm kan ikke flyttes på tværs af hele Europa</h3>
        <p>
          Det er ikke uden udfordringer, når energi flyttes gennem elnettet. Det
          gælder både, når der er tale om at flytte energi indenfor egne
          landegrænser, men særligt når det er på tværs af landegrænser. Ved
          dokumentation og sporing af energis oprindelse, for at sikre at
          energien er grøn, er det vigtigt, at der tages højde for disse
          udfordringer.
        </p>
        <h4>Grøn produktion kan være sort forbrug</h4>
        <p>
          En af problematikkerne findes bl.a. ved køb af GO certifikater. Det er
          f.eks. lige nu muligt for danske virksomheder at købe GO certifikater
          af grøn energi produceret i Island. På papiret ser det på den måde ud
          som om, at den energi man forbruger er grøn. Virkeligheden kan dog
          være en helt anden. Da der ikke findes nogen forbindelse mellem Island
          og Danmark, så energien produceret i Island kan umuligt være samme
          energi forbrugt i Danmark.
        </p>
      </eo-info-box>
      <figure>
        <img
          width="367"
          src="/assets/images/help/map_geography.jpg"
          alt="Transmission net across countries"
        />
        <figcaption>
          Billedet viser det europæiske transmissionsnet på tværs af
          landegrænser
        </figcaption>
      </figure>
      <eo-info-box>
        <h3>Hvordan løser vi udfordringerne?</h3>
        <p>
          En løsning er at sætte regler for, hvor lang afstanden må være fra
          produktions- til forbrugsstedet ved handel af grønne certifikater.
          Begrænsningerne sættes af de fysiske kabler, altså at man kun kan
          handle certifikater fra nabolande. På den måde sikrer man, at grøn
          energi kun kan bruges i produktionslandet og eventuelle nabolande.
        </p></eo-info-box
      >
      <div class="case">
        <img
          alt="Producent case"
          src="/assets/images/help/case_geography.jpg"
        />
        <div class="text">
          <h4>Case</h4>
          <p>
            Peter Producent kan sælge sine certifikater i Danmark, Tyskland,
            Norge og Sverige. Så længe der er plads på de respektive
            forbindelser.
          </p>
        </div>
      </div>
      <a class="nav-link" routerLink="../{{ routes.introduction }}">
        << Tilbage til Introduktion til EnergiOprindelse
      </a>
    </div>
    <div>
      <div class="title-container">
        <eo-stack size="M">
          <h1>Geografi</h1>
          <p>
            Der er enkelte fysiske begrænsninger for, hvordan energi kan bevæge
            sig rundt, som bliver nødt til at være indarbejdet i systemet.
          </p>
        </eo-stack>
      </div>
      <eo-info-box variant="dark">
        <h3>Interconnectors</h3>
        <p>
          Sammenkoblinger er strømledninger forbundet til andre lande. De
          muliggør handel med el. Dette er vigtigt, for med et større geografisk
          område til rådighed, bliver udsvingene mindre og produktionen samlet
          set mere stabil. Med andre ord, da energiproduktionerne er korreleret
          med f.eks. vindsystemer, bliver det vigtigere at udvide nettet på
          tværs af flere vindsystemer. Disse Interconnectors har dog nogle
          fysiske begrænsninger i forhold til hvor meget strøm der kan løbe
          igennem dem.
        </p>
      </eo-info-box>
      <eo-info-box variant="light">
        <h3>Budzoner</h3>
        <p>
          Budzoner er geografisk definerede områder, inden for hvilke elhandlen
          foregår. I Danmark har vi to budzoner for hhv. Vestdanmark (DK1) og
          Østdanmark (DK2). Prisen, der gælder i en budzone, er i teorien
          resultatet af fri handel under antagelse af, at der ikke er interne
          flaskehalse i transmissionskapaciteten inden for budzonen. Dette er
          imidlertid sjældent tilfældet, og der er således eksempler på, at
          budzonegrænser ikke afspejler kapacitetsbegrænsningerne, men i stedet
          følger f.eks. landegrænser.
        </p>
      </eo-info-box>
    </div>
  `,
})
export class EoGeographyPageComponent {
  routes = eoRoutes;
}
