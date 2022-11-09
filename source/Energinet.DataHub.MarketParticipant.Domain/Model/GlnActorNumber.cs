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
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public sealed record GlnActorNumber : ActorNumber
    {
        private GlnActorNumber(string value)
            : base(value) { }

        public override ActorNumberType Type => ActorNumberType.Gln;

        public static bool IsValid(string gln)
        {
            ArgumentNullException.ThrowIfNull(gln);

            return LengthIsValid(gln) && AllCharsAreDigits(gln) && CheckSumIsValid(gln);
        }

        internal static bool TryCreate(string value, [NotNullWhen(true)] out GlnActorNumber? gln)
        {
            var valid = IsValid(value);
            gln = valid ? new GlnActorNumber(value) : null;
            return valid;
        }

        private static bool LengthIsValid(string glnNumber)
        {
            return glnNumber.Length == 13;
        }

        private static bool AllCharsAreDigits(string glnNumber)
        {
            return glnNumber.All(char.IsDigit);
        }

        private static bool CheckSumIsValid(string glnNumber)
        {
            var definedChecksumDigit = Parse(glnNumber[^1..]);
            var calculatedChecksum = CalculateChecksum(glnNumber);
            return calculatedChecksum == definedChecksumDigit;
        }

        private static int CalculateChecksum(string glnNumber)
        {
            var sumOfOddNumbers = 0;
            var sumOfEvenNumbers = 0;

            for (var i = 1; i < glnNumber.Length; i++)
            {
                var currentNumber = Parse(glnNumber[(i - 1)..i]);

                if (IsEvenNumber(i))
                    sumOfEvenNumbers += currentNumber;
                else
                    sumOfOddNumbers += currentNumber;
            }

            var sum = (sumOfEvenNumbers * 3) + sumOfOddNumbers;

            var equalOrHigherMultipleOf = (int)(Math.Ceiling(sum / 10.0) * 10);
            return equalOrHigherMultipleOf - sum;
        }

        private static int Parse(string input)
        {
            return int.Parse(input, NumberStyles.Integer, NumberFormatInfo.InvariantInfo);
        }

        private static bool IsEvenNumber(int index)
        {
            return index % 2 == 0;
        }
    }
}
