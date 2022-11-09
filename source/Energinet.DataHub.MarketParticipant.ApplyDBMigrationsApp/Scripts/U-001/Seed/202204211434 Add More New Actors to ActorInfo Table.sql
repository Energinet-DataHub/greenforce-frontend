--Add Role to previous ModStrøm Actor
UPDATE ActorInfo
SET Roles = 'DDK,DDQ'
WHERE Id = 'add5bf67-9f24-4ebb-94a6-22dfc1e465cf'
GO

--Insert new actors
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'd5581195-92c0-400c-86b3-6d5915cf2536', N'8200000007661', 1, N'DDM', 1, N'Openminds ApS')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'a4697b25-cac5-45f9-8f32-6465c7829229', N'8200000007678', 1, N'MDR', 1, N'Openminds ApS')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'5507d87b-bec5-45bb-add1-5f5c661dbefe', N'5790002295607', 1, N'DDQ', 1, N'SEAS-NVE Strømmen (NEMO)')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'eb99aad6-6fa0-4925-85f5-c8269c92fdb8', N'5790001095383', 1, N'MDR', 1, N'SEAS-NVE Strømmen (SAP) - Måledataansvarlig')
GO

--Create Grid Areas for Openminds
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'99775019-80f1-4587-aaee-88f1b4fcea4c', 34, N'151', N'Openminds 1', N'DK1', 1, N'd5581195-92c0-400c-86b3-6d5915cf2536')
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'4fcb017d-3721-41ee-8f69-f984b4f190f2', 35, N'245', N'Openminds 2', N'DK1', 1, N'd5581195-92c0-400c-86b3-6d5915cf2536')

--Grid Area Links for Openminds
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'f1a06e61-294a-46cd-8800-416b642c060b', N'99775019-80f1-4587-aaee-88f1b4fcea4c', 34)
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'70f9ee21-7f82-4602-b835-7d031bb98e85', N'4fcb017d-3721-41ee-8f69-f984b4f190f2', 35)

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF
GO