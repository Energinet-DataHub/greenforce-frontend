# Environment Switcher Tool

A CLI tool to quickly switch between development environments by fetching configuration files from the `dh3-dev-secrets` repository.

## Prerequisites

- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated
- Access to the `Energinet-DataHub/dh3-dev-secrets` repository

## Usage

```sh
bun run env
```

This will:

1. Fetch the repository structure from `dh3-dev-secrets`
2. Discover available environments (e.g., `dev_002`, `dev_003`, `test_001`)
3. Prompt you to select an environment
4. Download and write the configuration files to their correct locations

## How It Works

The tool uses the GitHub Git Trees API to fetch the repository structure in a single API call. It then:

1. Identifies environment directories matching patterns like `dev_*`, `test_*`, `prod_*`
2. Maps configuration files to their target paths by removing the environment directory from the path
3. Fetches file contents via the GitHub Blobs API
4. Writes files directly to the workspace

### Example

A file at:

```text
dh3-dev-secrets/greenforce-frontend/apps/dh/api-dh/source/DataHub.WebApi/dev_002/appsettings.json
```

Will be written to:

```text
apps/dh/api-dh/source/DataHub.WebApi/appsettings.json
```

## Configuration Files

The tool automatically discovers and handles all configuration files that are placed inside environment directories. Only files within environment folders (e.g., `dev_002/`, `test_001/`) are processed - files outside these folders are ignored.

Current examples:

| File                             | Location                                              |
| -------------------------------- | ----------------------------------------------------- |
| `appsettings.json`               | `apps/dh/api-dh/source/DataHub.WebApi/`               |
| `dh-b2c-environment.local.json`  | `libs/dh/shared/assets/src/assets/configuration/`     |

## Troubleshooting

### "gh: command not found"

Install the GitHub CLI: https://cli.github.com/

### "Not authenticated with GitHub CLI"

Run `gh auth login` and follow the prompts.

### "Resource not accessible"

Ensure you have access to the `Energinet-DataHub/dh3-dev-secrets` repository.
