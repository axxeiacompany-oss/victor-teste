import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini client strictly using @google/genai as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildEnglishSystemInstruction(workshop: any): string {
  const name = workshop?.name || 'San Cristóbal · High-End Body & Paint Atelier';
  const address = workshop?.address || 'Avda. Eusebio Ayala 2450 c/ Choferes del Chaco, Asunción';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const hours = workshop?.hours || 'Monday to Friday: 07:30 to 18:00 | Saturdays: 08:00 to 12:30 (By Appointment)';
  const warranty = workshop?.warranty || '12-Month certified written warranty on body and paint';
  const insurances = (workshop?.insurances || []).join(', ');

  return `
You are the Exclusive Technical Advisor and Concierge of "${name}", a luxury automotive atelier specializing in precision bodywork, oven-baked paint, and expert craftsmanship for premium, sports, and luxury vehicles (Porsche, Ferrari, Mercedes-AMG, BMW M, Audi Exclusive, Range Rover).

TONE & PERSONALITY:
- Tone: Extremely distinguished, polite, confident, articulate, and executive — representing the highest standard of luxury automotive service.
- Vocabulary: Impeccable English with automotive engineering precision. Never slang or casual disregard. Conveys prestige, technical mastery, and meticulous attention to detail.
- Technical Mastery: Demonstrate deep familiarity with sterile pressurized baking paint booths, computerized spectrophotometer digital color matching (Glasurit / PPG), factory paint depth micrometer gauge inspection, artisan Paintless Dent Repair (PDR) preserving factory OEM clear coat, and laser chassis frame alignment.

LANGUAGE REQUIREMENT:
- Respond EXCLUSIVELY IN PROFESSIONAL, DISTINGUISHED ENGLISH.

ATELIER DETAILS:
- Name: ${name}
- Address: ${address}
- Private Reception Hours: ${hours}
- VIP Direct Line / WhatsApp: ${phone}
- Approved Insurance Partners: ${insurances}
- Official Warranty: ${warranty}
- Facilities: Down-draft pressurized sterile thermal baking spray booth, digital spectrophotometer for exact factory VIN color reproduction, laser chassis alignment rack, and 9H ceramic coating laboratory.

SERVICE FLOW:
1. Warm, distinguished greeting, welcoming the client and offering technical assistance for their vehicle.
2. Identify the service needed (body restoration, multi-stage oven-baked paint, artisan PDR dent removal, collision repair, insurance claim appraisal).
3. Inquire about the car's make, model, and year.
4. Politely invite high-resolution photos of the damaged panel for preliminary appraisal.
5. Clarify that while an initial estimate is provided, a final binding appraisal requires in-person atelier inspection to assess internal structural clips, sensor alignment, and panel gaps.
6. Offer appointment slots for in-person evaluation during atelier hours (${hours}).
7. State estimated turnaround times (e.g., 24-48h for PDR; 3-5 business days for oven-cured multi-stage panel painting) and reiterate the written 12-month warranty.
8. Provide direct access to WhatsApp VIP Concierge (${phone}) or assist in scheduling their priority appointment.
`.trim();
}

