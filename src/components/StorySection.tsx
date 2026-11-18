import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { STORY_MEHNDI_BACKDROP_IMAGE } from '../data/defaults';
import { LotusFlourish } from './BotanicalMotifs';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const backdropScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.01, 1.04, 1.01]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  return (
    <section
      ref={sectionRef}
      aria-label="The Story in Her Hands"
      className="relative bg-canvas py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Background Atmospheric Layer: Luminous Blurred Bridal Mehndi Hands */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <motion.div
          style={{ y: backdropY, scale: backdropScale }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={STORY_MEHNDI_BACKDROP_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center blur-[5px] sm:blur-[7px] opacity-65"
          />
        </motion.div>

        {/* Orbiting Fine Geometric Mandala Accent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.svg
            style={{ rotate: ringRotate }}
            viewBox="0 0 420 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[460px] h-[460px] sm:w-[620px] sm:h-[620px] text-plum/12"
          >
            <circle cx="210" cy="210" r="200" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 7" />
            <circle cx="210" cy="210" r="165" stroke="currentColor" strokeWidth="0.6" />
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30} 210 210)`}>
                <path
                  d="M210 24C217 46 219 64 210 80C201 64 203 46 210 24Z"
                  stroke="currentColor"
                  strokeWidth="0.65"
                />
              </g>
            ))}
          </motion.svg>
        </div>

        {/* Luminous Soft Canvas Edge Feather & Radial Veil */}
        <div className="absolute inset-0 story-backdrop-veil" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas opacity-90" />
      </div>

      {/* Foreground Editorial Storytelling + Poetic Hindi Accents */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          <p className="text-xs tracking-[0.26em] uppercase text-plum font-medium">
            01 · <span className="font-devanagari tracking-normal normal-case text-sm">मेहंदी की कहानी</span> · Heirloom Storytelling
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.06] font-normal text-ink text-balance">
            The Story in Her{' '}
            <CalligraphyTypewriter
              text="Hands"
              className="text-plum font-normal"
              triggerOnView
              startDelayMs={180}
              charIntervalMs={100}
            />
          </h2>

          <div className="flex justify-center">
            <LotusFlourish className="w-28 h-7" tone="dark" />
          </div>

          <p className="font-devanagari text-lg sm:text-xl text-plum leading-relaxed">
            “हर रेखा में प्रेम, परंपरा और दुल्हन के सपनों का सुंदर संगीत बसता है।”
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-ink max-w-2xl mx-auto">
            Every swirl of mehndi on a bride&apos;s palms isn&apos;t just a design — it&apos;s a
            tale of love, tradition, and timeless grace. Crafted fresh in small batches with pure
            Sojat henna and gentle botanical oils, every stroke unfolds into a deep, luminous
            bridal stain.
          </p>

          {/* 3-Column Botanical Craft Ledger with Hindi Sub-Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 mt-2 border-t border-plum/20 text-left sm:text-center max-w-3xl mx-auto">
            <div className="space-y-1.5">
              <p className="text-[11px] tracking-[0.18em] uppercase text-plum font-mono">
                01 · <span className="font-devanagari tracking-normal normal-case">उद्गम</span>
              </p>
              <p className="font-serif text-xl text-ink">Sojat Harvest</p>
              <p className="text-xs leading-relaxed text-ink/85">
                सोजत की शुद्ध, छनी हुई पत्तियाँ — बारीक और स्पष्ट रेखाओं के लिए।
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] tracking-[0.18em] uppercase text-plum font-mono">
                02 · <span className="font-devanagari tracking-normal normal-case">मिश्रण</span>
              </p>
              <p className="font-serif text-xl text-ink">Botanical Oils</p>
              <p className="text-xs leading-relaxed text-ink/85">
                लैवेंडर और नीलगिरी के प्राकृतिक तेलों की सौम्य सुगंध।
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] tracking-[0.18em] uppercase text-plum font-mono">
                03 · <span className="font-devanagari tracking-normal normal-case">रंगत</span>
              </p>
              <p className="font-serif text-xl text-ink">Natural Stain</p>
              <p className="text-xs leading-relaxed text-ink/85">
                बिना किसी केमिकल के गहरा, मनमोहक और स्थायी रंग।
              </p>
            </div>
          </div>

          <p className="pt-1 text-xs tracking-[0.22em] uppercase text-plum">
            Yuk Creation · <span className="font-devanagari tracking-normal normal-case text-sm">गोत्री, वडोदरा</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

