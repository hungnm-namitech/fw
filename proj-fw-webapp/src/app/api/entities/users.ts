import { axiosInstance } from '@/app/service/axios-instance';
import { ListUser, User } from '@/app/types/entities';

const BASE_ENTITY_URL = '/users';

export function create(user: Omit<User, 'mUserId'>, session: string) {
  return axiosInstance.post(BASE_ENTITY_URL, user, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function edit(
  user: Pick<
    User,
    | 'username'
    | 'usernameKana'
    | 'mailAddress'
    | 'tel'
    | 'roleDiv'
    | 'companyId'
  >,
  id: string,
  session: string,
) {
  return axiosInstance.patch(BASE_ENTITY_URL + `/${id}`, user, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function find(id: string, session: string): Promise<User> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function me(session: string) {
  return axiosInstance.get(`/auth/me`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export function getList(session: string, params: any): Promise<ListUser> {
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

export const deleteUser = (mUserId: number, session: string) => {
  return axiosInstance.delete('/users/' + mUserId, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });
};
export const resetPassword = async (email: string, session: string) => {
  return axiosInstance.post(
    `/auth/reset-password`,
    { mailAddress: email },
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  );
};
