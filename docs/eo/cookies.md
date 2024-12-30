# Cookie Management

## Overview

Energy Track And Trace, along with other DataHub products, implements mandatory cookie consent management through Cookie Information.

## Implementation

- Location: `libs/gf/util-cookie-information`
- Provides standardized cookie banner and consent management
- Handles cookie compliance requirements

## Cookie Compliance Responsibilities

### Development Team

1. Ensure all cookies are properly declared
2. Verify automatic cookie scanning results
3. Monitor cookie usage in new features
4. Regular validation of cookie banner content

### Manual Cookie Declaration

If automatic scanning misses cookies:

1. Document the cookie details:
   - Name
   - Purpose
   - Duration
   - Type (necessary/functional/marketing)
2. Contact Cookie Information administrators for manual addition

### Cookie Information Access

For access or changes to Cookie Information settings:

1. Primary contact: **MGD**
2. Alternative: Contact other DataHub teams with Cookie Information access

## Best Practices

- Review cookie declarations after significant updates
- Test cookie banner functionality across browsers
- Ensure cookie consent is respected in all features
- Document any custom cookie implementations

## Troubleshooting

If you discover:

- Undeclared cookies
- Incorrect cookie categorization
- Cookie banner issues
- Consent management problems

Contact **MGD** or the development team with Cookie Information access.
