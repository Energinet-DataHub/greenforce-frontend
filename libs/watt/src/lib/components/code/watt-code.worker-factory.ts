export function createWorker() {
  return new Worker(new URL('./watt-code.worker.ts', import.meta.url));
}
