import { getProcess } from './get-process.mock';
import { getProcesses } from './get-processes.mock';

export function processMocks() {
  return [getProcesses(), getProcess()];
}
