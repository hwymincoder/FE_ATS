import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function ChatInput({ value, onChange, onSubmit, disabled, placeholder, compact = false }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
    }
  };

  if (compact) {
    return (
      <div className="flex items-end gap-2 border-t bg-background p-3">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="min-h-[40px] max-h-24 resize-none text-sm"
        />
        <Button
          type="button"
          size="icon"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 border-t bg-background p-4">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className="min-h-[72px] resize-none"
      />
      <Button type="button" onClick={onSubmit} disabled={disabled || !value.trim()} className="shrink-0">
        <Send className="mr-2 h-4 w-4" />
        Gửi
      </Button>
    </div>
  );
}
