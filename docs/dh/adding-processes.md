# Adding New Processes to the Process Overview

This guide explains how to add support for new business processes (e.g., BRS_009 Move In, BRS_023 Calculations) to the DataHub Process Overview feature.

## Overview

The process system is designed to be **generic and extensible**:

- The **Backend (BFF)** automatically generates step identifiers from ProcessManager metadata
- The **Frontend** requires translations and type definitions for each process

## Architecture

```text
ProcessManager → BFF → Frontend
     ↓            ↓        ↓
  Metadata   Generic   Translations
             Mapper    + Types
```

### Step Identifier Format

Step identifiers follow this pattern:

```text
{PROCESS_NAME}_V{VERSION}_STEP_{SEQUENCE}
```

**Examples:**

- `BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1`
- `BRS_009_MOVEIN_V1_STEP_1`
- `BRS_023_027_V1_STEP_1`

## Steps to Add a New Process

### 1. Add ProcessStepType Enum Values (BFF)

Add the new process step identifiers to the `ProcessStepType` enum in the BFF.

**File location:** `apps/dh/api-dh/source/DataHub.WebApi/Modules/MessageArchive/Models/ProcessStepType.cs`

```csharp
public enum ProcessStepType
{
    // Existing steps
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1,
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_2,
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_3,

    // Add new process steps here:
    BRS_009_MOVEIN_V1_STEP_1,
    BRS_009_MOVEIN_V1_STEP_2,

    UNKNOWN,
}
```

**Important:**

- Always keep `UNKNOWN` as the last enum value
- TypeScript types will be auto-generated from this enum
- No need to manually maintain frontend types!

### 2. Regenerate GraphQL Types

After adding enum values, regenerate the frontend GraphQL types:

```bash
bunx nx run dh-shared-domain:generate
```

This will automatically generate TypeScript types from the C# enum.

### 3. Add Translation Keys

Add translations for each process step in **both** language files.

**File locations:**

- English: `libs/dh/globalization/assets-localization/src/assets/i18n/en.json`
- Danish: `libs/dh/globalization/assets-localization/src/assets/i18n/da.json`

**Path in JSON:** `processOverview.steps`

**Example:**

```json
{
  "processOverview": {
    "steps": {
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1": "Request end of supply (RSM-005)",
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_2": "Confirm end of supply (RSM-005)",
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_3": "Reject end of supply (RSM-005)",

      "BRS_009_MOVEIN_V1_STEP_1": "Request move in (RSM-009)",
      "BRS_009_MOVEIN_V1_STEP_2": "Confirm move in (RSM-009)"
    }
  }
}
```

**Danish (da.json):**

```json
{
  "processOverview": {
    "steps": {
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1": "Anmod om leveranceophør (RSM-005)",
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_2": "Godkend anmod om leveranceophør (RSM-005)",
      "BRS_002_REQUESTENDOFSUPPLY_V1_STEP_3": "Afvis anmod om leveranceophør (RSM-005)",

      "BRS_009_MOVEIN_V1_STEP_1": "Anmod om indflytning (RSM-009)",
      "BRS_009_MOVEIN_V1_STEP_2": "Godkend indflytning (RSM-009)"
    }
  }
}
```
