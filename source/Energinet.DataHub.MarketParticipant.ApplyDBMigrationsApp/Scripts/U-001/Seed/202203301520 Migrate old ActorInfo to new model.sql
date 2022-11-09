declare @id uniqueidentifier
declare @identificationnumber nvarchar(50)
declare @roles nvarchar(max)
declare @active bit
declare @name varchar(max)

declare db_cursor cursor for
select
    id,
    identificationnumber,
    roles,
    active,
    [name]
from
    dbo.actorinfo

open db_cursor

fetch next from db_cursor
    into @id,
        @identificationnumber,
        @roles,
        @active,
        @name

while @@fetch_status = 0
begin
    declare @exists bit =
    (
    select count(id)
    from dbo.actorinfonew
    where gln = @identificationnumber
    )

    if @exists = 0
    begin
        declare @status int = 3;
        if @active = 1 
        begin
            set @status = 2
        end

        declare @organizationinfoid uniqueidentifier = newid()
        insert into dbo.organizationinfo
            (id, [name])
        values(@organizationinfoid, @name)

        declare @actorinfonewid uniqueidentifier = newid()
        insert into dbo.actorinfonew
            (id, organizationid, actorid, gln, [status])
        values(@actorinfonewid, @organizationinfoid, @id, @identificationnumber, @status)

        if @roles like '%ddm%'
        begin
            insert into marketrole
                (id, actorinfoid, [function])
            values(newid(), @actorinfonewid, 14)
        end
        if @roles like '%mdr%'
        begin
            insert into marketrole
                (id, actorinfoid, [function])
            values(newid(), @actorinfonewid, 26)
        end
        if @roles like '%ddq%'
        begin
            insert into marketrole
                (id, actorinfoid, [function])
            values(newid(), @actorinfonewid, 12)
        end
        if @roles like '%ez%'
        begin
            insert into marketrole
                (id, actorinfoid, [function])
            values(newid(), @actorinfonewid, 46)
        end
        if @roles like '%ddz%'
        begin
            insert into marketrole
                (id, actorinfoid, [function])
            values(newid(), @actorinfonewid, 27)
        end

    end

    fetch next from db_cursor
    into @id,
        @identificationnumber,
        @roles,
        @active,
        @name
end

close db_cursor
deallocate db_cursor
go