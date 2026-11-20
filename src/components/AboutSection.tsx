import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SiteProfile } from '../types';
import { LotusFlourish } from './BotanicalMotifs';
import { ImageWithFallback } from './ImageWithFallback';

interface AboutSectionProps {
  profile: SiteProfile;
  onBookConsultation: () => void;
}

export function AboutSection({ profile, onBookConsultation }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.03, 1.0, 1.02]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-gradient-to-b from-canvas via-plum/[0.05] to-plum/20 pt-14 lg:pt-20 pb-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Mobile: Name & Heading -> Portrait -> 2 Paragraphs & CTA | Desktop: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-x-14 lg:gap-y-0 items-end">
          {/* Block A: Artist Name & Section Heading (Top on Mobile, Right-Top on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:self-end space-y-4 lg:pt-12"
          >
            <p className="text-[11px] sm:text-xs tracking-[0.18em] sm:tracking-[0.24em] uppercase text-plum">
              <span className="font-devanagari tracking-normal normal-case text-sm">
                कलाकार परिचय
              </span>{' '}
              · About the Artist
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl leading-[1.08] font-normal text-ink text-balance">
              Every line tells a{' '}
              <span className="italic text-plum font-normal">quiet story</span>{' '}
              of celebration.
            </h2>

            <LotusFlourish className="w-24 h-7" tone="dark" />

            <p className="font-devanagari text-2xl sm:text-[1.75rem] text-plum leading-snug">
              युक्ता सोलंकी{' '}
              <span className="font-serif italic text-lg sm:text-xl text-ink/80 font-normal ml-1.5">
                · Founder &amp; Lead Mehndi Artist
              </span>
            </p>
          </motion.div>

          {/* Block B: Borderless Portrait (Middle on Mobile, Left Full Height on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2 lg:self-end"
          >
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden portrait-mask-x">
                <motion.div
                  style={{ scale: portraitScale }}
                  className="relative w-full h-full will-change-transform"
                >
                  {/* Gently softened lower skirt hem clone that fades smoothly into the 20% theme wash */}
                  <div aria-hidden="true" className="absolute inset-0 portrait-blur-mask">
                    <img
                      src={profile.artistImageUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top blur-[4px]"
                    />
                  </div>

                  {/* Crisp foreground portrait tapering smoothly into the blurred lower dress */}
                  <div className="absolute inset-0 portrait-sharp-mask">
                    <ImageWithFallback
                      src={profile.artistImageUrl}
                      alt={`${profile.artistName} — bridal mehndi artist admiring henna in royal plum embroidered suit at Yuk Creation`}
                      className="w-full h-full object-cover object-top"
                      fallbackTitle={profile.artistName}
                    />
                  </div>
                </motion.div>

                {/* Invisible top feathering */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-canvas to-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Block C: Hindi Philosophy, 2 Bio Paragraphs & CTA (Bottom on Mobile, Right-Bottom on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:self-start space-y-5 pt-0 lg:pt-5 pb-12 lg:pb-16"
          >
            <p className="font-devanagari text-base sm:text-lg text-plum leading-relaxed">
              सोलह श्रृंगार की पावन परंपरा को आधुनिक संवेदनशीलता से जोड़ती हुई कला।
            </p>

            <p className="text-base leading-relaxed text-ink max-w-2xl">
              {profile.artistBio}
            </p>

            <p className="text-base leading-relaxed text-ink max-w-2xl">
              From intimate roka ceremonies in Gotri to grand destination weddings across Gujarat,
              Yukta Solanki approaches every bridal hand as a personalised canvas—balancing fine
              portrait realism, traditional lotus geometry, and serene breathing space.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onBookConsultation}
                className="inline-flex items-center px-7 py-3.5 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ivory bg-plum border border-plum hover:bg-canvas hover:text-plum-deep active:bg-canvas active:text-plum-deep transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
              >
                Schedule a Bridal Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
