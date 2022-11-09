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
using System.Linq;

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public sealed record EicActorNumber : ActorNumber
    {
        private EicActorNumber(string value)
            : base(value) { }

        public override ActorNumberType Type => ActorNumberType.Eic;

        public static bool IsValid(string eic)
        {
            ArgumentNullException.ThrowIfNull(eic);

            return LengthIsValid(eic)
                   && ValidateTwoCharacterIssuingNumber(eic)
                   && ValidateObjectTypeCharacter(eic)
                   && ValidateTwelveDigitsUpperCaseCharacters(eic)
                   && ValidateCheckCharacter(eic);
        }

        internal static bool TryCreate(string value, [NotNullWhen(true)] out EicActorNumber? eicActorNumber)
        {
            var valid = IsValid(value);
            eicActorNumber = valid ? new EicActorNumber(value) : null;
            return valid;
        }

        private static bool LengthIsValid(string energyIdentificationCode)
        {
            return energyIdentificationCode.Length == 16;
        }

        private static bool ValidateTwoCharacterIssuingNumber(string energyIdentificationCode)
        {
            return energyIdentificationCode[..2].All(char.IsNumber);
        }

        private static bool ValidateObjectTypeCharacter(string energyIdentificationCode)
        {
            return energyIdentificationCode.Substring(2, 1).All(char.IsLetter);
        }

        private static bool ValidateTwelveDigitsUpperCaseCharacters(string energyIdentificationCode)
        {
            return energyIdentificationCode
                .Substring(3, 12)
                .All(c =>
                    c is '-'
                    || char.IsDigit(c)
                    || (char.IsLetterOrDigit(c) && char.IsUpper(c)));
        }

        private static bool ValidateCheckCharacter(string energyIdentificationCode)
        {
            return char.IsLetterOrDigit(energyIdentificationCode[^1]);
        }
    }
}
