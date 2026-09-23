import React from 'react';
import { 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Flame, 
  Eye, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Phone,
  Layers,
  Crown
} from 'lucide-react';
import { AppLanguage, WorkshopInfo } from '../types';

interface ServicesViewProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToBooking: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  workshopInfo,
  language,
  onNavigateToBooking,
}) => {
  const isEn = language === 'en';
  const isPt = language === 'pt';
  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');

  const detailedServices = isEn
    ? [
        {
          title: 'Oven-Baked Paint in Sterile Pressurized Spray Booth',
          desc: 'Sterile atmosphere with molecular particulate filtration and thermal infrared curing. Premium PPG and Glasurit lacquers yielding a mirror-like finish meeting dealership showroom standards.',
          icon: <Flame className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Artisan PDR (Paintless Dent Repair)',
          desc: 'Goldsmith precision manual technique for removing dents and hail damage without body filler or repainting, preserving original factory OEM virgin clear coat.',
          icon: <Wrench className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Computerized Spectrophotometer Colorimetry',
          desc: 'Molecular optical reading of vehicle hue keyed to manufacturer VIN code, guaranteeing a seamless chromatic match indistinguishable from factory paint.',
          icon: <Eye className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Laser Unibody & Chassis Frame Alignment',
          desc: 'Millimeter restoration of geometric suspension coordinates and structural frame points post-collision, restoring certified crash safety integrity.',
          icon: <Layers className="w-5 h-5 text-amber-400" />,
        },
        {
          title: '9H Ceramic Glass Coating & Concours Detailing',
          desc: 'Nanoscale hydrophobic paint shield offering extreme chemical and UV protection that enhances gloss depth and prevents micro-swirls.',
          icon: <Sparkles className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Comprehensive Insurance Claim Management',
          desc: 'Specialized support for insurance claims with authorized genuine OEM replacement parts, documented photo dossiers, and written 12-month warranty.',
          icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
        },
      ]
    : isPt
    ? [
        {
          title: 'Pintura Térmica em Estufa Pressurizada',
          desc: 'Ambiente estéril com controle térmico e fluxo laminar computadorizado. Vernizes PPG e Glasurit com acabamento espelhado idêntico ao de fábrica.',
          icon: <Flame className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Martelinho Artesanal PDR (Sem Pintura)',
          desc: 'Técnica de precisão manual para remoção de amassados e granizo sem danificar a laca e pintura original de fábrica do veículo.',
          icon: <Wrench className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Colorimetria Digital Espectrofotométrica',
          desc: 'Leitura óptica molecular da tonalidade real do veículo pelo código VIN do fabricante, eliminando qualquer diferença visual de cor.',
          icon: <Eye className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Alinhamento e Estiramento a Laser de Chassi',
          desc: 'Recuperação milimétrica de cotas geométricas de suspensão e monobloco pós-impacto, devolvendo a segurança estrutural homologada.',
          icon: <Layers className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Vitrificação Cerâmica 9H & Detailing',
          desc: 'Proteção nanométrica da pintura contra raios UV, contaminação industrial e micro-riscos com hidrorrepelência extrema.',
          icon: <Sparkles className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Gestão Pericial de Sinistros & Seguros',
          desc: 'Atendimento integral com as principais seguradoras do mercado, laudo fotográfico e garantia certificada de 12 meses por escrito.',
          icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
        },
      ]
    : [
        {
          title: 'Pintura al Horno en Cabina Presurizada de Atmósfera Estéril',
          desc: 'Ambiente controlado con filtrado molecular de partículas y secado térmico infrarrojo. Lacas PPG y Glasurit con brillo espejo idéntico al estándar de exposición de concesionario.',
          icon: <Flame className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Desabollado Artesanal PDR (Paintless Dent Repair)',
          desc: 'Técnica orfebre de precisión para desabollado de impactos leves o granizo sin necesidad de masillar ni pintar, conservando intacta la laca virgen de fábrica.',
          icon: <Wrench className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Laboratorio Espectrofotométrico Computarizado',
          desc: 'Lectura molecular del tono real de la carrocería por código VIN original del fabricante, logrando una igualación cromática indistinguible de la original.',
          icon: <Eye className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Banco Láser de Cuadratura & Calibración de Chasis',
          desc: 'Restitución milimétrica de cotas geométricas de monobloque y anclajes estructurales, preservando los estándares de seguridad pasiva del fabricante.',
          icon: <Layers className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Tratamiento Cerámico 9H & Detailing de Exhibición',
          desc: 'Sellado hidrofóbico nanométrico de alta resistencia química y UV que realza la profundidad del color y protege la laca de contaminantes.',
          icon: <Sparkles className="w-5 h-5 text-amber-400" />,
        },
        {
          title: 'Gestión Pericial Integral de Siniestros',
          desc: 'Asistencia especializada para peritajes de compañías de seguros con piezas genuinas homologadas y garantía certificada por escrito.',
          icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
        },
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-serif-luxury flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Cutting-Edge Technology & Master Craft' : isPt ? 'Tecnologia de Ponta & Alta Precisão' : 'Instalaciones de Atelier & Maestría Artesanal'}</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-serif-luxury text-white tracking-wide">
            {isEn ? 'Technical Mastery & Bodywork Facilities' : isPt ? 'Infraestrutura & Maestria Técnica' : 'Maestría Técnica & Tecnología de Carrocería'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            {isEn
              ? 'We combine state-of-the-art pressurized spray booths, digital spectrophotometry, and master artisan craftsmanship to ensure concourse-grade finishes on luxury vehicles.'
              : isPt
              ? 'Conjugamos tecnologia de última geração em estufas pressurizadas, espectrofotometria digital e técnicas artesanais para entregar resultados de nível de concurso.'
              : 'Combinamos tecnología de cabina presurizada alemana, espectrofotometría computarizada y mano de obra pericial para garantizar acabados de exposición en vehículos de alta gama.'}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailedServices.map((serv, idx) => (
          <div
            key={idx}
            className="bg-[#0b0e13] border border-[#221c12] hover:border-amber-500/40 p-5 rounded-2xl flex flex-col justify-between space-y-3 transition shadow-xl group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#141822] group-hover:bg-amber-500/15 border border-[#262016] group-hover:border-amber-500/40 flex items-center justify-center transition">
                {serv.icon}
              </div>
              <h3 className="font-bold text-white text-sm font-serif-luxury tracking-wide group-hover:text-amber-200 transition">
                {serv.title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                {serv.desc}
              </p>
            </div>
            <div className="pt-2 border-t border-[#1e1910] text-[11px] text-amber-400/80 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '12-Month certified warranty' : isPt ? 'Garantia oficial de 12 meses' : 'Garantía certificada de 12 meses'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Warranty Certificate Box */}
      <div className="bg-[#0b0e13] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#17140e] border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-950/40">
            <Award className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-serif-luxury">
              {isEn ? 'Official Atelier Pledge' : isPt ? 'Compromisso Oficial do Atelier' : 'Compromiso Pericial del Atelier'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
              {workshopInfo.warranty}
            </h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed max-w-xl">
              {isEn
                ? 'Every vehicle departing our atelier is accompanied by a written warranty certificate covering chemical clear coat bonding, showroom shine, and UV color durability.'
                : isPt
                ? 'Todos os serviços de funilaria e pintura contam com termo de garantia formal por escrito cobrindo aderência, brilho e durabilidade contra desbotamento.'
                : 'Cada vehículo retirado de nuestras instalaciones cuenta con certificado pericial por escrito que respalda la adherencia química de la laca, brillo de fábrica y durabilidad UV.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onNavigateToBooking}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 font-serif-luxury tracking-wider whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>{isEn ? 'Book Atelier Visit' : isPt ? 'Agendar Cita no Atelier' : 'Agendar Cita en Atelier'}</span>
          </button>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              isEn
                ? `Hello ${workshopInfo.name}, I would like to inquire further about technical warranties and procedures at your atelier.`
                : isPt
                ? `Olá ${workshopInfo.name}, gostaria de saber mais sobre as garantias e procedimentos técnicos da oficina.`
                : `Estimado equipo de ${workshopInfo.name}, deseo consultar detalles sobre los procedimientos técnicos y garantías de atelier.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-emerald-200" />
            <span>{isEn ? 'WhatsApp Concierge' : isPt ? 'WhatsApp do Atelier' : 'Concierge WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
