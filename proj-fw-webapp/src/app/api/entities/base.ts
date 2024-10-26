import { axiosInstance } from '@/app/service/axios-instance';
import { ListBase, Base } from '@/app/types/entities';

const BASE_ENTITY_URL = '/bases';

export function create(base: Base, session: string) {
  return axiosInstance.post(BASE_ENTITY_URL, base, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function edit(
  base: Pick<
    Base,
    | 'baseName'
    | 'baseNameKana'
    | 'companyCd'
  >,
  id: string,
  session: string,
) {
  return axiosInstance.patch(BASE_ENTITY_URL + `/${id}`, base, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function find(id: string, session: string): Promise<Base> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function getList(session: string, params: any): Promise<ListBase> {
  const filteredObject = Object.keys(params).reduce((acc: any, key) => {
    if (params[key] !== '') {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  const searchParams = new URLSearchParams(filteredObject);
  searchParams.set('perPage', '30');
  return axiosInstance.get(`${BASE_ENTITY_URL}?${searchParams.toString()}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export const deleteBases = (id: number, session: string) => {
  return axiosInstance.delete(BASE_ENTITY_URL + `/${id}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
}
