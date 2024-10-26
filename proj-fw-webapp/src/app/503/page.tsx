import React from 'react';

type Props = {};

export default function ServiceUnvailable({}: Props) {
  return (
    <div className="flex gap-3 justify-center h-screen items-center text-black">
      <h1 className="font-bold text-[24px]">503</h1>
      <div className="h-5 bg-black w-[1px]"></div>
      <p className="text-[14px]">
        Service Unavailable. The service is temporarily busy, try again later!
      </p>
    </div>
  );
}
