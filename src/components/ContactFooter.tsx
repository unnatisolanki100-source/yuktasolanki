import React from 'react';
import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { FOOTER_MEHNDI_BACKDROP_IMAGE } from '../data/defaults';
import { SiteProfile } from '../types';
import { LotusFlourish } from './BotanicalMotifs';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface ContactFooterProps {
  profile: SiteProfile;
  onNavigateView: (view: 'home' | 'admin', sectionId?: string) => void;
}

export function ContactFooter({ profile, onNavigateView }: ContactFooterProps) {
  const digits = profile.whatsappNumber.replace(/\D/g, '') || '916351231599';
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  const localTenDigits = cleanPhone.slice(-10);
  const formattedPhone = `+91 ${localTenDigits.slice(0, 5)} ${localTenDigits.slice(5)}`;
  const cleanIg = profile.instagramHandle.replace(/^@/, '');

  return (
    <footer className="relative overflow-hidden bg-plum text-ivory pt-20 pb-12">
      {/* Aesthetic Slightly Blurred Bridal Mehndi Hands Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <img
          src={FOOTER_MEHNDI_BACKDROP_IMAGE}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center blur-[3.5px] scale-105 opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-plum-deep/92 via-plum/78 to-plum-deep/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-plum-deep/55 via-transparent to-plum-deep/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-ivory/20">
          <div className="md:col-span-5 space-y-4">
            <span className="block">
              <CalligraphyTypewriter
                text="Yuk Creation"
                className="text-3xl sm:text-4xl text-ivory"
                triggerOnView
                startDelayMs={180}
                charIntervalMs={90}
              />
            </span>
            <p className="font-devanagari text-sm text-ivory-muted">
              सोजत की शुद्ध मेहंदी · कला, प्रेम और परंपरा का संगम।
            </p>
            <p className="text-sm leading-relaxed text-ivory-muted max-w-sm">
              Bridal &amp; Portrait Mehndi Artistry by {profile.artistName}. Hand-crafted organic
              henna experiences for intimate ceremonies and grand weddings.
            </p>
            <LotusFlourish className="w-24 h-7" tone="light" />
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-serif text-xl text-ivory">Direct Contact</h3>
            <ul className="space-y-2.5 text-sm text-ivory-muted">
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    profile.studioLocation || 'Gotri, Vadodara, Gujarat'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Gotri, Vadodara in Google Maps"
                  className="inline-flex items-start gap-2.5 text-ivory hover:text-ivory-muted transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-ivory-subtle" />
                  <span className="underline underline-offset-4 decoration-ivory/45 hover:decoration-ivory">
                    {profile.studioLocation || 'Gotri, Vadodara, Gujarat'}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${cleanPhone}`}
                  className="inline-flex items-center gap-2.5 hover:underline text-ivory tabular-nums"
                >
                  <Phone className="w-4 h-4 shrink-0 text-ivory-subtle" />
                  <span>{formattedPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:underline text-ivory"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-ivory-subtle" />
                  <span>WhatsApp Direct</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://www.instagram.com/${cleanIg}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:underline text-ivory"
                >
                  <Instagram className="w-4 h-4 shrink-0 text-ivory-subtle" />
                  <span>@{cleanIg}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-serif text-xl text-ivory">Explore</h3>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('home', 'portfolio')}
                  className="hover:underline"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('home', 'about')}
                  className="hover:underline"
                >
                  About {profile.artistName}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('home', 'services')}
                  className="hover:underline"
                >
                  Mehndi Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('home', 'packages')}
                  className="hover:underline"
                >
                  Packages &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateView('home', 'booking')}
                  className="hover:underline"
                >
                  Reserve a Date
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider uppercase text-ivory-subtle">
          <p>© {new Date().getFullYear()} Yuk Creation · {profile.studioLocation}</p>
          <p>Handcrafted Bridal &amp; Portrait Mehndi Artistry</p>
        </div>
      </div>
    </footer>
  );
}
