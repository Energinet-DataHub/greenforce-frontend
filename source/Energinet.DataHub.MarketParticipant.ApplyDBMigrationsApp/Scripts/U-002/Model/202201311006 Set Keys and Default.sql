ALTER TABLE [dbo].[ActorInfo] ADD  CONSTRAINT [DF_ActorInfo_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[ActorInfo] ADD  CONSTRAINT [DF_ActorInfo_Name]  DEFAULT ('') FOR [Name]
GO
ALTER TABLE [dbo].[GridAreaLinkInfo] ADD  CONSTRAINT [DF_GridAreaLink_GridLinkId]  DEFAULT (newid()) FOR [GridLinkId]
GO
ALTER TABLE [dbo].[GridAreaInfo] ADD  CONSTRAINT [DF_GridAreaInfo_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[GridAreaInfo] ADD  CONSTRAINT [DF_GridAreaInfo_Active]  DEFAULT ((0)) FOR [Active]
GO
ALTER TABLE [dbo].[GridAreaLinkInfo]  WITH CHECK ADD  CONSTRAINT [FK_GridAreaLink_GridAreaInfo] FOREIGN KEY([GridAreaId])
    REFERENCES [dbo].[GridAreaInfo] ([Id])
    ON UPDATE CASCADE
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GridAreaLinkInfo] CHECK CONSTRAINT [FK_GridAreaLink_GridAreaInfo]
GO
ALTER TABLE [dbo].[GridAreaInfo]  WITH CHECK ADD  CONSTRAINT [FK_GridAreaInfo_ActorInfo] FOREIGN KEY([ActorId])
    REFERENCES [dbo].[ActorInfo] ([Id])
    ON UPDATE CASCADE
    ON DELETE SET NULL
GO
ALTER TABLE [dbo].[GridAreaInfo] CHECK CONSTRAINT [FK_GridAreaInfo_ActorInfo]
GO