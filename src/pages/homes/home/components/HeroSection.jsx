import { ArrowRight, ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import heroTeamImg from '@/assets/hero-team.png';
import { useScrollToId } from '@/pages/homes/home/hooks';
import { HERO_CTAS } from '@/pages/homes/home/constants';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const scrollToId = useScrollToId();

  return (
    <section id="hero" className="relative overflow-hidden text-white">
      <img
        src={heroTeamImg}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--bv-secondary))/15%,transparent_55%)]" />
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-bv-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-bv-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg viewBox="0 0 800 400" className="h-full w-full" preserveAspectRatio="none">
          <path d="M0,300 C200,260 400,340 800,260 L800,400 L0,400 Z" fill="white" />
        </svg>
      </div>

      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32"
        style={{
          textShadow:
            '0 2px 4px rgba(8, 38, 79, 0.85), 0 4px 20px rgba(8, 38, 79, 0.7), 0 0 2px rgba(8, 38, 79, 0.9)',
        }}
      >
        <Badge
          className="mb-5 border border-white/30 bg-bv-primary-deep/60 text-white shadow-lg backdrop-blur-md"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
        >
          Tuyển dụng BVBank 2026
        </Badge>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Cùng BVBank kiến tạo tương lai
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Gia nhập đội ngũ 8.000+ cán bộ nhân viên trên hành trình chuyển đổi số và phát triển bền vững.
          Khám phá cơ hội nghề nghiệp phù hợp với bạn.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {HERO_CTAS.map((cta) => (
            <Button
              key={cta.key}
              size="lg"
              variant={cta.variant === 'outline' ? 'outline' : 'secondary'}
              className={cn(
                'gap-2 shadow-lg',
                cta.variant === 'outline' &&
                  'border-white/60 bg-white/15 text-white backdrop-blur-md hover:border-white hover:bg-white/25 hover:text-white',
              )}
              style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
              onClick={() => scrollToId(cta.href)}
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToId('#about')}
          className="mt-14 inline-flex items-center gap-2 rounded-full border border-white/40 bg-bv-primary-deep/40 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-colors hover:bg-bv-primary-deep/60 hover:text-white"
          aria-label="Cuộn xuống"
        >
          Cuộn xuống
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
