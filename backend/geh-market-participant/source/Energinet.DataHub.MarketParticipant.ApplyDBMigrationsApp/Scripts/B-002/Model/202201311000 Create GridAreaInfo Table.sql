SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaInfo](
    [Id] [uniqueidentifier] NOT NULL,
    [RecordId] [int] NOT NULL,
    [Code] [nvarchar](4) NOT NULL,
    [Name] [nvarchar](50) NOT NULL,
    [PriceAreaCode] [nvarchar](50) NOT NULL,
    [Active] [bit] NOT NULL,
    [ActorId] [uniqueidentifier] NULL,
    CONSTRAINT [PK_GridAreaInfo] PRIMARY KEY CLUSTERED
        (
         [Id] ASC
            )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO