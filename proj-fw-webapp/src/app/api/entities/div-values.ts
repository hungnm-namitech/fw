import { axiosInstance } from '@/app/service/axios-instance';
import { DivValue } from '@/app/types/entities';

const BASE_ENTITY_URL = '/div-values';

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<DivValue[]>;
};
