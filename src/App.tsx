import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import RequestEvent from "./pages/RequestEvent";
import HowItWorksPage from "./pages/HowItWorksPage";
import About from "./pages/About";
import Support from "./pages/Support";
import LegalPage from "./pages/LegalPage";
import { privacyPolicyIntro, privacyPolicySections } from "./data/privacyPolicy";
import { termsIntro, termsSections } from "./data/termsOfService";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Requests from "./pages/admin/Requests";
import Locations from "./pages/admin/Locations";
import LocationForm from "./pages/admin/LocationForm";
import Categories from "./pages/admin/Categories";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/request-event" element={<RequestEvent />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/privacy-policy"
          element={
            <LegalPage
              title="Privacy Policy"
              lastUpdated="September 2026"
              intro={privacyPolicyIntro}
              sections={privacyPolicySections}
            />
          }
        />
        <Route
          path="/terms"
          element={
            <LegalPage
              title="Terms of Service"
              lastUpdated="September 2026"
              intro={termsIntro}
              sections={termsSections}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="locations" element={<Locations />} />
        <Route path="locations/new" element={<LocationForm />} />
        <Route path="locations/:id/edit" element={<LocationForm />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
