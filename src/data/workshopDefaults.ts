import { WorkshopInfo } from '../types';

export const DEFAULT_WORKSHOP_INFO: WorkshopInfo = {
  name: 'San Cristóbal · Atelier de Carrocería & Pintura de Alta Gama',
  slogan: 'Artesanía pericial, pintura al horno de atmósfera presurizada y garantía certificada',
  address: 'Avda. Eusebio Ayala 2450 c/ Choferes del Chaco',
  city: 'Asunción, Paraguay',
  phone: '+595 972 707345',
  whatsapp: '+595 972 707345',
  hours: 'Lunes a Viernes de 07:30 a 18:00 hs | Sábados de 08:00 a 12:30 hs (Atención con Cita Previa)',
  services: [
    'Pintura tricapa y bicapa al horno en cabina presurizada de atmósfera estéril',
    'Restauración de chapa y sacabollos artesanal PDR (conservando pintura de fábrica)',
    'Banco de estiramiento y calibración láser de chasis y monobloco',
    'Laboratorio espectrofotométrico de colorimetría computarizada PPG / Glasurit',
    'Tratamiento cerámico 9H y sellado de laca con acabado espejo de exposición',
    'Gestión pericial de siniestros con aseguradoras de primera línea',
  ],
  differentiators: [
    'Cabina presurizada presurizada con flujo laminar térmico y filtrado molecular',
    'Garantía oficial por escrito de 12 meses en acabado, brillo y adherencia',
    'Colorimetría digital espectrofotométrica por código VIN original del fabricante',
    'Convenio directo con las principales compañías aseguradoras premium',
    'Montaje milimétrico con repuestos originales homologados por fábrica',
  ],
  insurances: [
    'Mapfre Seguros',
    'Aseguradora Tajy',
    'Sancor Seguros',
    'La Consolidada',
    'Aseguradora Yacyreta',
    'Seguros El Comercio',
    'Panal Seguros',
    'Rumbos Seguros',
  ],
  warranty: '12 meses de garantía certificada por escrito en carrocería y pintura',
};

export const INITIAL_ASSISTANT_MESSAGE = 
  'Bienvenido al servicio de atención exclusiva de ' +
  DEFAULT_WORKSHOP_INFO.name +
  '. Soy su asesor técnico de taller. ¿En qué podemos asistirle con su vehículo hoy?';

export const INITIAL_ASSISTANT_MESSAGE_PT = 
  'Seja muito bem-vindo ao atendimento exclusivo da ' +
  DEFAULT_WORKSHOP_INFO.name +
  '. Sou seu assessor técnico especializado em funilaria e pintura de alta gama. Em que podemos ajudá-lo com seu veículo hoje?';

export const QUICK_ACTIONS = [
  { label: 'Cotizar Chapa & Pintura de Alta Gama', action: 'service', value: 'Chapa y Pintura al Horno' },
  { label: 'Sacabollos Artesanal PDR (Pintura Original)', action: 'service', value: 'Reparación de abolladuras PDR' },
  { label: 'Gestión Pericial de Siniestro / Seguro', action: 'insurance', value: 'Siniestro con Compañía de Seguros' },
  { label: 'Agendar Evaluación Privada en Atelier', action: 'book', value: 'Agendar cita de inspección' },
  { label: 'Atención Directa por WhatsApp VIP', action: 'whatsapp', value: 'whatsapp' },
];

export const VEHICLE_PANELS = [
  { id: 'paragolpes_delantero', name: 'Paragolpes Delantero', section: 'Frente' },
  { id: 'capo', name: 'Capó / Trompa', section: 'Frente' },
  { id: 'guardabarros_delantero_izq', name: 'Guardabarros Delantero Izq.', section: 'Lateral' },
  { id: 'guardabarros_delantero_der', name: 'Guardabarros Delantero Der.', section: 'Lateral' },
  { id: 'puerta_delantera_izq', name: 'Puerta Delantera Izquierda', section: 'Lateral' },
  { id: 'puerta_delantera_der', name: 'Puerta Delantera Derecha', section: 'Lateral' },
  { id: 'puerta_trasera_izq', name: 'Puerta Trasera Izquierda', section: 'Lateral' },
  { id: 'puerta_trasera_der', name: 'Puerta Trasera Derecha', section: 'Lateral' },
  { id: 'zocalo_izq', name: 'Zócalo / Umbral Izquierdo', section: 'Lateral' },
  { id: 'zocalo_der', name: 'Zócalo / Umbral Derecho', section: 'Lateral' },
  { id: 'techo', name: 'Techo / Panel Superior', section: 'Superior' },
  { id: 'guardabarros_trasero_izq', name: 'Guardabarros / Lateral Tras. Izq.', section: 'Trasero' },
  { id: 'guardabarros_trasero_der', name: 'Guardabarros / Lateral Tras. Der.', section: 'Trasero' },
  { id: 'porton_baul', name: 'Portón Trasero / Baúl', section: 'Trasero' },
  { id: 'paragolpes_trasero', name: 'Paragolpes Trasero', section: 'Trasero' },
];
