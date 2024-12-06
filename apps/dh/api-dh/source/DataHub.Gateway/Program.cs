using Energinet.DataHub.WebApi.GraphQL.Scalars;

var builder = WebApplication.CreateBuilder(args);

// Fix for custom scalar type not being recognized. Must be at the top of the file to work.
builder
    .AddGraphQL()
    .AddType<DateRangeType>();

builder.AddServiceDefaults();

builder.Services
    .AddCors()
    .AddHeaderPropagation(c =>
    {
        c.Headers.Add("GraphQL-Preflight");
        // TODO: This doesn't seem to work for some reason, Authorization is blank when
        // the BFF is requested via the gateway.
        c.Headers.Add("Authorization");
    });

builder.Services
    .AddHttpClient("Fusion")
    .AddHeaderPropagation();

builder.Services
    .AddFusionGatewayServer()
    .ConfigureFromFile("./gateway.fgp")
    .AddServiceDiscoveryRewriter();

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseHeaderPropagation();
app.MapGraphQL();

app.RunWithGraphQLCommands(args);
