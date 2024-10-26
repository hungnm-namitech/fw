import {
  isBoolean,
  isDate,
  isInt,
  isNotEmpty,
  isString,
  maxLength,
} from 'class-validator';
import { isNumber } from 'lodash';
import { SHEET_CONFIG_TYPE } from 'src/storage/storage.constant';
import { TypeColumnData } from 'src/utils/read-file.xlsx';

export const HEADER_OFFSET = 1;

export const BULK_INSERT_FOLDERS = {
  processing: 'processing',
  errorFiles: 'failure',
  completed: 'completed',
  log: 'logs',
};

function generateValidationPositiveField(text: string) {
  return [
    {
      validate: (val: any) => isInt(val) && +val > 0,
      message: `${text} should be positive integer`,
    },
  ];
}

function generateValidationString(text: string, max: number, required = true) {
  const validations = [
    {
      validate: (val) => !val || maxLength(val, max),
      message: `${text} must be shorter than or equal to ${max} characters`,
    },
  ];

  if (required) {
    validations.unshift({
      validate: (val) => isNotEmpty(val),
      message: `${text} should not empty`,
    });
  }

  return validations;
}

function generateValidationDeleteFlag() {
  return [
    {
      validate: isBoolean,
      message: 'DeleteFlag must be true or false',
    },
  ];
}

export const ITEM_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'itemCd',
    table: 'item',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Itemcd', 2),
  },
  {
    nameColumn: 'B',
    nameObj: 'itemName',
    table: 'item',
    validations: generateValidationString('Item name', 128),
  },
  {
    nameColumn: 'C',
    nameObj: 'iconFileName',
    table: 'item',
    validations: generateValidationString('IconFileName', 128),
  },
  {
    nameColumn: 'D',
    nameObj: 'displayDiv',
    table: 'item',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('DisplayDiv', 2),
  },
  {
    nameColumn: 'E',
    nameObj: 'deleteFlag',
    validations: generateValidationDeleteFlag(),
  },
];

export const SUPPLIER_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'supplierCd',
    table: 'supplier',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('SupplierCd', 2),
  },
  {
    nameColumn: 'B',
    nameObj: 'supplierName',
    table: 'supplier',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Supplier name', 128),
  },
  {
    nameColumn: 'C',
    nameObj: 'deleteFlag',
    validations: generateValidationDeleteFlag(),
  },
];

export const COMPANY_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'companyCd',
    table: 'company',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('CompanyCd', 4),
  },
  {
    nameColumn: 'B',
    nameObj: 'companyName',
    table: 'company',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Company name', 128),
  },
  {
    nameColumn: 'C',
    nameObj: 'deleteFlag',
    validations: generateValidationDeleteFlag(),
  },
];

export const PRODUCT_FIELDS_CONFIG = [
  {
    nameColumn: 'A',
    nameObj: 'productCd',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('ProductCd', 7),
  },
  {
    nameColumn: 'B',
    nameObj: 'productName',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Product name', 128),
  },
  {
    nameColumn: 'C',
    nameObj: 'productDisplayName',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Product display name', 128),
  },
  {
    nameColumn: 'D',
    nameObj: 'supplierCd',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Supplier cd', 2),
  },
  {
    nameColumn: 'E',
    nameObj: 'itemCd',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Item cd', 2),
  },
  {
    nameColumn: 'F',
    nameObj: 'productId',
    table: 'product',
    format: (val: any) => +val,
    validations: [
      {
        validate: (val) => isInt(val) && +val > 0,
        message: 'Product id should be positive integer',
      },
    ],
  },
  {
    nameColumn: 'G',
    nameObj: 'gradeStrength',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Grade strength', 128),
  },
  {
    nameColumn: 'H',
    nameObj: 'trailer',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Trailer', 128),
  },
  {
    nameColumn: 'I',
    nameObj: 'memo',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: [
      {
        validate: (val) => !val || maxLength(val, 128),
        message: `Memo must be shorter than or equal to 128 characters`,
      },
    ],
  },
  {
    nameColumn: 'J',
    nameObj: 'capacityMin',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Capacity min', 128),
  },
  {
    nameColumn: 'K',
    nameObj: 'capacityMax',
    table: 'product',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Capacity max', 128),
  },
  {
    nameColumn: 'L',
    nameObj: 'deleteFlag',
    table: 'product',
    validations: generateValidationDeleteFlag(),
  },
];

