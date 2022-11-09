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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Validation.Rules;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using FluentValidation;
namespace Energinet.DataHub.MarketParticipant.Application.Validation
{
    public sealed class CreateActorCommandRuleSet : AbstractValidator<CreateActorCommand>
    {
        public CreateActorCommandRuleSet()
        {
            RuleFor(command => command.OrganizationId)
                .NotEmpty();

            RuleFor(command => command.Actor)
                .NotNull()
                .ChildRules(validator =>
                {
                    validator
                        .RuleFor(actor => actor.ActorNumber)
                        .SetValidator(new GlobalLocationNumberValidationRule<CreateActorDto>())
                        .When(i => string.IsNullOrWhiteSpace(i.ActorNumber.Value) || i.ActorNumber.Value.Length <= 13);

                    validator
                        .RuleFor(actor => actor.ActorNumber)
                        .SetValidator(new EnergyIdentificationCodeValidationRule<CreateActorDto>())
                        .When(i => string.IsNullOrWhiteSpace(i.ActorNumber.Value) || i.ActorNumber.Value.Length >= 14);

                    validator
                        .RuleForEach(actor => actor.MarketRoles)
                        .ChildRules(gridAreaValidator =>
                            gridAreaValidator
                                .RuleFor(x => x.GridAreas)
                                .NotEmpty());

                    validator
                        .RuleFor(actor => actor.MarketRoles)
                        .NotNull()
                        .ChildRules(rolesValidator =>
                        {
                            rolesValidator
                                .RuleForEach(x => x)
                                .NotNull()
                                .ChildRules(roleValidator =>
                                {
                                    roleValidator
                                        .RuleFor(x => x.EicFunction)
                                        .NotEmpty()
                                        .IsEnumName(typeof(EicFunction), false);
                                });
                        });

                    validator
                        .RuleForEach(actor => actor.MarketRoles)
                        .ChildRules(inlineValidator =>
                        {
                            inlineValidator
                                .RuleForEach(m => m.GridAreas)
                                .ChildRules(validationRules =>
                                {
                                    validationRules
                                        .RuleFor(r => r.MeteringPointTypes)
                                        .NotEmpty()
                                        .ChildRules(v =>
                                            v.RuleForEach(r => r)
                                                .Must(x => Enum.TryParse<MeteringPointType>(x, true, out _)));
                                });
                        });
                });
        }
    }
}
