INSERT INTO [dbo].[GridAreaActorInfoLink]
SELECT
    NEWID() AS [Id],
    [dbo].[GridAreaInfo].[Id] AS [GridAreaId],
    [dbo].[ActorInfoNew].[Id] AS [ActorInfoId]
FROM [dbo].[ActorInfoNew] INNER JOIN [dbo].[GridAreaInfo]
 ON [dbo].[ActorInfoNew].[ActorId] = [dbo].[GridAreaInfo].[ActorId]