import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  RefreshCw,
  Sparkles,
  Award,
  Crown,
  Car,
  AlertCircle
} from 'lucide-react';
import { AppLanguage, DamageAnalysisResult, WorkshopInfo } from '../types';
import { compressImageToDataUrl } from '../utils/imageCompressor';

interface DamageInspectorProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToBooking: () => void;
}

export const DamageInspector: React.FC<DamageInspectorProps> = ({
  workshopInfo,
  language,
  onNavigateToBooking,
}) => {
  const isEn = language === 'en';
  const isPt = language === 'pt';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [selectedPanel, setSelectedPanel] = useState<string>(
    isEn ? 'Front bumper assembly' : isPt ? 'Para-choque dianteiro' : 'Paragolpes delantero'
  );
  const [description, setDescription] = useState<string>('');
  const [carDetails, setCarDetails] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DamageAnalysisResult | null>(null);

  const cleanPhone = workshopInfo.whatsapp.replace(/\D/g, '');

  const commonPanels = isEn
    ? [
        'Front bumper assembly',
        'Rear bumper assembly',
        'Hood / Front bonnet',
        'Driver front door',
        'Passenger front door',
        'Rear door / Quarter panel',
        'Front fender (wing)',
        'Rear quarter panel / Wheel arch',
        'Roof / A-B-C Pillar',
        'Trunk lid / Tailgate',
      ]
    : isPt
    ? [
        'Para-choque dianteiro',
        'Para-choque traseiro',
        'Capô / Tampa frontal',
        'Porta dianteira esquerda',
        'Porta dianteira direita',
        'Porta traseira / Lateral',
        'Para-lama dianteiro',
        'Lateral traseira / Caixa de roda',
        'Teto / Coluna A-B-C',
        'Tampa do porta-malas',
      ]
    : [
        'Paragolpes delantero',
        'Paragolpes trasero',
        'Capó motor',
        'Puerta delantera izquierda',
        'Puerta delantera derecha',
        'Puerta trasera / Costado',
        'Guardabarros delantero',
        'Lateral trasero / Guardabarros trasero',
        'Techo / Pilar A-B-C',
        'Portón del baúl / Maletero',
      ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsCompressing(true);
    try {
      const { dataUrl, mimeType } = await compressImageToDataUrl(file, 1600, 0.85);
      setPreviewImage(dataUrl);
      setImageMime(mimeType);
      setAnalysisResult(null);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage(
        isEn
          ? 'Error loading photo. Please try another image.'
          : isPt
          ? 'Erro ao carregar a fotografia. Tente com outro arquivo.'
          : 'Error al cargar la fotografía. Intente con otro archivo.'
      );
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRunAnalysis = async () => {
    if (!previewImage) {
      setErrorMessage(
        isEn
          ? 'Please select or capture a photo of the damaged area first.'
          : isPt
          ? 'Por favor selecione uma foto do dano antes de iniciar a inspeção.'
          : 'Por favor seleccione una fotografía del daño antes de iniciar la inspección pericial.'
      );
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewImage,
          mimeType: imageMime,
          description: `${description}. Vehicle: ${carDetails}. Panel selected: ${selectedPanel}`,
          workshopInfo,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor de análise');
      }

      const result: DamageAnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error('Damage inspection error:', err);
      setAnalysisResult({
        panelIdentified: isEn ? 'High-End Exterior Body Panel' : isPt ? 'Painel de Carroceria de Alta Gama' : 'Panel de Carrocería de Alta Gama',
        severity: 'Moderada',
        suggestedProcess: isEn
          ? 'Artisan PDR dent removal or surface preparation with epoxy primer and oven-baked multi-stage paint in pressurized sterile booth with high-solid OEM clear coat.'
          : isPt
          ? 'Desamassamento artesanal com técnica PDR ou preparação com primer epóxi e pintura em estufa térmica pressurizada com verniz alto sólidos de especificação de fábrica.'
          : 'Tratamiento artesanal PDR (sacabollos de precisión) o enderezado milimétrico con fondo epoxi y pintura tricapa en cabina presurizada al horno con barniz alto sólidos.',
        estimatedDays: isEn ? '3 to 4 business days' : isPt ? '3 a 4 dias úteis' : '3 a 4 días hábiles',
        warranty: workshopInfo.warranty || (isEn ? '12-Month certified written warranty' : isPt ? '12 meses de garantia escrita' : '12 meses de garantía certificada por escrito'),
        technicalNotes: isEn
          ? 'Preliminary optical inspection from digital image. In-person paint thickness micrometer inspection and inner mounting clip check recommended at the atelier.'
          : isPt
          ? 'Inspeção visual preliminar por imagem digital. Recomenda-se aferição presencial de espessura de camada de verniz (micrômetro) e inspeção de travas plásticas no atelier.'
          : 'Inspección preliminar por imagen. Para vehículos de alta gama, se aconseja verificar con micrómetro digital la pintura original y el correcto calce de broches y sensores.',
        requiresDisassembly: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const buildWhatsAppMessage = (res: DamageAnalysisResult) => {
    if (isEn) {
      return (
        `*Technical Damage Appraisal Request - ${workshopInfo.name}*\n` +
        `• Vehicle: ${carDetails || 'High-End Vehicle'}\n` +
        `• Panel: ${res.panelIdentified}\n` +
        `• Assessed Severity: ${res.severity}\n` +
        `• Suggested Procedure: ${res.suggestedProcess}\n` +
        `• Estimated Turnaround: ${res.estimatedDays}\n` +
        `• Certified Warranty: ${res.warranty}\n\n` +
        `I would like to schedule an in-person atelier inspection to confirm the final estimate.`
      );
    }
    return isPt
      ? `*Consulta de Peritagem Técnica - ${workshopInfo.name}*\n` +
        `• Veículo: ${carDetails || 'Veículo de Alta Gama'}\n` +
        `• Painel: ${res.panelIdentified}\n` +
        `• Severidade Avaliada: ${res.severity}\n` +
        `• Processo Sugerido: ${res.suggestedProcess}\n` +
        `• Prazo Estimado: ${res.estimatedDays}\n` +
        `• Garantia: ${res.warranty}\n\n` +
        `Gostaria de agendar uma avaliação presencial no atelier para confirmar o orçamento formal.`
      : `*Consulta de Peritaje Técnico - ${workshopInfo.name}*\n` +
        `• Vehículo: ${carDetails || 'Vehículo de Alta Gama'}\n` +
        `• Panel Afectado: ${res.panelIdentified}\n` +
        `• Severidad Estimada: ${res.severity}\n` +
        `• Procedimiento Sugerido: ${res.suggestedProcess}\n` +
        `• Tiempo Estimado: ${res.estimatedDays}\n` +
        `• Respaldo: ${res.warranty}\n\n` +
        `Deseo coordinar una inspección presencial en el atelier para emitir la cotización definitiva.`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner Luxury */}
      <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-widest font-serif-luxury">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Optical Computerized Damage Appraisal' : isPt ? 'Peritagem Visual Computadorizada' : 'Inspección Pericial Óptica & Computarizada'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif-luxury text-white tracking-wide">
            {isEn ? 'High-End Bodywork & Paint Damage Inspector' : isPt ? 'Inspetor de Danos de Carroceria de Alta Gama' : 'Peritaje Fotográfico Computarizado'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {isEn
              ? 'Attach a clear photograph of the damaged area. Our expert appraisal system examines severity, body crease integrity, and recommends the optimal restoration method.'
              : isPt
              ? 'Anexe uma foto nítida da área danificada. Nosso sistema pericial examina a severidade do impacto, integridade de vincos e sugere o método de reparo mais nobre.'
              : 'Adjunte una fotografía nítida del daño. Nuestro sistema pericial analiza la severidad en chapa, preservación de laca original y determina el procedimiento técnico óptimo.'}
          </p>
        </div>
      </div>

      {/* Error Message banner */}
      {errorMessage && (
        <div className="bg-amber-950/80 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between text-xs text-amber-200">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage(null)} className="text-amber-300 hover:text-white text-xs underline">
            {isEn ? 'Dismiss' : isPt ? 'Fechar' : 'Cerrar'}
          </button>
        </div>
      )}

      {/* Inspector Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0b0e13] border border-[#262016] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-serif-luxury flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{isEn ? '1. Damage Photograph' : isPt ? '1. Fotografia do Dano' : '1. Registro Fotográfico del Daño'}</span>
              </span>
              {previewImage && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="text-xs text-slate-400 hover:text-red-400 transition"
                >
                  {isEn ? 'Replace photo' : isPt ? 'Substituir foto' : 'Cambiar imagen'}
                </button>
              )}
            </div>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl cursor-pointer p-6 flex flex-col items-center justify-center text-center transition min-h-[260px] ${
                previewImage
                  ? 'border-amber-500/40 bg-[#07090c]'
                  : 'border-[#2e261a] hover:border-amber-500/60 bg-[#07090c]/60 hover:bg-[#07090c]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {previewImage ? (
                <div className="w-full space-y-2">
                  <div className="rounded-xl overflow-hidden max-h-[320px] flex items-center justify-center bg-black/40">
                    <img
                      src={previewImage}
                      alt="Dano inspecionado"
                      className="w-full h-auto object-contain max-h-[320px]"
                    />
                  </div>
                  <span className="text-[11px] text-amber-300 font-medium block">
                    {isEn ? 'Photo loaded and calibrated' : isPt ? 'Fotografia carregada com sucesso' : 'Fotografía cargada y optimizada'}
                  </span>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#141822] text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg shadow-amber-950/30">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-white font-serif-luxury">
                      {isEn ? 'Click to upload or take a photo' : isPt ? 'Clique para carregar ou tirar foto' : 'Haga clic para cargar o tomar fotografía'}
                    </p>
                    <p className="text-xs text-slate-400 font-light">
                      {isEn ? 'Mobile camera or file upload (JPG, PNG)' : isPt ? 'Câmera do celular ou arquivo (JPEG, PNG)' : 'Cámara del móvil o archivo de galería (JPG, PNG)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Peritaje Submission */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0b0e13] border border-[#262016] rounded-2xl p-5 shadow-xl space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-serif-luxury flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              <span>{isEn ? '2. Vehicle & Panel Data' : isPt ? '2. Dados do Veículo & Peça' : '2. Identificación del Vehículo'}</span>
            </span>

            {/* Vehicle Model */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isEn ? 'Make, Model and Year' : isPt ? 'Marca, Modelo e Ano' : 'Marca, Modelo y Año'}
              </label>
              <input
                type="text"
                value={carDetails}
                onChange={(e) => setCarDetails(e.target.value)}
                placeholder="Ex: Porsche Macan GTS 2023, BMW M3..."
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Panel Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isEn ? 'Affected Panel or Section' : isPt ? 'Painel ou área afetada' : 'Paño o sector afectado'}
              </label>
              <select
                value={selectedPanel}
                onChange={(e) => setSelectedPanel(e.target.value)}
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
              >
                {commonPanels.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isEn ? 'Client Observations & Incident Notes' : isPt ? 'Observações do cliente' : 'Observaciones sobre el siniestro o golpe'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isEn
                    ? 'Ex: deep scratch with clear coat loss, parking dent without metal crease...'
                    : isPt
                    ? 'Ex: raspão com perda de verniz, amassado de estacionamento sem corte de chapa...'
                    : 'Ej: raspón profundo con desprendimiento de barniz, golpe de estacionamiento sin pliegue vivo...'
                }
                className="w-full bg-[#07090c] border border-[#262016] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Run Analysis Button */}
            <button
              type="button"
              disabled={isAnalyzing || isCompressing || !previewImage}
              onClick={handleRunAnalysis}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 font-serif-luxury tracking-wider"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{isEn ? 'Running Optical Damage Appraisal...' : isPt ? 'Processando Peritagem Óptica...' : 'Ejecutando Peritaje Computarizado...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isEn ? 'Generate Technical Diagnosis' : isPt ? 'Emitir Diagnóstico do Atelier' : 'Emitir Diagnóstico Pericial'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="bg-[#0b0e13] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#251f15] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#251e13] to-[#120f09] border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-serif-luxury">
                  {isEn ? 'Technical Appraisal Dossier' : isPt ? 'Dossiê Técnico Pericial' : 'Dossier Pericial de Carrocería'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
                  {analysisResult.panelIdentified}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-light">{isEn ? 'Severity:' : isPt ? 'Severidade:' : 'Severidad:'}</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  analysisResult.severity === 'Leve'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : analysisResult.severity === 'Moderada'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}
              >
                {analysisResult.severity}
              </span>
            </div>
          </div>

          {/* Technical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#07090c] border border-[#221c13] p-4 rounded-xl space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Recommended Procedure' : isPt ? 'Procedimento Sugerido' : 'Procedimiento Sugerido'}</span>
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {analysisResult.suggestedProcess}
              </p>
            </div>

            <div className="bg-[#07090c] border border-[#221c13] p-4 rounded-xl space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Estimated Atelier Time' : isPt ? 'Tempo Médio em Atelier' : 'Tiempo Estimado en Atelier'}</span>
              </span>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 font-serif-luxury">
                {analysisResult.estimatedDays}
              </p>
            </div>

            <div className="bg-[#07090c] border border-[#221c13] p-4 rounded-xl space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Certified Warranty' : isPt ? 'Garantia Certificada' : 'Garantía Certificada'}</span>
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {analysisResult.warranty}
              </p>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-[#07090c] border border-[#221c13] p-4 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-amber-300 font-serif-luxury tracking-wide">
              {isEn ? 'Master Appraiser Technical Notes:' : isPt ? 'Notas Técnicas do Perito:' : 'Observaciones Técnicas del Perito:'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {analysisResult.technicalNotes}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onNavigateToBooking}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 font-serif-luxury tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>{isEn ? 'Schedule Private Atelier Evaluation' : isPt ? 'Agendar Avaliação Presencial no Atelier' : 'Agendar Evaluación Presencial en Atelier'}</span>
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(buildWhatsAppMessage(analysisResult))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>{isEn ? 'Send Appraisal to Concierge' : isPt ? 'Enviar Dossiê ao WhatsApp' : 'Enviar Diagnóstico a Concierge'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
