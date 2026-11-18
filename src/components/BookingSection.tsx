import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Check, Copy, Heart, MessageCircle, X } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { DEFAULT_SERVICES, PREFERRED_TIME_SLOTS } from '../data/defaults';
import { FIELD_LIMITS, PortfolioItem, ServiceItem, SiteProfile } from '../types';
import { LotusFlourish } from './BotanicalMotifs';
import { CalligraphyTypewriter } from './CalligraphyTypewriter';

interface BookingSectionProps {
  services: ServiceItem[];
  preselectedServiceId?: string;
  estimatedPackageNote?: string;
  shortlistedItems?: PortfolioItem[];
  onRemoveShortlist?: (itemId: string) => void;
  onClearEstimate?: () => void;
  profile: SiteProfile;
}

interface ConfirmedBookingSummary {
  bookingCode: string;
  customerName: string;
  phone: string;
  serviceTitle: string;
  eventDate: string;
  eventLocation: string;
  preferredTime: string;
  requirements: string;
}

function generateBookingIds(): { docId: string; bookingCode: string } {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const stamp = Date.now().toString(36).toUpperCase();
  const docId = `bk_${stamp}_${suffix}`;
  const bookingCode = `YUK-${year}-${stamp.slice(-3)}${suffix.slice(0, 2)}`;
  return { docId, bookingCode };
}

function buildWhatsAppMessage(booking: ConfirmedBookingSummary): string {
  const lines = [
    '*New Mehndi Booking Enquiry — Yuk Creation*',
    '',
    `*Booking ID:* ${booking.bookingCode}`,
    `*Name:* ${booking.customerName}`,
    `*Phone / WhatsApp:* ${booking.phone}`,
    `*Service / Package:* ${booking.serviceTitle}`,
    `*Event Date:* ${booking.eventDate}`,
    `*Preferred Time:* ${booking.preferredTime}`,
    `*Event Location:* ${booking.eventLocation}`,
  ];

  if (booking.requirements.trim()) {
    lines.push(`*Requirements:* ${booking.requirements.trim()}`);
  }

  return lines.join('\n');
}

