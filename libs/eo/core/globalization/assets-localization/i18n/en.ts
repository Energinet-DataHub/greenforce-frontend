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
    chart: {
      title: 'Overview',
      titleTooltip: 'Only active metering points',
      activateMeteringPointsAction: 'Activate metering points',
      headlineNoData: 'No Data',
    },
    help: 'Help',
    logout: 'Logout',
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
    onOffTableHeader: 'On/Off',
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
};
