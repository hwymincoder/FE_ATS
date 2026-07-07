import { http } from '@/lib/http';
import { JOB_DEFAULTS, JOB_ENDPOINTS } from '@/pages/homes/home/constants';

export const jobService = {
  async getPostedJobs({ page = JOB_DEFAULTS.page, size = JOB_DEFAULTS.size } = {}) {
    return http.get(JOB_ENDPOINTS.POSTED, { params: { page, size } });
  },
};
