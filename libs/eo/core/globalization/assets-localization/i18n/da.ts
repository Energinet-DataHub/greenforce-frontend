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
/* eslint-disable sonarjs/no-duplicate-string */
import { TranslationKeys } from './translation-keys';

export const DA_TRANSLATIONS: TranslationKeys = {
  sidebar: {
    dashboard: 'Dashboard',
    meteringPoints: 'Målepunkter',
    claims: 'Krav',
    certificates: 'Certifikater',
    transfers: 'Overførsler',
    activityLog: 'Aktivitetslog',
  },
  footer: {
    poweredBy: 'Drevet af',
    locationHeader: 'Adresse',
    address: `Tonne Kjærsvej 65, <br />7000 Fredericia,<br /> Danmark`,
    cvr: 'CVR: 3931150441',
    contactHeader: 'Kontakt',
    contactPhone: '+45 70 22 28 10',
    contactEmail: 'datahub&#64;energinet.dk',
    privacyPolicy: 'Privatlivspolitik',
    accessibilityStatement: 'Tilgængelighedserklæring',
  },
  userInformation: {
    tin: 'CVR / SE-nr: {{tin}}',
  },
  topbar: {
    help: '{{shared.help}}',
    logout: '{{shared.logout}}',
  },
  shared: {
    error: {
      title: 'En uventet fejl opstod',
      message:
        'Prøv igen ved at genindlæse siden eller kontakte din systemadministrator, hvis du fortsat får denne fejl.',
      retry: 'Genindlæs',
    },
    chart: {
      title: 'Oversigt',
      titleTooltip: 'Kun aktive målepunkter',
      activateMeteringPointsAction: 'Aktiver målepunkter',
      headlineNoData: 'Ingen data',
    },
    help: 'Hjælp',
    logout: 'Log ud',
  },
  dashboard: {
    title: 'Dashboard',
    tabs: {
      producer: 'Produktion',
      consumer: 'Forbrug',
    },
    noData: {
      title: 'Ingen data at vise',
      message:
        'Vi har ingen data at vise, fordi du ikke har nogen produktions- eller forbrugsmålepunkter.',
    },
    error: {
      title: '{{shared.error.title}}',
      message: '{{shared.error.message}}',
    },
  },
  producerChart: {
    title: '{{shared.chart.title}}',
    titleTooltip: '{{shared.chart.titleTooltip}}',
    error: {
      title: '{{shared.error.title}}',
      message: '{{shared.error.message}}',
      retry: '{{shared.error.retry}}',
    },
    headline: {
      default: '{{transferredInPercentage}} overført',
      noData: '{{shared.chart.headlineNoData}}',
    },
    subHeadline:
      '{{totalTransferred}} af {{totalProduced}} certificeret grøn produktion blev overført',
    activateMeteringPointsAction: '{{shared.chart.activateMeteringPointsAction}}',
    legends: {
      unused: 'Ubrugt ({{percentage}})',
      transferred: 'Overført ({{percentage}})',
      consumed: 'Forbrugt ({{percentage}})',
    },
    tooltips: {
      transferred: '{{amount}} {{unit}} overført',
      consumed: '{{amount}} {{unit}} forbrugt',
      unused: '{{amount}} {{unit}} ubrugt',
    },
  },
  consumerChart: {
    title: '{{shared.chart.title}}',
    titleTooltip: '{{shared.chart.titleTooltip}}',
    error: {
      title: '{{shared.error.title}}',
      message: '{{shared.error.message}}',
      retry: '{{shared.error.retry}}',
    },
    headline: {
      default: '{{greenEnergyInPercentage}} grøn energi',
      noData: '{{shared.chart.headlineNoData}}',
    },
    subHeadline: '{{greenConsumption}} af {{totalComsumption}} er certificeret grøn energi',
    activateMeteringPointsAction: '{{shared.chart.activateMeteringPointsAction}}',
    legends: {
      other: 'Andet ({{percentage}})',
      green: 'Grøn ({{percentage}})',
    },
    tooltips: {
      other: '{{amount}} {{unit}} andet',
      green: '{{amount}} {{unit}} grøn',
    },
  },
  periodSelector: {
    periods: {
      day: 'Dag',
      week: 'Uge',
      month: 'Måned',
      year: 'År',
    },
    last30Days: 'Sidste 30 dage',
  },

  meteringPoints: {
    title: 'Målepunkter',
    infoBoxTitle: 'Du har muligheden for at slå dine målepunkter TIL og FRA.',
    infoBoxContent: `
      <p>For produktionsmålepunkter:</p>

      <ul>
        <li>At slå den 'TIL' betyder, at målepunktet aktivt udsteder certifikater for strøm.</li>
        <li>At skifte den 'FRA' vil stoppe målepunktet fra at udstede certifikater.</li>
      </ul>

      <br />
      <p>For forbrugsmålepunkter:</p>

      <ul>
        <li>
          'TIL' indikerer, at forbrugsmålepunktet aktivt udsteder forbrugscertifikater.
        </li>
        <li>
          'FRA' indikerer, at forbrugsmålepunktet vil skaffe sin elektricitet fra
          et andet sted.
        </li>
      </ul>
      `,
    noData: {
      title: 'Ingen målepunkter fundet',
      message: 'Du har ikke nogen målepunkter.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Venligst prøv at genindlæse siden.',
    },
    tableTitle: 'Resultater',
    gsrnTableHeader: 'Målepunkt',
    addressTableHeader: 'Adresse',
    unitTableHeader: 'Enhed',
    sourceTableHeader: 'Kilde',
    onOffTableHeader: 'Til/Fra',
    onOffTooltipTitle: 'Ikke alle målepunkter kan aktiveres',
    onOffTooltipMessage:
      'Et målepunkt skal have en vind- eller solkilde for at blive berettiget til aktivering.',
    onOffTooltipClose: 'Luk',
    consumptionUnit: 'Forbrug',
    productionUnit: 'Produktion',
    solarSource: 'Sol',
    windSource: 'Vind',
    otherSource: 'Andet',
    contractError: 'Der opstod et problem. Prøv venligst igen eller genindlæs siden.',
  },
  claims: {
    title: 'Krav',
    noData: {
      title: 'Ingen krav fundet',
      message: 'Du har ikke nogen krav.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    searchLabel: 'Search',
    tableTitle: 'Results',
    claimIdTableHeader: 'Krav-ID',
    amountTableHeader: 'Mængde',
    startDateTableHeader: 'Start',
    endDateTableHeader: 'Slut',
  },
  certificates: {
    title: 'Certifikater',
    noData: {
      title: 'Ingen certifikater fundet',
      message: 'Du har ikke nogen certifikater.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    searchLabel: 'Søg',
    tableHeader: 'Resultater',
    timeTableHeader: 'Tid',
    gsrnTableHeader: 'Målepunkt',
    amountTableHeader: 'Beløb',
    typeTableHeader: 'Type',
    productionType: 'produktion',
    consumptionType: 'forbrug',
    certificateDetailsLink: 'Se certifikat',
  },
  certificateDetails: {
    title: 'Certifikatdetaljer - {{certificateType}}',
    staticDataHeadline: 'Statisk data',
    energyLabel: 'Energi',
    startTimeLabel: 'Starttid',
    endTimeLabel: 'Sluttid',
    gsrnLabel: 'GSRN',
    certificateIdLabel: 'Certifikat-ID',
    technologyHeadline: 'Teknologi',
    technologyCodeLabel: 'Teknologikode',
    fuelCodeLabel: 'Brændstofkode',
    backToCertificatesLink: '<< Tilbage til certifikater',
    biddingZoneHeadline: 'Budzone',
  },
  activityLog: {
    title: 'Aktivitetslog',
    noData: {
      title: 'Ingen aktivitet fundet',
      message: 'Du har ingen aktivitet.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    eventTypeLabel: 'Begivenhedstype',
    transferAgreementEventType: 'Overførselsaftale',
    meteringPointEventType: 'Målepunkt',
    tableTitle: 'Resultater',
    timeTableHeader: 'Tidsstempel',
    eventTableHeader: 'Begivenhed',
  },
  privacyPolicy: {
    title: 'Privatlivspolitik',
  },
};
