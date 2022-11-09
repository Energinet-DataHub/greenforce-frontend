--Insert new actors
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'39e3cf6e-d1aa-4f56-a293-c81626643538', N'8200000007692', 1, N'DDQ', 1, N'Wholesale_DDQ_1')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'66c7f282-633f-441b-8849-451302187b16', N'8200000007708', 1, N'DDQ', 1, N'Wholesale_DDQ_2')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'aace558e-b741-4270-af83-7c71fe023843', N'8200000007715', 1, N'DDK', 1, N'Wholesale_DDK_1')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'b4df5878-904a-4304-8a0c-58e6f1efa9c0', N'8200000007722', 1, N'DDK', 1, N'Wholesale_DDK_2')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'9a3ea153-8b4f-45c1-ba39-832f8b236db4', N'8200000007739', 1, N'DDM,MDR', 1, N'Wholesale_DDM_MDR_805')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'de9bfd13-eb7d-4a48-ba76-e7cdb0dbf272', N'8200000007746', 1, N'DDM,MDR', 1, N'Wholesale_DDM_MDR_806')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'6b9b6e72-d180-40da-a7c3-fdc52fcc2adf', N'44X-00000000004B', 2, N'DDX', 1, N'NBS_Esett')
    

GO

--Create Grid Areas for Openminds
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'E7C232B3-B0B9-4B7E-953F-70607BD12FD9', 39, N'805', N'Wholesale_GA1', N'DK1', 1, N'9a3ea153-8b4f-45c1-ba39-832f8b236db4')
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'6C4F73B3-0F4A-4BB2-BFA0-634854148AE6', 40, N'806', N'Wholesale_GA2', N'DK2', 1, N'de9bfd13-eb7d-4a48-ba76-e7cdb0dbf272')

--Grid Area Links for Openminds
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'B91CC198-756C-46E4-928A-18B47BCE21B7', N'E7C232B3-B0B9-4B7E-953F-70607BD12FD9', 39)
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'0E1F9CA0-C6AE-4E47-A2DC-44E96E77716A', N'6C4F73B3-0F4A-4BB2-BFA0-634854148AE6', 40)

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO