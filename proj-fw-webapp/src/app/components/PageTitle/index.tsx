import React from 'react';

interface IPageTitleProps {
  title: string;
  className?: string;
}

const PageTitle: React.FC<IPageTitleProps> = ({ title, className }) => {
  return (
    <div
      className={
        'pb-[15px] border-b-[2px] w-full flex-shrink-0 border-solid border-border ' +
        className
      }
    >
      <p className="font-bold leading-[125%] text-3xl">{title}</p>
    </div>
  );
};

export default PageTitle;
