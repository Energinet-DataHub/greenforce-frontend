# Docker Compose Setup

This guide explains how to run the DataHub application and test different feature branches using Docker Compose.

## Prerequisites

- Docker Desktop installed
- Git installed
- Azure VPN Client installed [Documentation](https://energinet.atlassian.net/wiki/spaces/D3/pages/734625847/VPN+for+dev+test)
- Account authorized for DEV003 (AAdadmin account + SEC-G-Datahub-DevelopersAzure membership)

## Testing Feature Branch

To test a branch, run these commands:

```bash
git fetch --all && git checkout feature/branch-name && git pull
docker compose up --build
```

Replace `feature/branch-name` with the actual branch name.

When runinng docker compose for the first time you will be prompted for login in the terminal. Go [Device Login](https://microsoft.com/devicelogin) and authenticate using the prompted device code and your aadadmin account credentials

**Access Application:**

- Frontend: [Frontend](https://localhost:4200)

- Backend: [Backend](http://localhost:5000)

## Additional Commands

**Stop containers:**

To stop the running containers, press `Ctrl+C` in the terminal and run `docker compose down`.

## Resetting the environment

**Rebuild images but keep azure login:**

```bash
docker compose down --remove-orphans --rmi local
```

**Complete teardown:**

```bash
docker compose down --remove-orphans --volumes --rmi local
```
