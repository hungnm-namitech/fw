import { ITEMGROUP } from './../../../lib/constants';
import { ICONS } from '@/app/components/assets/icons';
import { PAGES } from '@/app/constants/common.const';

interface Item {
  link: string;
  icon: string;
  label: string;
}

export const ITEMS: Item[] = [
  {
    icon: ICONS.FILE_LARGE,
    label: '材料の新規発注',
    link: PAGES.ITEM_GROUPS,
  },
  {
    icon: ICONS.FILE_LARGE,
    label: '発注一覧',
    link: PAGES.ORDERS,
  },
];
