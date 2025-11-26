import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../providers/auth-provider';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (_err) {
      // toast handled upstream
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" value={form.name} onChange={onChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={onChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/signin">
          Sign in
        </Link>
      </p>
    </form>
  );
};

