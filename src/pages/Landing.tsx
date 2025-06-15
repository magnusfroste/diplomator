import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowRight, Shield, Users, Zap, BookOpen, TrendingUp, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex rounded-full bg-secondary p-1 text-secondary-foreground mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create and Verify Diplomas on the Blockchain
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Generate secure, verifiable digital diplomas with our AI-powered tool.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Blockchain Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Blockchain Verification
              </CardTitle>
              <CardDescription>
                Securely store and verify diplomas on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ensure the authenticity and integrity of your credentials with tamper-proof blockchain technology.
              </p>
            </CardContent>
          </Card>

          {/* AI-Powered Design */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                AI-Powered Design
              </CardTitle>
              <CardDescription>
                Generate stunning diploma designs in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our AI algorithms create beautiful, professional-looking diplomas tailored to your needs.
              </p>
            </CardContent>
          </Card>

          {/* Easy Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-500" />
                Easy Sharing
              </CardTitle>
              <CardDescription>
                Share your diplomas with employers and institutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Easily share your digital diplomas via a secure link or QR code.
              </p>
            </CardContent>
          </Card>

          {/* Customizable Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Customizable Templates
              </CardTitle>
              <CardDescription>
                Choose from a variety of professionally designed templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Customize your diploma with our easy-to-use template editor.
              </p>
            </CardContent>
          </Card>

          {/* Analytics and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Analytics and Tracking
              </CardTitle>
              <CardDescription>
                Track diploma views and engagement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gain insights into how your diplomas are being used with our analytics dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Community and Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Community and Support
              </CardTitle>
              <CardDescription>
                Join our community and get the support you need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Connect with other users and get help from our support team.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Create your first blockchain-verified diploma today!
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Sign Up Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Diplomator. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
