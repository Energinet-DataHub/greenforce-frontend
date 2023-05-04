# The 'views.dsl' file is intended as a mean for viewing and validating the model
# in the domain repository. It should
#   * Extend the base model and override the 'dh3' software system
#   * Include of the `model.dsl` files from each domain repository using an URL
#
# The `model.dsl` file must contain the actual model, and is the piece that must
# be reusable and included in other Structurizr files like `views.dsl` and
# deployment diagram files.

# TODO: Reset to use main before merging PR
workspace extends https://raw.githubusercontent.com/Energinet-DataHub/opengeh-arch-diagrams/dstenroejl/align-c4-models/docs/diagrams/c4-model/dh3-base-model.dsl {

    model {
        #
        # DataHub 3.0 (extends)
        #
        !ref dh3 {

            # IMPORTANT:
            # The order by which models are included is important for how the domain-to-domain relationships are specified.
            # A domain-to-domain relationship should be specified in the "client" of a "client->server" dependency, and
            # hence domains that doesn't depend on others, should be listed first.

            # Include Market Participant model
            !include https://raw.githubusercontent.com/Energinet-DataHub/geh-market-participant/dstenroejl/align-c4-models/docs/diagrams/c4-model/model.dsl

            # Include EDI model
            !include https://raw.githubusercontent.com/Energinet-DataHub/opengeh-edi/dstenroejl/align-c4-models/docs/diagrams/c4-model/model.dsl

            # Include Wholesale model
            !include https://raw.githubusercontent.com/Energinet-DataHub/opengeh-wholesale/dstenroejl/align-c4-models/docs/diagrams/c4-model/model.dsl

            # Include Frontend model
            !include https://raw.githubusercontent.com/Energinet-DataHub/greenforce-frontend/dstenroejl/align-c4-models/docs/diagrams/c4-model/model.dsl

            # Include Migration model
            !include https://raw.githubusercontent.com/Energinet-DataHub/
        }
    }

    views {
        container dh3 "Frontend" {
            title "[Container] DataHub 3.0 - Frontend (Simplified)"
            include ->frontendDomain->
            exclude "relationship.tag==OAuth"
            exclude "element.tag==Intermediate Technology"
            autolayout
        }

        container dh3 "FrontendDetailed" {
            title "[Container] DataHub 3.0 - Frontend (Detailed with OAuth)"
            include ->frontendDomain->
            exclude "relationship.tag==Simple View"
            autolayout
        }
    }
}