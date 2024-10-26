import { Button } from '@/app/components/Button';
import { Modal } from '@/app/components/Modal';
import SelectSearch from '@/app/components/SelectSearch';
import { ItemGroup } from '@/app/types/entities';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
interface SelectionCompaniesModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem: ItemGroup | null;
}

export interface SelectionCommercialForm {
  tradingCompany: string;
  itemGroupId: string;
  flowId: string;
}

export default function SelectionCompaniesModal({
  open,
  onClose,
  selectedItem,
}: SelectionCompaniesModalProps) {
  const tradingCompanies = useMemo(() => {
    const tradingCompanies: { label: string; value: string }[] = [];

    selectedItem?.commercialFlows.forEach(flow => {
      tradingCompanies.push(
        ...[
          flow.tradingCompany1,
          flow.tradingCompany2,
          flow.tradingCompany3,
          flow.tradingCompany4,
        ]
          .filter(td => !!td)
          .map(td => ({
            label: td,
            value: `tradingCompany=${td}&flowId=${flow.id}`,
          })),
      );
    });

    return tradingCompanies;
  }, [selectedItem]);

  const handleClose = () => {
    onClose();
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ tradingCompany: string }>({});
  const router = useRouter();
  const onSubmit = async (data: { tradingCompany: string }) => {
    if (selectedItem) {
      const params = new URLSearchParams();
      params.set('itemGroupId', selectedItem.id);

      router.push(
        `/orders/new-entry?${params.toString()}&${data.tradingCompany}`,
      );
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div
        className={
          'flex flex-col items-center w-[800px] pt-[40px] pb-[24px] px-[40px]'
        }
      >
        <div className="w-full h-[30px] justify-start items-start inline-flex gap-2	mb-[32px]">
          <div className="w-1 h-8 bg-teal-800 rounded-sm"></div>
          <div className="text-gray-900 text-2xl font-bold leading-[30px">
            商流選択
          </div>
        </div>
        <div className="w-full h-full p-5 bg-[#F7F7F7] rounded flex-col justify-start items-start inline-flex">
          <div className="self-stretch h-6 flex-col justify-start items-start flex gap-4">
            <div className="text-gray-900 text-lg font-bold leading-5">
              RW修正梁
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="tradingCompany"
            control={control}
            // defaultValue=""
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <div
                className={
                  'flex items-center justify-between select w-[720px] mt-5 mb-6 '
                }
              >
                <p
                  className={
                    'table-cell text-gray tracking-[0.08px] w-[200px] text-gray-600 text-sm font-bold leading-[38px]'
                  }
                >
                  会社を選択
                </p>
                <div
                  className={
                    'w-full max-w-[500px] relative text-gray-600 text-base font-medium leading-5 '
                  }
                >
                  <SelectSearch
                    data={tradingCompanies}
                    field={field}
                    error={errors?.tradingCompany?.message}
                  />
                </div>
              </div>
            )}
          />
          <div className="w-full h-full flex-col justify-start items-start inline-flex mt-[106px]">
            <div className="self-stretch h-px bg-[#D4D4D4] mb-[24px]"></div>

            <div className="w-full h-full justify-between items-center inline-flex">
              <div
                className="text-blue-700 text-base font-bold leading-5 cursor-pointer"
                onClick={handleClose}
              >
                キャンセル
              </div>
              <div>
                <Button
                  className={
                    'pl-5 pr-5 pt-2 pb-2 rounded justify-center items-center flex !min-h-[36px]'
                  }
                  type="submit"
                >
                  設定完了
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
