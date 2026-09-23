import React, { useState } from 'react';
import { X, Save, RotateCcw, Building2, Crown, Check } from 'lucide-react';
import { AppLanguage, WorkshopInfo } from '../types';
import { DEFAULT_WORKSHOP_INFO } from '../data/workshopDefaults';

interface WorkshopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onSave: (info: WorkshopInfo) => void;
}

export const WorkshopSettingsModal: React.FC<WorkshopSettingsModalProps> = ({
  isOpen,
  onClose,
  workshopInfo,
  language,
  onSave,
}) => {
  const isPt = language === 'pt';
  const [formData, setFormData] = useState<WorkshopInfo>({ ...workshopInfo });
  const [resetNotice, setResetNotice] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData({ ...DEFAULT_WORKSHOP_INFO });
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#07090c] px-6 py-5 border-b border-[#221c13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2a2214] to-[#120f09] border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-serif-luxury tracking-wide">
                {isPt ? 'Personalização do Atelier & Conserje' : 'Personalización del Atelier & Concierge'}
              </h3>
              <p className="text-xs text-slate-400 font-light">
                {isPt ? 'Ajuste os dados de contato, garantias e canais VIP' : 'Ajuste la denominación, línea VIP de WhatsApp y especificaciones'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#151922] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm font-light">
          {resetNotice && (
            <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isPt ? 'Valores padrão do atelier restaurados.' : 'Valores oficiales del atelier restaurados.'}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
              {isPt ? 'Nome do Atelier / Empresa' : 'Nombre del Atelier / Empresa'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
              {isPt ? 'Slogan ou Especialidade' : 'Slogan o Mención de Especialidad'}
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
                {isPt ? 'WhatsApp VIP (com DDI)' : 'Línea Directa / WhatsApp VIP'}
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+595 972 707345"
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
                {isPt ? 'Cidade / Região' : 'Ciudad / Región'}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
              {isPt ? 'Endereço Completo' : 'Dirección del Atelier'}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
              {isPt ? 'Horários de Atendimento' : 'Horarios de Recepción'}
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 font-serif-luxury tracking-wide">
              {isPt ? 'Garantia dos Serviços' : 'Garantía Oficial por Escrito'}
            </label>
            <input
              type="text"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition font-sans"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#201a12] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#141822] transition text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isPt ? 'Restaurar Padrão' : 'Restablecer Valores'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#151922] transition font-medium"
              >
                {isPt ? 'Cancelar' : 'Cancelar'}
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20 font-serif-luxury tracking-wider"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>{isPt ? 'Salvar Alterações' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
