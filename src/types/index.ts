export interface WorkshopInfo {
  name: string;
  slogan: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  hours: string;
  services: string[];
  differentiators: string[];
  insurances: string[];
  warranty: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  imageData?: string;
  mimeType?: string;
  actionOptions?: Array<{
    label: string;
    action: string;
    value?: string;
  }>;
  technicalEstimate?: {
    panel: string;
    severity: string;
    process: string;
    estimatedDays: string;
    warranty: string;
  };
  isAudioPlaying?: boolean;
}

export interface VehicleDamage {
  panelId: string;
  panelName: string;
  damageType: 'rayon' | 'abolladura' | 'choque' | 'pintura' | 'siniestro';
  damageLabel: string;
  notes?: string;
}

export interface AppointmentBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  carMake: string;
  carModel: string;
  carYear: string;
  plate?: string;
  date: string;
  timeSlot: string;
  serviceType: string;
  hasInsurance: boolean;
  insuranceCompany?: string;
  hasPhotos: boolean;
  notes?: string;
  createdAt: string;
}

export type AppLanguage = 'es' | 'pt';

export interface DamageAnalysisResult {
  panelIdentified: string;
  severity: 'Leve' | 'Moderada' | 'Grave' | 'Estructural';
  suggestedProcess: string;
  estimatedDays: string;
  warranty: string;
  technicalNotes: string;
  requiresDisassembly: boolean;
}
