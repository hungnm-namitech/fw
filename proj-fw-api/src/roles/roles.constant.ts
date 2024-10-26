import { USER_ROLE } from 'src/constants/common';

export const ROLES_DIV: {
  value: USER_ROLE;
  label: string;
}[] = [
  { value: USER_ROLE.ADMIN, label: '管理者' },
  {
    value: USER_ROLE.PC,
    label: 'PC工場担当者',
  },
  {
    value: USER_ROLE.FW,
    label: 'FW購買担当者',
  },
  {
    value: USER_ROLE.SUPPLIER,
    label: 'サプライヤー',
  },
];