export const PRODUCT_DETAIL_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'productDetailCd',
    table: 'productDetail',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('ProductDetailCd', 20),
  },
  {
    nameColumn: 'B',
    nameObj: 'productCd',
    table: 'productDetail',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('productCd', 7),
  },
  {
    nameColumn: 'C',
    nameObj: 'width',
    table: 'productDetail',
    format: (val: any) => +val,
    validations: generateValidationPositiveField('width'),
  },
  {
    nameColumn: 'D',
    nameObj: 'thickness',
    table: 'productDetail',
    format: (val: any) => +val,
    validations: generateValidationPositiveField('thickness'),
  },
  {
    nameColumn: 'E',
    nameObj: 'length',
    table: 'productDetail',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: [
      {
        validate: (val) => val && isInt(+val) && +val > 0,
        message: `Length should be positive integer`,
      },
      {
        validate: (val) => val && maxLength(val.toString(), 10),
        message: `Length must be shorter than or equal to 10 characters`,
      },
    ],
  },
  {
    nameColumn: 'F',
    nameObj: 'quantityPerPack',
    table: 'productDetail',
    format: (val: any) => +val,
    validations: generateValidationPositiveField('Quantity per pack'),
  },
  {
    nameColumn: 'G',
    nameObj: 'deleteFlag',
    table: 'productDetail',
    validations: generateValidationDeleteFlag(),
  },
];

export const PRODUCT_PRICE_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'id',
    table: 'productPrice',
    format: (val: any) => +val,
    validations: generateValidationPositiveField('id'),
  },
  {
    nameColumn: 'B',
    nameObj: 'productCd',
    table: 'productPrice',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('productCd', 7),
  },
  {
    nameColumn: 'C',
    nameObj: 'unitDiv',
    table: 'productPrice',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Unit div', 2),
  },
  {
    nameColumn: 'D',
    nameObj: 'unitPrice',
    table: 'productPrice',
    format: (val: any) => Number(val),
    validations: [
      {
        validate: (val) => val && isNumber(val),
        message: `Unit price must be number`,
      },
    ],
  },
  {
    nameColumn: 'E',
    nameObj: 'startDate',
    table: 'productPrice',
    format: (val: any) => new Date(val),
    validations: [
      {
        validate: (val) => isDate(val),
        message: `Start date must be date time`,
      },
    ],
  },
  {
    nameColumn: 'F',
    nameObj: 'deleteFlag',
    table: 'productPrice',
    validations: generateValidationDeleteFlag(),
  },
];

export const COMMERCIAL_FLOW_FIELDS_CONFIG: TypeColumnData[] = [
  {
    nameColumn: 'A',
    nameObj: 'commercialFlowCd',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Commercial flow cd', 8),
  },
  {
    nameColumn: 'B',
    nameObj: 'itemCd',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Item cd', 2),
  },
  {
    nameColumn: 'C',
    nameObj: 'supplierCd',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('SupplierCd', 2),
  },
  {
    nameColumn: 'D',
    nameObj: 'companyCd',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('CompanyCd', 4),
  },
  {
    nameColumn: 'E',
    nameObj: 'monthlyForecast',
    table: 'commercialFlow',
    format: (val: any) => +val,
    validations: generateValidationPositiveField('Monthly forecast'),
  },
  {
    nameColumn: 'F',
    nameObj: 'tradingCompany1',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Trading Company 1', 128, false),
  },
  {
    nameColumn: 'G',
    nameObj: 'tradingCompany2',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Trading Company 2', 128, false),
  },
  {
    nameColumn: 'H',
    nameObj: 'tradingCompany3',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Trading Company 3', 128, false),
  },
  {
    nameColumn: 'I',
    nameObj: 'tradingCompany4',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Trading Company 4', 128, false),
  },
  {
    nameColumn: 'J',
    nameObj: 'deliveryDestination1',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Delivery destination 1', 128, false),
  },
  {
    nameColumn: 'K',
    nameObj: 'deliveryDestination2',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Delivery destination 2', 128, false),
  },
  {
    nameColumn: 'L',
    nameObj: 'deliveryDestination3',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Delivery destination 3', 128, false),
  },
  {
    nameColumn: 'M',
    nameObj: 'deliveryDestination4',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Delivery destination 4', 128, false),
  },
  {
    nameColumn: 'N',
    nameObj: 'deliveryDestination5',
    table: 'commercialFlow',
    format: (val: any) => (isString(val) ? val : val && val.toString()),
    validations: generateValidationString('Delivery destination 5', 128, false),
  },
  {
    nameColumn: 'O',
    nameObj: 'deleteFlag',
    table: 'commercialFlow',
    validations: generateValidationDeleteFlag(),
  },
];

