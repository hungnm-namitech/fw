import SectionTitle from '@/app/components/SectionTitle';
import { ChangLogs } from '@/app/types/entities';
import React, { useState } from 'react';
import moment from 'moment';

interface RemarksProps {
  marks: ChangLogs[] | undefined;
}

export default function RemarksColumn({ marks }: RemarksProps) {
  const [toggleRemark, setToggleRemark] = useState(true);

  return (
    <div id="remarks-column-list" className="mt-[25px] ">
      <SectionTitle
        toggleClose={() => setToggleRemark(!toggleRemark)}
        title="備考欄"
        className=" max-h-[56px] border-b-[1px] border-b-[#3C6255] flex items-center border-l-[#61876E] bg-[#F5F5F5] justify-between pr-5"
        btnClose={toggleRemark ? '閉じる' : '開く'}
        toggle={toggleRemark}
      />
      {toggleRemark && (
        <div className=" text-sm mt-[25px] font-normal">
          <table className="table-auto w-full ">
            <thead>
              <tr className="bg-[#F5F7F8] h-9 text-left">
                <th className="min-w-[160px] pl-3">
                  <p className="tracking-[0.07px] leading-2 pt-[7px] font-normal pb-[5px]">
                    最終更新日時
                  </p>
                </th>
                <th className="min-w-[160px] pl-3">
                  <p className="tracking-[0.07px] leading-2 pt-[7px] font-normal pb-[5px]">
                    会社名
                  </p>
                </th>
                <th className="min-w-[160px] pl-3">
                  <p className="tracking-[0.07px] leading-2 pt-[7px] font-normal pb-[5px]">
                    ユーザー名
                  </p>
                </th>
                <th className="pl-3 ">
                  <p className="tracking-[0.07px] leading-2 pt-[7px] font-normal pb-[5px]">
                    備考
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {marks?.map((mark: ChangLogs) => (
                <tr
                  key={mark.id}
                  className="border-y-[1px] border-b-[#CAD5DB] min-h-[42px] pt-1 pb-[5px]"
                >
                  <td className="min-w-[160px] text-left pl-3">
                    <p className="tracking-[0.07px] leading-2 pt-[7px] pb-[5px] ">
                      {moment(mark.createdAt).format('YYYY年MM月DD日 H:mm')}
                    </p>
                  </td>
                  <td className="min-w-[160px] text-left pl-3">
                    <p className="tracking-[0.07px] leading-2 pt-[7px] pb-[5px] ">
                      {mark.companyName}
                    </p>
                  </td>
                  <td className="min-w-[160px] text-left pl-3">
                    <p className="tracking-[0.07px] leading-2 pt-[7px] pb-[5px] ">
                      {mark.userName}
                    </p>
                  </td>
                  <td className="text-left pl-3">
                    <p className="tracking-[0.07px] leading-2 pt-[7px] pb-[5px] whitespace-pre-line">
                      {mark.memo}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
