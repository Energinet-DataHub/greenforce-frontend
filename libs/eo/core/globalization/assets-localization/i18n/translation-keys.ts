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
  landingPage: {
    meta: {
      title: string;
      description: string;
      keywords: string;
      author: string;
      url: string;
    };
    announcementBar: {
      message: string;
    };
    header: {
      loginButton: string;
    };
    hero: {
      heading: string;
      subheading: string;
      loginButton: string;
      learnMoreButton: string;
    };
    why: {
      quote: string;
      quoteAuthor: string;
      quoteAuthorDescription: string;
    };
    how: {
      heading: string;
      subheading: string;
      content: string;
    };
    what: {
      heading: string;
      section1: {
        title: string;
        headline: string;
        content: string;
      };
      section2: {
        title: string;
        headline: string;
        content: string;
      };
      section3: {
        title: string;
        headline: string;
        content: string;
      };
    };
    electricalGrid: {
      heading: string;
      subheading: string;
    };
    blockchainTech: {
      heading: string;
      content: string;
    };
    granularCertificates: {
      heading: string;
      content: string;
    };
    proveSustainability: {
      heading: string;
      content: string;
    };
    naming: {
      heading: string;
      content: string;
    };
    cta: {
      heading: string;
      section1: {
        heading: string;
        cta: string;
      };
      section2: {
        heading: string;
        cta: string;
      };
    };
    footer: {
      section1: {
        heading: string;
        content: string;
      };
      section2: {
        heading: string;
        content: string;
      };
      section3: {
        heading: string;
        content: string;
      };
      section4: {
        heading: string;
        content: string;
      };
      drivenBy: string;
    };
  };
  documentation: {
    error: {
      title: string;
      message: string;
    };
    endpoints: string;
    topbarTitle: string;
  };
  sidebar: {
    dashboard: string;
    meteringPoints: string;
    claims: string;
    certificates: string;
    transfers: string;
    activityLog: string;
    consent: string;
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
  actorMenu: {
    onBehalfOf: string;
    tin: string;
  }
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
    empty: {
      title: string;
      message: string;
    };
    chart: {
      title: string;
      titleTooltip: string;
      activateMeteringPointsAction: string;
      headlineNoData: string;
    };
    help: string;
    logout: string;
    paginator: {
      itemsPerPageLabel: string;
      of: string;
      first: string;
      last: string;
      next: string;
      previous: string;
      ariaLabel: string;
    };
    fieldValidation: {
      required: string;
    };
    search: string;
    clipboard: {
      success: string;
      error: string;
    };
  };
  languageSwitcher: {
    title: string;
    closeLabel: string;
    languagesLabel: string;
    languagesPlaceholder: string;
    languages: {
      da: string;
      en: string;
    };
    save: string;
    cancel: string;
  };
  terms: {
    title: string;
    acceptingTerms: string;
    reject: string;
    accept: string;
    fetchingTermsError: {
      title: string;
      message: string;
    };
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
    pendingRelationStatus: {
      title: string;
      message: string;
    };
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
    cityTableHeader: string;
    statusTableHeader: string;
    unitTableHeader: string;
    sourceTableHeader: string;
    consumptionUnit: string;
    productionUnit: string;
    solarSource: string;
    windSource: string;
    otherSource: string;
    contractError: string;
    selected: string;
    activate: string;
    deactivate: string;
    active: string;
    inactive: string;
  };
  claims: {
    title: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    searchLabel: string;
    tableTitle: string;
    claimIdTableHeader: string;
    amountTableHeader: string;
    startDateTableHeader: string;
    endDateTableHeader: string;
  };
  certificates: {
    title: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    searchLabel: string;
    tableHeader: string;
    timeTableHeader: string;
    gsrnTableHeader: string;
    amountTableHeader: string;
    typeTableHeader: string;
    productionType: string;
    consumptionType: string;
    certificateDetailsLink: string;
    exportCertificates: string;
    exportFailed: string;
  };
  certificateDetails: {
    title: string;
    staticDataHeadline: string;
    energyLabel: string;
    startTimeLabel: string;
    endTimeLabel: string;
    gsrnLabel: string;
    certificateIdLabel: string;
    technologyHeadline: string;
    technologyCodeLabel: string;
    fuelCodeLabel: string;
    backToCertificatesLink: string;
    biddingZoneHeadline: string;
    energyTag: {
      headline: string;
      connectedGridIdentification: string;
      country: string;
      energyCarrier: string;
      gcFaceValue: string;
      gcIssuanceDatestamp: string;
      gcIssueDeviceType: string;
      gcIssueMarketZone: string;
      gcIssuer: string;
      productionDeviceCapacity: string;
      productionDeviceCommercialOperationDate: string;
      productionDeviceLocation: string;
    };
  };
  activityLog: {
    title: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    eventTypeLabel: string;
    transferAgreementEventType: string;
    meteringPointEventType: string;
    tableTitle: string;
    timeTableHeader: string;
    systemActor: string;
    eventTableHeader: string;
    events: {
      own: {
        MeteringPoint: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
        TransferAgreementProposal: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
        TransferAgreement: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
      };
      others: {
        MeteringPoint: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
        TransferAgreementProposal: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
        TransferAgreement: {
          Created: string;
          Accepted: string;
          Declined: string;
          Activated: string;
          Deactivated: string;
          EndDateChanged: string;
          Expired: string;
        };
      };
    };
  };
  privacyPolicy: {
    title: string;
  };
  transfers: {
    title: string;
    creationOfTransferAgreementFailed: string;
    removalOfTransferAgreementProposalFailed: string;
    tableTitle: string;
    createNewTransferAgreement: string;
    transferAgreementStatusFilterLabel: string;
    activeTransferAgreement: string;
    inactiveTransferAgreement: string;
    pendingTransferAgreement: string;
    expiredTransferAgreementProposals: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    unknownReceiver: string;
    unknownSender: string;
    senderTableHeader: string;
    receiverTableHeader: string;
    startDateTableHeader: string;
    endDateTableHeader: string;
    statusTableHeader: string;
  };
  transferAgreement: {
    active: string;
    inactive: string;
    editTransferAgreement: string;
    periodOfAgreementLabel: string;
    informationTab: string;
    historyTab: string;
    receiverLabel: string;
    unknownReceiver: string;
    idLabel: string;
  };
  transferAgreementEdit: {
    title: string;
    closeLabel: string;
    cancel: string;
    saveChanges: string;
    error: {
      title: string;
      message: string;
    };
  };
  createTransferAgreementProposal: {
    title: string;
    closeLabel: string;
    recipient: {
      stepLabel: string;
      title: string;
      description: string;
      nextLabel: string;
      unknownRecipient: string;
      receiverTinLabel: string;
      receiverTinPlaceholder: string;
      receiverTinGeneralError: string;
      receiverTinEqualsSenderTin: string;
      receiverTinFormatError: string;
    };
    timeframe: {
      stepLabel: string;
      title: string;
      description: string;
      nextLabel: string;
      previousLabel: string;
      startDate: {
        label: string;
        required: string;
        nextHourOrLater: string;
        overlapping: string;
      };
      endDate: {
        label: string;
        noEndDateLabel: string;
        withEndDateLabel: string;
        minToday: string;
        laterThanStartDate: string;
        withEndDateOverlapping: string;
        withoutEndDateOverlapping: string;
      };
    };
    invitation: {
      stepLabel: string;
      title: {
        success: string;
        error: string;
      };
      description: {
        success: string;
        error: string;
      };
      link: {
        hint: string;
        hintProposal: string;
        error: string;
        copy: string;
        retry: string;
      };
      nextLabel: string;
      previousLabel: string;
    };
  };
  respondTransferAgreementProposal: {
    title: string;
    loadingMessage: string;
    closeLabel: string;
    noEndDate: string;
    success: {
      title: string;
      message: string;
      acceptButton: string;
      declineButton: string;
    };
    error: {
      title: string;
      message: string;
      declineButton: string;
    };
  };
  consent: {
    title: string;
    noData: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    tableTitle: string;
    grantorTableHeader: string;
    agentTableHeader: string;
    validFromTableHeader: string;
    requestForConsent: string;
  };
  consentDetails: {
    validFrom: string;
    editConsent: string;
    permissionsFor: string;
  };
  consentPermissions: {
    permissions: {
      overview: {
        title: string;
        description: string;
      };
      meteringPoints: {
        title: string;
        description: string;
      };
      transferAgreements: {
        title: string;
        description: string;
      };
    };
    description: string;
  };
  editConsent: {
    description: string;
    postDescription: string;
    cancel: string;
    saveChanges: string;
    revoke: string;
    revokeSuccess: string;
    revokeError: string;
  };
  grantConsent: {
    title: string;
    description: string;
    postDescription: string;
    acceptTermsAndConditions: string;
    decline: string;
    accept: string;
    accepted: string;
    declined: string;
    error: {
      title: string;
      message: string;
    };
  };
  help: {
    title: string;
    content: string;
  };
  faq: {
    title: string;
    content: string;
  };
}
