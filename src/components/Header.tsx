import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface HeaderProps {
  activeView: 'home' | 'admin';
  onNavigateView: (view: 'home' | 'admin', sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onNavigateView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (view: 'home' | 'admin', sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigateView(view, sectionId);
  };

  const overDarkHero = activeView === 'home' && !isScrolled;
  const floatingScrolledNav = activeView === 'home' && isScrolled;

  return (
    <header
      className={`${
        activeView === 'home' ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } z-40 transition-all duration-300 ${
        floatingScrolledNav
          ? 'bg-transparent pointer-events-none'
          : overDarkHero
          ? 'bg-transparent'
          : 'bg-canvas'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Visible at top of Hero & Admin; hides cleanly on scroll so only floating pills appear) */}
        <button
          type="button"
          onClick={() => handleLinkClick('home', 'top')}
          aria-hidden={floatingScrolledNav}
          tabIndex={floatingScrolledNav ? -1 : 0}
          className={`text-left whitespace-nowrap shrink-0 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            floatingScrolledNav
              ? 'opacity-0 pointer-events-none select-none w-0 overflow-hidden md:w-auto'
              : overDarkHero
              ? 'text-ivory focus-visible:outline-ivory'
              : 'text-ink focus-visible:outline-plum'
          }`}
        >
          <CalligraphyTypewriter
            text="Yuk Creation"
            className="text-2xl sm:text-[1.85rem] tracking-wide font-normal"
            startDelayMs={90}
            charIntervalMs={85}
          />
        </button>

        {/* Zone 2: Floating Pill Navigation Bar */}
        <nav
          aria-label="Primary navigation"
          className={`pointer-events-auto hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full backdrop-blur-md border transition-colors duration-300 ${
            overDarkHero
              ? 'bg-plum-deep/45 border-ivory/20 text-ivory'
              : 'bg-canvas border-plum/15 text-ink shadow-[0_8px_24px_rgba(32,12,24,0.10)]'
          }`}
        >
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'top')}
            className={`px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 ${
              overDarkHero
                ? 'hover:bg-ivory/15 font-medium'
                : 'hover:bg-blush'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'portfolio')}
            className={`px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 ${
              overDarkHero ? 'hover:bg-ivory/15' : 'hover:bg-blush'
            }`}
          >
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'services')}
            className={`px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 ${
              overDarkHero ? 'hover:bg-ivory/15' : 'hover:bg-blush'
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'about')}
            className={`px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 ${
              overDarkHero ? 'hover:bg-ivory/15' : 'hover:bg-blush'
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'packages')}
            className={`px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 ${
              overDarkHero ? 'hover:bg-ivory/15' : 'hover:bg-blush'
            }`}
          >
            Packages
          </button>
          {activeView === 'admin' && (
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="px-3.5 py-1.5 text-xs tracking-[0.06em] rounded-full transition-colors whitespace-nowrap shrink-0 bg-plum text-ivory font-medium"
            >
              View Site
            </button>
          )}
        </nav>

        {/* Zone 3: Rounded Pill Primary Action Button */}
        <div className="pointer-events-auto flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'booking')}
            className={`hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-[0.06em] font-medium rounded-full border transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              overDarkHero
                ? 'bg-canvas text-plum-deep border-canvas hover:bg-plum hover:text-ivory hover:border-ivory/60 active:bg-plum active:text-ivory focus-visible:outline-canvas'
                : 'bg-plum text-ivory border-plum hover:bg-canvas hover:text-plum-deep hover:border-plum active:bg-canvas active:text-plum-deep shadow-[0_8px_24px_rgba(32,12,24,0.16)] focus-visible:outline-plum'
            }`}
          >
            Book Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${
              overDarkHero
                ? 'bg-plum-deep/60 text-ivory border-ivory/30'
                : 'bg-canvas text-ink border-plum/25'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden border-t border-plum/12 bg-canvas px-6 py-5 space-y-3 shadow-lg">
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'top')}
            className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'portfolio')}
            className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
          >
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'services')}
            className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'about')}
            className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'packages')}
            className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
          >
            Packages &amp; Pricing
          </button>
          {activeView === 'admin' && (
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="block w-full text-left py-2.5 text-sm tracking-wider uppercase text-ink border-b border-plum/10"
            >
              View Site
            </button>
          )}
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'booking')}
            className="w-full mt-2 py-3 px-4 rounded-full text-xs tracking-[0.1em] uppercase font-medium text-ivory bg-plum border border-plum hover:bg-canvas hover:text-plum-deep active:bg-canvas active:text-plum-deep transition-all duration-200"
          >
            Book Now
          </button>
        </div>
      )}
    </header>
  );
};
