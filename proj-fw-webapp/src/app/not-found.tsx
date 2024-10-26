import React from 'react';

type Props = {};

export default function Custom403({}: Props) {
  return (
    <div className="flex gap-3 justify-center h-screen items-center text-black">
      <h1 className="font-bold text-[24px]">404</h1>
      <div className="h-5 bg-black w-[1px]"></div>
      <p className="text-[14px]">This page could not be found.</p>
    </div>
  );
}
