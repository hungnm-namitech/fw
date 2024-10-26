import SectionTitle from '@/app/components/SectionTitle';
import { RequestDetails } from '@/app/types/entities';
import React, { useCallback } from 'react';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import * as DivValues from '@/app/api/entities/div-values';
interface PropRequesDetail {
  requestDetails: RequestDetails | undefined;
  handleShippingDetail: () => void;
}

const RequestDetail = ({
  requestDetails,
  handleShippingDetail,
}: PropRequesDetail) => {
  const { data } = useSession();
  const { data: divValues, isLoading: isDivValuesLoading } = useSWR(
    'all-div-values',
    useCallback(() => DivValues.all(''), [data?.user?.accessToken || '']),
  );
  const selectedDiv = divValues?.find(
    div => div.divValue === requestDetails?.vehicleClassDiv?.trim()?.toString(),
  );

  return (
    <div id="request-details-list" className="mt-[25px] ">
      <SectionTitle
        title="依頼内容"
        className=" min-h-[56px] border-b-[1px] border-b-[#3C6255] flex items-center border-l-[#61876E] bg-[#F5F5F5]"
      />
      <div className="text-base mt-[25px] ml-[10px]">
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px]">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            納品希望日
          </p>
          <p className="font-normal leading-2 min-w-[144px]">
            {requestDetails?.requestDeadline
              ? moment(requestDetails?.requestDeadline).format('YYYY年MM月DD日')
              : ''}
          </p>
          <div className="flex justify-around w-full">
            <p className="font-normal leading-2 ml-16">納品回答日</p>
            <p className="font-normal leading-2 ml-16">
              {requestDetails?.replyDeadline
                ? moment(requestDetails?.replyDeadline).format('YYYY年MM月DD日')
                : ''}
            </p>
          </div>
        </div>
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px] ">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            降ろし先
          </p>
          <div className="relative w-full flex gap-18">
            <p className="font-normal leading-2 max-w-[50%] break-all">
              {requestDetails?.baseName}
            </p>
            <span
              onClick={handleShippingDetail}
              className="border border-[#3C6255] text-[#3C6255] pt-[5px] pb-[6px] pr-[20px] pl-[16px] mt-[-7px] mb-[-6px] rounded-sm cursor-pointer max-h-[37px]"
            >
              詳細表示
            </span>
          </div>
        </div>
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px]">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            商社経由
          </p>
          <p className="font-normal leading-2">
            {requestDetails?.tradingCompany || ''}
          </p>
        </div>
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px]">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            合積み
          </p>
          <p className="font-normal leading-2">
            {requestDetails?.combinedPile ? '可' : '不可'}
          </p>
        </div>
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px]">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            車格希望
          </p>
          <p className="font-normal leading-2">{selectedDiv?.divValueName}</p>
        </div>
        <div className="min-h-[49px] py-3 border-b-[1px] border-[#E1E7EB] flex tracking-[0.08px]">
          <p className="min-w-[200px] mr-[66px] font-bold leading-2 text-[#6B6B6B]">
            合計立米数
          </p>
          <p className="font-normal leading-2">
            {requestDetails?.totalCubicMeter}㎥
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
