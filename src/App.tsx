import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import EventDetails from "./pages/EventDetails";
import RequestEvent from "./pages/RequestEvent";
import HowItWorksPage from "./pages/HowItWorksPage";
import Support from "./pages/Support";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Requests from "./pages/admin/Requests";
import Events from "./pages/admin/Events";
import EventForm from "./pages/admin/EventForm";
import Categories from "./pages/admin/Categories";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/request-event" element={<RequestEvent />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/privacy-policy"
          element={
            <LegalPage
              title="Privacy Policy"
              paragraphs={[
                "This placeholder privacy policy explains, in a production build, how UCwestpark collects and uses information submitted through ticket and event requests.",
                "Replace this page with your finalized policy before launch.",
              ]}
            />
          }
        />
        <Route
          path="/terms"
          element={
            <LegalPage
              title="Terms of Service"
              paragraphs={[
                "This placeholder terms page explains, in a production build, the terms under which UCwestpark provides its ticket request and sourcing service.",
                "Replace this page with your finalized terms before launch.",
              ]}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="events" element={<Events />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id/edit" element={<EventForm />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
