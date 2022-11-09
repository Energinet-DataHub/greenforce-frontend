ALTER TABLE [dbo].[ActorInfoNew]
    DROP COLUMN [GridAreaId]
GO

CREATE TABLE [dbo].[GridAreaActorInfoLink]
(
    [Id]             [uniqueidentifier] NOT NULL,
    [GridAreaId]     [uniqueidentifier] NOT NULL,
    [ActorInfoId]    [uniqueidentifier] NOT NULL,

    CONSTRAINT PK_GridAreaActorInfoLink PRIMARY KEY ([Id]),
    CONSTRAINT FK_GridAreaId_GridArea_GridAreaActorInfoLink FOREIGN KEY ([GridAreaId]) REFERENCES [dbo].[GridAreaNew]([Id]),
    CONSTRAINT FK_ActorInfoId_ActorInfo_GridAreaActorInfoLink FOREIGN KEY ([ActorInfoId]) REFERENCES [dbo].[ActorInfoNew]([Id])
)
GO
