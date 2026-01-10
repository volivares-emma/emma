import Slide from "@/components/web/home/slides";
import Modules from "@/components/web/home/modules";
import StatsAndCTA from "@/components/web/home/stats-and-cta";
import TrustSection from "@/components/web/home/trust-section";
import Benefits from "@/components/web/home/benefits";
import Testimonials from "@/components/web/home/testimonials";
import Resources from "@/components/web/home/resources";
import Careers from "@/components/web/home/careers";

export default function HomePage() {
  return (
      <>
        <Slide />
        <Modules />
        <StatsAndCTA />
        <TrustSection />
        <Benefits />
        <Testimonials />
        <Resources />
        <Careers />
      </>
  );
}
