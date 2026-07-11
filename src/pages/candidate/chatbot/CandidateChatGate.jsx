import { ROLES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import CandidateChatWidget from '@/pages/candidate/chatbot/CandidateChatWidget';

export default function CandidateChatGate() {
  const { user, accessToken } = useAuth();

  if (!accessToken || user?.role !== ROLES.CANDIDATE) {
    return null;
  }

  return <CandidateChatWidget />;
}