function buildPortugueseSystemInstruction(workshop: any): string {
  const name = workshop?.name || 'Taller San Cristóbal Chapa & Pintura';
  const address = workshop?.address || 'Avda. Eusebio Ayala 2450 c/ Choferes del Chaco, Asunción';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const hours = workshop?.hours || 'Segunda a Sexta das 07:30 às 18:00 hs | Sábados das 08:00 às 12:30 hs';
  const warranty = '12 meses de garantia escrita em funilaria e pintura';
  const insurances = (workshop?.insurances || []).join(', ');

  return `
Você é o assistente virtual oficial e Concierge de atendimento técnico da "${name}", especializado em funilaria e pintura automotiva de alta precisão (chapa e pintura) para veículos de alta gama.

IDIOMA OBRIGATÓRIO: Responda SEMPRE E EXCLUSIVAMENTE EM LÍNGUA PORTUGUESA formal, polida e técnica.

INFORMAÇÕES DA OFICINA:
- Nome: ${name}
- Endereço: ${address}
- Horário de atendimento: ${hours}
- WhatsApp oficial: ${phone}
- Seguradoras conveniadas: ${insurances}
- Garantia oficial: ${warranty}
- Diferenciais técnicos: Estufa pressurizada de secagem e pintura térmica ao forno, laboratório de colorimetria digital computadorizada PPG/Glasurit, alinhador de monobloco/chassi, técnica artesanal de martelinho de ouro (PDR) preservando a pintura original de fábrica, e peças originais com garantia.

PERSONALIDADE:
- Tom sério, profissional, distinto, confiável e atencioso — transmite segurança técnica e clareza de atelier.
- Educado, direto e objetivo, sem gírias ou informalidade excessiva.
- Demonstra conhecimento técnico automotivo de forma acessível e transparente.

OBJETIVO:
Atender clientes que buscam serviços de funilaria, pintura, reparo de amassados, martelinho de ouro, sinistros de seguradora e orçamentos, orientando-os até o agendamento de uma avaliação técnica presencial na oficina.

FLUXO DE ATENDIMENTO:
1. Cumprimente o cliente com cordialidade e pergunte em que pode ajudar com o veículo.
2. Identifique o tipo de serviço (batida, amassado, risco na pintura, sinistro de seguradora, parachoque, etc.).
3. Pergunte a marca, modelo e ano do veículo.
4. Pergunte se o cliente tem fotos do dano para avaliação preliminar.
5. Explique com transparência que o orçamento definitivo requer avaliação presencial na oficina para inspecionar travas internas e estrutura, mas forneça uma orientação técnica inicial.
6. Ofereça opções de horário para avaliação técnica presencial no atelier (${hours}).
7. Informe o prazo estimado de reparo (ex: 1 a 2 dias para martelinho leve; 3 a 5 dias úteis para funilaria com pintura em estufa) e reforce a garantia escrita de 12 meses.
8. Finalize facilitando o contato direto pelo WhatsApp oficial: ${phone}.
`.trim();
}

function buildSystemInstruction(workshop: any): string {
  const name = workshop?.name || 'San Cristóbal · Atelier de Carrocería & Pintura de Alta Gama';
  const address = workshop?.address || 'Avda. Eusebio Ayala 2450 c/ Choferes del Chaco, Asunción';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const hours = workshop?.hours || 'Lunes a Viernes de 07:30 a 18:00 hs | Sábados de 08:00 a 12:30 hs (Cita Previa)';
  const warranty = workshop?.warranty || '12 meses de garantía certificada por escrito en carrocería y pintura';
  const insurances = (workshop?.insurances || []).join(', ');

  return `
Eres el Asesor Técnico Exclusivo y Conserje de Carrocería de "${name}", un atelier especializado en chapa, pintura y restauración pericial de vehículos premium, deportivos y de alta gama.

PERSONALIDAD Y TONO:
- Tono: Extremadamente distinguido, pulcro, educado, seguro y profesional — como el jefe de taller de un concesionario de superdeportivos o vehículos de lujo (Porsche, Ferrari, Mercedes-AMG, BMW M, Audi Exclusive, Range Rover).
- Vocabulario: Impecable y refinado en español, sin jerga vulgar ni informalidad excesiva. Transmite serenidad, exclusividad, rigor pericial y alta maestría artesanal.
- Precisión técnica: Demuestra dominio de cabina presurizada de secado al horno, espectrofotometría digital computarizada (Glasurit / PPG), micraje de espesor de pintura, sacabollos artesanal PDR (Paintless Dent Repair) respetando la laca virgen de fábrica y calibración láser de chasis.

REGLA DE IDIOMA:
- Si el usuario interactúa en ESPAÑOL (o por defecto), responde SIEMPRE en este distinguido español de alta gama.
- Si el usuario escribe en PORTUGUÊS, responde en portugués técnico de alto padrão.
- Si el usuario escribe en INGLÉS, responde en inglés ejecutivo de alta gama.

INFORMACIÓN DEL ATELIER:
- Nombre: ${name}
- Ubicación: ${address}
- Horarios de recepción privada: ${hours}
- Línea de atención directa / WhatsApp VIP: ${phone}
- Aseguradoras homologadas: ${insurances}
- Garantía oficial: ${warranty}
- Instalaciones: Cabina presurizada con flujo laminar térmico y filtrado molecular, espectrofotómetro digital para igualación exacta de tono VIN, banco de estiramiento de chasis y productos de laca cerámica de máxima resistencia UV.

FLUJO DE ATENCIÓN EXCLUSIVA:
1. Saludo de bienvenida distinguido y cordial, poniéndote a entera disposición del cliente para el cuidado de su vehículo.
2. Identifica con precisión la naturaleza del requerimiento (restauración de carrocería, pintura al horno tricapa/bicapa, reparación artesanal PDR sin pintar, daño por choque, o gestión pericial de siniestro con aseguradora).
3. Solicita la marca, modelo y año del vehículo para verificar especificaciones técnicas.
4. Invita amablemente al cliente a adjuntar o enviar fotografías de alta resolución del sector para una evaluación pericial preliminar.
5. Explica con transparencia técnica que un presupuesto definitivo de alta gama requiere una inspección presencial minuciosa en el atelier (para verificar anclajes internos de sujeción, líneas de luz entre paños y espesor de chapa), pero ofrece una estimación preliminar si los datos lo permiten.
6. Ofrece coordinar un horario prioritario de recepción en el taller (${hours}).
7. Detalla el plazo técnico estimado (ej. 24 a 48 hs para micro-reparaciones PDR; 3 a 5 días hábiles para paños completos de pintura al horno con curado térmico) y recuerda la garantía por escrito de 12 meses.
8. Facilita la comunicación directa por WhatsApp VIP (${phone}) o confirma la reserva de cita.
`.trim();
}

