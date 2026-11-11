import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { X, Calendar, MapPin, AlertTriangle, ShieldAlert, Sparkles, CheckCircle, Trophy, Bike, Info } from 'lucide-react';

export const HostEventModal = ({ isOpen, onClose, onEventCreated, openAuthModal, openCreateClubModal }) => {
  const { user, club, refreshMe } = useAuth();
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('PUNE FULL THROTTLE');
  const [tagline, setTagline] = useState("Born in the land of Chhatrapati Shivaji Maharaj's valor, experience pure adrenaline!");
  const [category, setCategory] = useState('bike');
  const [eventType, setEventType] = useState('Dirt Track Racing');
  const [startDate, setStartDate] = useState('2026-11-14');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [venue, setVenue] = useState('AISSMS College Ground');
  const [city, setCity] = useState('Pune');
  const [baseEntryFee, setBaseEntryFee] = useState(1500);
  const [sanctionedBy, setSanctionedBy] = useState('FMSCI (The Federation of Motor Sports Clubs of India)');
  
  const [duplicateAlert, setDuplicateAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live duplicate event detection check as user types
  useEffect(() => {
    if (!title || title.trim().length < 4) {
      setDuplicateAlert(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.checkDuplicate({ title, venue, startDate });
        if (res && res.isDuplicate) {
          setDuplicateAlert(res.reason);
        } else {
          setDuplicateAlert(null);
        }
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, venue, startDate]);

  if (!isOpen) return null;

  // Fast test fill for duplicate ban simulation
  const handleLoadDuplicateSample = () => {
    setTitle('Deccan Conqueror Dirt Track : Pune 2.0');
    setVenue('AISSMS College Ground');
    setStartDate('2026-11-14');
    setCity('Pune');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!club) {
      openCreateClubModal();
      return;
    }

    if (club.status !== 'active') {
      setError('Official Club Activation required. Please complete your club accreditation fee first.');
      return;
    }

    if (duplicateAlert) {
      setError('CANNOT HOST: Duplicate event detected. Duplicate events are blocked to safeguard verified organizers and platform integrity.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.createEvent({
        title,
        subtitle,
        tagline,
        category,
        eventType,
        startDate,
        endDate,
        venue,
        city,
        baseEntryFee,
        sanctionedBy
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFFFFF', '#14161D']
      });

      await refreshMe();
      if (onEventCreated) onEventCreated(res.event);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#14161D] border-2 border-[#282B36] rounded-2xl shadow-2xl text-[#FFFFFF] overflow-hidden">
        
        {/* Accent Bar */}
        <div className="h-1.5 bg-[#FF5500]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9E9EA7] hover:text-[#FFFFFF] rounded-lg bg-[#1A1D26] hover:bg-[#282B36] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-1">
              <Trophy className="w-4 h-4" />
              <span>OFFICIAL EVENT SANCTIONING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FFFFFF]">
              Host Motorsport Race Meet
            </h2>
            <p className="text-xs text-[#9E9EA7]">
              Host on your club's Free Tier (up to 15 racers free) with automated duplicate-ban protection.
            </p>
          </div>

          {/* Duplicate Test Tool Button */}
          <div className="mb-6 p-3 rounded-xl bg-[#0B0C10] border border-[#282B36] flex items-center justify-between">
            <div className="text-[11px] text-[#9E9EA7]">
              <strong className="text-[#FFFFFF]">Anti-Duplicate Test:</strong> Fill existing Pune 2.0 data to test duplicate detection ban.
            </div>
            <button
              type="button"
              onClick={handleLoadDuplicateSample}
              className="px-3 py-1.5 rounded-lg bg-[#14161D] hover:bg-[#1A1D26] border border-[#FF5500]/50 hover:border-[#FF5500] text-[11px] font-bold text-[#FF5500] transition-colors"
            >
              Simulate Duplicate
            </button>
          </div>

          {/* DUPLICATE DETECTION WARNING / BAN NOTICE */}
          {duplicateAlert && (
            <div className="mb-6 p-4 rounded-xl bg-[#0B0C10] border-2 border-[#FF5500] text-xs text-[#FFFFFF] animate-pulse">
              <div className="flex items-center gap-2 text-[#FF5500] font-black uppercase tracking-wider text-xs mb-1">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>ANTI-DUPLICATION SYSTEM TRIGGERED</span>
              </div>
              <p className="text-[#FFFFFF] font-bold mb-1">{duplicateAlert}</p>
              <p className="text-[11px] text-[#9E9EA7]">
                Duplicate events cannot be published. This preserves verified organizers' exclusivity and safeguards our platform business model.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#0B0C10] border-l-4 border-[#FF5500] text-xs text-[#FFFFFF]">
              <p className="font-bold text-[#FF5500] mb-0.5">Hosting Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                Event Title <span className="text-[#FF5500]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pune Dirt Track Championship : Season 3"
                className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. PUNE FULL THROTTLE"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Discipline Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                >
                  <option value="bike">🏍️ Motorcycle Dirt Track / Supercross</option>
                  <option value="car">🏎️ Car Autocross / Rally Sprint</option>
                </select>
              </div>
            </div>

            {/* Dates & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Start Date <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Venue / Ground <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. AISSMS College Ground"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  City / State <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Base Entry Fee (₹ per class)
                </label>
                <input
                  type="number"
                  value={baseEntryFee}
                  onChange={(e) => setBaseEntryFee(e.target.value)}
                  placeholder="1500"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                  Sanctioning Body
                </label>
                <input
                  type="text"
                  value={sanctionedBy}
                  onChange={(e) => setSanctionedBy(e.target.value)}
                  placeholder="FMSCI Affiliated"
                  className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                />
              </div>
            </div>

            {/* Hosting Tier Explainer Box */}
            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#282B36] text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#FFFFFF]">Assigned Tier: Club Free Quota</span>
                <span className="text-[#FF5500] font-black uppercase text-[10px] bg-[#14161D] px-2 py-0.5 rounded border border-[#FF5500]/40">
                  15 Racer Max
                </span>
              </div>
              <p className="text-[#9E9EA7] text-[11px]">
                Your verified club quota includes 15 participant entries at ₹0 platform charge. If your entries exceed 15, you can unlock the Pro Tier (Unlimited racers) at any time from your Club Dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !!duplicateAlert}
              className="w-full bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-[#FFFFFF] font-black uppercase tracking-wider text-xs py-3.5 rounded-lg shadow-lg shadow-[#FF5500]/25 transition-all"
            >
              {loading ? 'Publishing Grid...' : duplicateAlert ? 'Blocked by Anti-Duplicate Engine' : 'Publish Race Event (15-Racer Free Tier)'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
