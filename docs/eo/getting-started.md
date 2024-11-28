# Getting Started Guide

A step-by-step guide for making code changes to Energy Track And Trace

## Prerequisites

- GitHub access to the repository
- Understanding of Git basics
- Access to Teams channels

## Making Changes

### 1. Create a Branch

⚠️ **Branch naming is crucial for automated processes**

- Follow the [branching strategy](branching-strategy.md) guidelines exactly
- Your branch name determines which CI/CD pipelines will run

### 2. Development & Pull Request

1. Make your code changes
2. Create a pull request (PR):
   - Use draft PR if work is still in progress
   - Regular PR when ready for review

#### Testing Environment

After creating your PR:

1. The CI/CD pipeline will automatically deploy to a test environment
2. Find your deployment:
   - Go to [eo-base-environments actions](https://github.com/Energinet-DataHub/eo-base-environment/actions)
   - Search using `branch:<your-branch-name>`
   - Find the workflow named `Automated vCluster Creation` or `Infrastructure CD preview environment`
   - Locate the environment URL in the action results in `deploy summary`

#### Additional Resources

- [Continuous Integration Guide](continues-integration.md)
- [Continuous Deployment Guide](continues-integration.md)

### 3. Code Review Process

1. When your PR is ready:
   - Post the PR link in the Teams `review` channel
   - Request UI review if you made frontend changes
   - Address any feedback promptly

### 4. Merging

Before merging, ensure:

- All pipeline checks pass
- Code review is approved
- UI changes are verified (if applicable)

⚠️ **Important: All changes merged to main branch automatically deploy to production**

### 5. Production Verification

After merge:

1. Wait for production deployment to complete
2. Perform smoke tests on production environment
3. Verify your changes work as expected
4. Monitor for any unexpected behavior

### 6. Clean up

After merging your changes, manually delete your branch from both:

This repository
The eo-base-environment repository branch list

Navigate to: github.com/Energinet-DataHub/eo-base-environment/branches
Find and delete your branch

⚠️ **Important: Branches are not automatically deleted after merging in the eo-base-environment repository.**

## Troubleshooting

If you encounter issues:

- Check the pipeline logs for errors
- Review the branching strategy documentation
- Ask for help in the Teams channel
