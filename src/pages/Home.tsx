import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import CantFindSection from "../components/CantFindSection";
import VenueDirectory from "../components/VenueDirectory";

export default function Home() {
  return (
    <div>
      <Hero />
      <VenueDirectory />
      <HowItWorks />
      <WhyChooseUs />
      <CantFindSection />
    </div>
  );
}
