/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SalonProvider } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { ClientApprovalBanner } from './components/ClientApprovalBanner';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ReservationSection } from './components/ReservationSection';
import { ContactAndHours } from './components/ContactAndHours';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('');

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForBooking(serviceTitle);
  };

  return (
    <SalonProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#DFBD7F]/30 selection:text-[#1C1917] flex flex-col font-body pb-12 sm:pb-0">
        
        {/* Prototype Approval Notice */}
        <ClientApprovalBanner onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Navigation Bar */}
        <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* About / L'Univers Glow by Rim */}
          <About />

          {/* Services & Tarifs */}
          <ServicesSection onSelectServiceForBooking={handleSelectService} />

          {/* Filtered Photo Gallery */}
          <GallerySection />

          {/* Customer Reviews & Google Rating */}
          <ReviewsSection />

          {/* Reservation System (WhatsApp & Form) */}
          <ReservationSection preselectedService={selectedServiceForBooking} />

          {/* Contact, Opening Hours & Google Map */}
          <ContactAndHours />
        </main>

        {/* Footer */}
        <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Floating WhatsApp & Mobile Action Bar */}
        <FloatingWhatsApp />

        {/* Secure Admin Dashboard Modal */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    </SalonProvider>
  );
}
