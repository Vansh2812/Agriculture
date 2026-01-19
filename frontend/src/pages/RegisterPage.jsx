import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await register(formData);
      toast.success('Registration successful!');
      
      if (user.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#FAF9F6] to-[#E8EBE8]" data-testid="register-page">
      <Card className="max-w-md w-full p-8 rounded-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2" data-testid="register-title">Create Account</h1>
          <p className="text-foreground/70">Join our agriculture community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>I am a</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              className="flex gap-4 mt-2"
              data-testid="role-radio-group"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" data-testid="role-buyer" />
                <Label htmlFor="buyer" className="cursor-pointer">Buyer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="farmer" id="farmer" data-testid="role-farmer" />
                <Label htmlFor="farmer" className="cursor-pointer">Farmer</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
              data-testid="register-name-input"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1"
              data-testid="register-email-input"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1"
              data-testid="register-password-input"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1"
              data-testid="register-phone-input"
            />
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="mt-1"
              data-testid="register-location-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loading}
            data-testid="register-submit-button"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-foreground/70">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline" data-testid="login-link">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;