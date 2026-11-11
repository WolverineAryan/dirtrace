import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EventView } from './components/EventView';
import { AuthModal } from './components/AuthModal';
import { RaceRegistrationModal } from './components/RaceRegistrationModal';
import { ClubCreateModal } from './components/ClubCreateModal';
import { HostEventModal } from './components/HostEventModal';
import { ClubDashboard } from './components/ClubDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { Trophy, Calendar, Shield, ExternalLink, Flame, Bike, AlertCircle } from 'lucide-react';

const MainApp = () => {
  const { user, club } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'events' | 'event-detail' | 'clubs' | 'rules-pricing' | 'club-dashboard' | 'rider-dashboard'
  const [selectedEventId, setSelectedEventId] = useState('evt_deccan_conqueror_2');
  
  // Data state
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [activeEventForReg, setActiveEventForReg] = useState(null);

  const [createClubModalOpen, setCreateClubModalOpen] = useState(false);
  const [hostEventModalOpen, setHostEventModalOpen] = useState(false);

  // Load initial events & clubs
  const refreshData = async () => {
    try {
      const [eventsData, clubsData] = await Promise.all([
        api.getEvents(),
        api.getClubs()
      ]);
      setEvents(eventsData);
      setClubs(clubsData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Hash-based route persistence
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'events', 'clubs', 'rules-pricing', 'club-dashboard', 'rider-dashboard'].includes(hash)) {
        setCurrentView(hash);
      } else if (hash.startsWith('event/')) {
        const id = hash.replace('event/', '');
        setSelectedEventId(id);
        setCurrentView('event-detail');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view, eventId = null) => {
    setCurrentView(view);
    if (eventId) {
      setSelectedEventId(eventId);
      window.location.hash = `event/${eventId}`;
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenRegisterForEvent = (event) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveEventForReg(event);
    setRegisterModalOpen(true);
  };

  const handleProUpgrade = async (event) => {
    try {
      await api.upgradeEventPro(event.id);
      await refreshData();
      alert(`Event "${event.title}" upgraded to Pro Unlimited! 15-racer cap removed.`);
    } catch (err) {
      alert(err.message || 'Upgrade failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF5500] selection:text-[#FFFFFF]">
      
      {/* Universal 3-Color Motorsport Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateTo}
        openAuthModal={handleOpenAuth}
        openCreateClubModal={() => setCreateClubModalOpen(true)}
        openHostEventModal={() => setHostEventModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            events={events}
            clubs={clubs}
            onSelectEvent={(id) => navigateTo('event-detail', id)}
            openAuthModal={handleOpenAuth}
            openCreateClubModal={() => setCreateClubModalOpen(true)}
          />
        )}

        {currentView === 'events' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5500]">
                  OFFICIAL GRID
                </span>
                <h1 className="text-3xl font-black uppercase tracking-wider text-[#FFFFFF] mt-1">
                  Sanctioned Motorsport Meets
                </h1>
                <p className="text-xs text-[#9E9EA7]">
                  Browse live races, lock in first-come first-served choice numbers, and view prize distributions.
                </p>
              </div>

              {club && (
                <button
                  onClick={() => setHostEventModalOpen(true)}
                  className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#FF5500]/25 transition-all"
                >
                  + Host Race Event
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => navigateTo('event-detail', evt.id)}
                  className="bg-[#14161D] border-2 border-[#282B36] hover:border-[#FF5500] rounded-2xl overflow-hidden cursor-pointer transition-all transform hover:-translate-y-1 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-[#0B0C10]">
                      <img
                        src={evt.bannerImage || '/uploads/pune_throttle.jpg'}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#0B0C10] border border-[#FF5500] text-[#FF5500] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {evt.eventType || 'Dirt Track'}
                      </div>
                      <div className="absolute top-3 right-3 bg-[#0B0C10] text-[#FFFFFF] text-[10px] font-bold px-2 py-0.5 rounded border border-[#282B36]">
                        {evt.city}
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-bold text-[#FF5500] uppercase tracking-wider">
                        {evt.clubName}
                      </span>
                      <h3 className="text-lg font-black uppercase text-[#FFFFFF] mt-1 mb-2">
                        {evt.title}
                      </h3>
                      <div className="text-xs text-[#9E9EA7] space-y-1">
                        <div>📅 {evt.startDate} • {evt.venue}</div>
                        <div>🏆 {evt.classes?.length || 17} Classes • ₹{evt.baseEntryFee}/class</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#282B36] flex items-center justify-between text-xs">
                    <span className="text-[#9E9EA7]">
                      {evt.isProUnlocked ? 'Unlimited Pro Capacity' : `${evt.currentRegistrations || 0} / ${evt.maxRegistrations} Racers`}
                    </span>
                    <span className="text-[#FF5500] font-black uppercase">
                      Inspect Grid →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'event-detail' && (
          <EventView
            eventId={selectedEventId}
            onBack={() => navigateTo('events')}
            onRegisterClick={(evt) => handleOpenRegisterForEvent(evt)}
            onProUpgradeClick={(evt) => handleProUpgrade(evt)}
          />
        )}

        {currentView === 'clubs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5500]">
                  ACCREDITED ECOSYSTEM
                </span>
                <h1 className="text-3xl font-black uppercase tracking-wider text-[#FFFFFF] mt-1">
                  Motorsport Clubs & Communities
                </h1>
                <p className="text-xs text-[#9E9EA7]">
                  Verified bike and car racing committees. Create your club account to unlock event hosting.
                </p>
              </div>

              <button
                onClick={() => setCreateClubModalOpen(true)}
                className="bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] font-black uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#FF5500]/25 transition-all"
              >
                + Register Official Club
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clubs.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#14161D] border-2 border-[#282B36] hover:border-[#FF5500]/40 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5500]">
                          {c.type === 'bike' ? '🏍️ Motorcycle Club' : '🏎️ Auto Club'}
                        </span>
                        <h3 className="text-2xl font-black uppercase text-[#FFFFFF] mt-0.5">{c.name}</h3>
                        <div className="text-xs text-[#9E9EA7]">{c.location}</div>
                      </div>
                      {c.status === 'active' && (
                        <span className="px-2.5 py-1 rounded bg-[#0B0C10] border border-[#FF5500] text-[#FF5500] text-[10px] font-black uppercase">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9E9EA7] leading-relaxed mb-6">{c.description}</p>
                  </div>

                  <div className="border-t border-[#282B36] pt-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#9E9EA7] uppercase">President / Coordinator</span>
                      <div className="font-bold text-[#FFFFFF]">{c.contactPerson}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#9E9EA7] uppercase">Active Events</span>
                      <div className="font-bold text-[#FF5500]">{c.activeEventsCount || 1} Hosted</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'rules-pricing' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5500]">
                DIRTRACE SAAS ARCHITECTURE & ECONOMICS
              </span>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-[#FFFFFF] mt-1">
                Transparent Platform Rules & Tiers
              </h1>
              <p className="text-xs text-[#9E9EA7] max-w-xl mx-auto mt-2">
                Designed to maintain verified club credibility, protect race organizers with anti-duplicate banning, and provide scalable event hosting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Card 1 */}
              <div className="bg-[#14161D] p-6 rounded-2xl border border-[#282B36] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-widest">STEP 1</span>
                  <h3 className="text-lg font-black uppercase text-[#FFFFFF] mt-1 mb-2">Club Accreditation</h3>
                  <div className="text-2xl font-black text-[#FFFFFF] mb-3">₹2,999 <span className="text-xs text-[#9E9EA7] font-normal">one-time</span></div>
                  <ul className="text-xs text-[#9E9EA7] space-y-2 mb-6">
                    <li>✓ Verified Club Badge & Directory Listing</li>
                    <li>✓ 1 Free Event Hosting Quota</li>
                    <li>✓ Up to 15 racers free of charge</li>
                    <li>✓ Scrutineering roster management</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCreateClubModalOpen(true)}
                  className="w-full py-2.5 rounded-lg bg-[#0B0C10] hover:bg-[#1A1D26] border border-[#282B36] hover:border-[#FF5500] text-xs font-bold text-[#FFFFFF] transition-colors"
                >
                  Start A Club
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-[#14161D] p-6 rounded-2xl border-2 border-[#FF5500] flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-widest">STEP 2</span>
                  <h3 className="text-lg font-black uppercase text-[#FFFFFF] mt-1 mb-2">Free Tier Event Hosting</h3>
                  <div className="text-2xl font-black text-[#FF5500] mb-3">FREE <span className="text-xs text-[#9E9EA7] font-normal">for 15 entries</span></div>
                  <ul className="text-xs text-[#9E9EA7] space-y-2 mb-6">
                    <li>✓ Host your race meet with zero fee</li>
                    <li>✓ Choice competition number reservation</li>
                    <li>✓ Automatic duplicate-event banning protection</li>
                    <li>✓ Scrutineering doc confirmation</li>
                  </ul>
                </div>
                <span className="text-center text-[11px] font-black uppercase text-[#FF5500] bg-[#0B0C10] py-2 rounded-lg border border-[#FF5500]/40">
                  Included With Active Club
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-[#14161D] p-6 rounded-2xl border border-[#282B36] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-widest">STEP 3</span>
                  <h3 className="text-lg font-black uppercase text-[#FFFFFF] mt-1 mb-2">Pro Event Pass Upgrade</h3>
                  <div className="text-2xl font-black text-[#FFFFFF] mb-3">₹1,499 <span className="text-xs text-[#9E9EA7] font-normal">per event</span></div>
                  <ul className="text-xs text-[#9E9EA7] space-y-2 mb-6">
                    <li>✓ Unlocks Unlimited Racers capacity</li>
                    <li>✓ Multi-class championship heat management</li>
                    <li>✓ Custom event hosting & branding</li>
                    <li>✓ Priority listing on DirTrace showcase</li>
                  </ul>
                </div>
                <span className="text-center text-[11px] font-bold text-[#9E9EA7] bg-[#0B0C10] py-2 rounded-lg border border-[#282B36]">
                  Payable When Grid Scales
                </span>
              </div>

            </div>

            {/* Anti-Duplicate Banning Logic Explainer */}
            <div className="bg-[#14161D] border-2 border-[#282B36] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[#FF5500] text-xs font-black uppercase tracking-widest mb-2">
                <Shield className="w-5 h-5" />
                <span>ANTI-ABUSE & DUPLICATE EVENT BANNING GUARD</span>
              </div>
              <h2 className="text-xl font-black uppercase text-[#FFFFFF] mb-2">
                Why Duplicate Hostings Are Automatically Banned
              </h2>
              <p className="text-xs text-[#9E9EA7] leading-relaxed mb-4">
                To protect legitimate organizers who spend weeks securing venue permits, physical grounds (e.g. AISSMS College Ground), and FMSCI sanctions, DirTrace implements an automated anti-duplicate scanner. If any account attempts to host a duplicate event with identical title keywords, overlapping dates, or matching grounds, the platform immediately blocks and bans the duplicate. This safeguards our organizers' ticket sales and secures the platform's business model.
              </p>
            </div>
          </div>
        )}

        {currentView === 'club-dashboard' && (
          <ClubDashboard
            onHostEventClick={() => setHostEventModalOpen(true)}
            onSelectEvent={(id) => navigateTo('event-detail', id)}
          />
        )}

        {currentView === 'rider-dashboard' && (
          <RiderDashboard
            onBrowseEventsClick={() => navigateTo('events')}
            onSelectEvent={(id) => navigateTo('event-detail', id)}
          />
        )}
      </main>

      {/* Universal 3-Color Motorsport Footer */}
      <footer className="bg-[#0B0C10] border-t border-[#282B36] py-10 text-xs text-[#9E9EA7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5500] flex items-center justify-center text-[#FFFFFF] font-black">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="font-black text-[#FFFFFF] uppercase tracking-wider text-sm">
                DIRT<span className="text-[#FF5500]">RACE</span> PLATFORM
              </div>
              <div className="text-[10px]">Deccan Conqueror Pune 2.0 • FMSCI Sanctioned Motorsport SaaS</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold">
            <button onClick={() => navigateTo('landing')} className="hover:text-[#FFFFFF]">Showcase</button>
            <button onClick={() => navigateTo('events')} className="hover:text-[#FFFFFF]">Race Events</button>
            <button onClick={() => navigateTo('clubs')} className="hover:text-[#FFFFFF]">Clubs</button>
            <button onClick={() => navigateTo('rules-pricing')} className="hover:text-[#FFFFFF]">Platform Economics</button>
            <a href="https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk" target="_blank" rel="noreferrer" className="text-[#FF5500] hover:underline flex items-center gap-1">
              <span>Roadiez WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[10px] text-center md:text-right">
            <div>Strict 3-Color Racing Design: #0B0C10 • #FF5500 • #FFFFFF</div>
            <div>Amarendra Sathe Sir: +91 98230 97512</div>
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          refreshData();
        }}
      />

      <RaceRegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        event={activeEventForReg}
        onRegistered={() => {
          refreshData();
        }}
        openAuthModal={handleOpenAuth}
      />

      <ClubCreateModal
        isOpen={createClubModalOpen}
        onClose={() => setCreateClubModalOpen(false)}
        onClubCreated={(newClub) => {
          refreshData();
          navigateTo('club-dashboard');
        }}
        openAuthModal={handleOpenAuth}
      />

      <HostEventModal
        isOpen={hostEventModalOpen}
        onClose={() => setHostEventModalOpen(false)}
        onEventCreated={(newEvent) => {
          refreshData();
          navigateTo('event-detail', newEvent.id);
        }}
        openAuthModal={handleOpenAuth}
        openCreateClubModal={() => setCreateClubModalOpen(true)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
