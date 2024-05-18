# License executor

Add license to files.

To compile changes to `impl.ts`, use the following command:

```powershell
bunx tsc tools/executors/license/impl --resolveJsonModule
```

To run the executor

```powershell
bun nx run tools:add-license --dryRun=true
```
