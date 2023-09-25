# Read description in the 'views.dsl' file.

frontendDomain = group "Frontend" {
    bffApp = container "BFF Web API" {
        description "Backend for frontend (BFF) combines data for presentation on DataHub 3 UI"
        technology "Asp.Net Core Web API"
        tags "Microsoft Azure - App Services" "Mandalorian" "Titans" "UI/UX Guild"

        # Domain-to-domain relationships
        this -> wholesaleApi "Uses" "json/https"
        this -> markpartApi "Uses" "json/https"
        this -> eSettApi "Uses" "json/https"
    }
    bffApi = container "BFF API" {
        description "API Gateway to BFF Web API"
        technology "Azure API Management Service"
        tags "Intermediate Technology" "Microsoft Azure - API Management Services" "Mandalorian" "Titans" "UI/UX Guild" "Outlaws"

        # Domain relationships
        this -> bffApp "Uses" "json/https"

        # Domain-to-domain relationships
        this -> dh3.sharedB2C "Validate OAuth token" "https" {
            tags "OAuth"
        }
    }
    frontendSinglePageApplication = container "UI" {
        description "Provides DH3 functionality to users via their web browser."
        technology "Angular"
        tags "Web Browser" "Mandalorian" "Titans" "UI/UX Guild"

        # Base model relationships
        dh3User -> this "Uses"
        dhSystemAdmin -> this "Views and manages data across all actors"

        # Domain relationships
        this -> bffApi "Uses GraphQL and RESTful services" "json/https"
        this -> bffApp "Uses" "json/https" {
            tags "Simple View"
        }

        # Domain-to-domain relationships
        this -> dh3.sharedB2C "Request OAuth token" "https" {
            tags "OAuth"
        }
    }
    frontendStaticWebApp = container "Static Web App" {
        description "Delivers the static content and the UI single page application"
        technology "Static Web App"
        tags "Intermediate Technology" "Microsoft Azure - Static Apps" "Mandalorian" "Titans" "UI/UX Guild"

        # Base model relationships
        dh3User -> this "Visits DH3 url" "https"
        dhSystemAdmin -> this "Visits DH3 url" "https"

        # Domain relationships
        this -> frontendSinglePageApplication "Delivers to users web browser"
    }
}
