UPDATE [dbo].[OrganizationInfo]
SET Address_Country = N'DK'
GO

UPDATE [dbo].[OrganizationInfo]
SET BusinessRegisterIdentifier = N''
GO

ALTER TABLE [dbo].[OrganizationInfo]
    ALTER COLUMN Address_Country nvarchar(50) NOT NULL

ALTER TABLE [dbo].[OrganizationInfo]
    ALTER COLUMN BusinessRegisterIdentifier nvarchar(8) NOT NULL
GO