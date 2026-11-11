import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, MapPin, Trophy, Shield, Bike, Phone, ExternalLink, Check, Users, ArrowLeft, AlertCircle } from 'lucide-react';

export const EventView = ({ eventId, onBack, onRegisterClick, onProUpgradeClick }) => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'prizes' | 'rules' | 'riders'

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await api.getEvent(eventId);
      setEventData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#FFFFFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#282B36] border-t-[#FF5500] rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-[#9E9EA7]">Loading Race Grid Data...</span>
        </div>
      </div>
    );
  }

  if (!eventData || !eventData.event) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-lg font-bold text-[#FFFFFF]">Event not found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#FF5500] rounded-lg text-xs font-bold text-[#FFFFFF]">
          Back to Events
        </button>
      </div>
    );
  }

  const { event, takenNumbers, registrations } = eventData;
  const isCapReached = !event.isProUnlocked && event.currentRegistrations >= event.maxRegistrations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-[#FFFFFF]">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E9EA7] hover:text-[#FFFFFF] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 text-[#FF5500] transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to Events Showcase</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="relative bg-[#14161D] border-2 border-[#282B36] rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="h-2 bg-[#FF5500]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Text / Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded bg-[#0B0C10] border border-[#FF5500] text-[#FF5500] text-xs font-black uppercase tracking-widest">
                  🏁 {event.eventType || 'Dirt Track Racing'}
                </span>
                <span className="px-3 py-1 rounded bg-[#1A1D26] text-[#FFFFFF] text-xs font-bold border border-[#282B36]">
                  {event.clubName}
                </span>
                {event.isProUnlocked ? (
                  <span className="px-3 py-1 rounded bg-[#FF5500] text-[#FFFFFF] text-xs font-black uppercase tracking-wider">
                    PRO UNLIMITED CAPACITY
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded bg-[#0B0C10] text-[#9E9EA7] text-xs font-bold border border-[#282B36]">
                    Club Free Tier ({event.currentRegistrations || 0}/{event.maxRegistrations} Racers)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FFFFFF] leading-none mb-3">
                {event.title}
              </h1>

              <p className="text-lg font-bold text-[#FF5500] tracking-wide mb-3 uppercase">
                {event.subtitle || 'PUNE FULL THROTTLE'}
              </p>

              <p className="text-sm text-[#9E9EA7] leading-relaxed mb-6 italic">
                "{event.tagline}"
              </p>

              {/* Crucial Meta Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 bg-[#0B0C10] p-3 rounded-xl border border-[#282B36]">
                  <div className="w-10 h-10 rounded-lg bg-[#14161D] border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Race Dates</div>
                    <div className="text-xs font-black text-[#FFFFFF]">14th & 15th November 2026</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#0B0C10] p-3 rounded-xl border border-[#282B36]">
                  <div className="w-10 h-10 rounded-lg bg-[#14161D] border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Venue & Ground</div>
                    <div className="text-xs font-black text-[#FFFFFF]">{event.venue}, {event.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs & Registration Status */}
            <div>
              {isCapReached ? (
                <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#FF5500] mb-4">
                  <div className="flex items-center gap-2 text-[#FF5500] font-black uppercase text-xs mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Free Tier Cap Reached (15 / 15 Racers)</span>
                  </div>
                  <p className="text-xs text-[#9E9EA7] mb-3">
                    The host club has used all 15 free racer slots. The organizer can unlock unlimited slots with a Pro Event Pass.
                  </p>
                  <button
                    onClick={() => onProUpgradeClick(event)}
                    className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-lg shadow-[#FF5500]/30 transition-all"
                  >
                    Unlock Pro Unlimited for ₹1,499
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onRegisterClick(event)}
                    className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-xl shadow-[#FF5500]/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Bike className="w-5 h-5" />
                    <span>Lock Choice Number & Register</span>
                  </button>

                  <a
                    href={event.whatsappLink || 'https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk'}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#0B0C10] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] text-[#FFFFFF] px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FF5500]" />
                    <span>WhatsApp Group</span>
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Right Visual Image Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden border-2 border-[#282B36] bg-[#0B0C10] shadow-xl group">
              <img
                src={event.bannerImage || '/uploads/pune_throttle.jpg'}
                alt="Pune Full Throttle Flyer"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Quick Contact Box */}
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-[#282B36] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#9E9EA7] uppercase font-bold">Race Coordinator</span>
                <div className="text-xs font-black text-[#FFFFFF]">{event.contactPerson || 'Amarendra Sathe Sir'}</div>
                <div className="text-xs text-[#FF5500] font-bold">{event.contactPhone || '+91 98230 97512'}</div>
              </div>
              <a
                href={`tel:${event.contactPhone || '+919823097512'}`}
                className="w-10 h-10 rounded-lg bg-[#14161D] border border-[#FF5500]/50 hover:border-[#FF5500] flex items-center justify-center text-[#FF5500] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#282B36] mb-6 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'classes'
              ? 'border-[#FF5500] text-[#FF5500]'
              : 'border-transparent text-[#9E9EA7] hover:text-[#FFFFFF]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>17 Race Classes & Prizes</span>
        </button>

        <button
          onClick={() => setActiveTab('numbers')}
          className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'numbers'
              ? 'border-[#FF5500] text-[#FF5500]'
              : 'border-transparent text-[#9E9EA7] hover:text-[#FFFFFF]'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Choice Numbers Grid ({takenNumbers?.length || 0} Booked)</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rules'
              ? 'border-[#FF5500] text-[#FF5500]'
              : 'border-transparent text-[#9E9EA7] hover:text-[#FFFFFF]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>FMSCI Rules & Scrutiny</span>
        </button>

        <button
          onClick={() => setActiveTab('riders')}
          className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'riders'
              ? 'border-[#FF5500] text-[#FF5500]'
              : 'border-transparent text-[#9E9EA7] hover:text-[#FFFFFF]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Grid ({registrations?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: 17 Classes & Prize Matrix */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#14161D] p-4 rounded-xl border border-[#282B36]">
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-[#FFFFFF]">
                TOTAL 17 CLASSES • CASH PRIZES & MEDALS
              </h3>
              <p className="text-xs text-[#9E9EA7]">
                Official Entry Fee: <strong className="text-[#FF5500]">₹1,500/- per class</strong> • Maximum 4 classes for Championship points.
              </p>
            </div>
            <button
              onClick={() => onRegisterClick(event)}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase px-4 py-2 rounded-lg tracking-wider"
            >
              Enter A Class
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.classes?.map((cls, idx) => (
              <div
                key={cls.id || idx}
                className="bg-[#14161D] border border-[#282B36] hover:border-[#FF5500]/50 rounded-xl p-4 transition-all"
              >
                <div className="flex justify-between items-start mb-3 border-b border-[#282B36] pb-2">
                  <div className="font-black text-sm text-[#FFFFFF]">{cls.name}</div>
                  <span className="text-xs font-black text-[#FF5500] bg-[#0B0C10] px-2 py-0.5 rounded border border-[#FF5500]/30">
                    ₹{cls.fee}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center bg-[#0B0C10] px-2.5 py-1.5 rounded">
                    <span className="text-[#FF5500] font-black">1ST PLACE</span>
                    <span className="font-bold text-[#FFFFFF]">₹{cls.p1 ? cls.p1.toLocaleString() : '10,000'} CASH</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0B0C10] px-2.5 py-1.5 rounded">
                    <span className="text-[#9E9EA7] font-bold">2ND PLACE</span>
                    <span className="font-bold text-[#FFFFFF]">₹{cls.p2 ? cls.p2.toLocaleString() : '6,000'} CASH</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0B0C10] px-2.5 py-1.5 rounded">
                    <span className="text-[#9E9EA7] font-bold">3RD PLACE</span>
                    <span className="font-bold text-[#FFFFFF]">₹{cls.p3 ? cls.p3.toLocaleString() : '4,000'} CASH</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0B0C10] px-2.5 py-1 rounded text-[11px]">
                    <span className="text-[#9E9EA7]">4TH & 5TH</span>
                    <span className="font-bold text-[#9E9EA7]">OFFICIAL MEDAL</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Prize Sheet Image */}
          <div className="mt-8 bg-[#14161D] p-6 rounded-2xl border border-[#282B36]">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFFFFF] mb-4">
              Official Prize Structure Flyer
            </h4>
            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-[#282B36]">
              <img
                src={event.prizesFlyerImage || '/uploads/pune_prizes.jpg'}
                alt="17 Classes Prizes Chart"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Choice Numbers Wall */}
      {activeTab === 'numbers' && (
        <div className="bg-[#14161D] p-6 rounded-2xl border border-[#282B36]">
          <div className="mb-6">
            <h3 className="text-lg font-black uppercase tracking-wider text-[#FFFFFF] mb-1">
              Live First-Come, First-Served Competition Numbers
            </h3>
            <p className="text-xs text-[#9E9EA7]">
              One Bike = One Competition Number. Choice numbers are locked immediately once entry fee is confirmed.
            </p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-[#0B0C10] border border-[#282B36] flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#FF5500] inline-block"></span>
              <span className="font-bold text-[#FFFFFF]">Assigned & Locked Number</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#14161D] border border-[#282B36] inline-block"></span>
              <span className="text-[#9E9EA7]">Available for Claiming</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {registrations?.map((r) => (
              <div
                key={r.id}
                className="bg-[#0B0C10] border-2 border-[#FF5500] rounded-xl p-3 text-center shadow-lg"
              >
                <div className="text-3xl font-black text-[#FF5500] tracking-tighter">
                  #{r.competitionNumber}
                </div>
                <div className="text-xs font-bold text-[#FFFFFF] truncate mt-1">
                  {r.riderName}
                </div>
                <div className="text-[10px] text-[#9E9EA7] truncate">
                  {r.bikeModel}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#9E9EA7] mb-3">Want your lucky competition number on your bike plate?</p>
            <button
              onClick={() => onRegisterClick(event)}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-[#FF5500]/25"
            >
              Claim Your Number Now
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Rules & Scrutineering */}
      {activeTab === 'rules' && (
        <div className="bg-[#14161D] p-6 sm:p-8 rounded-2xl border border-[#282B36] space-y-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-[#FFFFFF] mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF5500]" />
              <span>Mandatory Scrutineering Guidelines</span>
            </h3>
            <p className="text-xs text-[#9E9EA7]">
              All participants must adhere to FMSCI safety and scrutiny standards before grid placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.rules?.map((rule, idx) => (
              <div key={idx} className="bg-[#0B0C10] p-4 rounded-xl border border-[#282B36] flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#FF5500]/20 border border-[#FF5500] text-[#FF5500] flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-[#FFFFFF] leading-relaxed font-medium">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {/* Important Links Box */}
          <div className="bg-[#0B0C10] p-6 rounded-xl border-2 border-[#282B36]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF5500] mb-4">
              Official Verification Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={event.fmsciLicenseLink || 'https://lic.fmsci.co.in/#/oneevent-fmsci'}
                target="_blank"
                rel="noreferrer"
                className="bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] p-3 rounded-lg flex items-center justify-between text-xs transition-colors"
              >
                <span className="font-bold">FMSCI 1-Event License</span>
                <ExternalLink className="w-4 h-4 text-[#FF5500]" />
              </a>

              <a
                href={event.googleFormLink || 'https://forms.gle/t5yayxckj23s7kqD8'}
                target="_blank"
                rel="noreferrer"
                className="bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] p-3 rounded-lg flex items-center justify-between text-xs transition-colors"
              >
                <span className="font-bold">Google Registration Form</span>
                <ExternalLink className="w-4 h-4 text-[#FF5500]" />
              </a>

              <a
                href={event.whatsappLink || 'https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk'}
                target="_blank"
                rel="noreferrer"
                className="bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] p-3 rounded-lg flex items-center justify-between text-xs transition-colors"
              >
                <span className="font-bold">Official WhatsApp Group</span>
                <ExternalLink className="w-4 h-4 text-[#FF5500]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Registered Grid Roster */}
      {activeTab === 'riders' && (
        <div className="bg-[#14161D] p-6 rounded-2xl border border-[#282B36]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-[#FFFFFF]">
                Confirmed Racers Manifest
              </h3>
              <p className="text-xs text-[#9E9EA7]">
                Live list of scrutinized and confirmed entries.
              </p>
            </div>
            <span className="bg-[#0B0C10] border border-[#FF5500] text-[#FF5500] text-xs font-black px-3 py-1 rounded">
              {registrations?.length || 0} Confirmed Racers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0C10] text-[#9E9EA7] uppercase text-[10px] border-b border-[#282B36]">
                <tr>
                  <th className="p-3">No.</th>
                  <th className="p-3">Rider Name</th>
                  <th className="p-3">Machine / Vehicle</th>
                  <th className="p-3">Classes Entered</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282B36]">
                {registrations?.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1A1D26] transition-colors">
                    <td className="p-3 font-black text-[#FF5500] text-base">
                      #{r.competitionNumber}
                    </td>
                    <td className="p-3 font-bold text-[#FFFFFF]">
                      {r.riderName}
                    </td>
                    <td className="p-3 text-[#9E9EA7]">
                      {r.bikeModel}
                    </td>
                    <td className="p-3 text-[#FFFFFF]">
                      {r.classes?.join(', ')}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#0B0C10] text-[#FF5500] border border-[#FF5500]/40 text-[10px] font-bold uppercase">
                        Scrutinized ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
