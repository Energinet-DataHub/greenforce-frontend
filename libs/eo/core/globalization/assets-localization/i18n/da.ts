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
  landingPage: {
    announcementBar: {
      message: `Har du brug for en introduktion til Energy Origin? Kontakt os på <a href="mailto:datahub@energinet.dk">email</a>, og vi vender tilbage til dig.`,
    },
    header: {
      loginButton: 'Log ind',
    },
    hero: {
      heading: 'Spor energien tilbage til <br/>dets oprindelse.',
      subheading: 'Grønt bevis du kan stole på',
      loginButton: 'Log ind',
      learnMoreButton: 'Lær mere',
    },
    why: {
      quote: `“Vi ønsker, at industrien<br /> skal tro på ægte, bæredygtig energi og gøre<br /> op med greenwashing gennem<br /> banebrydende og ny teknologi.”`,
      quoteAuthor: `Martin Lervad Lundø<br />
      Vice President & CEO, Energinet DataHub`,
      quoteAuthorDescription: 'Martin Lervad Lundø - Vice President & CEO, Energinet DataHub',
    },
    how: {
      heading: 'Sådan gør vi det nemmere at rapportere bæredygtighed',
      subheading: `Overholdelse af<br/> <span class="highlight">EU’s regler</span><br /> for bæredygtighed`,
      content: `
      <p>
        Energioprindelse er en transformativ løsning, der hjælper virksomheder med håndtering af kompleksiteten i at overholde EU’s direktiver
        indenfor rapportering af CSRD (Corporate Sustainability Reporting Directive) og ESG (Environmental, Social, and Governance  directive).
      </p>
      <p>
        Ved at spore energien tilbage til kilden ved hjælp af avanceret block-chain teknologi,
        tilbyder Energioprindelse virksomheder et robust værktøj til at validere deres forpligtelser inden for grøn energi.
      </p>
    `,
    },
    what: {
      heading: 'Hvordan kan Energioprindelse hjælpe min virksomhed?',
      section1: {
        title: 'Bæredygtig profil',
        headline: 'Styrke investorers og forbrugeres tillid med nøjagtige rapporter',
        content:
          'Med Energioprindelse kan virksomheder trygt fremvise deres reelle bidrag til en grønnere planet. De kan styrke tilliden fra investorer og forbrugere, og på samme tid med lethed og integration navigere i det udviklende landskab af rapportering af bæredygtighed.',
      },
      section2: {
        title: 'Produktion af vedvarende energi',
        headline: 'Øg indtjeningen med højere krav til gennemsigtighed om bæredygtighed.',
        content: `Vores præcise, detaljerede certificeringsproces forenkler ikke kun overholdelsen af strenge EU-regler, men øger også troværdigheden af virksomheders bæredygtighedsrapporter.`,
      },
      section3: {
        title: 'Grøn energi handel',
        headline:
          'Hjælp markedet med at jonglere granulære certifikater og forbinde digitale beholdninger.',
        content:
          'Med så store krav til fremvisning og bevis for anvendte kilder i produktionen forventer vi, at markedspladser vil udvikle sig, hvilket hjælper virksomheder med at købe grøn energi på det rigtige tidspunkt for at matche deres forbrug.',
      },
    },
    electricalGrid: {
      heading: 'Hvordan virker det?',
      subheading: `Beviser at energien <span class="highlight">faktisk stammer fra</span> vedvarende kilder.`,
    },
    blockchainTech: {
      heading:
        'Block-chain teknologi binder granulære certifikater sammen med produktion af vedvarende energi.',
      content: `
      <p>
        Baseret på data fra DataHub udsteder Energioprindelse produktions certifikater fra udvalgte energiproducerende aktiver - hvert kvarter - hver time.
      </p>
      <p>
        Certifikaterne med de relevante meta-data gemmes på en digital konto, og de kan nu spores tilbage til kilden.
      </p>`,
    },
    granularCertificates: {
      heading:
        'Granulære certifikater overføres mellem forbundne konti og matcher forbrug med produktion.',
      content: `Der kan laves aftaler om at overføre certifikater mellem konti automatisk. Enten ved at bruge vores portal til Energioprindelse eller via en 3. part, der benytter sig af vores API’er.`,
    },
    proveSustainability: {
      heading: 'Tallene viser, at du driver en bæredygtig virksomhed',
      content: `Via rapporter og grafer kan virksomheder spore deres effektivitet og optimere deres forbrug, så det svarer til produktionstidspunktet for vedvarende energi.`,
    },
    cta: {
      heading: `Er du klar til at spore din virkshomheds energi?`,
      section1: {
        heading: 'Prøv det. Energioprindelse Beta-version',
        cta: 'Log ind',
      },
      section2: {
        heading: 'Samarbejde. Er du interesseret i vores API’er?',
        cta: 'Tjek det ud',
      },
    },
    footer: {
      section1: {
        heading: 'Adresse',
        content: `
          <p>Tonne Kjærsvej 65<br />7000 Fredericia<br />Denmark<br />CVR: 39315041</p>
        `,
      },
      section2: {
        heading: 'Kontakt',
        content: `
          <p>
            <a href="tel:+4570222810">+45 70 22 28 10</a><br />
            <a href="mailto:datahub@energinet.dk">datahub&#64;energinet.dk</a>
          </p>
        `,
      },
      section3: {
        heading: 'Politikker',
        content: `
          <ul>
            <li>
              <a href="/privacy-policy">Privatlivspolitik</a>
            </li>
            <li>
              <a href="/terms">Vilkår og betingelser</a>
            </li>
          </ul>
        `,
      },
      section4: {
        heading: 'Udviklere',
        content: `
          <p>Få adgang til vores</p>
          <a href="{{linkToDevPortal}}" target="_blank">{{icon}} udvikler portal</a>
        `,
      },
    },
  },
  sidebar: {
    dashboard: 'Overblik',
    meteringPoints: 'Målepunkter',
    claims: 'Grønt Forbrug',
    certificates: 'Certifikater',
    transfers: 'Overførselsaftaler',
    activityLog: 'Aktivitetslog',
  },
  footer: {
    poweredBy: 'Drevet af',
    locationHeader: 'Adresse',
    address: `Tonne Kjærsvej 65, <br />7000 Fredericia,<br /> Danmark`,
    cvr: 'CVR: 3931150441',
    contactHeader: 'Kontakt',
    contactPhone: '+45 70 22 28 10',
    contactEmail: 'datahub@energinet.dk',
    privacyPolicy: 'Privatlivspolitik',
    accessibilityStatement: 'Tilgængelighedserklæring',
  },
  userInformation: {
    tin: 'CVR / SE-nr: {{tin}} ',
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
    empty: {
      title: 'Ingen data fundet',
      message: 'Der er ingen data at vise.',
    },
    chart: {
      title: 'Oversigt',
      titleTooltip: 'Kun aktive målepunkter',
      activateMeteringPointsAction: 'Aktiver målepunkter',
      headlineNoData: 'Ingen data',
    },
    help: 'Hjælp',
    logout: 'Log ud',
    search: 'Søg',
    paginator: {
      itemsPerPageLabel: 'Resultater pr. side',
      of: 'af',
      first: 'Første side',
      last: 'Sidste side',
      next: 'Næste side',
      previous: 'Forrige side',
      ariaLabel: 'Vælg side',
    },
    fieldValidation: {
      required: 'Udfyld feltet',
    },
    clipboard: {
      success: 'Kopieret',
      error: 'Kopiering mislykkedes',
    },
  },
  languageSwitcher: {
    title: 'Sprog',
    closeLabel: 'Luk sprog konfiguration',
    languagesLabel: 'Fortrukne sprog',
    languagesPlaceholder: 'Vælg sprog',
    languages: {
      da: 'Dansk',
      en: 'Engelsk',
    },
    save: 'Gem',
    cancel: 'Fortryd',
  },
  dashboard: {
    title: 'Overblik',
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
    pendingRelationStatus: {
      title: 'Afventer svar fra DataHub',
      message:
        'Vi oplever problemer med at hente dine målepunkter.\n Vend venligst tilbage senere.',
    },
    noData: {
      title: 'Ingen målepunkter fundet',
      message: 'Du har ikke nogen målepunkter.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Venligst prøv at genindlæse siden.',
    },
    tableTitle: 'Tilgængelige målepunkter',
    gsrnTableHeader: 'Målepunkt',
    addressTableHeader: 'Adresse',
    cityTableHeader: 'By',
    statusTableHeader: 'Status',
    unitTableHeader: 'Enhed',
    sourceTableHeader: 'Kilde',
    consumptionUnit: 'Forbrug',
    productionUnit: 'Produktion',
    solarSource: 'Sol',
    windSource: 'Vind',
    otherSource: 'Andet',
    contractError: 'Der opstod et problem. Prøv venligst igen eller genindlæs siden.',
    selected: '{{amount}} målepunkt(er) valgt',
    activate: 'Aktiver',
    deactivate: 'Deaktiver',
    active: 'Aktiv',
    inactive: 'Inaktiv',
  },
  claims: {
    title: 'Grønt Forbrug',
    noData: {
      title: 'Ingen krav fundet',
      message: 'Du har ikke nogen krav.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    searchLabel: 'Søg',
    tableTitle: 'Resultater',
    claimIdTableHeader: 'Grønt Forbrug-ID',
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
    amountTableHeader: 'Mængde',
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
    eventTypeLabel: 'Aktivitetstype',
    transferAgreementEventType: 'Overførselsaftale',
    meteringPointEventType: 'Målepunkt',
    tableTitle: 'Resultater',
    timeTableHeader: 'Tidsstempel',
    systemActor: 'Systemet',
    eventTableHeader: 'Aktivitet',
    events: {
      own: {
        MeteringPoint: {
          Created: '{{actorName}} har oprettet et målepunkt med ID {{entityId}}',
          Accepted: '{{actorName}} har accepteret målepunktet med ID {{entityId}}',
          Declined: '{{actorName}} har afvist målepunktet med ID {{entityId}}',
          Activated: '{{actorName}} har aktiveret målepunktet med ID {{entityId}}',
          Deactivated: '{{actorName}} har deaktiveret målepunktet med ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} har deaktiveret eller ændret slutdatoen for målepunktet med ID {{entityId}}',
          Expired: '{{actorName}} har ladet målepunktet udløbe med ID {{entityId}}',
        },
        TransferAgreementProposal: {
          Created:
            '{{actorName}} har oprettet et forslag til en overførselsaftale med ID {{entityId}}',
          Accepted:
            '{{actorName}} har accepteret forslaget til en overførselsaftale med ID {{entityId}}',
          Declined:
            '{{actorName}} har afvist forslaget til en overførselsaftale med ID {{entityId}}',
          Activated:
            '{{actorName}} har aktiveret forslaget til en overførselsaftale med ID {{entityId}}',
          Deactivated:
            '{{actorName}} har deaktiveret forslaget til en overførselsaftale med ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} har ændret slutdatoen for forslaget til en overførselsaftale med ID {{entityId}}',
          Expired:
            '{{actorName}} har ladet forslaget til en overførselsaftale udløbe med ID {{entityId}}',
        },
        TransferAgreement: {
          Created: '{{actorName}} har oprettet en overførselsaftale med ID {{entityId}}',
          Accepted:
            '{{actorName}} har accepteret overførselsaftalen fra {{otherOrganizationName}} ({{otherOrganizationTin}}) med ID {{entityId}}',
          Declined: '{{actorName}} har afvist overførselsaftalen med ID {{entityId}}',
          Activated: '{{actorName}} har aktiveret overførselsaftalen med ID {{entityId}}',
          Deactivated: '{{actorName}} har deaktiveret overførselsaftalen med ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} har ændret slutdatoen for overførselsaftalen med ID {{entityId}}',
          Expired: '{{actorName}} har ladet overførselsaftalen udløbe med ID {{entityId}}',
        },
      },
      others: {
        MeteringPoint: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har oprettet et målepunkt med ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har accepteret målepunktet med ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har afvist målepunktet med ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har aktiveret målepunktet med ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har deaktiveret målepunktet med ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har deaktivertet eller ændret slutdatoen for målepunktet med ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har ladet målepunktet udløbe med ID {{entityId}}',
        },
        TransferAgreementProposal: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har oprettet et forslag til en overførselsaftale med ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har accepteret forslaget til en overførselsaftale med ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har afvist forslaget til en overførselsaftale med ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har aktiveret forslaget til en overførselsaftale med ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har deaktiveret forslaget til en overførselsaftale med ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har ændret slutdatoen for forslaget til en overførselsaftale med ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har ladet forslaget til en overførselsaftale udløbe med ID {{entityId}}',
        },
        TransferAgreement: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har oprettet en overførselsaftale med ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har accepteret overførselsaftalen med ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har afvist overførselsaftalen med ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har aktiveret overførselsaftalen med ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har deaktiveret overførselsaftalen med ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har ændret slutdatoen for overførselsaftalen med ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) har ladet overførselsaftalen udløbe med ID {{entityId}}',
        },
      },
    },
  },
  privacyPolicy: {
    title: 'Privatlivspolitik',
  },
  transfers: {
    title: 'Overførselsaftaler',
    creationOfTransferAgreementFailed:
      'Oprettelse af overførselsaftalen mislykkedes. Prøv at acceptere forslaget igen eller anmod organisationen, der sendte invitationen, om at generere et nyt link.',
    tableTitle: 'Resultater',
    createNewTransferAgreement: 'Ny overførselsaftale',
    transferAgreementStatusFilterLabel: 'Status',
    activeTransferAgreement: 'Aktiv',
    inactiveTransferAgreement: 'Inaktiv',
    noData: {
      title: 'Ingen overførselsaftaler fundet',
      message: 'Du har ikke nogen overførselsaftaler.',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    unknownReceiver: 'Ukendt virksomhed',
    unknownSender: 'Ukendt virksomhed',
    senderTableHeader: 'Afsender',
    receiverTableHeader: 'Modtager',
    startDateTableHeader: 'Startdato',
    endDateTableHeader: 'Slutdato',
    statusTableHeader: 'Status',
  },
  transferAgreement: {
    active: 'Aktiv',
    inactive: 'Inaktiv',
    editTransferAgreement: 'Rediger',
    periodOfAgreementLabel: 'Aftaleperiode',
    informationTab: 'Information',
    historyTab: 'Historik',
    receiverLabel: 'Modtager',
    unknownReceiver: 'Ukendt virksomhed',
    idLabel: 'ID',
  },
  transferAgreementEdit: {
    title: 'Rediger overførselsaftale',
    closeLabel: 'Afbryd redigering af overførselsaftale',
    cancel: 'Annuller',
    saveChanges: 'Gem',
    error: {
      title: 'Ups!',
      message:
        'Noget gik galt. Prøv igen eller kontakt din systemadministrator, hvis du fortsat modtager denne fejl.',
    },
  },
  createTransferAgreementProposal: {
    title: 'Ny overførselsaftale',
    closeLabel: 'Afbryd oprettelse af ny overførselsaftale',

    recipient: {
      stepLabel: 'Modtager',
      title: 'Hvem er aftalen til?',
      description: 'Valgfrit, men anbefales af sikkerhedsmæssige årsager.',
      nextLabel: 'Næste',
      unknownRecipient: 'Ukendt virksomhed',
      receiverTinLabel: 'Modtager',
      receiverTinPlaceholder: 'CVR / TIN',
      receiverTinGeneralError: 'Indtast nyt CVR-nummer eller vælg fra tidligere overførselsaftaler',
      receiverTinEqualsSenderTin: 'Modtageren kan ikke være dit eget TIN/CVR',
      receiverTinFormatError: 'Et 8-cifret TIN/CVR-nummer er påkrævet',
    },
    timeframe: {
      stepLabel: 'Tidsramme',
      title: 'Hvad er varigheden af aftalen?',
      description: 'Ved at vælge ingen slutdato kan du altid stoppe aftalen manuelt.',
      nextLabel: 'Næste',
      previousLabel: 'Forrige',
      startDate: {
        label: 'START',
        required: 'Starten af perioden er påkrævet',
        nextHourOrLater: 'Starten af perioden skal være mindst en time fra nu',
        overlapping: 'Valgt periode overlapper med en eksisterende aftale',
      },
      endDate: {
        label: 'STOP',
        noEndDateLabel: 'Ingen specifik slutdato',
        withEndDateLabel: 'Slut på dato',
        minToday: 'Slutningen af perioden skal være i dag eller senere',
        laterThanStartDate: 'Slutningen af perioden skal være senere end starten af perioden',
        withEndDateOverlapping:
          'Fordi du ikke har valgt en slutdato, overlapper perioden med en eksisterende aftale: {{startDate}} - {{endDate}}',
        withoutEndDateOverlapping:
          'Den valgte periode overlapper med en eksisterende aftale: {{startDate}} - {{endDate}}',
      },
    },
    invitation: {
      stepLabel: 'Invitation',
      title: {
        success: 'Nyt link til overførselsaftale oprettet!',
        error: 'Forslag til overførselsaftale kunne ikke genereres',
      },
      description: {
        success: `
        <p>Hvad sker der nu?</p>
        <ol style="padding-inline-start: revert;">
          <li>Send følgende link til din modtager</li>
          <li>Aftalen bliver endelig, når modtageren accepterer betingelserne</li>
        </ol>`,
        error: `
        <p>Tryk på "Generer" i formularen nedenfor for at prøve igen.</p>
        <p>Hvis problemet fortsætter, kontakt venligst support.</p>
        `,
      },
      link: {
        hint: 'Link udløber om 14 dage, og kan kun bruges en enkelt gang.',
        error: 'Kunne ikke generere link. Prøv igen.',
        copy: 'Kopiér link',
        retry: 'Generer',
      },
      nextLabel: 'Kopier & luk',
      previousLabel: 'Forrige',
    },
  },
  respondTransferAgreementProposal: {
    title: ' ',
    loadingMessage: 'Vent venligst mens vi indlæser forslaget til overførselsaftale',
    closeLabel: 'Luk forslaget til overførselsaftale',
    noEndDate: 'Ingen specifik slutdato',
    success: {
      title: 'Forslag til overførselsaftale',
      message: '{{senderName}} ønsker at indgå en overførselsaftale med dig.',
      acceptButton: 'Acceptér',
      declineButton: 'Afvis',
    },
    error: {
      title: 'Ugyldigt forslag til overførselsaftale',
      message: `Forslaget til overførselsaftale, du netop klikkede på, er ikke gyldigt <br /> Hvis dette ikke var, hvad du forventede, kontakt venligst afsenderen af linket.`,
      declineButton: 'Ok',
    },
  },
  help: {
    title: 'Hjælp',
    content: `
    <ul>
      <li><a class="internal-link" href="{{faqLink}}">Ofte Stillede Spørgsmål</a></li>
      <li>
        <a class="internal-link" href="{{introductionLink}}">Introduktion til Energy Origin</a>
      </li>
      <li>
        <a
          href="https://ens.dk/ansvarsomraader/energi-klimapolitik/eus-klima-energipolitik"
          target="_blank"
          rel="noopener noreferrer"
          >Energistyrelsen - Energi- og klimapolitik</a
        > Den danske regerings politikker omkring klima og energi. Hvor du kan læse om den danske energiplan for de næste 10 år.
      </li>
      <li>
        <a
          href="https://virksomhedsguiden.dk/content/temaer/groen_omstilling/"
          target="_blank"
          rel="noopener noreferrer"
          >Virksomhedsguiden.dk - Grøn omstilling</a
        > Beskriver hvordan virksomheder kan blive mere grønne, med en masse instruktioner og skabeloner.
      </li>
      <li>
        <a href="https://en.energinet.dk/Green-Transition" target="_blank" rel="noopener noreferrer"
          >Energinet - Green Transition (Engelsk)</a
        > Energinet leverer data vedrørende overgangen til et grønnere energisystem i Danmark.
      </li>
      <li>
        <a href="https://www.iea.org/countries/denmark" target="_blank" rel="noopener noreferrer"
          >IEA - Denmark (Engelsk)</a
        > Det Internationale Energiagentur er forpligtet til at forme en sikker og bæredygtig energifremtid
        for alle og leverer data og sammenligninger om, hvad de forskellige lande foretager sig.
      </li>
    </ul>
    `,
  },
  faq: {
    title: 'Ofte Stillede Spørgsmål',
    content: `
    <div class="watt-space-stack-m faq-link">
    <a href="#what-is-energy-origin">Hvad er Energy Origin?</a>
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#who-can-access-the-platform"
      >Hvem kan få adgang til platformen?</a
    >
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#where-does-the-data-come-from"
      >Hvor kommer dataene fra?</a
    >
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#how-can-i-influence-the-development">
      Hvordan kan jeg påvirke udviklingen?
    </a>
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#where-can-i-read-more">Hvor kan jeg læse mere?</a>
  </div>

  <h3 id="what-is-energy-origin">Hvad er Energy Origin?</h3>
  <p>
    Målet med Energy Origin-platformen er at skabe gennemsigtighed om oprindelsen af energi for alle energiforbrugere og at skabe et marked for grøn energi.
    I øjeblikket arbejder vi på data relateret til elforbrug.
    Efter login vil du snart kunne tilgå dit elforbrug pr. time og tilsvarende emissioner for 2021.
  </p>

  <h3 id="who-can-access-the-platform">Hvem kan få adgang til platformen?</h3>
  <p>
    I øjeblikket tilbyder platformen kun virksomhedslogin via MitID. Senere vil det være muligt for
    private personer at logge ind via MitID.
  </p>

  <h3 id="where-does-the-data-come-from">Hvor kommer data fra?</h3>
  <p>
    Alle data relateret til målepunkter, forbrug og produktion leveres af Energinet DataHub.
    Data relateret til energiens oprindelse og tilsva-rende emissioner stammer fra Energi Data Service.
  </p>

  <h3 id="how-can-i-influence-the-development">Hvordan kan jeg påvirke udviklingen?</h3>
  <p>
    Du er mere end velkommen til at deltage i vores LinkedIn-brugergruppe, et digitalt forum for
    brugere, hvor vi poster skitser, spørgsmål og samler ideer og forslag til ny
    udvikling og forbedringer. Det er uforpligtende, og du kan enten bare følge med uden
    at involvere dig eller kommentere, når du har tid.
  </p>

  <h3 id="where-can-i-read-more">Hvor kan jeg læse mere?</h3>
  <p>
    Du kan læse mere om historien og intentionen bag Energy Origin på vores hjemmeside:
    <a
      href="https://en.energinet.dk/Energy-data/DataHub/Energy-Origin"
      target="_blank"
      rel="noopener noreferrer"
    >
      Energiens oprindelse | Energinet
    </a>
  </p>
    `,
  },
};
