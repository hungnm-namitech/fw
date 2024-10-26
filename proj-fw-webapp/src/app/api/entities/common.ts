import { axiosInstance } from '@/app/service/axios-instance';

const masterDataApi = {
  getAddresses(postCd: string, session: string) {
    return axiosInstance.get(`/address_jis?zipcode=${postCd}`, {
      headers: { Authorization: 'Bearer ' + session },
    });
  },
};

export default masterDataApi;