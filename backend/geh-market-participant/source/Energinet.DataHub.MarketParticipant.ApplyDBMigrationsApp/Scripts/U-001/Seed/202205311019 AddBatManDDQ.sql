UPDATE ActorInfo
SET [Roles] = 'DDM,MDR'
WHERE Id = 'a982de1f-3703-4e3c-be56-4e54418a2a59'
    GO

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'e8f283f0-904d-4542-83af-755be4205f8c', N'5178861303303', 1, N'DDQ', 1, N'Batman - DDQ 1 -')