import { cn } from '@/lib/utils';

export default function SectionTitle({ eyebrow, title, subtitle, tone = 'default' }) {
  const isWhite = tone === 'white';
  const eyebrowClass = isWhite ? 'text-white/80' : 'text-bv-secondary';
  const titleClass = isWhite ? 'text-white' : 'text-foreground';
  const subtitleClass = isWhite ? 'text-white/80' : 'text-muted-foreground';
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <span className={cn('mb-2 inline-block text-xs font-semibold uppercase tracking-widest', eyebrowClass)}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn('text-3xl font-bold tracking-tight sm:text-4xl', titleClass)}>{title}</h2>
      {subtitle && <p className={cn('mt-3 text-sm sm:text-base', subtitleClass)}>{subtitle}</p>}
    </div>
  );
}
