type ExportToCSVArgs = {
  headers: string[];
  lines: string[][];
  fileName?: string;
};

const defaultFileName = 'result';

export const exportToCSV = ({ headers, lines, fileName = defaultFileName }: ExportToCSVArgs) => {
  exportToCSVRaw({
    content: `${headers.join(';')}\n${lines.map((x) => x.join(';')).join('\n')}`,
    fileName,
  });
};

export const exportToCSVRaw = ({
  content,
  fileName = defaultFileName,
}: {
  content: string;
  fileName: string;
}) => {
  const a = document.createElement('a');

  a.href = URL.createObjectURL(
    new Blob([`\ufeff${content}`], {
      type: 'text/csv;charset=utf-8;',
    })
  );

  a.download = `${fileName}.csv`;
  a.click();
};
