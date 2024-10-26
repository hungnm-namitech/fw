export enum USER_ORDER_BY {
  USER_ID = 'userId',
  USER_NAME = 'username',
  ROLE_DIV = 'roleDiv',
  MAIL_ADDRESS = 'mailAddress',
  TEL = 'tel',
  COMPANY_NAME = 'companyName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const REGEX_PHONE_JP =
  /^(?=(?:\d{1,4}-){2}\d{1,5}$)[\d-]{1,13}$/;

export const REGEX_KATAGANA = /^([ァ-ン]|ー)+$/;
