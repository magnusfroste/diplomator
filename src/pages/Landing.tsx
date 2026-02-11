
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, Shield, Zap, BookOpen, TrendingUp, Globe, CheckCircle, Share2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: "Blockchain Verification", desc: "Tamper-proof credentials with unique verification links and QR codes." },
    { icon: Zap, title: "AI-Powered Design", desc: "Professional diploma designs in seconds — from bootcamps to nano-degrees." },
    { icon: BookOpen, title: "Micro-Learning Ready", desc: "Perfect for 2-hour workshops to 6-week bootcamps. Stack credentials as you grow." },
    { icon: Share2, title: "Instant Sharing", desc: "One-click sharing to LinkedIn, portfolios, or secure links to employers." },
    { icon: TrendingUp, title: "Impact Analytics", desc: "Track verification rates and understand which credentials open doors." },
    { icon: Users, title: "Learning Community", desc: "Join thousands showcasing verified micro-credentials." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/15 border border-primary/20 p-1.5 rounded-lg">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Diplomator</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/demo')}>
              Try Free
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-6">
          <CheckCircle className="w-3 h-3 text-primary" />
          Blockchain-verified credentials
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight mb-5">
          Create and verify diplomas on the blockchain
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          Generate secure, instantly verifiable digital diplomas that employers trust and learners can proudly share.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => navigate('/auth')}>
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/demo')}>
            Try Free — No Sign Up
          </Button>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-border py-8 px-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">68%</p>
            <p className="text-xs text-muted-foreground mt-1">Prefer micro-learning</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">40%</p>
            <p className="text-xs text-muted-foreground mt-1">Resumes contain fraud</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Verifiable on-chain</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground text-center mb-12">
          Everything you need for verified credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-medium text-foreground mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-3xl mx-auto text-center px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">
            Ready to showcase your learning journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your first blockchain-verified diploma today.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Create Your First Diploma <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Diplomator. Empowering the future of verified learning.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
