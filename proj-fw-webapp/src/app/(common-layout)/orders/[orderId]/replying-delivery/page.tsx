import PageHeader from '@/app/components/PageHeader';
import React from 'react';
import { CommonPageContent } from '@/app/components/CommonPageContent';
import OrderReplyingDelivery from '@/app/molecules/OrderReplyingDelivery';

export default function ReplyingDelivery() {
  return (
    <div className="w-full">
      <PageHeader title="ホーム" />
      <CommonPageContent>
        <div className="pt-[19px] pl-[30px] pr-[24px]">
          <OrderReplyingDelivery />
        </div>
      </CommonPageContent>
    </div>
  );
}
