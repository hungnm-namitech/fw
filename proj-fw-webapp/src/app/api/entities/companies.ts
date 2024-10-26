import { axiosInstance } from '@/app/service/axios-instance';
import { ListCompany, Company, Staff, CompanyBase } from '@/app/types/entities';

const BASE_ENTITY_URL = '/companies';

export function edit(
  company: Pick<
    Company,
    | 'id'
    | 'companyName'
    | 'companyDiv'
  >,
  id: string,
  session: string,
) {
  return axiosInstance.patch(BASE_ENTITY_URL + `/${id}`, company, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function find(id: string, session: string): Promise<Company> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function getList(session: string, params: any): Promise<ListCompany> {
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

export function del(id: string, session: string): Promise<any> {
  return axiosInstance.delete<any>(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: `Bearer ` + session }
  })
};

export const all = async (session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + '/all', {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Company[]>;
};

export const staffs = async (id: string, session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}/staffs`, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Staff[]>;
};

export const bases = async (id: string, session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}/bases`, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<CompanyBase[]>;
};

export const companies = async (id: string, session: string) => {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}/comapnies`, {
    headers: { Authorization: 'Bearer ' + session },
  }) as Promise<Company[]>;
};