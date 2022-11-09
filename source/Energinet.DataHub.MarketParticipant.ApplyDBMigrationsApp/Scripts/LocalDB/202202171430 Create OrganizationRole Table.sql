CREATE TABLE [dbo].[OrganizationRole]
(
    [Id] [uniqueidentifier] NOT NULL,
    [OrganizationId] [uniqueidentifier] NOT NULL,
    [BusinessRole] [int] NOT NULL,
    [Status] [int] NOT NULL,

	CONSTRAINT PK_OrganizationRole PRIMARY KEY ([Id]),
	CONSTRAINT FK_OrganizationId_OrganizationInfo FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[OrganizationInfo]([Id])
)
GO