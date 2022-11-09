--Insert new actors
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'9a7bad3f-ac74-4a19-b0dc-086f78d91ba5', N'8200000007692', 1, N'DDQ', 1, N'Wholesale_DDQ_1')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'e3a8d01a-d03d-4800-abf8-88e6b67512d7', N'8200000007708', 1, N'DDQ', 1, N'Wholesale_DDQ_2')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'db81ad67-b623-4fd7-8c6e-d8f5fd8470f2', N'8200000007715', 1, N'DDK', 1, N'Wholesale_DDK_1')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'b3983948-dab9-467c-9c1a-06aecf1ca599', N'8200000007722', 1, N'DDK', 1, N'Wholesale_DDK_2')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'd50c00b0-b8d2-45af-892c-3a92f840e163', N'8200000007739', 1, N'DDM,MDR', 1, N'Wholesale_DDM_MDR_805')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'4c91fbb2-8271-4bb9-859a-a85f21f96f61', N'8200000007746', 1, N'DDM,MDR', 1, N'Wholesale_DDM_MDR_806')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'f18523bc-985a-4821-bc8e-4c3b7ecf3a84', N'44X-00000000004B', 2, N'DDX', 1, N'NBS_Esett')
    

GO

--Create Grid Areas for Openminds
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'89801ec1-af12-46d9-b044-05a004a0d46c', 39, N'805', N'Wholesale_GA1', N'DK1', 1, N'd50c00b0-b8d2-45af-892c-3a92f840e163')
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'696E5DBA-B028-4A5D-B8B4-E0C01AFD3CFE', 40, N'806', N'Wholesale_GA2', N'DK2', 1, N'4c91fbb2-8271-4bb9-859a-a85f21f96f61')

--Grid Area Links for Openminds
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'e446e480-2ce6-44f6-9d45-bd891d4b3176', N'89801ec1-af12-46d9-b044-05a004a0d46c', 39)
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'4f43b006-3cdc-4a2a-afa2-3e29b4bbef47', N'696E5DBA-B028-4A5D-B8B4-E0C01AFD3CFE', 40)

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO