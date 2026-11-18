import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../types';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';
import { LotusFlourish } from './BotanicalMotifs';

export interface EstimatorSelection {
  serviceId: string;
  serviceTitle: string;
  summaryNote: string;
}

interface BridalTimingEstimatorSectionProps {
  services: ServiceItem[];
  onApplyEstimate: (selection: EstimatorSelection) => void;
}

interface PackageOption {
  id: string;
  serviceId: string;
  name: string;
  hindi: string;
  price: string;
  duration: string;
  summary: string;
  includes: string[];
}

const BRIDAL_PACKAGES: PackageOption[] = [
  {
    id: 'classic-bridal-tier',
    serviceId: 'bridal-mehndi-ceremony',
    name: 'Classic Bridal Mehndi',
    hindi: 'क्लासिक दुल्हन मेहंदी',
    price: '₹21,000/-',
    duration: '5 – 6.5 Hours',
    summary:
      'Traditional full bridal hands and feet with classic wedding motifs of your choice.',
    includes: [
      'Elbow-length full hands (front & back)',
      '2 figures of choice: Dhol, Kalash, Logo, Peacock or Elephant',
      'Feet mehndi from ankle up to 3 fingers',
    ],
  },
  {
    id: 'portrait-bridal-tier',
    serviceId: 'portrait-mehndi-storytelling',
    name: 'Portrait Bridal Mehndi',
    hindi: 'पोर्ट्रेट दुल्हन मेहंदी',
    price: '₹25,000/-',
    duration: '6 – 7.5 Hours',
    summary:
      'Custom bridal mehndi featuring 2 lifelike hand-drawn portraits woven into rich motifs.',
    includes: [
      '2 bespoke hand-drawn portraits included',
      'Elbow-length full hands (front & back)',
      'Feet mehndi from ankle up to 3 fingers',
    ],
  },
  {
    id: 'royal-custom-tier',
    serviceId: 'custom-minimal-mehndi',
    name: 'Royal Custom Story Bridal',
    hindi: 'रॉयल कस्टम स्टोरी दुल्हन',
    price: '₹31,000/-',
    duration: '7 – 9 Hours',
    summary:
      'Your entire love story crafted in mehndi—custom skyline, royal palaces, or beaches.',
    includes: [
      '4 different custom figures included',
      'Custom story design: city skyline, palaces or beaches',
      'Elbow-length full hands + bridal feet coverage',
    ],
  },
];

const FAMILY_PACKAGES: {
  id: string;
  serviceId: string;
  name: string;
  detail: string;
  price: string;
}[] = [
  {
    id: 'family-palm',
    serviceId: 'engagement-roka-mehndi',
    name: 'Palm to 3 Fingers',
    detail: 'Heavy mehndi for Family & Friends (by Yukta & team)',
    price: '₹5,000/-',
  },
  {
    id: 'family-elbow',
    serviceId: 'arabic-guest-mehndi',
    name: 'Elbow Length Heavy',
    detail: 'Full forearm heavy mehndi for Family & Friends (by Yukta & team)',
    price: '₹15,000/-',
  },
];

export function BridalTimingEstimatorSection({
  services,
  onApplyEstimate,
}: BridalTimingEstimatorSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBridal = BRIDAL_PACKAGES.find((p) => p.id === selectedId);
  const selectedFamily = FAMILY_PACKAGES.find((p) => p.id === selectedId);

  const handleBookPackage = (
    serviceId: string,
    title: string,
    price: string,
    detailNote: string
  ) => {
    const matchedService =
      services.find((s) => s.id === serviceId && s.active) ||
      services.find((s) => s.active) ||
      services[0];

    onApplyEstimate({
      serviceId: matchedService?.id || serviceId,
      serviceTitle: matchedService?.title || title,
      summaryNote: `Selected Package: ${title} (${price}) · ${detailNote}`,
    });
  };

  return (
    <section
      id="packages"
      aria-label="Bridal Mehndi Packages and Rate Card"
      className="bg-blush border-y border-plum/12 py-14 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="max-w-2xl space-y-4">
            <p className="text-xs tracking-[0.24em] uppercase text-plum">
              <span className="font-devanagari tracking-normal normal-case text-sm">
                दुल्हन मेहंदी पैकेज और दरें
              </span>{' '}
              · Bridal Rate Card
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.06] font-normal text-ink text-balance">
              Signature Bridal{' '}
              <CalligraphyTypewriter
                text="Packages"
                className="text-plum font-normal"
                triggerOnView
                startDelayMs={180}
                charIntervalMs={95}
              />
            </h2>
            <p className="text-base leading-relaxed text-ink">
              Bridal packages start at ₹21,000/- based on figure detailing and story
              customisation. Select any package below to proceed to booking.
            </p>
          </div>
          <LotusFlourish className="w-24 h-7 shrink-0" tone="dark" />
        </motion.div>

        {/* 3 Clear Bridal Package Cards (All White until Clicked/Selected) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRIDAL_PACKAGES.map((pkg) => {
            const isSelected = selectedId === pkg.id;
            return (
              <article
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`cursor-pointer border p-6 sm:p-7 flex flex-col justify-between gap-6 transition-colors duration-200 ${
                  isSelected
                    ? 'bg-plum border-plum text-ivory'
                    : 'bg-canvas border-plum/15 text-ink hover:border-plum/40'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`font-devanagari text-xs ${
                          isSelected ? 'text-ivory-muted' : 'text-plum'
                        }`}
                      >
                        {pkg.hindi}
                      </p>
                      <h3
                        className={`font-serif text-2xl sm:text-[1.75rem] font-normal mt-0.5 ${
                          isSelected ? 'text-ivory' : 'text-ink'
                        }`}
                      >
                        {pkg.name}
                      </h3>
                    </div>
                    <span
                      className={`text-[11px] tracking-[0.14em] uppercase font-mono tabular-nums px-2.5 py-1 border shrink-0 ${
                        isSelected
                          ? 'border-ivory/30 text-ivory-muted'
                          : 'border-plum/20 text-plum'
                      }`}
                    >
                      {pkg.duration}
                    </span>
                  </div>

                  <p
                    className={`font-serif text-4xl font-normal tabular-nums ${
                      isSelected ? 'text-ivory' : 'text-plum'
                    }`}
                  >
                    {pkg.price}
                  </p>

                  <p
                    className={`text-sm leading-relaxed ${
                      isSelected ? 'text-ivory-muted' : 'text-ink/85'
                    }`}
                  >
                    {pkg.summary}
                  </p>

                  <ul
                    className={`space-y-2.5 pt-3 border-t text-xs ${
                      isSelected
                        ? 'border-ivory/20 text-ivory-muted'
                        : 'border-plum/12 text-ink'
                    }`}
                  >
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <Check
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isSelected ? 'text-ivory' : 'text-plum'
                          }`}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                      handleBookPackage(pkg.serviceId, pkg.name, pkg.price, pkg.duration);
                    } else {
                      setSelectedId(pkg.id);
                    }
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs tracking-[0.12em] uppercase font-medium border transition-colors ${
                    isSelected
                      ? 'bg-canvas text-plum-deep border-canvas hover:bg-plum-deep hover:text-ivory hover:border-ivory/50'
                      : 'bg-plum text-ivory border-plum hover:bg-canvas hover:text-plum-deep'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <span>Book This Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <span>Select Package</span>
                  )}
                </button>
              </article>
            );
          })}
        </div>

        {/* Family & Friends Heavy Mehndi */}
        <div className="bg-canvas border border-plum/15 p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-plum/12 pb-3">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-plum font-medium">
                Family &amp; Friends
              </p>
              <h3 className="font-serif text-2xl text-ink mt-0.5">
                Heavy Mehndi by Yukta &amp; Team
              </h3>
            </div>
            <span className="font-mono text-sm text-plum font-medium">
              ₹5,000/- to ₹15,000/-
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAMILY_PACKAGES.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (isSelected) {
                      handleBookPackage(
                        item.serviceId,
                        `Family & Friends · ${item.name}`,
                        item.price,
                        item.detail
                      );
                    } else {
                      setSelectedId(item.id);
                    }
                  }}
                  className={`p-5 text-left border transition-colors flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-plum border-plum text-ivory'
                      : 'bg-canvas border-plum/20 text-ink hover:border-plum/45'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-serif text-xl font-normal">{item.name}</p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-ivory-muted' : 'text-ink/80'
                      }`}
                    >
                      {item.detail}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-current/15">
                    <span
                      className={`font-serif text-2xl tabular-nums ${
                        isSelected ? 'text-ivory' : 'text-plum'
                      }`}
                    >
                      {item.price}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase font-medium">
                      <span>{isSelected ? 'Book This Package' : 'Select Package'}</span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {(selectedBridal || selectedFamily) && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (selectedBridal) {
                    handleBookPackage(
                      selectedBridal.serviceId,
                      selectedBridal.name,
                      selectedBridal.price,
                      selectedBridal.duration
                    );
                  } else if (selectedFamily) {
                    handleBookPackage(
                      selectedFamily.serviceId,
                      `Family & Friends · ${selectedFamily.name}`,
                      selectedFamily.price,
                      selectedFamily.detail
                    );
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ivory bg-plum hover:bg-plum-deep transition-colors"
              >
                <span>
                  Book {selectedBridal?.name || selectedFamily?.name} (
                  {selectedBridal?.price || selectedFamily?.price})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
