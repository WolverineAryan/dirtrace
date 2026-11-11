import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, ShieldCheck, Flag, Trophy } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('rider'); // 'rider' or 'club_organizer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fmsciNumber, setFmsciNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          phone,
          fmsciNumber
        });
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type) => {
    setError('');
    setLoading(true);
    try {
      if (type === 'rider') {
        await login('pranav@racing.com', 'racer123');
      } else if (type === 'club') {
        await login('roadiez@puneadventure.com', 'roadiez123');
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#14161D] border-2 border-[#282B36] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#FFFFFF] overflow-hidden">
        
        {/* Accent top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5500]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9E9EA7] hover:text-[#FFFFFF] rounded-lg bg-[#1A1D26] hover:bg-[#282B36] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-[#FF5500]" />
            <h2 className="text-xl font-black uppercase tracking-wider text-[#FFFFFF]">
              {mode === 'login' ? 'Pit Lane Access' : 'Create Racing Account'}
            </h2>
          </div>
          <p className="text-xs text-[#9E9EA7]">
            {mode === 'login' 
              ? 'Enter your credentials to manage entries, choice numbers & clubs.' 
              : 'Join the premier motorsport community for dirt track & rally events.'}
          </p>
        </div>

        {/* Quick Demo Login Pills */}
        <div className="mb-6 bg-[#0B0C10] p-3 rounded-xl border border-[#282B36]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9EA7] mb-2 flex items-center justify-between">
            <span>Fast Evaluation (Demo Accounts)</span>
            <span className="text-[#FF5500] font-black">1-Click</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rider')}
              className="px-2.5 py-2 rounded-lg bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] text-[11px] font-bold text-left text-[#FFFFFF] transition-all flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-[#FF5500]" />
              <div className="truncate">
                <div className="font-black text-[#FFFFFF]">Pranav (Racer)</div>
                <div className="text-[10px] text-[#9E9EA7]">No. 97 KX250</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('club')}
              className="px-2.5 py-2 rounded-lg bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] text-[11px] font-bold text-left text-[#FFFFFF] transition-all flex items-center gap-2"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FF5500]" />
              <div className="truncate">
                <div className="font-black text-[#FFFFFF]">Roadiez Club</div>
                <div className="text-[10px] text-[#9E9EA7]">Pune 2.0 Host</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#0B0C10] p-1 rounded-xl border border-[#282B36] mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              mode === 'login' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              mode === 'register' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            New Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#0B0C10] border-l-4 border-[#FF5500] text-xs text-[#FFFFFF]">
            <p className="font-bold text-[#FF5500] mb-0.5">Authentication Alert</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('rider')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      role === 'rider'
                        ? 'bg-[#1A1D26] border-[#FF5500] text-[#FFFFFF]'
                        : 'bg-[#0B0C10] border-[#282B36] text-[#9E9EA7]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Racer / Driver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('club_organizer')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      role === 'club_organizer'
                        ? 'bg-[#1A1D26] border-[#FF5500] text-[#FFFFFF]'
                        : 'bg-[#0B0C10] border-[#282B36] text-[#9E9EA7]'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Club Organizer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Full Name / Organizer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9E9EA7] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amarendra Sathe"
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9E9EA7] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98230 97512"
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
                  />
                </div>
              </div>

              {role === 'rider' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    FMSCI License Number (Optional)
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-[#9E9EA7] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fmsciNumber}
                      onChange={(e) => setFmsciNumber(e.target.value)}
                      placeholder="e.g. FMSCI-2026-MH-8492"
                      className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E9EA7] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@racing.com"
                className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E9EA7] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-[#FFFFFF] font-black uppercase tracking-wider text-xs py-3 rounded-lg shadow-lg shadow-[#FF5500]/25 transition-all mt-2"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Enter Pit Lane' : 'Create Official Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
