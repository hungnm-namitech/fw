'use client';

import React, { PropsWithChildren, useCallback, useState } from 'react';
import CommonMenu from '@/app/organisms/CommonMenu';
import CLSX from 'clsx';

interface CommonLayoutProps extends PropsWithChildren {}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const [expend, setExpend] = useState(true);

  const collapseExpend = useCallback(() => {
    setExpend(e => !e);
  }, []);

  return (
    <div className="relative">
      <CommonMenu
        wrapperClass={CLSX({ 'w-[240px]': expend, 'w-[100px]': !expend })}
        onCollapse={collapseExpend}
        expend={expend}
      />
      <div
        className={CLSX('transition-all duration-500', {
          'ml-[240px] w-[100vw-240px]': expend,
          'ml-[100px] w-[100vw-100px]': !expend,
        })}
      >
        {children}
      </div>
      <div id="bottom-action"></div>
    </div>
  );
};

export default CommonLayout;
