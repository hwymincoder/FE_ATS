import { Bot, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import { JobSuggestionCards } from '@/pages/candidate/chatbot/components/JobSuggestionCards';

function MessageBubble({ message, widget, onApplyJob }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          'min-w-0 space-y-2 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser ? 'max-w-[85%] bg-primary text-primary-foreground' : 'flex-1 border bg-background',
          widget && !isUser && 'break-words',
        )}
      >
        {message.pending ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
            <span>Đang suy nghĩ...</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {!isUser && !message.pending && (
          <JobSuggestionCards jobs={message.jobs} widget={widget} onApply={onApplyJob} />
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export function ChatMessageList({ messages, listRef, widget = false, onApplyJob }) {
  return (
    <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          widget={widget}
          onApplyJob={onApplyJob}
        />
      ))}
    </div>
  );
}
