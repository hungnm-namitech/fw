import React from 'react';
import Chip from '../../components/Chip';
import clsx from 'clsx';

interface OrderActionChipProps {
  actionDiv: keyof typeof STATUS_MAPPING;
  size?: 'sm' | 'md' | 'lg';
}

enum CHIP_IDS {
  ORDER_CONFIRMED = 1,
  AVAILABLE_TO_PROMISE,
  DELIVERY_DATE_CHANGE,
  ORDER_CHANGE,
  APPROVAL,
  REJECTION,
  CANCEL,
  REGISTRATION,
}

const MEDIUM_SIZE = 'text-[11px] rounded-[30px] ';

const STATUS_CHIPS = {
  [CHIP_IDS.ORDER_CONFIRMED]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx(`min-w-[75px] bg-[#CCFFFF] text-[#171717]`, {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      発注確定
    </Chip>
  ),
  [CHIP_IDS.AVAILABLE_TO_PROMISE]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx(`min-w-[75px] bg-[#CFC] text-[#171717]`, {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      納期回答
    </Chip>
  ),
  [CHIP_IDS.DELIVERY_DATE_CHANGE]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx(`min-w-[75px] bg-[#FFC] text-[#171717]`, {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      納期変更
    </Chip>
  ),
  [CHIP_IDS.ORDER_CHANGE]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx('min-w-[75px] bg-[#FFE5CC] text-[#171717]', {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      発注変更
    </Chip>
  ),
  [CHIP_IDS.APPROVAL]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx('min-w-[75px] bg-[#61876E] text-[#fff]', {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      承認
    </Chip>
  ),
  [CHIP_IDS.REJECTION]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx('min-w-[75px] bg-[#C53F3F] text-[#fff]', {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      否決
    </Chip>
  ),
  [CHIP_IDS.CANCEL]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx('min-w-[75px] bg-[#888279] text-[#fff]', {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      キャンセル
    </Chip>
  ),
  [CHIP_IDS.REGISTRATION]: (size: OrderActionChipProps['size']) => (
    <Chip
      className={clsx('min-w-[75px] bg-[#1f332c] text-[#fff]', {
        [MEDIUM_SIZE]: size === 'sm',
      })}
    >
      納品登録
    </Chip>
  ),
};

const STATUS_MAPPING = {
  1: CHIP_IDS.ORDER_CONFIRMED,
  2: CHIP_IDS.APPROVAL,
  3: CHIP_IDS.REJECTION,
  4: CHIP_IDS.AVAILABLE_TO_PROMISE,
  5: CHIP_IDS.DELIVERY_DATE_CHANGE,
  6: CHIP_IDS.APPROVAL,
  7: CHIP_IDS.REJECTION,
  8: CHIP_IDS.CANCEL,
  9: CHIP_IDS.APPROVAL,
  10: CHIP_IDS.APPROVAL,
  11: CHIP_IDS.REJECTION,
  12: CHIP_IDS.REJECTION,
  13: CHIP_IDS.ORDER_CHANGE,
  14: CHIP_IDS.APPROVAL,
  15: CHIP_IDS.APPROVAL,
  16: CHIP_IDS.REJECTION,
  17: CHIP_IDS.REJECTION,
  18: CHIP_IDS.REGISTRATION,
};

export default function OrderActionChip({
  actionDiv,
  size = 'md',
}: OrderActionChipProps) {
  if (!STATUS_CHIPS[STATUS_MAPPING[actionDiv]]) return '-';

  return <>{STATUS_CHIPS[STATUS_MAPPING[actionDiv]](size)}</>;

  // if (statusDiv === '')
}
