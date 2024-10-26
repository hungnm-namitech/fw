export interface ISeederDataUser {
  userId: string;
  username: string;
  usernameKana: string;
  mailAddress: string;
  tel: string;
  roleDiv: string;
  password: string;
}

export interface ISeederItemGroup {
  supplierId: number;
  itemName: string;
  displayDiv?: number;
  trailer?: string;
  memo?: string;
  capacityMin: string;
  capacityMax: string;
  iconFileName?: string;
}

export class ISeederOrderHeader {
  itemGroupId: number;
  supplierId: number;
}

export class ISeederOrderDetail {
  itemGroupId: number;
  supplierId: number;
  purchasingAgent: string;
  vehicleClassDiv: string;
  destinationId: number;
  mixedLoadingFlag: boolean;
  requestedDeadline: Date;
  customerId: number;
  statusDiv: string;
  orderQuantity: number;
  memo?: string;
  createdBy?: number;
  temporalyFlag?: boolean;
  orderAmount?: number;
  replyDeadline?: Date;
  tradingCompany?: string;
}
