import { Pipe, PipeTransform } from '@angular/core';
import { DocumentTypes } from '@energinet-datahub/dh/message-archive/domain';

@Pipe({ name: 'documentTypeName', standalone: true })
export class DocumentTypeNamePipe implements PipeTransform {
  transform(key: string | null | undefined): string | undefined {
    if (!key) return 'N/A';
    const indexOfS = Object.keys(DocumentTypes)
      .map((x) => x.toLowerCase())
      .indexOf(key);

    return Object.values(DocumentTypes)[indexOfS];
  }
}