function generateFallbackResponse(userMessage: string, workshop: any, turnCount: number, lang = 'es'): string {
  const name = workshop?.name || 'San Cristóbal · Atelier de Carrocería & Pintura de Alta Gama';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const warranty = workshop?.warranty || '12 meses de garantía certificada por escrito';
  const hours = workshop?.hours || 'Lunes a Viernes de 07:30 a 18:00 hs';

  if (lang === 'en') {
    if (turnCount <= 1) {
      return `Welcome to **${name}** VIP Concierge Service.\n\nWe specialize in high-end automotive body restoration, sterile oven-baked painting, and precision PDR dent repair.\n\nCould you please let us know the **make, model, and year** of your vehicle, along with the service you require? If you have photos of the damaged panel, feel free to attach them here or send them via WhatsApp VIP to **${phone}**.`;
    }
    return `Thank you for contacting **${name}**.\n\nTo ensure our hallmark OEM finish backed by our **${warranty}**, we invite you to schedule a private in-person appraisal or reach out directly to our Master Technician on WhatsApp: **${phone}**.\n\nReception Hours: ${hours}.`;
  }

  if (lang === 'pt') {
    if (turnCount <= 1) {
      return `Olá! Seja muito bem-vindo ao atendimento do **${name}**.\n\nSomos especialistas em funilaria artesanal, martelinho de ouro PDR e pintura térmica ao forno em estufa pressurizada.\n\nComo podemos ajudar com o seu veículo hoje? Por favor, informe o modelo e ano do carro e o serviço que necessita.`;
    }
    return `Compreendo perfeitamente sua necessidade. Na **${name}**, todos os reparos de funilaria e pintura contam com **${warranty}**.\n\nSugerimos agendar uma avaliação técnica presencial no atelier ou nos enviar fotos pelo WhatsApp oficial **${phone}** para um diagnóstico inicial.`;
  }

  // Spanish default
  if (turnCount <= 1) {
    return `Estimado cliente, bienvenido al servicio de Concierge de **${name}**.\n\nSomos un atelier especializado en restauración pericial de carrocería, desabollado artesanal PDR y pintura al horno de alta gama.\n\n¿En qué podemos asistirle hoy? Por favor indíquenos la **marca, modelo y año** de su vehículo, o si cuenta con imágenes del sector dañado para una primera evaluación pericial.`;
  }

  return `Comprendo perfectamente su consulta. En **${name}** garantizamos mano de obra técnica certificada y **${warranty}** en nuestros trabajos de pintura al horno.\n\nLe sugerimos agendar una breve evaluación técnica presencial o enviarnos las imágenes a nuestro WhatsApp VIP **${phone}** para que nuestro jefe de taller emita la cotización definitiva.`;
}

