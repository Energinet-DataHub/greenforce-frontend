using Energinet.DataHub.WebApi.Clients.ActorConversation.v1;

namespace Energinet.DataHub.WebApi.Modules.ActorConversation.Types;

[ObjectType<ConversationMessage>]
public static partial class ConversationMessageType
{
    static partial void Configure(IObjectTypeDescriptor<ConversationMessage> descriptor)
    {
        descriptor.Name("ChargeLinkPeriod");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => new Interval(f.From, f.To)).Name("interval");
        descriptor.Field(f => f.Factor).Name("amount");
    }
}
