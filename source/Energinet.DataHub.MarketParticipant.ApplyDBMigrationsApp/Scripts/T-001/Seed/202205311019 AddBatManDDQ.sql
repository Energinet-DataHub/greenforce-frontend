UPDATE ActorInfo
SET [Roles] = 'DDM,MDR'
WHERE Id = 'a982de1f-3703-4e3c-be56-4e54418a2a59'
    GO

INSERT [dbo].[ActorInfo] ([Id], [IdentificationNumber], [IdentificationType], [Roles], [Active], [Name]) VALUES (N'e8e62d46-9f35-4d32-92c0-fb619a8aec28', N'5825026986597', 1, N'DDQ', 1, N'Batman - DDQ 1 -')