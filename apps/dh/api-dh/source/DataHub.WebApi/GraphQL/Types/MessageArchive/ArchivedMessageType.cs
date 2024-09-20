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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.Actor;

namespace Energinet.DataHub.WebApi.GraphQL.Types.MessageArchive;

public class ArchivedMessageType : ObjectType<ArchivedMessageResult>
{
    protected override void Configure(IObjectTypeDescriptor<ArchivedMessageResult> descriptor)
    {
        descriptor.Name("ArchivedMessage");

        descriptor
            .Field(f => f.SenderNumber)
            .Name("sender")
            .Type<ActorType>()
            .Resolve(context => context.DataLoader<ActorByNumberBatchDataLoader>().LoadAsync(
                context.Parent<ArchivedMessageResult>().SenderNumber,
                context.RequestAborted));

        descriptor
            .Field(f => f.ReceiverNumber)
            .Name("receiver")
            .Type<ActorType>()
            .Resolve(context => context.DataLoader<ActorByNumberBatchDataLoader>().LoadAsync(
                context.Parent<ArchivedMessageResult>().ReceiverNumber,
                context.RequestAborted));

        descriptor
            .Field(f => f.DocumentType)
            .Resolve(context => Enum.Parse<DocumentType>(context.Parent<ArchivedMessageResult>().DocumentType));

        descriptor
            .Field("businessTransaction")
            .Resolve(context =>
                Enum.Parse<DocumentType>(context.Parent<ArchivedMessageResult>().DocumentType) switch
                {
                    DocumentType.ConfirmRequestChangeOfSupplier => BusinessTransaction.RSM001,
                    DocumentType.RejectRequestChangeOfSupplier => BusinessTransaction.RSM001,
                    DocumentType.RequestChangeOfSupplier => BusinessTransaction.RSM001,
                    DocumentType.ConfirmRequestReallocateChangeOfSupplier => BusinessTransaction.RSM003,
                    DocumentType.RejectRequestReallocateChangeOfSupplier => BusinessTransaction.RSM003,
                    DocumentType.RequestReallocateChangeOfSupplier => BusinessTransaction.RSM003,
                    DocumentType.GenericNotification => BusinessTransaction.RSM004,
                    DocumentType.ConfirmRequestEndOfSupply => BusinessTransaction.RSM005,
                    DocumentType.RejectRequestEndOfSupply => BusinessTransaction.RSM005,
                    DocumentType.RequestEndOfSupply => BusinessTransaction.RSM005,
                    DocumentType.RejectRequestAccountingPointCharacteristics => BusinessTransaction.RSM006,
                    DocumentType.RequestAccountingPointCharacteristics => BusinessTransaction.RSM006,
                    DocumentType.Acknowledgement => BusinessTransaction.RSM009,
                    DocumentType.NotifyValidatedMeasureData => BusinessTransaction.RSM012,
                    DocumentType.NotifyAggregatedMeasureData => BusinessTransaction.RSM014,
                    DocumentType.RejectRequestValidatedMeasureData => BusinessTransaction.RSM015,
                    DocumentType.RequestValidatedMeasureData => BusinessTransaction.RSM015,
                    DocumentType.RejectRequestAggregatedMeasureData => BusinessTransaction.RSM016,
                    DocumentType.RequestAggregatedMeasureData => BusinessTransaction.RSM016,
                    DocumentType.RejectRequestWholesaleSettlement => BusinessTransaction.RSM017,
                    DocumentType.RequestWholesaleSettlement => BusinessTransaction.RSM017,
                    DocumentType.RejectRequestForReminders => BusinessTransaction.RSM018,
                    DocumentType.ReminderOfMissingMeasureData => BusinessTransaction.RSM018,
                    DocumentType.RequestForReminders => BusinessTransaction.RSM018,
                    DocumentType.NotifyWholesaleServices => BusinessTransaction.RSM019,
                    DocumentType.ConfirmRequestService => BusinessTransaction.RSM020,
                    DocumentType.RejectRequestService => BusinessTransaction.RSM020,
                    DocumentType.RequestService => BusinessTransaction.RSM020,
                    DocumentType.ConfirmRequestChangeAccountingPointCharacteristics => BusinessTransaction.RSM021,
                    DocumentType.RejectRequestChangeAccountingPointCharacteristics => BusinessTransaction.RSM021,
                    DocumentType.RequestChangeAccountingPointCharacteristics => BusinessTransaction.RSM021,
                    DocumentType.AccountingPointCharacteristics => BusinessTransaction.RSM022,
                    DocumentType.ConfirmRequestCancellation => BusinessTransaction.RSM024,
                    DocumentType.RejectRequestCancellation => BusinessTransaction.RSM024,
                    DocumentType.RequestCancellation => BusinessTransaction.RSM024,
                    DocumentType.NotifyCancellation => BusinessTransaction.RSM025,
                    DocumentType.ConfirmRequestChangeCustomerCharacteristics => BusinessTransaction.RSM027,
                    DocumentType.RejectRequestChangeCustomerCharacteristics => BusinessTransaction.RSM027,
                    DocumentType.RequestChangeCustomerCharacteristics => BusinessTransaction.RSM027,
                    DocumentType.CharacteristicsOfACustomerAtAnAP => BusinessTransaction.RSM028,
                    DocumentType.ConfirmRequestChangeBillingMasterData => BusinessTransaction.RSM030,
                    DocumentType.RejectRequestChangeBillingMasterData => BusinessTransaction.RSM030,
                    DocumentType.RequestChangeBillingMasterData => BusinessTransaction.RSM030,
                    DocumentType.NotifyBillingMasterData => BusinessTransaction.RSM031,
                    DocumentType.RejectRequestBillingMasterData => BusinessTransaction.RSM032,
                    DocumentType.RequestBillingMasterData => BusinessTransaction.RSM032,
                    DocumentType.ConfirmRequestChangeOfPricelist => BusinessTransaction.RSM033,
                    DocumentType.RejectRequestChangeOfPricelist => BusinessTransaction.RSM033,
                    DocumentType.RequestChangeOfPricelist => BusinessTransaction.RSM033,
                    DocumentType.NotifyPricelist => BusinessTransaction.RSM034,
                    DocumentType.RejectRequestPricelist => BusinessTransaction.RSM035,
                    DocumentType.RequestPricelist => BusinessTransaction.RSM035,
                });
    }
}
