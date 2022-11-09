CREATE TABLE [dbo].[OrganizationRoleMeteringType]
(
    [Id]                 [uniqueidentifier] NOT NULL,
    [MeteringTypeId]     [int]              NOT NULL,
    [OrganizationRoleId] [uniqueidentifier] NOT NULL
        CONSTRAINT [PK_OrganizationRoleMeteringType] PRIMARY KEY NONCLUSTERED
            (
             [Id] ASC
                ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO