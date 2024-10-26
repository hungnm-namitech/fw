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
    label: '納期回答',
    link: PAGES.ORDERS,
  },
];
