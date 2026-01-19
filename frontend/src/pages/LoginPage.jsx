import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success('Login successful!');
      
      if (user.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#FAF9F6] to-[#E8EBE8]" data-testid="login-page">
      <Card className="max-w-md w-full p-8 rounded-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2" data-testid="login-title">Welcome Back</h1>
          <p className="text-foreground/70">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              data-testid="login-email-input"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              data-testid="login-password-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
            data-testid="login-submit-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-foreground/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline" data-testid="register-link">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;