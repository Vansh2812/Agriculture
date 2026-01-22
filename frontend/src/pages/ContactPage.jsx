import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// ✅ VITE ENV FIX
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

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
      await axios.post(`${API}/contact`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success("Message sent successfully! We'll contact you soon.");

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error("CONTACT ERROR:", error);

      const msg =
        error.response?.data?.detail ||
        'Failed to send message. Please try again.';

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-white py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/70">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold">Email Us</h3>
              <p>info@agriportal.com</p>
              <p>support@agriportal.com</p>
            </Card>

            <Card className="p-6 rounded-2xl">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold">Call Us</h3>
              <p>+91 1234567890</p>
            </Card>

            <Card className="p-6 rounded-2xl">
              <MapPin className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold">Visit Us</h3>
              <p>India</p>
            </Card>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-3xl">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Phone (Optional)</Label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input name="subject" value={formData.subject} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <Label>Message</Label>
                  <Textarea rows={6} name="message" value={formData.message} onChange={handleChange} required />
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-full">
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

              </form>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
