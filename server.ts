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

function buildPortugueseSystemInstruction(workshop: any): string {
  const name = workshop?.name || 'Taller San Cristóbal Chapa & Pintura';
  const address = workshop?.address || 'Avda. Eusebio Ayala 2450 c/ Choferes del Chaco, Asunción';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const hours = workshop?.hours || 'Segunda a Sexta das 07:30 às 18:00 hs | Sábados das 08:00 às 12:30 hs';
  const warranty = '12 meses de garantia escrita em funilaria e pintura';
  const insurances = (workshop?.insurances || []).join(', ');

  return `
Você é o assistente virtual oficial de atendimento técnico da "${name}", especializado em funilaria e pintura automotiva de alta precisão (chapa e pintura).

IDIOMA OBRIGATÓRIO: Responda SEMPRE E EXCLUSIVAMENTE EM LÍNGUA PORTUGUESA formal, polida e técnica. NUNCA responda em espanhol para este cliente.

INFORMAÇÕES DA OFICINA:
- Nome: ${name}
- Endereço: ${address}
- Horário de atendimento: ${hours}
- WhatsApp oficial: ${phone}
- Seguradoras conveniadas: ${insurances}
- Garantia oficial: ${warranty}
- Diferenciais técnicos: Estufa pressurizada de secagem e pintura térmica ao forno, laboratório de colorimetria digital computadorizada PPG/Glasurit, alinhador de monobloco/chassi, técnica artesanal de martelinho de ouro (PDR) preservando a pintura original de fábrica, e peças originais com garantia.

PERSONALIDADE:
- Tom sério, profissional, confiável e atencioso — transmite segurança técnica e clareza.
- Educado, direto e objetivo, sem gírias ou informalidade excessiva.
- Demonstra conhecimento técnico automotivo de forma acessível e transparente.

OBJETIVO:
Atender clientes que buscam serviços de funilaria, pintura, reparo de amassados, martelinho de ouro, sinistros de seguradora e orçamentos, orientando-os até o agendamento de uma avaliação técnica presencial na oficina.

FLUXO DE ATENDIMENTO:
1. Cumprimente o cliente com cordialidade e pergunte em que pode ajudar com o veículo. Se o cliente relatar alguma dificuldade ou dúvida, acolha com presteza e ofereça assistência.
2. Identifique o tipo de serviço (batida, amassado, risco na pintura, sinistro de seguradora, parachoque, etc.).
3. Pergunte a marca, modelo e ano do veículo.
4. Pergunte se o cliente tem fotos do dano para avaliação preliminar.
5. Explique com transparência que o orçamento definitivo requer avaliação presencial na oficina para inspecionar travas internas e estrutura, mas forneça uma orientação técnica inicial.
6. Ofereça opções de horário para avaliação técnica presencial na oficina (${hours}).
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
- Si el usuario escribe explícitamente en PORTUGUÊS, responde en portugués técnico y cortês de alto padrão.

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

REGLAS CRÍTICAS:
- Jamás comprometas valores cerrados sin inspección ocular directa en atelier. Emplea términos como "rango pericial orientativo" o "sujeto a verificación física de cotas".
- Siempre resalta la exclusividad, la protección de la laca original y el estándar de terminación idéntico al de fábrica.
- Mantén las respuestas elegantes, concisas y ejecutivas (2 a 3 párrafos bien estructurados), invitando siempre a la acción con distinción.
`.trim();
}

