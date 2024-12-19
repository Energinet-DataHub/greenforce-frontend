# Continuous Integration (CI)

## Overview

This monorepo utilizes NX with affected-based execution for cross-product workflows. CI processes are split into shared and product-specific workflows.

## Shared CI Workflows

Location: `.github/workflows/frontend-ci.yml`

### General Jobs

- Testing
- Linting
- Code formatting
- License header validation
- Dependency checks
- Code quality scans

### NX Affected Execution

- Only runs jobs for changed files and their dependencies
- Optimizes CI runtime
- Ensures cross-product compatibility

## Energy Track and Trace CD

Location: `.github/workflows/eo-cd.yml`

### Product-Specific Jobs

- Application build
- Container image creation
- Artifact generation
- CD pipeline preparation

## Workflow Triggers

### Shared CI (`frontend-ci.yml`)

- Pull requests
- Push to main branch
- Manual workflow dispatch

### ETT CD (`eo-cd.yml`)

- Changes in ETT-specific paths
- Successful completion of shared CI
- Manual workflow dispatch

## Best Practices

### Pull Requests

1. Ensure shared CI passes before merge
2. Review CI logs for affected areas
3. Verify product-specific workflows
4. Check build artifacts

### Development

1. Run local CI checks before pushing

```bash
# Test affected projects
bun nx affected:test

# Lint affected projects
bun nx affected:lint
```
