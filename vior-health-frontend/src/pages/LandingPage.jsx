import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, 
  Shield, 
  BarChart3, 
  Zap, 
  PackageCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Check,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Button from '../components/common/Button';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'Starter',
      price: '150,000',
      period: '/month',
      description: 'Perfect for small pharmacies',
      features: [
        'Up to 1000 products',
        '2 user accounts',
        'Basic inventory management',
        'POS system',
        'Email support',
        'PWA access (Works offline)'
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '450,000',
      period: '/month',
      description: 'Best for growing pharmacies',
      features: [
        'Unlimited products',
        '10 user accounts',
        'Advanced inventory & analytics',
        'Prescription management',
        'Priority support',
        'API access',
        'Custom reports',
        'Multi-location support'
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For pharmacy chains',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'On-premise deployment option',
        'Training & onboarding',
        'SLA guarantee'
      ],
      popular: false,
    },
  ];

  const features = [
    {
      icon: PackageCheck,
      title: 'Smart Inventory',
      description: 'Real-time stock tracking with automated alerts',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Powerful insights for better decisions',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Fast POS System',
      description: 'Lightning-fast checkout experience',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-level security and HIPAA compliant',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Pharmacies' },
    { value: '50M+', label: 'Prescriptions' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="VIOR Health" className="h-16 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Modern Pharmacy Management
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                Manage Your
                <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Pharmacy Smarter
                </span>
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed">
                Everything you need to run a modern pharmacy - inventory tracking, 
                fast POS, analytics, and compliance - all in one powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={ArrowRight}
                  onClick={() => navigate('/login')}
                  className="text-lg px-8 py-4"
                >
                  Book Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="text-lg px-8 py-4"
                >
                  View Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
                
                {/* Dashboard Preview */}
                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <h3 className="text-lg font-bold text-neutral-900">Dashboard Overview</h3>
                    <Clock className="w-5 h-5 text-neutral-400" />
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                      <div className="text-sm opacity-90 mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold">TSH 124.3M</div>
                      <div className="text-xs opacity-75 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5%</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                      <div className="text-sm opacity-90 mb-1">Total Sales</div>
                      <div className="text-2xl font-bold">2,847</div>
                      <div className="text-xs opacity-75 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+8.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-neutral-50 rounded-xl p-6 h-48 flex items-center justify-center border border-neutral-200">
                    <BarChart3 className="w-16 h-16 text-neutral-300" />
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors">
                      New Sale
                    </button>
                    <button className="px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-neutral-200 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600">System Status</div>
                    <div className="text-sm font-bold text-green-600">99.9% Uptime</div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Card */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-4 text-white">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  <div>
                    <div className="text-xs opacity-90">Trusted by</div>
                    <div className="text-lg font-bold">500+ Pharmacies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Powerful features designed specifically for modern pharmacies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the perfect plan for your pharmacy. All plans include a 30-day free trial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 relative bg-white ${
                  plan.popular
                    ? 'border-primary-600 shadow-xl scale-105'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                  <p className="text-neutral-600 mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-sm text-neutral-600">TSH</span>
                    <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-neutral-600 mb-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Book Demo'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of pharmacies already using VIOR Health
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg" 
              icon={ArrowRight}
              onClick={() => navigate('/login')}
              className="min-w-[200px] text-lg"
            >
              Book Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="min-w-[200px] bg-white text-primary-600 hover:bg-neutral-50 text-lg border-white"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="VIOR Health" className="h-16 w-auto" />
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Modern pharmacy management for the digital age. Streamline operations, boost efficiency, and grow your business.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">24/7 Support</p>
                  <p className="text-sm font-semibold">0752747681</p>
                </div>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-3 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Request Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-4 text-neutral-400">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">Email</p>
                    <a href="mailto:info@viorhealth.pritechvior.co.tz" className="text-white hover:text-primary-400 transition-colors">info@viorhealth.pritechvior.co.tz</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">Phone</p>
                    <a href="tel:0752747681" className="text-white hover:text-primary-400 transition-colors">0752747681</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">Location</p>
                    <p className="text-white">Mbeya, Tanzania</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-neutral-400 text-sm">&copy; 2026 VIOR Health. All rights reserved.</p>
              <div className="flex items-center gap-6 text-sm text-neutral-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
