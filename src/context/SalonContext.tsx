import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  SalonSettings,
  ServiceCategory,
  SalonService,
  GalleryItem,
  CustomerReview,
  BookingRequest,
} from '../types/salon';
import {
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_SERVICES,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
} from '../data/defaultData';
import { getAssetUrl } from '../utils/assets';

const BOOTSTRAP_ADMIN_EMAIL = "inviora.digital@gmail.com";

interface SalonContextType {
  settings: SalonSettings;
  categories: ServiceCategory[];
  services: SalonService[];
  gallery: GalleryItem[];
  reviews: CustomerReview[];
  reservations: BookingRequest[];
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isFirebaseActive: boolean;
  updateSettings: (newSettings: Partial<SalonSettings>) => Promise<void>;
  addCategory: (cat: Omit<ServiceCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addService: (srv: Omit<SalonService, 'id'>) => Promise<void>;
  updateService: (id: string, srv: Partial<SalonService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  addReview: (rev: Omit<CustomerReview, 'id'>) => Promise<void>;
  updateReview: (id: string, rev: Partial<CustomerReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  createReservation: (booking: {
    fullName: string;
    phoneNumber: string;
    service: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }) => Promise<{ id: string; whatsappUrl: string }>;
  updateReservationStatus: (id: string, status: BookingRequest['status']) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetToDefaultData: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with official defaults or cache
  const [settings, setSettings] = useState<SalonSettings>(() => {
    const cached = localStorage.getItem('gbr_v3_settings');
    return cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const cached = localStorage.getItem('gbr_v3_categories');
    return cached ? JSON.parse(cached) : DEFAULT_CATEGORIES;
  });

  const [services, setServices] = useState<SalonService[]>(() => {
    const cached = localStorage.getItem('gbr_v3_services');
    return cached ? JSON.parse(cached) : DEFAULT_SERVICES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const cached = localStorage.getItem('gbr_v3_gallery');
    return cached ? JSON.parse(cached) : DEFAULT_GALLERY;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const cached = localStorage.getItem('gbr_v3_reviews');
    return cached ? JSON.parse(cached) : DEFAULT_REVIEWS;
  });

  const [reservations, setReservations] = useState<BookingRequest[]>(() => {
    const cached = localStorage.getItem('gbr_v3_reservations');
    return cached ? JSON.parse(cached) : [];
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);

  // Sync cache changes to localStorage and update browser tab favicon
  useEffect(() => {
    localStorage.setItem('gbr_v3_settings', JSON.stringify(settings));
    if (settings.logoUrl) {
      try {
        const resolvedLogo = getAssetUrl(settings.logoUrl);
        const iconLinks = document.querySelectorAll("link[rel*='icon']");
        iconLinks.forEach((link) => {
          (link as HTMLLinkElement).href = resolvedLogo;
        });
      } catch (e) {
        console.warn("Could not sync favicon dynamically:", e);
      }
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gbr_v3_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gbr_v3_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('gbr_v3_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('gbr_v3_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gbr_v3_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (user.email === BOOTSTRAP_ADMIN_EMAIL) return true;
    if (settings.adminEmail && user.email === settings.adminEmail) return true;
    return false;
  }, [user, settings.adminEmail]);

  // Real-time Firestore Listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const setupFirestore = async () => {
      try {
        // 1. Settings Document
        const settingsRef = doc(db, 'settings', 'general');
        const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
          setIsFirebaseActive(true);
          if (snapshot.exists()) {
            setSettings(snapshot.data() as SalonSettings);
          } else {
            // Seed settings if missing
            setDoc(settingsRef, DEFAULT_SETTINGS).catch((e) =>
              console.warn("Could not seed settings document (may require admin auth):", e)
            );
          }
        }, (error) => {
          console.warn("Settings onSnapshot notice:", error.message);
        });
        unsubs.push(unsubSettings);

        // 2. Categories Collection
        const categoriesRef = collection(db, 'categories');
        const unsubCat = onSnapshot(categoriesRef, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceCategory));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCategories(items);
          }
        }, (err) => console.warn("Categories onSnapshot:", err.message));
        unsubs.push(unsubCat);

        // 3. Services Collection
        const servicesRef = collection(db, 'services');
        const unsubServices = onSnapshot(servicesRef, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SalonService));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setServices(items);
          }
        }, (err) => console.warn("Services onSnapshot:", err.message));
        unsubs.push(unsubServices);

        // 4. Gallery Collection
        const galleryRef = collection(db, 'gallery');
        const unsubGallery = onSnapshot(galleryRef, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            setGallery(items);
          }
        }, (err) => console.warn("Gallery onSnapshot:", err.message));
        unsubs.push(unsubGallery);

        // 5. Reviews Collection
        const reviewsRef = collection(db, 'reviews');
        const unsubReviews = onSnapshot(reviewsRef, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CustomerReview));
            setReviews(items);
          }
        }, (err) => console.warn("Reviews onSnapshot:", err.message));
        unsubs.push(unsubReviews);

        // 6. Reservations (only if logged in as Admin)
        if (isAdmin) {
          const resRef = collection(db, 'reservations');
          const unsubRes = onSnapshot(resRef, (snapshot) => {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BookingRequest));
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReservations(items);
          }, (err) => console.warn("Reservations onSnapshot:", err.message));
          unsubs.push(unsubRes);
        }
      } catch (err) {
        console.warn("Firestore setup:", err);
      }
    };

    setupFirestore();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isAdmin]);

  // Actions
  const updateSettings = async (newSettings: Partial<SalonSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      const ref = doc(db, 'settings', 'general');
      await setDoc(ref, updated, { merge: true });
    } catch (error) {
      console.warn("Settings local updated, Firestore notice:", error);
    }
  };

  const addCategory = async (cat: Omit<ServiceCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat = { ...cat, id };
    setCategories(prev => [...prev, newCat]);

    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (error) {
      console.warn("Firestore addCategory notice:", error);
    }
  };

  const updateCategory = async (id: string, cat: Partial<ServiceCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...cat } : c));

    try {
      await updateDoc(doc(db, 'categories', id), cat);
    } catch (error) {
      console.warn("Firestore updateCategory notice:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.warn("Firestore deleteCategory notice:", error);
    }
  };

  const addService = async (srv: Omit<SalonService, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newSrv = { ...srv, id };
    setServices(prev => [...prev, newSrv]);

    try {
      await setDoc(doc(db, 'services', id), newSrv);
    } catch (error) {
      console.warn("Firestore addService notice:", error);
    }
  };

  const updateService = async (id: string, srv: Partial<SalonService>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...srv } : s));

    try {
      await updateDoc(doc(db, 'services', id), srv);
    } catch (error) {
      console.warn("Firestore updateService notice:", error);
    }
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));

    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.warn("Firestore deleteService notice:", error);
    }
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const id = `gal-${Date.now()}`;
    const newItem = { ...item, id };
    setGallery(prev => [...prev, newItem]);

    try {
      await setDoc(doc(db, 'gallery', id), newItem);
    } catch (error) {
      console.warn("Firestore addGalleryItem notice:", error);
    }
  };

  const updateGalleryItem = async (id: string, item: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => g.id === id ? { ...g, ...item } : g));

    try {
      await updateDoc(doc(db, 'gallery', id), item);
    } catch (error) {
      console.warn("Firestore updateGalleryItem notice:", error);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));

    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
      console.warn("Firestore deleteGalleryItem notice:", error);
    }
  };

  const addReview = async (rev: Omit<CustomerReview, 'id'>) => {
    const id = `rev-${Date.now()}`;
    const newRev = { ...rev, id };
    setReviews(prev => [newRev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', id), newRev);
    } catch (error) {
      console.warn("Firestore addReview notice:", error);
    }
  };

  const updateReview = async (id: string, rev: Partial<CustomerReview>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...rev } : r));

    try {
      await updateDoc(doc(db, 'reviews', id), rev);
    } catch (error) {
      console.warn("Firestore updateReview notice:", error);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));

    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      console.warn("Firestore deleteReview notice:", error);
    }
  };

  // Reservation Creation (generates formatted WhatsApp link + saves to Firestore)
  const createReservation = async (booking: {
    fullName: string;
    phoneNumber: string;
    service: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }) => {
    const id = `res-${Date.now()}`;
    const newRes: BookingRequest = {
      ...booking,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Update local state
    setReservations(prev => [newRes, ...prev]);

    // Format WhatsApp pre-filled message
    // Prompt specification: "Generate a prefilled WhatsApp message to +212669330554. This is a booking request, not an automatically confirmed appointment."
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '') || '212669330554';
    const messageLines = [
      `Bonjour Glow by Rim,`,
      `Je souhaite faire une demande de réservation de rendez-vous :`,
      `• Nom : ${booking.fullName}`,
      `• Téléphone : ${booking.phoneNumber}`,
      `• Prestation souhaitée : ${booking.service}`,
      `• Date souhaitée : ${booking.preferredDate}`,
      `• Heure souhaitée : ${booking.preferredTime}`,
    ];

    if (booking.notes && booking.notes.trim()) {
      messageLines.push(`• Remarque : ${booking.notes.trim()}`);
    }

    messageLines.push(``);
    messageLines.push(`(Demande effectuée depuis glowbyrim.ma - Merci de me confirmer la disponibilité)`);

    const encodedMessage = encodeURIComponent(messageLines.join('\n'));
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Attempt to persist in Firestore
    try {
      await setDoc(doc(db, 'reservations', id), newRes);
    } catch (err) {
      console.warn("Reservation saved locally; Firestore sync notice:", err);
    }

    return { id, whatsappUrl };
  };

  const updateReservationStatus = async (id: string, status: BookingRequest['status']) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    try {
      await updateDoc(doc(db, 'reservations', id), { status });
    } catch (err) {
      console.warn("Update reservation error:", err);
    }
  };

  const deleteReservation = async (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));

    try {
      await deleteDoc(doc(db, 'reservations', id));
    } catch (err) {
      console.warn("Delete reservation error:", err);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const resetToDefaultData = async () => {
    setSettings(DEFAULT_SETTINGS);
    setCategories(DEFAULT_CATEGORIES);
    setServices(DEFAULT_SERVICES);
    setGallery(DEFAULT_GALLERY);
    setReviews(DEFAULT_REVIEWS);
    localStorage.clear();

    if (isAdmin) {
      try {
        await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);
        for (const cat of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        for (const srv of DEFAULT_SERVICES) {
          await setDoc(doc(db, 'services', srv.id), srv);
        }
        for (const g of DEFAULT_GALLERY) {
          await setDoc(doc(db, 'gallery', g.id), g);
        }
        for (const r of DEFAULT_REVIEWS) {
          await setDoc(doc(db, 'reviews', r.id), r);
        }
      } catch (err) {
        console.warn("Reset Firestore notice:", err);
      }
    }
  };

  return (
    <SalonContext.Provider
      value={{
        settings,
        categories,
        services,
        gallery,
        reviews,
        reservations,
        user,
        isAdmin,
        isLoading,
        isFirebaseActive,
        updateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        addService,
        updateService,
        deleteService,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addReview,
        updateReview,
        deleteReview,
        createReservation,
        updateReservationStatus,
        deleteReservation,
        loginWithGoogle,
        logout,
        resetToDefaultData,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
