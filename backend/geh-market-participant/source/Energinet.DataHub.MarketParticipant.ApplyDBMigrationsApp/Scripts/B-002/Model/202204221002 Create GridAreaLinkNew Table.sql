SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaLinkNew](
                                        [Id] [uniqueidentifier] NOT NULL,
                                        [GridAreaId] [uniqueidentifier] NOT NULL,
                                        CONSTRAINT [PK_GridAreaLinkNew] PRIMARY KEY CLUSTERED
                                            (
                                             [Id] ASC
                                                )
                                            WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                                        CONSTRAINT FK_GridAreaId_GridAreaNew FOREIGN KEY ([GridAreaId]) REFERENCES [dbo].[GridAreaNew]([Id])

) ON [PRIMARY]
GO