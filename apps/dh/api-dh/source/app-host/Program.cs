var builder = DistributedApplication.CreateBuilder(args);

var webapi = builder.AddProject<Projects.DataHub_WebApi>("bff", launchProfileName: "DataHub.WebApi");

builder.AddFusionGateway<Projects.DataHub_Gateway>("gateway")
.WithSubgraph(webapi);

builder.Build().Compose().Run();
