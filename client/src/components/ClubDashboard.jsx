import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { Trophy, Calendar, Users, IndianRupee, ShieldCheck, Plus, Sparkles, Check, ArrowRight, ExternalLink } from 'lucide-react';

export const ClubDashboard = ({ onHostEventClick, onSelectEvent }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradingEventId, setUpgradingEventId] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getClubDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = async (event) => {
    setUpgradingEventId(event.id);
    try {
      const res = await api.upgradeEventPro(event.id);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FFFFFF', '#0B0C10']
      });
      setUpgradeSuccess(`Event "${event.title}" upgraded to Pro Unlimited Capacity!`);
      await loadDashboard();
    } catch (err) {
      alert(err.message || 'Upgrade failed');
    } finally {
      setUpgradingEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#FFFFFF]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#282B36] border-t-[#FF5500] rounded-full animate-spin"></div>
          <span className="text-xs text-[#9E9EA7] uppercase">Loading Club HQ...</span>
        </div>
      </div>
    );
  }

  if (!data?.hasClub) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center text-[#FFFFFF]">
        <Trophy className="w-12 h-12 text-[#FF5500] mx-auto mb-3" />
        <h2 className="text-2xl font-black uppercase">No Official Club Found</h2>
        <p className="text-xs text-[#9E9EA7] mb-6">
          You haven't established an official club yet. Register your club to start hosting verified events.
        </p>
      </div>
    );
  }

  const { club, events, registrations, stats } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#FFFFFF] animate-fadeIn">
      
      {/* Club Profile Header */}
      <div className="bg-[#14161D] border-2 border-[#282B36] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="h-1.5 bg-[#FF5500] absolute top-0 left-0 right-0"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-[#0B0C10] px-3 py-1 rounded border border-[#FF5500]/40">
                {club.status === 'active' ? 'VERIFIED MOTORSPORT CLUB' : 'PENDING ACCREDITATION'}
              </span>
              <span className="text-xs text-[#9E9EA7]">{club.location}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#FFFFFF]">
              {club.name}
            </h1>
            <p className="text-xs text-[#9E9EA7] max-w-2xl mt-1">
              {club.description}
            </p>
          </div>

          <button
            onClick={onHostEventClick}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Host New Race Meet</span>
          </button>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#0B0C10] border border-[#FF5500] text-xs text-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[#FF5500]">
            <Check className="w-5 h-5" />
            <span>{upgradeSuccess}</span>
          </div>
          <button onClick={() => setUpgradeSuccess(null)} className="text-[#9E9EA7] hover:text-[#FFFFFF]">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#14161D] p-5 rounded-xl border border-[#282B36]">
          <div className="flex items-center justify-between text-[#9E9EA7] mb-1">
            <span className="text-[10px] font-bold uppercase">Active Events</span>
            <Calendar className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">{stats?.totalEvents || 0}</div>
        </div>

        <div className="bg-[#14161D] p-5 rounded-xl border border-[#282B36]">
          <div className="flex items-center justify-between text-[#9E9EA7] mb-1">
            <span className="text-[10px] font-bold uppercase">Total Racers Registered</span>
            <Users className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="text-2xl font-black text-[#FF5500]">{stats?.totalRacers || 0}</div>
        </div>

        <div className="bg-[#14161D] p-5 rounded-xl border border-[#282B36]">
          <div className="flex items-center justify-between text-[#9E9EA7] mb-1">
            <span className="text-[10px] font-bold uppercase">Entry Fees Collected</span>
            <IndianRupee className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">₹{stats?.totalRevenueGenerated?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-[#14161D] p-5 rounded-xl border border-[#282B36]">
          <div className="flex items-center justify-between text-[#9E9EA7] mb-1">
            <span className="text-[10px] font-bold uppercase">Free Quotas Left</span>
            <Trophy className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="text-2xl font-black text-[#FFFFFF]">{club.freeEventsRemaining || 0} Free Meets</div>
        </div>
      </div>

      {/* Active Hosted Events with Capacity Gauge & Pro Upgrade */}
      <div className="bg-[#14161D] border border-[#282B36] rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-[#FFFFFF]">
              Club Hosted Events & Grid Capacity
            </h2>
            <p className="text-xs text-[#9E9EA7]">
              Track your 15-racer free tier limit and unlock unlimited slots when scaling up.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {events?.map((evt) => {
            const currentRegs = evt.confirmedCount || 0;
            const maxRegs = evt.maxRegistrations || 15;
            const percentage = Math.min(100, Math.round((currentRegs / maxRegs) * 100));
            const isFull = !evt.isProUnlocked && currentRegs >= maxRegs;

            return (
              <div
                key={evt.id}
                className="bg-[#0B0C10] border-2 border-[#282B36] rounded-xl p-5 transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase text-[#FF5500]">
                        {evt.eventType || 'Dirt Track'}
                      </span>
                      {evt.isProUnlocked ? (
                        <span className="bg-[#FF5500] text-[#FFFFFF] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          PRO UNLIMITED ACTIVE
                        </span>
                      ) : (
                        <span className="bg-[#14161D] text-[#9E9EA7] border border-[#282B36] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                          Club Free Tier (15 Limit)
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black uppercase text-[#FFFFFF]">{evt.title}</h3>
                    <div className="text-xs text-[#9E9EA7] flex items-center gap-3 mt-1">
                      <span>{evt.venue}, {evt.city}</span>
                      <span>•</span>
                      <span>{evt.startDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => onSelectEvent(evt.id)}
                      className="px-4 py-2 bg-[#1A1D26] hover:bg-[#282B36] text-xs font-bold uppercase text-[#FFFFFF] rounded-lg transition-colors"
                    >
                      View Live Grid
                    </button>

                    {!evt.isProUnlocked && (
                      <button
                        onClick={() => handleUpgradeToPro(evt)}
                        disabled={upgradingEventId === evt.id}
                        className="px-4 py-2 bg-[#FF5500] hover:bg-[#E04B00] text-xs font-black uppercase text-[#FFFFFF] rounded-lg shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{upgradingEventId === evt.id ? 'Upgrading...' : 'Upgrade Pro Unlimited (₹1,499)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-[#9E9EA7]">
                      Racer Registrations Status: <span className="text-[#FFFFFF]">{currentRegs} / {evt.isProUnlocked ? 'Unlimited' : maxRegs}</span>
                    </span>
                    <span className={isFull ? 'text-[#FF5500]' : 'text-[#FFFFFF]'}>
                      {evt.isProUnlocked ? '100% UNLOCKED' : `${percentage}% CAPACITY`}
                    </span>
                  </div>

                  {!evt.isProUnlocked && (
                    <div className="w-full h-2.5 bg-[#14161D] rounded-full overflow-hidden border border-[#282B36]">
                      <div
                        className="h-full bg-[#FF5500] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}

                  {isFull && (
                    <p className="text-[11px] text-[#FF5500] mt-2 font-bold">
                      ⚠️ 15 Free Tier registrations reached! Further racer entries will be rejected until upgraded to Pro Tier.
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Participants Roster with Competition Numbers */}
      <div className="bg-[#14161D] border border-[#282B36] rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-[#FFFFFF]">
              Registered Racers & Choice Numbers
            </h2>
            <p className="text-xs text-[#9E9EA7]">
              Live scrutineering roster for Deccan Conqueror Pune 2.0.
            </p>
          </div>
          <span className="text-xs font-bold text-[#FF5500] bg-[#0B0C10] px-3 py-1 rounded border border-[#FF5500]/30">
            {registrations?.length || 0} Total Scrutinized Racers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] text-[#9E9EA7] uppercase text-[10px] border-b border-[#282B36]">
              <tr>
                <th className="p-3">Choice No.</th>
                <th className="p-3">Rider Name</th>
                <th className="p-3">Machine</th>
                <th className="p-3">Classes</th>
                <th className="p-3">FMSCI License</th>
                <th className="p-3">Scrutiny Status</th>
                <th className="p-3">Fee Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282B36]">
              {registrations?.map((r) => (
                <tr key={r.id} className="hover:bg-[#1A1D26] transition-colors">
                  <td className="p-3 font-black text-[#FF5500] text-lg">
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
                  <td className="p-3 font-mono text-[11px] text-[#9E9EA7]">
                    {r.fmsciLicenseNo || 'Verified'}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0C10] text-[#FFFFFF] border border-[#FF5500]/50 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#FF5500]" />
                      <span>RC + Insured</span>
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#FF5500]">
                    ₹{r.totalFee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
