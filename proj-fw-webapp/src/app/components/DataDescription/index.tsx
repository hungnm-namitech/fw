import React from 'react';

interface DataDescriptionProps {
  label: string;
  value: string;
  unit: string;
}

export function DataDescription({ label, value, unit }: DataDescriptionProps) {
  return (
    <div className="flex items-center pb-[15px] pt-[26px] border-b-[1px] border-solid border-[#393642] ">
      <p className="text-3xl font-bold leading-normal font-noto-sans-jp text-brown w-[60%]">
        {label}
      </p>
      <p className="text-3xl text-black font-noto-sans-jp  font-bold w-[50%] leading-[39px] h-[46px] pl-[26px]">
        {value}
        <span className="text-3xl">{unit}</span>
      </p>
    </div>
  );
}
