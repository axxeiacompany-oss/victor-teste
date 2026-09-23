import React from 'react';
import { 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Car, 
  Calendar, 
  Settings, 
  Clock, 
  Sparkles,
  Award,
  Crown
} from 'lucide-react';
import { AppLanguage, WorkshopInfo } from '../types';

interface NavbarProps {
  workshopInfo: WorkshopInfo;
  activeTab: 'chat' | 'inspector' | 'booking' | 'insurance' | 'services';
  setActiveTab: (tab: 'chat' | 'inspector' | 'booking' | 'insurance' | 'services') => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  workshopInfo,
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenSettings,
}) => {
  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');
  const isPt = language === 'pt';

  return (
    <header className="sticky top-0 z-40 bg-[#090b0e]/95 backdrop-blur-md border-b border-[#292215] text-white shadow-2xl">
      {/* Top micro-bar for VIP concierge & Status */}
      <div className="bg-[#050608] px-4 py-1.5 text-[11px] border-b border-[#1c1811] flex flex-wrap justify-between items-center text-slate-400 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-serif-luxury tracking-widest uppercase text-[10px]">
              {isPt ? 'Atelier Oficial Aberto' : 'Atelier Oficial Abierto'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">{workshopInfo.hours.split('|')[0] || '07:30 - 18:00 hs'}</span>
          </span>
          <span className="hidden sm:inline-block text-slate-700">·</span>
          <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3 text-amber-500/70" />
            <span>{workshopInfo.city}</span>
          </span>
          <span className="hidden md:inline-block text-slate-700">·</span>
          <span className="hidden md:flex items-center gap-1.5 text-amber-400/90 font-medium">
            <Award className="w-3 h-3 text-amber-400" />
            <span>{isPt ? '12 Meses de Garantia Certificada' : '12 Meses de Garantía Certificada'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language selector toggle */}
          <div className="flex items-center bg-[#13161c] border border-[#2e2619] rounded-lg p-0.5 text-[11px] font-semibold">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-0.5 rounded transition ${
                !isPt ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Español (Alta Gama)"
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-0.5 rounded transition ${
                isPt ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Português"
            >
              PT
            </button>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-amber-300 bg-[#161920] hover:bg-[#1f242d] border border-slate-800 px-2 py-0.5 rounded transition"
            title={isPt ? 'Configurar dados do atelier' : 'Personalizar datos del atelier'}
          >
            <Settings className="w-3 h-3 text-amber-400" />
            <span>{isPt ? 'Configuração' : 'Configuración'}</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand with Gold Crest */}
        <div 
          onClick={() => setActiveTab('chat')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#262013] via-[#17140e] to-[#0d0b08] flex items-center justify-center shadow-lg shadow-amber-950/30 group-hover:scale-105 transition-transform border border-amber-500/30">
            <Crown className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury font-bold text-base sm:text-lg tracking-wider text-white leading-tight">
                {workshopInfo.name}
              </h1>
              <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {isPt ? 'Alta Gama' : 'Alta Gama'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-light tracking-wide mt-0.5">
              {workshopInfo.slogan}
            </p>
          </div>
        </div>

        {/* Action Button: VIP WhatsApp Concierge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              isPt
                ? `Olá ${workshopInfo.name}, estou entrando em contato pelo assistente web de alta gama para consultar sobre serviços de funilaria e pintura.`
                : `Estimado equipo de ${workshopInfo.name}, me comunico a través del servicio exclusivo de concierge para consultar por un trabajo de chapa y pintura de alta gama.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-medium px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/50 border border-emerald-500/30 transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline text-xs font-serif-luxury tracking-wider">{isPt ? 'WhatsApp VIP:' : 'Concierge VIP:'}</span>
            <span className="font-semibold text-xs">{workshopInfo.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs (Luxury styling) */}
      <div className="bg-[#0b0e12]/90 border-t border-[#201a11] px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition whitespace-nowrap font-medium ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#171b22] hover:text-amber-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isPt ? 'Conserje Virtual (Chat)' : 'Conserje Virtual (Chat)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition whitespace-nowrap font-medium ${
              activeTab === 'inspector'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#171b22] hover:text-amber-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{isPt ? 'Inspetor de Danos & Fotos' : 'Peritaje de Daños & Fotos'}</span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition whitespace-nowrap font-medium ${
              activeTab === 'booking'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#171b22] hover:text-amber-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isPt ? 'Agendar Cita Privada' : 'Agendar Cita en Atelier'}</span>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition whitespace-nowrap font-medium ${
              activeTab === 'insurance'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#171b22] hover:text-amber-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isPt ? 'Sinistros & Seguradoras' : 'Siniestros & Aseguradoras'}</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition whitespace-nowrap font-medium ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#171b22] hover:text-amber-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPt ? 'Maestria & Instalações' : 'Maestría & Instalaciones'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
