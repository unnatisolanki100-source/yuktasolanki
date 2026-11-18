import React, { useEffect, useMemo, useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  Check,
  Edit3,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  DEFAULT_PORTFOLIO_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_PROFILE,
} from '../data/defaults';
import {
  BookingRecord,
  BookingStatus,
  FIELD_LIMITS,
  PORTFOLIO_CATEGORIES,
  PortfolioCategory,
  PortfolioItem,
  ServiceItem,
  SiteProfile,
} from '../types';
import { compressImageToDataUrl } from '../utils/imageUtils';
import { ImageWithFallback } from './ImageWithFallback';
import { LotusFlourish } from './BotanicalMotifs';

interface AdminDashboardProps {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminCheckLoading: boolean;
  portfolio: PortfolioItem[];
  services: ServiceItem[];
  profile: SiteProfile;
  isCatalogSeeded: boolean;
  onExitAdmin: () => void;
}

type AdminTab = 'bookings' | 'portfolio' | 'services' | 'profile';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function AdminDashboard({
  user,
  authReady,
  isAdmin,
  adminCheckLoading,
  portfolio,
  services,
  profile,
  isCatalogSeeded,
  onExitAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState<string | null>(
    null
  );

  // Catalog seed state
  const [seedingCatalog, setSeedingCatalog] = useState(false);
  const [adminBanner, setAdminBanner] = useState<string | null>(null);

  // Portfolio editor state
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [pfTitle, setPfTitle] = useState('');
  const [pfCategory, setPfCategory] = useState<PortfolioCategory>('Bridal Mehndi');
  const [pfImageUrl, setPfImageUrl] = useState('');
  const [pfCaption, setPfCaption] = useState('');
  const [pfFeatured, setPfFeatured] = useState(true);
  const [pfSortOrder, setPfSortOrder] = useState(1);
  const [pfSaving, setPfSaving] = useState(false);
  const [confirmDeletePortfolioId, setConfirmDeletePortfolioId] = useState<
    string | null
  >(null);

  // Service editor state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [svTitle, setSvTitle] = useState('');
  const [svSummary, setSvSummary] = useState('');
  const [svDuration, setSvDuration] = useState('');
  const [svStartingPrice, setSvStartingPrice] = useState('On Consultation');
  const [svImageUrl, setSvImageUrl] = useState('');
  const [svHighlightsText, setSvHighlightsText] = useState('');
  const [svActive, setSvActive] = useState(true);
  const [svSortOrder, setSvSortOrder] = useState(1);
  const [svSaving, setSvSaving] = useState(false);
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(
    null
  );

  // Site profile editor state
  const [profName, setProfName] = useState(profile.artistName);
  const [profLocation, setProfLocation] = useState(profile.studioLocation);
  const [profBio, setProfBio] = useState(profile.artistBio);
  const [profImage, setProfImage] = useState(profile.artistImageUrl);
  const [profWhatsapp, setProfWhatsapp] = useState(profile.whatsappNumber);
  const [profInstagram, setProfInstagram] = useState(profile.instagramHandle);
  const [profSaving, setProfSaving] = useState(false);

  useEffect(() => {
    setProfName(profile.artistName);
    setProfLocation(profile.studioLocation);
    setProfBio(profile.artistBio);
    setProfImage(profile.artistImageUrl);
    setProfWhatsapp(profile.whatsappNumber);
    setProfInstagram(profile.instagramHandle);
  }, [profile]);

  // Attach real-time bookings listener ONLY when auth is ready and user is verified admin
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setBookings([]);
      return;
    }

    setBookingsLoading(true);
    setBookingsError(null);
    const bookingsQuery = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const rows: BookingRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BookingRecord, 'id'>),
        }));
        setBookings(rows);
        setNotesDraft((prev) => {
          const next = { ...prev };
          for (const row of rows) {
            if (next[row.id] === undefined) {
              next[row.id] = row.adminNotes || '';
            }
          }
          return next;
        });
        setBookingsLoading(false);
      },
      (error) => {
        setBookingsLoading(false);
        setBookingsError('Unable to load bookings from Firestore.');
        try {
          handleFirestoreError(error, OperationType.LIST, 'bookings');
        } catch {
          // Error logged in structured JSON format
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, isAdmin]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Google sign-in was cancelled or blocked.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSeedDefaultCatalog = async () => {
    if (!isAdmin || seedingCatalog) return;
    setSeedingCatalog(true);
    setAdminBanner(null);

    try {
      const batch = writeBatch(db);

      for (const item of DEFAULT_PORTFOLIO_ITEMS) {
        batch.set(doc(db, 'portfolio', item.id), {
          title: item.title,
          category: item.category,
          imageUrl: item.imageUrl,
          caption: item.caption,
          featured: item.featured,
          sortOrder: item.sortOrder,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      for (const service of DEFAULT_SERVICES) {
        batch.set(doc(db, 'services', service.id), {
          title: service.title,
          summary: service.summary,
          duration: service.duration,
          startingPrice: service.startingPrice,
          imageUrl: service.imageUrl,
          highlights: service.highlights,
          active: service.active,
          sortOrder: service.sortOrder,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      batch.set(doc(db, 'siteProfile', 'artist'), {
        artistName: DEFAULT_SITE_PROFILE.artistName,
        studioLocation: DEFAULT_SITE_PROFILE.studioLocation,
        artistBio: DEFAULT_SITE_PROFILE.artistBio,
        artistImageUrl: DEFAULT_SITE_PROFILE.artistImageUrl,
        whatsappNumber: DEFAULT_SITE_PROFILE.whatsappNumber,
        instagramHandle: DEFAULT_SITE_PROFILE.instagramHandle,
        seeded: true,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      setAdminBanner('Default portfolio, services, and artist profile synced to Firestore.');
    } catch (error) {
      setAdminBanner('Failed to sync default catalog.');
      handleFirestoreError(error, OperationType.WRITE, 'catalogSeed');
    } finally {
      setSeedingCatalog(false);
    }
  };

  const handleUpdateBookingStatus = async (
    booking: BookingRecord,
    newStatus: BookingStatus
  ) => {
    setUpdatingBookingId(booking.id);
    setAdminBanner(null);
    const notes = (notesDraft[booking.id] ?? booking.adminNotes ?? '').slice(
      0,
      FIELD_LIMITS.adminNotesMax
    );
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: newStatus,
        adminNotes: notes,
        updatedAt: serverTimestamp(),
      });
      setAdminBanner(`Booking ${booking.bookingCode} marked as ${newStatus}.`);
    } catch (error) {
      setAdminBanner('Unable to update booking status.');
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${booking.id}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleSaveBookingNotes = async (booking: BookingRecord) => {
    setUpdatingBookingId(booking.id);
    setAdminBanner(null);
    const notes = (notesDraft[booking.id] ?? '').slice(0, FIELD_LIMITS.adminNotesMax);
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: booking.status,
        adminNotes: notes,
        updatedAt: serverTimestamp(),
      });
      setAdminBanner(`Notes saved for booking ${booking.bookingCode}.`);
    } catch (error) {
      setAdminBanner('Unable to save studio notes.');
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${booking.id}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setConfirmDeleteBookingId(null);
      setAdminBanner('Booking enquiry removed.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${bookingId}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleImageUpload = async (
    file: File,
    setter: (dataUrl: string) => void
  ) => {
    try {
      setAdminBanner(null);
      const compressed = await compressImageToDataUrl(file);
      setter(compressed);
    } catch (err) {
      setAdminBanner(
        err instanceof Error ? err.message : 'Failed to process selected photograph.'
      );
    }
  };

  const resetPortfolioForm = () => {
    setEditingPortfolioId(null);
    setPfTitle('');
    setPfCategory('Bridal Mehndi');
    setPfImageUrl('');
    setPfCaption('');
    setPfFeatured(true);
    setPfSortOrder(portfolio.length + 1);
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPfTitle(item.title);
    setPfCategory(item.category);
    setPfImageUrl(item.imageUrl);
    setPfCaption(item.caption);
    setPfFeatured(item.featured);
    setPfSortOrder(item.sortOrder ?? 1);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pfSaving) return;
    if (pfTitle.trim().length < 2 || pfImageUrl.trim().length < 5) {
      setAdminBanner('Please provide both a design title and photograph.');
      return;
    }

    setPfSaving(true);
    setAdminBanner(null);
    const id = editingPortfolioId || makeId('pf');
    try {
      if (editingPortfolioId) {
        await updateDoc(doc(db, 'portfolio', id), {
          title: pfTitle.trim().slice(0, FIELD_LIMITS.titleMax),
          category: pfCategory,
          imageUrl: pfImageUrl.trim().slice(0, FIELD_LIMITS.imageUrlMax),
          caption: pfCaption.trim().slice(0, FIELD_LIMITS.captionMax),
          featured: pfFeatured,
          sortOrder: Number(pfSortOrder) || 1,
          updatedAt: serverTimestamp(),
        });
        setAdminBanner('Portfolio photograph updated.');
      } else {
        await setDoc(doc(db, 'portfolio', id), {
          title: pfTitle.trim().slice(0, FIELD_LIMITS.titleMax),
          category: pfCategory,
          imageUrl: pfImageUrl.trim().slice(0, FIELD_LIMITS.imageUrlMax),
          caption: pfCaption.trim().slice(0, FIELD_LIMITS.captionMax),
          featured: pfFeatured,
          sortOrder: Number(pfSortOrder) || 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setAdminBanner('New portfolio photograph published.');
      }
      resetPortfolioForm();
    } catch (error) {
      setAdminBanner('Unable to save portfolio item.');
      handleFirestoreError(
        error,
        editingPortfolioId ? OperationType.UPDATE : OperationType.CREATE,
        `portfolio/${id}`
      );
    } finally {
      setPfSaving(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      setConfirmDeletePortfolioId(null);
      if (editingPortfolioId === id) {
        resetPortfolioForm();
      }
      setAdminBanner('Portfolio photograph deleted.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `portfolio/${id}`);
    }
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setSvTitle('');
    setSvSummary('');
    setSvDuration('');
    setSvStartingPrice('On Consultation');
    setSvImageUrl('');
    setSvHighlightsText('');
    setSvActive(true);
    setSvSortOrder(services.length + 1);
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setSvTitle(service.title);
    setSvSummary(service.summary);
    setSvDuration(service.duration);
    setSvStartingPrice(service.startingPrice);
    setSvImageUrl(service.imageUrl);
    setSvHighlightsText(service.highlights.join(', '));
    setSvActive(service.active);
    setSvSortOrder(service.sortOrder ?? 1);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (svSaving) return;
    if (
      svTitle.trim().length < 2 ||
      svSummary.trim().length < 10 ||
      svDuration.trim().length < 2 ||
      svImageUrl.trim().length < 5
    ) {
      setAdminBanner(
        'Please complete service title, description (min 10 chars), duration, and image.'
      );
      return;
    }

    setSvSaving(true);
    setAdminBanner(null);
    const highlights = svHighlightsText
      .split(',')
      .map((s) => s.trim().slice(0, 100))
      .filter(Boolean)
      .slice(0, 6);

    const id = editingServiceId || makeId('sv');
    try {
      if (editingServiceId) {
        await updateDoc(doc(db, 'services', id), {
          title: svTitle.trim().slice(0, FIELD_LIMITS.titleMax),
          summary: svSummary.trim().slice(0, FIELD_LIMITS.summaryMax),
          duration: svDuration.trim().slice(0, 60),
          startingPrice: svStartingPrice.trim().slice(0, 60) || 'On Consultation',
          imageUrl: svImageUrl.trim().slice(0, FIELD_LIMITS.imageUrlMax),
          highlights,
          active: svActive,
          sortOrder: Number(svSortOrder) || 1,
          updatedAt: serverTimestamp(),
        });
        setAdminBanner('Service information updated.');
      } else {
        await setDoc(doc(db, 'services', id), {
          title: svTitle.trim().slice(0, FIELD_LIMITS.titleMax),
          summary: svSummary.trim().slice(0, FIELD_LIMITS.summaryMax),
          duration: svDuration.trim().slice(0, 60),
          startingPrice: svStartingPrice.trim().slice(0, 60) || 'On Consultation',
          imageUrl: svImageUrl.trim().slice(0, FIELD_LIMITS.imageUrlMax),
          highlights,
          active: svActive,
          sortOrder: Number(svSortOrder) || 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setAdminBanner('New mehndi service added.');
      }
      resetServiceForm();
    } catch (error) {
      setAdminBanner('Unable to save service.');
      handleFirestoreError(
        error,
        editingServiceId ? OperationType.UPDATE : OperationType.CREATE,
        `services/${id}`
      );
    } finally {
      setSvSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setConfirmDeleteServiceId(null);
      if (editingServiceId === id) {
        resetServiceForm();
      }
      setAdminBanner('Service removed.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  const handleSaveSiteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profSaving) return;
    setProfSaving(true);
    setAdminBanner(null);

    const payload = {
      artistName: profName.trim().slice(0, 60) || 'Yukta',
      studioLocation: profLocation.trim().slice(0, 100) || 'Gotri, Vadodara, Gujarat',
      artistBio: profBio.trim().slice(0, 600),
      artistImageUrl: profImage.trim().slice(0, FIELD_LIMITS.imageUrlMax),
      whatsappNumber: profWhatsapp.trim().slice(0, 20),
      instagramHandle: profInstagram.trim().slice(0, 60),
      seeded: true,
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'siteProfile', 'artist'), payload);
      setAdminBanner('Artist profile and studio contact details saved.');
    } catch (error) {
      setAdminBanner('Unable to update artist profile.');
      handleFirestoreError(error, OperationType.WRITE, 'siteProfile/artist');
    } finally {
      setProfSaving(false);
    }
  };

  const bookingCounts = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'Pending').length,
      confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (!q) return true;
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.eventLocation.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q)
      );
    });
  }, [bookings, statusFilter, searchTerm]);

  // 1. Auth Loading Gate
  if (!authReady || adminCheckLoading) {
    return (
      <section className="min-h-[75vh] bg-[#FCF9F7] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-[#F0ECF8]/70 border border-[#111111]/15 p-10 text-center space-y-4">
          <LotusFlourish className="w-24 h-7 mx-auto" />
          <p className="font-serif text-2xl text-[#111111]">
            Verifying Studio Session
          </p>
          <p className="text-sm text-[#111111]">
            Checking Firebase authentication credentials...
          </p>
        </div>
      </section>
    );
  }

  // 2. Sign-In Gate for Unauthenticated Visitors
  if (!user) {
    return (
      <section className="min-h-[75vh] bg-[#FCF9F7] flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full bg-[#F8E9EE]/70 border border-[#111111]/15 p-8 sm:p-12 space-y-6 text-center">
          <p className="text-xs uppercase tracking-widest text-[#111111]">
            Protected Studio Portal
          </p>
          <h1 className="font-serif text-4xl font-normal text-[#111111]">
            Yuk Creation Admin Studio
          </h1>
          <LotusFlourish className="w-24 h-7 mx-auto" />
          <p className="text-sm leading-relaxed text-[#111111]">
            Sign in with your verified administrator Google account to manage client booking
            requests, update booking statuses, curate portfolio photography, and edit mehndi
            services.
          </p>

          {authError && (
            <div
              role="alert"
              className="p-4 bg-[#FCF9F7] border border-[#111111]/30 text-xs text-[#111111]"
            >
              {authError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={signingIn}
              onClick={handleGoogleLogin}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/30 transition-colors whitespace-nowrap"
            >
              {signingIn ? 'Opening Google Sign-In...' : 'Sign in with Google'}
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-[#111111] bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-[#111111]/20 transition-colors whitespace-nowrap"
            >
              Return to Website
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Unauthorized User Gate
  if (!isAdmin) {
    return (
      <section className="min-h-[75vh] bg-[#FCF9F7] flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full bg-[#F8E9EE]/70 border border-[#111111]/20 p-8 sm:p-12 space-y-6 text-center">
          <p className="text-xs uppercase tracking-widest text-[#111111]">
            Access Restricted
          </p>
          <h1 className="font-serif text-4xl font-normal text-[#111111]">
            Studio Administrator Only
          </h1>
          <p className="text-sm leading-relaxed text-[#111111]">
            You are signed in as <span className="font-medium">{user.email}</span>, which does not
            have administrator privileges for Yuk Creation. Customer bookings and portfolio editing
            are strictly protected by Firestore Security Rules.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/25"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-6 py-3 text-sm font-medium text-[#111111] bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-[#111111]/20"
            >
              Return to Website
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. Verified Admin Workspace
  return (
    <section className="min-h-[82vh] bg-[#FCF9F7] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        {/* Top Studio Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111111]/12">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#111111]">
              Yuk Creation · Admin Studio
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#111111]">
              Studio Management
            </h1>
            <p className="text-sm text-[#111111]">
              Signed in as {user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isCatalogSeeded && (
              <button
                type="button"
                disabled={seedingCatalog}
                onClick={handleSeedDefaultCatalog}
                className="px-5 py-2.5 text-xs sm:text-sm font-medium text-[#111111] bg-[#F8E9EE] hover:bg-[#F1DAE3] border border-[#111111]/25 whitespace-nowrap"
              >
                {seedingCatalog
                  ? 'Syncing Catalog...'
                  : 'Sync Default Catalog to Firestore'}
              </button>
            )}
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-[#111111] bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-[#111111]/20 whitespace-nowrap"
            >
              View Live Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/25 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {adminBanner && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 px-5 py-3.5 bg-[#F0ECF8] border border-[#111111]/20 text-sm text-[#111111]"
          >
            <span>{adminBanner}</span>
            <button
              type="button"
              onClick={() => setAdminBanner(null)}
              aria-label="Dismiss notification"
              className="p-1 hover:bg-[#FCF9F7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#111111]/12 pb-4">
          {(
            [
              { id: 'bookings', label: `Bookings (${bookingCounts.total})` },
              { id: 'portfolio', label: `Portfolio (${portfolio.length})` },
              { id: 'services', label: `Services (${services.length})` },
              { id: 'profile', label: 'Artist Profile & Contact' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm border transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#E6DCF5] border-[#111111]/40 font-medium text-[#111111]'
                  : 'bg-[#FCF9F7] border-[#111111]/15 text-[#111111] hover:bg-[#F8E9EE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Tabular Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F8E9EE]/60 border border-[#111111]/12 p-5">
                <p className="text-xs uppercase tracking-wider text-[#111111]">
                  Total Enquiries
                </p>
                <p className="font-serif text-3xl text-[#111111] tabular-nums mt-1">
                  {bookingCounts.total}
                </p>
              </div>
              <div className="bg-[#F0ECF8]/75 border border-[#111111]/12 p-5">
                <p className="text-xs uppercase tracking-wider text-[#111111]">
                  Pending Review
                </p>
                <p className="font-serif text-3xl text-[#111111] tabular-nums mt-1">
                  {bookingCounts.pending}
                </p>
              </div>
              <div className="bg-[#E6DCF5]/75 border border-[#111111]/12 p-5">
                <p className="text-xs uppercase tracking-wider text-[#111111]">
                  Confirmed
                </p>
                <p className="font-serif text-3xl text-[#111111] tabular-nums mt-1">
                  {bookingCounts.confirmed}
                </p>
              </div>
              <div className="bg-[#FCF9F7] border border-[#111111]/12 p-5">
                <p className="text-xs uppercase tracking-wider text-[#111111]">
                  Cancelled
                </p>
                <p className="font-serif text-3xl text-[#111111] tabular-nums mt-1">
                  {bookingCounts.cancelled}
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Pending', 'Confirmed', 'Cancelled'] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 text-xs border transition-colors whitespace-nowrap ${
                        statusFilter === status
                          ? 'bg-[#E6DCF5] border-[#111111]/40 font-medium'
                          : 'bg-[#FCF9F7] border-[#111111]/15 hover:bg-[#F8E9EE]'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#111111] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, phone, ID, location..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20 focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            {/* Bookings List */}
            {bookingsLoading ? (
              <p className="text-sm text-[#111111] py-8">Loading booking enquiries...</p>
            ) : bookingsError ? (
              <div className="p-6 bg-[#F8E9EE] border border-[#111111]/25 text-sm text-[#111111]">
                {bookingsError}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 bg-[#F8E9EE]/45 border border-[#111111]/12 text-center space-y-2">
                <p className="font-serif text-2xl text-[#111111]">
                  No booking enquiries match this view
                </p>
                <p className="text-sm text-[#111111]">
                  New customer submissions from the booking form appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const isBusy = updatingBookingId === booking.id;
                  const cleanCustPhone = booking.phone.replace(/\D/g, '');
                  const waReply = `https://wa.me/${cleanCustPhone}?text=${encodeURIComponent(
                    `Namaste ${booking.customerName}, thank you for contacting Yuk Creation (Ref: ${booking.bookingCode}) for ${booking.serviceTitle} on ${booking.eventDate}.`
                  )}`;

                  return (
                    <article
                      key={booking.id}
                      className="bg-[#FCF9F7] border border-[#111111]/15 p-6 space-y-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#111111]/10">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#111111]">
                            <span className="font-mono font-medium">
                              {booking.bookingCode}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium">
                              Status: {booking.status}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              Event: {booking.eventDate}
                            </span>
                          </div>
                          <h2 className="font-serif text-2xl sm:text-3xl text-[#111111]">
                            {booking.customerName}
                          </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isBusy || booking.status === 'Confirmed'}
                            onClick={() =>
                              handleUpdateBookingStatus(booking, 'Confirmed')
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] disabled:opacity-45 border border-[#111111]/25 whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy || booking.status === 'Cancelled'}
                            onClick={() =>
                              handleUpdateBookingStatus(booking, 'Cancelled')
                            }
                            className="px-4 py-2 text-xs font-medium text-[#111111] bg-[#F8E9EE] hover:bg-[#F1DAE3] disabled:opacity-45 border border-[#111111]/25 whitespace-nowrap"
                          >
                            Cancel
                          </button>

                          {booking.status !== 'Pending' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                handleUpdateBookingStatus(booking, 'Pending')
                              }
                              className="px-4 py-2 text-xs text-[#111111] bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-[#111111]/20 whitespace-nowrap"
                            >
                              Set Pending
                            </button>
                          )}

                          <a
                            href={waReply}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs text-[#111111] bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-[#111111]/20 whitespace-nowrap"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-[#111111]">
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-0.5">
                            Phone
                          </p>
                          <a
                            href={`tel:${booking.phone}`}
                            className="tabular-nums underline"
                          >
                            {booking.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-0.5">
                            Service Selected
                          </p>
                          <p>{booking.serviceTitle}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-0.5">
                            Preferred Time
                          </p>
                          <p>{booking.preferredTime}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-0.5">
                            Event Location
                          </p>
                          <p>{booking.eventLocation}</p>
                        </div>
                      </div>

                      {booking.requirements && (
                        <div className="bg-[#F8E9EE]/45 border border-[#111111]/10 p-4 text-sm text-[#111111]">
                          <p className="text-xs uppercase tracking-wider mb-1">
                            Customer Requirements
                          </p>
                          <p className="leading-relaxed">{booking.requirements}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                        <div className="flex-1">
                          <label
                            htmlFor={`notes-${booking.id}`}
                            className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5"
                          >
                            Internal Studio Notes
                          </label>
                          <div className="flex gap-2">
                            <input
                              id={`notes-${booking.id}`}
                              type="text"
                              maxLength={FIELD_LIMITS.adminNotesMax}
                              value={notesDraft[booking.id] ?? ''}
                              onChange={(e) =>
                                setNotesDraft((prev) => ({
                                  ...prev,
                                  [booking.id]: e.target.value,
                                }))
                              }
                              placeholder="Advance status, travel notes, portrait sketch reminder..."
                              className="flex-1 px-3 py-2 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20 focus:outline-none focus:border-[#111111]"
                            />
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSaveBookingNotes(booking)}
                              className="px-4 py-2 text-xs font-medium text-[#111111] bg-[#F0ECF8] hover:bg-[#E6DCF5] border border-[#111111]/20 whitespace-nowrap"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>

                        <div>
                          {confirmDeleteBookingId === booking.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="px-3 py-2 text-xs font-medium text-[#111111] bg-[#F1DAE3] border border-[#111111]/40"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteBookingId(null)}
                                className="px-3 py-2 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteBookingId(booking.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#111111] bg-[#FCF9F7] hover:bg-[#F8E9EE] border border-[#111111]/15"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <form
              onSubmit={handleSavePortfolio}
              className="lg:col-span-5 bg-[#F8E9EE]/60 border border-[#111111]/15 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#111111]">
                  {editingPortfolioId
                    ? 'Edit Portfolio Photograph'
                    : 'Add Portfolio Photograph'}
                </h2>
                {editingPortfolioId && (
                  <button
                    type="button"
                    onClick={resetPortfolioForm}
                    className="text-xs underline text-[#111111]"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={FIELD_LIMITS.titleMax}
                  value={pfTitle}
                  onChange={(e) => setPfTitle(e.target.value)}
                  placeholder="e.g., Udaipur Jharokha Bridal"
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={pfCategory}
                    onChange={(e) =>
                      setPfCategory(e.target.value as PortfolioCategory)
                    }
                    className="w-full px-3 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                  >
                    {PORTFOLIO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={pfSortOrder}
                    onChange={(e) => setPfSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20 tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#111111]">
                  Photograph (Upload File or Paste URL) *
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-dashed border-[#111111]/35 text-xs text-[#111111] cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photograph from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setPfImageUrl);
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={pfImageUrl}
                  onChange={(e) => setPfImageUrl(e.target.value)}
                  placeholder="Or paste HTTPS image URL..."
                  className="w-full px-3.5 py-2.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
                {pfImageUrl && (
                  <div className="aspect-[4/3] w-full overflow-hidden border border-[#111111]/15 bg-[#FCF9F7]">
                    <ImageWithFallback
                      src={pfImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Editorial Caption
                </label>
                <textarea
                  rows={3}
                  maxLength={FIELD_LIMITS.captionMax}
                  value={pfCaption}
                  onChange={(e) => setPfCaption(e.target.value)}
                  placeholder="Describe motifs, occasion, or stain highlights..."
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <label className="flex items-center gap-2.5 text-sm text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pfFeatured}
                  onChange={(e) => setPfFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#111111]"
                />
                <span>Highlight as Featured Mehndi Design</span>
              </label>

              <button
                type="submit"
                disabled={pfSaving}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/30"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {pfSaving
                    ? 'Saving...'
                    : editingPortfolioId
                    ? 'Update Photograph'
                    : 'Publish to Portfolio'}
                </span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl text-[#111111]">
                Published Portfolio ({portfolio.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...portfolio]
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((item) => (
                    <article
                      key={item.id}
                      className="bg-[#FCF9F7] border border-[#111111]/15 p-3 space-y-3"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#F8E9EE]">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-[#111111] flex items-center gap-2">
                          <span>{item.category}</span>
                          {item.featured && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Featured</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-xl text-[#111111]">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleEditPortfolio(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#111111] bg-[#F0ECF8] border border-[#111111]/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {confirmDeletePortfolioId === item.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDeletePortfolio(item.id)}
                              className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F1DAE3] border border-[#111111]/40"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePortfolioId(null)}
                              className="px-3 py-1.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePortfolioId(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/15"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <form
              onSubmit={handleSaveService}
              className="lg:col-span-5 bg-[#F0ECF8]/70 border border-[#111111]/15 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#111111]">
                  {editingServiceId ? 'Edit Service' : 'Add Mehndi Service'}
                </h2>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="text-xs underline text-[#111111]"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={FIELD_LIMITS.titleMax}
                  value={svTitle}
                  onChange={(e) => setSvTitle(e.target.value)}
                  placeholder="e.g., Bespoke Bridal Mehndi"
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={svDuration}
                    onChange={(e) => setSvDuration(e.target.value)}
                    placeholder="e.g., 5 – 7 Hours"
                    className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                    Price / Note *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={svStartingPrice}
                    onChange={(e) => setSvStartingPrice(e.target.value)}
                    placeholder="On Consultation"
                    className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={FIELD_LIMITS.summaryMax}
                  value={svSummary}
                  onChange={(e) => setSvSummary(e.target.value)}
                  placeholder="Describe what makes this service special..."
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Highlights (comma separated, max 6)
                </label>
                <input
                  type="text"
                  value={svHighlightsText}
                  onChange={(e) => setSvHighlightsText(e.target.value)}
                  placeholder="Organic henna, Pre-event consultation, Aftercare guide"
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#111111]">
                  Service Photograph *
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FCF9F7] hover:bg-[#F8E9EE] border border-dashed border-[#111111]/35 text-xs text-[#111111] cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photograph</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setSvImageUrl);
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={svImageUrl}
                  onChange={(e) => setSvImageUrl(e.target.value)}
                  placeholder="Or paste HTTPS image URL..."
                  className="w-full px-3.5 py-2.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-[#111111]">
                  <input
                    type="checkbox"
                    checked={svActive}
                    onChange={(e) => setSvActive(e.target.checked)}
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span>Active for Bookings</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#111111]">Order:</span>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={svSortOrder}
                    onChange={(e) => setSvSortOrder(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20 tabular-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={svSaving}
                className="w-full px-6 py-3 text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/30"
              >
                {svSaving
                  ? 'Saving...'
                  : editingServiceId
                  ? 'Update Service'
                  : 'Add Service'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl text-[#111111]">
                Studio Services ({services.length})
              </h2>
              <div className="space-y-4">
                {[...services]
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((service) => (
                    <article
                      key={service.id}
                      className="bg-[#FCF9F7] border border-[#111111]/15 p-4 flex flex-col sm:flex-row gap-4 items-start"
                    >
                      <div className="w-full sm:w-36 aspect-[4/3] shrink-0 overflow-hidden bg-[#F8E9EE]">
                        <ImageWithFallback
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-[#111111]">
                          <span>{service.active ? 'Active' : 'Hidden'}</span>
                          <span aria-hidden="true">·</span>
                          <span>{service.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{service.startingPrice}</span>
                        </div>
                        <h3 className="font-serif text-2xl text-[#111111]">
                          {service.title}
                        </h3>
                        <p className="text-sm text-[#111111]">{service.summary}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleEditService(service)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#111111] bg-[#F0ECF8] border border-[#111111]/20"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {confirmDeleteServiceId === service.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(service.id)}
                                className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-[#F1DAE3] border border-[#111111]/40"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteServiceId(null)}
                                className="px-3 py-1.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteServiceId(service.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/15"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARTIST PROFILE & STUDIO CONTACT */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveSiteProfile}
            className="max-w-3xl bg-[#F8E9EE]/55 border border-[#111111]/15 p-6 sm:p-8 space-y-6"
          >
            <h2 className="font-serif text-3xl text-[#111111]">
              Artist Profile &amp; Studio Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Artist Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Studio Location
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={profLocation}
                  onChange={(e) => setProfLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                Artist Introduction &amp; Bio
              </label>
              <textarea
                rows={4}
                required
                maxLength={600}
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={profWhatsapp}
                  onChange={(e) => setProfWhatsapp(e.target.value)}
                  placeholder="Enter WhatsApp number with country code"
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#111111] mb-1.5">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={profInstagram}
                  onChange={(e) => setProfInstagram(e.target.value)}
                  placeholder="yukcreation"
                  className="w-full px-3.5 py-2.5 text-sm text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#111111]">
                Yukta&apos;s Original Portrait Photograph
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-32 aspect-[3/4] overflow-hidden bg-[#FCF9F7] border border-[#111111]/15 shrink-0">
                  <ImageWithFallback
                    src={profImage}
                    alt="Yukta artist preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FCF9F7] hover:bg-[#F0ECF8] border border-dashed border-[#111111]/35 text-xs text-[#111111] cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Yukta&apos;s Original Photograph</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, setProfImage);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={profImage}
                    onChange={(e) => setProfImage(e.target.value)}
                    placeholder="Or paste HTTPS image URL..."
                    className="w-full px-3.5 py-2.5 text-xs text-[#111111] bg-[#FCF9F7] border border-[#111111]/20"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={profSaving}
              className="px-7 py-3 text-sm font-medium text-[#111111] bg-[#E6DCF5] hover:bg-[#DCD0F0] border border-[#111111]/30"
            >
              {profSaving ? 'Saving Profile...' : 'Save Studio Profile'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
