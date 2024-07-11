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

export const EN_TRANSLATIONS: TranslationKeys = {
  landingPage: {
    meta: {
      title: 'Energy Track & Trace™',
      description:
        'Energy Track & Trace™ is your reliable source for tracking and certification of green power. We prove where your power comes from.',
      keywords:
        'green power, green energy, tracking, certification, granular certificates, Energy Track & Trace, sustainable energy, renewable energy',
      author: 'Energy Track & Trace™',
      url: 'https://energytrackandtrace.dk',
    },
    announcementBar: {
      message: `Do you need an introduction to Energy Track & Trace™? Contact us on <a href="mailto:datahub@energinet.dk">email</a>, and we will get back to you.`,
    },
    header: {
      loginButton: 'Log in',
    },
    hero: {
      heading: 'Trace Energy to Its Origin.<br />Truthfully.',
      subheading: 'Green Proof You Can Trust',
      loginButton: 'Log in',
      learnMoreButton: 'Learn more',
    },
    why: {
      quote: `“We want to build trust in<br />
      genuine, sustainable energy<br />
      while addressing greenwashing<br />
      with our cutting-edge<br />
      technology.”`,
      quoteAuthor: `Martin Lervad Lundø<br />
      Vice President & CEO, Energinet DataHub`,
      quoteAuthorDescription: 'Martin Lervad Lundø - Vice President & CEO, Energinet DataHub',
    },
    how: {
      heading: 'HOW WE MAKE SUSTAINABILITY REPORTING EASIER',
      subheading: `Fast-Track Compliance with <span class="highlight">EU Sustainability</span> Regulations`,
      content: `
      <p>
        Energy Track & Trace™ emerges as a transformative solution designed to support companies through the
        complexities of adhering to the EU's Corporate Sustainability Reporting Directive (CSRD) and
        Environmental, Social, and Governance (ESG) directives.
      </p>
      <p>
        By leveraging advanced blockchain technology Energy Track & Trace™ ensures indisputable traceability of
        sustainable energy from its origin. This empowers businesses with a powerful tool to
        authenticate their pledges to green energy initiatives.
      </p>
    `,
    },
    what: {
      heading: 'How can Energy Track & Trace™ support my business?',
      section1: {
        title: 'Sustainable Profile',
        headline: 'Bolster investor and consumer trust with accurate reports',
        content:
          'With Energy Track & Trace™ your company can display your contribution to the green transition with a clear conscience. You can strengthen the trust of investors and consumers and at the same time facilitate accurate reporting of your green power consumption.',
      },
      section2: {
        title: 'RE Production',
        headline: 'Increase earnings with higher demands for transparency about sustainability',
        content: `
        <p>
        Our accurate Granular Certificates makes it easier to meet the strict EU rules on compliance and also boost the trustworthiness of companies' reports on sustainability.
        </p>
        <p>
        As a Producer it empowers you to offer your customers a better product.
        </p>`,
      },
      section3: {
        title: 'Green Energy Trading',
        headline: 'Help the market juggle granular certificates and connect digital wallets',
        content:
          'With high demands for showcasing and proving sources used in production we expect that marketplaces will evolve, aiding companies in buying green energy at the right time to match their consumption 24/7.',
      },
    },
    electricalGrid: {
      heading: 'How does it work?',
      subheading: `proof that energy has a <span class="highlight">truly</span> sustainable origin`,
    },
    blockchainTech: {
      heading: 'Blockchain technology ties granular certificates to renewable energy production',
      content: `
      <p>
        Based on data from Energinet's DataHub production certificates from approved energy sources are issued every 15 minutes.
      </p>
      <p>
        The certificates contain relevant metadata and are stored digitally in a Register, a Wallet and on a Blockchain.
        This makes it possible to trace them back to their origin, detect fraud and avoid double issuance without compromising GDPR.
      </p>`,
    },
    granularCertificates: {
      heading:
        'Granular certificates are transferred between wallets to match consumption with production',
      content: `Transfer agreements can be made to automatically transfer certificates from one wallet to
      another. Either through our UI in Energy Track & Trace™ or by the use of any third party using our
      API's.`,
    },
    proveSustainability: {
      heading: 'Energy Track & Trace™ quantifies your<br />green electricity consumption',
      content: `
      <p>
      <a href="https://energytrackandtrace.com/wp-content/uploads/2023/11/2022-05-Paper-Architectural-concepts-and-insights.pdf" target="_blank">Our calculations</a> show with 95% certainty whether your electricity comes from green energy sources.
      </p>
      <p>
      With our software your company can see whether and when you are sufficiently supplied with green electricity and when you are not.
      This gives you an insight you can act on and the certainty that you are making the right decision.
      </p>`,
    },
    cta: {
      heading: `Ready to track your company’s energy?`,
      section1: {
        heading: 'Try it out. Energy Track & Trace™ Beta.',
        cta: 'Log in',
      },
      section2: {
        heading: 'Collaboration. Interested in our APIs?',
        cta: 'check it out',
      },
    },
    footer: {
      section1: {
        heading: 'Address',
        content: `
          <p>Tonne Kjærsvej 65<br />7000 Fredericia<br />Denmark<br />CVR: 39315041</p>
        `,
      },
      section2: {
        heading: 'Contact',
        content: `
          <p>
            <a href="tel:+4570222810">+45 70 22 28 10</a><br />
            <a href="mailto:datahub@energinet.dk">datahub&#64;energinet.dk</a>
          </p>
        `,
      },
      section3: {
        heading: 'Legal',
        content: `
          <ul>
            <li>
              <a href="/en/privacy-policy">Privacy policy</a>
            </li>
            <li>
              <a href="/en/terms">Terms of use</a>
            </li>
          </ul>
        `,
      },
      section4: {
        heading: 'Developers',
        content: `
          <p>Get access to our</p>
          <a href="{{linkToDevPortal}}" target="_blank">{{icon}} Developer portal</a>
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
    dashboard: 'Dashboard',
    meteringPoints: 'Metering Points',
    claims: 'Claims',
    certificates: 'Certificates',
    transfers: 'Transfers',
    activityLog: 'Activity Log',
    consent: 'Consent',
  },
  footer: {
    poweredBy: 'Powered by',
    locationHeader: 'Address',
    address: `Tonne Kjærsvej 65,<br /> 7000 Fredericia,<br /> Denmark`,
    cvr: 'CVR: 3931150441',
    contactHeader: 'Contact',
    contactPhone: '+45 70 22 28 10',
    contactEmail: 'datahub@energinet.dk',
    privacyPolicy: 'Privacy Policy',
    accessibilityStatement: 'Accessibility Statement',
  },
  userInformation: {
    tin: 'CVR / TIN: {{tin}}',
  },
  topbar: {
    help: '{{shared.help}}',
    logout: '{{shared.logout}}',
  },
  shared: {
    error: {
      title: 'An unexpected error occured',
      message:
        'Try again by reloading the page or contacting your system administrator if you keep getting this error.',
      retry: 'Reload',
    },
    empty: {
      title: 'No data found',
      message: 'You do not have any data to display.',
    },
    chart: {
      title: 'Overview',
      titleTooltip: 'Only active metering points',
      activateMeteringPointsAction: 'Activate metering points',
      headlineNoData: 'No Data',
    },
    help: 'Help',
    logout: 'Logout',
    search: 'Search',
    paginator: {
      itemsPerPageLabel: 'Results per page',
      of: 'of',
      first: 'First page',
      last: 'Last page',
      next: 'Next page',
      previous: 'Previous page',
      ariaLabel: 'Select page',
    },
    fieldValidation: {
      required: 'Field is required',
    },
    clipboard: {
      success: 'Copied',
      error: 'Failed to copy',
    },
  },
  languageSwitcher: {
    title: 'Language',
    closeLabel: 'Close language selection',
    languagesLabel: 'Preferred language',
    languagesPlaceholder: 'Select language',
    languages: {
      da: 'Danish',
      en: 'English',
    },
    save: 'Save',
    cancel: 'Cancel',
  },
  dashboard: {
    title: 'Dashboard',
    tabs: {
      producer: 'Production',
      consumer: 'Consumption',
    },
    noData: {
      title: 'No data to visualize',
      message:
        'We have no data to visualize because you have no production or consumption metering point(s).',
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
      default: '{{transferredInPercentage}} transferred',
      noData: '{{shared.chart.headlineNoData}}',
    },
    subHeadline:
      '{{totalTransferred}} of {{totalProduced}} certified green production was transferred',
    activateMeteringPointsAction: '{{shared.chart.activateMeteringPointsAction}}',
    legends: {
      unused: 'Unused ({{percentage}})',
      transferred: 'Transferred ({{percentage}})',
      consumed: 'Consumed ({{percentage}})',
    },
    tooltips: {
      transferred: '{{amount}} {{unit}} transferred',
      consumed: '{{amount}} {{unit}} consumed',
      unused: '{{amount}} {{unit}} unused',
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
      default: '{{greenEnergyInPercentage}} green energy',
      noData: '{{shared.chart.headlineNoData}}',
    },
    subHeadline: '{{greenConsumption}} of {{totalComsumption}} is certified green energy',
    activateMeteringPointsAction: '{{shared.chart.activateMeteringPointsAction}}',
    legends: {
      other: 'Other ({{percentage}})',
      green: 'Green ({{percentage}})',
    },
    tooltips: {
      other: '{{amount}} {{unit}} other',
      green: '{{amount}} {{unit}} green',
    },
  },
  periodSelector: {
    periods: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year',
    },
    last30Days: 'Last 30 days',
  },
  meteringPoints: {
    title: 'Metering Points',
    infoBoxTitle: 'You have the option to switch your metering points ON and OFF.',
    infoBoxContent: `
    <p>For Production metering points:</p>

    <ul>
      <li>Turning it 'ON' means the metering point is actively issuing certificates of power.</li>
      <li>Switching it 'OFF' will stop the metering point from issuing certificates.</li>
    </ul>

    <br />
    <p>For Consumption metering points:</p>

    <ul>
      <li>
        'ON' indicates that the Consumption metering point actively issues consumption
        certificates.
      </li>
      <li>
        'OFF' indicates that the Consumption metering point will source its electricity from
        elsewhere.
      </li>
    </ul>
    `,
    pendingRelationStatus: {
      title: 'Awaiting response from DataHub',
      message: 'We are experiencing issues fetching your metering points. Please come back later.',
    },
    noData: {
      title: 'No metering points found',
      message: 'You do not have any metering points.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    tableTitle: 'Available metering points',
    gsrnTableHeader: 'Metering Point',
    addressTableHeader: 'Address',
    cityTableHeader: 'City',
    statusTableHeader: 'Status',
    unitTableHeader: 'Unit',
    sourceTableHeader: 'Source',
    consumptionUnit: 'Consumption',
    productionUnit: 'Production',
    solarSource: 'Solar',
    windSource: 'Wind',
    otherSource: 'Other',
    contractError: 'Issue encountered. Please try again or reload the page.',
    selected: '{{amount}} metering points selected',
    activate: 'Activate',
    deactivate: 'Deactivate',
    active: 'Active',
    inactive: 'Inactive',
  },
  claims: {
    title: 'Claims',
    noData: {
      title: 'No claims found',
      message: 'You do not have any claims.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    searchLabel: 'Search',
    tableTitle: 'Results',
    claimIdTableHeader: 'Claim Id',
    amountTableHeader: 'Amount',
    startDateTableHeader: 'Start',
    endDateTableHeader: 'End',
  },
  certificates: {
    title: 'Certificates',
    noData: {
      title: 'No certificates found',
      message: 'You do not have any certificates.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    searchLabel: 'Search',
    tableHeader: 'Results',
    timeTableHeader: 'Time',
    gsrnTableHeader: 'Metering Point',
    amountTableHeader: 'Amount',
    typeTableHeader: 'Type',
    productionType: 'production',
    consumptionType: 'consumption',
    certificateDetailsLink: 'View certificate',
  },
  certificateDetails: {
    title: 'Certificate Details - {{certificateType}}',
    staticDataHeadline: 'Static data',
    energyLabel: 'Energy',
    startTimeLabel: 'Start time',
    endTimeLabel: 'End time',
    gsrnLabel: 'GSRN',
    certificateIdLabel: 'Certificate ID',
    technologyHeadline: 'Technology',
    technologyCodeLabel: 'Technology code',
    fuelCodeLabel: 'Fuel code',
    backToCertificatesLink: '<< Back to Certificates',
    biddingZoneHeadline: 'Bidding Zone',
  },
  activityLog: {
    title: 'Activity Log',
    noData: {
      title: 'No activity found',
      message: 'You have no activity.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    eventTypeLabel: 'Event type',
    transferAgreementEventType: 'Transfer Agreement',
    meteringPointEventType: 'Metering Point',
    tableTitle: 'Results',
    timeTableHeader: 'Timestamp',
    systemActor: 'System',
    eventTableHeader: 'Event',
    events: {
      own: {
        MeteringPoint: {
          Created: '{{actorName}} has created a metering point with ID {{entityId}}',
          Accepted: '{{actorName}} has accepted the metering point with ID {{entityId}}',
          Declined: '{{actorName}} has declined the metering point with ID {{entityId}}',
          Activated: '{{actorName}} has activated the metering point with ID {{entityId}}',
          Deactivated: '{{actorName}} has deactivated the metering point with ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} has deactivated or changed the end date of the metering point with ID {{entityId}}',
          Expired: '{{actorName}} has expired the metering point with ID {{entityId}}',
        },
        TransferAgreementProposal: {
          Created:
            '{{actorName}} has created a proposal of a transfer agreement with ID {{entityId}}',
          Accepted:
            '{{actorName}} has accepted the proposal of a transfer agreement with ID {{entityId}}',
          Declined:
            '{{actorName}} has declined the proposal of a transfer agreement with ID {{entityId}}',
          Activated:
            '{{actorName}} has activated the proposal of a transfer agreement with ID {{entityId}}',
          Deactivated:
            '{{actorName}} has deactivated the proposal of a transfer agreement with ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} has changed the end date of the proposal of a transfer agreement with ID {{entityId}}',
          Expired:
            '{{actorName}} has expired the proposal of a transfer agreement with ID {{entityId}}',
        },
        TransferAgreement: {
          Created: '{{actorName}} has created a transfer agreement with ID {{entityId}}',
          Accepted:
            '{{actorName}} has accepted the transfer agreement from {{otherOrganizationName}} ({{otherOrganizationTin}}) with ID {{entityId}}',
          Declined: '{{actorName}} has declined the transfer agreement with ID {{entityId}}',
          Activated: '{{actorName}} has activated the transfer agreement with ID {{entityId}}',
          Deactivated: '{{actorName}} has deactivated the transfer agreement with ID {{entityId}}',
          EndDateChanged:
            '{{actorName}} has changed the end date of the transfer agreement with ID {{entityId}}',
          Expired: '{{actorName}} has expired the transfer agreement with ID {{entityId}}',
        },
      },
      others: {
        MeteringPoint: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has created a metering point with ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has accepted the metering point with ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has declined the metering point with ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has activated the metering point with ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has deactivated the metering point with ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has deactivated or changed the end date of the metering point with ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has expired the metering point with ID {{entityId}}',
        },
        TransferAgreementProposal: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has created a proposal of a transfer agreement with ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has accepted the proposal of a transfer agreement with ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has declined the proposal of a transfer agreement with ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has activated the proposal of a transfer agreement with ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has deactivated the proposal of a transfer agreement with ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has changed the end date of the proposal of a transfer agreement with ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has expired the proposal of a transfer agreement with ID {{entityId}}',
        },
        TransferAgreement: {
          Created:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has created a transfer agreement with ID {{entityId}}',
          Accepted:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has accepted the transfer agreement with ID {{entityId}}',
          Declined:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has declined the transfer agreement with ID {{entityId}}',
          Activated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has activated the transfer agreement with ID {{entityId}}',
          Deactivated:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has deactivated the transfer agreement with ID {{entityId}}',
          EndDateChanged:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has changed the end date of the transfer agreement with ID {{entityId}}',
          Expired:
            '{{otherOrganizationName}} ({{otherOrganizationTin}}) has expired the transfer agreement with ID {{entityId}}',
        },
      },
    },
  },
  privacyPolicy: {
    title: 'Privacy Policy',
  },
  transfers: {
    title: 'Transfers',
    creationOfTransferAgreementFailed:
      'Creating the transfer agreement failed. Try accepting the proposal again or request the organization that sent the invitation to generate a new link.',
    removalOfTransferAgreementProposalFailed: 'Removing the transfer agreement proposal failed.',
    tableTitle: 'Transfer agreements',
    createNewTransferAgreement: 'New transfer agreement',
    transferAgreementStatusFilterLabel: 'Status',
    activeTransferAgreement: 'Active',
    inactiveTransferAgreement: 'Inactive',
    pendingTransferAgreement: 'Pending',
    expiredTransferAgreementProposals: 'Expired',
    noData: {
      title: 'No transfer agreements found',
      message: 'You do not have any transfer agreements.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    unknownReceiver: 'Unknown company',
    unknownSender: 'Unknown company',
    senderTableHeader: 'Sender',
    receiverTableHeader: 'Receiver',
    startDateTableHeader: 'Start Date',
    endDateTableHeader: 'End Date',
    statusTableHeader: 'Status',
  },
  transferAgreement: {
    active: 'Active',
    inactive: 'Inactive',
    editTransferAgreement: 'Edit',
    periodOfAgreementLabel: 'Period of agreement',
    informationTab: 'Information',
    historyTab: 'History',
    receiverLabel: 'Receiver',
    unknownReceiver: 'Unknown company',
    idLabel: 'ID',
  },
  transferAgreementEdit: {
    title: 'Edit transfer agreement',
    closeLabel: 'Cancel editing transfer agreement',
    cancel: 'Cancel',
    saveChanges: 'Save',
    error: {
      title: 'Oops!',
      message: 'Something went wrong. Please try again.',
    },
  },
  createTransferAgreementProposal: {
    title: 'New transfer agreement',
    closeLabel: 'Cancel creation of new transfer agreement',

    recipient: {
      stepLabel: 'Recipient',
      title: 'Who is the agreement for?',
      description: 'Optional, but recommended for security reasons.',
      nextLabel: 'Next',
      unknownRecipient: 'Unknown company',
      receiverTinLabel: 'Recipient',
      receiverTinPlaceholder: 'CVR / TIN',
      receiverTinGeneralError: `Enter new CVR number or choose from previous<br />
      transfer agreements`,
      receiverTinEqualsSenderTin: 'The receiver cannot be your own TIN/CVR',
      receiverTinFormatError: 'An 8-digit TIN/CVR number is required',
    },
    timeframe: {
      stepLabel: 'Timeframe',
      title: 'What is the duration of agreement?',
      description: 'Choosing no end date, you can always stop the agreement manually.',
      nextLabel: 'Next',
      previousLabel: 'Previous',
      startDate: {
        label: 'START',
        required: 'The start of the period is required',
        nextHourOrLater: 'The start of the period must be at least the next hour from now',
        overlapping:
          'Chosen period overlaps with an existing agreement: {{startDate}} - {{endDate}}',
      },
      endDate: {
        label: 'Stop',
        noEndDateLabel: 'No specific end date',
        withEndDateLabel: 'End on date',
        minToday: 'The end of the period must be today or later',
        laterThanStartDate: 'The end of the period must be later than the start of the period',
        withEndDateOverlapping:
          "Because you haven't chosen an end date, the period overlaps with an existing agreement: {{startDate}} - {{endDate}}",
        withoutEndDateOverlapping:
          'Chosen period overlaps with an existing agreement: {{startDate}} - {{endDate}}',
      },
    },
    invitation: {
      stepLabel: 'Invitation',
      title: {
        success: 'New link for transfer agreement created!',
        error: 'Transfer agreeement proposal could not be generated',
      },
      description: {
        success: `
        <p>What happens now?</p>
        <ol style="padding-inline-start: revert;">
          <li>Send the following link to your recipient</li>
          <li>The agreement becomes final once the recipient accepts the terms</li>
        </ol>`,
        error: `
        <p>Press "Generate" im the form below to try again.</p>
        <p>If the problem persist, please contact support.</p>
        `,
      },
      link: {
        hint: 'Link expires in 14 days, usable by one organization or specific company.',
        hintProposal:
          'Link expires 14 days after the creation of the transfer agreement proposal, usable by one organization or specific company.',
        error: `Couldn't generate link. Please try again.`,
        copy: 'Copy link',
        retry: 'Generate',
      },
      nextLabel: 'Copy & close',
      previousLabel: 'Previous',
    },
  },
  respondTransferAgreementProposal: {
    title: ' ',
    loadingMessage: 'Please wait while we load the transfer agreement proposal',
    closeLabel: 'Close transfer agreement proposal',
    noEndDate: 'No end date',
    success: {
      title: 'Transfer agreement proposal',
      message: '{{senderName}} wants to make a transfer agreement with you.',
      acceptButton: 'Accept',
      declineButton: 'Decline',
    },
    error: {
      title: 'Invalid transfer agreement proposal',
      message: `
      The transfer agreement proposal you just clicked is not valid <br />
      If this is not what you expected, please contact the sender of the link.
      `,
      declineButton: 'Ok',
    },
  },
  consent: {
    title: 'Consent',
    noData: {
      title: '',
      message: 'You do not have any consents.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    tableTitle: 'Consents',
    grantorTableHeader: 'Grantor',
    agentTableHeader: 'Agent',
    validFromTableHeader: 'Valid from',
    requestForConsent: 'Request for consent',
  },
  consentDetails: {
    validFrom: 'Valid from',
    editConsent: 'Manage consent',
    permissionsFor: 'Permissions for',
  },
  editConsent: {
    permissions: 'Permissions',
    cancel: 'Cancel',
    saveChanges: 'Save changes',
    revoke: 'Revoke consent',
    revokeSuccess: 'Consent revoked',
    revokeError: 'Could not revoke consent. Please try again.',
  },
  grantConsent: {
    title: '{{organizationName}} has requested authorization',
    description:
      'Grant {{organizationName}} authorization for the following functionalities on Energy Track And Trace',
    permissions: {
      overview: {
        title: 'Overview',
        description:
          'View the amount of transferred certified green electricity and the proportion of consumed electricity that is certified green.',
      },
      meteringPoints: {
        title: 'Metering Points',
        description:
          'Manage which production meters should issue certificates for green electricity, and which consumption meters should be matched with certified green electricity.',
      },
      transferAgreements: {
        title: 'Transfer Agreements',
        description: 'View and create agreements for the transfer of certified green electricity.',
      },
    },
    acceptTermsAndConditions: 'Accept <a href="/terms" target="_blank">terms and conditions</a>',
    decline: 'Decline',
    accept: 'Accept',
    accepted: 'Authorization granted',
    declined: 'Authorization declined',
    error: {
      title: 'Unexpected error',
      message: 'An unexpected error occurred. Please try again.',
    },
  },
  help: {
    title: 'Help',
    content: `
    <ul>
      <li><a class="internal-link" href="/en/{{faqLink}}">FAQ</a></li>
      <li>
        <a class="internal-link" href="/en/{{introductionLink}}">Introduction to Energy Origin (Danish)</a>
      </li>
      <li>
        <a
          href="https://ens.dk/en/our-responsibilities/energy-climate-politics"
          target="_blank"
          rel="noopener noreferrer"
          >Danish Energy Agency - Energy and Climate Politics</a
        > The danish goverment policies around clomate and energy. Where you can read about the
        danish energy plan for the next 10 years.
      </li>
      <li>
        <a
          href="https://virksomhedsguiden.dk/content/temaer/groen_omstilling/"
          target="_blank"
          rel="noopener noreferrer"
          >Virksomhedsguiden.dk - Green transition (Danish)</a
        > Describe how companies can become more green, with a lot of instructions and templates.
      </li>
      <li>
        <a href="https://en.energinet.dk/Green-Transition" target="_blank" rel="noopener noreferrer"
          >Energinet - Green Transition</a
        > Energinet provide data regarding the transition to a more green energy system in Denmark.
      </li>
      <li>
        <a href="https://www.iea.org/countries/denmark" target="_blank" rel="noopener noreferrer"
          >IEA - Denmark</a
        > The International Energy Agency, is committed to shaping a secure and sustainable energy
        future for all and provide data and comparison on what they different countries are doing.
      </li>
    </ul>
    `,
  },
  faq: {
    title: 'FAQ',
    content: `
    <div class="watt-space-stack-m faq-link">
    <a href="#what-is-energy-origin">What is Energy Origin?</a>
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#who-can-access-the-platform"
      >Who can access the platform?</a
    >
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#where-does-the-data-come-from"
      >Where does the data come from?</a
    >
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#how-can-i-influence-the-development">
      How can I influence the development?
    </a>
  </div>
  <div class="watt-space-stack-m faq-link">
    <a href="#where-can-i-read-more">Where can I read more?</a>
  </div>

  <h3 id="what-is-energy-origin">What is Energy Origin?</h3>
  <p>
    The aim of the Energy Origin platform is to create transparency on the origin of energy for
    all energy consumers and to facilitate a market for for green energy. Currently, we are
    working on data related to electricity consumption. Upon login, you will soon be able to
    access your hourly electricity declaration and corresponding emissions for 2021.
  </p>

  <h3 id="who-can-access-the-platform">Who can access the platform?</h3>
  <p>
    Currently, the platform only offers company login via MitID. Later on, it will be possible for
    private individuals to login via MitID.
  </p>

  <h3 id="where-does-the-data-come-from">Where does the data come from?</h3>
  <p>
    All data related to metering points, consumption and production is served by the Energinet
    DataHub. Data related to the origin of energy and corresponding emissions stems from Energi
    Data Service.
  </p>

  <h3 id="how-can-i-influence-the-development">How can I influence the development?</h3>
  <p>
    You are more than welcome to participate in our LinkedIn user group, a digital forum for
    users, in which we post sketches, questions and gather ideas and suggestions for new
    development and improvements. It's non-binding and you can either just follow along without
    getting involved or comment when you have time.
  </p>

  <h3 id="where-can-i-read-more">Where can I read more?</h3>
  <p>
    You can read more about the history and intention of Energy Origin on our website:
    <a
      href="https://en.energinet.dk/Energy-data/DataHub/Energy-Origin"
      target="_blank"
      rel="noopener noreferrer"
    >
      Origins of energy | Energinet
    </a>
  </p>
    `,
  },
};
