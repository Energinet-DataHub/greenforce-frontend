# Poor man monorepo

## Reason

To make it easier to run and debug our microservices. A backend directory has been added to the greenforce frontend monorepo where it is possible to clone the microservices that the BFF uses.

## Supported projects

- Market participant
- Message archive
- Wholesale

## Add new projects

Clone the project to the backend directory and update
<https://github.com/Energinet-DataHub/greenforce-frontend/blob/3b2caf64b7254245f7ed190ae71c9228a48ea0e7/.vscode/launch.json>
and
<https://github.com/Energinet-DataHub/greenforce-frontend/blob/3b2caf64b7254245f7ed190ae71c9228a48ea0e7/.vscode/tasks.json>

Also update

<https://github.com/Energinet-DataHub/greenforce-frontend/blob/7e3820eab69dfc254c43877c26b83db978a66d67/apps/dh/api-dh/source/DataHub.WebApi/DataHub.WebApi.csproj>

To handle both PackageReference and ProjectReference

### Market Participant

git clone <https://github.com/Energinet-DataHub/geh-market-participant.git>

### Message archive

git clone <https://github.com/Energinet-DataHub/geh-message-archive.git>

### Wholesale

git clone <https://github.com/Energinet-DataHub/opengeh-wholesale.git>

## Generating HttpClient and DTOs

When generating clients and types from these local backend repositories,
remember to add the `--skip-nx-cache` flag to the build-client script:

```sh
yarn nx run api-dh:build-client --skip-nx-cache
```
