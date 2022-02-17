import {
  Process,
  ProcessDetail,
  ProcessStatus,
} from '@energinet-datahub/dh/shared/data-access-api';

export class DHProcess implements Process {
  createdDate: string;
  details: ProcessDetail[];
  effectiveDate?: string | null;
  id: string;
  meteringPointGsrn: string;
  name: string;
  status: ProcessStatus;

  constructor(process: Process) {
    this.createdDate = process.createdDate;
    this.details = process.details;
    this.effectiveDate = process.effectiveDate;
    this.id = process.id;
    this.meteringPointGsrn = process.meteringPointGsrn;
    this.name = process.name;
    this.status = process.status;
  }

  // TODO: PR Question: What is the preferred way to handle the need for this?
  // TODO: Also, figure out if this is actually how the "indicator light" should work since old process details would still show their errors
  public hasErrors(): boolean {
    return this.details.some((detail) => detail.errors.length > 0);
  }
}
