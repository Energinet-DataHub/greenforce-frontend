INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'aeeb8829-0298-47ea-b3f1-c3c30cb297f2', N'2462543435837', 1, N'DDM, MDR', 1, N'Batman - DDM -')
INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'553aefad-3fc5-4f08-bc82-d3d0dbaf0ea7', N'5825026986597', 1, N'DDQ', 1, N'Batman - DDQ -')

UPDATE ActorInfo
SET Id = 'b249170b-92bd-476d-9255-4290d599d384',
    IdentificationNumber = '3217200416389',
    Name = 'Volt - Test -'
WHERE Id = 'e009b9b2-edce-4f74-b466-98d0bbb0a94a'