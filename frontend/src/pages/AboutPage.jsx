import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Target, Award, Leaf } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description: "Building strong relationships between farmers and buyers"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Fair Trade",
      description: "Ensuring fair prices and transparent transactions"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Assured",
      description: "Only the freshest produce from trusted farmers"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Promoting organic and sustainable farming practices"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      <section className="bg-gradient-to-b from-[#FAF9F6] to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6" data-testid="about-title">
              About AgriPortal
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              We're on a mission to revolutionize agriculture by connecting farmers directly with buyers, ensuring fresh produce and fair prices for all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 rounded-3xl">
              <h2 className="text-3xl font-heading font-semibold text-primary mb-4">Our Mission</h2>
              <p className="text-foreground/70 leading-relaxed">
                To empower farmers with direct market access and provide consumers with fresh, high-quality agricultural products. We believe in creating a sustainable and transparent food supply chain that benefits everyone.
              </p>
            </Card>
            <Card className="p-8 rounded-3xl">
              <h2 className="text-3xl font-heading font-semibold text-primary mb-4">Our Vision</h2>
              <p className="text-foreground/70 leading-relaxed">
                To become the leading platform for agricultural commerce, fostering innovation and sustainability in farming while ensuring food security for communities across the nation.
              </p>
            </Card>
          </div>

          <div>
            <h2 className="text-4xl font-heading font-semibold text-primary text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="p-6 rounded-2xl hover:shadow-lg transition-all">
                  <div className="bg-accent/20 rounded-xl p-4 w-fit mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-foreground/70">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-heading font-semibold mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to sell or a buyer seeking fresh produce, we're here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-5xl font-bold mb-2">1000+</p>
              <p className="text-white/80">Farmers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-5xl font-bold mb-2">5000+</p>
              <p className="text-white/80">Buyers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-5xl font-bold mb-2">10000+</p>
              <p className="text-white/80">Products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;