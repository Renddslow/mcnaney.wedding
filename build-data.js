import fs from 'fs';
import path from 'path';

const parseCSV = (payload) => {
  const rows = payload.split('\n');

  return rows.map((row) => {
    const rowData = [];
    let inQuote = false;
    let string = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' || char === "'") {
        inQuote = char;
        continue;
      }

      if (!!inQuote && char === inQuote) {
        rowData.push(string);
        string = '';
        inQuote = false;
        continue;
      }

      if (char === ',' && !inQuote) {
        rowData.push(string);
        string = '';
        continue;
      }

      string += char;
    }

    if (string) {
      rowData.push(string);
    }
    return rowData;
  });
};

const openFile = async (filePath) => {
  return fs.promises.readFile(filePath, 'utf8');
};

const getData = async () => {
  const dataPath = path.join(process.cwd(), 'raw_data.csv');
  const data = await openFile(dataPath);
  const parsedData = parseCSV(data).map(([lastName, firstName, table], idx) => ({
    id: idx,
    lastName,
    firstName,
    table: !table.toLowerCase().includes('head') ? parseInt(table.replace(/Table/i, '').trim()) : 0,
  }));
  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'data.json'),
    JSON.stringify(parsedData, null, 2),
  );
};

(async () => {
  await getData();
})();
