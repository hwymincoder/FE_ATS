import { http } from '@/lib/http';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export const candidateService = {
  async create({ name, email, password, phone }) {
    return http.post(API_ENDPOINTS.CANDIDATE.CREATE, {
      name,
      email,
      password,
      phone,
    });
  },
  async updatePassword(id, { oldPassword, newPassword }) {
    return http.put(API_ENDPOINTS.CANDIDATE.UPDATE(id), {
      oldPassword,
      newPassword,
    });
  },
};
