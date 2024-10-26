import { axiosInstance } from '@/app/service/axios-instance';
import { Supplier, ListSupplier } from '@/app/types/entities';

const BASE_ENTITY_URL = '/suppliers';

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + '/all', {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Supplier[]>;
};

export const allParent = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + '/all_parent', {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Supplier[]>;
};

export function getList(session: string, params: any): Promise<ListSupplier> {
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
};

export function edit(
  supplier: Pick<
    Supplier,
    | 'supplierCd'
    | 'supplierName'
    | 'supplierNameKana'
    | 'tel'
    | 'postCd'
    | 'address1'
    | 'address2'
    | 'address3'
  >,
  id: string,
  session: string,
) {
  return axiosInstance.patch(BASE_ENTITY_URL + `/${id}`, supplier, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function find(id: string, session: string): Promise<Supplier> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}