import { ArrowRight, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NEWS } from '@/pages/homes/home/constants';
import { cn } from '@/lib/utils';
import SectionTitle from './SectionTitle';

export default function NewsSection() {
  return (
    <section id="news" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Tin tuyển dụng" title="Hoạt động và cơ hội tại BVBank" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {NEWS.map((n) => (
            <Card
              key={n.key}
              className="group relative overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_hsl(var(--bv-secondary)/0.3)]"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-110',
                    n.accent,
                  )}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white/15%,transparent_50%)]" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-bv-primary shadow-sm backdrop-blur">
                  <Calendar className="h-3 w-3" />
                  {n.date}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="mt-1 text-base leading-snug">{n.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{n.excerpt}</p>
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0 text-bv-primary"
                  onClick={() => toast.info(`Đang mở bài viết: ${n.title}`)}
                >
                  Đọc tiếp <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
