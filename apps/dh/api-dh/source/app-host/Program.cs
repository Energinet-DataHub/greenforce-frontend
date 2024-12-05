var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.DataHub_WebApi>("bff", launchProfileName: "DataHub.WebApi");

builder.Build().Run();
