export type LeadStatus = "hot" | "booked" | "inquired";

export type ServiceItem = {
  id: string;
  name: string;
  durationMinutes: number;
  priceGbp: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ClinicKnowledge = {
  clinicName: string;
  address: string;
  phone: string;
  whatsapp: string;
  operatingHours: string;
  services: ServiceItem[];
  faqs: FaqItem[];
  tone: string;
};

export type LeadMessage = {
  id: string;
  role: "patient" | "assistant";
  body: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  patientName: string;
  channel: "whatsapp" | "web";
  status: LeadStatus;
  summary: string;
  estimatedValueGbp: number;
  createdAt: string;
  updatedAt: string;
  messages: LeadMessage[];
};

export type ReviewSettings = {
  enabled: boolean;
  sendDelayHours: number;
  smsTemplate: string;
  googleReviewUrl: string;
  escalateIfScoreBelow: number;
};

export type DashboardMetrics = {
  activeLeads: number;
  conversionRate: number;
  revenueSavedGbp: number;
  afterHoursCaptured: number;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};
