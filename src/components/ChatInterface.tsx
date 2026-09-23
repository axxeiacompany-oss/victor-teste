import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  FileText,
  Car,
  Crown,
  AlertCircle
} from 'lucide-react';
import { AppLanguage, ChatMessage, WorkshopInfo } from '../types';
import { compressImageToDataUrl } from '../utils/imageCompressor';

interface ChatInterfaceProps {
  workshopInfo: WorkshopInfo;
  language: AppLanguage;
  onNavigateToBooking: () => void;
  onNavigateToInspector: () => void;
  onNavigateToInsurance: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  workshopInfo,
  language,
  onNavigateToBooking,
  onNavigateToInspector,
  onNavigateToInsurance,
}) => {
  const isEn = language === 'en';
  const isPt = language === 'pt';

  const getInitialGreeting = (lang: AppLanguage): string => {
    if (lang === 'en') {
      return `Welcome to the VIP Concierge & Technical Advisory service of **${workshopInfo.name}**.\n\nAs an atelier specializing in precision body restoration, artisan PDR dent removal, and high-end oven-baked paint, we are entirely at your service.\n\nCould you please indicate your vehicle's make, model, and year, or describe the work you wish to quote?`;
    }
    if (lang === 'pt') {
      return `Seja muito bem-vindo ao serviço de Concierge e Assessoria Técnica Exclusiva da **${workshopInfo.name}**.\n\nComo atelier especializado em restauração pericial, funilaria artesanal e pintura térmica de alta gama, estamos à sua inteira disposição.\n\nPoderia nos indicar a marca, modelo e ano do seu veículo, ou nos descrever o serviço que deseja realizar?`;
    }
    return `Bienvenido al servicio de Concierge y Asesoría Técnica Exclusiva de **${workshopInfo.name}**.\n\nComo atelier especializado en carrocería pericial, desabollado artesanal PDR y pintura de alta gama al horno, estamos a su entera disposición.\n\n¿Podría indicarnos la marca, modelo y año de su vehículo, o describirnos el trabajo que desea cotizar?`;
  };

  const getQuickActions = (lang: AppLanguage) => {
    if (lang === 'en') {
      return [
        { label: 'Oven-Baked Paint & Bodywork Quote', action: 'send', value: 'Hello, I would like to request an estimate for precision bodywork and oven-baked painting in a pressurized spray booth.' },
        { label: 'Artisan PDR (Preserve OEM Clear Coat)', action: 'send', value: 'Hello, I have a dent on my vehicle and would like to know if it can be restored with artisan PDR without repainting.' },
        { label: 'Insurance Claim & Appraisal', action: 'insurance', value: 'insurance' },
        { label: 'Book Private Atelier Appointment', action: 'book', value: 'booking' },
        { label: 'Computerized Photo Damage Appraisal', action: 'inspect', value: 'inspector' },
      ];
    }
    if (lang === 'pt') {
      return [
        { label: 'Cotizar Funilaria & Pintura em Estufa', action: 'send', value: 'Olá, gostaria de uma cotação para reparo de funilaria e pintura em estufa térmica de alta gama.' },
        { label: 'Martelinho PDR (Preserva Pintura Original)', action: 'send', value: 'Olá, tenho um amassado no veículo e gostaria de saber se é possível recuperar com martelinho de ouro sem repintar.' },
        { label: 'Gestão Pericial de Sinistro / Seguradora', action: 'insurance', value: 'insurance' },
        { label: 'Agendar Cita Privada no Atelier', action: 'book', value: 'booking' },
        { label: 'Peritagem por Foto do Dano', action: 'inspect', value: 'inspector' },
      ];
    }
    return [
      { label: 'Cotización de Chapa & Pintura al Horno', action: 'send', value: 'Estimados, deseo solicitar una cotización pericial para trabajos de chapa y pintura de alta gama en cabina presurizada.' },
      { label: 'Sacabollos Artesanal PDR (Laca Original)', action: 'send', value: 'Deseo consultar por desabollado artesanal PDR sin alterar la laca original de fábrica.' },
      { label: 'Gestión Pericial de Siniestros / Seguro', action: 'insurance', value: 'insurance' },
      { label: 'Agendar Evaluación Privada en Atelier', action: 'book', value: 'booking' },
      { label: 'Peritaje Fotográfico Computarizado', action: 'inspect', value: 'inspector' },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: getInitialGreeting(language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update initial message if language switches and there is only 1 message
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [
          {
            ...prev[0],
            text: getInitialGreeting(language),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setInlineNotice(null);
    try {
      const { dataUrl, mimeType } = await compressImageToDataUrl(file, 1600, 0.85);
      setSelectedImage(dataUrl);
      setImageMime(mimeType);
    } catch (err) {
      console.error('Image compression error:', err);
      setInlineNotice(
        isEn
          ? 'Unable to process image. Please try another photo.'
          : isPt
          ? 'Não foi possível processar a imagem. Tente outra foto.'
          : 'No se pudo procesar la fotografía. Intente con otra imagen.'
      );
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text && !selectedImage) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: text || (isEn ? 'Photo attached for technical damage appraisal.' : isPt ? 'Fotografia anexada para peritagem técnica.' : 'Fotografía adjunta para evaluación pericial.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageData: selectedImage || undefined,
      mimeType: selectedImage ? imageMime : undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    const imageToSend = selectedImage;
    const mimeToSend = imageMime;
    setSelectedImage(null);
    setInlineNotice(null);
    setIsLoading(true);

    try {
      const chatHistory = newMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          workshopInfo,
          language,
          imageAttachment: imageToSend
            ? {
                data: imageToSend,
                mimeType: mimeToSend,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el servidor');
      }

      const data = await response.json();
      const assistantText = data.text;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Voice read-out if activated
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(assistantText);
        utterance.lang = isEn ? 'en-US' : isPt ? 'pt-BR' : 'es-ES';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        sender: 'assistant',
        text: isEn
          ? `Thank you for contacting **${workshopInfo.name}**.\n\nTo provide an exact technical quote backed by our 12-Month certified warranty, we invite you to book an in-person atelier inspection or message our VIP Concierge directly on WhatsApp: **${workshopInfo.whatsapp}**.`
          : isPt
          ? `Agradecemos seu contato com o atelier **${workshopInfo.name}**.\n\nPara lhe fornecer um orçamento pericial exato com nossa garantia de 12 meses, convidamos você a agendar uma avaliação presencial ou nos enviar os detalhes e fotos pelo WhatsApp VIP: **${workshopInfo.whatsapp}**.`
          : `Agradecemos su contacto con **${workshopInfo.name}**.\n\nPara brindarle un presupuesto pericial con nuestra garantía certificada de 12 meses por escrito, le invitamos a agendar una cita de evaluación presencial en el atelier o escribir a nuestro Concierge VIP al WhatsApp: **${workshopInfo.whatsapp}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: { label: string; action: string; value: string }) => {
    if (action.action === 'book') {
      onNavigateToBooking();
    } else if (action.action === 'inspect') {
      onNavigateToInspector();
    } else if (action.action === 'insurance') {
      onNavigateToInsurance();
    } else if (action.action === 'send') {
      handleSendMessage(action.value);
    }
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: getInitialGreeting(language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Luxury Chat Chassis Card */}
      <div className="bg-[#0b0e13] border border-[#2b2416] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[78vh] min-h-[580px] max-h-[820px]">
        {/* Luxury Concierge Header */}
        <div className="bg-gradient-to-r from-[#12161f] via-[#0e1117] to-[#12161f] p-4 sm:p-5 border-b border-[#251f14] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#2a2417] to-[#14110a] flex items-center justify-center border border-amber-500/40 shadow-lg shadow-amber-950/40">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0e1117] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury font-bold text-white text-sm sm:text-base tracking-wider">
                  {isEn ? 'Atelier Technical Concierge' : isPt ? 'Concierge Técnico do Atelier' : 'Concierge Técnico del Atelier'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-300">{workshopInfo.name}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400/90">{isEn ? 'Executive Advisory' : isPt ? 'Atendimento Exclusivo' : 'Atención de Alta Gama'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2 rounded-xl border transition ${
                isSpeechEnabled
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-[#151921] border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isSpeechEnabled ? (isEn ? 'Mute voice' : isPt ? 'Desativar voz' : 'Desactivar voz') : (isEn ? 'Enable speech' : isPt ? 'Ativar voz' : 'Activar lectura por voz')}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Restart */}
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-[#151921] border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition"
              title={isEn ? 'Reset chat' : isPt ? 'Reiniciar conversa' : 'Reiniciar conversación'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Notice if any */}
        {inlineNotice && (
          <div className="bg-amber-950/70 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              {inlineNotice}
            </span>
            <button onClick={() => setInlineNotice(null)} className="text-amber-300 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#0a0c10] to-[#07090c]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#241e14] to-[#120f09] border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400 shadow-md">
                    <Crown className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`rounded-2xl p-4 shadow-xl text-xs sm:text-sm leading-relaxed transition ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-medium rounded-tr-sm shadow-amber-950/40'
                        : 'bg-[#12161f] border border-[#2b2316] text-slate-100 rounded-tl-sm shadow-black/60'
                    }`}
                  >
                    {/* User attached photo */}
                    {msg.imageData && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-black/20 max-w-sm">
                        <img
                          src={msg.imageData}
                          alt="Fotografía de daño"
                          className="w-full h-auto object-cover max-h-56"
                        />
                      </div>
                    )}

                    {/* Message body text */}
                    <div className="whitespace-pre-wrap space-y-1.5 font-sans">
                      {msg.text.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Metadata timestamp */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-500 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400/80 font-medium">{isEn ? 'Official Atelier' : isPt ? 'Atelier Oficial' : 'Atelier Oficial'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#241e14] to-[#120f09] border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Crown className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#12161f] border border-[#2b2316] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-400 ml-1 font-serif-luxury tracking-wide">
                  {isEn ? 'Consulting atelier technical database...' : isPt ? 'Consultando especificações do atelier...' : 'Consultando especificaciones del atelier...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggestion Chips */}
        <div className="bg-[#080a0e] px-4 py-2.5 border-t border-[#1e1910] overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/70 font-serif-luxury flex-shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {isEn ? 'VIP Actions:' : isPt ? 'Ações Rápidas:' : 'Acciones VIP:'}
          </span>
          {getQuickActions(language).map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAction(action)}
              className="bg-[#12161f] hover:bg-[#1a202c] active:scale-95 border border-[#2b2418] hover:border-amber-500/50 text-slate-300 hover:text-amber-200 text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-[#0b0e13] p-3 sm:p-4 border-t border-[#231d13]">
          {/* Image Preview attachment thumbnail */}
          {selectedImage && (
            <div className="mb-2 p-2 bg-[#12161f] border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedImage}
                  alt="Previa"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                />
                <div>
                  <span className="text-xs text-white font-medium block">
                    {isEn ? 'Photo ready for damage appraisal' : isPt ? 'Foto pronta para peritagem' : 'Fotografía optimizada para peritaje'}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {isEn ? 'Calibrated resolution' : isPt ? 'Resolução calibrada' : 'Resolución calibrada'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-red-400 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Photo upload trigger */}
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-[#141822] hover:bg-[#1c2230] border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 transition disabled:opacity-50"
              title={isEn ? 'Attach photo of damage' : isPt ? 'Anexar foto do dano' : 'Adjuntar fotografía del daño para peritaje'}
            >
              <ImageIcon className={`w-4 h-4 ${isCompressing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isEn
                  ? 'Describe the damage or provide vehicle make, model, and year...'
                  : isPt
                  ? 'Descreva o dano ou informe modelo, ano e serviço desejado...'
                  : 'Describa el trabajo pericial o indique marca, modelo y año del vehículo...'
              }
              className="flex-1 bg-[#07090d] border border-[#2b2316] focus:border-amber-500/70 focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition shadow-inner"
            />

            {/* Send Button */}
            <button
              type="button"
              disabled={isLoading || isCompressing || (!inputMessage.trim() && !selectedImage)}
              onClick={() => handleSendMessage()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold p-3 sm:px-5 sm:py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-serif-luxury tracking-wider">{isEn ? 'Consult' : isPt ? 'Enviar' : 'Consultar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
