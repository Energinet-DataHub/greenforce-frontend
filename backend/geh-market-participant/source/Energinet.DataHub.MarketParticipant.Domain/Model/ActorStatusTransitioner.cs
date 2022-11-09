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
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    internal sealed class ActorStatusTransitioner
    {
        private ActorStatus _status;

        public ActorStatusTransitioner()
        {
            _status = ActorStatus.New;
        }

        public ActorStatusTransitioner(ActorStatus status)
        {
            _status = status;
        }

        public ActorStatus Status
        {
            get => _status;
            set
            {
                switch (value)
                {
                    case ActorStatus.New:
                        New();
                        break;
                    case ActorStatus.Active:
                        Activate();
                        break;
                    case ActorStatus.Inactive:
                        Deactivate();
                        break;
                    case ActorStatus.Passive:
                        SetAsPassive();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(value));
                }
            }
        }

        public void Activate()
        {
            EnsureCorrectState(ActorStatus.Active, ActorStatus.New);
            _status = ActorStatus.Active;
        }

        public void Deactivate()
        {
            EnsureCorrectState(ActorStatus.Inactive, ActorStatus.Active, ActorStatus.Passive, ActorStatus.New);
            _status = ActorStatus.Inactive;
        }

        public void SetAsPassive()
        {
            EnsureCorrectState(ActorStatus.Passive, ActorStatus.Active, ActorStatus.New);
            _status = ActorStatus.Passive;
        }

        private void New()
        {
            EnsureCorrectState(ActorStatus.New, ActorStatus.New);
            _status = ActorStatus.New;
        }

        private void EnsureCorrectState(ActorStatus targetState, params ActorStatus[] allowedStates)
        {
            if (!allowedStates.Contains(_status) && targetState != _status)
            {
                throw new ValidationException($"Cannot change state from {_status} to {targetState}.");
            }
        }
    }
}
