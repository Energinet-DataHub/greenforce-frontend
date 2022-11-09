DELETE x
FROM [dbo].[ActorContact] x
JOIN [dbo].[ActorInfoNew] a ON x.ActorId = a.Id AND a.Status = 5

DELETE x
FROM [dbo].[DomainEvent] x 
JOIN [dbo].[ActorInfoNew] a ON x.EntityId = a.Id AND a.Status = 5

DELETE z
FROM [dbo].[GridAreaMeteringPointType] z
JOIN [dbo].[MarketRoleGridArea] y ON z.MarketRoleGridAreaId = y.Id
JOIN [dbo].[MarketRole] x ON y.MarketRoleId = x.Id
JOIN [dbo].[ActorInfoNew] a ON x.ActorInfoId = a.Id AND a.Status = 5

DELETE y
FROM [dbo].[MarketRoleGridArea] y
JOIN [dbo].[MarketRole] x ON y.MarketRoleId = x.Id
JOIN [dbo].[ActorInfoNew] a ON x.ActorInfoId = a.Id AND a.Status = 5

DELETE x
FROM [dbo].[MarketRole] x
JOIN [dbo].[ActorInfoNew] a ON x.ActorInfoId = a.Id AND a.Status = 5

DELETE x
FROM [dbo].[UniqueActorMarketRoleGridArea] x
JOIN [dbo].[ActorInfoNew] a ON x.ActorId = a.Id AND a.Status = 5

DELETE a
FROM [dbo].[ActorInfoNew] a WHERE a.Status = 5

GO
