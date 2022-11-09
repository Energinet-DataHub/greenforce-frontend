SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DomainEvent]
(
    [Id]            [int] IDENTITY(1, 1) NOT NULL,
    [EntityId]      [uniqueidentifier]   NOT NULL,
    [EntityType]    [nvarchar](32)       NOT NULL,
    [IsSent]        [bit]                NOT NULL,
    [Timestamp]     [datetimeoffset]     NOT NULL,
    [Event]         [nvarchar](max)      NOT NULL,
    [EventTypeName] [nvarchar](128)      NOT NULL
        CONSTRAINT [PK_DomainEvent_Id] PRIMARY KEY CLUSTERED
            (
             [Id] ASC
                ) WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
