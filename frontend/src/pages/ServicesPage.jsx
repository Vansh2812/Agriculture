import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, BookOpen, Shield, Truck, Users } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: <Sprout className="h-10 w-10" />,
      title: "Direct Farm Connect",
      description: "Connect directly with local farmers and get fresh produce delivered to your doorstep. No middlemen, no markup.",
      features: ["Direct communication", "Fresh produce", "Fair pricing", "Local sourcing"]
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Farmer Marketplace",
      description: "Farmers can list their products and reach thousands of potential buyers across the region.",
      features: ["Easy listing", "Wide reach", "Secure payments", "Order management"]
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Agriculture Information",
      description: "Access comprehensive guides on farming techniques, pest control, organic farming, and government schemes.",
      features: ["Farming guides", "Best practices", "Market updates", "Expert advice"]
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure Transactions",
      description: "Safe and secure payment options with complete transparency and buyer protection.",
      features: ["COD available", "Secure platform", "Order tracking", "Buyer protection"]
    },
    {
      icon: <Truck className="h-10 w-10" />,
      title: "Delivery Management",
      description: "Track your orders from farm to your doorstep with real-time updates.",
      features: ["Order tracking", "Timely delivery", "Fresh guarantee", "Easy returns"]
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Community Support",
      description: "Join a thriving community of farmers and buyers working together for sustainable agriculture.",
      features: ["Expert support", "Community forum", "Best practices", "Networking"]
    }
  ];

  return (
    <div className="min-h-screen" data-testid="services-page">
      <section className="bg-gradient-to-b from-[#FAF9F6] to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6" data-testid="services-title">
              Our Services
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              Comprehensive solutions for modern agriculture - connecting farmers with buyers and providing resources for sustainable farming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-accent/20 rounded-2xl p-4 w-fit mb-6 text-primary">
                  {service.icon}
                </div>
                <h3 className="font-heading text-2xl font-semibold text-primary mb-4">{service.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and buyers already using AgriPortal
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 py-6 text-lg"
            asChild
          >
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;