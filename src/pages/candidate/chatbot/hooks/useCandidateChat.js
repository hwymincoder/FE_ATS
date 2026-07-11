import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/lib/extract-error';
import { useCandidateChatMutation } from '@/pages/candidate/chatbot/hooks/useCandidateChatMutation';
import { fetchCandidateCvs } from '@/pages/candidate/chatbot/services/candidate-cv-service';
import { getUsableCvs, isCvRequiredQuestion } from '@/pages/candidate/chatbot/utils/chat-intent';
import { useChatbotStore } from '@/stores/chatbot-store';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào! Tôi có thể giúp bạn tìm việc, tư vấn CV hoặc trả lời câu hỏi về job đang xem. Hãy đặt câu hỏi bên dưới nhé.',
  jobs: [],
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useCandidateChat() {
  const { user } = useAuth();
  const chatMutation = useCandidateChatMutation();
  const listRef = useRef(null);

  const jobId = useChatbotStore((s) => s.jobId);
  const jobTitle = useChatbotStore((s) => s.jobTitle);
  const clearJobContext = useChatbotStore((s) => s.clearJobContext);

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [cvPickerOpen, setCvPickerOpen] = useState(false);
  const [pickerCvs, setPickerCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const requestChat = async (trimmed, cvId) => {
    const pendingId = createMessageId();

    setMessages((current) => [
      ...current,
      { id: pendingId, role: 'assistant', content: '', jobs: [], pending: true },
    ]);

    try {
      const response = await chatMutation.mutateAsync({
        message: trimmed,
        cvId: cvId ?? undefined,
        jobId: jobId ?? undefined,
      });

      setMessages((current) =>
        current.map((item) =>
          item.id === pendingId
            ? {
                ...item,
                pending: false,
                content: response?.answer || 'Không nhận được phản hồi từ AI.',
                jobs: response?.jobs ?? [],
              }
            : item,
        ),
      );
    } catch (error) {
      setMessages((current) => current.filter((item) => item.id !== pendingId));
      toast.error(extractErrorMessage(error, 'Không gửi được tin nhắn'));
    }
  };

  const sendChatMessage = async (message, explicitCvId = null) => {
    const trimmed = message.trim();
    if (!trimmed || chatMutation.isPending) return;

    const shouldAppendUser = explicitCvId == null;
    if (shouldAppendUser) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'user',
          content: trimmed,
          jobs: [],
        },
      ]);
      setInput('');
    }

    try {
      let cvId = explicitCvId;
      if (cvId == null && isCvRequiredQuestion(trimmed)) {
        const cvs = getUsableCvs(await fetchCandidateCvs());
        if (!cvs.length) {
          throw new Error('Bạn chưa có CV nào dùng được cho AI. Hãy ứng tuyển và upload CV trước.');
        }
        if (cvs.length === 1) {
          cvId = cvs[0].id;
        } else {
          setPickerCvs(cvs);
          setSelectedCvId(cvs[0].id);
          setPendingMessage(trimmed);
          setCvPickerOpen(true);
          return;
        }
      }

      await requestChat(trimmed, cvId);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Không gửi được tin nhắn'));
    }
  };

  const handleCvPickerConfirm = async () => {
    if (!selectedCvId || !pendingMessage) return;

    const message = pendingMessage;
    setCvPickerOpen(false);
    setPendingMessage(null);
    await requestChat(message, selectedCvId);
  };

  const handleCvPickerClose = () => {
    setCvPickerOpen(false);
    setPendingMessage(null);
  };

  const handleSubmit = () => {
    sendChatMessage(input);
  };

  const quota = user?.numberOfQueryQuota ?? 0;
  const isDisabled = chatMutation.isPending || quota <= 0;

  return {
    messages,
    input,
    setInput,
    listRef,
    jobId,
    jobTitle,
    clearJobContext,
    cvPickerOpen,
    pickerCvs,
    selectedCvId,
    setSelectedCvId,
    handleCvPickerConfirm,
    handleCvPickerClose,
    handleSubmit,
    quota,
    isDisabled,
    chatMutation,
  };
}
