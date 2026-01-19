import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Fresh & Organic",
      description: "Direct from farmers, ensuring quality and freshness"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Fair Pricing",
      description: "Transparent pricing benefiting both farmers and buyers"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Building strong connections in agriculture"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Safe and reliable transactions"
    }
  ];

  const categories = [
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1672075805815-7cfb52f02e3f?w=400', category: 'vegetables' },
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1605447813584-26aeb3f8e6ae?w=400', category: 'fruits' },
    { name: 'Grains', image: 'https://images.unsplash.com/photo-1755712691769-f013764f2d70?w=400', category: 'grains' },
    { name: 'Organic', image: 'https://images.unsplash.com/photo-1761583780469-2f206ec7b270?w=400', category: 'organic' }
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-[#E8EBE8] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary leading-tight tracking-tight" data-testid="hero-title">
                Fresh from Farm to Your Table
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                Connect directly with local farmers. Get fresh, organic produce delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  asChild
                  data-testid="explore-products-button"
                >
                  <Link to="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg border-2"
                  asChild
                  data-testid="learn-more-button"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1562672767-51120ccfdfeb?w=800&q=85"
                alt="Farmer in field"
                className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary mb-4" data-testid="features-title">
              Why Choose AgriPortal?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              We're committed to revolutionizing agriculture through technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 rounded-2xl border-border/40 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                data-testid={`feature-card-${index}`}
              >
                <div className="bg-accent/20 rounded-xl p-4 w-fit mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[#F0F1EE]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary mb-4" data-testid="categories-title">
              Browse by Category
            </h2>
            <p className="text-lg text-foreground/70">
              Discover fresh produce from local farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/products?category=${cat.category}`}
                className="group relative overflow-hidden rounded-3xl h-64 shadow-sm hover:shadow-xl transition-all duration-300"
                data-testid={`category-card-${cat.category}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-2xl font-semibold text-white">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-6" data-testid="cta-title">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our community of farmers and buyers today
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 py-6 text-lg"
            asChild
            data-testid="get-started-cta-button"
          >
            <Link to="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;