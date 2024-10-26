import { axiosInstance } from '@/app/service/axios-instance';
import { Role } from '@/app/types/entities';

const BASE_ENTITY_URL = '/roles';

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Role[]>;
};
