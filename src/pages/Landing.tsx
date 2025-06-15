
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Wand, Users, CheckCircle, Upload, MessageSquare, Lock, Award, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Design",
      description: "Simply chat with our AI to create stunning certificates for any learning achievement. From micro-courses to major qualifications."
    },
    {
      icon: <Upload className="w-8 h-8 text-green-600" />,
      title: "Smart Upload & Inspiration",
      description: "Upload existing certificates or inspiration images. Our AI extracts branding elements and creates consistent designs for all your learning programs."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Blockchain Verification",
      description: "Every certificate is digitally signed and stored on blockchain, ensuring immutable proof of continuous learning achievements."
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Tamper-Proof Security",
      description: "Cryptographic signatures prevent forgery. Learners and employers can instantly verify any skill or knowledge acquisition."
    }
  ];

  const benefits = [
    "Instant certificate creation for micro-learning achievements",
    "Professional designs that showcase continuous growth",
    "Blockchain-backed authenticity for all skill certifications",
    "Secure distribution to learners and professionals",
    "Tamper-proof digital credentials for lifelong learning",
    "Global verification system for any knowledge domain"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Diplomator</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600 font-semibold">Embracing the Micro-Learning Revolution</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Showcase Continuous Learning with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}AI & Blockchain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              In today's fast-paced world, we learn constantly through micro-courses, workshops, and skill-building sessions. 
              Create beautiful, verifiable certificates for every learning milestone - from 5-minute tutorials to comprehensive programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
                <Lightbulb className="w-5 h-5 mr-2" />
                Start Certifying Learning
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/demo')}>
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Micro-Learning Focus Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            The Future is Continuous Learning
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Whether it's a 10-minute skill-building session, a weekend workshop, or a comprehensive certification program - 
            every learning moment deserves recognition. Help your organization and learners showcase their commitment to growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Micro-Courses</h3>
              <p className="text-blue-100">
                Certificate completion of bite-sized learning modules and skill-building sessions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Skill Badges</h3>
              <p className="text-blue-100">
                Recognize specific competencies and practical skills acquired through hands-on learning.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Full Programs</h3>
              <p className="text-blue-100">
                Create comprehensive certificates for complete learning journeys and major achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Learning Organizations Worldwide
            </h2>
            <p className="text-gray-600">
              Join thousands of organizations certifying continuous learning and skill development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Learning Certificates Issued</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-gray-600">Learning Organizations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Verification Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Diplomator?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combine the power of AI design with blockchain security for diplomas that are both beautiful and bulletproof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple. Secure. Continuous.
            </h2>
            <p className="text-xl text-gray-600">
              Certifying every learning achievement has never been easier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design & Create</h3>
              <p className="text-gray-600">
                Describe your learning program to our AI. From micro-courses to comprehensive certifications - create professional certificates instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Authenticate</h3>
              <p className="text-gray-600">
                Every learning achievement is cryptographically signed and recorded on blockchain for immutable verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Showcase & Verify</h3>
              <p className="text-gray-600">
                Learners can proudly showcase their continuous growth. Employers can instantly verify any skill or knowledge claim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Empower Lifelong Learning
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                In an era where skills evolve rapidly, help your organization and learners document every 
                step of their learning journey. From quick tutorials to major achievements - every learning moment matters.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <BookOpen className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Continuous Learning Recognition</h3>
              <p className="text-blue-100 mb-6">
                Whether it's a 5-minute skill tutorial, a weekend workshop, or a multi-month program - 
                every learning achievement deserves professional recognition. Build a culture of continuous growth.
              </p>
              <Button variant="secondary" className="w-full">
                Explore Learning Solutions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Celebrate Continuous Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations already empowering learners to showcase their commitment to growth and skill development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
              <Users className="w-5 h-5 mr-2" />
              Start Certifying Learning
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600" onClick={() => navigate('/demo')}>
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6" />
                <span className="text-xl font-bold">Diplomator</span>
              </div>
              <p className="text-gray-400">
                Creating the future of secure, verifiable credentials through AI and blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>AI Design</div>
                <div>Blockchain Security</div>
                <div>Verification System</div>
                <div>API Access</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Security</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div>Documentation</div>
                <div>Help Center</div>
                <div>Contact</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Diplomator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
