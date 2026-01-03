import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Package, FileHeart, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-success-50">
        {/* Animated Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Medical Icons Pattern */}
        <div className="absolute inset-0 opacity-5">
          <Package className="absolute top-1/4 left-1/4 w-16 h-16 text-primary-600 animate-pulse" />
          <FileHeart className="absolute top-1/3 right-1/4 w-20 h-20 text-danger-600 animate-bounce" style={{ animationDuration: '3s' }} />
          <Zap className="absolute bottom-1/3 left-1/3 w-12 h-12 text-warning-600 animate-pulse" style={{ animationDelay: '1s' }} />
          <Package className="absolute bottom-1/4 right-1/3 w-14 h-14 text-success-600 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-start">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-success-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <img src={logo} alt="VIOR Health" className="relative h-24 w-auto" />
              </div>
            </div>
            <p className="text-lg text-neutral-700 font-medium">
              Comprehensive Pharmacy Management System
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-primary-100 hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-neutral-800">Real-time Inventory</h3>
                <p className="text-sm text-neutral-600">Track stock levels instantly</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-success-100 hover:border-success-300 transition-all duration-300 hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileHeart className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-neutral-800">Patient Care</h3>
                <p className="text-sm text-neutral-600">Manage prescriptions efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-warning-100 hover:border-warning-300 transition-all duration-300 hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-neutral-800">Fast Processing</h3>
                <p className="text-sm text-neutral-600">Quick and secure transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="VIOR Health" className="h-20 w-auto" />
            </div>
            <p className="text-neutral-600">Pharmacy Management System</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" disabled={loading} />
                  <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                </label>
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-neutral-500">
            <p>&copy; 2026 VIOR Health. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
