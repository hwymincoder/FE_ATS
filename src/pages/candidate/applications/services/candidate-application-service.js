import { http } from '@/lib/http';

export const fetchCandidateApplications = (params) =>
  http.get('/candidate/applications', { params });

export const fetchCandidateApplicationDetail = (applicationId) =>
  http.get(`/candidate/applications/${applicationId}`);
