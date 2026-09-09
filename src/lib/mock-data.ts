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
    {
      id: "svc-filler",
      name: "Dermal filler (lips or cheeks)",
      durationMinutes: 40,
      priceGbp: 380,
    },
    {
      id: "svc-thread",
      name: "PDO thread lift (jawline)",
      durationMinutes: 50,
      priceGbp: 650,
    },
    {
      id: "svc-peel",
      name: "Signature brightening peel",
      durationMinutes: 35,
      priceGbp: 165,
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
    {
      id: "faq-cancel",
      question: "What is your cancellation policy?",
      answer:
        "We ask for 24 hours' notice. Cancellations inside that window forfeit the booking deposit.",
    },
    {
      id: "faq-pregnant",
      question: "Can I have treatment while pregnant or breastfeeding?",
      answer:
        "We don't perform injectables or laser treatments during pregnancy or breastfeeding. Medical-grade facials and peels are assessed case by case at consultation.",
    },
  ],
};

export const mockMetrics: DashboardMetrics = {
  activeLeads: 27,
  conversionRate: 47,
  revenueSavedGbp: 8940,
  afterHoursCaptured: 19,
};

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    patientName: "Amelia Hart",
    channel: "whatsapp",
    status: "hot",
    summary: "Wants PRF under-eyes before a wedding in six weeks. Asking for Saturday.",
    estimatedValueGbp: 450,
    createdAt: "2026-09-09T21:12:00.000Z",
    updatedAt: "2026-09-09T21:18:00.000Z",
    messages: [
      {
        id: "m1",
        role: "patient",
        body: "Hi, do you do under eye treatments? I have a wedding in October.",
        createdAt: "2026-09-09T21:12:00.000Z",
      },
      {
        id: "m2",
        role: "assistant",
        body: "Yes — we offer PRF under-eye rejuvenation at £450 for 45 minutes at Maison Lumière in Mayfair. I can hold a consultation this Saturday if that helps before October.",
        createdAt: "2026-09-09T21:13:00.000Z",
      },
      {
        id: "m3",
        role: "patient",
        body: "Saturday morning would be perfect. Can you send options?",
        createdAt: "2026-09-09T21:18:00.000Z",
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
    createdAt: "2026-09-09T18:04:00.000Z",
    updatedAt: "2026-09-09T18:22:00.000Z",
    messages: [
      {
        id: "m4",
        role: "patient",
        body: "Are you still open? I'd love a facial this week.",
        createdAt: "2026-09-09T18:04:00.000Z",
      },
      {
        id: "m5",
        role: "assistant",
        body: "We're closed on the floor now, but I can still qualify and hold a chair. Thursday 16:30 is available for a medical-grade facial at £185.",
        createdAt: "2026-09-09T18:05:00.000Z",
      },
    ],
  },
  {
    id: "lead-3",
    patientName: "Camille Dubois",
    channel: "whatsapp",
    status: "hot",
    summary: "Asking about a PDO thread lift after seeing a friend's results. Wants a consult this week.",
    estimatedValueGbp: 650,
    createdAt: "2026-09-09T23:47:00.000Z",
    updatedAt: "2026-09-09T23:52:00.000Z",
    messages: [
      {
        id: "m8",
        role: "patient",
        body: "My friend had a thread lift with you and looks incredible. How much and when can I come in?",
        createdAt: "2026-09-09T23:47:00.000Z",
      },
      {
        id: "m9",
        role: "assistant",
        body: "That's lovely to hear. A PDO thread lift for the jawline is £650 and takes about 50 minutes, always preceded by a consultation. I can hold a slot this week — mornings or afternoons?",
        createdAt: "2026-09-09T23:49:00.000Z",
      },
      {
        id: "m10",
        role: "patient",
        body: "Afternoons work better. Tuesday if possible.",
        createdAt: "2026-09-09T23:52:00.000Z",
      },
    ],
  },
  {
    id: "lead-4",
    patientName: "James Whitaker",
    channel: "whatsapp",
    status: "inquired",
    summary: "Asked about anti-wrinkle pricing and whether a consult is required.",
    estimatedValueGbp: 295,
    createdAt: "2026-09-08T22:41:00.000Z",
    updatedAt: "2026-09-09T09:10:00.000Z",
    messages: [
      {
        id: "m6",
        role: "patient",
        body: "How much is Botox and do I need a consult first?",
        createdAt: "2026-09-08T22:41:00.000Z",
      },
      {
        id: "m7",
        role: "assistant",
        body: "Anti-wrinkle treatments start with a consultation. Treatment is £295 for 30 minutes. We never treat without assessing suitability first.",
        createdAt: "2026-09-08T22:42:00.000Z",
      },
    ],
  },
  {
    id: "lead-5",
    patientName: "Sophie Bennett",
    channel: "web",
    status: "hot",
    summary: "Lip filler enquiry at 1am, wants the earliest available appointment.",
    estimatedValueGbp: 380,
    createdAt: "2026-09-08T01:14:00.000Z",
    updatedAt: "2026-09-08T01:20:00.000Z",
    messages: [
      {
        id: "m11",
        role: "patient",
        body: "Do you do lip filler? What's your soonest appointment?",
        createdAt: "2026-09-08T01:14:00.000Z",
      },
      {
        id: "m12",
        role: "assistant",
        body: "We do — dermal filler for lips or cheeks is £380 for 40 minutes. Our earliest chair is Tuesday at 10:30. Shall I hold it for you with a £50 deposit?",
        createdAt: "2026-09-08T01:16:00.000Z",
      },
      {
        id: "m13",
        role: "patient",
        body: "Yes please, hold Tuesday.",
        createdAt: "2026-09-08T01:20:00.000Z",
      },
    ],
  },
  {
    id: "lead-6",
    patientName: "Olivia Chen",
    channel: "whatsapp",
    status: "booked",
    summary: "Booked a signature brightening peel after an after-hours WhatsApp chat.",
    estimatedValueGbp: 165,
    createdAt: "2026-09-07T20:33:00.000Z",
    updatedAt: "2026-09-07T20:41:00.000Z",
    messages: [
      {
        id: "m14",
        role: "patient",
        body: "Hi! Do you have anything for dull skin before an event next weekend?",
        createdAt: "2026-09-07T20:33:00.000Z",
      },
      {
        id: "m15",
        role: "assistant",
        body: "Our signature brightening peel is popular before events — £165 for 35 minutes with visible glow in 2–3 days. I can book you Wednesday at 11:00.",
        createdAt: "2026-09-07T20:35:00.000Z",
      },
      {
        id: "m16",
        role: "patient",
        body: "Wednesday 11 works, thank you!",
        createdAt: "2026-09-07T20:41:00.000Z",
      },
    ],
  },
  {
    id: "lead-7",
    patientName: "Daniel Foster",
    channel: "web",
    status: "inquired",
    summary: "General question about laser hair reduction, no firm date yet.",
    estimatedValueGbp: 120,
    createdAt: "2026-09-07T22:58:00.000Z",
    updatedAt: "2026-09-07T22:58:00.000Z",
    messages: [
      {
        id: "m17",
        role: "patient",
        body: "How many sessions of laser hair reduction do most people need?",
        createdAt: "2026-09-07T22:58:00.000Z",
      },
      {
        id: "m18",
        role: "assistant",
        body: "Most patients see best results over 6–8 sessions, spaced four to six weeks apart. A small area session is £120. Would you like a consultation to assess your skin and hair type first?",
        createdAt: "2026-09-07T22:59:00.000Z",
      },
    ],
  },
  {
    id: "lead-8",
    patientName: "Isabelle Moreau",
    channel: "whatsapp",
    status: "hot",
    summary: "Returning patient asking to rebook PRF under-eyes, mentions a Saturday deadline.",
    estimatedValueGbp: 450,
    createdAt: "2026-09-09T20:02:00.000Z",
    updatedAt: "2026-09-09T20:06:00.000Z",
    messages: [
      {
        id: "m19",
        role: "patient",
        body: "Hi, it's Isabelle again — can I rebook the under-eye treatment I had in the spring?",
        createdAt: "2026-09-09T20:02:00.000Z",
      },
      {
        id: "m20",
        role: "assistant",
        body: "Lovely to hear from you again, Isabelle. PRF under-eye rejuvenation is still £450 for 45 minutes. I can offer Saturday at 12:15 — shall I hold it?",
        createdAt: "2026-09-09T20:06:00.000Z",
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