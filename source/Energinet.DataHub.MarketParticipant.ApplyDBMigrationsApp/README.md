# ApplyDBMigrationsApp

## Purpose

During the course of time, the structure contained in a SQL server will change, be it tables, views, stored procedures etc.

The purpose of the migrations app is to make sure that the database structures are up to date.

As such, it contains a number of scripts needed to go from an empty database to a database containing all the needed structure for the newest version. That is, the entire update history.

After the SQL server has been deployed this tool can be run and will then ensure that all the scripts available that have not already been run on the server will be executed.

## Running the tool manually

The tool can be run manually on any SQL server database using the following command:

`Energinet.DataHub.ActorRegistry.ApplyDBMigrationsApp.exe <connection string>`

`<connection string>` must be replaced with the correct connection string for the database, possibly encapsulated with `"`

If seed data or test data should also be applied, add the relevant of these arguments: `includeSeedData`, `includeTestData`.

It's possible to do a dry run with the parameter `dryRun`. All scripts will be run inside a transaction that will be rolled back afterwards.

ex.

`dotnet run <connection string> env* includeSeedData** includeTestData** dryRun**`

* Possible values "U-001", "U-002", "T-001", "B-001", "B-002", "P-001"
** Optional parameters

## Adding a new script to be synced to SQL servers on deploy

When a new script should be added to the tracked updates, a new .sql file should be added to the Scripts\{Type} folder. Where type can be Model/Seed/Test. It should be named with date and time (yyyyMMddHHmm) as prefix and a descriptive file name, i.e.: `202012312359 Add ActorRegistry model.sql`.

## Script executing order

Scripts are executed in order defined by the date and time prefix. If scripts with the same date and time prefix exists, those of type Model will be run before Seed and then Test.

## Warning

Don't modify scripts that might already have been deployed somewhere. They will not be executed again and the system will not be updated.

As a rule of thumb you should not modify a script after the branch in question has been made public.
