
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowRight, Shield, Users, Zap, BookOpen, TrendingUp, Globe, CheckCircle, Share2 } from "lucide-react";
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
            Create and Verify Micro-Learning Diplomas on the Blockchain
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            In today's fast-paced world, micro-learning and skill-based certifications are the future. 
            Generate secure, instantly verifiable digital diplomas that employers trust and learners can proudly share.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Micro-Learning Ready
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Instantly Verifiable
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Share2 className="w-4 h-4 mr-1" />
              Easy Sharing
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')}>
              Try Free – No Sign Up
            </Button>
          </div>
        </section>

        {/* Value Proposition Banner */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3">Why Verified Diplomas Matter More Than Ever</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <BookOpen className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Micro-Learning Revolution</h3>
                    <p>68% of professionals prefer bite-sized learning. Showcase your continuous skill development with stackable credentials.</p>
                  </div>
                  <div>
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Combat Credential Fraud</h3>
                    <p>With 40% of resumes containing false information, blockchain verification ensures your achievements are trusted.</p>
                  </div>
                  <div>
                    <Globe className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Global Recognition</h3>
                    <p>Share your verified credentials instantly across LinkedIn, portfolios, and job applications worldwide.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                Tamper-proof credentials that employers can instantly verify.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Eliminate credential fraud with immutable blockchain technology. Each diploma comes with a unique verification link and QR code.
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
                Professional diploma designs in seconds, not hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                From bootcamp certificates to nano-degrees, our AI creates stunning designs that match your achievement level and industry standards.
              </p>
            </CardContent>
          </Card>

          {/* Micro-Learning Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Micro-Learning Ready
              </CardTitle>
              <CardDescription>
                Perfect for modern bite-sized learning achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Designed for today's learning landscape - from 2-hour workshops to 6-week bootcamps. Stack your credentials as you grow.
              </p>
            </CardContent>
          </Card>

          {/* Easy Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-orange-500" />
                Instant Sharing
              </CardTitle>
              <CardDescription>
                Share verified credentials across all platforms instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                One-click sharing to LinkedIn, embed in portfolios, or send secure links to employers. Your achievements, everywhere.
              </p>
            </CardContent>
          </Card>

          {/* Analytics and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Impact Analytics
              </CardTitle>
              <CardDescription>
                See how your credentials are performing in the market.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track verification rates, view engagement metrics, and understand which credentials are opening doors for you.
              </p>
            </CardContent>
          </Card>

          {/* Community and Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Learning Community
              </CardTitle>
              <CardDescription>
                Connect with fellow learners and credential holders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Join thousands of professionals showcasing verified micro-credentials and advancing their careers through continuous learning.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Showcase Your Learning Journey?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join the verified credential revolution. Create your first blockchain-verified diploma today!
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Create Your First Diploma <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Diplomator. Empowering the future of verified learning.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
