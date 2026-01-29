# test-util-vitest

This library provides utilities for using Vitest with Angular in the Nx monorepo, including MSW (Mock Service Worker) compatibility fixes.

## Features

- **MSW Global Polyfill**: Fixes the `TransformStream is not defined` error when using MSW with jsdom
- **Vitest Angular Config**: Standard configuration helper for Angular libraries using Vitest

## Usage

### Basic Setup

In your library's `vite.config.mts`:

```typescript
import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { vitestAngularConfig } from '@energinet-datahub/gf/test-util-vitest';

export default defineConfig(() => ({
  ...vitestAngularConfig({
    root: __dirname,
    coveragePath: 'coverage/libs/dh/my-lib',
  }),
  plugins: [
    analog(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
}));
```

### With MSW Support

If your library uses MSW for mocking:

```typescript
export default defineConfig(() => ({
  ...vitestAngularConfig({
    root: __dirname,
    coveragePath: 'coverage/libs/dh/my-lib',
    enableMsw: true, // This enables the TransformStream polyfill
  }),
  plugins: [
    analog(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
}));
```

### Manual MSW Polyfill Usage

If you need more control, you can use the polyfill path directly:

```typescript
import { mswGlobalPolyfillPath } from '@energinet-datahub/gf/test-util-vitest';

export default defineConfig({
  test: {
    pool: 'forks',
    execArgv: ['--require', mswPolyfillPath],
    isolate: false,
    maxWorkers: 1,
  },
});
```

## Why This Library?

When using MSW with Vitest and jsdom, you'll encounter a `TransformStream is not defined` error because:

- MSW's dependencies use the Web Streams API
- jsdom doesn't provide TransformStream
- The solution is to polyfill it using Node.js's built-in `stream/web` module

This library provides a centralized solution to avoid duplicating the polyfill across multiple libraries.
