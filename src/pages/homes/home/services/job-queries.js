import { useQuery } from '@tanstack/react-query';

import { JOB_QUERY_KEYS } from '@/pages/homes/home/constants';
import { jobService } from './job-service';

export function usePostedJobs(params) {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.posted(params),
    queryFn: () => jobService.getPostedJobs(params),
    staleTime: 60_000,
  });
}

export function useAllPostedJobs() {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.all,
    queryFn: () => jobService.getAllPostedJobs(),
    staleTime: 60_000,
  });
}
