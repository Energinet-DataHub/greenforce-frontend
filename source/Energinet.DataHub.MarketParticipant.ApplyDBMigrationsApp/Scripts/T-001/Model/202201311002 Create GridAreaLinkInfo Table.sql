SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaLinkInfo](
     [GridLinkId] [uniqueidentifier] NOT NULL,
     [GridAreaId] [uniqueidentifier] NOT NULL,
     [RecordId] [int] IDENTITY(1,1) NOT NULL,
     CONSTRAINT [PK_GridAreaLink] PRIMARY KEY CLUSTERED
         (
          [GridLinkId] ASC
             )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO