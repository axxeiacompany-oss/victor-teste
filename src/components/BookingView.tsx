import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  FileCheck,
  ArrowRight,
  Crown,
  Award
} from 'lucide-react';
import { AppLanguage, WorkshopInfo, AppointmentBooking } from '../types';

interface BookingViewProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToChat: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  workshopInfo,
  language,
  onNavigateToChat,
}) => {
  const isPt = language === 'pt';

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    carMake: '',
    carModel: '',
    carYear: '',
    plate: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '08:30 hs',
    serviceType: isPt ? 'Funilaria e pintura em estufa térmica de alta gama' : 'Pintura al horno en cabina presurizada de atmósfera estéril',
    hasInsurance: false,
    insuranceCompany: '',
    notes: '',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState<AppointmentBooking | null>(null);

  const availableSlots = [
    '08:00 hs (Prioritario)',
    '08:30 hs',
    '09:30 hs',
    '10:30 hs',
    '11:30 hs',
    '14:00 hs',
    '15:00 hs',
    '16:00 hs',
    '17:00 hs (Cierre privado)',
  ];

  const serviceOptions = isPt
    ? [
        'Funilaria e pintura em estufa térmica de alta gama',
        'Martelinho artesanal PDR (preservando laca original)',
        'Polimento técnico e cristalização cerâmica 9H',
        'Sinistro de seguradora (Laudo pericial e reparo)',
        'Alinhamento a laser de monobloco e chassi',
        'Substituição e ajuste milimétrico de peças genuínas',
      ]
    : [
        'Pintura al horno en cabina presurizada de atmósfera estéril',
        'Desabollado artesanal PDR (respetando laca virgen de fábrica)',
        'Tratamiento cerámico 9H y sellado de laca efecto espejo',
        'Gestión pericial integral de siniestro con aseguradora',
        'Banco de calibración láser y estiramiento de chasis',
        'Sustitución y cuadratura de autopartes originales de fábrica',
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.carMake) {
      alert(isPt ? 'Por favor preencha nome, telefone e veículo para a reserva.' : 'Por favor complete nombre, teléfono y marca del vehículo.');
      return;
    }

    const booking: AppointmentBooking = {
      id: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      carMake: formData.carMake,
      carModel: formData.carModel,
      carYear: formData.carYear,
      plate: formData.plate,
      date: formData.date,
      timeSlot: formData.timeSlot,
      serviceType: formData.serviceType,
      hasInsurance: formData.hasInsurance,
      insuranceCompany: formData.insuranceCompany,
      hasPhotos: false,
      notes: formData.notes,
      createdAt: new Date().toLocaleDateString(),
    };

    setBookingConfirmed(booking);
  };

  const sendConfirmationToWhatsApp = (booking: AppointmentBooking) => {
    const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');
    const message = isPt
      ? `*Confirmação de Cita VIP - Avaliação Presencial no Atelier*\n` +
        `*Protocolo:* #${booking.id}\n` +
        `*Atelier:* ${workshopInfo.name}\n\n` +
        `*Cliente:* ${booking.clientName}\n` +
        `*Telefone:* ${booking.clientPhone}\n\n` +
        `*Veículo:* ${booking.carMake} ${booking.carModel} (${booking.carYear})${booking.plate ? ` - Placa: ${booking.plate}` : ''}\n` +
        `*Serviço:* ${booking.serviceType}\n` +
        `${booking.hasInsurance ? `*Seguradora:* ${booking.insuranceCompany || 'Sim, possui seguro'}\n` : ''}` +
        `\n*Data e Horário Reservado:*\n` +
        `• ${booking.date} às ${booking.timeSlot}\n` +
        `• Endereço: ${workshopInfo.address}, ${workshopInfo.city}\n\n` +
        `*Garantia:* 12 meses de garantia certificada por escrito\n\n` +
        `Agradeço se puderem confirmar a recepção da reserva VIP. Muito obrigado!`
      : `*Confirmación de Reserva VIP - Evaluación Presencial en Atelier*\n` +
        `*Pase de Cita:* #${booking.id}\n` +
        `*Atelier:* ${workshopInfo.name}\n\n` +
        `*Datos del Titular:*\n` +
        `• Nombre: ${booking.clientName}\n` +
        `• Teléfono: ${booking.clientPhone}\n\n` +
        `*Vehículo de Alta Gama:*\n` +
        `• ${booking.carMake} ${booking.carModel} (${booking.carYear})${booking.plate ? ` - Matrícula: ${booking.plate}` : ''}\n` +
        `• Servicio: ${booking.serviceType}\n` +
        `${booking.hasInsurance ? `• Aseguradora: ${booking.insuranceCompany || 'Gestión con Seguro'}\n` : ''}` +
        `\n*Fecha y Horario de Recepción:*\n` +
        `• ${booking.date} a las ${booking.timeSlot}\n` +
        `• Ubicación: ${workshopInfo.address}, ${workshopInfo.city}\n\n` +
        `*Garantía Certificada:* ${workshopInfo.warranty}\n\n` +
        `Agradezco me confirmen la recepción del turno en atelier. Saludos cordiales.`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {!bookingConfirmed ? (
        <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#141822] via-[#0d1017] to-[#141822] p-6 sm:p-8 border-b border-[#262016]">
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-widest font-serif-luxury mb-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              {isPt ? 'Recepção VIP com Cita Previa' : 'Recepción VIP con Cita Previa en Atelier'}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white font-serif-luxury tracking-wide">
              {isPt ? 'Agendar Avaliação Presencial no Atelier' : 'Reserva de Cita Pericial en Atelier'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light leading-relaxed">
              {isPt
                ? 'Nossos peritos seniores examinarão o veículo pessoalmente na cabine do atelier para checar micragem de pintura, alinhamento de cotas e emitir o laudo com 12 meses de garantia escrita.'
                : `Nuestros maestros de taller inspeccionarán el vehículo con instrumental pericial óptico para verificar espesores de laca, cotas estructurales y emitir la cotización formal respaldada por ${workshopInfo.warranty}.`}
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Section 1: Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-white font-serif-luxury tracking-wider flex items-center gap-2 border-b border-[#201b13] pb-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>{isPt ? '1. Dados do Titular' : '1. Datos de Contacto del Titular'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Nome e Sobrenome *' : 'Nombre Completo / Titular *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder={isPt ? 'Ex: Carlos Silva' : 'Ej: Lic. Alejandro Benítez'}
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Telefone / WhatsApp VIP *' : 'Teléfono / WhatsApp Directo *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder={isPt ? 'Ex: +595 972 707345' : 'Ej: +595 981 123 456'}
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vehicle Data */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-white font-serif-luxury tracking-wider flex items-center gap-2 border-b border-[#201b13] pb-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span>{isPt ? '2. Veículo de Alta Gama' : '2. Especificaciones del Vehículo'}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Marca *' : 'Marca *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.carMake}
                    onChange={(e) => setFormData({ ...formData, carMake: e.target.value })}
                    placeholder="Porsche, BMW..."
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Modelo' : 'Modelo'}
                  </label>
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    placeholder="Cayenne, X5..."
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Ano' : 'Año'}
                  </label>
                  <input
                    type="text"
                    value={formData.carYear}
                    onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                    placeholder="2022"
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Placa' : 'Matrícula / Chapa'}
                  </label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    placeholder="ABC 123"
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Service Selection */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-white font-serif-luxury tracking-wider flex items-center gap-2 border-b border-[#201b13] pb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isPt ? '3. Requerimento Técnico' : '3. Servicio Técnico Solicitado'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {serviceOptions.map((serv, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition text-xs sm:text-sm ${
                      formData.serviceType === serv
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-medium shadow-md shadow-amber-950/20'
                        : 'bg-[#0f1218] border-[#221c13] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      checked={formData.serviceType === serv}
                      onChange={() => setFormData({ ...formData, serviceType: serv })}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span>{serv}</span>
                  </label>
                ))}
              </div>

              {/* Insurance Checkbox */}
              <div className="bg-[#07090c] p-4 rounded-xl border border-[#262016] space-y-3">
                <label className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.hasInsurance}
                    onChange={(e) => setFormData({ ...formData, hasInsurance: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>{isPt ? 'Reparo através de cobertura de seguro / sinistro' : 'El trabajo será canalizado mediante póliza de seguro / siniestro'}</span>
                </label>

                {formData.hasInsurance && (
                  <div className="pt-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      {isPt ? 'Nome da Companhia de Seguros' : 'Compañía de Seguros'}
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceCompany}
                      onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                      placeholder={isPt ? 'Ex: Mapfre, Porto Seguro, Zurich...' : 'Ej: Mapfre, Aseguradora Tajy, Sancor, La Consolidada...'}
                      className="w-full bg-[#10131a] border border-[#282117] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Date & Slot */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-white font-serif-luxury tracking-wider flex items-center gap-2 border-b border-[#201b13] pb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isPt ? '4. Data e Horário da Recepção' : '4. Fecha y Horario de Recepción'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Data da visita ao atelier' : 'Fecha de la cita'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isPt ? 'Horários disponíveis' : 'Horarios de recepción disponibles'}
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Extra Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isPt ? 'Observações específicas' : 'Requerimientos especiales u observaciones'}
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={isPt ? 'Ex: preservação de verniz original, pintura mate, urgência...' : 'Ej: mantener sellado cerámico original, solicitud de peritaje urgente...'}
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold py-4 px-6 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 font-serif-luxury tracking-widest uppercase"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{isPt ? 'Confirmar Cita VIP no Atelier' : 'Confirmar Reserva de Cita VIP en Atelier'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Confirmed Ticket - Luxury VIP Pass */
        <div className="bg-[#0b0e13] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2 border-b border-[#251f15] pb-5">
            <div className="w-16 h-16 bg-[#16140d] text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/40 shadow-lg shadow-amber-950/40">
              <Award className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-serif-luxury">
              {isPt ? 'Comprovante VIP de Reserva' : 'Pase Oficial de Cita en Atelier'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              {isPt ? 'Cita Confirmada com Êxito' : 'Turno VIP Registrado con Éxito'}
            </h2>
            <p className="text-xs text-slate-400">
              {isPt ? 'Código de Atendimento:' : 'Código de Recepción:'} <span className="text-amber-300 font-mono font-bold tracking-wider">{bookingConfirmed.id}</span>
            </p>
          </div>

          {/* Ticket Body */}
          <div className="bg-[#07090c] rounded-xl p-5 border border-[#262016] space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-xs font-medium">{isPt ? 'Titular' : 'Titular'}</span>
                <span className="font-bold text-white text-sm">{bookingConfirmed.clientName}</span>
                <span className="text-slate-400 text-xs block">{bookingConfirmed.clientPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-medium">{isPt ? 'Veículo' : 'Vehículo'}</span>
                <span className="font-bold text-white text-sm">
                  {bookingConfirmed.carMake} {bookingConfirmed.carModel} ({bookingConfirmed.carYear})
                </span>
                {bookingConfirmed.plate && (
                  <span className="text-slate-400 text-xs block font-mono">{isPt ? 'Placa:' : 'Matrícula:'} {bookingConfirmed.plate}</span>
                )}
              </div>
            </div>

            <div className="border-t border-[#1e1810] pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-xs font-medium">{isPt ? 'Data e Horário' : 'Fecha y Horario'}</span>
                <span className="font-bold text-amber-400 text-base font-serif-luxury tracking-wide">
                  {bookingConfirmed.date} · {bookingConfirmed.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-medium">{isPt ? 'Serviço' : 'Servicio Solicitado'}</span>
                <span className="text-white font-medium">{bookingConfirmed.serviceType}</span>
              </div>
            </div>

            <div className="border-t border-[#1e1810] pt-3">
              <span className="text-slate-400 block text-xs font-medium">{isPt ? 'Endereço do Atelier' : 'Ubicación del Atelier'}</span>
              <span className="text-white flex items-center gap-1.5 mt-0.5 font-light">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{workshopInfo.address}, {workshopInfo.city}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => sendConfirmationToWhatsApp(bookingConfirmed)}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>{isPt ? 'Enviar Comprovante ao WhatsApp VIP' : 'Enviar Comprobante a Concierge VIP'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#141822] hover:bg-[#1a202c] border border-slate-800 text-slate-200 font-semibold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{isPt ? 'Imprimir' : 'Imprimir'}</span>
            </button>

            <button
              onClick={() => {
                setBookingConfirmed(null);
                onNavigateToChat();
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 font-serif-luxury tracking-wider"
            >
              <span>{isPt ? 'Voltar ao Chat' : 'Volver al Concierge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
