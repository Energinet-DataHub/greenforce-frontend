SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActorInfo](
    [Id] [uniqueidentifier] NOT NULL,
    [IdentificationNumber] [nvarchar](50) NOT NULL,
    [IdentificationType] [int] NOT NULL,
    [Roles] [nvarchar](max) NOT NULL,
    [Active] [bit] NOT NULL,
    [Name] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_ActorInfo] PRIMARY KEY CLUSTERED
        (
            [Id] ASC
        ) WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO