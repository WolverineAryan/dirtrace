import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bike, Calendar, MapPin, QrCode, Shield, Download, ExternalLink, ArrowRight } from 'lucide-react';

export const RiderDashboard = ({ onBrowseEventsClick, onSelectEvent }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getRiderDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#FFFFFF]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#282B36] border-t-[#FF5500] rounded-full animate-spin"></div>
          <span className="text-xs text-[#9E9EA7] uppercase">Loading Rider Garage...</span>
        </div>
      </div>
    );
  }

  const registrations = data?.registrations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#FFFFFF] animate-fadeIn">
      
      {/* Rider Garage Profile Header */}
      <div className="bg-[#14161D] border-2 border-[#282B36] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="h-1.5 bg-[#FF5500] absolute top-0 left-0 right-0"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-[#0B0C10] px-3 py-1 rounded border border-[#FF5500]/40">
                OFFICIAL COMPETITOR GARAGE
              </span>
              <span className="text-xs text-[#9E9EA7]">{user?.phone || '+91 98765 43210'}</span>
            </div>

            <h1 className="text-3xl font-black uppercase tracking-tight text-[#FFFFFF]">
              {user?.name || 'Rider Profile'}
            </h1>
            <p className="text-xs text-[#9E9EA7] mt-1">
              FMSCI License: <strong className="text-[#FFFFFF]">{user?.fmsciNumber || 'FMSCI-2026-MH-8492'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-[#9E9EA7] uppercase font-bold">Active Grid Entries</span>
              <div className="text-2xl font-black text-[#FF5500]">{registrations.length}</div>
            </div>
            <button
              onClick={onBrowseEventsClick}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#FF5500]/25 transition-all"
            >
              Enter More Races
            </button>
          </div>
        </div>
      </div>

      {/* Grid Passes Section */}
      <div className="mb-8">
        <h2 className="text-xl font-black uppercase tracking-wider text-[#FFFFFF] mb-4 flex items-center gap-2">
          <Bike className="w-5 h-5 text-[#FF5500]" />
          <span>My Scrutinized Race Passes</span>
        </h2>

        {registrations.length === 0 ? (
          <div className="bg-[#14161D] border border-[#282B36] rounded-2xl p-12 text-center">
            <p className="text-sm font-bold text-[#FFFFFF] mb-2">No active race entries found</p>
            <p className="text-xs text-[#9E9EA7] mb-6">Explore Deccan Conqueror Pune 2.0 to pick your lucky competition number.</p>
            <button
              onClick={onBrowseEventsClick}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] text-xs font-black uppercase px-6 py-3 rounded-xl"
            >
              Browse Live Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map(({ registration: reg, event }) => (
              <div
                key={reg.id}
                className="bg-[#14161D] border-2 border-[#282B36] hover:border-[#FF5500] rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                {/* Header Ticket Strip */}
                <div className="bg-[#0B0C10] p-4 border-b border-[#282B36] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-widest">
                      FMSCI CONFIRMED PASS
                    </span>
                    <h3 className="text-base font-black text-[#FFFFFF] uppercase">{reg.eventTitle}</h3>
                  </div>
                  <div className="text-3xl font-black text-[#FFFFFF] bg-[#FF5500] px-3.5 py-1 rounded-xl tracking-tighter">
                    #{reg.competitionNumber}
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Rider</div>
                      <div className="font-bold text-[#FFFFFF]">{reg.riderName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Machine / Model</div>
                      <div className="font-bold text-[#FFFFFF]">{reg.bikeModel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Venue & Date</div>
                      <div className="text-[#FFFFFF]">{event?.venue || 'AISSMS Ground'} • 14-15 Nov</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#9E9EA7] uppercase font-bold">Fee Status</div>
                      <div className="font-bold text-[#FF5500]">₹{reg.totalFee} Confirmed ✓</div>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="bg-[#0B0C10] p-3 rounded-xl border border-[#282B36]">
                    <div className="text-[10px] text-[#9E9EA7] uppercase font-bold mb-1">
                      Registered Classes ({reg.classes?.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {reg.classes?.map((c, i) => (
                        <span key={i} className="text-[10px] font-bold bg-[#14161D] text-[#FFFFFF] px-2 py-0.5 rounded border border-[#282B36]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pass Security Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#282B36] text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-6 h-6 text-[#FF5500]" />
                      <span className="font-mono text-[11px] text-[#9E9EA7]">{reg.qrTicket}</span>
                    </div>

                    <button
                      onClick={() => alert(`Digital Scrutiny Pass for #${reg.competitionNumber} ready. Present this pass at AISSMS ground entrance.`)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B0C10] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] text-[11px] font-bold text-[#FFFFFF] transition-colors"
                    >
                      Print Scrutiny Pass
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scrutiny Checklist Reminder */}
      <div className="bg-[#14161D] border border-[#282B36] rounded-2xl p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#FFFFFF] mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#FF5500]" />
          <span>Physical Scrutineering Checklist for 14th November</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#9E9EA7]">
          <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
            <strong className="text-[#FFFFFF] block mb-1">1. FMSCI License:</strong>
            Must show either permanent FMSCI card or digital 1-event license email copy.
          </div>
          <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
            <strong className="text-[#FFFFFF] block mb-1">2. Bike RC & Insurance:</strong>
            Physical or Digilocker copy of vehicle registration and third-party/comprehensive insurance.
          </div>
          <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
            <strong className="text-[#FFFFFF] block mb-1">3. Competition Number Plate:</strong>
            Affix your allocated number on front and side panels before line-up scrutiny.
          </div>
        </div>
      </div>

    </div>
  );
};
