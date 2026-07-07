import noiLamViecImg from '@/assets/noi_lam_viec.png';
import { STATS } from '@/pages/homes/home/constants';
import SectionTitle from './SectionTitle';

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden py-16">
      <img
        src={noiLamViecImg}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionTitle
          tone="white"
          eyebrow="Vì sao chọn BVBank"
          title="Nơi làm việc hàng đầu cho người Việt"
        />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="rounded-xl border bg-background p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--bv-accent-soft))] text-[hsl(var(--bv-primary))]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-[hsl(var(--bv-primary))]">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
