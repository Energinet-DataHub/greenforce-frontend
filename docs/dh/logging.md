# Logging with Application Insights

- Page views will be tracked by default when router changes occur. Note that this doesn't include **overlays** (see [trackPageView](#trackPageView)).

- Uncaught browser exceptions will also be tracked by default. For manually logging exceptions (see [trackException](#trackException)).

- HTTP requests will also be tracked by default, so no manually tracking is nesecary.

**_⚠️ Note: `traceparent` header won't be added on outgoing requests in the mocking environment due to the usage of MSW (Mock Service Worker). To see the `traceparent` header, run the development environment instead._**

```sh
yarn nx run app-dh:serve:development
```

## Getting started

Sending Telemetry to the Azure Portal, you must import the `DhApplicationInsights` service from `@energinet-datahub/dh/shared/util-application-insights`.

```ts
import { DhApplicationInsights } from  '@energinet-datahub/dh/shared/util-application-insights';
...
constructor(private insights: DhApplicationInsights) {}
```

### trackEvent

Log a user action or other occurrence.

```ts
DhApplicationInsights.trackEvent('some event');
```

### trackTrace

Log a diagnostic scenario such as entering or leaving a function.

```ts
DhApplicationInsights.trackTrace('some message');
```

### trackPageView

Logs that a page or similar container was displayed to the user. **Use this for tracking overlays**.

```ts
DhApplicationInsights.trackPageView('name of overlay');
```

### trackException

Log an exception that you have caught.

```ts
DhApplicationInsights.trackException({
  exception: new Error('some error'),
  severityLevel: 3, // Severity level of error
});
```

## Common queries for Application Insights in Azure Portal

The best way to get started learning to write log queries using KQL is leveraging [available tutorials and samples](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview#getting-started).

### Page views

```sql
pageViews
| where client_Type == 'Browser'
```

### Events

```sql
customEvents
| where name == 'Custom event'
```

### Exceptions

```sql
exceptions
| where itemType == 'exception'
| where client_Type == 'Browser'
```
