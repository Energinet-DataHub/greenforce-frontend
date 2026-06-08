# Process Actions

Actions are organized by `BusinessReason`, each in its own folder as an `@Injectable({ providedIn: 'root' })` service.

```text
actions/
├── registry.ts                         # Central registry
├── context.ts                          # ProcessActionContext interface
├── supported-actions.pipe.ts           # Pure pipe for templates
├── shared/
│   ├── cancel-process-action.ts        # Reusable cancel flow (modal + toast)
│   └── cancel-process-modal.ts         # Cancel confirmation modal
├── end-of-supply/
│   └── end-of-supply.ts               # EndOfSupply action handlers
└── customer-move-in/
    └── customer-move-in.ts            # CustomerMoveIn action handlers
```

## Adding a new action

1. Create a folder and service file (see `end-of-supply/end-of-supply.ts` for reference):

```typescript
@Injectable({ providedIn: 'root' })
export class EndOfSupplyActions {
  private readonly cancelEndOfSupply = mutation(CancelEndOfSupplyDocument);

  readonly handlers: ActionHandlerMap = {
    [WorkflowAction.CancelWorkflow]: {
      featureFlag: 'end-of-supply',
      callback: cancelProcessAction(
        'meteringPoint.processOverview.processTypeName.EndOfSupply',
        (ctx, onCompleted, onError) => {
          this.cancelEndOfSupply.mutate({
            refetchQueries: [GetMeteringPointProcessByIdDocument, GetMeteringPointProcessOverviewDocument],
            variables: { meteringPointId: ctx.meteringPointId, processId: ctx.processId },
            onCompleted,
            onError,
          });
        }
      ),
    },
  };
}
```

1. Register it in `registry.ts`:

```typescript
[ProcessManagerBusinessReason.EndOfSupply]: inject(EndOfSupplyActions).handlers,
```

## Shared actions

`cancelProcessAction` in `shared/cancel-process-action.ts` provides the reusable cancel flow (modal + mutation + toast). It takes a translation key for the process type name (resolved at execution time) and a mutation callback. It must be called within an Angular injection context (e.g. a field initializer of an `@Injectable` class).

## How it works

The registry provides:

- **`getSupportedActions`** — filters available actions by feature flags and registered handlers
- **`execute(action, businessReason, context)`** — routes to the correct handler based on `businessReason`

In templates, use the `SupportedActionsPipe` instead of calling `getSupportedActions` directly:

```html
@for (action of (process.availableActions | supportedActions: process.businessReason); track action) {
```
