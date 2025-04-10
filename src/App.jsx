import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/home/HomePage";
import DiscoverPage from "./pages/campaign/DiscoverPage";
import CampaignDetailPage from "./pages/campaign/CampaignDetailPage";
import CreateCampaignPage from "./pages/campaign/CreateCampaignPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import { Button } from "@/components/ui/button";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { Toaster } from "@/components/Toaster";
import { RedirectIfAuthenticated } from "./components/auth/AuthGuard";
import ActivateAccount from "./pages/AccountActivation";
import ProfilePage from "./pages/Profile";

// Create a 404 page component
const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Return to Homepage</Button>
      </Link>
    </div>
  );
};

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route path="/start-campaign" element={<CreateCampaignPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activate/:uid/:token" element={<ActivateAccount />} />

            {/* Protected Routes - Redirect if authenticated */}
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfAuthenticated>
                  <RegisterPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
