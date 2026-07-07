import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/constants';
import { FOOTER_CONTACT } from '@/pages/homes/home/constants';

export default function ContactFooterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    toast.success(`Đã đăng ký nhận thông tin: ${email}`);
    setEmail('');
  };

  return (
    <footer
      id="contact"
      className="relative text-white"
      style={{
        background:
          'linear-gradient(180deg, hsl(var(--bv-primary-deep)) 0%, hsl(var(--bv-primary-dark)) 100%)',
      }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-bv-accent via-bv-secondary to-bv-primary" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3 L21 20 L3 20 Z" fill="white" stroke="white" />
                  <path d="M12 9 L17 20 L7 20 Z" fill="hsl(var(--bv-secondary))" stroke="white" />
                  <path d="M12 14 L14 20 L10 20 Z" fill="white" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-white to-bv-accent bg-clip-text text-base font-bold text-transparent">
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-white/75">
              Ngân hàng TMCP Bản Việt — đối tác tài chính tin cậy cho mọi gia đình Việt.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-white/75">
              {FOOTER_CONTACT.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={i} className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-bv-accent" />
                    <span>{c.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">Theo dõi</h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li>Facebook</li>
              <li>LinkedIn</li>
              <li>YouTube</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">Đăng ký nhận tin</h3>
            <p className="mb-3 text-xs text-white/70">
              Nhận thông báo khi có vị trí phù hợp với bạn.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus-visible:ring-white/40"
              />
              <Button type="submit" size="icon" variant="secondary" aria-label="Đăng ký">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} {APP_NAME} — Ngân hàng TMCP Bản Việt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
