import React from 'react';

import './style.css';
import clsx from 'clsx';

export interface TabsProps {
  tabs: { value: string | number; label: string }[];
  value: string | number;
  tabClassName?: string;
}

export function Tabs({ tabs, value, tabClassName }: TabsProps) {
  return (
    <div className="w-full flex items-center ">
      {tabs.map(tab => (
        <div
          key={tab.value}
          className={clsx(
            `relative   tab after:h-full  after:content-[''] after:absolute after:top-0 after:right-0 `,
            tabClassName,
            {
              'after:border-l-darkPrimary after:border-l-solid ':
                tab.value === value,
              'after:border-l-tab after:border-l-solid': tab.value !== value,
            },
          )}
        >
          <p
            className={clsx(
              ' font-noto-sans-jp text-xl font-bold leading-[125%] w-full text-center m-0 pt-[11px] pb-3   ',
              {
                'bg-darkPrimary text-dark-primary-contrast ':
                  tab.value === value,
                'bg-tab  ': tab.value !== value,
              },
            )}
          >
            {tab.label}
          </p>
        </div>
      ))}
    </div>
  );
}
