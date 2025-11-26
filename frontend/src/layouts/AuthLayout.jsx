import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/theme-toggle";

export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link to="/" className="text-lg font-semibold">
          Taskly
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};
