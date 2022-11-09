CREATE TABLE [dbo].[Contact]
(
    [Id]       [uniqueidentifier] NOT NULL,
    [Category] [int]              NOT NULL,
    [Name]     [nvarchar](250)    NOT NULL,
    [Email]    [nvarchar](250)    NOT NULL,
    [Phone]    [nvarchar](250)    NOT NULL,

    CONSTRAINT PK_Contact PRIMARY KEY ([Id]),
)
GO