export const APPLY_ENDPOINT = (jobId) => `/api/jobs/${jobId}/apply`;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (khớp BE ApplicationServiceImpl)

export const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

export const DEFAULT_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
  cvFile: null,
};