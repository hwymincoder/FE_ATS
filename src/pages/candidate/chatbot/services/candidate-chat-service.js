import { http } from '@/lib/http';
import { CANDIDATE_CHAT_ENDPOINTS } from '@/pages/candidate/chatbot/constants';

export function sendCandidateChat(payload) {
  return http.post(CANDIDATE_CHAT_ENDPOINTS.CHAT, payload);
}
