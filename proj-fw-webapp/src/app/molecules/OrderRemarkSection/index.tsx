import SectionTitle from '@/app/components/SectionTitle';
import { Order } from '@/app/types/entities';
import moment from 'moment';
import React from 'react';

interface OrderRemarkSectionProps {
  remarks?: string;
  username?: string;
  companyName?: string;
  order?: Order;
}

export default function OrderRemarkSection({
  remarks,
  companyName,
  username,
  order,
}: OrderRemarkSectionProps) {
  return (
    <div id="notice" className="mt-[30px]">
      <SectionTitle title="備考欄" className="border-l-[#61876E]" />
      <div className="mt-[25px]">
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-sm font-noto-sans-jp leading-2 tracking-[0.07px] text-text-black bg-gray pt-[7px] pb-[5px] w-[160px] pl-3  border-b-[1px] border-solid border-border">
                最終更新日時
              </td>
              <td className="text-sm font-noto-sans-jp leading-2 tracking-[0.07px] text-text-black bg-gray pt-[7px] pb-[5px] w-[160px] pl-3  border-b-[1px] border-solid border-border">
                会社名
              </td>
              <td className="text-sm font-noto-sans-jp leading-2 tracking-[0.07px] text-text-black bg-gray pt-[7px] pb-[5px] w-[160px] pl-3  border-b-[1px] border-solid border-border">
                ユーザー名
              </td>
              <td className="text-sm font-noto-sans-jp leading-2 tracking-[0.07px] text-text-black bg-gray pt-[7px] pb-[5px] pl-3  border-b-[1px] border-solid border-border">
                備考
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                {moment().format('yyyy年MM月DD日 hh:mm')}
              </td>
              <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                {companyName}
              </td>
              <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                {username}
              </td>
              <td className="pl-3 whitespace-pre-wrap font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black border-b-[1px] border-solid border-border py-[10px] align-top">
                {remarks}
              </td>
            </tr>

            {order?.actions.map(action => (
              <tr key={action.id}>
                <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                  {moment(action.createdAt).format('yyyy年MM月DD日 hh:mm')}
                </td>
                <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                  {action.companyName}
                </td>
                <td className="pl-3 font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black  border-b-[1px] border-solid border-border py-[10px] align-top">
                  {action.userName}
                </td>
                <td className="pl-3 whitespace-pre-wrap font-noto-sans-jp leading-2 tracking-[0.07px] text-sm text-text-black border-b-[1px] border-solid border-border py-[10px] align-top">
                  {action.memo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
