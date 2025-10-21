'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Eye, EyeOff, LogIn } from 'lucide-react';
import { onAuthStateChange, signOutUser, isAdmin, signIn } from '@/lib/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy Policy' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              Finisher Blog Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Auth Section */}
              {user ? (
                <div className="flex items-center space-x-3">
                  {isAdmin(user) && (
                    <Link
                      href="/admin/dashboard"
                      className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-400/10"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOutUser();
                      window.location.href = '/';
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10 flex items-center space-x-1"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="neon-button px-4 py-2 text-sm font-medium flex items-center space-x-1"
                >
                  <User size={16} />
                  <span>Sign Up / Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button and auth */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin(user) && (
                  <Link
                    href="/admin/dashboard"
                    className="text-blue-400 hover:text-blue-300 p-2 rounded-md transition-colors duration-200"
                  >
                    <User size={20} />
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOutUser();
                    window.location.href = '/';
                  }}
                  className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
              >
                <User size={20} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="border-t border-white/10 pt-2 mt-2">
                {isAdmin(user) && (
                  <Link
                    href="/admin/dashboard"
                    className="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-blue-400/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOutUser();
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10 w-full text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 pt-2 mt-2">
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10 w-full text-left"
                >
                  Sign Up / Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </nav>
  );
};

// Auth Modal Component
const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { user, error: signInError } = await signIn(email, password);
    
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else if (user) {
      onClose();
      // Redirect based on user type
      if (isAdmin(user)) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h2 className="text-xl font-bold gradient-text">Sign In</h2>
          <p className="text-gray-300 text-sm mt-1">Access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="modal-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="modal-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 pr-10 text-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neon-button py-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Admin credentials: admin@gmail.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;