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
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Common
{
    public static class MockedBusinessRegisterIdentifier
    {
        private static readonly object _key = new object();
        private static int _no;

        public static BusinessRegisterIdentifier New()
        {
            lock (_key)
            {
                if (_no == 0)
                {
                    try
                    {
                        var connectionString = new MarketParticipantDatabaseManager().ConnectionString;

                        const string query = @"SELECT TOP 1 [BusinessRegisterIdentifier]
                        FROM  [dbo].[OrganizationInfo]
                        ORDER BY [BusinessRegisterIdentifier] DESC";

                        using var connection = new SqlConnection(connectionString);
                        connection.Open();

                        using var command = new SqlCommand(query, connection);

                        using var reader = command.ExecuteReader();

                        while (reader.Read())
                        {
                            var record = (IDataRecord)reader;

                            if (int.TryParse(record.GetString(0), out var no))
                            {
                                _no = no;
                            }
                        }
                    }
#pragma warning disable CA1031
                    catch (Exception)
#pragma warning restore CA1031
                    {
                        // ignored
                    }
                    finally
                    {
                        if (_no == 0)
                            _no = 10000000;
                    }
                }

                ++_no;
                return new(_no.ToString(CultureInfo.InvariantCulture));
            }
        }
    }
}
