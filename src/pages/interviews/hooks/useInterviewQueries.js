import { useQuery } from '@tanstack/react-query';
import { INTERVIEW_QUERY_KEYS } from '@/pages/interviews/constants';
import { fetchInterviewList } from '@/pages/interviews/services/interview-service';

export const useInterviewList = (params) => {
  return useQuery({
    queryKey: INTERVIEW_QUERY_KEYS.list(JSON.stringify(params ?? {})),
    queryFn: () => fetchInterviewList(params),
    staleTime: 1000 * 60 * 2,
  });
};
