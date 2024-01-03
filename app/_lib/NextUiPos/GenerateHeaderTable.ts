export const generateHeaders = (columns: any[]) => {
  let data: any[] = [];
  columns.forEach((col: string) => {
    data.push({
      key: col.toLocaleLowerCase().replaceAll(' ', '_'),
      label: col,
    });
  });

  return data;
};
