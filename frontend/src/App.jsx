import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { DashboardPage } from "./pages/Dashboard";
import { TaskFormPage } from "./pages/TaskForm";
import { useAuth } from "./providers/auth-provider";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/signin"
        element={
          <GuestRoute>
            <AuthLayout
              title="Welcome back"
              subtitle="Sign in to manage your tasks"
            >
              <SignInPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <AuthLayout
              title="Create your account"
              subtitle="Join Taskly to stay on top of your work"
            >
              <SignUpPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <TaskFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <ProtectedRoute>
            <TaskFormPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
