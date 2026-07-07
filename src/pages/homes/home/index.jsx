import {
  HeroSection,
  AboutSection,
  StatsSection,
  JobsSection,
  NewsSection,
  ContactFooterSection,
} from './components';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <JobsSection />
      <NewsSection />
      <ContactFooterSection />
    </div>
  );
}
