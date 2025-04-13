import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthStatus, initializeAuth } from "@/store/auth";

export const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useSelector(selectAuthStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

export const RedirectIfNotAuthenticated = ({ children }) => {
  const { isAuthenticated } = useSelector(selectAuthStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export const AdminGuard = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, user } = useSelector(selectAuthStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      if (!isAdmin) {
        navigate("/");
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (isAuthenticated && isAdmin) ? children : null;
};