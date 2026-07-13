import { useQuery } from '@tanstack/react-query';
import {
  fetchCandidateApplicationDetail,
  fetchCandidateApplications,
} from '@/pages/candidate/applications/services/candidate-application-service';

export function useCandidateApplications(params) {
  return useQuery({
    queryKey: ['candidate-applications', params],
    queryFn: () => fetchCandidateApplications(params),
    staleTime: 30_000,
  });
}

export function useCandidateApplicationDetail(applicationId) {
  return useQuery({
    queryKey: ['candidate-applications', 'detail', applicationId],
    queryFn: () => fetchCandidateApplicationDetail(applicationId),
    enabled: Boolean(applicationId),
  });
}
