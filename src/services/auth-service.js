import { http } from '@/lib/http';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export const authService = {
  async login(credentials) {
    return http.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  async logout() {
    return http.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  async getProfile() {
    return http.get(API_ENDPOINTS.AUTH.PROFILE);
  },
};
