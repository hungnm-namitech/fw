import React, { PropsWithChildren } from 'react';

interface CommonPageContentProps extends PropsWithChildren {}

export function CommonPageContent({ children }: CommonPageContentProps) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-auto w-full">{children}</div>
  );
}
