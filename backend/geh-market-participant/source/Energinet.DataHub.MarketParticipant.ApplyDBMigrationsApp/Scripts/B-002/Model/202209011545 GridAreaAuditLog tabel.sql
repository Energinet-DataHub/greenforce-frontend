SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GridAreaAuditLogEntry]
(
    [Id]            [int] IDENTITY(1, 1) NOT NULL,
    [UserId]        [uniqueidentifier]   NOT NULL,
    [Timestamp]     [datetimeoffset]     NOT NULL,
    [Field]         [int]                NOT NULL,
    [OldValue]      [nvarchar](MAX)      NOT NULL,
    [NewValue]      [nvarchar](MAX)      NOT NULL,
    [GridAreaId]    [uniqueidentifier]   NOT NULL
        CONSTRAINT [PK_AuditLog_Id] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY],
        CONSTRAINT FK_GridAreaAuditLogEntry_GridAreaId_GridAreaNew FOREIGN KEY ([GridAreaId]) REFERENCES [dbo].[GridAreaNew]([Id])
) ON [PRIMARY]
GO