export const RELATIONS_CONFIG: { [key: string]: RELATION_TYPE[] } = {
  item: [
    {
      table: 'orderHeaders',
    },
    {
      table: 'commercialFlows',
    },
  ],
  supplier: [
    {
      table: 'users',
    },
    {
      table: 'products',
    },
    {
      table: 'orderHeaders',
    },
    {
      table: 'changeOrderHeaders',
    },
    {
      table: 'commercialFlows',
    },
  ],
  company: [
    {
      table: 'users',
    },
    {
      table: 'staffs',
    },
    {
      table: 'bases',
    },
    {
      table: 'orderHeaders',
    },
    {
      table: 'changeOrderHeader',
    },
    {
      table: 'commercialFlows',
    },
  ],
  product: [
    {
      table: 'productDetails',
    },
    {
      table: 'productPrices',
    },
  ],
  productDetail: [
    {
      table: 'orderDetails',
    },
    {
      table: 'changeOrderDetails',
    },
  ],
  commercialFlow: [],
  productPrice: [],
};

export const REFERENCES_CONFIG: { [key: string]: REFERENCE_TYPE[] } = {
  item: [{ sheet: 'commercialFlow', referenceKey: 'itemCd' }],
  supplier: [
    { sheet: 'product', referenceKey: 'supplierCd' },
    { sheet: 'commercialFlow', referenceKey: 'supplierCd' },
  ],
  company: [{ sheet: 'commercialFlow', referenceKey: 'companyCd' }],
  product: [
    { sheet: 'productDetail', referenceKey: 'productCd' },
    { sheet: 'productPrice', referenceKey: 'productCd' },
  ],
  productDetail: [],
  commercialFlow: [],
  productPrice: [],
};

export const FOREIGN_KEY_CONFIG: { [key: string]: REFERENCE_TYPE[] } = {
  item: [],
  supplier: [],
  company: [],
  product: [
    { sheet: 'item', referenceKey: 'itemCd' },
    { sheet: 'supplier', referenceKey: 'supplierCd' },
  ],
  productDetail: [{ sheet: 'product', referenceKey: 'productCd' }],
  commercialFlow: [
    { sheet: 'item', referenceKey: 'itemCd' },
    { sheet: 'supplier', referenceKey: 'supplierCd' },
    { sheet: 'company', referenceKey: 'companyCd' },
  ],
  productPrice: [{ sheet: 'product', referenceKey: 'productCd' }],
};

export const SHEET_CONFIG: SHEET_CONFIG_TYPE[] = [
  {
    fieldConfig: ITEM_FIELDS_CONFIG,
    sheet: 0,
    sheetName: 'アイテム',
    table: 'item',
    primaryKey: 'itemCd',
  },
  {
    fieldConfig: SUPPLIER_FIELDS_CONFIG,
    sheet: 1,
    sheetName: 'メーカー',
    table: 'supplier',
    primaryKey: 'supplierCd',
  },
  {
    fieldConfig: COMPANY_FIELDS_CONFIG,
    sheet: 2,
    sheetName: 'プレカット工場',
    table: 'company',
    primaryKey: 'companyCd',
  },
  {
    fieldConfig: PRODUCT_FIELDS_CONFIG,
    sheet: 3,
    sheetName: '製品',
    table: 'product',
    primaryKey: 'productCd',
  },
  {
    fieldConfig: PRODUCT_DETAIL_FIELDS_CONFIG,
    sheet: 4,
    sheetName: '製品詳細',
    table: 'productDetail',
    primaryKey: 'productDetailCd',
  },
  {
    fieldConfig: COMMERCIAL_FLOW_FIELDS_CONFIG,
    sheet: 5,
    sheetName: 'アイテム・プレカット',
    table: 'commercialFlow',
    primaryKey: 'commercialFlowCd',
  },
  {
    fieldConfig: PRODUCT_PRICE_FIELDS_CONFIG,
    sheet: 6,
    sheetName: '製品単価',
    table: 'productPrice',
    primaryKey: 'id',
  },
];

export type RELATION_TYPE = {
  table: string;
};

export type REFERENCE_TYPE = {
  sheet: string;
  referenceKey: string;
  data?: { [key: string]: TypeColumnData }[];
};
