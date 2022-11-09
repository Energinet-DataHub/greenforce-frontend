SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[GridAreaLink]
AS
SELECT        GridLinkId, GridAreaId
FROM            dbo.GridAreaLinkInfo
GO