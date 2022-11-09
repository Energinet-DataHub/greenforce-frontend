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

using System.Globalization;
using Energinet.DataHub.MarketParticipant.Application.Commands.GridArea;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using FluentValidation;

namespace Energinet.DataHub.MarketParticipant.Application.Validation
{
    public sealed class CreateGridAreaCommandRuleSet : AbstractValidator<CreateGridAreaCommand>
    {
        public CreateGridAreaCommandRuleSet()
        {
            RuleFor(command => command.GridArea)
                .NotNull()
                .ChildRules(validator =>
                {
                    validator
                        .RuleFor(gridArea => gridArea.Name)
                        .NotEmpty()
                        .Length(1, 50);

                    validator
                        .RuleFor(gridArea => gridArea.Code)
                        .NotEmpty()
                        .Length(1, 3)
                        .Must(code => int.TryParse(code, NumberStyles.None, CultureInfo.InvariantCulture, out _));

                    validator
                        .RuleFor(gridArea => gridArea.PriceAreaCode)
                        .NotNull()
                        .IsEnumName(typeof(PriceAreaCode), false);
                });
        }
    }
}
