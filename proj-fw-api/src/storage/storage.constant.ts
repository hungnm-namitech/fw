import { TypeColumnData } from 'src/utils/read-file.xlsx';
export type SHEET_CONFIG_TYPE = {
  fieldConfig: TypeColumnData[];
  sheet: number;
  sheetName: string;
  table: string;
  primaryKey: string;
};
