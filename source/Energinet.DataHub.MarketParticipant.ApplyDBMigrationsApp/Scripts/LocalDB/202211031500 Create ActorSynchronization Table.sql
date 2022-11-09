CREATE TABLE [dbo].[ActorSynchronization]
(
    [Id]             [int] IDENTITY(1, 1),
    [OrganizationId] [uniqueidentifier] NOT NULL,
    [ActorId]        [uniqueidentifier] NOT NULL
)
GO
