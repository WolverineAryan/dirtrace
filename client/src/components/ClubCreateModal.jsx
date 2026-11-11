import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { X, Trophy, Shield, CheckCircle, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

export const ClubCreateModal = ({ isOpen, onClose, onClubCreated, openAuthModal }) => {
  const { user, refreshMe } = useAuth();
  const [step, setStep] = useState(1); // 1: Info form, 2: Payment step, 3: Success
  const [name, setName] = useState('');
  const [type, setType] = useState('bike');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappGroup, setWhatsappGroup] = useState('');
  
  const [createdClub, setCreatedClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.createClub({
        name,
        type,
        description,
        location,
        contactPerson: contactPerson || user.name,
        contactPhone: contactPhone || user.phone,
        whatsappGroup
      });
      setCreatedClub(res.club);
      setStep(2); // Go to payment
    } catch (err) {
      setError(err.message || 'Club registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayActivation = async () => {
    if (!createdClub) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.payClubActivation(createdClub.id);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFFFFF', '#0B0C10']
      });
      setCreatedClub(res.club);
      setStep(3); // Success
      await refreshMe();
      if (onClubCreated) onClubCreated(res.club);
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#14161D] border-2 border-[#282B36] rounded-2xl shadow-2xl text-[#FFFFFF] overflow-hidden">
        
        {/* Top Accent line */}
        <div className="h-1.5 bg-[#FF5500]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9E9EA7] hover:text-[#FFFFFF] rounded-lg bg-[#1A1D26] hover:bg-[#282B36] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Details Form */}
        {step === 1 && (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-1">
                <Trophy className="w-4 h-4" />
                <span>OFFICIAL CLUB ONBOARDING</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FFFFFF]">
                Establish A Racing Club
              </h2>
              <p className="text-xs text-[#9E9EA7]">
                Official club accounts require an accreditation fee to host verified events with automated duplicate-prevention.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[#0B0C10] border-l-4 border-[#FF5500] text-xs text-[#FFFFFF]">
                <p className="font-bold text-[#FF5500] mb-0.5">Registration Alert</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Club / Committee Name <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pune Throttlers Motocross Club"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Discipline Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('bike')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      type === 'bike' ? 'bg-[#FF5500] border-[#FF5500] text-[#FFFFFF]' : 'bg-[#0B0C10] border-[#282B36] text-[#9E9EA7]'
                    }`}
                  >
                    🏍️ Motorcycle
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('car')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      type === 'car' ? 'bg-[#FF5500] border-[#FF5500] text-[#FFFFFF]' : 'bg-[#0B0C10] border-[#282B36] text-[#9E9EA7]'
                    }`}
                  >
                    🏎️ Car / Rally
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('mixed')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      type === 'mixed' ? 'bg-[#FF5500] border-[#FF5500] text-[#FFFFFF]' : 'bg-[#0B0C10] border-[#282B36] text-[#9E9EA7]'
                    }`}
                  >
                    🏁 Dual / Both
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Location / City Base
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Club Mission & Bio <span className="text-[#FF5500]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your racing history, track days, training, or championship events..."
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg p-3 text-xs text-[#FFFFFF] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    Club Lead / President
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Vikram Shinde"
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    Helpline / Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>
              </div>

              {/* Platform Fee Explainer */}
              <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-[#282B36] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#FF5500] font-black uppercase block">Accreditation Fee</span>
                  <span className="text-[11px] text-[#9E9EA7]">One-time official verification</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#FFFFFF]">₹2,999</div>
                  <span className="text-[10px] text-[#FF5500]">Includes 1 Free Event (15 Racers)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-[#FFFFFF] font-black uppercase tracking-wider text-xs py-3 rounded-lg shadow-lg shadow-[#FF5500]/25 transition-all"
              >
                {loading ? 'Creating...' : 'Continue to Official Accreditation'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Payment Simulator */}
        {step === 2 && (
          <div className="p-6 sm:p-8 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#0B0C10] border-2 border-[#FF5500] flex items-center justify-center mx-auto mb-4 text-[#FF5500]">
              <CreditCard className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500] bg-[#0B0C10] px-2.5 py-1 rounded border border-[#FF5500]/40">
              OFFICIAL SAAS CHECKOUT
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider mt-2 mb-1">
              Activate {createdClub?.name}
            </h2>
            <p className="text-xs text-[#9E9EA7] max-w-sm mx-auto mb-6">
              Complete the verification fee to establish your official club badge and unlock your 15-racer free event quota.
            </p>

            <div className="max-w-sm mx-auto bg-[#0B0C10] border border-[#282B36] rounded-xl p-4 text-left mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9E9EA7]">Club Account Tier:</span>
                <span className="font-bold text-[#FFFFFF]">Official Motorsport Club</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9E9EA7]">Anti-Duplicate Protection:</span>
                <span className="font-bold text-[#FF5500]">Active & Guaranteed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9E9EA7]">Included Event Hosting:</span>
                <span className="font-bold text-[#FFFFFF]">1 Free Event (15 Racers)</span>
              </div>
              <div className="border-t border-[#282B36] pt-2 flex justify-between font-black text-sm">
                <span>Total Due:</span>
                <span className="text-[#FF5500]">₹2,999</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[#0B0C10] border-l-4 border-[#FF5500] text-xs text-left text-[#FFFFFF]">
                {error}
              </div>
            )}

            <div className="flex gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg bg-[#1A1D26] hover:bg-[#282B36] text-xs font-bold text-[#FFFFFF] transition-colors"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={handlePayActivation}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-xs font-black uppercase tracking-wider text-[#FFFFFF] shadow-lg shadow-[#FF5500]/30 transition-all"
              >
                {loading ? 'Processing...' : 'Pay ₹2,999 & Activate'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#FF5500]/20 border-2 border-[#FF5500] flex items-center justify-center mx-auto mb-4 text-[#FF5500]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="text-xs font-black uppercase text-[#FF5500] tracking-widest">
              OFFICIAL STATUS ACTIVE
            </span>
            <h2 className="text-2xl font-black uppercase tracking-wider mt-1 mb-2">
              Club Accreditation Confirmed!
            </h2>
            <p className="text-xs text-[#9E9EA7] max-w-sm mx-auto mb-6">
              <strong className="text-[#FFFFFF]">{createdClub?.name}</strong> is now verified. You have 1 Free Event Hosting quota ready to publish.
            </p>

            <button
              onClick={onClose}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-8 py-3 rounded-xl shadow-lg shadow-[#FF5500]/30"
            >
              Go to Club Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
