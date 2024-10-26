import { axiosInstance } from '@/app/service/axios-instance';
import { ItemGroupDetail } from '@/app/types/api-response';
import { ItemGroup } from '@/app/types/entities';

const BASE_ENTITY_URL = '/item-groups';

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Array<ItemGroup>>;
};

export const allName = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + '/names', {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Array<ItemGroup>>;
};

export const find = async (id: string, flowId: string, session: string) => {
  return axiosInstance.get(
    BASE_ENTITY_URL + `/${id}?commercialFlowId=${flowId}`,
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  ) as Promise<ItemGroupDetail>;
};
