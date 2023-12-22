# License executor

Add license to files.

To compile changes to `impl.ts`, use the following command:

```powershell
npx tsc tools/executors/license/impl --resolveJsonModule
```

To run the executor

```powershell
yarn nx run tools:add-license --dryRun=true
```
