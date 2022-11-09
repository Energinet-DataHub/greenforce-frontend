ALTER TABLE [dbo].[ActorInfoNew]
    ALTER COLUMN [ActorId] [uniqueidentifier] NULL
GO

ALTER TABLE [dbo].[ActorInfoNew]
    DROP CONSTRAINT [UQ_ActorId]
GO