// Helper for fast timeouts so requests never hang
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)),
  ]);
}

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], workshopInfo, imageAttachment, language } = req.body;
    const workshop = workshopInfo || {};
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    
    const isExplicitEn = language === 'en';
    const isExplicitPt = language === 'pt';
    const isExplicitEs = language === 'es';

    let activeLanguage: 'en' | 'pt' | 'es' = 'es';
    if (isExplicitEn) {
      activeLanguage = 'en';
    } else if (isExplicitPt) {
      activeLanguage = 'pt';
    } else if (isExplicitEs) {
      activeLanguage = 'es';
    } else {
      if (/[ãõ]/i.test(lastUserMsg) || /\b(não|orçamento|funilaria|martelinho|amassado|obrigado|obrigada|conserto)\b/i.test(lastUserMsg.toLowerCase())) {
        activeLanguage = 'pt';
      } else if (/\b(hello|hi|quote|paint|bumper|dent|fender|scratch|car|repair|warranty|cost|price|english)\b/i.test(lastUserMsg.toLowerCase())) {
        activeLanguage = 'en';
      } else {
        activeLanguage = 'es';
      }
    }

    const systemInstruction = activeLanguage === 'en'
      ? buildEnglishSystemInstruction(workshop)
      : activeLanguage === 'pt'
      ? buildPortugueseSystemInstruction(workshop)
      : buildSystemInstruction(workshop);

    if (!ai) {
      const fallbackText = generateFallbackResponse(lastUserMsg, workshop, messages.length, activeLanguage);
      return res.json({ text: fallbackText, modelUsed: 'system-fallback' });
    }

    // Normalize contents for Gemini API:
    // Multiturn requests must strictly alternate between 'user' and 'model', starting with 'user'.
    const contents: any[] = [];
    const chatTurns = (messages || []).filter((m: any) => m && m.content);

    // Skip leading assistant greetings so contents starts with 'user'
    let startIndex = 0;
    while (startIndex < chatTurns.length && chatTurns[startIndex].role === 'assistant') {
      startIndex++;
    }

    for (let i = startIndex; i < chatTurns.length; i++) {
      const msg = chatTurns[i];
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [];

      // Only attach image to the latest user message
      if (i === chatTurns.length - 1 && imageAttachment?.data) {
        parts.push({
          inlineData: {
            mimeType: imageAttachment.mimeType || 'image/jpeg',
            data: imageAttachment.data.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      } else if (i === chatTurns.length - 1 && msg.imageData) {
        parts.push({
          inlineData: {
            mimeType: msg.mimeType || 'image/jpeg',
            data: msg.imageData.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      if (activeLanguage === 'en' && i === chatTurns.length - 1) {
        parts.push({ text: `${msg.content}\n\n[SYSTEM INSTRUCTION: Respond in professional, distinguished high-end ENGLISH as the Atelier Concierge.]` });
      } else if (activeLanguage === 'pt' && i === chatTurns.length - 1) {
        parts.push({ text: `${msg.content}\n\n[INSTRUÇÃO DO SISTEMA: Responda em PORTUGUÊS técnico de alto padrão como Concierge do Atelier.]` });
      } else if (activeLanguage === 'es' && i === chatTurns.length - 1) {
        parts.push({ text: `${msg.content}\n\n[INSTRUCCIÓN DEL SISTEMA: Responde en ESPAÑOL distinguido de alta gama, con el trato refinado y pericial del Atelier.]` });
      } else {
        parts.push({ text: msg.content });
      }

      const lastContent = contents[contents.length - 1];
      if (lastContent && lastContent.role === role) {
        lastContent.parts.push(...parts);
      } else {
        contents.push({ role, parts });
      }
    }

    if (contents.length === 0) {
      const lastMsg = messages[messages.length - 1]?.content || 'Hello';
      contents.push({ role: 'user', parts: [{ text: lastMsg }] });
    }

    // Prioritize fastest, high-availability models with 5.5-second timeout
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let replyText = '';
    let usedModel = '';

    for (const model of candidateModels) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.4,
            },
          }),
          5500
        );

        if (response.text) {
          replyText = response.text;
          usedModel = model;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable or timed out:`, err?.message || err);
      }
    }

    if (!replyText) {
      replyText = generateFallbackResponse(lastUserMsg, workshop, messages.length, activeLanguage);
      usedModel = 'system-fallback';
    }

    return res.json({ text: replyText, modelUsed: usedModel });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const workshop = req.body.workshopInfo || {};
    const lastUserMsg = req.body.messages?.[req.body.messages?.length - 1]?.content || '';
    const lang = req.body.language || 'es';
    const fallbackText = generateFallbackResponse(lastUserMsg, workshop, req.body.messages?.length || 1, lang);
    return res.json({ text: fallbackText, modelUsed: 'system-fallback-error' });
  }
});

// POST /api/analyze-damage
app.post('/api/analyze-damage', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '', language = 'es', workshopInfo } = req.body;
    const isEn = language === 'en';
    const isPt = language === 'pt';

    if (!imageBase64) {
      return res.status(400).json({ error: 'Se requiere una imagen en base64 para el análisis de daño' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!ai) {
      return res.json({
        panelIdentified: isEn ? 'Exterior Body Panel' : isPt ? 'Painel de Carroceria Exterior' : 'Panel de carrocería exterior',
        severity: 'Moderada',
        suggestedProcess: isEn
          ? 'Artisan PDR dent removal or surface preparation with epoxy primer and oven-baked multi-stage paint in pressurized sterile booth.'
          : isPt
          ? 'Desamassamento artesanal com técnica PDR ou preparação com primer epóxi e pintura em estufa térmica pressurizada.'
          : 'Desabollado de chapa, preparación de superficie con primer epóxico y aplicación de pintura bicapa con barniz de alto sólidos en cabina presurizada.',
        estimatedDays: isEn ? '3 to 4 business days' : isPt ? '3 a 4 dias úteis' : '3 a 4 días hábiles',
        warranty: workshopInfo?.warranty || (isEn ? '12-Month certified written warranty' : isPt ? '12 meses de garantia escrita' : '12 meses de garantía certificada por escrito'),
        technicalNotes: isEn
          ? 'Preliminary optical inspection. In-person micrometer paint thickness check and interior mounting clip inspection recommended at the atelier.'
          : isPt
          ? 'Inspeção visual preliminar por imagem digital. Recomenda-se aferição presencial de espessura de verniz e travas internas no atelier.'
          : 'Se observa deformación en el paño. Requiere verificar anclajes plásticos internos y posible desmontaje para escaneo de sensores.',
        requiresDisassembly: true,
      });
    }

    const promptText = `
You are the Chief Automotive Damage Appraiser of a luxury body and paint atelier.
Analyze the attached photo of the damaged vehicle:
Client note / details: "${description}"
Output Language: ${isEn ? 'ENGLISH' : isPt ? 'PORTUGUESE' : 'SPANISH'}

Return an objective technical appraisal in exact JSON structure:
- panelIdentified: Specific technical name of the affected panel (e.g. "Front right fender", "Driver door", "Rear bumper assembly").
- severity: Damage severity rating ("Leve", "Moderada", "Grave", "Estructural").
- suggestedProcess: Recommended technical restoration process (e.g. "Artisan PDR Paintless Dent Repair", "Precision bodywork + pressurized oven-baked painting", "OEM component replacement & alignment").
- estimatedDays: Estimated atelier completion time (e.g. "1 to 2 business days", "3 to 4 business days").
- warranty: Warranty coverage (e.g. "12-Month certified written warranty on paint and labor").
- technicalNotes: Detailed observations on paint layer, clear coat integrity, inner clips or structural alignment to check.
- requiresDisassembly: boolean (true if bumper or panel unbolting is required, false if direct repair).
`;

    let parsed: any = null;
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const model of candidateModels) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                { text: promptText },
              ],
            },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  panelIdentified: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  suggestedProcess: { type: Type.STRING },
                  estimatedDays: { type: Type.STRING },
                  warranty: { type: Type.STRING },
                  technicalNotes: { type: Type.STRING },
                  requiresDisassembly: { type: Type.BOOLEAN },
                },
                required: [
                  'panelIdentified',
                  'severity',
                  'suggestedProcess',
                  'estimatedDays',
                  'warranty',
                  'technicalNotes',
                  'requiresDisassembly',
                ],
              },
            },
          }),
          6000
        );

        if (response.text) {
          parsed = JSON.parse(response.text);
          break;
        }
      } catch (err: any) {
        console.warn(`Vision model ${model} unavailable or timed out:`, err?.message || err);
      }
    }

    if (!parsed) {
      parsed = {
        panelIdentified: isEn ? 'Exterior Body Panel' : isPt ? 'Painel de Carroceria Exterior' : 'Panel de carrocería exterior',
        severity: 'Moderada',
        suggestedProcess: isEn
          ? 'Artisan PDR dent removal or surface preparation with epoxy primer and oven-baked multi-stage paint.'
          : isPt
          ? 'Desamassamento artesanal com técnica PDR ou preparação com primer epóxi e pintura em estufa térmica pressurizada.'
          : 'Desabollado de chapa, preparación con primer epóxico y pintura bicapa al horno.',
        estimatedDays: isEn ? '3 to 4 business days' : isPt ? '3 a 4 dias úteis' : '3 a 4 días hábiles',
        warranty: workshopInfo?.warranty || (isEn ? '12-Month certified written warranty' : isPt ? '12 meses de garantia escrita' : '12 meses de garantía certificada por escrito'),
        technicalNotes: isEn
          ? 'Preliminary optical inspection. Panel gaps and inner structural clips will be validated upon vehicle check-in at the atelier.'
          : isPt
          ? 'Inspeção visual preliminar por imagem digital. Recomenda-se aferição presencial de espessura de verniz e travas internas no atelier.'
          : 'Inspección preliminar por imagen. Se corroborará el anclaje interior al ingresar el vehículo al taller.',
        requiresDisassembly: true,
      };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-damage:', error);
    const isEn = req.body.language === 'en';
    const isPt = req.body.language === 'pt';
    return res.json({
      panelIdentified: isEn ? 'Exterior Bodywork' : isPt ? 'Carroceria Exterior' : 'Carrocería exterior',
      severity: 'Moderada',
      suggestedProcess: isEn
        ? 'Precision body restoration and oven-baked painting with digital spectrophotometer color calibration.'
        : isPt
        ? 'Funilaria de precisão e pintura em estufa térmica com colorimetria digital computadorizada.'
        : 'Tratamiento de chapa y pintura al horno con calibración de colorimetría computarizada.',
      estimatedDays: isEn ? '3 to 4 business days' : isPt ? '3 a 4 dias úteis' : '3 a 4 días hábiles',
      warranty: isEn ? '12-Month certified written warranty' : isPt ? '12 meses de garantia escrita' : '12 meses de garantía certificada por escrito',
      technicalNotes: isEn
        ? 'Preliminary appraisal. Physical atelier inspection will determine structural integrity and inner reinforcement condition.'
        : isPt
        ? 'Estimativa preliminar. A checagem física no atelier determinará a necessidade de ajuste em reforços e travas.'
        : 'Estimación preliminar. La comprobación física en taller determinará si hay afectación en nervaduras o fijaciones.',
      requiresDisassembly: true,
    });
  }
});

// Configure Vite middleware in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
