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
export interface TranslationKeys {
  sidebar: {
    dashboard: string;
    meteringPoints: string;
    claims: string;
    certificates: string;
    transfers: string;
    activityLog: string;
  };
  footer: {
    poweredBy: string;
    locationHeader: string;
    address: string;
    cvr: string;
    contactHeader: string;
    contactPhone: string;
    contactEmail: string;
    privacyPolicy: string;
    accessibilityStatement: string;
  };
  userInformation: {
    tin: string;
  };
  topbar: {
    help: string;
    logout: string;
  };
  shared: {
    error: {
      title: string;
      message: string;
      retry: string;
    };
    chart: {
      title: string;
      titleTooltip: string;
      activateMeteringPointsAction: string;
      headlineNoData: string;
    };
    help: string;
    logout: string;
  };
  dashboard: {
    title: string;
    tabs: {
      producer: string;
      consumer: string;
    };
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
  };
  producerChart: {
    title: string;
    titleTooltip: string;
    error: {
      title: string;
      message: string;
      retry: string;
    };
    headline: {
      default: string;
      noData: string;
    };
    subHeadline: string;
    activateMeteringPointsAction: string;
    legends: {
      unused: string;
      transferred: string;
      consumed: string;
    };
    tooltips: {
      transferred: string;
      consumed: string;
      unused: string;
    };
  };
  consumerChart: {
    title: string;
    titleTooltip: string;
    error: {
      title: string;
      message: string;
      retry: string;
    };
    headline: {
      default: string;
      noData: string;
    };
    subHeadline: string;
    activateMeteringPointsAction: string;
    legends: {
      other: string;
      green: string;
    };
    tooltips: {
      other: string;
      green: string;
    };
  };
  periodSelector: {
    periods: {
      day: string;
      week: string;
      month: string;
      year: string;
    };
    last30Days: string;
  };
  meteringPoints: {
    title: string;
    infoBoxTitle: string;
    infoBoxContent: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    tableTitle: string;
    gsrnTableHeader: string;
    addressTableHeader: string;
    unitTableHeader: string;
    sourceTableHeader: string;
    onOffTableHeader: string;
    onOffTooltipTitle: string;
    onOffTooltipClose: string;
    onOffTooltipMessage: string;
    consumptionUnit: string;
    productionUnit: string;
    solarSource: string;
    windSource: string;
    otherSource: string;
    contractError: string;
  };
}