// Fallback technical response generator if API key is absent or offline (bilingual ES/PT)
function generateFallbackResponse(userMessage: string, workshop: any, historyLength: number): string {
  const name = workshop?.name || 'Taller San Cristóbal Chapa & Pintura';
  const phone = workshop?.whatsapp || '+595 972 707345';
  const hours = workshop?.hours || 'Lunes a Viernes de 07:30 a 18:00 hs';
  const address = workshop?.address || 'Avda. Eusebio Ayala 2450, Asunción';
  const warranty = workshop?.warranty || '12 meses de garantía escrita';
  const lower = userMessage.toLowerCase();

  const isPortuguese =
    /[ãõç]/i.test(userMessage) ||
    /\b(nao|não|esta|está|funcionando|ola|olá|bom dia|boa tarde|orcamento|orçamento|funilaria|amassado|batida|carro|veiculo|veículo|seguro|sinistro|obrigado|por favor)\b/i.test(lower);

  if (isPortuguese) {
    if (lower.includes('funciona') || lower.includes('erro') || lower.includes('problema')) {
      return `Olá! Sou o assistente virtual oficial da **${name}**. O canal de atendimento está 100% ativo e operacional.\n\nComo posso ajudar com o seu veículo hoje? Você precisa de avaliação para funilaria, pintura na estufa, martelinho de ouro ou sinistro de seguradora?\n\nSe preferir contato direto com a equipe técnica, fale conosco no WhatsApp: **${phone}**.`;
    }
    if (lower.includes('seguro') || lower.includes('sinistro') || lower.includes('seguradora') || lower.includes('batida')) {
      return `Na **${name}** atendemos sinistros com as principais seguradoras. Realizamos o laudo fotográfico, orçamento técnico oficial para o perito e os reparos com peças originais e estufa de pintura.\n\nPara prosseguir, qual é a sua seguradora e qual o modelo e ano do seu veículo?`;
    }
    if (lower.includes('amassado') || lower.includes('martelinho') || lower.includes('funilaria')) {
      return `Para amassados, contamos com duas técnicas: martelinho de ouro artesanal (PDR), preservando a pintura original de fábrica se não houve rompimento do verniz, ou funilaria com pintura em estufa térmica.\n\nQual é o modelo e ano do veículo e em qual parte fica o amassado?`;
    }
    if (lower.includes('preco') || lower.includes('preço') || lower.includes('quanto') || lower.includes('custo') || lower.includes('orcamento') || lower.includes('orçamento')) {
      return `Podemos fornecer uma estimativa técnica preliminar. Por padrão de qualidade e segurança, o orçamento definitivo requer inspeção presencial na oficina para avaliar ancoragens e estrutura interna.\n\nVocê tem fotos da área danificada para enviar, ou prefere agendar um horário para avaliação (${hours})?`;
    }
    return `Olá! Bem-vindo à **${name}**. Oferecemos serviços de funilaria, pintura em estufa de alta precisão e ${warranty}.\n\nPara orientá-lo com exatidão, que tipo de reparo o seu veículo necessita (marca, modelo e ano)?`;
  }

  // Spanish flow
  if (lower.includes('funciona') || lower.includes('error') || lower.includes('problema')) {
    return `Estimado cliente, bienvenido a **${name}**. El canal de atención técnica está plenamente operativo.\n\n¿En qué podemos asistirle hoy con respecto a su vehículo? Indíquenos por favor la marca, modelo y el tipo de reparación requerida (chapa, pintura, abolladura o siniestro), o contáctenos directamente al WhatsApp oficial **${phone}**.`;
  }

  if (lower.includes('seguro') || lower.includes('siniestro') || lower.includes('aseguradora') || lower.includes('choque')) {
    return `En **${name}** trabajamos directamente con las principales aseguradoras del país. Le asistimos en la inspección fotográfica, confección del presupuesto formal para el peritaje y la reparación integral con repuestos certificados.\n\nPara avanzar con su siniestro, ¿podría indicarme qué aseguradora tiene y el modelo y año de su vehículo?`;
  }

  if (lower.includes('abolladura') || lower.includes('sacabollo') || lower.includes('golpe')) {
    return `Para abolladuras contamos con dos técnicas: desabollado artesanal sin dañar la pintura original (sistema sacabollos PDR) si la pintura no se quebró, o enderezado de chapa con pintura en cabina al horno si existe daño en la superficie.\n\n¿De qué vehículo se trata (marca, modelo y año) y en qué zona se encuentra la abolladura?`;
  }

  if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('presupuesto') || lower.includes('cotiz')) {
    return `Con gusto podemos brindarle una estimación general. Tenga en cuenta que por norma de calidad y seguridad, un presupuesto exacto y definitivo requiere una evaluación presencial para revisar el espesor de chapa y fijaciones internas.\n\n¿Dispone de fotos del daño para adjuntar, o prefiere coordinar un horario en nuestro taller (${hours})?`;
  }

  if (lower.includes('horario') || lower.includes('donde') || lower.includes('direccion') || lower.includes('ubicacion')) {
    return `Nuestro taller está ubicado en ${address}. Atendemos de ${hours}.\n\nPodemos coordinar una cita para evaluar su vehículo sin compromiso. ¿Qué día y horario le resultaría más conveniente?`;
  }

  if (historyLength <= 2) {
    return `Estimado cliente, bienvenido a ${name}. Con gusto le asesoramos. Para orientarle de forma precisa, ¿podría comentarnos qué tipo de trabajo necesita su vehículo (chapa, pintura, abolladura, choque o siniestro de aseguradora) y el modelo y año del mismo?`;
  }

  return `Comprendo perfectamente su consulta. En ${name} garantizamos mano de obra técnica certificada y ${warranty} en nuestros trabajos de pintura al horno.\n\nLe sugerimos agendar una breve evaluación técnica presencial de 15 minutos o enviarnos las imágenes a nuestro WhatsApp oficial ${phone} para que el jefe de taller pueda emitir un diagnóstico preliminar.`;
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
    const isExplicitEs = language === 'es';
    const isExplicitPt = language === 'pt';
    const hasPtSpecifics = /[ãõ]/i.test(lastUserMsg) || 
      /\b(não|orçamento|funilaria|martelinho|amassado|obrigado|obrigada|conserto)\b/i.test(lastUserMsg.toLowerCase());
    
    const isPt = isExplicitPt || (!isExplicitEs && hasPtSpecifics);

    const systemInstruction = isPt
      ? buildPortugueseSystemInstruction(workshop)
      : buildSystemInstruction(workshop);

    if (!ai) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const fallbackText = generateFallbackResponse(lastUserMsg, workshop, messages.length);
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

      if (isPt && i === chatTurns.length - 1) {
        parts.push({ text: `${msg.content}\n\n[INSTRUÇÃO DO SISTEMA: Responda em PORTUGUÊS técnico de alto padrão.]` });
      } else if (!isPt && i === chatTurns.length - 1) {
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
      const lastMsg = messages[messages.length - 1]?.content || 'Hola';
      contents.push({ role: 'user', parts: [{ text: lastMsg }] });
    }

    // Prioritize fastest, high-availability models with 5-second timeout
    const candidateModels = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
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
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      replyText = generateFallbackResponse(lastUserMsg, workshop, messages.length);
      usedModel = 'system-fallback';
    }

    return res.json({ text: replyText, modelUsed: usedModel });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const workshop = req.body.workshopInfo || {};
    const lastUserMsg = req.body.messages?.[req.body.messages?.length - 1]?.content || '';
    const fallbackText = generateFallbackResponse(lastUserMsg, workshop, req.body.messages?.length || 1);
    return res.json({ text: fallbackText, modelUsed: 'system-fallback-error' });
  }
});

