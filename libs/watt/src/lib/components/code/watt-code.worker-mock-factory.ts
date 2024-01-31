export function createWorker() {
  return new Worker(new URL('./watt-code.worker.ts', ''));
}
