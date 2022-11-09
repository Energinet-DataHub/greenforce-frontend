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
    internal sealed class OrganizationStatusTransitioner
    {
        private OrganizationStatus _status;

        public OrganizationStatusTransitioner()
        {
            _status = OrganizationStatus.New;
        }

        public OrganizationStatusTransitioner(OrganizationStatus status)
        {
            _status = status;
        }

        public OrganizationStatus Status
        {
            get => _status;
            set
            {
                switch (value)
                {
                    case OrganizationStatus.New:
                        New();
                        break;
                    case OrganizationStatus.Active:
                        Activate();
                        break;
                    case OrganizationStatus.Blocked:
                        Blocked();
                        break;
                    case OrganizationStatus.Deleted:
                        Delete();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(value));
                }
            }
        }

        public void Activate()
        {
            EnsureCorrectState(OrganizationStatus.Active, OrganizationStatus.New, OrganizationStatus.Blocked);
            _status = OrganizationStatus.Active;
        }

        public void Blocked()
        {
            EnsureCorrectState(OrganizationStatus.Blocked, OrganizationStatus.New, OrganizationStatus.Active);
            _status = OrganizationStatus.Blocked;
        }

        public void Delete()
        {
            EnsureCorrectState(OrganizationStatus.Deleted, OrganizationStatus.New, OrganizationStatus.Active, OrganizationStatus.Blocked);
            _status = OrganizationStatus.Deleted;
        }

        private void New()
        {
            EnsureCorrectState(OrganizationStatus.New, OrganizationStatus.New);
            _status = OrganizationStatus.New;
        }

        private void EnsureCorrectState(OrganizationStatus targetState, params OrganizationStatus[] allowedStates)
        {
            if (!allowedStates.Contains(_status) && targetState != _status)
            {
                throw new ValidationException($"Cannot change state from {_status} to {targetState}.");
            }
        }
    }
}
