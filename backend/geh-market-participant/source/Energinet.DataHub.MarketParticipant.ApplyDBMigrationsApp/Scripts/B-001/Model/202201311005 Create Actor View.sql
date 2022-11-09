SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[Actor]
AS
SELECT        IdentificationNumber, IdentificationType, Roles, Active, Id
FROM            dbo.ActorInfo
GO