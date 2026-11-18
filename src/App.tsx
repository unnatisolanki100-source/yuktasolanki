/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
  verifyAdminAccess,
} from './lib/firebase';
import {
  DEFAULT_PORTFOLIO_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_PROFILE,
} from './data/defaults';
import { PortfolioItem, ServiceItem, SiteProfile } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import {
  BridalTimingEstimatorSection,
  EstimatorSelection,
} from './components/BridalTimingEstimatorSection';
import { BookingSection } from './components/BookingSection';
import { ContactFooter } from './components/ContactFooter';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'home'
  );
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(
    undefined
  );
  const [estimatorNote, setEstimatorNote] = useState<string | undefined>(undefined);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem('yuk_creation_shortlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('yuk_creation_shortlist', JSON.stringify(shortlistedIds));
    } catch {
      // Ignore storage restriction
    }
  }, [shortlistedIds]);

  // Firebase Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);

  // Public Firestore catalogs (falling back to curated studio defaults before initial admin seed)
  const [firestorePortfolio, setFirestorePortfolio] = useState<PortfolioItem[] | null>(
    null
  );
  const [firestoreServices, setFirestoreServices] = useState<ServiceItem[] | null>(
    null
  );
  const [firestoreProfile, setFirestoreProfile] = useState<SiteProfile | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    testFirestoreConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        setAdminCheckLoading(true);
        const allowed = await verifyAdminAccess(currentUser);
        setIsAdmin(allowed);
        setAdminCheckLoading(false);
      } else {
        setIsAdmin(false);
        setAdminCheckLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pfQuery = query(
      collection(db, 'portfolio'),
      orderBy('sortOrder', 'asc')
    );
    const unsubPf = onSnapshot(
      pfQuery,
      (snap) => {
        const items: PortfolioItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PortfolioItem, 'id'>),
        }));
        setFirestorePortfolio(items);
        setCatalogLoading(false);
      },
      (error) => {
        setCatalogLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, 'portfolio');
        } catch {
          // Handled silently on public fallback
        }
      }
    );

    const svQuery = query(
      collection(db, 'services'),
      orderBy('sortOrder', 'asc')
    );
    const unsubSv = onSnapshot(
      svQuery,
      (snap) => {
        const items: ServiceItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ServiceItem, 'id'>),
        }));
        setFirestoreServices(items);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'services');
        } catch {
          // Handled silently on public fallback
        }
      }
    );

    const unsubProfile = onSnapshot(
      doc(db, 'siteProfile', 'artist'),
      (snap) => {
        if (snap.exists()) {
          setFirestoreProfile(snap.data() as SiteProfile);
        } else {
          setFirestoreProfile(null);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'siteProfile/artist');
        } catch {
          // Handled silently on public fallback
        }
      }
    );

    return () => {
      unsubPf();
      unsubSv();
      unsubProfile();
    };
  }, []);

  const isCatalogSeeded = Boolean(firestoreProfile?.seeded);

  const rawProfile = firestoreProfile || DEFAULT_SITE_PROFILE;
  const resolvedArtistImageUrl =
    !rawProfile.artistImageUrl ||
    rawProfile.artistImageUrl.includes('yukta_portrait_retouched') ||
    rawProfile.artistImageUrl.includes('artist_yukta_portrait') ||
    rawProfile.artistImageUrl.includes('yukta_clean_pastel_cutout') ||
    rawProfile.artistImageUrl.includes('yukta_transparent_body') ||
    rawProfile.artistImageUrl.includes('yukta_wine_editorial_portrait') ||
    rawProfile.artistImageUrl.includes('yukta_kalakar_portrait_plum') ||
    rawProfile.artistImageUrl.includes('yukta_kalakar_glow_white_portrait') ||
    rawProfile.artistImageUrl.includes('yukta_kalakar_rose_lip_portrait') ||
    rawProfile.artistImageUrl.includes('yukta_cinematic_portrait') ||
    rawProfile.artistImageUrl.includes('yukta_designer_plum_white_bg') ||
    rawProfile.artistImageUrl.includes('yukta_organza_saree_white_bg') ||
    rawProfile.artistImageUrl.includes('yukta_organza_glow_jhumka_white') ||
    rawProfile.artistImageUrl.includes('yukta_organza_chandbali_plum_white') ||
    rawProfile.artistImageUrl.includes('yukta_organza_soft_glam_white') ||
    rawProfile.artistImageUrl.includes('yukta_organza_black_eyes_soft_hair') ||
    rawProfile.artistImageUrl.includes('yukta_organza_exact_eyes_white') ||
    rawProfile.artistImageUrl.includes('yukta_exact_face_organza_white') ||
    rawProfile.artistImageUrl.includes('yukta_exact_face_full_waist_white') ||
    rawProfile.artistImageUrl.includes('yukta_ss_exact_face_waist_white') ||
    rawProfile.artistImageUrl.includes('yukta_only_ss_face_organza_white') ||
    rawProfile.artistImageUrl.includes('yukta_anchored_exact_face_white') ||
    rawProfile.artistImageUrl.includes('yukta_screenshot_saree_blowout_white') ||
    rawProfile.artistImageUrl.includes('yukta_ss_girl_heavy_saree_jhumka') ||
    rawProfile.artistImageUrl.includes('yukta_exact_ea_blowout_white') ||
    rawProfile.artistImageUrl.includes('yukta_exact_ea_soft_50_blowout')
      ? DEFAULT_SITE_PROFILE.artistImageUrl
      : rawProfile.artistImageUrl;

  const resolvedWhatsappNumber =
    !rawProfile.whatsappNumber || rawProfile.whatsappNumber.includes('9876543210')
      ? DEFAULT_SITE_PROFILE.whatsappNumber
      : rawProfile.whatsappNumber;

  const resolvedArtistName =
    !rawProfile.artistName || rawProfile.artistName.trim().toLowerCase() === 'yukta'
      ? DEFAULT_SITE_PROFILE.artistName
      : rawProfile.artistName;

  const activeProfile: SiteProfile = {
    ...rawProfile,
    artistName: resolvedArtistName,
    artistImageUrl: resolvedArtistImageUrl,
    whatsappNumber: resolvedWhatsappNumber,
  };
  const rawPortfolio = isCatalogSeeded
    ? firestorePortfolio || []
    : firestorePortfolio && firestorePortfolio.length > 0
    ? firestorePortfolio
    : DEFAULT_PORTFOLIO_ITEMS;

  const rawPortfolioFiltered = rawPortfolio.filter(
    (item) =>
      item.id !== 'organic-studio-cones' &&
      !item.imageUrl?.includes('portfolio_festive_floral_plum_cloth') &&
      !item.imageUrl?.includes('portfolio_cones_plum_cloth') &&
      !item.imageUrl?.includes('clean_organic_henna_cones')
  );

  const rawPortfolioWithNew =
    rawPortfolioFiltered.length > 0 &&
    !rawPortfolioFiltered.some((item) => item.id === 'bridal-portrait-saree-grace')
      ? [
          ...rawPortfolioFiltered,
          ...DEFAULT_PORTFOLIO_ITEMS.filter(
            (item) => item.id === 'bridal-portrait-saree-grace'
          ),
        ]
      : rawPortfolioFiltered;

  const activePortfolio: PortfolioItem[] = rawPortfolioWithNew.map((item) => {
    const defaultMatch = DEFAULT_PORTFOLIO_ITEMS.find((d) => d.id === item.id);
    if (!defaultMatch) return item;

    if (
      !item.imageUrl ||
      item.imageUrl.includes('clean_bridal_elephant') ||
      item.imageUrl.includes('studio_lotus_double_palms') ||
      item.imageUrl.includes('clean_portrait_tree') ||
      item.imageUrl.includes('studio_mandala_back_hand') ||
      item.imageUrl.includes('studio_bangle_palm') ||
      item.imageUrl.includes('clean_peacock_jharokha') ||
      item.imageUrl.includes('clean_festive_palm') ||
      item.imageUrl.includes('Screenshot_2026-11-13_190124') ||
      item.imageUrl.includes('clean_organic_henna_cones') ||
      item.imageUrl.includes('portfolio_elephant_wine_velvet') ||
      item.imageUrl.includes('portfolio_lotus_palms_wine_velvet') ||
      item.imageUrl.includes('portfolio_portrait_tree_wine_velvet') ||
      item.imageUrl.includes('portfolio_mandala_back_wine_velvet') ||
      item.imageUrl.includes('portfolio_bangle_palm_wine_velvet') ||
      item.imageUrl.includes('portfolio_peacock_jharokha_wine_velvet') ||
      item.imageUrl.includes('portfolio_cones_wine_velvet') ||
      item.imageUrl.includes('portfolio_cones_plum_cloth') ||
      item.imageUrl.includes('portfolio_festive_palm_wine_velvet') ||
      item.imageUrl.includes('portfolio_festive_floral_plum_cloth')
    ) {
      return { ...item, imageUrl: defaultMatch.imageUrl };
    }
    return item;
  });

  const rawServices = isCatalogSeeded
    ? firestoreServices || []
    : firestoreServices && firestoreServices.length > 0
    ? firestoreServices
    : DEFAULT_SERVICES;

  const activeServices: ServiceItem[] = rawServices.map((srv) => {
    const defaultMatch = DEFAULT_SERVICES.find((d) => d.id === srv.id);
    if (!defaultMatch) return srv;

    const needsImageUpgrade =
      !srv.imageUrl ||
      srv.imageUrl.includes('clean_bridal_elephant') ||
      srv.imageUrl.includes('clean_portrait_tree') ||
      srv.imageUrl.includes('studio_mandala_back_hand') ||
      srv.imageUrl.includes('studio_bangle_palm') ||
      srv.imageUrl.includes('studio_lotus_double_palms') ||
      srv.imageUrl.includes('service_engagement_wide') ||
      srv.imageUrl.includes('service_engagement_plum_cloth') ||
      srv.imageUrl.includes('service_portrait_wide') ||
      srv.imageUrl.includes('service_arabic_wide') ||
      srv.imageUrl.includes('service_arabic_plum_cloth') ||
      srv.imageUrl.includes('service_custom_lotus_wide') ||
      srv.imageUrl.includes('service_custom_lotus_plum_cones') ||
      srv.imageUrl.includes('royal_story_bridal_wide_') ||
      (srv.id === 'custom-minimal-mehndi' &&
        srv.imageUrl.includes('hero_slide_bridal_palms_wide'));

    const needsPriceUpgrade =
      !srv.startingPrice ||
      srv.startingPrice === 'On Consultation' ||
      srv.startingPrice === 'Group Packages Available' ||
      srv.startingPrice === '₹20,000/-' ||
      srv.startingPrice === '₹15,000/-' ||
      srv.startingPrice === '₹5,000/-' ||
      srv.startingPrice === 'Packages from ₹5,000/-';

    if (needsImageUpgrade || needsPriceUpgrade) {
      return {
        ...srv,
        title: needsPriceUpgrade ? defaultMatch.title : srv.title,
        summary: needsPriceUpgrade ? defaultMatch.summary : srv.summary,
        duration: needsPriceUpgrade ? defaultMatch.duration : srv.duration,
        highlights: needsPriceUpgrade ? defaultMatch.highlights : srv.highlights,
        imageUrl: needsImageUpgrade ? defaultMatch.imageUrl : srv.imageUrl,
        startingPrice: needsPriceUpgrade ? defaultMatch.startingPrice : srv.startingPrice,
      };
    }
    return srv;
  });

  const featuredBridalImage =
    activePortfolio.find((item) => item.id === 'peacock-jharokha-symmetry')?.imageUrl ||
    activePortfolio.find((item) => item.category === 'Bridal Mehndi')?.imageUrl;

  const handleNavigateView = (view: 'home' | 'admin', sectionId?: string) => {
    setActiveView(view);
    if (view === 'admin') {
      window.history.replaceState(null, '', '#admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.replaceState(null, '', sectionId ? `#${sectionId}` : '#top');
    if (sectionId) {
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEnquireService = (service: ServiceItem) => {
    setPreselectedServiceId(service.id);
    handleNavigateView('home', 'booking');
  };

  const handleToggleShortlist = (itemId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleApplyEstimate = (selection: EstimatorSelection) => {
    setPreselectedServiceId(selection.serviceId);
    setEstimatorNote(selection.summaryNote);
    handleNavigateView('home', 'booking');
  };

  const shortlistedItems = activePortfolio.filter((item) =>
    shortlistedIds.includes(item.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Header activeView={activeView} onNavigateView={handleNavigateView} />

      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminDashboard
            user={user}
            authReady={authReady}
            isAdmin={isAdmin}
            adminCheckLoading={adminCheckLoading}
            portfolio={activePortfolio}
            services={activeServices}
            profile={activeProfile}
            isCatalogSeeded={isCatalogSeeded}
            onExitAdmin={() => handleNavigateView('home', 'top')}
          />
        ) : (
          <>
            <HeroSection
              profile={activeProfile}
              featuredBridalImage={featuredBridalImage}
              onExplorePortfolio={() => handleNavigateView('home', 'portfolio')}
              onBookNow={() => handleNavigateView('home', 'booking')}
            />
            <StorySection />
            <PortfolioSection
              items={activePortfolio}
              loading={catalogLoading}
              shortlistedIds={shortlistedIds}
              onToggleShortlist={handleToggleShortlist}
              onEnquireShortlist={() => handleNavigateView('home', 'booking')}
              whatsappNumber={activeProfile.whatsappNumber}
            />
            <AboutSection
              profile={activeProfile}
              onBookConsultation={() => handleNavigateView('home', 'booking')}
            />
            <ServicesSection
              services={activeServices}
              onEnquireService={handleEnquireService}
            />
            <BridalTimingEstimatorSection
              services={activeServices}
              onApplyEstimate={handleApplyEstimate}
            />
            <BookingSection
              services={activeServices}
              preselectedServiceId={preselectedServiceId}
              estimatedPackageNote={estimatorNote}
              shortlistedItems={shortlistedItems}
              onRemoveShortlist={handleToggleShortlist}
              onClearEstimate={() => setEstimatorNote(undefined)}
              profile={activeProfile}
            />
          </>
        )}
      </main>

      <ContactFooter profile={activeProfile} onNavigateView={handleNavigateView} />
    </div>
  );
}
