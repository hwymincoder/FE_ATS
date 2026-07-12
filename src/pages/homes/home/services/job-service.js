import { http } from '@/lib/http';
import { JOB_ENDPOINTS } from '@/pages/homes/home/constants';

export const jobService = {
  async getPostedJobs(params) {
    return http.get(JOB_ENDPOINTS.POSTED, { params });
  },

  async getAllPostedJobs() {
    return http.get(JOB_ENDPOINTS.ALL);
  },
};
