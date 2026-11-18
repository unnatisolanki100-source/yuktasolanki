import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  MessageCircle,
  X,
} from 'lucide-react';
import { PORTFOLIO_CATEGORIES, PortfolioCategory, PortfolioItem } from '../types';
import { LotusFlourish } from './BotanicalMotifs';
import { ImageWithFallback } from './ImageWithFallback';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  loading: boolean;
  shortlistedIds: string[];
  onToggleShortlist: (itemId: string) => void;
  onEnquireShortlist: () => void;
  whatsappNumber: string;
}

type FilterOption = 'All' | PortfolioCategory;

interface PortfolioScrollCardProps {
  item: PortfolioItem;
  idx: number;
  isShortlisted: boolean;
  onToggleShortlist: (itemId: string) => void;
  onOpen: (index: number) => void;
}

function PortfolioScrollCard({
  item,
  idx,
  isShortlisted,
  onToggleShortlist,
  onOpen,
}: PortfolioScrollCardProps) {
  const isPortraitPerson =
    item.id === 'pastel-celebration-arabic' ||
    item.id === 'bridal-portrait-saree-grace';
  const displayIndex = String(idx + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.5,
        delay: Math.min((idx % 3) * 0.06, 0.18),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <button
        type="button"
        onClick={() => onToggleShortlist(item.id)}
        aria-pressed={isShortlisted}
        aria-label={
          isShortlisted
            ? `Remove ${item.title} from shortlist`
            : `Save ${item.title} to shortlist`
        }
        className={`absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${
          isShortlisted
            ? 'bg-plum text-ivory border-plum shadow-[0_6px_16px_rgba(32,12,24,0.22)]'
            : 'bg-canvas/85 text-plum border-plum/20 hover:bg-plum hover:text-ivory hover:border-plum backdrop-blur-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
      </button>

      <button
        type="button"
        onClick={() => onOpen(idx)}
        aria-label={`Open ${item.title} in larger view`}
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum"
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-plum-deep">
          <ImageWithFallback
            src={item.imageUrl}
            alt={`${item.title} — ${item.category} by Yuk Creation`}
            className={`w-full h-full object-cover ${
              isPortraitPerson ? 'object-top' : 'object-center'
            }`}
            fallbackTitle={item.title}
          />
          <span
            aria-hidden="true"
            className="hidden sm:inline-flex absolute bottom-3 right-3 items-center justify-center w-9 h-9 bg-plum text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Maximize2 className="w-4 h-4" />
          </span>
        </div>

        <div className="pt-4 pb-3 border-b border-plum/15 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.16em] uppercase text-plum">
            <span>{item.category}</span>
            <span className="tabular-nums font-mono">{displayIndex}</span>
          </div>
          <h3 className="font-serif text-2xl font-normal text-ink group-hover:text-plum transition-colors">
            {item.title}
          </h3>
          {item.caption && (
            <p className="text-sm leading-relaxed text-ink/85 line-clamp-2">
              {item.caption}
            </p>
          )}
        </div>
      </button>
    </motion.article>
  );
}

export function PortfolioSection({
  items,
  loading,
  shortlistedIds,
  onToggleShortlist,
  onEnquireShortlist,
  whatsappNumber,
}: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterTabs: FilterOption[] = ['All', ...PORTFOLIO_CATEGORIES];

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return sortedItems;
    }
    return sortedItems.filter((item) => item.category === selectedCategory);
  }, [sortedItems, selectedCategory]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const activeLightboxItem =
    lightboxIndex !== null && filteredItems[lightboxIndex]
      ? filteredItems[lightboxIndex]
      : null;

  return (
    <section id="portfolio" className="bg-canvas py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Editorial Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6"
        >
          <div className="max-w-2xl space-y-4">
            <p className="text-xs tracking-[0.24em] uppercase text-plum">
              <span className="font-devanagari tracking-normal normal-case text-sm">हस्तकला संग्रह</span> · Curated Lookbook
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.06] font-normal text-ink text-balance">
              Signature{' '}
              <CalligraphyTypewriter
                text="Mehndi"
                className="text-plum font-normal"
                triggerOnView
                startDelayMs={180}
                charIntervalMs={100}
              />{' '}
              Artistry
            </h2>
            <p className="text-base leading-relaxed text-ink">
              Browse heirloom bridal mandalas, bespoke couple portraits, flowing Arabic trails, and
              intimate engagement designs crafted for brides across Vadodara and Gujarat.{' '}
              <span className="font-devanagari text-plum">
                (दुल्हन, पोर्ट्रेट और सगाई की विशेष कलाकृतियाँ)
              </span>
            </p>
          </div>
          <LotusFlourish className="w-28 h-8 shrink-0" tone="dark" />
        </motion.div>

        {/* Architectural Category Filter Bar & Live Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
          <div
            role="tablist"
            aria-label="Filter portfolio by mehndi style"
            className="flex flex-wrap items-center gap-2"
          >
            {filterTabs.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs tracking-[0.12em] uppercase transition-colors whitespace-nowrap shrink-0 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${
                    isActive
                      ? 'bg-plum border-plum font-medium text-ivory'
                      : 'bg-canvas border-plum/20 text-ink hover:bg-blush'
                  }`}
                >
                  {category === 'All' ? 'All Designs' : category}
                </button>
              );
            })}
          </div>

          <p className="text-xs tracking-[0.18em] uppercase text-plum tabular-nums shrink-0">
            {String(filteredItems.length).padStart(2, '0')} Studies
          </p>
        </div>

        {/* Uncropped 4:5 Editorial Portfolio Grid with Scroll Depth Parallax */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="aspect-[4/5] bg-blush animate-pulse" />
            <div className="aspect-[4/5] bg-blush animate-pulse" />
            <div className="aspect-[4/5] bg-blush animate-pulse" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-blush border border-plum/15 p-12 text-center space-y-3">
            <p className="font-serif text-2xl text-ink">
              New {selectedCategory} photographs coming soon
            </p>
            <p className="text-sm text-ink">
              Select another category or contact Yukta directly for private bridal lookbook previews.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 items-start py-2">
            {filteredItems.map((item, idx) => (
              <PortfolioScrollCard
                key={item.id}
                item={item}
                idx={idx}
                isShortlisted={shortlistedIds.includes(item.id)}
                onToggleShortlist={onToggleShortlist}
                onOpen={setLightboxIndex}
              />
            ))}
          </div>
        )}

        {/* Shortlisted Designs Enquiry Summary Strip */}
        {(() => {
          const shortlistedItems = sortedItems.filter((item) =>
            shortlistedIds.includes(item.id)
          );
          if (shortlistedItems.length === 0) return null;

          const digits = whatsappNumber.replace(/\D/g, '') || '916351231599';
          const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
          const waHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Hello Yukta! I loved these mehndi designs from your Yuk Creation lookbook: ${shortlistedItems
              .map((i) => i.title)
              .join(', ')}. Could you share availability and pricing?`
          )}`;

          return (
            <div className="mt-10 bg-blush border border-plum/20 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2.5 min-w-0">
                <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-plum font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>
                    Shortlisted Designs ({shortlistedItems.length}) ·{' '}
                    <span className="font-devanagari tracking-normal normal-case">
                      चुने हुए डिज़ाइन
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shortlistedItems.map((saved) => (
                    <span
                      key={saved.id}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-canvas border border-plum/20 text-xs text-ink"
                    >
                      <span>{saved.title}</span>
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(saved.id)}
                        aria-label={`Remove ${saved.title}`}
                        className="text-plum hover:text-ink transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onEnquireShortlist}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[0.12em] uppercase font-medium text-ivory bg-plum hover:bg-plum-deep transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Enquire with Shortlist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[0.12em] uppercase font-medium text-plum bg-canvas border border-plum/30 hover:bg-plum hover:text-ivory transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Book Now</span>
                </a>
              </div>
            </div>
          );
        })()}
      </div>

      {/* High-Contrast Atelier Lightbox */}
      {activeLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-canvas border border-plum/25 p-5 sm:p-7 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-plum/15">
              <div className="text-xs tracking-[0.18em] uppercase text-plum flex items-center gap-2">
                <span>{activeLightboxItem.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-mono">
                  {(lightboxIndex ?? 0) + 1} / {filteredItems.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleShortlist(activeLightboxItem.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs tracking-[0.1em] uppercase border transition-colors ${
                    shortlistedIds.includes(activeLightboxItem.id)
                      ? 'bg-plum text-ivory border-plum'
                      : 'bg-canvas text-plum border-plum/25 hover:bg-blush'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      shortlistedIds.includes(activeLightboxItem.id) ? 'fill-current' : ''
                    }`}
                  />
                  <span>
                    {shortlistedIds.includes(activeLightboxItem.id) ? 'Saved' : 'Save Design'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close photograph view"
                  className="inline-flex items-center justify-center w-10 h-10 bg-plum hover:bg-plum-deep text-ivory transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0 my-5 flex items-center justify-center bg-blush overflow-hidden">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[64vh] w-auto max-w-full object-contain"
              />

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev === null
                          ? 0
                          : (prev - 1 + filteredItems.length) % filteredItems.length
                      )
                    }
                    aria-label="Previous photograph"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-plum hover:bg-plum-deep text-ivory transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev === null ? 0 : (prev + 1) % filteredItems.length
                      )
                    }
                    aria-label="Next photograph"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-plum hover:bg-plum-deep text-ivory transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="pt-2 space-y-1">
              <h3 className="font-serif text-2xl sm:text-3xl text-ink">
                {activeLightboxItem.title}
              </h3>
              {activeLightboxItem.caption && (
                <p className="text-sm leading-relaxed text-ink">
                  {activeLightboxItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
