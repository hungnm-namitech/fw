import { join } from 'path';
import * as XLSX from 'xlsx';

export type TypeColumnData = {
  nameObj: string;
  nameColumn: string;
  table?: string;
  format?: (...args: any[]) => any;
  validations?: { validate: (...args: any[]) => boolean; message: string }[];
  value?: any;
  cell?: string;
};

type PropsReadDataFromExcel = {
  filePath: string;
  sheetName: string;
  columns: TypeColumnData[];
};

export const readDataFromExcel = ({
  filePath,
  sheetName,
  columns,
}: PropsReadDataFromExcel) => {
  const workbook = XLSX.readFile(
    join(process.cwd(), filePath),
  );
  const worksheet = workbook.Sheets[sheetName];
  const data = [];

  for (let rowIndex = 2; ; rowIndex++) {
    const rowData = {};
    let hasData = false;

    columns.forEach((column) => {
      const cell = worksheet[column.nameColumn + rowIndex];
      if (cell) {
        rowData[column.nameObj] = cell.v;
        hasData = true;
      }
    });

    if (hasData) {
      data.push(rowData);
    } else {
      break;
    }
  }

  return data;
};

export const getSheetData = (
  worksheet: { [key: string]: XLSX.WorkSheet },
  columns: TypeColumnData[],
  primaryKey: string,
) => {
  const data = [];

  for (let rowIndex = 2; ; rowIndex++) {
    const row = {};
    let hasData = false;

    columns.forEach((column) => {
      const cell = worksheet[column.nameColumn + rowIndex];
      if (cell) {
        hasData = true;
      }
      const value =
        typeof column.format === 'function' ? column.format(cell?.v) : cell?.v;
      row[column.nameObj] = {
        ...column,
        cell: column.nameColumn + rowIndex,
        value,
      };
    });
    if (hasData) {
      // Validate row data
      const rowData: { [key: string]: any } = Object.keys(row).reduce(
        (acc, key) => {
          acc[key] = row[key].value;
          return acc;
        },
        {},
      );

      Object.keys(row).forEach((key) => {
        const column = row[key];
        if (rowData.deleteFlag === true) {
          if (
            column.nameObj !== primaryKey &&
            column.nameObj !== 'deleteFlag'
          ) {
            return;
          }
          const errors = (column.validations || [])
            .map((validation) => {
              return !validation.validate(column.value, rowData)
                ? validation.message
                : null;
            })
            .filter((error) => !!error);
          column.isValid = errors.length ? false : true;
          column.errorMessage = errors.join(', ');
          return;
        }
        if (Array.isArray(column.validations)) {
          const errors = column.validations
            .map((validation) => {
              return !validation.validate(column.value, rowData)
                ? validation.message
                : null;
            })
            .filter((error) => !!error);
          column.isValid = errors.length ? false : true;
          column.errorMessage = errors.join(', ');
        } else {
          column.isValid = true;
        }
      });
      data.push(row);
    } else {
      break;
    }
  }
  return data;
};
