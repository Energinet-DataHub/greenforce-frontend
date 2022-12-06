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
  selector: 'eo-geography-page',
  styles: [
    `
      :host {
        display: grid;
        grid-auto-flow: column;
        gap: var(--watt-space-l);
        grid-template-columns: 600px 360px;
      }

      .column {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
      }

      .text-box {
        padding: var(--watt-space-m);
      }

      .case {
        display: flex;
        background-color: var(--watt-color-primary-light);

        p {
          padding: var(--watt-space-m);

          b {
            color: var(--watt-color-primary-dark);
          }
        }
      }

      .info-box {
        padding: var(--watt-space-m);

        &.green {
          background-color: var(--watt-color-primary-dark);
          color: white;

          span {
            color: white;
          }
        }

        &.beige {
          background-color: var(--watt-color-secondary-light);
        }

        img {
          display: block;
          padding-bottom: var(--watt-space-m);
        }
      }
    `,
  ],
  template: `
    <div class="column">
      <div class="text-box">
        <eo-stack size="M">
          <div>
            <h3>Strøm kan ikke flyttes på tværs af hele Europa</h3>
            <p>
              Det er ikke uden udfordringer, når energi flyttes gennem elnettet.
              Det gælder både, når der er tale om at flytte energi indenfor egne
              landegrænser, men særligt når det er på tværs af landegrænser. Ved
              dokumentation og sporing af energis oprindelse, for at sikre at
              energien er grøn, er det vigtigt, at der tages højde for disse
              udfordringer.
            </p>
          </div>
          <div>
            <h4>Grøn produktion kan være sort forbrug</h4>
            <p>
              En af problematikkerne findes bl.a. ved køb af GO certifikater.
              Det er f.eks. lige nu muligt for danske virksomheder at købe GO
              certifikater af grøn energi produceret i Island. På papiret ser
              det på den måde ud som om, at den energi man forbruger er grøn.
              Virkeligheden kan dog være en helt anden. Da der ikke findes nogen
              forbindelse mellem Island og Danmark, så energien produceret i
              Island kan umuligt være samme energi forbrugt i Danmark.
            </p>
          </div>
          <div
            style="display: flex; flex-direction: column; align-items: center;"
          >
            <img
              width="367"
              src="/assets/images/help/map_geography.jpg"
              alt="Energy Origin graph of energy"
            />
            <span style="font-size: 14px;">
              Billedet viser det europæiske transmissionsnet på tværs af
              landegrænser
            </span>
          </div>
        </eo-stack>
      </div>
      <div class="text-box">
        <h3>Hvordan løser vi udfordringerne?</h3>
        <p>
          En løsning er at sætte regler for, hvor lang afstanden må være fra
          produktions- til forbrugsstedet ved handel af grønne certifikater.
          Begrænsningerne sættes af de fysiske kabler, altså at man kun kan
          handle certifikater fra nabolande. På den måde sikrer man, at grøn
          energi kun kan bruges i produktionslandet og eventuelle nabolande.
        </p>
      </div>
      <div class="case">
        <img
          alt="Iværksætter case"
          src="/assets/images/help/case_geography.jpg"
        />
        <p>
          <b>CASE</b><br />
          Peter Producent kan sælge sine certifikater i Danmark, Tyskland, Norge
          og Sverige. Så længe der er plads på de respektive forbindelser.
        </p>
      </div>
      <h4>
        <a class="link" routerLink="../{{ routes.introduction }}">
          << Tilbage til Introduktion til EnergiOprindelse
        </a>
      </h4>
    </div>
    <div class="column">
      <div>
        <h1
          style="color: var(--watt-color-primary-light); padding-bottom: var(--watt-space-m);"
        >
          Geografi
        </h1>
        <p style="color: var(--watt-color-primary-dark)">
          Der er enkelte fysiske begrænsninger for, hvordan energi kan bevæge
          sig rundt, som bliver nødt til at være indarbejdet i systemet.
        </p>
      </div>

      <div class="info-box green">
        <span class="watt-headline-3">Interconnectors</span>
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
      </div>
      <div class="info-box beige">
        <span class="watt-headline-3">Budzoner</span>
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
      </div>
    </div>
  `,
})
export class EoGeographyPageComponent {
  routes = eoRoutes;
}
