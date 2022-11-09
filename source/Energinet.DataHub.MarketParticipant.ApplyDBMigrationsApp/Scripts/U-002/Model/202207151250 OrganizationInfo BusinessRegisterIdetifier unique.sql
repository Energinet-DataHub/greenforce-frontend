ALTER TABLE [dbo].[OrganizationInfo]
ADD CONSTRAINT UQ_OrganizationInfo_BusinessRegisterIdentifier UNIQUE (BusinessRegisterIdentifier)
GO