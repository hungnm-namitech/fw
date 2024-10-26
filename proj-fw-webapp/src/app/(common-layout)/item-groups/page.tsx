'use client';
import { useMemo, useState } from 'react';
import ProductsItem from './ProductsItem';
import SelectionCompaniesModal from '@/app/molecules/SelectionCompaniesModal';
import useSWR from 'swr';
import * as ItemGroup from '@/app/api/entities/itemsGroups';
import { useSession } from 'next-auth/react';
import { GroupBase, OptionsOrGroups } from 'react-select';
import PageHeader from '@/app/components/PageHeader';
import './style.scss';
import { CommercialFlows, ItemGroup as ItemGroups } from '@/app/types/entities';
import { DataOfCompanies } from '@/app/components/SelectSearch';
import Loader from '@/app/components/Loader';

export type ItemGroupSelected = Pick<
  ItemGroups,
  'id' | 'commercialFlows' | 'displayDiv'
>;

export default function ItemGroupsPage() {
  const { data: session } = useSession();
  const [openSelectionCompanyModal, setOpenSelectionCompanyModal] =
    useState<boolean>(false);

  const [itemGroupSelected, setItemGroupSelected] = useState<number>();

  const {
    data: itemGroups,
    error,
    isLoading,
  } = useSWR('item-groups', () =>
    ItemGroup.all(session?.user.accessToken || ''),
  );

  const selectedItem = useMemo(() => {
    if (!itemGroupSelected || !itemGroups) return null;

    return (
      itemGroups.find(itemGroup => +itemGroup.id === itemGroupSelected) || null
    );
  }, [itemGroupSelected, itemGroups]);

  if (isLoading) return <Loader />;
  return (
    <>
      <div className="w-full">
        <PageHeader title="ホーム" />
        <div className="h-[calc(100%-136px)]  w-[calc(100%-48px)] ml-[20px] mr-[28px] mb-[55px] mt-4 bg-white flex flex-col items-center">
          <div className="h-[30px] w-full mt-[26px] pr-[17px] mb-[17px] pl-6 flex justify-between	">
            <div className="text-gray-900 text-2xl font-bold leading-7">
              新規発注
            </div>
          </div>
          <div className="w-full px-6 h-[2px]">
            <div className="w-full h-full bg-[#CAD5DB]"></div>
          </div>
          <div className="h-[30px] w-full my-[80px] leading-7 flex justify-center items-center text-[28px] font-bold">
            発注する商品を選択してください
          </div>

          <div
            className={
              'products-item overflow-y-auto w-[842px] flex-wrap flex mr-[-110px]'
            }
          >
            {itemGroups?.map((item, key) => {
              return (
                <ProductsItem
                  key={key}
                  {...item}
                  setOpenSelectionCompanyModal={setOpenSelectionCompanyModal}
                  setItemGroupSelected={setItemGroupSelected}
                />
              );
            })}
          </div>
        </div>
      </div>
      {openSelectionCompanyModal && (
        <SelectionCompaniesModal
          open={openSelectionCompanyModal}
          onClose={() => setOpenSelectionCompanyModal(false)}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
}
