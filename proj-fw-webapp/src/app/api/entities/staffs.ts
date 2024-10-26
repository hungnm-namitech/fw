import { axiosInstance } from '@/app/service/axios-instance';
import { ListStaff, Staff} from '@/app/types/entities';

const BASE_ENTITY_URL = '/staffs';

export function create(staff: Omit<Staff, 'id'>, session: string) {
  return axiosInstance.post(BASE_ENTITY_URL, staff, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function edit(
  staff: Pick<
    Staff,
    | 'staffName'
    | 'staffNameKana'
    | 'companyCd'
  >,
  id: string,
  session: string,
) {
  return axiosInstance.patch(BASE_ENTITY_URL + `/${id}`, staff, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function find(id: string, session: string): Promise<Staff> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function getList(session: string, params: any): Promise<ListStaff> {
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

export const deleteStaff = (id: number, session: string) => {
  return axiosInstance.delete(BASE_ENTITY_URL + `/${id}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
}

// export function del(id: string, session: string): Promise<any> {
//   return axiosInstance.delete<any>(BASE_ENTITY_URL + `/${id}`, {
//     headers: { Authorization: 'Bearer ' + session },
//   });
// }
