import React from 'react';
import { Calendar, MapPin, Trophy, Shield, Bike, ArrowRight, CheckCircle, Flame, ExternalLink, Users, AlertTriangle } from 'lucide-react';

export const LandingPage = ({ events, clubs, onSelectEvent, openAuthModal, openCreateClubModal }) => {
  const puneEvent = events?.find(e => e.id === 'evt_deccan_conqueror_2') || events?.[0];

  return (
    <div className="text-[#FFFFFF]">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 border-b border-[#282B36]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF5500_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Announcement Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14161D] border border-[#FF5500]/50 mb-6 throttle-border-glow animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping"></span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FF5500]">
              THE WAIT IS FINALLY OVER! 🏁 REGISTRATIONS ARE OFFICIALLY OPEN! 🔥
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E9EA7] mb-2 block">
                Pune's Biggest Motorsport Showdown
              </span>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-[#FFFFFF] mb-4">
                DECCAN <span className="text-[#FF5500]">CONQUEROR</span> DIRT TRACK 2.0
              </h1>

              <div className="p-3 rounded-xl bg-[#14161D] border-l-4 border-[#FF5500] mb-6">
                <p className="text-xs sm:text-sm font-bold text-[#FFFFFF] uppercase tracking-wide">
                  "Born in the land of Chhatrapati Shivaji Maharaj's valor, it's time for Pune's youth to experience pure adrenaline & dirt-flying thrill!"
                </p>
              </div>

              {/* Event Quick Details */}
              <div className="flex flex-wrap gap-4 mb-8 text-xs">
                <div className="flex items-center gap-2 bg-[#14161D] px-3.5 py-2 rounded-lg border border-[#282B36]">
                  <Calendar className="w-4 h-4 text-[#FF5500]" />
                  <span className="font-bold text-[#FFFFFF]">14th & 15th November 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-[#14161D] px-3.5 py-2 rounded-lg border border-[#282B36]">
                  <MapPin className="w-4 h-4 text-[#FF5500]" />
                  <span className="font-bold text-[#FFFFFF]">AISSMS College Ground, Pune</span>
                </div>
                <div className="flex items-center gap-2 bg-[#14161D] px-3.5 py-2 rounded-lg border border-[#282B36]">
                  <Trophy className="w-4 h-4 text-[#FF5500]" />
                  <span className="font-bold text-[#FF5500]">17 Classes • Cash Prizes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {puneEvent && (
                  <button
                    onClick={() => onSelectEvent(puneEvent.id)}
                    className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] font-black uppercase tracking-wider text-xs sm:text-sm px-8 py-4 rounded-xl shadow-xl shadow-[#FF5500]/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Bike className="w-5 h-5" />
                    <span>Lock Choice Number & Register</span>
                  </button>
                )}
                
                <button
                  onClick={openCreateClubModal}
                  className="bg-[#14161D] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FFFFFF] text-[#FFFFFF] font-bold uppercase tracking-wider text-xs sm:text-sm px-6 py-4 rounded-xl transition-all flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-[#FF5500]" />
                  <span>Register Club Account</span>
                </button>
              </div>

              {/* First-come first-served notice */}
              <p className="text-[11px] text-[#9E9EA7] mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]"></span>
                <span>Choice numbers are strictly assigned on a first-come, first-served basis upon fee confirmation.</span>
              </p>
            </div>

            {/* Right Flyer Poster Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-2xl overflow-hidden border-2 border-[#282B36] bg-[#0B0C10] shadow-2xl throttle-glow group">
                <img
                  src="/uploads/pune_throttle.jpg"
                  alt="Pune Full Throttle Poster"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500] bg-[#0B0C10] px-2 py-0.5 rounded border border-[#FF5500]">
                    OFFICIAL FMSCI SANCTIONED
                  </span>
                  <div className="text-sm font-black text-[#FFFFFF] mt-1">
                    Organized by Roadiez Adventure Club
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* METRIC STRIP (3-Color Racing Clean) */}
      <section className="bg-[#14161D] border-b border-[#282B36] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#282B36]">
              <div className="text-3xl sm:text-4xl font-black text-[#FF5500] mb-1">17</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Race Categories</div>
              <div className="text-[10px] text-[#9E9EA7]">Foreign, Stock, Ladies, 2-Stroke</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#282B36]">
              <div className="text-3xl sm:text-4xl font-black text-[#FFFFFF] mb-1">₹1,500</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF5500]">Per Class Entry</div>
              <div className="text-[10px] text-[#9E9EA7]">Max 4 for Championship points</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#282B36]">
              <div className="text-3xl sm:text-4xl font-black text-[#FF5500] mb-1">₹10,000</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Top Cash Prizes</div>
              <div className="text-[10px] text-[#9E9EA7]">Cash 1st-3rd + Medals 4th-5th</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#282B36]">
              <div className="text-3xl sm:text-4xl font-black text-[#FFFFFF] mb-1">15</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF5500]">Free Tier Racers</div>
              <div className="text-[10px] text-[#9E9EA7]">Per verified club event</div>
            </div>

          </div>
        </div>
      </section>

      {/* ACTIVE RACING EVENTS SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FF5500] mb-1">
              <Flame className="w-4 h-4" />
              <span>Sanctioned Championship Grid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#FFFFFF]">
              Live Motorsport Events
            </h2>
          </div>
          <span className="text-xs text-[#9E9EA7]">
            Showing verified racing events with choice numbers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className="bg-[#14161D] border-2 border-[#282B36] hover:border-[#FF5500] rounded-2xl overflow-hidden cursor-pointer transition-all transform hover:-translate-y-1 shadow-xl group flex flex-col justify-between"
            >
              <div>
                {/* Event Image */}
                <div className="relative h-48 bg-[#0B0C10] overflow-hidden">
                  <img
                    src={evt.bannerImage || '/uploads/pune_throttle.jpg'}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B0C10]/90 backdrop-blur-md border border-[#FF5500] px-2.5 py-1 rounded text-[10px] font-black uppercase text-[#FF5500]">
                    {evt.eventType || 'Dirt Track'}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0B0C10]/90 backdrop-blur-md border border-[#282B36] px-2.5 py-1 rounded text-[10px] font-bold text-[#FFFFFF]">
                    {evt.city}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="text-[11px] font-bold text-[#FF5500] uppercase tracking-wider mb-1">
                    {evt.clubName}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#FFFFFF] group-hover:text-[#FF5500] transition-colors mb-2">
                    {evt.title}
                  </h3>
                  <div className="space-y-1.5 text-xs text-[#9E9EA7] mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>{evt.startDate} • {evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span>{evt.classes?.length || 17} Classes • ₹{evt.baseEntryFee}/class</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-[#282B36] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9E9EA7]">Capacity</span>
                  <div className="font-bold text-[#FFFFFF]">
                    {evt.isProUnlocked ? 'Unlimited Pro Grid' : `${evt.currentRegistrations || 0} / ${evt.maxRegistrations} Racers`}
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF5500] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAAS PLATFORM MONETIZATION & ANTI-DUPLICATION ENGINE */}
      <section className="py-16 bg-[#14161D] border-y border-[#282B36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] mb-2 block">
              Platform Architecture & Economics
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#FFFFFF] mb-3">
              Built For Serious Racing Clubs & Racers
            </h2>
            <p className="text-xs text-[#9E9EA7]">
              Fair monetization for motorsport organizers, protected by anti-duplicate verification and transparent limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Club Creation Fee */}
            <div className="bg-[#0B0C10] p-6 rounded-2xl border border-[#282B36] relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#14161D] border border-[#FF5500] flex items-center justify-center text-[#FF5500] mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500]">Tier 01</span>
                <h3 className="text-lg font-black uppercase text-[#FFFFFF] mb-2">
                  Official Club Accreditation
                </h3>
                <p className="text-xs text-[#9E9EA7] leading-relaxed mb-4">
                  Every club or organizing committee pays an official accreditation fee (₹2,999) to establish their authenticated club profile, protect legitimate organizers, and prevent spam clubs.
                </p>
              </div>
              <div className="pt-4 border-t border-[#282B36] text-xs">
                <span className="text-[#FF5500] font-black">✓ Unlocks 1 Free Event</span>
                <span className="text-[#9E9EA7] block text-[11px]">Includes up to 15 racer slots free</span>
              </div>
            </div>

            {/* Feature 2: Free Tier & Pro Upgrade */}
            <div className="bg-[#0B0C10] p-6 rounded-2xl border-2 border-[#FF5500] relative flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FF5500] text-[#FFFFFF] flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 fill-current" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500]">Tier 02</span>
                <h3 className="text-lg font-black uppercase text-[#FFFFFF] mb-2">
                  15-Racer Free Tier & Pro Upgrade
                </h3>
                <p className="text-xs text-[#9E9EA7] leading-relaxed mb-4">
                  Club events include 15 racer registrations completely free. Once your event grows past 15 racers or you run multi-class championships, upgrade to the Pro Event Pass (₹1,499) for unlimited entries!
                </p>
              </div>
              <div className="pt-4 border-t border-[#282B36] text-xs">
                <span className="text-[#FFFFFF] font-black">✓ Zero Commission on Small Meets</span>
                <span className="text-[#9E9EA7] block text-[11px]">Pay only when your grid scales</span>
              </div>
            </div>

            {/* Feature 3: Anti-Duplication Protection */}
            <div className="bg-[#0B0C10] p-6 rounded-2xl border border-[#282B36] relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#14161D] border border-[#FF5500] flex items-center justify-center text-[#FF5500] mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500]">Integrity</span>
                <h3 className="text-lg font-black uppercase text-[#FFFFFF] mb-2">
                  Anti-Duplicate Event Banning
                </h3>
                <p className="text-xs text-[#9E9EA7] leading-relaxed mb-4">
                  Our system automatically analyzes event title keywords, venue coordinates, and overlapping dates. If a duplicate event is hosted from any account, it is immediately flagged and blocked from the grid.
                </p>
              </div>
              <div className="pt-4 border-t border-[#282B36] text-xs">
                <span className="text-[#FF5500] font-black">✓ Safeguards Legitimate Organizers</span>
                <span className="text-[#9E9EA7] block text-[11px]">Protects platform business model</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CLUBS & COMMUNITIES SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#FF5500] mb-1">
              Accredited Motorsport Bodies
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#FFFFFF]">
              Official Racing Clubs
            </h2>
          </div>
          <button
            onClick={openCreateClubModal}
            className="bg-[#14161D] hover:bg-[#1A1D26] border border-[#FF5500] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
          >
            + Create Club Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs?.map((c) => (
            <div
              key={c.id}
              className="bg-[#14161D] border border-[#282B36] rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500]">
                      {c.type === 'bike' ? '🏍️ Motorcycle Club' : '🏎️ Auto / Car Club'}
                    </span>
                    <h3 className="text-xl font-black uppercase text-[#FFFFFF] mt-0.5">
                      {c.name}
                    </h3>
                    <p className="text-xs text-[#9E9EA7] mt-1">{c.location}</p>
                  </div>
                  {c.status === 'active' && (
                    <span className="px-2.5 py-1 rounded bg-[#0B0C10] border border-[#FF5500] text-[#FF5500] text-[10px] font-black uppercase">
                      VERIFIED
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#9E9EA7] leading-relaxed mb-6">
                  {c.description}
                </p>
              </div>

              <div className="border-t border-[#282B36] pt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#9E9EA7] uppercase">Contact Head</span>
                  <div className="font-bold text-[#FFFFFF]">{c.contactPerson}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#9E9EA7] uppercase">Official Sanction</span>
                  <div className="font-bold text-[#FF5500]">FMSCI Affiliated</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUNE 2.0 IMPORTANT RULES SUMMARY TICKER */}
      <section className="bg-[#0B0C10] border-t border-[#282B36] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#14161D] border-2 border-[#282B36] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-2">
              <Shield className="w-4 h-4" />
              <span>OFFICIAL EVENT REGULATIONS • DECCAN CONQUEROR 2.0</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-[#FFFFFF] mb-4">
              Key Rules Every Competitor Must Know
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#9E9EA7]">
              <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
                <strong className="text-[#FFFFFF] block mb-1">🏁 Choice Numbers Policy:</strong>
                Assigned strictly on a first-come, first-served basis only upon confirmation of the entry fee.
              </div>
              <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
                <strong className="text-[#FFFFFF] block mb-1">🏍️ Bike Sharing & Number Mapping:</strong>
                Bike sharing is allowed across classes. One Bike = One Competition Number strictly.
              </div>
              <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
                <strong className="text-[#FFFFFF] block mb-1">🏆 Championship Classes Limit:</strong>
                Riders can take part in multiple classes, but can select a MAXIMUM OF 4 CLASSES for Championship points.
              </div>
              <div className="p-3 bg-[#0B0C10] rounded-xl border border-[#282B36]">
                <strong className="text-[#FFFFFF] block mb-1">📄 Mandatory Scrutineering Documents:</strong>
                FMSCI License, Bike RC Book, and Insurance Copy are STRICTLY MANDATORY at physical scrutiny.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#282B36] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="text-[#9E9EA7]">
                Coordinator: <strong className="text-[#FFFFFF]">Amarendra Sathe Sir</strong> (<span className="text-[#FF5500]">+91 98230 97512</span>)
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://lic.fmsci.co.in/#/oneevent-fmsci"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF5500] hover:underline font-bold flex items-center gap-1"
                >
                  <span>FMSCI One-Event License</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FFFFFF] hover:text-[#FF5500] font-bold flex items-center gap-1"
                >
                  <span>Roadiez WhatsApp Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
