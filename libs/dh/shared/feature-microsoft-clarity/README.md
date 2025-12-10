# dh-shared-feature-microsoft-clarity

This library provides Microsoft Clarity integration for the DataHub application.

## Running unit tests

Run `bun nx test dh-shared-feature-microsoft-clarity` to execute the unit tests via [Vitest](https://vitest.dev/).

## Testing Microsoft Clarity Locally

Microsoft Clarity is controlled by the `microsoft-clarity` feature flag. By default, this feature flag is disabled in local environment.

### Verifying the Integration

When Microsoft Clarity is active, you can verify it's working by:

1. **Check Browser DevTools**
   - Open the Network tab and look for requests to `https://t.clarity.ms/collect`
   - Open the Console and type `window.clarity` - it should return the Clarity object

2. **Check Cookie Consent**
   - Microsoft Clarity respects the cookie consent
   - Accept "Statistics" cookies in the cookie banner to enable full tracking
   - Without consent, Clarity runs in a limited mode

3. **Check Microsoft Clarity Dashboard**
   - Visit [clarity.microsoft.com](https://clarity.microsoft.com)
   - Sessions should appear in your project dashboard (may take a few minutes)

### Important Notes

- The project ID is configured in the environment files
- Microsoft Clarity is controlled by a feature flag (`microsoft-clarity`) which is disabled in local environment
- Cookie consent is automatically integrated with the platform's cookie management
- The service gracefully handles missing configuration and won't break the application

### Cookie Consent and Sessions

Microsoft Clarity requires cookie consent to function properly:

- **Without consent**: Clarity runs in a limited mode and may create new sessions on each page load
- **With consent**: Clarity can store cookies to maintain consistent user sessions

**Localhost Development**:

- Cookie consent is automatically granted on localhost since the cookie banner isn't shown
- This prevents multiple sessions from being created on each reload
- Sessions will persist properly during local development

**Other Environments**:

- Cookie consent follows the platform's cookie management system
- Users must accept "Statistics" cookies for proper session tracking
