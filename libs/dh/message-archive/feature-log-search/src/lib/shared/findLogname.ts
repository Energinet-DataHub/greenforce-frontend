const regexLogNameWithDateFolder = new RegExp(
  /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/
);
const regexLogNameIsSingleGuid = new RegExp(
  /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/
);

export function findLogName(logUrl: string): string {
  if (regexLogNameWithDateFolder.test(logUrl)) {
    const match = regexLogNameWithDateFolder.exec(logUrl);
    return match != null ? match[0] : '';
  } else if (regexLogNameIsSingleGuid.test(logUrl)) {
    const match = regexLogNameIsSingleGuid.exec(logUrl);
    return match != null ? match[0] : '';
  }

  return '';
}
