export function ToLowerSort() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data: any, sortHeaderId: string): string => {
    if (typeof data[sortHeaderId] === 'string') {
      return data[sortHeaderId].toLocaleLowerCase();
    }

    return data[sortHeaderId];
  };
}
