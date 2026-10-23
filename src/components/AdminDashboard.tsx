import React, { useState, useRef } from 'react';
import {
  X,
  LayoutDashboard,
  Scissors,
  Tag,
  Image as ImageIcon,
  Clock,
  Star,
  Palette,
  Settings,
  LogOut,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Save,
  MessageCircle,
  Phone,
  Calendar,
  Sparkles,
  RotateCcw,
  Check,
  Shield,
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';
import { SalonService, GalleryItem, CustomerReview, BookingRequest } from '../types/salon';
import { getSalonOpenStatus } from '../utils/hours';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'tableau-de-bord'
  | 'prestations'
  | 'tarifs'
  | 'galerie'
  | 'horaires'
  | 'avis'
  | 'personnalisation'
  | 'parametres';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    categories,
    services,
    gallery,
    reviews,
    reservations,
    user,
    isAdmin,
    isFirebaseActive,
    updateSettings,
    addCategory,
    addService,
    updateService,
    deleteService,
    addGalleryItem,
    deleteGalleryItem,
    addReview,
    updateReview,
    deleteReview,
    updateReservationStatus,
    deleteReservation,
    loginWithGoogle,
    logout,
    resetToDefaultData,
  } = useSalon();

  const [activeTab, setActiveTab] = useState<AdminTab>('tableau-de-bord');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Deletion confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {},
  });

  // Settings form state
  const [formSettings, setFormSettings] = useState(settings);
  React.useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Service editing state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<SalonService>>({});
  const [isAddingService, setIsAddingService] = useState(false);

  // Category adding state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Gallery photo upload state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState<{
    title: string;
    category: GalleryItem['category'];
    imageUrl: string;
    description: string;
  }>({
    title: '',
    category: 'salon',
    imageUrl: '',
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review editing state
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<CustomerReview>>({
    authorName: '',
    rating: 5,
    text: '',
    date: 'Récemment',
    serviceTag: 'Coiffure & Soins',
    isFeatured: true,
  });

  // Live hours status
  const currentOpenStatus = getSalonOpenStatus();

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handle Photo File Upload (supports mobile gallery/camera & desktop)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Erreur : Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      setPhotoForm((prev) => ({
        ...prev,
        imageUrl: base64Url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      showToast('Photo chargée avec succès !');
    };
    reader.readAsDataURL(file);
  };

  // Save Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formSettings);
      showToast('Modifications enregistrées sur le site en direct !');
    } catch {
      showToast('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Service
  const handleSaveService = async () => {
    if (!serviceForm.title || !serviceForm.categoryId) {
      showToast('Veuillez renseigner le titre et la catégorie.');
      return;
    }

    setIsSaving(true);
    const matchedCat = categories.find((c) => c.id === serviceForm.categoryId);
    const catName = matchedCat ? matchedCat.name : 'Glow by Rim';

    try {
      if (editingServiceId) {
        await updateService(editingServiceId, {
          ...serviceForm,
          categoryName: catName,
        });
        showToast('Prestation mise à jour !');
      } else {
        await addService({
          title: serviceForm.title || '',
          categoryId: serviceForm.categoryId,
          categoryName: catName,
          description: serviceForm.description || '',
          price: serviceForm.price || 'Sur demande',
          duration: serviceForm.duration || '45 min',
          isPopular: !!serviceForm.isPopular,
          order: services.length + 1,
        });
        showToast('Nouvelle prestation ajoutée !');
      }
      setEditingServiceId(null);
      setIsAddingService(false);
      setServiceForm({});
    } catch {
      showToast('Erreur lors de l’enregistrement de la prestation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Inline Price Update
  const handleQuickPriceUpdate = async (serviceId: string, newPrice: string) => {
    await updateService(serviceId, { price: newPrice });
    showToast('Tarif actualisé en temps réel !');
  };

  // Save Photo
  const handleSavePhoto = async () => {
    if (!photoForm.title || !photoForm.imageUrl) {
      showToast('Veuillez ajouter une photo et lui donner un titre.');
      return;
    }

    setIsSaving(true);
    try {
      const categoryLabels: Record<string, string> = {
        coiffure: 'Coiffure',
        ongles: 'Manucure & Ongles',
        pedicure: 'Pédicure Spa',
        soins: 'Soins & Cabine',
        salon: 'Le Salon',
        tous: 'Toutes les photos',
      };

      await addGalleryItem({
        title: photoForm.title,
        category: photoForm.category,
        categoryLabel: categoryLabels[photoForm.category] || 'Le Salon',
        imageUrl: photoForm.imageUrl,
        description: photoForm.description || '',
        order: gallery.length + 1,
      });

      setIsAddingPhoto(false);
      setPhotoForm({ title: '', category: 'salon', imageUrl: '', description: '' });
      showToast('Photo publiée dans la galerie !');
    } catch {
      showToast('Erreur lors de l’ajout de la photo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Review
  const handleSaveReview = async () => {
    if (!reviewForm.authorName || !reviewForm.text) {
      showToast('Veuillez renseigner le nom et le texte de l’avis.');
      return;
    }

    setIsSaving(true);
    try {
      await addReview({
        authorName: reviewForm.authorName,
        rating: reviewForm.rating || 5,
        text: reviewForm.text,
        date: reviewForm.date || 'Récemment',
        serviceTag: reviewForm.serviceTag || 'Soin',
        isFeatured: !!reviewForm.isFeatured,
      });

      setIsAddingReview(false);
      setReviewForm({
        authorName: '',
        rating: 5,
        text: '',
        date: 'Récemment',
        serviceTag: 'Coiffure & Soins',
        isFeatured: true,
      });
      showToast('Témoignage client ajouté !');
    } catch {
      showToast('Erreur lors de l’ajout de l’avis.');
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { id: 'tableau-de-bord', label: 'Tableau de bord', icon: LayoutDashboard, badge: reservations.filter(r => r.status === 'pending').length },
    { id: 'prestations', label: 'Prestations', icon: Scissors },
    { id: 'tarifs', label: 'Tarifs', icon: Tag },
    { id: 'galerie', label: 'Galerie', icon: ImageIcon },
    { id: 'horaires', label: 'Horaires', icon: Clock },
    { id: 'avis', label: 'Avis', icon: Star },
    { id: 'personnalisation', label: 'Personnalisation', icon: Palette },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#DFBD7F]/40 shadow-2xl max-w-6xl w-full h-[95vh] max-h-[850px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-[#3A2F29] text-[#FAF7F2] px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#4A3E39] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2]/10 flex items-center justify-center text-[#DFBD7F] border border-white/10 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-semibold tracking-wide">
                  Administration — Glow by Rim
                </h3>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isFirebaseActive ? 'Cloud Sync Actif' : 'Enregistrement Local'}
                </span>
              </div>
              <p className="text-[11px] text-[#E8D6C5]/80 font-light truncate max-w-[280px] sm:max-w-md">
                Gérez vos tarifs, photos, prestations et horaires en toute simplicité
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs text-[#FAF7F2]/80 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-[#FAF7F2]/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Fermer le tableau de bord"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast notification message */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-medium flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Body with Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FAF7F2]">
          
          {/* Sidebar (Desktop left / Mobile top scroll) */}
          <aside className="w-full md:w-64 bg-[#F2ECE1] border-b md:border-b-0 md:border-r border-[#E0D5C3] p-3 md:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
            <div className="flex md:flex-col gap-1 w-full">
              <div className="hidden md:block px-3 py-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8C7A70]">
                Navigation Salon
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 md:w-full ${
                      isActive
                        ? 'bg-[#3A2F29] text-[#FAF7F2] shadow-sm font-semibold'
                        : 'text-[#6B5A50] hover:bg-[#E8DFD0] hover:text-[#3A2F29]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFBD7F]' : 'text-[#8C7A70]'}`} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#DFBD7F] text-[#3A2F29]' : 'bg-rose-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick status footer on desktop sidebar */}
            <div className="hidden md:block pt-4 mt-4 border-t border-[#E0D5C3] px-2 text-[11px] text-[#8C7A70] space-y-1">
              <div className="flex items-center justify-between">
                <span>Statut :</span>
                <span className="font-medium text-emerald-700">En ligne</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Casablanca :</span>
                <span className="font-mono text-xs">{currentOpenStatus.todayDayName}</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            
            {/* 1. TABLEAU DE BORD */}
            {activeTab === 'tableau-de-bord' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                    Tableau de bord de gestion
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B5A50] font-light">
                    Aperçu instantané de l'activité, des réservations reçues et du salon Glow by Rim.
                  </p>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#EFE8DD] shadow-xs">
                    <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] block font-medium">
                      Prestations
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#3A2F29] mt-1 block">
                      {services.length}
                    </span>
                    <span className="text-[11px] text-emerald-700 mt-1 block">
                      Actives au catalogue
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#EFE8DD] shadow-xs">
                    <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] block font-medium">
                      Photos Galerie
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#3A2F29] mt-1 block">
                      {gallery.length}
                    </span>
                    <span className="text-[11px] text-[#6B5A50] mt-1 block">
                      Vues par les clientes
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#EFE8DD] shadow-xs">
                    <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] block font-medium">
                      Avis Étoilés
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#3A2F29] mt-1 block">
                      {settings.googleRating} ★
                    </span>
                    <span className="text-[11px] text-[#6B5A50] mt-1 block">
                      {reviews.length} témoignages
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#EFE8DD] shadow-xs">
                    <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] block font-medium">
                      Demandes reçues
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#3A2F29] mt-1 block">
                      {reservations.length}
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                      {reservations.filter(r => r.status === 'pending').length} en attente
                    </span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white p-5 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-3">
                  <h5 className="font-serif text-base font-semibold text-[#3A2F29]">
                    Actions Rapides
                  </h5>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => { setActiveTab('prestations'); setIsAddingService(true); }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D5C3] text-xs font-medium text-[#3A2F29] hover:bg-[#F2ECE1] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#B08247]" />
                      <span>Ajouter une prestation</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('tarifs'); }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D5C3] text-xs font-medium text-[#3A2F29] hover:bg-[#F2ECE1] transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 text-[#B08247]" />
                      <span>Modifier un prix</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('galerie'); setIsAddingPhoto(true); }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D5C3] text-xs font-medium text-[#3A2F29] hover:bg-[#F2ECE1] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#B08247]" />
                      <span>Publier une photo</span>
                    </button>
                  </div>
                </div>

                {/* Booking Requests Inbox */}
                <div className="bg-white p-5 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-base font-semibold text-[#3A2F29]">
                        Demandes de Rendez-vous ({reservations.length})
                      </h5>
                      <p className="text-xs text-[#8C7A70] font-light">
                        Demandes envoyées via le formulaire du site web.
                      </p>
                    </div>
                  </div>

                  {reservations.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#8C7A70] bg-[#FAF7F2] rounded-xl border border-dashed border-[#E0D5C3]">
                      Aucune demande de réservation enregistrée pour le moment.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reservations.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-[#EFE8DD] bg-[#FAF7F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-[#3A2F29]">{item.fullName}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                item.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.status === 'confirmed' ? 'Confirmé' : item.status === 'cancelled' ? 'Annulé' : 'En attente'}
                              </span>
                            </div>
                            <div className="text-xs text-[#6B5A50] flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span><strong>Soin :</strong> {item.service}</span>
                              <span><strong>Date :</strong> {item.preferredDate} à {item.preferredTime}</span>
                              <span><strong>Tél :</strong> {item.phoneNumber}</span>
                            </div>
                            {item.notes && (
                              <p className="text-[11px] text-[#8C7A70] italic">
                                Note : {item.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <a
                              href={`https://wa.me/${item.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Bonjour ${item.fullName}, c'est Glow by Rim au sujet de votre demande de rendez-vous pour ${item.service} le ${item.preferredDate} à ${item.preferredTime}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Répondre WhatsApp</span>
                            </a>

                            {item.status === 'pending' && (
                              <button
                                onClick={() => updateReservationStatus(item.id, 'confirmed')}
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E0D5C3] text-xs text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Marquer comme confirmé"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setDeleteModal({
                                  isOpen: true,
                                  title: 'Supprimer cette demande',
                                  description: `Voulez-vous supprimer la demande de ${item.fullName} ?`,
                                  onConfirm: async () => {
                                    await deleteReservation(item.id);
                                    showToast('Demande supprimée.');
                                  },
                                });
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PRESTATIONS */}
            {activeTab === 'prestations' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                      Gestion des Prestations
                    </h4>
                    <p className="text-xs text-[#6B5A50] font-light">
                      Ajoutez, modifiez, masquez ou réorganisez les soins du salon.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsAddingService(true);
                      setEditingServiceId(null);
                      setServiceForm({
                        title: '',
                        categoryId: categories[0]?.id || 'coiffure',
                        price: '50 DHS',
                        duration: '45 min',
                        description: '',
                        isPopular: false,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4A3E39] transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#DFBD7F]" />
                    <span>Nouvelle Prestation</span>
                  </button>
                </div>

                {/* Add/Edit Service Modal or Card */}
                {(isAddingService || editingServiceId) && (
                  <div className="bg-white p-5 rounded-2xl border-2 border-[#DFBD7F] shadow-md space-y-4 animate-in fade-in-50">
                    <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                      <h5 className="font-serif text-base font-bold text-[#3A2F29]">
                        {editingServiceId ? 'Modifier la prestation' : 'Ajouter une nouvelle prestation'}
                      </h5>
                      <button
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingServiceId(null);
                          setServiceForm({});
                        }}
                        className="text-[#8C7A70] hover:text-[#3A2F29]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Nom du soin *
                        </label>
                        <input
                          type="text"
                          value={serviceForm.title || ''}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          placeholder="Ex: Pose vernis semi-permanent"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={serviceForm.categoryId || categories[0]?.id}
                          onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Tarif officiel *
                        </label>
                        <input
                          type="text"
                          value={serviceForm.price || ''}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          placeholder="Ex: 50 DHS ou Sur demande"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Durée indicative
                        </label>
                        <input
                          type="text"
                          value={serviceForm.duration || ''}
                          onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                          placeholder="Ex: 30 min, 1h, 1h30"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Description courte
                        </label>
                        <input
                          type="text"
                          value={serviceForm.description || ''}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          placeholder="Ex: Soin complet avec limage, cuticules et hydratation profonde"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPopular"
                          checked={!!serviceForm.isPopular}
                          onChange={(e) => setServiceForm({ ...serviceForm, isPopular: e.target.checked })}
                          className="rounded border-[#E0D5C3] text-[#B08247] focus:ring-[#B08247]"
                        />
                        <label htmlFor="isPopular" className="text-xs text-[#3A2F29]">
                          Mettre en avant comme "Coup de cœur / Populaire"
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingServiceId(null);
                        }}
                        className="px-4 py-2 rounded-xl border border-[#E0D5C3] text-xs text-[#6B5A50] hover:bg-[#FAF7F2]"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveService}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39] transition-colors"
                      >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer la prestation'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Services List grouped by Category */}
                <div className="space-y-5">
                  {categories.map((cat) => {
                    const catServices = services.filter((s) => s.categoryId === cat.id);
                    return (
                      <div key={cat.id} className="bg-white p-5 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
                          <h5 className="font-serif text-base font-bold text-[#3A2F29]">
                            {cat.name} ({catServices.length})
                          </h5>
                          <span className="text-[11px] text-[#8C7A70]">{cat.description}</span>
                        </div>

                        {catServices.length === 0 ? (
                          <div className="text-xs text-[#8C7A70] italic py-2">
                            Aucune prestation dans cette catégorie.
                          </div>
                        ) : (
                          <div className="divide-y divide-[#F2ECE1]">
                            {catServices.map((srv) => (
                              <div
                                key={srv.id}
                                className="py-2.5 flex items-center justify-between gap-3 text-xs"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#3A2F29]">{srv.title}</span>
                                    {srv.isPopular && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                                        Populaire
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#8C7A70] font-light">
                                    {srv.description || srv.duration}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-serif font-bold text-[#3A2F29]">
                                    {srv.price}
                                  </span>

                                  <button
                                    onClick={() => {
                                      setEditingServiceId(srv.id);
                                      setServiceForm(srv);
                                      setIsAddingService(false);
                                    }}
                                    className="p-1.5 text-[#8C7A70] hover:text-[#3A2F29] rounded-lg hover:bg-[#FAF7F2]"
                                    title="Modifier"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setDeleteModal({
                                        isOpen: true,
                                        title: 'Supprimer la prestation',
                                        description: `Êtes-vous sûr de vouloir supprimer "${srv.title}" ?`,
                                        onConfirm: async () => {
                                          await deleteService(srv.id);
                                          showToast('Prestation supprimée.');
                                        },
                                      });
                                    }}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. TARIFS RAPIDES */}
            {activeTab === 'tarifs' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                    Gestion Rapide des Tarifs
                  </h4>
                  <p className="text-xs text-[#6B5A50] font-light">
                    Mettez à jour directement les prix en Dirhams (DHS) ou basculez en « Sur demande » d'un seul clic.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#EFE8DD] shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#FAF7F2] border-b border-[#EFE8DD] flex items-center justify-between text-xs font-medium text-[#6B5A50]">
                    <span>Prestation</span>
                    <span>Tarif actuel & modification instantanée</span>
                  </div>

                  <div className="divide-y divide-[#F2ECE1]">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#FAF7F2]/50 transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-[#3A2F29]">{srv.title}</span>
                          <span className="text-[11px] text-[#8C7A70] block">
                            Catégorie : {srv.categoryName} • Durée : {srv.duration || 'Variable'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={srv.price}
                            onBlur={(e) => {
                              if (e.target.value !== srv.price) {
                                handleQuickPriceUpdate(srv.id, e.target.value);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#E0D5C3] text-xs font-mono font-medium text-[#3A2F29] w-32 bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B08247]"
                          />

                          <button
                            onClick={() => handleQuickPriceUpdate(srv.id, 'Sur demande')}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E0D5C3] text-[11px] text-[#6B5A50] hover:bg-[#FAF7F2] transition-colors"
                            title="Indiquer Sur demande"
                          >
                            Sur demande
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. GALERIE */}
            {activeTab === 'galerie' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                      Galerie Photos du Salon
                    </h4>
                    <p className="text-xs text-[#6B5A50] font-light">
                      Téléversez des photos depuis votre smartphone ou votre ordinateur avec aperçu immédiat.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingPhoto(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4A3E39] transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#DFBD7F]" />
                    <span>Ajouter une photo</span>
                  </button>
                </div>

                {/* Upload Modal / Form */}
                {isAddingPhoto && (
                  <div className="bg-white p-5 rounded-2xl border-2 border-[#DFBD7F] shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                      <h5 className="font-serif text-base font-bold text-[#3A2F29]">
                        Publier une nouvelle photo
                      </h5>
                      <button onClick={() => setIsAddingPhoto(false)} className="text-[#8C7A70] hover:text-[#3A2F29]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Photo File Picker & Preview */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1.5">
                          Sélectionner la photo depuis le téléphone / PC
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#DFBD7F] rounded-2xl p-6 text-center cursor-pointer hover:bg-[#FAF7F2] transition-colors flex flex-col items-center justify-center gap-2"
                        >
                          {photoForm.imageUrl ? (
                            <div className="relative group">
                              <img
                                src={photoForm.imageUrl}
                                alt="Aperçu"
                                className="w-40 h-40 object-cover rounded-xl shadow-md border border-[#E0D5C3]"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                                Changer l'image
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#B08247]">
                                <Upload className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-medium text-[#3A2F29]">
                                Cliquez pour choisir une photo ou prendre une photo
                              </span>
                              <span className="text-[11px] text-[#8C7A70]">
                                Formats acceptés : JPG, PNG, WEBP
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Titre de la photo *
                        </label>
                        <input
                          type="text"
                          value={photoForm.title}
                          onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                          placeholder="Ex: Manucure Russe Nude"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Catégorie de la galerie *
                        </label>
                        <select
                          value={photoForm.category}
                          onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none"
                        >
                          <option value="salon">Le Salon & Cocon</option>
                          <option value="ongles">Manucure & Ongles</option>
                          <option value="pedicure">Pédicure Spa</option>
                          <option value="coiffure">Coiffure & Brushing</option>
                          <option value="soins">Soins & Cabine</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Description courte (optionnelle)
                        </label>
                        <input
                          type="text"
                          value={photoForm.description}
                          onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                          placeholder="Ex: Pose complète en gel avec finition brillante"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsAddingPhoto(false)}
                        className="px-4 py-2 rounded-xl border border-[#E0D5C3] text-xs text-[#6B5A50]"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSavePhoto}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39]"
                      >
                        {isSaving ? 'Publication...' : 'Publier la photo'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid of existing photos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-2xl border border-[#EFE8DD] overflow-hidden group shadow-xs relative"
                    >
                      <div className="aspect-square relative overflow-hidden bg-[#FAF7F2]">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={() => {
                            setDeleteModal({
                              isOpen: true,
                              title: 'Supprimer cette photo',
                              description: `Supprimer "${photo.title}" de la galerie ?`,
                              onConfirm: async () => {
                                await deleteGalleryItem(photo.id);
                                showToast('Photo retirée.');
                              },
                            });
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2.5">
                        <span className="text-[10px] uppercase font-semibold text-[#B08247] block">
                          {photo.categoryLabel || photo.category}
                        </span>
                        <span className="text-xs font-semibold text-[#3A2F29] truncate block">
                          {photo.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. HORAIRES */}
            {activeTab === 'horaires' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                    Horaires d'Ouverture du Salon
                  </h4>
                  <p className="text-xs text-[#6B5A50] font-light">
                    Définissez les créneaux d'accueil de vos clientes à Casablanca.
                  </p>
                </div>

                {/* Live Casablanca status card */}
                <div className="bg-white p-5 rounded-2xl border border-[#EFE8DD] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B08247]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] block font-medium">
                        Aperçu en direct (Heure de Casablanca)
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-sm text-[#3A2F29]">
                          Aujourd'hui : {currentOpenStatus.todayDayName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          currentOpenStatus.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentOpenStatus.statusText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-[#6B5A50]">
                    {currentOpenStatus.nextOpenText}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Lundi à Samedi
                      </label>
                      <input
                        type="text"
                        value={formSettings.hoursMonSat}
                        onChange={(e) => setFormSettings({ ...formSettings, hoursMonSat: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs font-mono bg-[#FAF7F2]"
                      />
                      <span className="text-[11px] text-[#8C7A70] mt-1 block">
                        Par défaut : 10:00 – 20:00
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Dimanche
                      </label>
                      <input
                        type="text"
                        value={formSettings.hoursSun}
                        onChange={(e) => setFormSettings({ ...formSettings, hoursSun: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs font-mono bg-[#FAF7F2]"
                      />
                      <span className="text-[11px] text-[#8C7A70] mt-1 block">
                        Par défaut : 11:00 – 20:00
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE1] flex justify-end">
                    <button
                      onClick={() => handleSaveSettings()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39] transition-colors"
                    >
                      <Save className="w-4 h-4 text-[#DFBD7F]" />
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les horaires'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. AVIS CLIENTS */}
            {activeTab === 'avis' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                      Témoignages & Avis Vérifiés
                    </h4>
                    <p className="text-xs text-[#6B5A50] font-light">
                      Gérez les citations et retours clientes affichés sur la page d'accueil.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingReview(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4A3E39] transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#DFBD7F]" />
                    <span>Ajouter un avis</span>
                  </button>
                </div>

                {isAddingReview && (
                  <div className="bg-white p-5 rounded-2xl border-2 border-[#DFBD7F] shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
                      <h5 className="font-serif text-base font-bold text-[#3A2F29]">
                        Ajouter un témoignage client
                      </h5>
                      <button onClick={() => setIsAddingReview(false)} className="text-[#8C7A70] hover:text-[#3A2F29]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Prénom & Nom de la cliente *
                        </label>
                        <input
                          type="text"
                          value={reviewForm.authorName}
                          onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                          placeholder="Ex: Yasmine B."
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Soin reçu (tag)
                        </label>
                        <input
                          type="text"
                          value={reviewForm.serviceTag}
                          onChange={(e) => setReviewForm({ ...reviewForm, serviceTag: e.target.value })}
                          placeholder="Ex: Manucure & Brushing"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                          Texte du retour client *
                        </label>
                        <textarea
                          rows={3}
                          value={reviewForm.text}
                          onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                          placeholder="Ex: Très bel accueil, thé délicieux et manucure parfaite !"
                          className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsAddingReview(false)}
                        className="px-4 py-2 rounded-xl border border-[#E0D5C3] text-xs text-[#6B5A50]"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveReview}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39]"
                      >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-white rounded-2xl border border-[#EFE8DD] shadow-xs flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#3A2F29]">{rev.authorName}</span>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          {rev.serviceTag && (
                            <span className="text-[10px] bg-[#FAF7F2] border border-[#E0D5C3] px-1.5 py-0.5 rounded text-[#6B5A50]">
                              {rev.serviceTag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B5A50] italic font-light">"{rev.text}"</p>
                      </div>

                      <button
                        onClick={() => {
                          setDeleteModal({
                            isOpen: true,
                            title: 'Supprimer ce témoignage',
                            description: `Supprimer le retour de ${rev.authorName} ?`,
                            onConfirm: async () => {
                              await deleteReview(rev.id);
                              showToast('Avis supprimé.');
                            },
                          });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. PERSONNALISATION */}
            {activeTab === 'personnalisation' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                    Personnalisation du Site Web
                  </h4>
                  <p className="text-xs text-[#6B5A50] font-light">
                    Adaptez le titre, le message d'accueil et le logo de Glow by Rim.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Nom de marque
                    </label>
                    <input
                      type="text"
                      value={formSettings.salonName}
                      onChange={(e) => setFormSettings({ ...formSettings, salonName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Slogan d'accueil (Hero)
                    </label>
                    <input
                      type="text"
                      value={formSettings.heroTagline}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Texte de présentation
                    </label>
                    <textarea
                      rows={3}
                      value={formSettings.heroDescription}
                      onChange={(e) => setFormSettings({ ...formSettings, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Bandeau d'annonce (Haut du site)
                    </label>
                    <input
                      type="text"
                      value={formSettings.announcement}
                      onChange={(e) => setFormSettings({ ...formSettings, announcement: e.target.value })}
                      placeholder="Ex: Thé marocain & dattes fraîches offerts à chaque rendez-vous"
                      className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                      Style du Logo
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-[#3A2F29]">
                        <input
                          type="radio"
                          name="logoType"
                          value="typography"
                          checked={formSettings.logoType === 'typography'}
                          onChange={() => setFormSettings({ ...formSettings, logoType: 'typography' })}
                        />
                        Logo Typographique Elégant (Glow by Rim)
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#3A2F29]">
                        <input
                          type="radio"
                          name="logoType"
                          value="image"
                          checked={formSettings.logoType === 'image'}
                          onChange={() => setFormSettings({ ...formSettings, logoType: 'image' })}
                        />
                        Image officielle du logo
                      </label>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE1] flex justify-end">
                    <button
                      onClick={() => handleSaveSettings()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39] transition-colors"
                    >
                      <Save className="w-4 h-4 text-[#DFBD7F]" />
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la personnalisation'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. PARAMETRES */}
            {activeTab === 'parametres' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3A2F29]">
                    Paramètres & Coordonnées
                  </h4>
                  <p className="text-xs text-[#6B5A50] font-light">
                    Numéros WhatsApp, adresse à Casablanca et configuration cloud.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-4">
                  <h5 className="font-serif text-base font-semibold text-[#3A2F29]">
                    Coordonnées Officielles
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Numéro WhatsApp Officiel *
                      </label>
                      <input
                        type="text"
                        value={formSettings.whatsapp}
                        onChange={(e) => setFormSettings({ ...formSettings, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs font-mono bg-[#FAF7F2]"
                      />
                      <span className="text-[11px] text-[#8C7A70] mt-1 block">
                        Format international : +212 669 33 05 54
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Téléphone Appels
                      </label>
                      <input
                        type="text"
                        value={formSettings.phone}
                        onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs font-mono bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Adresse du Salon
                      </label>
                      <input
                        type="text"
                        value={formSettings.address}
                        onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Compte Instagram
                      </label>
                      <input
                        type="text"
                        value={formSettings.instagram}
                        onChange={(e) => setFormSettings({ ...formSettings, instagram: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3A2F29] mb-1">
                        Email Administrateur Autorisé
                      </label>
                      <input
                        type="email"
                        value={formSettings.adminEmail}
                        onChange={(e) => setFormSettings({ ...formSettings, adminEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E0D5C3] text-xs bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2ECE1] flex justify-end">
                    <button
                      onClick={() => handleSaveSettings()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3A2F29] text-[#FAF7F2] text-xs font-medium hover:bg-[#4A3E39] transition-colors"
                    >
                      <Save className="w-4 h-4 text-[#DFBD7F]" />
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les coordonnées'}</span>
                    </button>
                  </div>
                </div>

                {/* Cloud & Reset Section */}
                <div className="bg-white p-5 rounded-2xl border border-[#EFE8DD] shadow-xs space-y-3">
                  <h5 className="font-serif text-base font-semibold text-[#3A2F29]">
                    Infrastructure & Réinitialisation
                  </h5>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E0D5C3] text-xs text-[#6B5A50] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Projet Firebase :</span>
                      <span className="font-mono text-[#3A2F29]">gen-lang-client-0813330945</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Base de données Firestore :</span>
                      <span className="font-mono text-emerald-700">Connectée & Active</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setDeleteModal({
                          isOpen: true,
                          title: 'Réinitialiser toutes les données',
                          description:
                            'Voulez-vous restaurer les données officielles du flyer Glow by Rim (tarifs officiels 50 DHS vernis, 130 DHS coupe, 50 DHS brushing) ?',
                          onConfirm: async () => {
                            await resetToDefaultData();
                            showToast('Données restaurées aux tarifs officiels !');
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium hover:bg-rose-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurer les données officielles d'origine</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-[#EFE8DD] animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-serif font-bold text-[#3A2F29] text-base">
                  {deleteModal.title}
                </h5>
              </div>
            </div>

            <p className="text-xs text-[#6B5A50] leading-relaxed">
              {deleteModal.description}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                className="px-3.5 py-2 rounded-xl border border-[#E0D5C3] text-xs text-[#6B5A50] hover:bg-[#FAF7F2]"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  await deleteModal.onConfirm();
                  setDeleteModal({ ...deleteModal, isOpen: false });
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
