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
  announcementBar: {
    message: `Do you need an introduction to EnergyOrigin? Contact us on <a href="mailto:datahub@energinet.dk">email</a>, and we will get back to you.`,
  },
  sidebar: {
    dashboard: 'Dashboard',
    meteringPoints: 'Metering Points',
    claims: 'Claims',
    certificates: 'Certificates',
    transfers: 'Transfers',
    activityLog: 'Activity Log',
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
    noData: {
      title: 'No metering points found',
      message: 'You do not have any metering points.',
    },
    error: {
      title: 'Oops! Something went wrong.',
      message: 'Please try reloading the page..',
    },
    tableTitle: 'Results',
    gsrnTableHeader: 'Metering Point',
    addressTableHeader: 'Address',
    unitTableHeader: 'Unit',
    sourceTableHeader: 'Source',
    onOffTableHeader: 'Off/On',
    onOffTooltipTitle: 'Not all metering points can be enabled',
    onOffTooltipMessage:
      'A metering point must have a wind or solar source to become eligible for activation.',
    onOffTooltipClose: 'Close',
    consumptionUnit: 'Consumption',
    productionUnit: 'Production',
    solarSource: 'Solar',
    windSource: 'Wind',
    otherSource: 'Other',
    contractError: 'Issue encountered. Please try again or reload the page.',
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
    actor: '{{orginizationName}} ({{organizationTin}})',
    systemActor: 'System',
    eventTableHeader: 'Event',
    events: {
      MeteringPoint: {
        Created: '{{actor}} has created a metering point with ID {{entityId}}',
        Accepted: '{{actor}} has accepted the metering point with ID {{entityId}}',
        Declined: '{{actor}} has declined the metering point with ID {{entityId}}',
        Activated: '{{actor}} has activated the metering point with ID {{entityId}}',
        Deactivated: '{{actor}} has deactivated the metering point with ID {{entityId}}',
        EndDateChanged:
          '{{actor}} has deactivated or changed the end date of the metering point with ID {{entityId}}',
        Expired: '{{actor}} has expired the metering point with ID {{entityId}}',
      },
      TransferAgreementProposal: {
        Created: '{{actor}} has created a proposal of a transfer agreement with ID {{entityId}}',
        Accepted:
          '{{actor}} has accepted the proposal of a transfer agreement with ID {{entityId}}',
        Declined:
          '{{actor}} has declined the proposal of a transfer agreement with ID {{entityId}}',
        Activated:
          '{{actor}} has activated the proposal of a transfer agreement with ID {{entityId}}',
        Deactivated:
          '{{actor}} has deactivated the proposal of a transfer agreement with ID {{entityId}}',
        EndDateChanged:
          '{{actor}} has changed the end date of the proposal of a transfer agreement with ID {{entityId}}',
        Expired: '{{actor}} has expired the proposal of a transfer agreement with ID {{entityId}}',
      },
      TransferAgreement: {
        Created: '{{actor}} has created a transfer agreement with ID {{entityId}}',
        Accepted: '{{actor}} has accepted the transfer agreement with ID {{entityId}}',
        Declined: '{{actor}} has declined the transfer agreement with ID {{entityId}}',
        Activated: '{{actor}} has activated the transfer agreement with ID {{entityId}}',
        Deactivated: '{{actor}} has deactivated the transfer agreement with ID {{entityId}}',
        EndDateChanged:
          '{{actor}} has changed the end date of the transfer agreement with ID {{entityId}}',
        Expired: '{{actor}} has expired the transfer agreement with ID {{entityId}}',
      },
    },
  },
  privacyPolicy: {
    title: 'Privacy Policy',
  },
  transfers: {
    title: 'Transfers',
    automationError: {
      title: 'We are currently experiencing an issue handling certificates',
      message: 'Once we resolve the issue, the outstanding transfers will update automatically.',
    },
    creationOfTransferAgreementFailed:
      'Creating the transfer agreement failed. Try accepting the proposal again or request the organization that sent the invitation to generate a new link.',
    tableTitle: 'Transfer agreements',
    createNewTransferAgreement: 'New transfer agreement',
    transferAgreementStatusFilterLabel: 'Status',
    activeTransferAgreement: 'Active',
    inactiveTransferAgreement: 'Inactive',
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
  transferAgreementHistory: {
    tableTitle: 'Changes',
    timeTableHeader: 'Time',
    eventTableHeader: 'Change',
    events: {
      createdTransferAgreement: '<strong>{{actor}}</strong> has created the transfer agreement',
      updatedTransferAgreementToHaveNoEndDate:
        '<strong>{{actor}}</strong> has updated the transfer agreement to have <strong>no end date</strong>',
      updatedTransferAgreementToHaveEndDate:
        '<strong>{{actor}}</strong> has updated the end date to <strong>{{endDate}}</strong>',
      deletedTransferAgreement: '<strong>{{actor}}</strong> has deleted the transfer agreement',
    },
    noData: {
      title: 'No history was found',
    },
    error: {
      title: 'An unexpected error occured',
      message: 'Try again or contact your system administrator if you keep getting this error.',
      retry: 'Try again',
    },
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
  help: {
    title: 'Help',
    content: `
    <ul>
      <li><a class="internal-link" href="{{faqLink}}">FAQ</a></li>
      <li>
        <a class="internal-link" href="{{introductionLink}}">Introduction to Energy Origin (Danish)</a>
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
