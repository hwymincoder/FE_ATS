import { Bot, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ApplyJobDialog } from '@/pages/homes/jobs/components/ApplyJobDialog';
import { ChatInput } from '@/pages/candidate/chatbot/components/ChatInput';
import { ChatMessageList } from '@/pages/candidate/chatbot/components/ChatMessageList';
import { CvPickerDialog } from '@/pages/candidate/chatbot/components/CvPickerDialog';
import { JobContextChip } from '@/pages/candidate/chatbot/components/JobContextChip';
import { QuotaBadge } from '@/pages/candidate/chatbot/components/QuotaBadge';
import { useCandidateChat } from '@/pages/candidate/chatbot/hooks/useCandidateChat';
import { useChatbotStore } from '@/stores/chatbot-store';
import { cn } from '@/lib/utils';

export default function CandidateChatWidget() {
  const isOpen = useChatbotStore((s) => s.isOpen);
  const openChat = useChatbotStore((s) => s.openChat);
  const closeChat = useChatbotStore((s) => s.closeChat);
  const [applyJob, setApplyJob] = useState(null);

  const {
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
  } = useCandidateChat();

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            className={cn(
              'pointer-events-auto flex w-[min(calc(100vw-2rem),480px)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl',
              'h-[min(82vh,680px)] animate-in fade-in slide-in-from-bottom-4 duration-200',
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-primary/5 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">AI Tư vấn</p>
                  <p className="truncate text-xs text-muted-foreground">Hỏi đáp việc làm & CV</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <QuotaBadge quota={quota} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={closeChat}
                  aria-label="Đóng chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {jobId && (
              <div className="shrink-0 border-b px-4 py-2">
                <JobContextChip jobTitle={jobTitle} onClear={clearJobContext} compact />
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3">
              <ChatMessageList
                messages={messages}
                listRef={listRef}
                widget
                onApplyJob={setApplyJob}
              />
            </div>

            {quota <= 0 && (
              <div className="shrink-0 border-t bg-destructive/5 px-4 py-2.5 text-sm leading-snug text-destructive">
                Bạn đã hết lượt truy vấn AI. Vui lòng nâng cấp gói để tiếp tục.
              </div>
            )}

            <div className="shrink-0">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={isDisabled}
                compact
                placeholder={
                  jobId
                    ? 'Hỏi về job này, hoặc "CV tôi có hợp không?"...'
                    : 'Hỏi về nghề nghiệp, kỹ năng, hoặc job phù hợp...'
                }
              />
            </div>
          </div>
        )}

        <Button
          type="button"
          size="icon"
          className={cn(
            'pointer-events-auto h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105',
            isOpen && 'bg-muted text-muted-foreground hover:bg-muted',
          )}
          onClick={() => (isOpen ? closeChat() : openChat())}
          aria-label={isOpen ? 'Đóng AI tư vấn' : 'Mở AI tư vấn'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>

      <CvPickerDialog
        open={cvPickerOpen}
        cvs={pickerCvs}
        selectedCvId={selectedCvId}
        onSelect={setSelectedCvId}
        onConfirm={handleCvPickerConfirm}
        onClose={handleCvPickerClose}
        loading={chatMutation.isPending}
      />

      <ApplyJobDialog
        job={applyJob}
        open={!!applyJob}
        onOpenChange={(isOpen) => {
          if (!isOpen) setApplyJob(null);
        }}
      />
    </>
  );
}
