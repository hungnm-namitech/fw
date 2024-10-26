'use client';

import { Button } from '@/app/components/Button';
import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { checkActiveCreateDraftBtn } from '@/app/utils/orders';
import { SAVE_DRAFT } from '@/lib/constants';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface CreateOrderActions {
  form: UseFormReturn<TabularNewEntry | PulldownNewEntry, any, undefined>;
  onSubmit: (data: any) => void;
  onSaveDraft: (data: any) => void;
  requestedDeliveryDate?: Date;
  totalVolume?: number;
  transportVehicle?: string;
  onAfterReset?: () => void;
  isDraft: boolean | undefined;
  orderId: string | undefined;
  isEmptyOrder: boolean;
}

export default function CreateOrderActions({
  form,
  onSaveDraft,
  onSubmit,
  requestedDeliveryDate,
  totalVolume,
  onAfterReset,
  transportVehicle,
  isDraft,
  orderId,
  isEmptyOrder,
}: CreateOrderActions) {
  const el = useRef<null | HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    const bottomAction = document.getElementById('bottom-action');

    if (el.current) {
      bottomAction?.appendChild(el.current);
    }

    return () => {
      if (el.current) {
        bottomAction?.removeChild(el.current);
      }
    };
  }, []);

  if (!el.current) return null;
  const PortalNode = (children: any) => (
    <div className="bg-[#212B27] w-full h-[100px] fixed bottom-0 px-[56px] py-[22px] flex items-center justify-between ">
      <div>
        <button
          disabled={!checkActiveCreateDraftBtn(isDraft, isEmptyOrder, orderId)}
          onClick={form.handleSubmit(() => onSaveDraft(SAVE_DRAFT.SAVE_TEMP))}
          className={twMerge(
            clsx(
              'px-[35px] py-[16px] text-xl leading-normal text-dark-primary-contrast  border-[1px] border-solid rounded-1',
              {
                'bg-[#d3d3d3] border-[#d3d3d3] cursor-not-allowed':
                  !checkActiveCreateDraftBtn(isDraft, isEmptyOrder, orderId),
              },
            ),
          )}
        >
          一時保存
        </button>
        <button
          onClick={() => {
            form.reset();

            if (onAfterReset) {
              onAfterReset();
            }
          }}
          className="px-[45px] py-[16px] text-xl ml-3 leading-normal text-dark-primary-contrast  border-[1px] border-solid border-[#fff] rounded-1"
        >
          初期化
        </button>
      </div>
      <div className="flex gap-x-6   items-center">
        <p className="text-dark-primary-contrast text-md leading-[125%] font-noto-sans-jp flex items-baseline">
          納品希望日付
          <span className="text-2xl ml-2 min-w-[126px] block">
            {requestedDeliveryDate &&
              moment(requestedDeliveryDate).format('YYYY/MM/DD')}
          </span>
        </p>
        <p className="text-dark-primary-contrast text-md leading-[125%] font-noto-sans-jp flex items-baseline">
          車格
          <span className="text-2xl ml-2 min-w-[100px] block">
            {transportVehicle}
          </span>
        </p>
        <p className="text-dark-primary-contrast text-md leading-[125%] font-noto-sans-jp flex items-baseline">
          発注合計
          <span className="text-2xl ml-1 font-bold block">{totalVolume}㎥</span>
        </p>
        <Button onClick={form.handleSubmit(onSubmit)} className="!w-[130px]">
          決定
        </Button>
      </div>
    </div>
  );

  return createPortal(<PortalNode />, el.current);
}
