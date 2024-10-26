'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { ICONS } from '@/app/assets/icons';
import { ITEMGROUP } from '@/lib/constants';
import { CommercialFlows, ItemGroup } from '@/app/types/entities';
import { useRouter } from 'next/navigation';
import { DataOfCompanies } from '@/app/components/SelectSearch';

interface CompanyProps {
  companyName: string;
  companyID: string;
}
interface ProductsItemProps {
  id: string;
  itemName: string;
  iconFileName: string;
  supplierName: string;
  displayDiv: number;
  commercialFlows: Array<CommercialFlows>;
  setOpenSelectionCompanyModal: Dispatch<SetStateAction<boolean>>;
  setItemGroupSelected: (id: number) => void;
}

const ProductsItem: React.FC<ProductsItemProps> = ({
  id,
  itemName,
  iconFileName,
  supplierName,
  commercialFlows,
  setOpenSelectionCompanyModal,
  setItemGroupSelected,
}) => {
  const router = useRouter();
  const handleProduct = (id: number) => {
    const tradingCompanies: (string | null)[] = [];

    commercialFlows.forEach(flow => {
      tradingCompanies.push(
        ...[
          flow.tradingCompany1,
          flow.tradingCompany2,
          flow.tradingCompany3,
          flow.tradingCompany4,
        ].filter(td => !!td),
      );
    });

    if (tradingCompanies.length > 1) {
      setItemGroupSelected(id);
      setOpenSelectionCompanyModal(true);
    } else {
      const params = new URLSearchParams();
      params.set('flowId', commercialFlows[0].id);

      if (tradingCompanies[0]) {
        params.set('tradingCompany', tradingCompanies[0] || '');
      }

      params.set('itemGroupId', (id || '').toString());

      router.push(`/orders/new-entry?${params.toString()}`);
    }
  };

  return (
    //
    //
    <div
      key={id}
      className="w-[196px] min-h-[190px] box-border mr-[65px] mb-[60px] rounded-lg border-[3px] border-[#CFCFCF] block cursor-pointer "
      onClick={() => handleProduct(+id)}
    >
      <div className="w-[122px] h-[122px] flex mx-[37px] mt-[16px]">
        {+iconFileName == ITEMGROUP.ITEM1 ? (
          <Image
            src={ICONS.ITEM1}
            className="mx-auto"
            width={80}
            height={80}
            alt={itemName}
          />
        ) : (
          <Image
            src={ICONS.ITEM2}
            className="mx-auto"
            width={80}
            height={80}
            alt={itemName}
          />
        )}
      </div>

      <div className="w-full text-[#444] not-italic font-noto-sans-jp text-base font-bold tracking-[0.96px] leading-4 text-center mb-[7px] px-4">
        {itemName}
      </div>
      <div className="w-full text-[#444] not-italic font-noto-sans-jp text-base font-bold tracking-[0.96px] leading-4 text-center mb-[19px] px-4">
        {supplierName}
      </div>
    </div>
  );
};

export default ProductsItem;
