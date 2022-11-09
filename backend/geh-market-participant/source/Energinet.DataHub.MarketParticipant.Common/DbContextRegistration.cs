// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Energinet.DataHub.MarketParticipant.Common.Configuration;
using Energinet.DataHub.MarketParticipant.Common.Extensions;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common
{
    internal static class DbContextRegistration
    {
        public static void AddDbContexts(this IServiceCollection services, Container container)
        {
            services.AddDbContext<MarketParticipantDbContext>(options =>
            {
                var config = container.GetService<IConfiguration>();
                var connectionString = config.GetSetting(Settings.SqlDbConnectionString);
                options.UseSqlServer(connectionString);
            });
        }

        public static void AddDbContextInterfaces(this Container container)
        {
            container.Register<IMarketParticipantDbContext, MarketParticipantDbContext>(Lifestyle.Scoped);
        }
    }
}
