ALTER TABLE [dbo].[OrganizationInfo]
    ADD BusinessRegisterIdentifier nvarchar(8) DEFAULT N'',
        Address_StreetName nvarchar(250) NULL,
        Address_Number nvarchar(15) NULL,
        Address_ZipCode nvarchar(15) NULL,
        Address_City nvarchar(50) NULL,
        Address_Country nvarchar(50) DEFAULT N'DK'
GO