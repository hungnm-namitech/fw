'use client';

import React from 'react';
import moment from 'moment';
import CLSX from 'clsx';
import Image from 'next/image';
import { ICONS } from '@/app/components/assets/icons';
import * as News from '@/app/api/entities/news';
import useSWR from 'swr';
import Loader from '@/app/components/Loader';

interface ToppageNotificationsProps {
  accessToken?: string;
}

const ToppageNotifications: React.FC<ToppageNotificationsProps> = ({
  accessToken,
}) => {
  const { data: notifications, isLoading } = useSWR(
    'all-news',
    () => News.all(accessToken || ''),
    {},
  );

  if (isLoading) return <Loader />;

  const rowBorder = 'border-b-[1px] border-solid border-[#ACACAC]';

  return (
    <div className="pr-[103px]">
      <p className="h-[21px] text-text-black font-bold text-3xl leading-normal tracking-[1.44px] ml-[61px] ">
        お知らせ
      </p>
      <div className="ml-[239px] mt-12 table min-h-[59px] max-w-[810px]">
        {notifications?.map(notification => (
          <div key={notification.id} className="table-row ">
            <p
              className={CLSX(
                'table-cell align-top font-bold text-xl  tracking-[1.08px]  whitespace-nowrap pt-3 leading-normal font-roboto',
                rowBorder,
                {
                  'text-danger': notification.error,
                  'text-text-black': !notification.error,
                },
              )}
            >
              {moment(notification.publicationStartDate).format(
                'YYYY.MM.DD H:mm',
              )}
            </p>
            <div
              className={CLSX(
                'table-cell align-top pl-[45px] pt-3 w-full',
                rowBorder,
                {
                  'pt-[15px] pl-[36px]': notification.error,
                },
              )}
            >
              <div className="flex gap-3">
                {notification.error && (
                  <Image
                    alt="High severity"
                    className="w-[24px] h-[24px]"
                    src={ICONS.HIGH_SEVERITY}
                  />
                )}
                <p
                  className={CLSX(
                    'text-xl tracking-[1.08px]  pb-[14px] leading-[130%] ',
                    {
                      'text-danger font-bold min-h-[73px] ': notification.error,
                      'text-text-black min-h-[59px] ': !notification.error,
                    },
                  )}
                >
                  {notification.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToppageNotifications;
