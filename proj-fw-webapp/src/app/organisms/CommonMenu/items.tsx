import { ICONS } from '@/app/assets/icons';
import { USER_ROLE } from '@/lib/constants';
export interface Item {
  icon?: string;
  activeIcon?: string;
  label: string;
  path: string;
  children?: Omit<Item, 'children'>[];
  hasAnyRole?: number[];
  search?: string;
}

export const ITEMS: Item[] = [
  {
    icon: ICONS.HOME,
    activeIcon: ICONS.HOME_ACTIVE,
    label: 'ホーム',
    path: '/',
  },
  {
    icon: ICONS.FILE,
    activeIcon: ICONS.FILE_ACTIVE,

    label: '発注一覧',
    path: '/orders',
  },
  {
    icon: ICONS.SET,
    activeIcon: ICONS.SET,
    label: 'マスタメンテ',
    path: '/users',
    hasAnyRole: [USER_ROLE.FW, USER_ROLE.ADMIN, USER_ROLE.PC],
    children: [
      {
        icon:ICONS.USER,
        activeIcon: ICONS.USER_ACTIVE,
        label: 'ユーザマスタ',
        path: '/users',
        hasAnyRole: [USER_ROLE.FW, USER_ROLE.ADMIN],
      },
      {
        icon: ICONS.SUPPLIER,
        activeIcon: ICONS.SUPPLIER_ACTIVE,
        label: 'サプライヤマスタ',
        path: `/suppliers`,
        hasAnyRole: [USER_ROLE.FW, USER_ROLE.ADMIN],
      },
      {
        icon: ICONS.COMPANY,
        activeIcon: ICONS.COMPANY_ACTIVE,
        label: 'PC工場マスタ',
        path: '/companies',
        hasAnyRole: [USER_ROLE.FW, USER_ROLE.ADMIN],
      },
      {
        icon: ICONS.STAFF,
        activeIcon: ICONS.STAFF_ACTIVE,
        label: 'PC工場担当者マスタ',
        path: '/staffs',
        hasAnyRole: [USER_ROLE.FW, USER_ROLE.PC, USER_ROLE.ADMIN],
      },
      {
        icon: ICONS.BASE,
        activeIcon: ICONS.BASE_ACTIVE,
        label: 'PC工場卸し先マスタ',
        path: '/bases',
        hasAnyRole: [USER_ROLE.FW, USER_ROLE.PC, USER_ROLE.ADMIN],
      },
    ],
  },
];
