ALTER TABLE [dbo].[Contact]
ALTER COLUMN [Email] [nvarchar](254)
GO

ALTER TABLE [dbo].[Contact]
ALTER COLUMN [Phone] [nvarchar](15) NULL
GO

ALTER TABLE [dbo].[Contact]
ADD [OrganizationId] [uniqueidentifier] NOT NULL
CONSTRAINT FK_OrganizationId_Contact_OrganizationInfo FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[OrganizationInfo]([Id])
CONSTRAINT UQ_Categories UNIQUE ([OrganizationId], [Category])
GO
