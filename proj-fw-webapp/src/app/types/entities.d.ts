import { ItemDetail } from './api-response';

export declare type User = {
  mUserId: string;
  userId: string;
  username: string;
  usernameKana: string;
  mailAddress: string;
  tel: string;
  roleDiv: number;
  password: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  supplierName?: string;
  supplierId?: string;
};

export declare type Base = {
  id: string;
  baseName: string;
  baseNameKana: string;
  baseDiv: string;
  telNumber: string;
  postCode: string;
  address1: string;
  address2: string;
  address3: string;
  address?: string;
  companyCd?: string;
  companyName?: string;
};

export declare type Company = {
  id: string;
  companyCd: string;
  companyName: string;
  companyDiv: string;
  companyNameKana: string;
  tel: string;
  postCd: string;
  address1: string;
  address2: string;
  address3: string;
  address?: string;
};

export declare type Role = {
  value: number;
  label: string;
};

export declare type List = {
  total: number;
  perPage: number;
  currentPage: number;
};

export interface ListUser extends List {
  items: Array<User>;
}

export interface ListBase extends List {
  items: Array<Base>;
}

export interface ListStaff extends List {
  items: Array<Staff>;
}

export interface ListCompany extends List {
  items: Array<Company>;
}

export interface ListSupplier extends List {
  items: Array<Supplier>;
}

export declare type Supplier = {
  supplierCd: string;
  supplierName: string;
  supplierNameKana?: string;
  tel?: string;
  postCd?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address?: string;
};

export declare type Staff = {
  id: number;
  staffName: string;
  staffNameKana: string;
  roleDiv: number;
  companyCd: string;
  companyName: string;
  createdAt?: string;
  updatedAt?: string;
};

export declare type News = {
  title: string;
  publicationStartDate: Date;
  id: number;
  error?: boolean;
};

export declare type CommercialFlows = {
  id: numer;
  companyId: number;
  tradingCompany1: string;
  tradingCompany2: string;
  tradingCompany3: string;
  tradingCompany4: string;
};

export declare type ItemGroup = {
  id: numer;
  itemName: string;
  iconFileName: string;
  displayDiv: numer;
  supplierName: string;
  commercialFlows: CommercialFlows[];
};

export declare type DivValue = {
  divValue: string;
  divValueName: string;
};

export declare type CompanyBase = {
  id: number;
  baseName: string;
  telNumber: strng;
  address1: string;
};
export interface ListOrder extends List {
  items: Array<any>;
}
export interface ItemDetailOrder extends ItemDetail {
  product;
  productDetailCd: string;
  desireQuantity: number;
  itemGroupId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetails {
  thickness: number;
  length: string;
  quantityPerPack: number;
  width: number;
  createdAt?: string;
  updatedAt?: string;
  productCd: string;
  productDetailCd: string;
  gradeStrength: string;
  desireQuantity: number;
  productName: string;
  itemVolume: number;
}
export interface ChangLogs {
  id: number;
  actionDiv: number;
  companyName: string;
  userName: string;
  memo: string;
  createdAt: string;
}

export interface ReMarks {
  lastModified: string;
  companyName: string;
  userName: string;
  remarks: string;
}
export interface ListOrderDetail {
  id: number;
  staffId: number;
  productDetails: Array<ProductDetails>;
  itemDetails: Array<ItemDetailOrder>;
  actions: ChangLogs[];
  baseId: number;
  baseName: string;
  mixedLoadingFlag: boolean;
  destinationId: number;
  memo: string;
  itemGroupDisplayDiv: number;
  itemGroupName: string;
  orderQuantity: number;
  tradingCompany: string;
  replyDeadline?: string;
  requestedDeadline: string;
  statusDiv: number;
  supplierName: string;
  updatedAt?: string;
  createdAt?: string;
  vehicleClassDiv: string;
  temporalyFlag: boolean;
  baseTelNumber: string;
  baseAddress1: string;
  itemCd: string;
  supplierCd: string;
}
export interface RequestDetails {
  requestDeadline?: string;
  replyDeadline?: string;
  baseName?: string;
  tradingCompany?: string;
  combinedPile?: boolean;
  totalCubicMeter?: number;
  vehicleClassDiv?: string;
}

export declare type OrderAction = {
  id: 0;
  actionDiv: 0;
  companyName: string;
  userName: string;
  memo: string;
  createdAt: string; //date
};
export declare type OrderProductDetail = {
  id: number;
  width: number;
  thickness: number;
  length: number;
  quantityPerPack: number;
  quantity: number;
  desireQuantity: number;
  gradeStrength: string;
  productName: string;
  itemVolume: number;
  productCd: string;
  productDetailCd: string;
};
export declare type Order = {
  id: number;
  statusDiv: number;
  createdAt: string; // date
  updatedAt: string; // date
  requestedDeadline: string; // date
  replyDeadline: string; // string
  destinationId: numner;
  baseName: string;
  mixedLoadingFlag: boolean;
  vehicleClassDiv: string;
  orderQuantity: number;
  memo: string;
  staffId: number;
  itemDisplayDiv: string;
  itemName: string;
  supplierName: string;
  productDetails: OrderProductDetail[];
  actions: OrderAction[];
  companyName: string;
  itemCd: string;
  commercialFlowId: string;
  tradingCompany: string;
  temporalyFlag: boolean;
};
