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
using System.Collections.Generic;
using System.Globalization;
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Common
{
    public sealed class MockedGln
    {
        private static readonly Random _rng = new();
        private readonly string _gln = CreateRandomGln();

#pragma warning disable CA1062, CA2225, CA5394
        public static implicit operator ActorNumber(MockedGln mock)
        {
            return ActorNumber.Create(mock._gln);
        }

        public static implicit operator ActorNumberEventData(MockedGln mock)
        {
            return new ActorNumberEventData(mock._gln, ActorNumberType.Gln);
        }

        public static implicit operator ActorNumberDto(MockedGln mock)
        {
            return new ActorNumberDto(mock._gln);
        }

        public static implicit operator string(MockedGln mock)
        {
            return mock._gln;
        }

        public override string ToString()
        {
            return _gln;
        }

        private static IEnumerable<int> GetRandomDigits()
        {
            for (var i = 0; i < 12; i++)
            {
                yield return _rng.Next(0, 10);
            }
        }
#pragma warning restore

        private static string CreateRandomGln()
        {
            string location;

            lock (_rng)
            {
                location = string.Concat(GetRandomDigits());
            }

            for (var checkDigit = 0; checkDigit < 10; checkDigit++)
            {
                var gln = location + checkDigit;

                if (CalculateChecksum(gln) == checkDigit)
                    return gln;
            }

            return string.Empty;
        }

        private static int CalculateChecksum(string glnNumber)
        {
            var sumOfOddNumbers = 0;
            var sumOfEvenNumbers = 0;

            for (var i = 1; i < glnNumber.Length; i++)
            {
                var currentNumber = int.Parse(glnNumber[(i - 1)..i], CultureInfo.InvariantCulture);

                if (i % 2 == 0)
                    sumOfEvenNumbers += currentNumber;
                else
                    sumOfOddNumbers += currentNumber;
            }

            var sum = (sumOfEvenNumbers * 3) + sumOfOddNumbers;

            var equalOrHigherMultipleOf = (int)(Math.Ceiling(sum / 10.0) * 10);
            return equalOrHigherMultipleOf - sum;
        }
    }
}
