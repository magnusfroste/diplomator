
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Wand, Users, CheckCircle, Upload, MessageSquare, Lock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Design",
      description: "Simply chat with our AI to create stunning diploma designs. Describe your vision and watch it come to life instantly."
    },
    {
      icon: <Upload className="w-8 h-8 text-green-600" />,
      title: "Smart Upload & Inspiration",
      description: "Upload existing diplomas or inspiration images. Our AI extracts branding elements and creates consistent designs."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Blockchain Verification",
      description: "Every diploma is digitally signed and stored on blockchain, ensuring immutable proof of authenticity."
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Tamper-Proof Security",
      description: "Cryptographic signatures prevent forgery. Recipients and employers can instantly verify authenticity."
    }
  ];

  const benefits = [
    "Instant diploma creation with AI assistance",
    "Professional designs that match your brand",
    "Blockchain-backed authenticity verification",
    "Secure distribution to recipients",
    "Tamper-proof digital certificates",
    "Global verification system"
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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Authentic Diplomas with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}AI & Blockchain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Design beautiful, professional diplomas in minutes through AI conversation. 
              Every certificate is cryptographically signed and blockchain-verified for 
              unmatched authenticity and trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
                <Wand className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/demo')}>
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Educational Institutions Worldwide
            </h2>
            <p className="text-gray-600">
              Join thousands of organizations creating secure, verifiable diplomas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Diplomas Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Institutions</div>
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
              Simple. Secure. Authentic.
            </h2>
            <p className="text-xl text-gray-600">
              Creating verified diplomas has never been easier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat & Design</h3>
              <p className="text-gray-600">
                Describe your diploma vision to our AI. Upload inspiration or existing branding for perfect consistency.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Sign</h3>
              <p className="text-gray-600">
                Every diploma is cryptographically signed and recorded on blockchain for immutable verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Distribute & Verify</h3>
              <p className="text-gray-600">
                Share diplomas with recipients. Anyone can instantly verify authenticity using our global verification system.
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
                The Future of Credential Verification
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Stop worrying about diploma fraud. Our blockchain-backed system ensures every certificate 
                is authentic, verifiable, and tamper-proof.
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
              <Shield className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Blockchain Security</h3>
              <p className="text-blue-100 mb-6">
                Each diploma receives a unique cryptographic signature stored on an immutable blockchain ledger. 
                This creates an unbreakable chain of trust that employers and institutions can verify instantly.
              </p>
              <Button variant="secondary" className="w-full">
                Learn About Our Security
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Authentic Diplomas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of institutions already using Diplomator to create secure, verifiable credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
              <Users className="w-5 h-5 mr-2" />
              Start Free Trial
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
