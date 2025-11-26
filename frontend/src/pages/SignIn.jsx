import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../providers/auth-provider';

export const SignInPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({
    email: 'admin@example.com',
    password: 'admin123',
  });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate('/dashboard');
    } catch (_err) {
      // errors handled within auth provider toast
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="current-password"
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/signup">
          Create one
        </Link>
      </p>
    </form>
  );
};