function buildWhatsAppUrl(
  rawWhatsappNumber: string,
  booking: ConfirmedBookingSummary
): string {
  const digits = (rawWhatsappNumber || '916351231599').replace(/\D/g, '') || '916351231599';
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    buildWhatsAppMessage(booking)
  )}`;
}

function openExternalLink(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function BookingSection({
  services,
  preselectedServiceId,
  estimatedPackageNote,
  shortlistedItems = [],
  onRemoveShortlist,
  onClearEstimate,
  profile,
}: BookingSectionProps) {
  const activeServices = useMemo(() => {
    const filtered = [...services]
      .filter((s) => s.active)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return filtered.length > 0 ? filtered : DEFAULT_SERVICES;
  }, [services]);

  const [draftIds, setDraftIds] = useState(() => generateBookingIds());
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(
    preselectedServiceId || activeServices[0]?.id || ''
  );
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [preferredTime, setPreferredTime] = useState<string>(PREFERRED_TIME_SLOTS[0]);
  const [requirements, setRequirements] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBookingSummary | null>(null);
  const [lastSubmittedSignature, setLastSubmittedSignature] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedServiceId && activeServices.some((s) => s.id === preselectedServiceId)) {
      setServiceId(preselectedServiceId);
      setConfirmedBooking(null);
    }
  }, [preselectedServiceId, activeServices]);

  useEffect(() => {
    if (!serviceId && activeServices.length > 0) {
      setServiceId(activeServices[0].id);
    }
  }, [serviceId, activeServices]);

  const todayIso = new Date().toLocaleDateString('en-CA');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const missingLabels: string[] = [];
    let firstInvalidElementId: string | null = null;
    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim();
    const trimmedLocation = eventLocation.trim();
    const trimmedRequirements = requirements.trim();

    if (
      trimmedName.length < FIELD_LIMITS.customerNameMin ||
      trimmedName.length > FIELD_LIMITS.customerNameMax
    ) {
      errors.customerName = `Please enter your name (${FIELD_LIMITS.customerNameMin}–${FIELD_LIMITS.customerNameMax} characters).`;
      missingLabels.push('Full Name');
      firstInvalidElementId = firstInvalidElementId || 'booking-name';
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(trimmedPhone)) {
      errors.phone = 'Please enter a valid 10-digit phone or WhatsApp number.';
      missingLabels.push('Phone / WhatsApp Number');
      firstInvalidElementId = firstInvalidElementId || 'booking-phone';
    }

    const effectiveServiceId = serviceId || activeServices[0]?.id || '';
    if (!effectiveServiceId || !activeServices.some((s) => s.id === effectiveServiceId)) {
      errors.serviceId = 'Please choose a mehndi service.';
      missingLabels.push('Mehndi Service');
      firstInvalidElementId = firstInvalidElementId || 'booking-service';
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      errors.eventDate = 'Please select your event date.';
      missingLabels.push('Event Date');
      firstInvalidElementId = firstInvalidElementId || 'booking-date';
    } else if (eventDate < todayIso) {
      errors.eventDate = 'Please choose today or an upcoming event date.';
      missingLabels.push('Valid Upcoming Date');
      firstInvalidElementId = firstInvalidElementId || 'booking-date';
    }

    if (
      trimmedLocation.length < FIELD_LIMITS.eventLocationMin ||
      trimmedLocation.length > FIELD_LIMITS.eventLocationMax
    ) {
      errors.eventLocation = 'Please enter your venue or city location.';
      missingLabels.push('Event Location / Venue');
      firstInvalidElementId = firstInvalidElementId || 'booking-location';
    }

    if (trimmedRequirements.length > FIELD_LIMITS.requirementsMax) {
      errors.requirements = `Notes must be under ${FIELD_LIMITS.requirementsMax} characters.`;
      missingLabels.push('Shorter Requirements Note');
      firstInvalidElementId = firstInvalidElementId || 'booking-requirements';
    }

    setFieldErrors(errors);
    if (missingLabels.length > 0) {
      setSubmitError(`Please complete required details: ${missingLabels.join(', ')}.`);
      if (firstInvalidElementId) {
        const targetEl = document.getElementById(firstInvalidElementId);
        targetEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl?.focus({ preventScroll: true });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmitError(null);
    if (!validateForm()) return;

    const selectedService =
      activeServices.find((s) => s.id === serviceId) || activeServices[0];
    if (!selectedService) {
      setSubmitError('Selected service is currently unavailable. Please choose another service.');
      return;
    }

    const signature = `${phone.trim()}|${selectedService.id}|${eventDate}|${preferredTime}`;
    if (lastSubmittedSignature === signature) {
      setSubmitError(
        'This booking enquiry has already been submitted. Click "Submit Another Enquiry" below if you wish to create a new request.'
      );
      return;
    }

    const attachedParts: string[] = [];
    if (estimatedPackageNote) {
      attachedParts.push(estimatedPackageNote);
    }
    if (shortlistedItems.length > 0) {
      attachedParts.push(
        `Shortlisted Designs: ${shortlistedItems.map((i) => i.title).join(', ')}`
      );
    }
    if (requirements.trim()) {
      attachedParts.push(requirements.trim());
    }
    const combinedRequirements = attachedParts
      .join(' | ')
      .slice(0, FIELD_LIMITS.requirementsMax);

    setIsSubmitting(true);
    const payload = {
      bookingCode: draftIds.bookingCode,
      customerName: customerName.trim().slice(0, FIELD_LIMITS.customerNameMax),
      phone: phone.trim().slice(0, FIELD_LIMITS.phoneMax),
      serviceId: selectedService.id,
      serviceTitle: selectedService.title.slice(0, FIELD_LIMITS.titleMax),
      eventDate,
      eventLocation: eventLocation.trim().slice(0, FIELD_LIMITS.eventLocationMax),
      preferredTime,
      requirements: combinedRequirements,
      status: 'Pending' as const,
      adminNotes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const summary: ConfirmedBookingSummary = {
      bookingCode: payload.bookingCode,
      customerName: payload.customerName,
      phone: payload.phone,
      serviceTitle: payload.serviceTitle,
      eventDate: payload.eventDate,
      eventLocation: payload.eventLocation,
      preferredTime: payload.preferredTime,
      requirements: payload.requirements,
    };

    const whatsappUrl = buildWhatsAppUrl(profile.whatsappNumber, summary);

    // Launch WhatsApp synchronously inside user gesture so browsers never block it
    openExternalLink(whatsappUrl);
    setLastSubmittedSignature(signature);
    setConfirmedBooking(summary);
    setIsSubmitting(false);

    // Save booking securely in Firestore in parallel
    void setDoc(doc(db, 'bookings', draftIds.docId), payload).catch((error) => {
      try {
        handleFirestoreError(error, OperationType.CREATE, `bookings/${draftIds.docId}`);
      } catch {
        // Logged in structured format without interrupting WhatsApp handoff
      }
    });
  };

  const handleCopyMessage = async () => {
    if (!confirmedBooking) return;
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage(confirmedBooking));
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleResetForNewBooking = () => {
    setDraftIds(generateBookingIds());
    setCustomerName('');
    setPhone('');
    setEventDate('');
    setEventLocation('');
    setRequirements('');
    setFieldErrors({});
    setCopiedMessage(false);
    setSubmitError(null);
    setLastSubmittedSignature(null);
    setConfirmedBooking(null);
  };

  const rawFallbackDigits =
    (profile.whatsappNumber || '916351231599').replace(/\D/g, '') || '916351231599';
  const fallbackWaPhone =
    rawFallbackDigits.length === 10 ? `91${rawFallbackDigits}` : rawFallbackDigits;

  const whatsappConfirmHref = confirmedBooking
    ? buildWhatsAppUrl(profile.whatsappNumber, confirmedBooking)
    : `https://wa.me/${fallbackWaPhone}`;

  return (
    <section id="booking" className="bg-canvas py-14 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Editorial Guidance Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <p className="text-xs tracking-[0.24em] uppercase text-plum">
              <span className="font-devanagari tracking-normal normal-case text-sm">बुकिंग पूछताछ</span> · Booking Enquiry
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.08] font-normal text-ink text-balance">
              Reserve Your{' '}
              <CalligraphyTypewriter
                text="Celebration"
                className="text-plum font-normal"
                triggerOnView
                startDelayMs={180}
                charIntervalMs={90}
              />{' '}
              Date
            </h2>
            <LotusFlourish className="w-24 h-7" tone="dark" />
            <p className="text-base leading-relaxed text-ink">
              Share your event date, venue, and preferred mehndi style. Each enquiry receives a
              unique booking reference ID and a personal response from Yukta with availability and
              design consultation timings.
            </p>

            <div className="bg-plum text-ivory p-7 space-y-4">
              <p className="text-[11px] tracking-[0.22em] uppercase text-ivory-subtle">
                Booking Concierge
              </p>
              <h3 className="font-serif text-2xl text-ivory">Booking Guidelines</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-ivory-muted">
                <li>· Bridal bookings are recommended 2 to 4 months prior to the wedding date.</li>
                <li>· Portrait mehndi includes an advance sketch review before your ceremony.</li>
                <li>
                  · Based in{' '}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      profile.studioLocation || 'Gotri, Vadodara, Gujarat'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-ivory hover:text-ivory-muted"
                  >
                    {profile.studioLocation || 'Gotri, Vadodara, Gujarat'}
                  </a>{' '}
                  · Available for travel across Gujarat.
                </li>
                <li>
                  · Direct Call / WhatsApp:{' '}
                  <a
                    href={`tel:+${profile.whatsappNumber.replace(/\D/g, '') || '916351231599'}`}
                    className="underline text-ivory tabular-nums"
                  >
                    +91 {(profile.whatsappNumber.replace(/\D/g, '') || '916351231599').slice(-10, -5)}{' '}
                    {(profile.whatsappNumber.replace(/\D/g, '') || '916351231599').slice(-5)}
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Form / Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {confirmedBooking ? (
              <div className="bg-blush border border-plum/20 p-8 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-plum text-ivory">
                    <Check className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-plum">
                      Enquiry Received
                    </p>
                    <h3 className="font-serif text-3xl text-ink">
                      Thank you, {confirmedBooking.customerName}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-ink">
                  Your booking request is saved securely and your formatted booking details are
                  ready on WhatsApp. If WhatsApp did not open automatically, tap the button below
                  to send your enquiry directly to Yukta.
                </p>

                <div className="bg-canvas border border-plum/15 p-6 space-y-3 text-sm text-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-plum/12">
                    <span>Booking ID</span>
                    <span className="font-mono font-medium text-plum tabular-nums">
                      {confirmedBooking.bookingCode}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Status</span>
                    <span className="font-medium">Pending Review</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Service</span>
                    <span>{confirmedBooking.serviceTitle}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Event Date</span>
                    <span className="tabular-nums">{confirmedBooking.eventDate}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Preferred Time</span>
                    <span>{confirmedBooking.preferredTime}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Event Location</span>
                    <span>{confirmedBooking.eventLocation}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>Phone</span>
                    <span className="tabular-nums">{confirmedBooking.phone}</span>
                  </div>
                  {confirmedBooking.requirements && (
                    <div className="pt-2 border-t border-plum/12">
                      <p className="text-xs uppercase tracking-wider mb-1 text-plum">
                        Requirements
                      </p>
                      <p className="leading-relaxed">{confirmedBooking.requirements}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsappConfirmHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ivory bg-plum hover:bg-plum-deep transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Message</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-plum bg-canvas hover:bg-parchment border border-plum/30 transition-colors whitespace-nowrap shrink-0"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Message Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForNewBooking}
                    className="inline-flex items-center px-6 py-3 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ink bg-canvas hover:bg-parchment border border-plum/30 transition-colors whitespace-nowrap shrink-0"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-blush border border-plum/15 p-6 sm:p-10 space-y-6"
              >
                {(estimatedPackageNote || shortlistedItems.length > 0) && (
                  <div className="bg-canvas border border-plum/20 p-4 space-y-2.5">
                    <p className="text-[11px] tracking-[0.16em] uppercase text-plum font-medium">
                      Selected Preferences
                    </p>
                    {estimatedPackageNote && (
                      <div className="flex items-start justify-between gap-3 text-xs text-ink bg-blush px-3 py-2 border border-plum/15">
                        <span className="inline-flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-plum shrink-0 mt-0.5" />
                          <span>{estimatedPackageNote}</span>
                        </span>
                        {onClearEstimate && (
                          <button
                            type="button"
                            onClick={onClearEstimate}
                            aria-label="Clear estimated session note"
                            className="text-plum hover:text-ink shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                    {shortlistedItems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {shortlistedItems.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blush border border-plum/15 text-xs text-ink"
                          >
                            <Heart className="w-3 h-3 text-plum fill-current shrink-0" />
                            <span>{item.title}</span>
                            {onRemoveShortlist && (
                              <button
                                type="button"
                                onClick={() => onRemoveShortlist(item.id)}
                                aria-label={`Remove ${item.title}`}
                                className="text-plum hover:text-ink"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Your Full Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      maxLength={FIELD_LIMITS.customerNameMax}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum"
                    />
                    {fieldErrors.customerName && (
                      <p className="mt-1.5 text-xs text-plum underline">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      maxLength={FIELD_LIMITS.phoneMax}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your 10-digit WhatsApp number"
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum tabular-nums"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1.5 text-xs text-plum underline">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="booking-service"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Select Mehndi Service *
                    </label>
                    <select
                      id="booking-service"
                      required
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum"
                    >
                      {activeServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.serviceId && (
                      <p className="mt-1.5 text-xs text-plum underline">
                        {fieldErrors.serviceId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Event Date *
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={todayIso}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum tabular-nums"
                    />
                    {fieldErrors.eventDate && (
                      <p className="mt-1.5 text-xs text-plum underline">
                        {fieldErrors.eventDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="booking-location"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Event Location / Venue *
                    </label>
                    <input
                      id="booking-location"
                      type="text"
                      required
                      maxLength={FIELD_LIMITS.eventLocationMax}
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Enter event venue & city"
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum"
                    />
                    {fieldErrors.eventLocation && (
                      <p className="mt-1.5 text-xs text-plum underline">
                        {fieldErrors.eventLocation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-time"
                      className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                    >
                      Preferred Time Slot *
                    </label>
                    <select
                      id="booking-time"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum"
                    >
                      {PREFERRED_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-requirements"
                    className="block text-xs uppercase tracking-[0.16em] text-plum mb-2"
                  >
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    id="booking-requirements"
                    rows={4}
                    maxLength={FIELD_LIMITS.requirementsMax}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Share portrait inspiration, guest mehndi count, lehenga motifs, or any special notes..."
                    className="w-full px-4 py-3 text-sm text-ink bg-canvas border border-plum/20 focus:outline-none focus:border-plum resize-y"
                  />
                  {fieldErrors.requirements && (
                    <p className="mt-1.5 text-xs text-plum underline">
                      {fieldErrors.requirements}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="p-4 bg-canvas border border-plum text-sm text-ink"
                  >
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs tracking-[0.14em] uppercase font-medium text-ivory bg-plum hover:bg-plum-deep disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Booking...' : 'Book Now'}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
