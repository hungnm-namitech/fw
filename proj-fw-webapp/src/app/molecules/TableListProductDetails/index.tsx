import React from 'react';

export interface TableListProductDetailsProps {
  products: {
    productName: string;
    totalVolume: number;
    supplierName: string;
    totalQuantityPerPack: number;
    items: {
      productName: string;
      gradeStrength: string;
      width: number;
      thickness: number;
      length: number;
      desireQuantity: number;
      quantityPerPack: number;
      totalVolume: number;
    }[];
  }[];
}

export default function TableListProductDetails({
  products,
}: TableListProductDetailsProps) {
  return (
    <table className="table w-full border-collapse border-spacing-0	h-[1px]">
      {products.map((product, i) => (
        <React.Fragment key={i}>
          <tr className=" table-row col-span-3    ">
            <td colSpan={3} className="  table-cell col-span-3  mb-[23px] p-0">
              <div className="flex items-center justify-between  ml-[20px] mt-[28px]">
                <p className="font-inter text-md font-bold leading-[22px] text-gray">
                  {product.productName} ({product.supplierName})
                </p>
                <p className="text-md font-bold leadinig-[22px] -tracking-[0.32px] font-inter text-gray">
                  計：{+product.totalQuantityPerPack.toFixed(4)} 本{' '}
                  {+product.totalVolume.toFixed(4)} ㎥
                </p>
              </div>
            </td>
          </tr>
          {product.items.map((item, index) => (
            <tr className="  items-center flex-wrap  py-[12px]" key={index}>
              <td className="table-cell pl-[30px] p-0 w-auto max-w-[300px] h-full">
                <div className=" pb-[12px] pt-[12px] h-full border-b-[1px] w-auto border-b-border border-b-solid">
                  <p className=" text-gray font-bold font-inter -tracking[0.32px] leading-[22px] text-md  ">
                    {item.productName} ({item.gradeStrength})
                  </p>
                </div>
              </td>
              <td className="table-cell  p-0 h-full">
                <div className="pb-[12px] pt-[12px] h-full border-b-[1px] border-b-border border-b-solid">
                  <p className=" flex tracking-[0.08px] text-md font-inter text-text-black  leading-[22px]  p-0 items-baseline gap-[10px]">
                    <span>
                      {item.width}
                      <span>x</span>
                      {item.thickness}
                      <span>x</span>
                      {item.length}
                    </span>
                    <span>x</span>
                    <span>{item.desireQuantity} BDL</span>
                    <span>({item.quantityPerPack}本)</span>
                  </p>
                </div>
              </td>
              <td className="table-cell p-0 h-full">
                <div className="pb-[12px] pt-[12px] h-full  border-b-[1px] border-b-border border-b-solid flex justify-end">
                  <p className="table-cell text-end  leading-[22px] tracking-[0.08px] text-md font-inter w-full text-text-black ">
                    {+item.totalVolume.toFixed(4)} ㎥
                  </p>
                </div>
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </table>
  );
}
