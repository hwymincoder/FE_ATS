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
};
