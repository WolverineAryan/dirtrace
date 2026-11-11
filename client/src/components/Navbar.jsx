import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flag, Trophy, Shield, PlusCircle, LogIn, LogOut, User, Calendar, Flame } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, openAuthModal, openCreateClubModal, openHostEventModal }) => {
  const { user, club, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0B0C10]/95 backdrop-blur-md border-b border-[#282B36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg bg-[#FF5500] flex items-center justify-center text-[#FFFFFF] shadow-lg shadow-[#FF5500]/20 transform group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-[#FFFFFF] uppercase">
                DIRT<span className="text-[#FF5500]">RACE</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1D26] text-[#FF5500] border border-[#FF5500]/30 tracking-widest uppercase">
                SaaS 2.0
              </span>
            </div>
            <p className="text-[11px] text-[#9E9EA7] tracking-wider uppercase font-semibold">
              Motorsport & Club Ecosystem
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#14161D] p-1.5 rounded-xl border border-[#282B36]">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              currentView === 'landing' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => setCurrentView('events')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              currentView === 'events' || currentView === 'event-detail' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            Race Events
          </button>
          <button
            onClick={() => setCurrentView('clubs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              currentView === 'clubs' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            Clubs
          </button>
          <button
            onClick={() => setCurrentView('rules-pricing')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              currentView === 'rules-pricing' ? 'bg-[#FF5500] text-[#FFFFFF]' : 'text-[#9E9EA7] hover:text-[#FFFFFF]'
            }`}
          >
            Platform Tiers
          </button>
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* If Club Owner */}
              {club ? (
                <button
                  onClick={() => setCurrentView('club-dashboard')}
                  className="hidden sm:flex items-center gap-2 bg-[#1A1D26] hover:bg-[#282B36] text-[#FFFFFF] border border-[#FF5500]/50 hover:border-[#FF5500] px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all"
                >
                  <Trophy className="w-4 h-4 text-[#FF5500]" />
                  <span>{club.name.split(' ')[0]} Hub</span>
                  {club.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse"></span>
                  )}
                </button>
              ) : (
                <button
                  onClick={openCreateClubModal}
                  className="hidden sm:flex items-center gap-2 bg-[#1A1D26] hover:bg-[#282B36] text-[#FFFFFF] border border-[#282B36] hover:border-[#FF5500] px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-[#FF5500]" />
                  <span>Start Club</span>
                </button>
              )}

              {/* Rider Dashboard button */}
              <button
                onClick={() => setCurrentView('rider-dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                  currentView === 'rider-dashboard'
                    ? 'bg-[#FF5500] text-[#FFFFFF]'
                    : 'bg-[#14161D] text-[#FFFFFF] border border-[#282B36] hover:border-[#FFFFFF]'
                }`}
              >
                <User className="w-4 h-4 text-[#FF5500]" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                <span className="sm:hidden">Passes</span>
              </button>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg bg-[#14161D] text-[#9E9EA7] hover:text-[#FFFFFF] border border-[#282B36] hover:border-[#FF5500] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:text-[#FF5500] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-[#FFFFFF] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF5500]/25 transition-all transform hover:-translate-y-0.5"
              >
                <Flag className="w-4 h-4" />
                <span>Join Grid</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
