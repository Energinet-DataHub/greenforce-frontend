SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaMeteringPointType]
(
    [Id]                    [uniqueidentifier] NOT NULL,
    [MarketRoleGridAreaId]  [uniqueidentifier] NOT NULL,
    [MeteringPointTypeId]   [INT] NOT NULL,

    CONSTRAINT [PK_GridAreaMeteringPointType] PRIMARY KEY CLUSTERED ([Id] ASC) 
        WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],

    CONSTRAINT FK_MarketRoleGridAreaId_MarketRoleGridArea FOREIGN KEY ([MarketRoleGridAreaId]) REFERENCES [dbo].[MarketRoleGridArea]([Id])
)
GO