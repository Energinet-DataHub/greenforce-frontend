# Branching Strategy

## Branch Naming Convention

### Format

`<type or environment>/<product>-<issue-number>-<descriptive-name>`

### Types and Environments

- `feat/` - New features
- `fix/` - Bug fixes
- `vcluster/` - vCluster environment
- `preview/` - Preview environment

Example:

- `feat/ett-123-add-login-component`
- `fix/ett-456-fix-certificate-validation`
- `vcluster/ett-789-test-deployment`
- `preview/ett-101-new-ui-feature`

### Important Considerations

- Prefix with type or environment (feat, fix, vcluster, preview)
- Include product name (ett, eed, cmo)
- Include the issue number in lowercase (ett-123)
- Use descriptive but concise names
- Use kebab-case for naming
- Keep names under 63 characters (Kubernetes limit)

## Automated Environments

### vCluster Environments

- Created automatically from branches prefixed with `vcluster/`
- Provides isolated Kubernetes environment
- Example: `vcluster/ett-123-test-deployment`

### Preview Environments

- Created automatically from branches prefixed with `preview/`
- Enables feature testing in isolation
- Example: `preview/ett-456-feature-test`

## Best Practices

### Do

- Always start with the correct type/environment prefix
- Include the product name in lowercase
- Use meaningful branch names
- Include ticket/issue reference
- Keep names short but descriptive
- **Note: Branch cleanup must be done manually in this repo**

### Don't

- Skip type/environment prefix
- Skip product name
- Use personal names in branches
- Create branches without tickets
- Use uppercase letters
- Include sensitive information in branch names

## Environment Cleanup

- Environments are automatically cleaned up when branches are deleted on `https://github.com/Energinet-DataHub/eo-base-environment`
- Manually delete environments if no longer needed
- Regular cleanup of stale environments is recommended

## Examples

```text
✅ Good branch names:
- feat/ett-123-user-authentication
- fix/ett-456-fix-memory-leak
- vcluster/ett-789-test-deployment
- preview/ett-101-feature-test

❌ Bad branch names:
- feature/ett-123-feature    (incorrect type prefix)
- ett-testing-stuff         (missing type and ticket)
- feat/ETT-123-thing       (uppercase used)
- fix/ett-456              (not descriptive enough)
