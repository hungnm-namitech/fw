import { axiosInstance } from '@/app/service/axios-instance';
import { News } from '@/app/types/entities';

const BASE_ENTITY_URL = '/news';

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<News[]>;
};
