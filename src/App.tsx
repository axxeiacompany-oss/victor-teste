/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatInterface } from './components/ChatInterface';
import { DamageInspector } from './components/DamageInspector';
import { BookingView } from './components/BookingView';
import { InsuranceView } from './components/InsuranceView';
import { ServicesView } from './components/ServicesView';
import { WorkshopSettingsModal } from './components/WorkshopSettingsModal';
import { Footer } from './components/Footer';
import { DEFAULT_WORKSHOP_INFO } from './data/workshopDefaults';
import { AppLanguage, WorkshopInfo } from './types';
import { Phone, Crown } from 'lucide-react';

export default function App() {
  const [workshopInfo, setWorkshopInfo] = useState<WorkshopInfo>(() => {
    try {
      const saved = localStorage.getItem('workshop_info_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading workshop info from localStorage:', e);
    }
    return DEFAULT_WORKSHOP_INFO;
  });

  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const savedLang = localStorage.getItem('workshop_lang');
      if (savedLang === 'es' || savedLang === 'pt') return savedLang;
    } catch (e) {
      console.error('Error reading language:', e);
    }
    return 'es'; // Default to Spanish per user request: "em espanhol quero que seja luxuso"
  });

  const [activeTab, setActiveTab] = useState<'chat' | 'inspector' | 'booking' | 'insurance' | 'services'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('workshop_info_v2', JSON.stringify(workshopInfo));
    } catch (e) {
      console.error('Error saving workshop info to localStorage:', e);
    }
  }, [workshopInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('workshop_lang', language);
    } catch (e) {
      console.error('Error saving language:', e);
    }
  }, [language]);

  const isPt = language === 'pt';
  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[#080a0d] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        workshopInfo={workshopInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-2 sm:px-4 py-2">
        {activeTab === 'chat' && (
          <ChatInterface
            workshopInfo={workshopInfo}
            language={language}
            onNavigateToBooking={() => setActiveTab('booking')}
            onNavigateToInspector={() => setActiveTab('inspector')}
            onNavigateToInsurance={() => setActiveTab('insurance')}
          />
        )}

        {activeTab === 'inspector' && (
          <DamageInspector
            workshopInfo={workshopInfo}
            language={language}
            onNavigateToBooking={() => setActiveTab('booking')}
          />
        )}

        {activeTab === 'booking' && (
          <BookingView
            workshopInfo={workshopInfo}
            language={language}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'insurance' && (
          <InsuranceView
            workshopInfo={workshopInfo}
            language={language}
            onNavigateToBooking={() => setActiveTab('booking')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            workshopInfo={workshopInfo}
            language={language}
            onNavigateToBooking={() => setActiveTab('booking')}
          />
        )}
      </main>

      {/* Floating VIP WhatsApp Concierge Button */}
      <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-5 right-5 z-30">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            isPt
              ? `Olá ${workshopInfo.name}, estou entrando em contato através do atendimento concierge de alta gama.`
              : `Estimado equipo de ${workshopInfo.name}, me comunico a través del servicio de Concierge VIP para una consulta pericial de carrocería y pintura.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition group border border-emerald-400/40"
          title={`WhatsApp Concierge (${workshopInfo.whatsapp})`}
        >
          <Phone className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-serif-luxury tracking-wider">
            {isPt ? 'Concierge WhatsApp:' : 'Concierge VIP:'} {workshopInfo.whatsapp}
          </span>
        </a>
      </aside>

      {/* Footer */}
      <Footer
        workshopInfo={workshopInfo}
        language={language}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Workshop Settings Customizer Modal */}
      <WorkshopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workshopInfo={workshopInfo}
        language={language}
        onSave={(newInfo) => setWorkshopInfo(newInfo)}
      />
    </div>
  );
}
