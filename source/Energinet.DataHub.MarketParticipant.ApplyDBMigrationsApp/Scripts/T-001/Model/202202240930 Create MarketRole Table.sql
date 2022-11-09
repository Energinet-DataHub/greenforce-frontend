CREATE TABLE [dbo].[MarketRole]
(
    [Id] [uniqueidentifier] NOT NULL,
    [OrganizationRoleId] [uniqueidentifier] NOT NULL,
    [Function] [int] NOT NULL,

	CONSTRAINT PK_MarketRole PRIMARY KEY ([Id]),
	CONSTRAINT FK_OrganizationRoleId_OrganizationRole FOREIGN KEY ([OrganizationRoleId]) REFERENCES [dbo].[OrganizationRole]([Id])
)
GO