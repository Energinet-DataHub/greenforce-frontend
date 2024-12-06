using HotChocolate.Fusion.Aspire;
using Microsoft.Extensions.Options;

var builder = DistributedApplication.CreateBuilder(args);

var webapi = builder.AddProject<Projects.DataHub_WebApi>("bff", launchProfileName: "DataHub.WebApi");

builder.AddFusionGateway<Projects.DataHub_Gateway>("gateway")
    .WithSubgraph(webapi)
    .WithOptions(new FusionCompositionOptions
    {
        // equivalent to `--enable-nodes` CLI option
        EnableGlobalObjectIdentification = true
    });

builder.Build().Compose().Run();
