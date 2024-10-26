'use client';
import { useEffect, useState } from 'react';
import InputTabOrderReplyingDelivery from './InputTabOrderReplyingDelivery';
import ConfirmTabOrderReplyingDelivery from './ConfirmTabOrderReplyingDelivery';
import CompleteTabOrderReplyingDelivery from './CompleteTabOrderReplyingDelivery';
import useSWR from 'swr';
import * as Orders from '@/app/api/entities/orders';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/app/components/Loader';
import { FormProvider, useForm } from 'react-hook-form';
import { Tabs } from '@/app/components/Tabs';
import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { yupResolver } from '@hookform/resolvers/yup';

export const enum STEP_TAB {
  INPUT_TAB,
  CONFIRM_TAB,
  COMPLETED_TAB,
}

export interface DetailOrdersProps {
  width: string;
  quantity: string;
  longitude: string;
  thickness?: string;
  quantityPerPack?: string;
}

interface StepTabProps {
  label: string;
  id: STEP_TAB;
}

const TABS = [
  {
    label: '納期回答入力',
    value: STEP_TAB.INPUT_TAB,
  },
  {
    label: '回答内容確認',
    value: STEP_TAB.CONFIRM_TAB,
  },
  {
    label: '納期回答完了',
    value: STEP_TAB.COMPLETED_TAB,
  },
];

const shema = Yup.object({
  // 回答納期: Yup.
  remarks: Yup.string().max(
    2000,
    createMessage(MESSAGES.NUMBER_DIGITS_OVERCHECK, '備考欄', 2000),
  ),
  deliveryDate: Yup.date().required(
    createMessage(MESSAGES.REQUIRED_INPUT, '回答納期'),
  ),
});

export default function OrderReplyingDelivery() {
  const params = useParams() as { orderId: string };
  const { data: session } = useSession();
  const router = useRouter();

  const stepTab: StepTabProps[] = [];

  const methods = useForm({ resolver: yupResolver(shema), mode: 'onChange' });

  const [tabIndex, setTabIndex] = useState<STEP_TAB>(STEP_TAB.INPUT_TAB);

  const { data: order, isLoading } = useSWR(
    'find-a-order',
    () => Orders.find(params.orderId, session?.user?.accessToken || ''),
    {
      onError: err => {
        if (
          err.response.status === 404 ||
          (err.response.status >= 500 && err.response.status < 600)
        ) {
          router.push('/404');
          return;
        }
        if (err.response.status === 403) {
          router.push('/403');
          return;
        }
        throw err;
      },
    },
  );

  useEffect(() => {
    if (order?.replyDeadline) {
      methods.setValue('deliveryDate', new Date(order?.replyDeadline));
    }
  }, [order, methods]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="bg-card flex flex-col font-noto-sans-jp">
        <div className="w-full mt-[28px] pr-[21px] pl-[27px] mb-[13px] flex justify-between items-center">
          <div className="text-gray-900 font-bold leading-[30px] text-[24px]">
            納期回答
          </div>
        </div>
        <div className="w-full h-[2px] pr-[21px] pl-[27px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
      </div>
      <div className="w-full pl-[119px] pr-[165px] h-12 flex mx-auto pt-[60px] pb-[72px] bg-card">
        <Tabs tabs={TABS} value={tabIndex} tabClassName="w-[33.33%]" />
      </div>
      <div>
        {order && (
          <FormProvider {...methods}>
            {tabIndex === STEP_TAB.INPUT_TAB && (
              <InputTabOrderReplyingDelivery
                onConfirm={() => setTabIndex(STEP_TAB.CONFIRM_TAB)}
                orderDetail={order}
              />
            )}

            {tabIndex === STEP_TAB.CONFIRM_TAB && (
              <ConfirmTabOrderReplyingDelivery
                cancelConfirm={() => setTabIndex(STEP_TAB.INPUT_TAB)}
                confirm={() => setTabIndex(STEP_TAB.COMPLETED_TAB)}
                orderDetail={order}
              />
            )}
            {tabIndex === STEP_TAB.COMPLETED_TAB && (
              <CompleteTabOrderReplyingDelivery
                cancelConfirm={() => setTabIndex(STEP_TAB.CONFIRM_TAB)}
                confirm={() => {}}
              />
            )}
          </FormProvider>
        )}
      </div>
    </div>
  );
}
