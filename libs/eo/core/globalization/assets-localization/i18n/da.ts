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
    meta: {
      title: 'Energy Track & Trace™',
      description:
        'Energy Track & Trace™ er din pålidelige kilde til sporing, og certificering, af grøn strøm. Vi beviser hvor din strøm kommer fra.',
      keywords:
        'grøn strøm, sporing, certificering, granulære certifikater, Energy Track & Trace, bæredygtig energi, vedvarende energi',
      author: 'Energy Track & Trace™',
      url: 'https://energytrackandtrace.dk',
    },
    announcementBar: {
      message: `Har du brug for en introduktion til Energy Track & Trace™?  Kontakt os på <a href="mailto:datahub@energinet.dk">email</a>, og vi vender tilbage til dig.`,
    },
    header: {
      loginButton: 'Log ind',
    },
    hero: {
      heading: 'Sporing og certificering <br /> af grøn strøm',
      subheading: 'Vi beviser, hvor din strøm kommer fra',
      loginButton: 'Log ind',
      learnMoreButton: 'Se mere',
    },
    why: {
      quote: `“Vi ønsker at opbygge<br /> tillid til den bæredygtige energi<br /> og adressere greenwashing med vores<br /> banebrydende, nye teknologi.”`,
      quoteAuthor: `Martin Lervad Lundø<br />
      Vice President & CEO, Energinet DataHub`,
      quoteAuthorDescription: 'Martin Lervad Lundø - Vice President & CEO, Energinet DataHub',
    },
    how: {
      heading: 'Sådan gør vi det nemmere at rapportere bæredygtighed',
      subheading: `Overholdelse af<br/> <span class="highlight">EU’s regler</span><br /> for bæredygtighed`,
      content: `
      <p>
        Energy Track & Trace™ er en innovativ løsning, der understøtter din virksomhed i at håndtere udfordringerne ved at følge EU’s direktiv
        for CSRD rapportering (Corporate Sustainability Reporting Directive) inden for ESG området (Environmental, Social, and Governance  directive).
      </p>
      <p>
        Ved at spore energiens oprindelse via avanceret teknologi, giver Energy Track & Trace™ din virksomhed
        et solidt værktøj til at verificere og dokumentere jeres reelle forbrug af grøn energi.
      </p>
    `,
    },
    what: {
      heading: 'Hvordan kan Energy Track & Trace™ hjælpe min virksomhed?',
      section1: {
        title: 'Bæredygtig virksomhedsprofil',
        headline: 'Styrk investorers og forbrugeres tillid med nøjagtige rapporter',
        content:
          'Med Energy Track & Trace™ kan din virksomhed med god samvittighed fremvise jeres reelle bidrag til den grønne omstilling. I kan styrke tilliden fra investorer og forbrugere, og på samme tid lettere håndtere en korrekt rapportering af jeres grønne strømforbrug.',
      },
      section2: {
        title: 'Produktion af VE',
        headline: 'Øg indtjeningen med højere krav til gennemsigtighed om bæredygtighed',
        content:
          'Vores præcise certificering af grøn strøm med Granulære Certifikater forenkler ikke kun overholdelsen af strenge EU-regler, men øger troværdigheden til de virksomheder, der bruger dem. Som Producent af strøm giver det dig mulighed for at tilbyde dine kunder et bedre produkt.',
      },
      section3: {
        title: 'Handel med Grøn Energi',
        headline:
          'Hjælp aktørerne med køb og salg af Granulære Certifikater på en digital markedsplads',
        content:
          'Der stilles stigende krav til dokumentation for anvendte kilder i produktion af grøn strøm. Derfor forventer vi i Energy Track & Trace™, at markedspladser vil udvikle sig, og nye vil opstå. Det vil understøtte virksomhedernes mulighed for at købe grøn strøm 24 timer i døgnet.',
      },
    },
    electricalGrid: {
      heading: 'Hvordan virker det?',
      subheading: `Beviser, at energien har en <span class="highlight">reel</span> bæredygtig oprindelse`,
    },
    blockchainTech: {
      heading:
        'Blockchain teknologi binder Granulære Certifikater sammen med produktion af vedvarende energi',
      content: `
      <p>
        Baseret på data fra DataHub i Energinet, udstedes der produktionscertifikater fra godkendte energikilder hvert 15. minut.
      </p>
      <p>
        Certifikaterne indeholder relevante metadata og gemmes digitalt i et Register, en Wallet og på en Blockchain. Det gør det muligt at spore dem tilbage til deres oprindelse, opdage snyd og undgå dobbelt udstedelse uden at gå på kompromis med GDPR.
      </p>`,
    },
    granularCertificates: {
      heading:
        'Granulære Certifikater handles mellem forskellige Wallets, hvor Forbrug og Produktion matches',
      content: `De Granulære Certifikater kan flyttes mellem to parter. Enten via vores dashboard eller via 3. parts løsninger, der benytter vores API’er.`,
    },
    proveSustainability: {
      heading: 'Energy Track & Trace™ sætter tal på dit grønne strømforbrug',
      content: `
      <p>
      <a href="https://energytrackandtrace.com/wp-content/uploads/2023/11/2022-05-Paper-Architectural-concepts-and-insights.pdf" target="_blank">Vores beregninger</a> viser med 95% sikkerhed om din strøm kommer fra grønne energikilder.
      </p>
      <p>
      Via vores løsning kan du som virksomhed se, hvornår du er tilstrækkelig dækket med grøn strøm, og hvornår du ikke er. Det giver dig et overblik, du kan handle ud fra og en sikkerhed for, at du handler rigtigt.
      </p>`,
    },
    naming: {
      heading: 'Energy Track and Trace™ – fælles europæisk navn for granulære certifikater',
      content: `<p>Energioprindelse skiftede i foråret 2024 navn til Energy Track and Trace™.
        Energy Track and Trace™ er navnet på samarbejdet på tværs af EU, som Energinet er aktivt deltager i.
      </p>

      <p>
        Det sikrer entydighed og genkendelse på tværs af EU.
        Tidligere har samarbejdet om granulære certifikater (GC'er) i Danmark heddet Energioprindelse, El Oprindelse og Energy Origin.
        Teknologien bag hedder Project Origin.
      </p>`,
    },
    cta: {
      heading: `Er du klar til at spore din virkshomheds energi?`,
      section1: {
        heading: 'Prøv det. Energy Track & Trace™ Beta-version',
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
              <a href="/da/privacy-policy">Privatlivspolitik</a>
            </li>
            <li>
              <a href="/da/terms">Vilkår og betingelser</a>
            </li>
            <li>
              <a target="_blank" href="https://www.was.digst.dk/energytrackandtrace-dk">Tilgængelighedserklæring</a>
            </li>
          </ul>
        `,
      },
      section4: {
        heading: 'Udviklere',
        content: `
          <p>Få adgang til vores</p>
          <a href="{{linkToDevPortal}}" target="_blank">{{icon}} Udvikler portal</a>
        `,
      },
    },
  },
  documentation: {
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page.',
    },
    endpoints: 'Endpoints',
    topbarTitle: 'Documentation',
  },
  sidebar: {
    dashboard: 'Overblik',
    meteringPoints: 'Målepunkter',
    claims: 'Grønt Forbrug',
    certificates: 'Certifikater',
    transfers: 'Overførselsaftaler',
    activityLog: 'Aktivitetslog',
    consent: 'Fuldmagter',
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
    infoBoxTitle: 'Hjælp til Målepunkter',
    infoBoxContent: `
      <h3>Produktion:</h3>
      <ul>
        <li>Et målepunkt (elmåler), der producerer grøn strøm fra sol eller vindkraft.</li>
      </ul>

      <h3>Forbrug:</h3>
      <ul>
        <li>Et målepunkt (elmåler), der skal anvende strøm fra sol eller vindkraft.</li>
      </ul>

      <h3>Aktiver/Deaktiver:</h3>
      <ul>
        <li>Når du AKTIVERER et målepunkt, udstedes der Granulære Certifikater.</li>
        <li>Når du DEAKTIVERER et målepunkt, stopper udstedelsen af Granulære Certifikater.</li>
        <li>Begge dele sker øjeblikkeligt, men der er forsinkelse på visningen.</li>
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
    exportCertificates: 'Eksport',
    exportFailed: 'Eksport af certifikater fejlede, prøv venligst igen.'
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
    removalOfTransferAgreementProposalFailed:
      'Fjernelse af forslaget til overførselsaftalen mislykkedes.',
    tableTitle: 'Resultater',
    createNewTransferAgreement: 'Ny overførselsaftale',
    transferAgreementStatusFilterLabel: 'Status',
    activeTransferAgreement: 'Aktiv',
    inactiveTransferAgreement: 'Inaktiv',
    pendingTransferAgreement: 'Afventer',
    expiredTransferAgreementProposals: 'Udløbet',
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
        hintProposal:
          'Linket udløber 14 dage efter forslaget til overførselsaftalen blev oprettet, og kan kun bruges en enkelt gang.',
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
  consent: {
    title: 'Fuldmagter',
    noData: {
      title: '',
      message: 'Der er ingen fuldmagter',
    },
    error: {
      title: 'Ups! Noget gik galt.',
      message: 'Prøv venligst at genindlæse siden.',
    },
    tableTitle: 'Fuldmagter',
    grantorTableHeader: 'Fuldmagtsgiver',
    agentTableHeader: 'Fuldmagtshaver',
    validFromTableHeader: 'Gyldig fra',
    requestForConsent: 'Anmod om fuldmagt',
  },
  consentDetails: {
    validFrom: 'Gyldig fra',
    editConsent: 'Administrer fuldmagt',
    permissionsFor: 'Fuldmagt til',
  },
  editConsent: {
    permissions: 'Fuldmagter',
    cancel: 'Fortryd',
    saveChanges: 'Gem ændringer',
    revoke: 'Tilbagekald fuldmagt',
    revokeSuccess: 'Fuldmagten er blevet tilbagekaldt',
    revokeError: 'Der opstod en fejl under tilbagekaldelsen af fuldmagten. Prøv igen.',
  },
  grantConsent: {
    title: '{{organizationName}} har anmodet om fuldmagt',
    description:
      'Giv {{organizationName}} fuldmagt til følgende funktioner på Energy Track And Trace',
    permissions: {
      overview: {
        title: 'Overblik',
        description:
          'Se mængden af overført certificeret grøn strøm samt hvor stor andel af forbrugt strøm der er certificeret grøn strøm.',
      },
      meteringPoints: {
        title: 'Målepunkter',
        description:
          'Administrer hvilke produktionselmålere der skal udstede certifikater for grøn strøm, og hvilke forbrugselmålere der skal kunne matches med certificeret grøn strøm.',
      },
      transferAgreements: {
        title: 'Overførselsaftaler',
        description: 'Se og opret aftaler om overførsel af certificeret grøn strøm.',
      },
    },
    acceptTermsAndConditions: 'Accepter <a href="/terms" target="_blank">vilkår og betingelser</a>',
    decline: 'Afvis',
    accept: 'Accepter',
    accepted: 'Fuldmagt afgivet',
    declined: 'Fuldmagt afvist',
    error: {
      title: 'Uventet fejl',
      message: 'Der opstod en uventet fejl. Prøv igen.',
    },
  },
  help: {
    title: 'Hjælp',
    content: `
    <ul>
      <li><a class="internal-link" href="/da/{{faqLink}}">Ofte Stillede Spørgsmål</a></li>
      <li>
        <a class="internal-link" href="/da/{{introductionLink}}">Introduktion til Energy Origin</a>
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