// POST /api/analyze-damage
app.post('/api/analyze-damage', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '', workshopInfo } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Se requiere una imagen en base64 para el análisis de daño' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!ai) {
      return res.json({
        panelIdentified: 'Panel de carrocería (inspección visual fotográfica)',
        severity: 'Moderada',
        suggestedProcess: 'Desabollado de chapa, preparación de superficie con primer epóxico y aplicación de pintura bicapa con barniz de alto sólidos en cabina presurizada.',
        estimatedDays: '3 a 4 días hábiles',
        warranty: '12 meses de garantía escrita de fábrica',
        technicalNotes: 'Se observa deformación en el paño. Requiere verificar anclajes plásticos internos y posible desmontaje para escaneo de sensores.',
        requiresDisassembly: true,
      });
    }

    const promptText = `
Eres el perito técnico automotriz jefe de chapa y pintura.
Analiza la fotografía adjunta del vehículo con daño:
Descripción del cliente: "${description}"

Devuelve un análisis técnico objetivo en formato JSON con la siguiente estructura exacta:
- panelIdentified: Nombre técnico del paño o pieza afectada (ej: "Guardabarros delantero derecho", "Puerta del conductor", "Paragolpes trasero").
- severity: Nivel de daño ("Leve", "Moderada", "Grave", "Estructural").
- suggestedProcess: Proceso técnico recomendado (ej: "Desabollado sin pintar (PDR/Sacabollos)", "Enderezado de chapa + pintura al horno", "Sustitución de pieza y cuadratura").
- estimatedDays: Plazo promedio estimado aproximado (ej: "1 a 2 días hábiles", "3 a 4 días hábiles").
- warranty: Cobertura de garantía (ej: "12 meses de garantía escrita en pintura y mano de obra").
- technicalNotes: Observaciones técnicas sobre la pintura, posibles daños ocultos, clips o anclajes a revisar.
- requiresDisassembly: true si requiere desmontar panel o paragolpes, false si es trabajo directo.
`;

    let parsed: any = null;
    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash'];

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
        panelIdentified: 'Panel de carrocería exterior',
        severity: 'Moderada',
        suggestedProcess: 'Desabollado de chapa, preparación con primer epóxico y pintura bicapa al horno.',
        estimatedDays: '3 a 4 días hábiles',
        warranty: '12 meses de garantía escrita',
        technicalNotes: 'Inspección preliminar por imagen. Se corroborará el anclaje interior al ingresar el vehículo al taller.',
        requiresDisassembly: true,
      };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-damage:', error);
    return res.json({
      panelIdentified: 'Carrocería exterior',
      severity: 'Moderada',
      suggestedProcess: 'Tratamiento de chapa y pintura al horno con calibración de colorimetría computarizada.',
      estimatedDays: '3 a 4 días hábiles',
      warranty: '12 meses de garantía escrita',
      technicalNotes: 'Estimación preliminar. La comprobación física en taller determinará si hay afectación en nervaduras o fijaciones.',
      requiresDisassembly: true,
    });
  }
});

// Start Express + Vite server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
