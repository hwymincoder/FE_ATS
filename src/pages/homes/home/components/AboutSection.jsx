import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ABOUT_PILLARS } from '@/pages/homes/home/constants';
import { cn } from '@/lib/utils';
import SectionTitle from './SectionTitle';

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Về chúng tôi"
          title="Ngân hàng TMCP Bản Việt"
          subtitle="Hơn 30 năm đồng hành cùng khách hàng Việt, BVBank tự hào là một trong những ngân hàng bán lẻ năng động, an toàn và minh bạch."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABOUT_PILLARS.map((p, i) => {
            const Icon = p.icon;
            const tones = [
              'from-bv-primary to-bv-secondary',
              'from-bv-secondary to-bv-accent',
              'from-bv-accent to-bv-primary',
            ][i];
            const iconTone = [
              'group-hover:shadow-[0_10px_30px_-10px_hsl(var(--bv-primary)/0.45)]',
              'group-hover:shadow-[0_10px_30px_-10px_hsl(var(--bv-secondary)/0.55)]',
              'group-hover:shadow-[0_10px_30px_-10px_hsl(var(--bv-accent)/0.55)]',
            ][i];
            const iconText = ['text-bv-primary', 'text-bv-secondary', 'text-bv-accent'][i];
            return (
              <Card
                key={p.key}
                className="group relative overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]',
                    tones,
                  )}
                />
                <CardHeader>
                  <div
                    className={cn(
                      'mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-bv-accent-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg',
                      iconText,
                      iconTone,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
