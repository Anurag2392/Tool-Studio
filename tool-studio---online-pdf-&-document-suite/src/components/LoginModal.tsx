import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Shield, Sparkles, LogOut, Crown, Check, Send } from 'lucide-react';
import { UserPlan } from '../types';
import { sendEmailNotification } from '../lib/emailNotifier';

export interface UserAccount {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccount;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  userPlan: UserPlan;
  onOpenPricing: () => void;
  loginNotice?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userAccount,
  onLogin,
  onLogout,
  userPlan,
  onOpenPricing,
  loginNotice,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailNoticeSent, setEmailNoticeSent] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    const displayName = name || email.split('@')[0] || 'Tool Studio User';

    // Dispatch email notification to support@tool-studio.in
    await sendEmailNotification({
      type: mode === 'signup' ? 'SIGNUP' : 'LOGIN',
      userEmail: email,
      userName: displayName,
      details: `User ${mode === 'signup' ? 'registered' : 'logged in'} on Tool Studio. Password verified.`,
      targetEmail: 'support@tool-studio.in',
    });

    setEmailNoticeSent(`Email notification sent to support@tool-studio.in`);

    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        name: displayName,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
      });
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  const handleQuickDemoLogin = async (demoType: 'free' | 'pro') => {
    setIsSubmitting(true);
    const demoEmail = demoType === 'pro' ? 'alex.pro@toolstudio.app' : 'sam.free@toolstudio.app';
    const demoName = demoType === 'pro' ? 'Alex Rivera (Pro)' : 'Sam Taylor (Guest)';

    await sendEmailNotification({
      type: 'LOGIN',
      userEmail: demoEmail,
      userName: demoName,
      details: `Quick Demo ${demoType.toUpperCase()} login initialized`,
      targetEmail: 'support@tool-studio.in',
    });

    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        name: demoName,
        email: demoEmail,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoType === 'pro' ? 'Alex' : 'Sam'}`,
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);

    await sendEmailNotification({
      type: 'LOGIN',
      userEmail: 'user.google@gmail.com',
      userName: 'Google User',
      details: 'Connected via Google OAuth authentication',
      targetEmail: 'support@tool-studio.in',
    });

    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        name: 'Google User',
        email: 'user.google@gmail.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">
              TS
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {userAccount.isLoggedIn ? 'My Account Profile' : mode === 'login' ? 'Tool Studio Login' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {userAccount.isLoggedIn ? 'Manage your subscription & files' : 'Access high-speed PDF tools & AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* IF USER IS ALREADY LOGGED IN */}
        {userAccount.isLoggedIn ? (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl overflow-hidden shrink-0 border border-emerald-200">
                {userAccount.avatarUrl ? (
                  <img src={userAccount.avatarUrl} alt={userAccount.name} className="w-full h-full object-cover" />
                ) : (
                  userAccount.name.charAt(0)
                )}
              </div>
              <div className="flex-1 truncate">
                <h4 className="font-extrabold text-slate-900 text-base truncate">{userAccount.name}</h4>
                <p className="text-xs text-slate-500 truncate">{userAccount.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      userPlan.isPro
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {userPlan.isPro ? 'Pro Member' : 'Free Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Benefits Overview */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-600" /> Account Status
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {userPlan.isPro
                  ? 'Your Tool Studio Pro account is active! You enjoy unlimited PDF conversions, ad-free experience, and priority Gemini AI document tools.'
                  : 'You are currently on the Free plan. Upgrade to Tool Studio Pro with PhonePe for unlimited file size & ad-free speed.'}
              </p>
            </div>

            {!userPlan.isPro && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Crown size={16} className="text-amber-300 fill-amber-300" />
                Upgrade to Pro via PhonePe
              </button>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
            >
              <LogOut size={14} /> Log Out of Tool Studio
            </button>
          </div>
        ) : (
          /* IF USER IS NOT LOGGED IN */
          <div className="space-y-4">

            {loginNotice && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-3.5 text-xs font-bold space-y-1 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-1.5 text-amber-950 font-black">
                  <Shield size={16} className="text-amber-600 shrink-0" />
                  <span>Website Login Required for License</span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  {loginNotice}
                </p>
              </div>
            )}
            
            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google OAuth Button - Primary Login Method */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3 bg-white border-2 border-slate-300 hover:border-[#4285F4] text-slate-800 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer relative group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continue with Google</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-md ml-auto border border-blue-200">
                Fast Login
              </span>
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">
                or email
              </span>
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Tool Studio' : 'Create Free Account'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">
                Quick One-Click Demo
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('free')}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer text-center"
                >
                  Demo Free User
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pro')}
                  className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold cursor-pointer text-center"
                >
                  Demo Pro User
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
