import { Button } from '@/app/components/Button';
import SectionTitle from '@/app/components/SectionTitle';
import { ChangLogs } from '@/app/types/entities';
import clsx from 'clsx';
import React, { useState } from 'react';
import moment from 'moment';
import { ORDER_ACTION_DIV, ORDER_STATUS_DIV } from '@/lib/constants';
import OrderActionChip from '../OrderActionChip';
interface ChangeLogsProps {
  logs: ChangLogs[] | undefined;
}

export default function ChangeLog({ logs }: ChangeLogsProps) {
  const [toggleLog, setToggleLog] = useState(true);
  const getTextAction = (action: ORDER_ACTION_DIV) => {
    switch (action) {
      case ORDER_ACTION_DIV.ORDER_CONFIRMATION:
        return '発注確定';
      case ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE:
        return '納期回答';
      case ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE:
        return '納期変更';
      case ORDER_ACTION_DIV.ORDER_CHANGE:
        return '発注変更';
      case ORDER_ACTION_DIV.APPROVAL ||
        ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_APPROVAL ||
        ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW ||
        ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_SUPPLIER ||
        ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW ||
        ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_SUPPLIER:
        return '承認';
      case ORDER_ACTION_DIV.REJECTION ||
        ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_REJECTION ||
        ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_FW ||
        ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_SUPPLIER ||
        ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_FW ||
        ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_SUPPLIER:
        return '否決';
      case ORDER_ACTION_DIV.CANCELLATION:
        return 'キャンセル';
      default:
        return '納品登録';
    }
  };

  return (
    <div id="change-log-list" className="mt-[25px] ">
      <SectionTitle
        toggleClose={() => {
          setToggleLog(!toggleLog);
        }}
        title="更新履歴"
        className=" min-h-[56px] border-b-[1px] border-b-[#3C6255] flex items-center border-l-[#61876E] bg-[#F5F5F5] relative"
        btnClose={toggleLog ? '閉じる' : '開く'}
        btnClassName="absolute right-5 top-[5.1px]"
        toggle={toggleLog}
      />
      {toggleLog && (
        <div className={' text-sm mt-[25px] font-normal'}>
          <table className="table-auto w-full ">
            <thead>
              <tr className="bg-[#F5F7F8] h-9 text-left">
                <th className="min-w-[140px]  pl-3">
                  <p className="pt-[7px] font-normal pb-[5px]">アクション</p>
                </th>
                <th className="min-w-[180px]  pl-3">
                  <p className="pt-[7px] font-normal pb-[5px]">最終更新日時</p>
                </th>
                <th className="min-w-[160px]  pl-3">
                  <p className="pt-[7px] font-normal pb-[5px]">会社名</p>
                </th>
                <th className="min-w-[160px] pl-3">
                  <p className="pt-[7px] font-normal pb-[5px]">ユーザー名</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {logs?.map(log => (
                <tr
                  key={log.id}
                  className="border-y-[1px] border-b-[#CAD5DB] min-h-[42px] pt-1 pb-[5px]"
                >
                  <td className="min-w-[140px] text-left pl-4 pr-[46px]">
                    <OrderActionChip
                      actionDiv={log.actionDiv as any}
                      key={log.id}
                      size="sm"
                    />
                  </td>
                  <td className="min-w-[180px] text-left pl-3">
                    <p className="pt-[7px] pb-[5px] ">
                      {moment(log.createdAt).format('YYYY年MM月DD日 H:mm')}
                    </p>
                  </td>
                  <td className="min-w-[160px] text-left pl-3">
                    <p className="pt-[7px] pb-[5px] ">{log.companyName}</p>
                  </td>
                  <td className="min-w-[160px] text-left pl-3">
                    <p className="pt-[7px] pb-[5px] ">{log.userName}</p>
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
