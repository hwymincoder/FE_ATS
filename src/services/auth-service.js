import { http } from '@/lib/http';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export const authService = {
  async login({ email, password }) {
    return http.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      hashPassword: password,
    });
  },
  async candidateLogin({ email, password }) {
    return http.post(API_ENDPOINTS.AUTH.CANDIDATE_LOGIN, {
      email,
      hashPassword: password,
    });
  },
  async logout() {
    return http.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  async getProfile() {
    return http.get(API_ENDPOINTS.AUTH.PROFILE);
  },
};
