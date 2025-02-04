# Testing MitID in Local Environment

## Overview

MitID functionality is exclusively available in the production environment. To test MitID features, you'll need to configure your local environment to connect to production instead of the demo environment.

## Prerequisites

- Local development environment setup
- Access to production configuration files
- Web browser with capability to disable CORS
- MitID Erhverv user

## Configuration Steps

### 1. Configure API Settings

Update your local API configuration file with production values:

**File location:**

```bash
libs/eo/shared/assets/src/assets/configuration/eo-azure-b2c-settings.local.json
```

**Source of production values:**

- Reference the production API configuration at:
  [API environment (prod)](https://energytrackandtrace.dk/assets/configuration/eo-api-environment.json)

### 2. Configure B2C Settings

Update your local B2C configuration file with production values:

**File location:**

```bash
libs/eo/shared/assets/src/assets/configuration/eo-azure-b2c-settings.local.json
```

**Source of production values:**

- Reference the production B2C configuration at:
  [B2C Settings (prod)](https://energytrackandtrace.dk/assets/configuration/eo-azure-b2c-settings.json)

### 3. Start Application

1. If the application is running, stop it
2. Start the application with the new configuration

### 4. Browser Setup

Launch your browser with CORS disabled to allow local testing against production endpoints.

## Important Notes

- Always be cautious when testing against production environments
- Ensure you don't perform any operations that could affect production data
- Remember to re-enable CORS when done testing

## Troubleshooting

If you encounter connection issues:

- Verify all configuration values are correctly copied
- Ensure your browser has CORS disabled
- Check that all required services are running
