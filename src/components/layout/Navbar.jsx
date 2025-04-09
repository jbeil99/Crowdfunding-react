import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/auth"; // Updated import path to use Redux action
import { selectIsAuthenticated } from "@/store/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { user } = useSelector((state) => state.auth);
  const stpre = useSelector((state) => state.auth);
  console.log(stpre)
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Authentication buttons based on user state
  const AuthButtons = () =>
    isAuthenticated ? (
      <>
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </>
    ) : (
      <>
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="ghost" size="sm">
            Sign Up
          </Button>
        </Link>
      </>
    );

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              FundRaiser
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium ${isActive("/") ? "text-primary" : "hover:text-primary"}`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`text-sm font-medium ${isActive("/discover") ? "text-primary" : "hover:text-primary"}`}
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm font-medium ${isActive("/how-it-works") ? "text-primary" : "hover:text-primary"}`}
            >
              How It Works
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <AuthButtons />
            {user && (
              <Link to="/start-campaign">
                <Button size="sm">Start a Campaign</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t mt-3 space-y-2">
            <Link
              to="/"
              className={`block py-2 ${isActive("/") ? "text-primary" : "hover:text-primary"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`block py-2 ${isActive("/discover") ? "text-primary" : "hover:text-primary"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              className={`block py-2 ${isActive("/how-it-works") ? "text-primary" : "hover:text-primary"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                  <Link
                    to="/start-campaign"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full justify-start">
                      Start a Campaign
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
