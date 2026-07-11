import { http } from '@/lib/http';
import { CANDIDATE_CV_ENDPOINTS } from '@/pages/candidate/chatbot/constants';

export async function fetchCandidateCvs() {
  const response = await http.get(CANDIDATE_CV_ENDPOINTS.LIST);
  return Array.isArray(response) ? response : [];
}
