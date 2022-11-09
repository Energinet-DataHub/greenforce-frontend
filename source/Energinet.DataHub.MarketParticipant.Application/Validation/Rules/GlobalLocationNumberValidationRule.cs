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

using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using FluentValidation;
using FluentValidation.Validators;

namespace Energinet.DataHub.MarketParticipant.Application.Validation.Rules
{
    public sealed class GlobalLocationNumberValidationRule<T> : PropertyValidator<T, ActorNumberDto?>
    {
        public override string Name => "GlobalLocationNumberValidation";

        public override bool IsValid(ValidationContext<T> context, ActorNumberDto? value)
        {
            return !string.IsNullOrEmpty(value?.Value) && GlnActorNumber.IsValid(value.Value);
        }

        protected override string GetDefaultMessageTemplate(string errorCode)
        {
            return "'{PropertyName}' must be a valid GLN or EIC.";
        }
    }
}
