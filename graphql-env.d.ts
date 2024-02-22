/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": null,
    "types": [
      {
        "kind": "SCALAR",
        "name": "DateRange"
      },
      {
        "kind": "OBJECT",
        "name": "ActorAuditedChangeAuditLogDto",
        "fields": [
          {
            "name": "auditedBy",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ActorAuditedChange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isInitialAssignment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "previousValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "String"
      },
      {
        "kind": "SCALAR",
        "name": "Boolean"
      },
      {
        "kind": "ENUM",
        "name": "ActorStatus",
        "enumValues": [
          {
            "name": "New"
          },
          {
            "name": "Active"
          },
          {
            "name": "Inactive"
          },
          {
            "name": "Passive"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "Actor",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "glnOrEicNumber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "marketRole",
            "type": {
              "kind": "ENUM",
              "name": "EicFunction",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ActorStatus",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "gridAreas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "GridAreaDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "contact",
            "type": {
              "kind": "OBJECT",
              "name": "ActorContactDto",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "organization",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Organization",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "BalanceResponsibleType",
        "fields": [
          {
            "name": "gridAreaWithName",
            "type": {
              "kind": "OBJECT",
              "name": "GridAreaDto",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "supplierWithName",
            "type": {
              "kind": "OBJECT",
              "name": "ActorNameDto",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "balanceResponsibleWithName",
            "type": {
              "kind": "OBJECT",
              "name": "ActorNameDto",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "receivedDateTime",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "supplier",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "balanceResponsible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "meteringPointType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TimeSeriesType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validFromDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validToDate",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "gridArea",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Calculation",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "period",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateRange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "createdByUserName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "gridAreas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "GridAreaDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "statusType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ProcessStatus",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "runId",
            "type": {
              "kind": "SCALAR",
              "name": "Long",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "resolution",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "unit",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "executionTimeStart",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "executionTimeEnd",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "executionState",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "CalculationState",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "areSettlementReportsCreated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "calculationType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "CalculationType",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "EdiB2CProcessType",
        "enumValues": [
          {
            "name": "preliminaryaggregation"
          },
          {
            "name": "balancefixing"
          },
          {
            "name": "wholesalefixing"
          },
          {
            "name": "firstcorrection"
          },
          {
            "name": "secondcorrection"
          },
          {
            "name": "thirdcorrection"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "EicFunction",
        "enumValues": [
          {
            "name": "BalanceResponsibleParty"
          },
          {
            "name": "BillingAgent"
          },
          {
            "name": "EnergySupplier"
          },
          {
            "name": "GridAccessProvider"
          },
          {
            "name": "ImbalanceSettlementResponsible"
          },
          {
            "name": "MeterOperator"
          },
          {
            "name": "MeteredDataAdministrator"
          },
          {
            "name": "MeteredDataResponsible"
          },
          {
            "name": "MeteringPointAdministrator"
          },
          {
            "name": "SystemOperator"
          },
          {
            "name": "DanishEnergyAgency"
          },
          {
            "name": "DataHubAdministrator"
          },
          {
            "name": "IndependentAggregator"
          },
          {
            "name": "SerialEnergyTrader"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "EsettOutgoingMessage",
        "fields": [
          {
            "name": "gridArea",
            "type": {
              "kind": "OBJECT",
              "name": "GridAreaDto",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "documentId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "created",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "calculationType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ExchangeEventCalculationType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timeSeriesType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TimeSeriesType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "periodFrom",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "periodTo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "documentStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DocumentStatus",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "ExchangeEventCalculationType",
        "enumValues": [
          {
            "name": "BALANCE_FIXING"
          },
          {
            "name": "AGGREGATION"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "GridAreaDto",
        "fields": [
          {
            "name": "priceAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "PriceAreaCode",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "code",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validFrom",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validTo",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ImbalancePrice",
        "fields": [
          {
            "name": "priceAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "PriceAreaCode",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "price",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Float"
      },
      {
        "kind": "OBJECT",
        "name": "ImbalancePriceDaily",
        "fields": [
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ImbalancePriceStatus",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timeStamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "imbalancePrices",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ImbalancePrice",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "importedAt",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "OrganizationAuditedChangeAuditLogDto",
        "fields": [
          {
            "name": "auditedBy",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "OrganizationAuditedChange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isInitialAssignment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "previousValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Organization",
        "fields": [
          {
            "name": "organizationId",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "actors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Actor",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "businessRegisterIdentifier",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "domain",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AddressDto",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "PermissionAuditedChangeAuditLogDto",
        "fields": [
          {
            "name": "auditedBy",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "PermissionAuditedChange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isInitialAssignment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "previousValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Permission",
        "fields": [
          {
            "name": "userRoles",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "UserRoleDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "created",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "assignableTo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "EicFunction",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Int"
      },
      {
        "kind": "ENUM",
        "name": "ProcessStatus",
        "enumValues": [
          {
            "name": "warning"
          },
          {
            "name": "success"
          },
          {
            "name": "danger"
          },
          {
            "name": "info"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UserAuditedChangeAuditLogDto",
        "fields": [
          {
            "name": "auditedBy",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "affectedActorName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "affectedUserRoleName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UserAuditedChange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isInitialAssignment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "previousValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserRoleAuditedChangeAuditLogDto",
        "fields": [
          {
            "name": "auditedBy",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "affectedPermissionName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UserRoleAuditedChange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isInitialAssignment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "previousValue",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "ApplyPolicy",
        "enumValues": [
          {
            "name": "BEFORE_RESOLVER"
          },
          {
            "name": "AFTER_RESOLVER"
          },
          {
            "name": "VALIDATION"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "permissionById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Permission",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "permissions",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Permission",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "searchTerm",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "permissionAuditLogs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "PermissionAuditedChangeAuditLogDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "userRoleAuditLogs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "UserRoleAuditedChangeAuditLogDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "userAuditLogs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "UserAuditedChangeAuditLogDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "organizationAuditLogs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "OrganizationAuditedChangeAuditLogDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "organizationId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "actorAuditLogs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ActorAuditedChangeAuditLogDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "actorId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "userRoleById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserRoleWithPermissionsDto",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "userRolesByEicFunction",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "UserRoleDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "eicFunction",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "EicFunction",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "organizationById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Organization",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "organizations",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Organization",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "gridAreas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "GridAreaDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "calculationById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Calculation",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "calculations",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Calculation",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "executionTime",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              },
              {
                "name": "executionStates",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "ENUM",
                      "name": "CalculationState",
                      "ofType": null
                    }
                  }
                }
              },
              {
                "name": "calculationTypes",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "ENUM",
                      "name": "CalculationType",
                      "ofType": null
                    }
                  }
                }
              },
              {
                "name": "gridAreaCodes",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  }
                }
              },
              {
                "name": "period",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int",
                  "ofType": null
                }
              }
            ]
          },
          {
            "name": "settlementReports",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "SettlementReport",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "gridAreaCodes",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "SCALAR",
                      "name": "String",
                      "ofType": null
                    }
                  }
                }
              },
              {
                "name": "period",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              },
              {
                "name": "executionTime",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              }
            ]
          },
          {
            "name": "selectedActor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Actor",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "actorById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Actor",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "actors",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Actor",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "actorsForEicFunction",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Actor",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "eicFunctions",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "ENUM",
                      "name": "EicFunction",
                      "ofType": null
                    }
                  }
                }
              }
            ]
          },
          {
            "name": "esettServiceStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ReadinessStatusDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "esettExchangeStatusReport",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExchangeEventStatusReportResponse",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "esettOutgoingMessageById",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "EsettOutgoingMessage",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "documentId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "esettExchangeEvents",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExchangeEventSearchResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "pageNumber",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "pageSize",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "periodInterval",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              },
              {
                "name": "createdInterval",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateRange",
                  "ofType": null
                }
              },
              {
                "name": "gridAreaCode",
                "type": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              {
                "name": "calculationType",
                "type": {
                  "kind": "ENUM",
                  "name": "ExchangeEventCalculationType",
                  "ofType": null
                }
              },
              {
                "name": "documentStatus",
                "type": {
                  "kind": "ENUM",
                  "name": "DocumentStatus",
                  "ofType": null
                }
              },
              {
                "name": "timeSeriesType",
                "type": {
                  "kind": "ENUM",
                  "name": "TimeSeriesType",
                  "ofType": null
                }
              },
              {
                "name": "documentId",
                "type": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              {
                "name": "sortProperty",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "ExchangeEventSortProperty",
                    "ofType": null
                  }
                }
              },
              {
                "name": "sortDirection",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "SortDirection",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "meteringGridAreaImbalance",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MeteringGridAreaImbalanceSearchResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "pageNumber",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "pageSize",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "createdFrom",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateTime",
                  "ofType": null
                }
              },
              {
                "name": "createdTo",
                "type": {
                  "kind": "SCALAR",
                  "name": "DateTime",
                  "ofType": null
                }
              },
              {
                "name": "gridAreaCode",
                "type": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              {
                "name": "documentId",
                "type": {
                  "kind": "SCALAR",
                  "name": "String",
                  "ofType": null
                }
              },
              {
                "name": "sortProperty",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "MeteringGridAreaImbalanceSortProperty",
                    "ofType": null
                  }
                }
              },
              {
                "name": "sortDirection",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "SortDirection",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "balanceResponsible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "BalanceResponsiblePageResult",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "pageNumber",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "pageSize",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "sortProperty",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "BalanceResponsibleSortProperty",
                    "ofType": null
                  }
                }
              },
              {
                "name": "sortDirection",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "SortDirection",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "actorsByOrganizationId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Actor",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "organizationId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "emailExists",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "emailAddress",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "knownEmails",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "associatedActors",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AssociatedActors",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "email",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "gridAreaOverview",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "GridAreaOverviewItemDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "imbalancePricesOverview",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ImbalancePricesOverview",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "imbalancePricesForMonth",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ImbalancePriceDaily",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "year",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "month",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                }
              },
              {
                "name": "areaCode",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "ENUM",
                    "name": "PriceAreaCode",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "userProfile",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GetUserProfileResponse",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "searchOrganizationInCVR",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CVROrganizationResult",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "cvr",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "updatePermission",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Permission",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdatePermissionDtoInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "updateActor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateActorPayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateActorInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "createCalculation",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CreateCalculationPayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "CreateCalculationInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "createAggregatedMeasureDataRequest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CreateAggregatedMeasureDataRequestPayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "CreateAggregatedMeasureDataRequestInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "updateOrganization",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateOrganizationPayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateOrganizationInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "createMarketParticipant",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CreateMarketParticipantPayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "CreateMarketParticipantInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "updateUserProfile",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateUserProfilePayload",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateUserProfileInput",
                    "ofType": null
                  }
                }
              }
            ]
          },
          {
            "name": "resendWaitingEsettExchangeMessages",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ResendWaitingEsettExchangeMessagesPayload",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "ActorAuditedChange",
        "enumValues": [
          {
            "name": "NAME"
          },
          {
            "name": "STATUS"
          },
          {
            "name": "CONTACT_NAME"
          },
          {
            "name": "CONTACT_EMAIL"
          },
          {
            "name": "CONTACT_PHONE"
          },
          {
            "name": "CONTACT_CATEGORY_ADDED"
          },
          {
            "name": "CONTACT_CATEGORY_REMOVED"
          },
          {
            "name": "CERTIFICATE_CREDENTIALS"
          },
          {
            "name": "CLIENT_SECRET_CREDENTIALS"
          }
        ]
      },
      {
        "kind": "SCALAR",
        "name": "DateTime"
      },
      {
        "kind": "SCALAR",
        "name": "UUID"
      },
      {
        "kind": "OBJECT",
        "name": "ActorContactDto",
        "fields": [
          {
            "name": "contactId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ContactCategory",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "phone",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ActorNameDto",
        "fields": [
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "TimeSeriesType",
        "enumValues": [
          {
            "name": "MGA_EXCHANGE"
          },
          {
            "name": "PRODUCTION"
          },
          {
            "name": "CONSUMPTION"
          }
        ]
      },
      {
        "kind": "SCALAR",
        "name": "Long"
      },
      {
        "kind": "ENUM",
        "name": "CalculationState",
        "enumValues": [
          {
            "name": "PENDING"
          },
          {
            "name": "EXECUTING"
          },
          {
            "name": "COMPLETED"
          },
          {
            "name": "FAILED"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "CalculationType",
        "enumValues": [
          {
            "name": "BALANCE_FIXING"
          },
          {
            "name": "AGGREGATION"
          },
          {
            "name": "WHOLESALE_FIXING"
          },
          {
            "name": "FIRST_CORRECTION_SETTLEMENT"
          },
          {
            "name": "SECOND_CORRECTION_SETTLEMENT"
          },
          {
            "name": "THIRD_CORRECTION_SETTLEMENT"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "DocumentStatus",
        "enumValues": [
          {
            "name": "RECEIVED"
          },
          {
            "name": "AWAITING_DISPATCH"
          },
          {
            "name": "AWAITING_REPLY"
          },
          {
            "name": "ACCEPTED"
          },
          {
            "name": "REJECTED"
          },
          {
            "name": "BIZ_TALK_ACCEPTED"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "PriceAreaCode",
        "enumValues": [
          {
            "name": "DK1"
          },
          {
            "name": "DK2"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "ImbalancePriceStatus",
        "enumValues": [
          {
            "name": "NO_DATA"
          },
          {
            "name": "IN_COMPLETE"
          },
          {
            "name": "COMPLETE"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "OrganizationAuditedChange",
        "enumValues": [
          {
            "name": "DOMAIN"
          },
          {
            "name": "NAME"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "AddressDto",
        "fields": [
          {
            "name": "streetName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "number",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "zipCode",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "city",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "country",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "PermissionAuditedChange",
        "enumValues": [
          {
            "name": "CLAIM"
          },
          {
            "name": "DESCRIPTION"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UserRoleDto",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "eicFunction",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "EicFunction",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UserRoleStatus",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "UserAuditedChange",
        "enumValues": [
          {
            "name": "FIRST_NAME"
          },
          {
            "name": "LAST_NAME"
          },
          {
            "name": "PHONE_NUMBER"
          },
          {
            "name": "STATUS"
          },
          {
            "name": "INVITED_INTO_ACTOR"
          },
          {
            "name": "USER_ROLE_ASSIGNED"
          },
          {
            "name": "USER_ROLE_REMOVED"
          },
          {
            "name": "USER_ROLE_REMOVED_DUE_TO_DEACTIVATION"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "UserRoleAuditedChange",
        "enumValues": [
          {
            "name": "NAME"
          },
          {
            "name": "DESCRIPTION"
          },
          {
            "name": "STATUS"
          },
          {
            "name": "PERMISSION_ADDED"
          },
          {
            "name": "PERMISSION_REMOVED"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "ApiError",
        "fields": [
          {
            "name": "message",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "apiErrors",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ApiErrorDescriptor",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "statusCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "response",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "headers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "KeyValuePairOfStringAndIEnumerableOfString",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Error"
          }
        ]
      },
      {
        "kind": "INTERFACE",
        "name": "Error",
        "fields": [
          {
            "name": "message",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": [],
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "ApiError"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "UserRoleStatus",
        "enumValues": [
          {
            "name": "ACTIVE"
          },
          {
            "name": "INACTIVE"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "ContactCategory",
        "enumValues": [
          {
            "name": "DEFAULT"
          },
          {
            "name": "CHARGES"
          },
          {
            "name": "CHARGE_LINKS"
          },
          {
            "name": "ELECTRICAL_HEATING"
          },
          {
            "name": "END_OF_SUPPLY"
          },
          {
            "name": "ENERGINET_INQUIRY"
          },
          {
            "name": "ERROR_REPORT"
          },
          {
            "name": "INCORRECT_MOVE"
          },
          {
            "name": "INCORRECT_SWITCH"
          },
          {
            "name": "MEASUREMENT_DATA"
          },
          {
            "name": "METERING_POINT"
          },
          {
            "name": "NET_SETTLEMENT"
          },
          {
            "name": "NOTIFICATION"
          },
          {
            "name": "RECON"
          },
          {
            "name": "REMINDER"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UserProfileUpdateDtoInput",
        "inputFields": [
          {
            "name": "firstName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "lastName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "phoneNumber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateMarketParticipantInput",
        "inputFields": [
          {
            "name": "organizationId",
            "type": {
              "kind": "SCALAR",
              "name": "UUID",
              "ofType": null
            }
          },
          {
            "name": "organization",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "CreateOrganizationDtoInput",
              "ofType": null
            }
          },
          {
            "name": "actor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "CreateActorDtoInput",
                "ofType": null
              }
            }
          },
          {
            "name": "actorContact",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "CreateActorContactDtoInput",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "MeteringPointType",
        "enumValues": [
          {
            "name": "PRODUCTION"
          },
          {
            "name": "FLEX_CONSUMPTION"
          },
          {
            "name": "TOTAL_CONSUMPTION"
          },
          {
            "name": "NON_PROFILED_CONSUMPTION"
          },
          {
            "name": "EXCHANGE"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdatePermissionDtoInput",
        "inputFields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            }
          },
          {
            "name": "description",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "CVROrganizationResult",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "hasResult",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "GetUserProfileResponse",
        "fields": [
          {
            "name": "firstName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "lastName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "phoneNumber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ImbalancePricesOverview",
        "fields": [
          {
            "name": "pricePeriods",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ImbalancePricePeriod",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "GridAreaOverviewItemDto",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "code",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "priceAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validFrom",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "validTo",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "actorNumber",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "actorName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "organizationName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "fullFlexDate",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "AssociatedActors",
        "fields": [
          {
            "name": "email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "actors",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "UUID",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "BalanceResponsibleSortProperty",
        "enumValues": [
          {
            "name": "VALID_FROM"
          },
          {
            "name": "VALID_TO"
          },
          {
            "name": "RECEIVED_DATE"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "BalanceResponsiblePageResult",
        "fields": [
          {
            "name": "page",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "BalanceResponsibleType",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "MeteringGridAreaImbalanceSortProperty",
        "enumValues": [
          {
            "name": "DOCUMENT_DATE_TIME"
          },
          {
            "name": "GRID_AREA_CODE"
          },
          {
            "name": "DOCUMENT_ID"
          },
          {
            "name": "RECEIVED_DATE_TIME"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "MeteringGridAreaImbalanceSearchResponse",
        "fields": [
          {
            "name": "items",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MeteringGridAreaImbalanceSearchResult",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "SortDirection",
        "enumValues": [
          {
            "name": "ASCENDING"
          },
          {
            "name": "DESCENDING"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "ExchangeEventSortProperty",
        "enumValues": [
          {
            "name": "CALCULATION_TYPE"
          },
          {
            "name": "CREATED"
          },
          {
            "name": "DOCUMENT_ID"
          },
          {
            "name": "DOCUMENT_STATUS"
          },
          {
            "name": "GRID_AREA_CODE"
          },
          {
            "name": "TIME_SERIES_TYPE"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "ExchangeEventSearchResponse",
        "fields": [
          {
            "name": "items",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExchangeEventSearchResult",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ExchangeEventStatusReportResponse",
        "fields": [
          {
            "name": "waitingForExternalResponse",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ReadinessStatusDto",
        "fields": [
          {
            "name": "component",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ESettStageComponent",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "isReady",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SettlementReport",
        "fields": [
          {
            "name": "calculationId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "calculationType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "CalculationType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "gridArea",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GridAreaDto",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "period",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateRange",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "executionTime",
            "type": {
              "kind": "SCALAR",
              "name": "DateTime",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserRoleWithPermissionsDto",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "eicFunction",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "EicFunction",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UserRoleStatus",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "permissions",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "PermissionDetailsDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ApiErrorDescriptor",
        "fields": [
          {
            "name": "message",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "code",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "args",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "JSON",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "KeyValuePairOfStringAndIEnumerableOfString",
        "fields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "JSON"
      },
      {
        "kind": "OBJECT",
        "name": "PermissionDetailsDto",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "created",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "ESettStageComponent",
        "enumValues": [
          {
            "name": "INGESTION"
          },
          {
            "name": "CONVERTER"
          },
          {
            "name": "SENDER"
          },
          {
            "name": "RECEIVER"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "ExchangeEventSearchResult",
        "fields": [
          {
            "name": "documentId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "gridAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "created",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "calculationType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ExchangeEventCalculationType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "timeSeriesType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TimeSeriesType",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "documentStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DocumentStatus",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MeteringGridAreaImbalanceSearchResult",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "gridAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "documentDateTime",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "receivedDateTime",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "periodStart",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "periodEnd",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "imbalancePerDay",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MeteringGridAreaImbalancePerDayDto",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ImbalancePricePeriod",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "priceAreaCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "PriceAreaCode",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ImbalancePriceStatus",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateActorContactDtoInput",
        "inputFields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ContactCategory",
                "ofType": null
              }
            }
          },
          {
            "name": "email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "phone",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateActorDtoInput",
        "inputFields": [
          {
            "name": "organizationId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "ActorNameDtoInput",
                "ofType": null
              }
            }
          },
          {
            "name": "actorNumber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "ActorNumberDtoInput",
                "ofType": null
              }
            }
          },
          {
            "name": "marketRoles",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ActorMarketRoleDtoInput",
                    "ofType": null
                  }
                }
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateOrganizationDtoInput",
        "inputFields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "businessRegisterIdentifier",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "AddressDtoInput",
                "ofType": null
              }
            }
          },
          {
            "name": "domain",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "AddressDtoInput",
        "inputFields": [
          {
            "name": "streetName",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "number",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "zipCode",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "city",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "country",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ActorMarketRoleDtoInput",
        "inputFields": [
          {
            "name": "eicFunction",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "EicFunction",
                "ofType": null
              }
            }
          },
          {
            "name": "gridAreas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ActorGridAreaDtoInput",
                    "ofType": null
                  }
                }
              }
            }
          },
          {
            "name": "comment",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ActorNumberDtoInput",
        "inputFields": [
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ActorNameDtoInput",
        "inputFields": [
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "MeteringGridAreaImbalancePerDayDto",
        "fields": [
          {
            "name": "imbalanceDay",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateTime",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "incomingQuantity",
            "type": {
              "kind": "SCALAR",
              "name": "Float",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "outgoingQuantity",
            "type": {
              "kind": "SCALAR",
              "name": "Float",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ActorGridAreaDtoInput",
        "inputFields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            }
          },
          {
            "name": "meteringPointTypes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            }
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateActorInput",
        "inputFields": [
          {
            "name": "actorId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            }
          },
          {
            "name": "actorName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "departmentName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "departmentEmail",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "departmentPhone",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "UNION",
        "name": "UpdateActorError",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "ApiError"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UpdateActorPayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "UNION",
                  "name": "UpdateActorError",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateCalculationInput",
        "inputFields": [
          {
            "name": "period",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "DateRange",
                "ofType": null
              }
            }
          },
          {
            "name": "gridAreaCodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                }
              }
            }
          },
          {
            "name": "calculationType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "CalculationType",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "CreateCalculationPayload",
        "fields": [
          {
            "name": "calculation",
            "type": {
              "kind": "OBJECT",
              "name": "Calculation",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateAggregatedMeasureDataRequestInput",
        "inputFields": [
          {
            "name": "processType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "EdiB2CProcessType",
                "ofType": null
              }
            }
          },
          {
            "name": "meteringPointType",
            "type": {
              "kind": "ENUM",
              "name": "MeteringPointType",
              "ofType": null
            }
          },
          {
            "name": "startDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          },
          {
            "name": "endDate",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "gridArea",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "energySupplierId",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          },
          {
            "name": "balanceResponsibleId",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            }
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "CreateAggregatedMeasureDataRequestPayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateOrganizationInput",
        "inputFields": [
          {
            "name": "orgId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "UUID",
                "ofType": null
              }
            }
          },
          {
            "name": "domain",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "UNION",
        "name": "UpdateOrganizationError",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "ApiError"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UpdateOrganizationPayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "UNION",
                  "name": "UpdateOrganizationError",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "UNION",
        "name": "CreateMarketParticipantError",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "ApiError"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "CreateMarketParticipantPayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "UNION",
                  "name": "CreateMarketParticipantError",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateUserProfileInput",
        "inputFields": [
          {
            "name": "userProfileUpdateDto",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UserProfileUpdateDtoInput",
                "ofType": null
              }
            }
          }
        ]
      },
      {
        "kind": "UNION",
        "name": "UpdateUserProfileError",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "ApiError"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UpdateUserProfilePayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "UNION",
                  "name": "UpdateUserProfileError",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ResendWaitingEsettExchangeMessagesPayload",
        "fields": [
          {
            "name": "boolean",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      }
    ],
    "directives": []
  }
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}