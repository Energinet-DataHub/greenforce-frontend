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
using System.Reflection;
using DbUp;
using DbUp.Engine;
using DbUp.Helpers;

namespace Energinet.DataHub.MarketParticipant.ApplyDBMigrationsApp.Helpers
{
    /// <summary>
    /// Updates with model and seed scripts according to normal journaling.
    /// Always runs test scripts.
    /// </summary>
    public static class DefaultUpgrader
    {
        public static DatabaseUpgradeResult Upgrade(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new ArgumentException("Connection string must have a value");
            }

            EnsureDatabase.For.SqlDatabase(connectionString);

            const string scriptsTest = "Scripts.Test.";

            var modelUpgrader = DeployChanges.To
                .SqlDatabase(connectionString)
                .WithScriptNameComparer(new ScriptComparer())
                .WithScripts(new CustomScriptProvider(
                    Assembly.GetExecutingAssembly(),
                    x => !x.Contains(scriptsTest, StringComparison.Ordinal)))
                .LogToConsole()
                .Build();
            var result = modelUpgrader.PerformUpgrade();

            if (result.Successful)
            {
                var testDataUpgrader =
                    DeployChanges.To
                        .SqlDatabase(connectionString)
                        .WithScriptsAndCodeEmbeddedInAssembly(
                            Assembly.GetExecutingAssembly(),
                            x => x.Contains(scriptsTest, StringComparison.Ordinal))
                        .JournalTo(new NullJournal())
                        .LogToConsole()
                        .Build();
                result = testDataUpgrader.PerformUpgrade();
            }

            return result;
        }
    }
}
