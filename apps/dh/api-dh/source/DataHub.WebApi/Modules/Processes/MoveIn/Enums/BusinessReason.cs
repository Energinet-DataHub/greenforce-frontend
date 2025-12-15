namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Enums;

public enum BusinessReason
{
    /// <summary>
    /// Customer move-in (E65) - Almindelig tilflytning.
    /// </summary>
    E65,

    /// <summary>
    /// Secondary move-in (D29) - Sekundær tilflytning.
    /// </summary>
    D29,

    /// <summary>
    /// Change of energy supplier (E03) - Skift af elleverandør.
    /// </summary>
    E03,
}
