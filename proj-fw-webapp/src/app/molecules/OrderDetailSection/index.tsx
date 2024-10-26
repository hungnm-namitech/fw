import { Modal } from '@/app/components/Modal';
import SectionTitle from '@/app/components/SectionTitle';
import { Company, CompanyBase, DivValue } from '@/app/types/entities';
import moment from 'moment';
import React, { useState } from 'react';

interface OrderDetailSectionProps {
  deliveryDate?: string;
  location?: CompanyBase;
  selectedDiv?: DivValue;
  selectedCompany?: Company;
  combinedPile?: boolean;
  totalOrderVolume?: number;
  tradingCompany: string;
  replyDeadline?: string;
}

export default function OrderDetailSection({
  deliveryDate,
  location,
  selectedDiv,
  combinedPile,
  totalOrderVolume,
  tradingCompany,
  replyDeadline,
}: OrderDetailSectionProps) {
  const [showShippingDetail, setShowShippingDetail] = useState(false);

  return (
    <>
      <div id="ordered-detail" className="mt-[30px]">
        <SectionTitle title="依頼内容" className="border-l-[#61876E]" />
        <div className="mt-[23px] ml-[10px] mr-[29px] ">
          <div className="flex items-center flex-wrap  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  h-[24px] min-w-[200px]">
              納品希望日
            </p>
            <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black h-[24px]">
              {deliveryDate && moment(deliveryDate).format('yyyy年MM月DD日')}
            </p>
            <div className="flex justify-around flex-1">
              <p className="font-normal leading-2 ml-16">納品回答日</p>
              <p className="font-normal leading-2 ml-16">
                {replyDeadline &&
                  moment(replyDeadline).format('YYYY年MM月DD日')}
              </p>
            </div>
          </div>
          <div className="flex  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  min-h-[24px] min-w-[200px]">
              降ろし先
            </p>
            <div className="flex">
              <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black min-h-[24px] max-w-[50%] break-all">
                {location && location.baseName}
              </p>
              <div className="">
                <button
                  onClick={() => setShowShippingDetail(true)}
                  className="pt-[5px] pb-[6px] pl-4 pr-5 border-[1px] border-primary rounded-0.5 ml-[88px]"
                >
                  詳細表示
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  h-[24px] min-w-[200px]">
              商社経由
            </p>
            <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black h-[24px]">
              {tradingCompany}
            </p>
          </div>
          <div className="flex items-center flex-wrap  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  h-[24px] min-w-[200px]">
              合積み
            </p>
            <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black h-[24px]">
              {combinedPile && '可'}
            </p>
          </div>
          <div className="flex items-center flex-wrap  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  h-[24px] min-w-[200px]">
              車格希望
            </p>
            <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black h-[24px]">
              {selectedDiv && selectedDiv.divValueName}
            </p>
          </div>
          <div className="flex items-center flex-wrap  py-[12px] border-b-[1px] border-b-border border-solid">
            <p className="text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  h-[24px] min-w-[200px]">
              合計立米数
            </p>
            <p className="ml-[65px] leading-2 tracking-[0.08px] text-md font-inter text-text-black h-[24px]">
              {+(totalOrderVolume?.toFixed(4) || '')}㎥
            </p>
          </div>
        </div>
      </div>
      <Modal
        className="w-[695px] min-h-[185px] !outline-none"
        onClose={() => setShowShippingDetail(false)}
        open={showShippingDetail}
      >
        <div className="mt-10 ml-[31px] mr-[29px]">
          <table className="w-full">
            <thead>
              <tr>
                <td className="min-w-[140px] pb-[21px] pt-2 border-b-[1px] border-solid border-border font-bold text-md leading-2 tracking-[0.08px] font-noto-sans-jp">
                  電話番号
                </td>
                <td className="pb-[21px] pt-2 border-b-[1px] border-solid border-border text-sm font-noto-sans-jp tracking-[0.07px] leading-[22px] text-text-black">
                  {location?.telNumber}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="min-w-[140px] pb-[21px] pt-2 border-b-[1px] border-solid border-border font-bold text-md leading-2 tracking-[0.08px] font-noto-sans-jp">
                  住所１
                </td>
                <td className="pb-[21px] pt-2 border-b-[1px] border-solid border-border text-sm font-noto-sans-jp tracking-[0.07px] leading-[22px] text-text-black">
                  {location?.address1}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
