import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Sprout, Bug, Leaf, TrendingUp, Droplets } from 'lucide-react';

const AgricultureInfoPage = () => {
  const guides = [
    {
      icon: <Sprout className="h-8 w-8" />,
      title: "Crop Guide",
      description: "Complete information on various crops including sowing, harvesting, and care instructions.",
      topics: ["Seasonal crops", "Soil requirements", "Water management", "Harvesting tips"]
    },
    {
      icon: <Bug className="h-8 w-8" />,
      title: "Pest Control",
      description: "Natural and chemical pest control methods to protect your crops effectively.",
      topics: ["Common pests", "Prevention methods", "Organic solutions", "Treatment schedules"]
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Organic Farming",
      description: "Learn sustainable farming practices and organic cultivation techniques.",
      topics: ["Organic fertilizers", "Composting", "Natural pesticides", "Certification process"]
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Insights",
      description: "Latest market prices, trends, and demand forecasts for agricultural products.",
      topics: ["Price trends", "Demand forecast", "Export opportunities", "Best selling season"]
    },
    {
      icon: <Droplets className="h-8 w-8" />,
      title: "Irrigation Techniques",
      description: "Modern irrigation methods to optimize water usage and improve crop yield.",
      topics: ["Drip irrigation", "Sprinkler systems", "Water conservation", "Scheduling"]
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Government Schemes",
      description: "Information about government subsidies, loans, and support programs for farmers.",
      topics: ["Subsidies", "Loan programs", "Insurance schemes", "Application process"]
    }
  ];

  const farmingTips = [
    "Test your soil regularly to understand nutrient requirements",
    "Practice crop rotation to maintain soil health",
    "Use organic matter to improve soil structure",
    "Implement integrated pest management (IPM)",
    "Maintain proper drainage in fields",
    "Keep accurate records of all farming activities",
    "Stay updated with weather forecasts",
    "Invest in quality seeds from reliable sources"
  ];

  return (
    <div className="min-h-screen" data-testid="agriculture-info-page">
      <section className="bg-gradient-to-b from-[#FAF9F6] to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6" data-testid="agri-info-title">
              Agriculture Information
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              Comprehensive guides and resources to help you succeed in modern agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {guides.map((guide, index) => (
              <Card key={index} className="p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-accent/20 rounded-2xl p-4 w-fit mb-6 text-primary">
                  {guide.icon}
                </div>
                <h3 className="font-heading text-2xl font-semibold text-primary mb-4">{guide.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">{guide.description}</p>
                <ul className="space-y-2">
                  {guide.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="p-8 md:p-12 rounded-3xl bg-accent/10 border-accent/30">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-primary mb-8 text-center">
              Quick Farming Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmingTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl">
                  <span className="text-primary font-bold text-lg flex-shrink-0">{index + 1}.</span>
                  <p className="text-foreground/70">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-6">Need More Information?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our agricultural experts for personalized guidance
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 py-6 text-lg"
            asChild
          >
            <Link to="/contact">Contact Experts</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AgricultureInfoPage;