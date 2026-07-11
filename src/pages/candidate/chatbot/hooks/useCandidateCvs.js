import { useQuery } from '@tanstack/react-query';

import { CANDIDATE_CHATBOT_QUERY_KEYS } from '@/pages/candidate/chatbot/constants';
import { fetchCandidateCvs } from '@/pages/candidate/chatbot/services/candidate-cv-service';

export function useCandidateCvs(enabled = true) {
  return useQuery({
    queryKey: CANDIDATE_CHATBOT_QUERY_KEYS.cvs(),
    queryFn: fetchCandidateCvs,
    enabled,
    staleTime: 60_000,
  });
}
