import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Phone, 
  Calendar, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  Building2,
  Crown,
  Award
} from 'lucide-react';
import { AppLanguage, WorkshopInfo } from '../types';

interface InsuranceViewProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToBooking: () => void;
}

export const InsuranceView: React.FC<InsuranceViewProps> = ({
  workshopInfo,
  language,
  onNavigateToBooking,
}) => {
  const isPt = language === 'pt';
  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');

  const steps = isPt
    ? [
        {
          step: '01',
          title: 'Registro de Sinistro na Seguradora',
          desc: 'Abra o chamado de sinistro junto à sua seguradora para obter o protocolo oficial.',
        },
        {
          step: '02',
          title: 'Peritagem Fotográfica no Atelier',
          desc: 'Técnicos seniores realizam a vistoria pericial computadorizada e registro de micragem.',
        },
        {
          step: '03',
          title: 'Orçamento Técnico Homologado',
          desc: 'Emitimos o laudo formal detalhado com peças originais para o perito regulador.',
        },
        {
          step: '04',
          title: 'Execução com Estufa Térmica',
          desc: 'Após aprovação, realizamos a funilaria e pintura ao forno com verniz de padrão de fábrica.',
        },
        {
          step: '05',
          title: 'Entrega com Garantia de 12 Meses',
          desc: 'Inspeção de colorimetria e entrega da unidade com certificado oficial de garantia.',
        },
      ]
    : [
        {
          step: '01',
          title: 'Denuncia del Siniestro',
          desc: 'Radique la denuncia ante su compañía de seguros para obtener su número oficial de siniestro.',
        },
        {
          step: '02',
          title: 'Inspección Pericial en Atelier',
          desc: 'Recepción del vehículo en cabina para toma fotográfica pericial de daños visibles y deformaciones ocultas.',
        },
        {
          step: '03',
          title: 'Presupuesto Computarizado Homologado',
          desc: 'Confeccionamos el presupuesto pericial formal con códigos de repuestos originales para el perito liquidador.',
        },
        {
          step: '04',
          title: 'Aprobación y Restauración al Horno',
          desc: 'Una vez autorizada la orden, ejecutamos el desabollado de precisión y pintura en cabina presurizada.',
        },
        {
          step: '05',
          title: 'Auditoría Final y Entrega con Garantía',
          desc: 'Comprobación espectrofotométrica de tono y entrega con certificado de 12 meses de garantía por escrito.',
        },
      ];

  const faqs = isPt
    ? [
        {
          q: 'Tenho o direito de escolher este atelier mesmo se a seguradora sugerir outro?',
          a: 'Sim. A legislação assegura o livre direito de escolha da oficina pelo segurado. Você pode optar pelo nosso atelier para garantir o padrão original do seu veículo.',
        },
        {
          q: 'O atelier cuida de todo o trâmite com o perito?',
          a: 'Sim. Confeccionamos a pasta pericial completa, orçamentação técnica e realizamos o alinhamento direto com o perito para agilizar a liberação.',
        },
        {
          q: 'Como é tratada a franquia do seguro?',
          a: 'A franquia da apólice (se aplicável) é quitada diretamente no atelier no momento da entrega do veículo 100% restaurado.',
        },
      ]
    : [
        {
          q: '¿Tengo derecho a elegir este atelier si mi aseguradora sugiere otro taller?',
          a: 'Absolutamente. Por ley de seguros, el asegurado posee el derecho irrestricto de libre elección del taller de su confianza para la reparación de su vehículo.',
        },
        {
          q: '¿El atelier gestiona el presupuesto y la inspección con el liquidador?',
          a: 'Sí. Nos encargamos de todo el dossier fotográfico, peritaje de cotas de chasis y contacto técnico directo con el perito para garantizar repuestos genuinos.',
        },
        {
          q: '¿Cómo se abona el deducible o franquicia?',
          a: 'En caso de que su póliza estipule deducible, el mismo se abona en nuestras oficinas al momento de retirar su vehículo completamente restaurado.',
        },
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner Luxury */}
      <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-serif-luxury flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              {isPt ? 'Gestão Pericial de Sinistros Premium' : 'Gestión Pericial de Siniestros & Seguros Todo Riesgo'}
            </span>
            <h2 className="text-xl sm:text-3xl font-bold font-serif-luxury text-white tracking-wide">
              {isPt ? 'Sinistros, Colisões & Seguradoras' : 'Gestión de Siniestros & Aseguradoras Premium'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
              {isPt
                ? 'Acompanhamos você desde a vistoria fotográfica até a liberação do reparo pela seguradora, com peças originais e pintura em estufa térmica de padrão oficial.'
                : 'Asistimos integralmente a propietarios de vehículos de alta gama en la gestión de siniestros, confección de carpetas periciales y ejecución en cabina presurizada con repuestos originales.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToBooking}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 font-serif-luxury tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>{isPt ? 'Agendar Peritagem' : 'Agendar Cita en Atelier'}</span>
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                isPt
                  ? `Olá ${workshopInfo.name}, preciso de orientação técnica para acionar o seguro do meu veículo.`
                  : `Estimado equipo de ${workshopInfo.name}, preciso asesoramiento pericial para gestionar un siniestro con mi aseguradora.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>{isPt ? 'WhatsApp do Perito' : 'Hablar con Perito VIP'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Insurance Badges */}
      <div className="bg-[#0b0e13] border border-[#221c12] rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-3.5 flex items-center gap-2 font-serif-luxury">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>{isPt ? 'Companhias de Seguros com as quais operamos' : 'Compañías Aseguradoras con Homologación Técnica'}</span>
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {workshopInfo.insurances.map((ins, idx) => (
            <span
              key={idx}
              className="bg-[#07090c] border border-[#262016] hover:border-amber-500/50 text-slate-200 text-xs px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{ins}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-[#0b0e13] border border-[#221c12] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white tracking-wide">
            {isPt ? 'Protocolo de Reparo por Sinistro' : 'Protocolo Pericial de Reparación por Siniestro'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-light">
            {isPt ? 'Garantia de agilidade técnica e preservação do valor de mercado' : 'Riguroso proceso técnico para garantizar celeridad pericial y restitución a estado de fábrica'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-[#07090c] border border-[#221c13] p-4 rounded-xl flex flex-col justify-between space-y-2.5 relative"
            >
              <span className="text-2xl font-black text-amber-500/30 font-serif-luxury">
                {st.step}
              </span>
              <h4 className="font-bold text-white text-xs sm:text-sm leading-snug font-serif-luxury tracking-wide">
                {st.title}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-[#0b0e13] border border-[#221c12] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold font-serif-luxury text-white flex items-center gap-2 tracking-wide">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>{isPt ? 'Perguntas Frequentes sobre Sinistros' : 'Preguntas Frecuentes sobre Siniestros & Coberturas'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#07090c] border border-[#221c13] p-5 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-300 text-xs sm:text-sm font-serif-luxury">
                {faq.q}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
