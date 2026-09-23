import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Crown, Award } from 'lucide-react';
import { AppLanguage, WorkshopInfo } from '../types';

interface FooterProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToTab: (tab: 'chat' | 'inspector' | 'booking' | 'insurance' | 'services') => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  workshopInfo,
  language,
  onNavigateToTab,
  onOpenSettings,
}) => {
  const isPt = language === 'pt';
  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');

  return (
    <footer className="bg-[#050608] border-t border-[#231c12] text-slate-400 text-xs py-10 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Slogan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#2a2214] to-[#120f09] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm font-serif-luxury tracking-wide">
              {workshopInfo.name}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            {workshopInfo.slogan}. {isPt ? 'Restauração pericial de alta gama, cabine presurizada ao forno e 12 meses de garantia escrita.' : `Restauración pericial de alta gama, cabina presurizada al horno y garantía certificada por escrito de ${workshopInfo.warranty}.`}
          </p>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
            <Award className="w-4 h-4" />
            <span>{isPt ? 'Homologação com seguradoras de primeira linha' : 'Homologación técnica con aseguradoras de primera línea'}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif-luxury">
            {isPt ? 'Navegação do Atelier' : 'Navegación del Atelier'}
          </h4>
          <ul className="space-y-1.5 font-light">
            <li>
              <button
                onClick={() => onNavigateToTab('chat')}
                className="hover:text-amber-400 transition"
              >
                • {isPt ? 'Conserje Virtual (Chat)' : 'Conserje Técnico (Chat)'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToTab('inspector')}
                className="hover:text-amber-400 transition"
              >
                • {isPt ? 'Peritagem Fotográfica' : 'Peritaje Fotográfico Computarizado'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToTab('booking')}
                className="hover:text-amber-400 transition"
              >
                • {isPt ? 'Agendar Cita no Atelier' : 'Agendar Cita en Atelier'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToTab('insurance')}
                className="hover:text-amber-400 transition"
              >
                • {isPt ? 'Sinistros & Seguradoras' : 'Gestión de Siniestros & Seguros'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToTab('services')}
                className="hover:text-amber-400 transition"
              >
                • {isPt ? 'Maestria & Instalações' : 'Maestría & Instalaciones'}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif-luxury">
            {isPt ? 'Localização & Contato VIP' : 'Ubicación & Concierge'}
          </h4>
          <div className="space-y-2.5 text-xs font-light">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{workshopInfo.address}, {workshopInfo.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition font-medium"
              >
                WhatsApp VIP: {workshopInfo.whatsapp}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{workshopInfo.hours}</span>
            </div>
          </div>
        </div>

        {/* Administration & Config */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest font-serif-luxury">
            {isPt ? 'Personalização do Atelier' : 'Personalización'}
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            {isPt
              ? 'Deseja personalizar o nome do atelier, horários ou linha de WhatsApp VIP?'
              : '¿Desea personalizar la denominación del atelier, horarios o teléfono de atención VIP?'}
          </p>
          <button
            onClick={onOpenSettings}
            className="w-full bg-[#12161f] hover:bg-[#1a202c] text-amber-300 border border-[#2b2418] hover:border-amber-500/50 font-medium py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-sm font-serif-luxury tracking-wide"
          >
            <span>{isPt ? 'Configurar Atelier' : 'Configurar Atelier'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1a1710] flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 font-light">
        <p>© {new Date().getFullYear()} {workshopInfo.name} — {isPt ? 'Atelier de Funilaria & Pintura de Alta Gama.' : 'Atelier Oficial de Carrocería & Pintura de Alta Gama.'}</p>
        <p className="flex items-center gap-1 text-[11px] text-amber-400/80">
          <span>{isPt ? '12 meses de garantia certificada por escrito' : '12 meses de garantía certificada por escrito'}</span>
        </p>
      </div>
    </footer>
  );
};
