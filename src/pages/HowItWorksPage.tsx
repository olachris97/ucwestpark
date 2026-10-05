import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import CantFindSection from "../components/CantFindSection";

export default function HowItWorksPage() {
  return (
    <div className="bg-paper">
      <div className="bg-marquee py-14 text-center text-paper">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">How parking works</h1>
          <p className="mt-3 text-paper/75">
            We're here to help you find parking close to the event — from search to a spot near the venue.
          </p>
        </div>
      </div>
      <HowItWorks />
      <WhyChooseUs />
      <CantFindSection />
    </div>
  );
}
