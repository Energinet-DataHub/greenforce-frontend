# Read description in the 'views.dsl' file.

frontendDomain = group "Frontend" {
    bffApp = container "BFF Web API" {
        description "Backend for frontend (BFF) combines data for presentation on DataHub 3 UI"
        technology "Asp.Net Core Web API"
        tags "Microsoft Azure - App Services"

        # Domain-to-domain relationships
        this -> wholesaleApi "uses" "json/https"
        this -> markpartApi "Uses" "json/https"
    }
    bffApi = container "BFF API" {
        description "API Gateway to BFF Web API"
        technology "Azure API Management Service"
        tags "Intermediate Technology" "Microsoft Azure - API Management Services"

        # Domain relationships
        this -> bffApp "Uses" "json/https"

        # Domain-to-domain relationships
        this -> commonB2C "Validate OAuth token" "https" {
            tags "OAuth"
        }
    }
    frontendSinglePageApplication = container "UI" {
        description "Provides DH3 functionality to users via their web browser."
        technology "Angular"
        tags "Web Browser"

        # Base model relationships
        extUser -> this "Uses"
        dhSystemAdmin -> this "Views and manages data across all actors"

        # Domain relationships
        this -> bffApi "Uses" "json/https"
        this -> bffApp "Uses" "json/https" {
            tags "Simple View"
        }

        # Domain-to-domain relationships
        this -> commonB2C "Request OAuth token" "https" {
            tags "OAuth"
        }
    }
    frontendStaticWebApp = container "Static Web App" {
        description "Delivers the static content and the UI single page application"
        technology "Static Web App"
        tags "Intermediate Technology" "Microsoft Azure - Static Apps"

        # Base model relationships
        extUser -> this "Visits DH3 url" "https"
        dhSystemAdmin -> this "Visits DH3 url" "https"

        # Domain relationships
        this -> frontendSinglePageApplication "Delivers to users web browser"
    }
}
