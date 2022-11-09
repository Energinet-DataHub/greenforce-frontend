INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'bb71f037-692d-4bcd-9c79-741ad90e33ca', N'8100000000200', 1, N'DDM,MDR,DDQ', 1, N'Titans T-001')

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'e52427c2-204b-4cf2-beec-35b95f935619', N'8100000000201', 1, N'DDM,MDR,DDQ', 1, N'Batman T-001')

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'5ed12387-2926-4a93-a76c-e779d2b54f4a', N'8100000000203', 1, N'DDM,MDR', 1, N'MD T-001')

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'c2059ddf-ad04-4a99-bc98-2c6fde857025', N'8100000000204', 1, N'DDM,MDR', 1, N'Joules T-001')

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name])
VALUES (N'ef69b130-1ead-4e58-a926-a2b1154d7e2a', N'8100000000207', 1, N'DDM,MDR', 1, N'Volt T-001')
GO

--Add the new grid Areas
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'2285dcb4-0bdd-4ec9-90cc-d757a062fb86', 34, N'116', N'KMDTest4', N'DK1', 1,
        N'bb71f037-692d-4bcd-9c79-741ad90e33ca')

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'62b86e5f-0216-4315-a3d5-a5523652c183', 35, N'117', N'KMDTest5', N'DK1', 1,
        N'e52427c2-204b-4cf2-beec-35b95f935619')

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'f1b0d811-c334-44de-b5ba-79f17b807fbc', 36, N'119', N'KMDTest4', N'DK1', 1,
        N'5ed12387-2926-4a93-a76c-e779d2b54f4a')

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'e2b2ea7b-4300-4cb0-93cc-ee33ab8f3b30', 37, N'120', N'KMDTest5', N'DK1', 1,
        N'c2059ddf-ad04-4a99-bc98-2c6fde857025')

INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId])
VALUES (N'd45f9498-1954-4c7d-8e9c-0d4a2aba058b', 38, N'123', N'KMDTest5', N'DK1', 1,
        N'ef69b130-1ead-4e58-a926-a2b1154d7e2a')
GO

--Add Grid Area Links
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'2ae8f968-f798-4379-a667-60391dfbbfb4', N'2285dcb4-0bdd-4ec9-90cc-d757a062fb86', 34)

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'8b70e867-8fe3-4680-bb25-09d11624f3f1', N'62b86e5f-0216-4315-a3d5-a5523652c183', 35)

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'992265b3-8ee1-44e1-a75d-46561eb59575', N'f1b0d811-c334-44de-b5ba-79f17b807fbc', 36)

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'c86fd83f-c8ec-45a0-8915-54aba3b99e4e', N'e2b2ea7b-4300-4cb0-93cc-ee33ab8f3b30', 37)

INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId])
VALUES (N'39a4c1da-3d20-43be-a84b-92361e5dde6a', N'd45f9498-1954-4c7d-8e9c-0d4a2aba058b', 38)

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO