import { ICONS } from '@/app/assets/icons';
import { Button } from '@/app/components/Button';
import {
  checkActiveApprovalOrdDetail,
  checkActiveRejectionOrdDetail,
  checkActiveDelOrdDetail,
  checkActiveBtnOrdDraft,
} from '@/app/utils/orders';
import { ORDER_ACTION_DIV, ORDER_STATUS_DIV, USER_ROLE } from '@/lib/constants';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface IButtonGroup {
  handleBtn1: () => void;
  handleBtn2: () => void;
  handleBtn3: () => void;
  btn1: string;
  btn2: string;
  btn3: string;
  classWrapBtn?: string;
  className1?: string;
  className2?: string;
  className3?: string;
  isBtnBottom?: boolean;
  iconTrash?: string;
  statusDiv: ORDER_STATUS_DIV | undefined;
  role: USER_ROLE;
  isDraft: boolean | undefined;
}

const ButtonGroup = ({
  handleBtn1,
  handleBtn2,
  handleBtn3,
  classWrapBtn,
  btn1,
  btn2,
  btn3,
  className1,
  className2,
  className3,
  isBtnBottom,
  iconTrash,
  statusDiv,
  role,
  isDraft,
}: IButtonGroup) => {
  return (
    <div className={clsx('flex w-full', classWrapBtn)}>
      {((isDraft !== undefined && checkActiveBtnOrdDraft(isDraft, role)) ||
        (role === USER_ROLE.SUPPLIER &&
          statusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM)) && (
        <>
          <Button
            onClick={handleBtn1}
            className={clsx(className1, {
              'bg-[#cdcdcd] cursor-not-allowed':
                (statusDiv &&
                  !checkActiveApprovalOrdDetail(statusDiv, role) &&
                  !isBtnBottom) ||
                (statusDiv &&
                  isBtnBottom &&
                  !checkActiveRejectionOrdDetail(statusDiv, role)),
            })}
          >
            {btn1}
          </Button>
          <Button
            onClick={handleBtn2}
            className={clsx(className2, {
              'bg-[#cdcdcd] cursor-not-allowed text-white border-0':
                (statusDiv &&
                  !checkActiveRejectionOrdDetail(statusDiv, role) &&
                  !isBtnBottom) ||
                (statusDiv &&
                  !checkActiveApprovalOrdDetail(statusDiv, role) &&
                  isBtnBottom),
            })}
          >
            {btn2}
          </Button>
        </>
      )}
      {!!iconTrash ? (
        <div
          onClick={handleBtn3}
          className={clsx(
            `flex gap-[6.5px] justify-center bg-[#C53F3F] text-white rounded-1 py-[17px] px-[39.5px] w-full font-bold ${className3}`,
            {
              'cursor-pointer':
                statusDiv && checkActiveDelOrdDetail(statusDiv, role),
              'bg-[#d3d3d3] cursor-not-allowed':
                statusDiv && !checkActiveDelOrdDetail(statusDiv, role),
            },
          )}
        >
          <Image
            height={15.75}
            width={18}
            src={iconTrash}
            alt="注文キャンセル"
          />
          <span className='min-w-[112px]'>{btn3}</span>
        </div>
      ) : (
        <Button onClick={handleBtn3} className={className3}>
          {btn3}
        </Button>
      )}
    </div>
  );
};

export default ButtonGroup;
