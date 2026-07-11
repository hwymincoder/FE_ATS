import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/lib/extract-error';
import { sendCandidateChat } from '@/pages/candidate/chatbot/services/candidate-chat-service';

export function useCandidateChatMutation() {
  const { user, setUser } = useAuth();

  return useMutation({
    mutationFn: sendCandidateChat,
    onSuccess: (data) => {
      if (data?.numberOfQueryQuota != null && user) {
        setUser({
          ...user,
          numberOfQueryQuota: data.numberOfQueryQuota,
        });
      }
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Không gửi được tin nhắn'));
    },
  });
}
