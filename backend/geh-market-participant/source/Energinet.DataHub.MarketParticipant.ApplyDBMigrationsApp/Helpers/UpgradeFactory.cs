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
using System.Data.SqlClient;
using System.Reflection;
using System.Threading.Tasks;
using DbUp;
using DbUp.Engine;

namespace Energinet.DataHub.MarketParticipant.ApplyDBMigrationsApp.Helpers
{
    public static class UpgradeFactory
    {
        public static async Task<UpgradeEngine> GetUpgradeEngineAsync(string connectionString, Func<string, bool> scriptFilter, bool isDryRun = false)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new ArgumentException("Connection string must have a value");
            }

            await EnsureSqlDatabaseAsync(connectionString).ConfigureAwait(false);

            var builder = DeployChanges.To
                .SqlDatabase(connectionString)
                .WithScriptNameComparer(new ScriptComparer())
                .WithScripts(new CustomScriptProvider(Assembly.GetExecutingAssembly(), scriptFilter))
                .LogToConsole();

            if (isDryRun)
            {
                builder.WithTransactionAlwaysRollback();
            }
            else
            {
                builder.WithTransaction();
            }

            return builder.Build();
        }

        private static async Task EnsureSqlDatabaseAsync(string connectionString)
        {
            // Transient errors can occur right after DB is created,
            // as it might not be instantly available, hence this retry loop.
            // This is especially an issue when running against an Azure SQL DB.
            var tryCount = 0;
            do
            {
                ++tryCount;
                try
                {
                    EnsureDatabase.For.SqlDatabase(connectionString);
                    return;
                }
                catch (SqlException)
                {
                    if (tryCount > 10)
                        throw;

                    await Task.Delay(256 * tryCount).ConfigureAwait(false);
                }
            }
            while (true);
        }
    }
}
