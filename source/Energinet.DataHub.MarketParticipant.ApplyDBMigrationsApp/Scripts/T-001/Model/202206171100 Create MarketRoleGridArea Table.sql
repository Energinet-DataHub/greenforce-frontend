SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MarketRoleGridArea]
(
    [Id]                [uniqueidentifier] NOT NULL,
    [MarketRoleId]      [uniqueidentifier] NOT NULL,
    [GridAreaId]        [uniqueidentifier] NOT NULL,

    CONSTRAINT [PK_MarketRoleGridArea] PRIMARY KEY CLUSTERED ([Id] ASC) 
        WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],

    CONSTRAINT FK_MarketRoleId_MarketRole FOREIGN KEY ([MarketRoleId]) REFERENCES [dbo].[MarketRole]([Id]),
    CONSTRAINT FK_GridAreaId_GridArea FOREIGN KEY ([GridAreaId]) REFERENCES [dbo].[GridAreaNew]([Id])

    )
GO