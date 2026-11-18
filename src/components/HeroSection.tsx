import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDE_IMAGES } from '../data/defaults';
import { SiteProfile } from '../types';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface HeroSectionProps {
  profile: SiteProfile;
  featuredBridalImage?: string;
  onExplorePortfolio: () => void;
  onBookNow: () => void;
}

export function HeroSection({
  profile,
  onExplorePortfolio,
  onBookNow,
}: HeroSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDE_IMAGES.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [slideIndex]);

  const handlePrevSlide = () => {
    setSlideIndex(
      (prev) => (prev - 1 + HERO_SLIDE_IMAGES.length) % HERO_SLIDE_IMAGES.length
    );
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % HERO_SLIDE_IMAGES.length);
  };

  return (
    <section
      id="top"
      className="relative min-h-[100svh] md:min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between md:justify-center overflow-hidden bg-plum-deep"
    >
      {/* Full-Width Responsive Slideshow: Fits 100% of phone width on mobile (aspect-[16/9]) and full-bleed cover on laptop/desktop */}
      <div className="relative w-full aspect-[16/9] mt-20 md:mt-0 md:aspect-auto md:absolute md:inset-0 overflow-hidden bg-plum-deep shrink-0">
        {HERO_SLIDE_IMAGES.map((slide, idx) => (
          <img
            key={slide.label}
            src={slide.src}
            alt={slide.alt}
            referrerPolicy="no-referrer"
            aria-hidden={idx !== slideIndex}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
              idx === slideIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Theme Velvet Scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-plum-deep/35 via-transparent to-plum-deep md:from-plum-deep/55 md:via-plum/38 md:to-plum-deep/75"
        />
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 hero-radial-scrim"
        />
      </div>

      {/* Subtle Left / Right Slide Arrows */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous hero photograph"
        className="hidden sm:inline-flex items-center justify-center absolute left-4 md:left-6 lg:left-10 top-[34%] md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-plum-deep/55 hover:bg-plum border border-ivory/25 text-ivory transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next hero photograph"
        className="hidden sm:inline-flex items-center justify-center absolute right-4 md:right-6 lg:right-10 top-[34%] md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-plum-deep/55 hover:bg-plum border border-ivory/25 text-ivory transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Centered High-Fashion Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 pt-5 pb-6 md:pt-20 md:pb-16 text-center">
        <div className="space-y-4 sm:space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em] uppercase text-ivory-muted"
          >
            <span className="font-devanagari normal-case tracking-normal text-sm text-ivory">
              युक्ता सोलंकी · सोलह श्रृंगार
            </span>{' '}
            ·{' '}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                profile.studioLocation || 'Gotri, Vadodara, Gujarat'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-ivory/40 hover:decoration-ivory hover:text-ivory transition-colors"
            >
              {profile.studioLocation || 'Gotri, Vadodara, Gujarat'}
            </a>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[2.35rem] sm:text-5xl lg:text-[4.15rem] leading-[1.06] tracking-tight font-normal text-ivory text-balance"
          >
            Where Art Meets{' '}
            <CalligraphyTypewriter
              text="Tradition"
              className="font-normal tracking-wide"
              startDelayMs={260}
              charIntervalMs={105}
            />
            <span className="block italic mt-1">One Hand at a Time</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-ivory-muted"
          >
            Bringing heirloom bridal mehndi, bespoke couple portraits, and pure organic Sojat
            henna to life for your most unforgettable celebrations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-1 sm:pt-2"
          >
            <button
              type="button"
              onClick={onBookNow}
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs tracking-[0.12em] uppercase font-medium text-plum-deep bg-canvas border border-canvas hover:bg-plum hover:text-ivory hover:border-ivory/60 active:bg-plum active:text-ivory active:border-ivory/60 transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={onExplorePortfolio}
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs tracking-[0.12em] uppercase font-medium text-ivory bg-plum/75 border border-ivory/45 backdrop-blur-sm hover:bg-canvas hover:text-plum-deep hover:border-canvas active:bg-canvas active:text-plum-deep active:border-canvas transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
            >
              Portfolio
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Corner Editorial Highlights */}
      <div className="relative md:absolute md:bottom-8 lg:bottom-10 md:left-6 md:right-6 lg:left-10 lg:right-10 px-6 pb-7 pt-2 md:p-0 z-20 flex items-end justify-between gap-6">
        <div className="flex items-center gap-2">
          {HERO_SLIDE_IMAGES.map((slide, idx) => (
            <button
              key={slide.label}
              type="button"
              onClick={() => setSlideIndex(idx)}
              aria-label={`Show ${slide.label} slide`}
              className={`h-1.5 rounded-full transition-all ${
                idx === slideIndex ? 'w-7 bg-ivory' : 'w-2 bg-ivory/40 hover:bg-ivory/70'
              }`}
            />
          ))}
        </div>

        <div className="text-right text-ivory">
          <p className="font-serif italic text-2xl sm:text-3xl leading-none tabular-nums">100%</p>
          <p className="font-devanagari text-xs sm:text-sm text-ivory-muted mt-1">
            शुद्ध सोजत मेहंदी · Organic Henna
          </p>
        </div>
      </div>
    </section>
  );
}
