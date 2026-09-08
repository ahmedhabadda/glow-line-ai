import type {
  ClinicKnowledge,
  DashboardMetrics,
  Lead,
  ReviewSettings,
} from "@/lib/types";

export const mockKnowledge: ClinicKnowledge = {
  clinicName: "Maison Lumière Aesthetics",
  address: "14 South Molton Street, Mayfair, London W1K 5QT",
  phone: "+44 20 7946 0182",
  whatsapp: "+44 7700 900182",
  operatingHours:
    "Tue–Sat 10:00–19:00. Closed Sunday and Monday. After-hours WhatsApp and web chat remain open 24/7.",
  tone: "Warm, discreet, and precise. Never oversell. Always offer a consultation if unsure.",
  services: [
    {
      id: "svc-tox",
      name: "Anti-wrinkle consultation & treatment",
      durationMinutes: 30,
      priceGbp: 295,
    },
    {
      id: "svc-skin",
      name: "Medical-grade facial",
      durationMinutes: 60,
      priceGbp: 185,
    },
    {
      id: "svc-laser",
      name: "Laser hair reduction (small area)",
      durationMinutes: 25,
      priceGbp: 120,
    },
    {
      id: "svc-prf",
      name: "PRF under-eye rejuvenation",
      durationMinutes: 45,
      priceGbp: 450,
    },
  ],
  faqs: [
    {
      id: "faq-patch",
      question: "Do you offer patch tests?",
      answer:
        "Yes. Laser and selected peels require a patch test at least 48 hours before treatment. We can book that during your first visit.",
    },
    {
      id: "faq-deposit",
      question: "Is a deposit required?",
      answer:
        "A £50 booking deposit is taken to hold new-patient appointments. It is deducted from treatment on the day.",
    },
    {
      id: "faq-parking",
      question: "Is there parking nearby?",
      answer:
        "The closest car park is Grosvenor Hill. Bond Street and Oxford Circus stations are a short walk.",
    },
  ],
};

export const mockMetrics: DashboardMetrics = {
  activeLeads: 18,
  conversionRate: 41,
  revenueSavedGbp: 4280,
  afterHoursCaptured: 11,
};

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    patientName: "Amelia Hart",
    channel: "whatsapp",
    status: "hot",
    summary: "Wants PRF under-eyes before a wedding in six weeks. Asking for Saturday.",
    estimatedValueGbp: 450,
    createdAt: "2026-09-08T21:12:00.000Z",
    updatedAt: "2026-09-08T21:18:00.000Z",
    messages: [
      {
        id: "m1",
        role: "patient",
        body: "Hi, do you do under eye treatments? I have a wedding in October.",
        createdAt: "2026-09-08T21:12:00.000Z",
      },
      {
        id: "m2",
        role: "assistant",
        body: "Yes — we offer PRF under-eye rejuvenation at £450 for 45 minutes at Maison Lumière in Mayfair. I can hold a consultation this Saturday if that helps before October.",
        createdAt: "2026-09-08T21:13:00.000Z",
      },
      {
        id: "m3",
        role: "patient",
        body: "Saturday morning would be perfect. Can you send options?",
        createdAt: "2026-09-08T21:18:00.000Z",
      },
    ],
  },
  {
    id: "lead-2",
    patientName: "Priya Shah",
    channel: "web",
    status: "booked",
    summary: "Booked a medical-grade facial for Thursday 16:30 after hours inquiry.",
    estimatedValueGbp: 185,
    createdAt: "2026-09-08T18:04:00.000Z",
    updatedAt: "2026-09-08T18:22:00.000Z",
    messages: [
      {
        id: "m4",
        role: "patient",
        body: "Are you still open? I'd love a facial this week.",
        createdAt: "2026-09-08T18:04:00.000Z",
      },
      {
        id: "m5",
        role: "assistant",
        body: "We're closed on the floor now, but I can still qualify and hold a chair. Thursday 16:30 is available for a medical-grade facial at £185.",
        createdAt: "2026-09-08T18:05:00.000Z",
      },
    ],
  },
  {
    id: "lead-3",
    patientName: "James Whitaker",
    channel: "whatsapp",
    status: "inquired",
    summary: "Asked about anti-wrinkle pricing and whether a consult is required.",
    estimatedValueGbp: 295,
    createdAt: "2026-09-07T22:41:00.000Z",
    updatedAt: "2026-09-08T09:10:00.000Z",
    messages: [
      {
        id: "m6",
        role: "patient",
        body: "How much is Botox and do I need a consult first?",
        createdAt: "2026-09-07T22:41:00.000Z",
      },
      {
        id: "m7",
        role: "assistant",
        body: "Anti-wrinkle treatments start with a consultation. Treatment is £295 for 30 minutes. We never treat without assessing suitability first.",
        createdAt: "2026-09-07T22:42:00.000Z",
      },
    ],
  },
];

export const mockReviewSettings: ReviewSettings = {
  enabled: true,
  sendDelayHours: 24,
  googleReviewUrl: "https://g.page/r/maison-lumiere/review",
  escalateIfScoreBelow: 4,
  smsTemplate:
    "Hi {{first_name}}, it's {{clinic_name}}. How did your visit feel? Reply 1–5. If you're happy, we'll send our Google review link. If not, we'll make it right privately.",
};
