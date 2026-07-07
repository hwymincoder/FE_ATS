import { http } from '@/lib/http';

import { APPLY_ENDPOINT } from '../constants/apply.constants';

export const jobService = {
  async applyJob(jobId, payload, file) {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' }),
    );
    formData.append('cvFile', file);
    return http.post(APPLY_ENDPOINT(jobId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};