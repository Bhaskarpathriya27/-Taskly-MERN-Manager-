import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/theme-toggle';
import { Button } from '../components/ui/button';
import { useAuth } from '../providers/auth-provider';

export const AppLayout = ({ title, children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/dashboard" className="text-lg font-semibold">
            Taskly
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="hidden text-right sm:block">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="capitalize">{user?.role}</p>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks/new')}>
              Add Task
            </Button>
            {isAdmin && (
              <span className="rounded-md border px-2 py-1 text-xs font-medium text-primary-foreground bg-primary/80">
                Admin
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        {title && <h1 className="mb-6 text-3xl font-semibold">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

