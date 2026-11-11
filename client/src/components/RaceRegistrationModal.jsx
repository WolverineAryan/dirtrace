import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { X, CheckCircle, AlertTriangle, Shield, Bike, FileText, QrCode, ExternalLink, Phone } from 'lucide-react';

export const RaceRegistrationModal = ({ isOpen, onClose, event, onRegistered, openAuthModal }) => {
  const { user, refreshMe } = useAuth();
  
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [competitionNumber, setCompetitionNumber] = useState('');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isChampionship, setIsChampionship] = useState(true);
  const [bikeSharing, setBikeSharing] = useState(false);
  const [fmsciLicenseNo, setFmsciLicenseNo] = useState('');
  const [hasRcBook, setHasRcBook] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  
  const [takenNumbers, setTakenNumbers] = useState([]);
  const [numberStatus, setNumberStatus] = useState(null); // 'available' | 'taken'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  useEffect(() => {
    if (user) {
      setRiderName(user.name || '');
      setRiderEmail(user.email || '');
      setRiderPhone(user.phone || '');
      setFmsciLicenseNo(user.fmsciNumber || '');
    }
  }, [user]);

  useEffect(() => {
    if (event?.id) {
      api.getEvent(event.id).then(data => {
        if (data.takenNumbers) {
          setTakenNumbers(data.takenNumbers);
        }
      }).catch(console.error);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  // Real-time choice number checker
  const handleNumberChange = (val) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 3);
    setCompetitionNumber(cleaned);
    if (!cleaned) {
      setNumberStatus(null);
      return;
    }
    const isTaken = takenNumbers.includes(cleaned);
    setNumberStatus(isTaken ? 'taken' : 'available');
  };

  const toggleClass = (className) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter(c => c !== className));
    } else {
      if (isChampionship && selectedClasses.length >= 4) {
        setError('Championship Rule: You can select a maximum of 4 classes for Championship points.');
        return;
      }
      setError('');
      setSelectedClasses([...selectedClasses, className]);
    }
  };

  const baseFee = event.baseEntryFee || 1500;
  const totalFee = baseFee * selectedClasses.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (numberStatus === 'taken') {
      setError(`Competition Number #${competitionNumber} is already booked on first-come, first-served basis!`);
      return;
    }

    if (selectedClasses.length === 0) {
      setError('Please choose at least one racing class');
      return;
    }

    if (isChampionship && selectedClasses.length > 4) {
      setError('Championship Rule Violation: Max 4 classes allowed for Championship!');
      return;
    }

    if (!fmsciLicenseNo || !hasRcBook || !hasInsurance) {
      setError('Mandatory Scrutineering Documents: FMSCI License, Bike RC Book, and Insurance copy are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.registerForEvent(event.id, {
        riderName,
        riderPhone,
        riderEmail,
        bikeModel,
        competitionNumber,
        selectedClasses,
        isChampionship,
        bikeSharing,
        fmsciLicenseNo,
        hasRcBook,
        hasInsurance
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFFFFF', '#14161D']
      });

      setSuccessTicket(res.registration);
      await refreshMe();
      if (onRegistered) onRegistered(res.registration);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#14161D] border-2 border-[#282B36] rounded-2xl shadow-2xl text-[#FFFFFF] overflow-hidden">
        
        {/* Top Motorsport Accent Line */}
        <div className="h-2 bg-[#FF5500]"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#9E9EA7] hover:text-[#FFFFFF] rounded-lg bg-[#1A1D26] hover:bg-[#282B36] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successTicket ? (
          /* Success Digital Ticket View */
          <div className="p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#FF5500]/20 border-2 border-[#FF5500] flex items-center justify-center mx-auto mb-4 text-[#FF5500]">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <span className="inline-block px-3 py-1 rounded bg-[#0B0C10] border border-[#FF5500] text-xs font-black uppercase text-[#FF5500] mb-2 tracking-widest">
              OFFICIAL ENTRY CONFIRMED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mb-2">
              YOU'RE ON THE GRID!
            </h2>
            <p className="text-xs text-[#9E9EA7] max-w-md mx-auto mb-6">
              Choice Number <span className="text-[#FF5500] font-black">#{successTicket.competitionNumber}</span> is strictly locked in your name for <strong className="text-[#FFFFFF]">{event.title}</strong>.
            </p>

            {/* Motorsport Digital Pass Card */}
            <div className="max-w-md mx-auto bg-[#0B0C10] border-2 border-[#FF5500] rounded-xl p-6 text-left relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start border-b border-[#282B36] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#FF5500] uppercase tracking-wider">OFFICIAL RACE PASS</span>
                  <div className="text-lg font-black">{event.title}</div>
                  <div className="text-xs text-[#9E9EA7]">{event.venue}, {event.city} • {event.startDate}</div>
                </div>
                <div className="bg-[#FF5500] text-[#FFFFFF] px-3 py-1 rounded-lg text-2xl font-black tracking-tighter">
                  #{successTicket.competitionNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <div className="text-[#9E9EA7] uppercase text-[10px] font-bold">Rider</div>
                  <div className="font-bold text-[#FFFFFF]">{successTicket.riderName}</div>
                </div>
                <div>
                  <div className="text-[#9E9EA7] uppercase text-[10px] font-bold">Vehicle Model</div>
                  <div className="font-bold text-[#FFFFFF]">{successTicket.bikeModel}</div>
                </div>
                <div>
                  <div className="text-[#9E9EA7] uppercase text-[10px] font-bold">FMSCI License</div>
                  <div className="font-bold text-[#FFFFFF]">{successTicket.fmsciLicenseNo}</div>
                </div>
                <div>
                  <div className="text-[#9E9EA7] uppercase text-[10px] font-bold">Total Entry Fee</div>
                  <div className="font-bold text-[#FF5500]">₹{successTicket.totalFee}</div>
                </div>
              </div>

              <div className="border-t border-[#282B36] pt-3 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-[#9E9EA7] uppercase">Classes ({successTicket.classes?.length})</div>
                  <div className="font-medium text-[#FFFFFF]">{successTicket.classes?.join(', ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#9E9EA7]">Pass ID</div>
                  <div className="font-mono text-[11px] text-[#FF5500] font-bold">{successTicket.qrTicket}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={event.whatsappLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="bg-[#1A1D26] hover:bg-[#282B36] border border-[#282B36] hover:border-[#FF5500] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#FF5500]" />
                Join WhatsApp Group
              </a>
              <button
                onClick={onClose}
                className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg shadow-[#FF5500]/25 transition-all"
              >
                Done / Back to Pit
              </button>
            </div>
          </div>
        ) : (
          /* Race Entry Registration Form */
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-1">
                <Bike className="w-4 h-4" />
                <span>OFFICIAL REGISTRATION WINDOW</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FFFFFF]">
                Lock Your Race Entry: {event.title}
              </h2>
              <p className="text-xs text-[#9E9EA7]">
                AISSMS College Ground, Pune • 14th & 15th Nov 2026 • Sanctioned by {event.sanctionedBy}
              </p>
            </div>

            {/* Capacity notice */}
            {event.tier === 'free_tier' && (
              <div className="mb-4 p-3 rounded-xl bg-[#0B0C10] border border-[#282B36] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse"></span>
                  <span className="text-[#9E9EA7]">
                    Live Entries: <strong className="text-[#FFFFFF]">{event.currentRegistrations || 0} / {event.maxRegistrations} Slots</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FF5500] bg-[#1A1D26] px-2 py-0.5 rounded border border-[#FF5500]/30">
                  Strict First-Come, First-Served
                </span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#0B0C10] border-l-4 border-[#FF5500] text-xs text-[#FFFFFF]">
                <div className="flex items-center gap-2 text-[#FF5500] font-black uppercase text-[11px] mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Entry Scrutineering Notice</span>
                </div>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Choice Number & Bike Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* CHOICE NUMBER PICKER */}
                <div className="bg-[#0B0C10] p-3.5 rounded-xl border border-[#282B36]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                      <span>Choice Number</span>
                      <span className="text-[#FF5500]">*</span>
                    </label>
                    {numberStatus === 'available' && (
                      <span className="text-[10px] font-bold text-[#FFFFFF] bg-[#FF5500] px-2 py-0.5 rounded">
                        AVAILABLE ✓
                      </span>
                    )}
                    {numberStatus === 'taken' && (
                      <span className="text-[10px] font-bold text-[#FFFFFF] bg-black border border-[#FF5500] px-2 py-0.5 rounded text-[#FF5500]">
                        ALREADY BOOKED ✗
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={competitionNumber}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    placeholder="e.g. 97, 46, 07"
                    className="w-full bg-[#14161D] border-2 border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-lg font-black text-[#FFFFFF] tracking-widest outline-none"
                  />
                  <p className="text-[10px] text-[#9E9EA7] mt-1.5">
                    Assigned strictly first-come, first-served. One Bike = One Number.
                  </p>
                  
                  {/* Booked Numbers hint */}
                  {takenNumbers.length > 0 && (
                    <div className="mt-2 text-[10px] text-[#9E9EA7]">
                      Taken: {takenNumbers.map(n => `#${n}`).join(', ')}
                    </div>
                  )}
                </div>

                {/* BIKE / VEHICLE MODEL */}
                <div className="bg-[#0B0C10] p-3.5 rounded-xl border border-[#282B36]">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#FFFFFF] mb-1">
                    Bike / Vehicle Model <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    placeholder="e.g. Kawasaki KX250 / KTM 390 / RX100"
                    className="w-full bg-[#14161D] border-2 border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] placeholder-[#9E9EA7]/50 outline-none"
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="bikeSharing"
                      checked={bikeSharing}
                      onChange={(e) => setBikeSharing(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#FF5500] rounded"
                    />
                    <label htmlFor="bikeSharing" className="text-[11px] text-[#9E9EA7] cursor-pointer">
                      Bike Sharing (Multiple riders on same machine)
                    </label>
                  </div>
                </div>

              </div>

              {/* Row 2: Rider details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    Rider Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={riderPhone}
                    onChange={(e) => setRiderPhone(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9E9EA7] mb-1">
                    Rider Email
                  </label>
                  <input
                    type="email"
                    required
                    value={riderEmail}
                    onChange={(e) => setRiderEmail(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Class Selection (All 17 Classes) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-2">
                    <span>Select Race Classes ({selectedClasses.length} selected)</span>
                    <span className="text-[10px] text-[#FF5500] font-normal">₹1,500 / class</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="championship"
                      checked={isChampionship}
                      onChange={(e) => setIsChampionship(e.target.checked)}
                      className="accent-[#FF5500]"
                    />
                    <label htmlFor="championship" className="text-[11px] text-[#9E9EA7] cursor-pointer">
                      Championship Entry (Max 4 classes)
                    </label>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto p-2 bg-[#0B0C10] border border-[#282B36] rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {event.classes?.map((cls) => {
                    const isSelected = selectedClasses.includes(cls.name);
                    return (
                      <button
                        type="button"
                        key={cls.id || cls.name}
                        onClick={() => toggleClass(cls.name)}
                        className={`p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#1A1D26] border-[#FF5500] text-[#FFFFFF]'
                            : 'bg-[#14161D] border-[#282B36] text-[#9E9EA7] hover:border-[#FF5500]/40'
                        }`}
                      >
                        <span className="font-bold truncate pr-1">{cls.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                          isSelected ? 'bg-[#FF5500] text-[#FFFFFF]' : 'bg-[#0B0C10] text-[#9E9EA7]'
                        }`}>
                          ₹{cls.fee}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Mandatory Scrutineering Documents */}
              <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#282B36] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#FF5500]" />
                    <span>Mandatory Scrutineering Requirements</span>
                  </span>
                  <a
                    href={event.fmsciLicenseLink || 'https://lic.fmsci.co.in/#/oneevent-fmsci'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#FF5500] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Get FMSCI 1-Event License</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#9E9EA7] uppercase mb-1">
                    FMSCI License Number <span className="text-[#FF5500]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fmsciLicenseNo}
                    onChange={(e) => setFmsciLicenseNo(e.target.value)}
                    placeholder="e.g. FMSCI-2026-MH-8492 or Applied"
                    className="w-full bg-[#14161D] border border-[#282B36] focus:border-[#FF5500] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-[#14161D] border border-[#282B36] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={hasRcBook}
                      onChange={(e) => setHasRcBook(e.target.checked)}
                      className="accent-[#FF5500]"
                    />
                    <span className="text-[11px] text-[#FFFFFF]">
                      Bike RC Book Copy (Ready for Scrutiny) <span className="text-[#FF5500]">*</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-[#14161D] border border-[#282B36] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={hasInsurance}
                      onChange={(e) => setHasInsurance(e.target.checked)}
                      className="accent-[#FF5500]"
                    />
                    <span className="text-[11px] text-[#FFFFFF]">
                      Valid Insurance Copy (Mandatory) <span className="text-[#FF5500]">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Bottom Payment / Confirm Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#282B36]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#9E9EA7]">Total Scrutiny & Entry Fee</div>
                  <div className="text-2xl font-black text-[#FF5500]">
                    ₹{totalFee.toLocaleString()}
                    <span className="text-xs text-[#9E9EA7] font-normal ml-1">
                      ({selectedClasses.length} {selectedClasses.length === 1 ? 'class' : 'classes'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#1A1D26] hover:bg-[#282B36] text-xs font-bold text-[#FFFFFF] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || selectedClasses.length === 0}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-[#FFFFFF] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 transition-all"
                  >
                    {loading ? 'Confirming Grid Slot...' : `Lock Choice #${competitionNumber || '??'} & Enter`}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
