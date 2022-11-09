INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'f137b23f-7d91-46c3-9489-9a4075c599d6', 27, N'141', N'Batman - B-001 DDM - ', N'DK1', 1, N'aeeb8829-0298-47ea-b3f1-c3c30cb297f2')
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'73f40306-3806-418e-b29e-c65c8ff9de29', 27, N'142', N'Batman - B-001 DDQ - ', N'DK1', 1, N'553aefad-3fc5-4f08-bc82-d3d0dbaf0ea7')
INSERT [dbo].[GridAreaInfo] ([Id], [RecordId], [Code], [Name], [PriceAreaCode], [Active], [ActorId]) VALUES (N'589d5229-d9bf-4089-af82-71c604f8f53d', 27, N'140', N'Volt - B-001 - ', N'DK1', 1, N'b249170b-92bd-476d-9255-4290d599d384')

SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] ON
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'c6534512-0b79-45e7-814b-246b633bd35d', N'f137b23f-7d91-46c3-9489-9a4075c599d6', 33)
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'208a441a-5681-4a25-91e7-afe75c2dbbc8', N'73f40306-3806-418e-b29e-c65c8ff9de29', 34)
INSERT [dbo].[GridAreaLinkInfo] ([GridLinkId], [GridAreaId], [RecordId]) VALUES (N'4929e1e9-dad8-403d-a6c2-3325ae9e3e7a', N'589d5229-d9bf-4089-af82-71c604f8f53d', 35)
SET IDENTITY_INSERT [dbo].[GridAreaLinkInfo] OFF

GO