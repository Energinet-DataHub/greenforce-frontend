using System.Runtime.CompilerServices;
using Energinet.DataHub.WebApi.Clients.EDI;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    internal static class EDIRegistrationExtensions
    {
        internal static IServiceCollection RegisterEDIServices(this IServiceCollection services, string messageArchiveBaseUrl)
        {
            services.AddScoped(provider => new ArchivedMessagesSearch(provider.GetRequiredService<AuthorizedHttpClientFactory>().CreateClient(new System.Uri(messageArchiveBaseUrl))));
            return services;
        }
    }
}
