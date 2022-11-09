INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'26d28580-c753-4d2a-a659-00d65ba53989', N'5790000681075', 1, N'DDM', 1, N'Netselskabet Elværk A/S - 042')

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'2db13fd4-ada8-44db-8d89-49084e2d22eb', N'5790000681358', 1, N'DDM', 1, N'Netselskabet Elværk A/S - 331')

--Add the new grid Areas
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'11B96409-1236-4341-87C8-8D329DE27102', 37, N'042', N'Netselskabet Elværk A/S', N'DK1', 1,
        N'26d28580-c753-4d2a-a659-00d65ba53989')

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'2C48E372-DA15-4488-B19A-A7A8BAEA17D5', 38, N'331', N'Netselskabet Elværk A/S', N'DK1', 1,
        N'2db13fd4-ada8-44db-8d89-49084e2d22eb')
GO

--Add Grid Area Links
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'E7167EB8-0469-4786-A2B3-AD48A96C1283', N'11B96409-1236-4341-87C8-8D329DE27102', 37)

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'AAC69ECF-1D4F-4BDE-8125-49D42AD8ACF7', N'2C48E372-DA15-4488-B19A-A7A8BAEA17D5', 38)

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO