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
using Energinet.DataHub.MarketParticipant.Application.Commands.Contact;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using FluentValidation;

namespace Energinet.DataHub.MarketParticipant.Application.Validation
{
    public sealed class CreateActorContactCommandRuleSet : AbstractValidator<CreateActorContactCommand>
    {
        public CreateActorContactCommandRuleSet()
        {
            RuleFor(command => command.OrganizationId)
                .NotEmpty();

            RuleFor(command => command.ActorId)
                .NotEmpty();

            RuleFor(command => command.Contact)
                .NotNull()
                .ChildRules(validator =>
                {
                    validator
                        .RuleFor(contact => contact.Name)
                        .NotEmpty()
                        .Length(1, 250);

                    validator
                        .RuleFor(contact => contact.Category)
                        .Must(category => Enum.TryParse<ContactCategory>(category, true, out _));

                    validator
                        .RuleFor(contact => contact.Email)
                        .NotEmpty()
                        .Length(1, 254);

                    validator
                        .RuleFor(contact => contact.Phone)
                        .Length(1, 15)
                        .When(contact => contact.Phone != null);
                });
        }
    }
}
