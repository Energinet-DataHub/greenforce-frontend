ALTER TABLE [dbo].[ActorContact]
ALTER COLUMN [Email] [nvarchar](254)
GO

ALTER TABLE [dbo].[ActorContact]
ALTER COLUMN [Phone] [nvarchar](15) NULL
GO

ALTER TABLE [dbo].[ActorContact]
ADD CONSTRAINT UQ_ActorContact_Categories UNIQUE ([ActorId], [Category])
GO
