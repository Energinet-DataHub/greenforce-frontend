UPDATE ActorInfo
SET Id = 'e0a90bab-0029-402b-81dd-eb46c9e4db62'
WHERE Id = '81ad2de5-57d5-48e3-83dc-35f3488afa6f'
GO

UPDATE GridAreaInfo
SET
    ActorId = 'e0a90bab-0029-402b-81dd-eb46c9e4db62'
WHERE ActorId = '81ad2de5-57d5-48e3-83dc-35f3488afa6f'
GO

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'3437964d-ebaa-448a-abfd-eb589228f0e9', N'5790001088460', 1, N'DDM', 1, N'Nakskov Elnet A/S')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'ec91ee4b-5081-4f2d-8118-1bd8694e36ba', N'5790001095390', 1, N'DDQ', 1, N'SEAS-NVE Strømmen')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'a08bf5d4-e9af-46cd-94e3-fdb87ffd7a21', N'5790002263057', 1, N'DDQ', 1, N'CUBS A//S')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'9986c70f-a723-41b7-b8c7-6ba4c9b8535e', N'8200000007654', 1, N'DDQ', 1, N'Whitelabels')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'add5bf67-9f24-4ebb-94a6-22dfc1e465cf', N'5790001686758', 1, N'DDK', 1, N'Modstrøm Danmark A/S')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'51ee201e-5fe8-4f5a-8125-49a57bcfa83e', N'5790002194498', 1, N'DDQ', 1, N'HOFOR Energiproduktion A/S')
GO

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'8a8d565b-f122-445c-ba28-eeec3afae608', 33, N'853', N'Nakskov', N'DK1', 1, N'3437964d-ebaa-448a-abfd-eb589228f0e9')

--Grid Area Links
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'073fb26a-b29d-4083-9a78-3b346e3db547', N'8a8d565b-f122-445c-ba28-eeec3afae608', 33)
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO