import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface ServicesSectionProps {
  services: ServiceItem[];
  onEnquireService: (service: ServiceItem) => void;
}

const SERVICE_LOOP_VIDEOS: Record<string, string> = {
  'bridal-mehndi-ceremony': '/videos/service-bridal.mp4',
  'portrait-mehndi-storytelling': '/videos/service-portrait.mp4?v=2',
  'engagement-roka-mehndi': '/videos/service-engagement.mp4?v=2',
  'arabic-guest-mehndi': '/videos/service-arabic.mp4',
  'custom-minimal-mehndi': '/videos/service-custom.mp4?v=4',
};

export function ServicesSection({ services, onEnquireService }: ServicesSectionProps) {
  const activeServices = [...services]
    .filter((service) => service.active)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section
      id="services"
      className="bg-gradient-to-b from-plum/20 via-blush to-canvas py-14 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-4 pb-8"
        >
          <p className="text-xs tracking-[0.24em] uppercase text-plum">
            <span className="font-devanagari tracking-normal normal-case text-sm">सेवाएं</span> · Services &amp; Commissions
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-[1.06] font-normal text-ink text-balance">
            Tailored{' '}
            <CalligraphyTypewriter
              text="Mehndi"
              className="text-plum font-normal"
              triggerOnView
              startDelayMs={180}
              charIntervalMs={100}
            />{' '}
            Experiences
          </h2>
          <p className="text-base leading-relaxed text-ink">
            Each celebration receives dedicated design planning, freshly mixed organic henna, and
            calm, unhurried artistry at your venue or in Gotri, Vadodara.
          </p>
        </motion.div>

        <div className="space-y-12 lg:space-y-16 pt-2">
          {activeServices.map((service, index) => {
            const isEven = index % 2 === 0;
            const videoSrc = SERVICE_LOOP_VIDEOS[service.id];
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Clean Seamless Looping Mehndi Showcase Video (Zero Overlays, Pure Mehndi Focus) */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="w-full overflow-hidden aspect-[4/3] bg-plum-deep max-w-md mx-auto lg:max-w-none">
                    {videoSrc ? (
                      <video
                        src={videoSrc}
                        poster={service.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={`${service.title} mehndi hands showcase video`}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <motion.div
                        animate={{ scale: [1.02, 1.06, 1.02], rotate: [-0.8, 0.8, -0.8] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full h-full will-change-transform"
                      >
                        <ImageWithFallback
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover block"
                          fallbackTitle={service.title}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Atelier Service Dossier Details */}
                <div
                  className={`lg:col-span-7 space-y-5 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase text-plum">
                    <span className="tabular-nums font-mono">0{index + 1}.</span>
                    <span aria-hidden="true">·</span>
                    <span>{service.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span>{service.startingPrice}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
                    {service.title}
                  </h3>

                  <p className="text-base leading-relaxed text-ink max-w-2xl">
                    {service.summary}
                  </p>

                  {service.highlights.length > 0 && (
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-plum">
                      {service.highlights.map((highlight, hIndex) => (
                        <li key={highlight} className="flex items-center gap-4">
                          <span>{highlight}</span>
                          {hIndex < service.highlights.length - 1 && (
                            <span aria-hidden="true">·</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onEnquireService(service)}
                      className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ivory bg-plum hover:bg-plum-deep transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
                    >
                      <span>Enquire for This Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
