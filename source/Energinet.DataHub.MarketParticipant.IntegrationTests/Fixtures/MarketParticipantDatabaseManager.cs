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

using System;
using System.Threading.Tasks;
using Energinet.DataHub.Core.FunctionApp.TestCommon.Database;
using Energinet.DataHub.MarketParticipant.ApplyDBMigrationsApp.Helpers;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures
{
    public sealed class MarketParticipantDatabaseManager : SqlServerDatabaseManager<MarketParticipantDbContext>
    {
        public MarketParticipantDatabaseManager()
            : base("MarketParticipant")
        {
        }

        public override MarketParticipantDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<MarketParticipantDbContext>()
                .UseSqlServer(ConnectionString);

            return new MarketParticipantDbContext(optionsBuilder.Options);
        }

        /// <summary>
        ///     Creates the database schema using DbUp instead of a database context.
        /// </summary>
        protected override async Task<bool> CreateDatabaseSchemaAsync(MarketParticipantDbContext context)
        {
            var upgradeEngine = await UpgradeFactory.GetUpgradeEngineAsync(ConnectionString, GetFilter()).ConfigureAwait(false);

            // Transient errors can occur right after DB is created,
            // as it might not be instantly available, hence this retry loop.
            // This is especially an issue when running against an Azure SQL DB.
            var tryCount = 0;
            do
            {
                ++tryCount;

                var result = upgradeEngine.PerformUpgrade();

                if (result.Successful == true)
                    return true;

                if (tryCount > 10)
                    throw new InvalidOperationException("Database migration failed", result.Error);

                await Task.Delay(256 * tryCount).ConfigureAwait(false);
            }
            while (true);
        }

        private static Func<string, bool> GetFilter()
        {
            return file =>
                file.EndsWith(".sql", StringComparison.OrdinalIgnoreCase) &&
                file.Contains(".Scripts.LocalDB.", StringComparison.OrdinalIgnoreCase);
        }
    }
}
