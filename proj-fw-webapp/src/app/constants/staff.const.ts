export const STAFF_INPUT = {
  STAFFNAME: {
    MAX: 128,
    LABEL: '担当者名',
  },
  STAFFNAME_PRONUNCIATION: {
    MAX: 128,
    LABEL: '担当者名（フリガナ）',
  },
  COMPANY: {
    LABEL: 'PC工場名',
  },
  STAFF_ID: {
    LABEL: '担当者ID',
    MIN: 5,
    MAX: 50,
  },
};
export enum STAFF_ROLE {
  ADMIN = 1,
  PC,
  FW,
  SUPPLIER,
}