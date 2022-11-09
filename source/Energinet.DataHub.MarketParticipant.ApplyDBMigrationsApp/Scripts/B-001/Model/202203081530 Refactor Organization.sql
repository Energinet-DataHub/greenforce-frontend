ALTER TABLE [dbo].[OrganizationInfo]
    DROP CONSTRAINT [UNIQUE_GLN]
GO

ALTER TABLE [dbo].[OrganizationInfo]
    DROP COLUMN [Gln], [ActorId]
GO

DROP TABLE [dbo].[OrganizationRoleMeteringType]
GO

DROP TABLE [dbo].[MarketRole]
GO

DROP TABLE [dbo].[OrganizationRole]
GO

CREATE TABLE [dbo].[ActorInfoNew]
(
    [Id]             [uniqueidentifier] NOT NULL,
    [OrganizationId] [uniqueidentifier] NOT NULL,
    [ActorId]        [uniqueidentifier] NOT NULL,
    [Gln]            [nvarchar](50)     NOT NULL,
    [Status]         [int]              NOT NULL,
    [GridAreaId]     [uniqueidentifier] NULL,

    CONSTRAINT PK_ActorInfoNew PRIMARY KEY ([Id]),
    CONSTRAINT FK_OrganizationId_OrganizationInfo FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[OrganizationInfo]([Id]),
    CONSTRAINT UQ_ActorId UNIQUE ([ActorId])
)
GO

CREATE TABLE [dbo].[MarketRole]
(
    [Id]          [uniqueidentifier] NOT NULL,
    [ActorInfoId] [uniqueidentifier] NOT NULL,
    [Function]    [int]              NOT NULL,

    CONSTRAINT PK_MarketRole PRIMARY KEY ([Id]),
    CONSTRAINT FK_ActorInfoId_ActorInfo_MarketRole FOREIGN KEY ([ActorInfoId]) REFERENCES [dbo].[ActorInfoNew]([Id])
)
GO

CREATE TABLE [dbo].[ActorInfoMeteringType]
(
    [Id]             [uniqueidentifier] NOT NULL,
    [MeteringTypeId] [int]              NOT NULL,
    [ActorInfoId]    [uniqueidentifier] NOT NULL,

    CONSTRAINT PK_ActorInfoMeteringType PRIMARY KEY ([Id]),
    CONSTRAINT FK_ActorInfoId_ActorInfo_MeteringType FOREIGN KEY ([ActorInfoId]) REFERENCES [dbo].[ActorInfoNew]([Id])
)
GO