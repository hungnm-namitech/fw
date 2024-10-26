import React, { useMemo } from 'react';
import Chip from '../../components/Chip';
import { USER_ROLE } from '@/lib/constants';
import clsx from 'clsx';

interface OrderStatusProps {
  statusDiv: keyof typeof STATUS_CHIPS;
  type: keyof typeof STATUS_MAPPING;
  size?: 'md' | 'lg';
}

enum CHIP_IDS {
  ORDER_NOT_CONFIRMED = 1,
  DELIVERY_DATE_UNDETERMINED,
  DELIVERY_DATE_CHANGE,
  APPLICATION_CHANGE,
  DELIVERY_DATE_ANSWERD,
  DELIVERED,
  CANCELLATION_REQUEST,
  CANCELLATION_APPROVAL,
  CANCELED,
}

const BIG_SIZE_CLASSNAME = 'text-[22px] py-[9px] px-[23px]';

const STATUS_CHIPS = {
  [CHIP_IDS.ORDER_NOT_CONFIRMED]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#CCFFFF] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      発注未確定
    </Chip>
  ),
  [CHIP_IDS.DELIVERY_DATE_UNDETERMINED]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#CFC] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      納期未確定
    </Chip>
  ),
  [CHIP_IDS.DELIVERY_DATE_CHANGE]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#FFC] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      納期変更申請
    </Chip>
  ),
  [CHIP_IDS.APPLICATION_CHANGE]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#FFE5CC] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      変更申請
    </Chip>
  ),
  [CHIP_IDS.DELIVERY_DATE_ANSWERD]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#61876E] text-[#FFF]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      納期回答済み
    </Chip>
  ),
  [CHIP_IDS.DELIVERED]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#101010] text-[#FFF]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      納品済
    </Chip>
  ),
  [CHIP_IDS.CANCELLATION_REQUEST]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#EEE] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      キャンセル申請
    </Chip>
  ),
  [CHIP_IDS.CANCELED]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#424242] text-[#FFF]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      キャンセル済み
    </Chip>
  ),
  [CHIP_IDS.CANCELLATION_APPROVAL]: (size: OrderStatusProps['size']) => (
    <Chip
      className={clsx(`min-w-[90px] bg-[#8f8f8f] text-[#171717]`, {
        [BIG_SIZE_CLASSNAME]: size === 'lg',
      })}
    >
      キャンセル承認
    </Chip>
  ),
};

const STATUS_MAPPING = {
  [USER_ROLE.PC]: {
    1: CHIP_IDS.ORDER_NOT_CONFIRMED,
    2: CHIP_IDS.DELIVERY_DATE_UNDETERMINED,
    3: CHIP_IDS.DELIVERY_DATE_ANSWERD,
    4: CHIP_IDS.DELIVERY_DATE_CHANGE,
    5: CHIP_IDS.CANCELLATION_REQUEST,
    6: CHIP_IDS.CANCELLATION_APPROVAL,
    7: CHIP_IDS.CANCELED,
    8: CHIP_IDS.APPLICATION_CHANGE,
    9: CHIP_IDS.APPLICATION_CHANGE,
    10: CHIP_IDS.DELIVERED,
  },
  [USER_ROLE.FW]: {
    1: CHIP_IDS.ORDER_NOT_CONFIRMED,
    2: CHIP_IDS.DELIVERY_DATE_UNDETERMINED,
    3: CHIP_IDS.DELIVERY_DATE_ANSWERD,
    4: CHIP_IDS.DELIVERY_DATE_CHANGE,
    5: CHIP_IDS.CANCELLATION_REQUEST,
    6: CHIP_IDS.CANCELLATION_APPROVAL,
    7: CHIP_IDS.CANCELED,
    8: CHIP_IDS.APPLICATION_CHANGE,
    9: CHIP_IDS.APPLICATION_CHANGE,
    10: CHIP_IDS.DELIVERED,
  },
  [USER_ROLE.ADMIN]: {
    1: CHIP_IDS.ORDER_NOT_CONFIRMED,
    2: CHIP_IDS.DELIVERY_DATE_UNDETERMINED,
    3: CHIP_IDS.DELIVERY_DATE_ANSWERD,
    4: CHIP_IDS.DELIVERY_DATE_CHANGE,
    5: CHIP_IDS.CANCELLATION_REQUEST,
    6: CHIP_IDS.CANCELLATION_APPROVAL,
    7: CHIP_IDS.CANCELED,
    8: CHIP_IDS.APPLICATION_CHANGE,
    9: CHIP_IDS.APPLICATION_CHANGE,
    10: CHIP_IDS.DELIVERED,
  },
  [USER_ROLE.SUPPLIER]: {
    1: CHIP_IDS.ORDER_NOT_CONFIRMED,
    2: CHIP_IDS.DELIVERY_DATE_UNDETERMINED,
    3: CHIP_IDS.DELIVERY_DATE_ANSWERD,
    4: CHIP_IDS.DELIVERY_DATE_CHANGE,
    5: CHIP_IDS.CANCELLATION_REQUEST,
    6: CHIP_IDS.CANCELLATION_APPROVAL,
    7: CHIP_IDS.CANCELED,
    8: CHIP_IDS.APPLICATION_CHANGE,
    9: CHIP_IDS.APPLICATION_CHANGE,
    10: CHIP_IDS.DELIVERED,
  },
};

export default function OrderStatus({
  statusDiv,
  type,
  size = 'md',
}: OrderStatusProps) {
  const statusKeys = useMemo(() => STATUS_MAPPING[type] || {}, [type]);

  if (!STATUS_CHIPS[statusKeys[statusDiv] as keyof typeof STATUS_CHIPS])
    return null;

  return (
    <>
      {STATUS_CHIPS[statusKeys[statusDiv] as keyof typeof STATUS_CHIPS](size)}
    </>
  );

  // if (statusDiv === '')
}
