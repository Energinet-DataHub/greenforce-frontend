SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrganizationInfo](
    [Id] [uniqueidentifier] NOT NULL,
    [Name] [nvarchar](max) NOT NULL,
    [Gln] [nvarchar](50) NOT NULL
    CONSTRAINT [PK_OrganizationInfo] PRIMARY KEY CLUSTERED
        (
         [Id] ASC
            )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO