UPDATE [dbo].[DomainEvent]
SET    EntityType = 'Actor'
WHERE  EntityType in ('ActorStatus', 'ActorMarketRole', 'ActorGridArea', 'MeteringPointType', 'ActorContact')
GO
