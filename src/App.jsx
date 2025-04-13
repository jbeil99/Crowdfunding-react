import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { RedirectIfAuthenticated, RedirectIfNotAuthenticated, AdminGuard } from "./components/auth/AuthGuard";
import ActivateAccount from "./pages/AccountActivation";
import ProfilePage from "./pages/profile/Profile";
import EditProfileForm from "./pages/profile/EditProfile";
import AdminDashboard from "./pages/admin/Dashboard";
import { initializeAuth } from "./store/auth";
import UpdateProjectForm from "./pages/admin/components/UpdateProjectForm";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route
              path="/start-campaign"
              element={
                <RedirectIfNotAuthenticated>
                  <CreateCampaignPage />
                </RedirectIfNotAuthenticated>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <RedirectIfNotAuthenticated>
                  <HowItWorksPage />
                </RedirectIfNotAuthenticated>
              }
            />
            <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
            <Route
              path="/dashboard"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />

            <Route
              path="/profile"
              element={
                <RedirectIfNotAuthenticated>
                  <ProfilePage />
                </RedirectIfNotAuthenticated>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <RedirectIfNotAuthenticated>
                  <EditProfileForm />
                </RedirectIfNotAuthenticated>
              }
            />
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
            <Route
              path="/projects/edit/:id"
              element={
                <RedirectIfNotAuthenticated>
                  <RedirectIfNotAuthenticated>
                    <UpdateProjectForm />
                  </RedirectIfNotAuthenticated>
                </RedirectIfNotAuthenticated>
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
