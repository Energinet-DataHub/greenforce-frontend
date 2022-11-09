SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[GridArea]
AS
SELECT        RecordId, Code, Name, Active, ActorId, PriceAreaCode, Id
FROM            dbo.GridAreaInfo
GO