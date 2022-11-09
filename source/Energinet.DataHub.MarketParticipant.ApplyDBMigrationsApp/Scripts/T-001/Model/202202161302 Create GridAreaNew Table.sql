SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaNew]
(
    [Id]   [uniqueidentifier] NOT NULL,
    [Code] [nvarchar](4)      NOT NULL,
    [Name] [nvarchar](50)     NOT NULL,
    CONSTRAINT [PK_GridAreaNew] PRIMARY KEY CLUSTERED
        (
         [Id] ASC
            ) WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GridAreaNew]
    ADD CONSTRAINT [DF_GridAreaNew_Id] DEFAULT (newid()) FOR [Id]
GO