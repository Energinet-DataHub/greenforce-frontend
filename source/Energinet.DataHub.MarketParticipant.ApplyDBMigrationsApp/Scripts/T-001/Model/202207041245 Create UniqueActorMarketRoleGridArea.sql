CREATE TABLE [dbo].[UniqueActorMarketRoleGridArea]
(
    [Id]                    [uniqueidentifier] NOT NULL,
    [ActorId]               [uniqueidentifier] NOT NULL,
    [MarketRoleFunction]    [int]              NOT NULL,
    [GridAreaId]            [uniqueidentifier] NOT NULL,

    CONSTRAINT PK_UniqueActorMarketRoleGridArea PRIMARY KEY ([Id]),
    CONSTRAINT FK_UniqueActorMarketRoleGridArea_Actor FOREIGN KEY ([ActorId]) REFERENCES [dbo].[ActorInfoNew]([Id]),
    CONSTRAINT FK_UniqueActorMarketRoleGridArea_GridArea FOREIGN KEY ([GridAreaId]) REFERENCES [dbo].[GridAreaNew]([Id]),
    CONSTRAINT UQ_UniqueActorMarketRoleGridArea_MarketRoleFunction_GridAreaId UNIQUE ([MarketRoleFunction], [GridAreaId])
)
GO