import { useState, useEffect } from 'react';
import { signUp, signIn, isValidEmail } from '../utils/supabaseAuth';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/soundUtils';
import SketchButton from '../components/SketchButton';
import QuantumAuthLayout from '../components/QuantumAuthLayout';

const AuthPage = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldFocus, setFieldFocus] = useState({});

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Psst... you forgot the email! That\'s how we find you.');
      playErrorSound();
      return false;
    }

    if (!isValidEmail(email)) {
      setError('That email looks broken. Try something like name@example.com');
      playErrorSound();
      return false;
    }

    if (!password) {
      setError('Whoa! Password\'s missing. We need one to keep your stuff safe.');
      playErrorSound();
      return false;
    }

    if (password.length < 6) {
      setError('Make your password stronger — at least 6 characters, please!');
      playErrorSound();
      return false;
    }

    if (isSignUp && password !== passwordConfirm) {
      setError('Those passwords don\'t match. Type them the same way both times.');
      playErrorSound();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    playClickSound();

    try {
      let result;

      if (isSignUp) {
        result = await signUp(email, password);
        if (result.success) {
          setSuccess('Welcome aboard! Check your email to confirm your account and get started.');
          setEmail('');
          setPassword('');
          setPasswordConfirm('');
          playSuccessSound();
          setTimeout(() => {
            setIsSignUp(false);
          }, 2000);
        } else {
          setError(result.error || 'Signup failed. Try again.');
          playErrorSound();
        }
      } else {
        result = await signIn(email, password);
        if (result.success) {
          setSuccess('Welcome back! Let\'s build some quantum circuits.');
          playSuccessSound();
          setTimeout(() => {
            onAuthSuccess?.();
          }, 800);
        } else {
          setError(result.error || 'Login failed. Try again.');
          playErrorSound();
        }
      }
    } catch (err) {
      setError('Oops! Something went weird. Try again in a moment.');
      playErrorSound();
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    playClickSound();
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
  };

  return (
    <QuantumAuthLayout>
      <div className="w-full max-w-md mx-auto animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight break-words">Q-SKETCH</h1>
          <p className="text-lg text-black/60 font-medium leading-relaxed">
            {isSignUp ? 'Join the quantum revolution' : 'Welcome back to quantum computing'}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0_0_#000000] overflow-hidden relative">
          {/* Animated quantum indicator */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="animate-spin-slow">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-black">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFieldFocus({ ...fieldFocus, email: true })}
                onBlur={() => setFieldFocus({ ...fieldFocus, email: false })}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border-2 border-black rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:scale-[1.01] ${
                  fieldFocus.email ? 'bg-black text-white placeholder-white/50' : 'bg-white text-black'
                }`}
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-black">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFieldFocus({ ...fieldFocus, password: true })}
                onBlur={() => setFieldFocus({ ...fieldFocus, password: false })}
                placeholder="••••••"
                className={`w-full px-4 py-3 border-2 border-black rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:scale-[1.01] ${
                  fieldFocus.password ? 'bg-black text-white placeholder-white/50' : 'bg-white text-black'
                }`}
                disabled={loading}
              />
            </div>

            {/* Confirm Password Input (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2 animate-fade-in">
                <label htmlFor="password-confirm" className="block text-sm font-bold text-black">
                  Confirm Password
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  onFocus={() => setFieldFocus({ ...fieldFocus, passwordConfirm: true })}
                  onBlur={() => setFieldFocus({ ...fieldFocus, passwordConfirm: false })}
                  placeholder="••••••"
                  className={`w-full px-4 py-3 border-2 border-black rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:scale-[1.01] ${
                    fieldFocus.passwordConfirm ? 'bg-black text-white placeholder-white/50' : 'bg-white text-black'
                  }`}
                  disabled={loading}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-black text-white border-2 border-black rounded-lg font-semibold text-sm animate-fade-in break-words">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-white border-2 border-black rounded-lg font-semibold text-sm animate-fade-in text-black break-words">
                ✓ {success}
              </div>
            )}

            {/* Submit Button */}
            <SketchButton
              type="submit"
              disabled={loading}
              variant="inverted"
              className="w-full font-extrabold text-lg py-3 mt-6"
            >
              {loading ? (
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block">●</span>
                  <span className="inline-block animate-pulse">●</span>
                  <span className="inline-block animate-pulse" style={{ animationDelay: '100ms' }}>●</span>
                </span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Login'
              )}
            </SketchButton>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-black text-center">
            <p className="text-sm text-black/60 mb-3">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={handleToggleMode}
              disabled={loading}
              className="text-sm font-bold text-black hover:underline disabled:opacity-50 transition-opacity"
            >
              {isSignUp ? 'Login instead' : 'Create account'}
            </button>
          </div>
        </div>

        {/* Guest Mode Option */}
        <div className="mt-6 text-center">
          <p className="text-xs text-black/60 mb-3">Or explore without an account:</p>
          <button
            onClick={() => {
              playClickSound();
              window.__guestMode = true;
              onAuthSuccess?.();
            }}
            disabled={loading}
            className="px-6 py-3 bg-white border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white transition-all text-sm"
          >
            👾 Continue as Guest
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-black/40 space-y-1">
          <p>🔒 Your data is encrypted and secure</p>
          <p>Start your quantum journey whenever you're ready</p>
        </div>
      </div>
    </QuantumAuthLayout>
  );
};

export default AuthPage;
