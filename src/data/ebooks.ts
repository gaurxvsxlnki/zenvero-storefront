export type EbookCategory =
| 'AI & Technology'
| 'Business'
| 'Side Hustles'
| 'Marketing'
| 'Productivity'
| 'Finance'
| 'Career'
| 'Entrepreneurship';

export interface ChapterItem {
number: string;
title: string;
summary: string;
pages: string;
}

export interface PreviewSpread {
  pageNumber: number;
  image: string;
}

export interface Ebook {
id: string;
title: string;
subtitle: string;
author: string;
authorRole: string;
description: string;
longDescription: string;
category: EbookCategory;
coverImage: string;
coverPalette: {
bg: string;
accent: string;
spine: string;
badge: string;
};
pdfFile: string; // Secure vault asset key (never raw public bucket link)
price: number;
salePrice?: number;
pages: number;
rating: number;
reviewsCount: number;
format: string;
preview: PreviewSpread[];
chapters: ChapterItem[];
whoIsThisFor: string[];
featured: boolean;
bestSeller: boolean;
bestSellerRank?: number;
newRelease: boolean;
createdAt?: string;
}

export interface OrderRecord {
id: string;
customerName: string;
customerEmail: string;
items: {
ebookId: string;
title: string;
price: number;
}[];
subtotal: number;
discount: number;
total: number;
date: string;
downloadToken: string;
status: 'Completed' | 'Verified';
}

export const CATEGORIES: {
name: EbookCategory;
tagline: string;
countLabel: string;
accentTone: string;
}[] = [
{
name: 'AI & Technology',
tagline: 'Applied LLMs, agent workflows & modern engineering',
countLabel: '18 Editions',
accentTone: '#2A5C4D',
},
{
name: 'Business',
tagline: 'Operating systems, calm scale & strategic clarity',
countLabel: '24 Editions',
accentTone: '#5C5346',
},
{
name: 'Side Hustles',
tagline: 'Solo digital assets, micro-products & weekend builds',
countLabel: '15 Editions',
accentTone: '#6E5A4F',
},
{
name: 'Marketing',
tagline: 'Editorial positioning, organic flywheels & copy craft',
countLabel: '21 Editions',
accentTone: '#3F5E5A',
},
{
name: 'Productivity',
tagline: 'Deep focus architecture, cognitive ergonomics & tempo',
countLabel: '19 Editions',
accentTone: '#4D5849',
},
{
name: 'Finance',
tagline: 'Asymmetric capital allocation & personal treasury',
countLabel: '14 Editions',
accentTone: '#59524C',
},
{
name: 'Career',
tagline: 'High-leverage positioning, negotiation & principal craft',
countLabel: '16 Editions',
accentTone: '#49545E',
},
{
name: 'Entrepreneurship',
tagline: 'Bootstrapped sovereignty, pricing psychology & moats',
countLabel: '22 Editions',
accentTone: '#2A5C4D',
},
];

export const INITIAL_EBOOKS: Ebook[] = [
{
id: 'zv-001',
title: 'The Calm Compounding Operator',
subtitle: 'Designing High-Margin Digital Systems Without Operational Chaos',
author: 'ZenVero Editorial Studio',
authorRole: 'Editorial Studio',
description:
'A tactile field manual on replacing frantic growth loops with quiet, durable business architecture and asynchronous execution.',
longDescription:
'Most modern businesses collapse under the weight of their own complexity. The Calm Compounding Operator distills practical principles for building profitable independent software and media businesses into an architectural blueprint. You will learn how to prune low-leverage meetings, construct self-documenting workflows, and build products that appreciate in value every quarter.',
category: 'Business',
coverImage:
'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#EAE4DC',
accent: '#2A5C4D',
spine: '#D6CEC2',
badge: 'EDITION NO. 01',
},
pdfFile: '/ebooks/calm-compounding-operator.pdf',
price: 38,
salePrice: 29,
pages: 60,
rating: 4.9,
reviewsCount: 312,
format: 'PDF',
featured: true,
bestSeller: true,
bestSellerRank: 1,
newRelease: false,
whoIsThisFor: [
  'Independent founders and operators building calmer, more durable businesses',
  'Business operators looking to reduce complexity, context switching, and reactive work',
  'Consultants and knowledge workers turning expertise into reusable systems and assets',
  'Designers, builders, and solo operators seeking structured and repeatable operating systems',
],
chapters: [
{
number: '01',
title: 'The Nature of Calm Systems',
summary:
'The Chaos Trap, subtractive versus additive complexity, the Three-Pillar Architecture, and a practical checklist for designing calmer systems.',
pages: 'pp. 06 – 07',
},
{
number: '02',
title: 'High Margins as an Operational Filte',
summary:
'The true cost of low-margin work, the Margin Stack Equation, the Margin Stack framework, and an offer quality audit.',
pages: 'pp. 08 - 10',
},
{
number: '03',
    title: "The Operator's Identity Shift",
    summary:
      'Moving from hustle to leverage through three identity archetypes, identity evolution, and practical delegation thresholds.',
    pages: 'pp. 11 – 13',
  },
  {
    number: '04',
    title: 'The One-Person Operating System',
    summary:
      'Architecting the solo engine, the Unified Capture Protocol, weekly operating cadence, and practical field protocols.',
    pages: 'pp. 15 – 17',
  },
  {
    number: '05',
    title: 'Remove Before You Automate',
    summary:
      'Avoiding automated chaos with a subtractive approach: delete, simplify, standardize, then automate.',
    pages: 'pp. 18 – 19',
  },
  {
    number: '06',
    title: 'The Quiet Sales System',
    summary:
      'Selling without high-pressure noise through asynchronous pipeline architecture and three quiet sales metrics.',
    pages: 'pp. 20 – 21',
  },
  {
    number: '07',
    title: 'Productize the Knowledge',
    summary:
      'Turning advisory labour into reusable assets through a productization pipeline and digital edition packaging.',
    pages: 'pp. 22 – 23',
  },
  {
    number: '08',
    title: 'The Documentation Engine',
    summary:
      'Using living documentation as infrastructure with executive decision logs and a one-page SOP architecture.',
    pages: 'pp. 24 – 25',
  },
  {
    number: '09',
    title: 'The Cost of Context Switching',
    summary:
      'Understanding the cost of fragmented attention and building a monotasking and focus-block architecture.',
    pages: 'pp. 27 – 28',
  },
  {
    number: '10',
    title: 'Building a Small Tool Stack',
    summary:
      'Reducing software sprawl with a focused four-node architecture and a deliberately small operating stack.',
    pages: 'pp. 29 – 30',
  },
  {
    number: '11',
    title: 'The Exception Tax',
    summary:
      'Defending operational boundaries and using an exception decision protocol to prevent custom-work overload.',
    pages: 'pp. 31 – 32',
  },
  {
    number: '12',
    title: 'The Customer Experience System',
    summary:
      'Designing calm onboarding and support systems that reduce friction while minimizing unnecessary customer-support load.',
    pages: 'pp. 33 – 36',
  },
  {
    number: '13',
    title: 'The Asset Library',
    summary:
      'Building institutional capital through an organized asset library and a system for compounding reusable business assets.',
    pages: 'pp. 38 – 39',
  },
  {
    number: '14',
    title: 'The Feedback Loop',
    summary:
      'Filtering useful signals from noise and establishing a continuous improvement cadence.',
    pages: 'pp. 40 – 41',
  },
  {
    number: '15',
    title: 'Designing for Durability',
    summary:
      'Building resilient systems with durability principles, a resilience matrix, and practical fire-drill preparation.',
    pages: 'pp. 42 – 44',
  },
  {
    number: '16',
    title: 'The Calm Growth Model',
    summary:
      'Using scale gates and a sustainable expansion matrix to grow without recreating operational chaos.',
    pages: 'pp. 45 – 47',
  },
  {
    number: '17',
    title: 'The 30-Day Operating Reset',
    summary:
      'A four-week reset covering the initial audit, system cleanup, and progressive systemization.',
    pages: 'pp. 49 – 50',
  },
  {
    number: '18',
    title: 'The Quiet Business Blueprint',
    summary:
      'A five-layer operating stack with constitutional guardrails for building a calmer, more durable business.',
    pages: 'pp. 51 – 52',
  },
  {
    number: '19',
    title: 'The Operating Template Suite',
    summary:
      'A collection of 20 production-ready operating templates designed for practical implementation.',
    pages: 'pp. 53 – 57',
  },
  {
    number: '20',
    title: 'The Peaceful Enterprise & Manifesto',
    summary:
      'Final synthesis, operator directives, and the principles that bring the calm-compounding system together.',
    pages: 'pp. 58 – 60',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-002',
title: 'Applied Agentic Workflows',
subtitle: 'Engineering Reliable LLM Pipelines for Solo Builders & Research Teams',
author: 'Dr. Elena Rostova',
authorRole: 'Applied AI Researcher & Former Staff ML Architect',
description:
'Skip superficial prompt tricks. Learn deterministic evaluation harnesses, structured synthesis, and local-first AI pipelines.',
longDescription:
'Large Language Models become transformative only when wrapped in deterministic engineering principles. Dr. Elena Rostova walks through real-world schemas, structured JSON validation, retrieval evaluation matrices, and human-in-the-loop review interfaces that turn brittle prototypes into dependable daily tools.',
category: 'AI & Technology',
coverImage:
'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#E5EAE7',
accent: '#2A5C4D',
spine: '#CAD4CE',
badge: 'EDITION NO. 02',
},
pdfFile: '/ebooks/calm-compounding-operator.pdf',
price: 44,
salePrice: 34,
pages: 312,
rating: 4.95,
reviewsCount: 428,
format: 'PDF + Code Companion',
featured: true,
bestSeller: true,
bestSellerRank: 2,
newRelease: true,
createdAt: '2025-02-04',
whoIsThisFor: [
'Full-stack engineers transitioning into production AI engineering',
'Technical founders building specialized research and synthesis workflows',
'Product architects designing calm, non-chat AI interfaces',
],
chapters: [
{
number: '01',
title: 'Beyond the Chat Box: Spatial & Artifact UI',
summary: 'Why document-centric and canvas workflows outperform conversational threads.',
pages: 'pp. 01 – 68',
},
{
number: '02',
title: 'Deterministic Schema Contracts',
summary: 'Enforcing typed boundaries, fallback cascades, and semantic verification.',
pages: 'pp. 69 – 148',
},
{
number: '03',
title: 'Small Context, High Signal Retrieval',
summary: 'Hybrid lexical + dense ranking patterns that prevent context dilution.',
pages: 'pp. 149 – 238',
},
{
number: '04',
title: 'Golden Dataset Evals in 30 Minutes',
summary: 'Building automated regression suites before deploying any model update.',
pages: 'pp. 239 – 312',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-003',
title: 'Editorial Positioning',
subtitle: 'How Category-Defining Brands Write, Package, and Command Authority',
author: 'Clara Vance-Beaumont',
authorRole: 'Creative Director & Editorial Strategist',
description:
'Transform commodity products into coveted intellectual objects through precision storytelling, taste, and visual restraint.',
longDescription:
'In saturated digital markets, features are copied in weeks, while taste and editorial voice remain uncopyable moats. Clara Vance-Beaumont deconstructs how the world’s most respected independent brands craft manifestos, naming architectures, and launch essays that convert skeptical readers into lifelong patrons.',
category: 'Marketing',
coverImage:
'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#EFE9E1',
accent: '#5C4B3E',
spine: '#DCD2C5',
badge: 'EDITION NO. 03',
},
pdfFile: 'vault://zenvero-editions/editorial-positioning.pdf',
price: 35,
salePrice: 28,
pages: 216,
rating: 4.85,
reviewsCount: 194,
format: 'PDF + Swipe Monograph',
featured: true,
bestSeller: true,
bestSellerRank: 3,
newRelease: false,
createdAt: '2025-01-22',
whoIsThisFor: [
'Founders and marketers tired of noisy urgency tactics and fake scarcity',
'Writers, newsletter publishers, and creative directors building intellectual equity',
'Product designers who want their copy to carry as much weight as their UI',
],
chapters: [
{
number: '01',
title: 'The Anatomy of Taste as a Competitive Moat',
summary: 'Why restraint and specificity signal immediate competence.',
pages: 'pp. 05 – 54',
},
{
number: '02',
title: 'Naming Architectures & Lexicons',
summary: 'Creating proprietary vocabulary that customers naturally repeat.',
pages: 'pp. 55 – 118',
},
{
number: '03',
title: 'The Flagship Essay Launch Model',
summary: 'Turning product releases into cultural reference pieces.',
pages: 'pp. 119 – 216',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-004',
title: 'Micro-Monographs & Digital Assets',
subtitle: 'The Weekend Blueprint for Building $10k/Mo Niche Knowledge Products',
author: 'Julian Mercer',
authorRole: 'Independent Publisher & Digital Economist',
description:
'A step-by-step tactical guide to scoping, researching, packaging, and selling high-utility specialized guides and templates.',
longDescription:
'You do not need a million followers to build a lucrative digital library. Julian Mercer shows how domain practitioners package specific operational solutions—from architectural checklists to financial valuation templates—into evergreen digital editions that sell daily without ad spend.',
category: 'Side Hustles',
coverImage:
'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#EBE6DF',
accent: '#2A5C4D',
spine: '#D5CEC3',
badge: 'EDITION NO. 04',
},
pdfFile: 'vault://zenvero-editions/micro-monographs.pdf',
price: 32,
salePrice: 24,
pages: 184,
rating: 4.8,
reviewsCount: 267,
format: 'PDF + Calc Sheets',
featured: true,
bestSeller: true,
bestSellerRank: 4,
newRelease: true,
createdAt: '2025-02-10',
whoIsThisFor: [
'Senior specialists with deep tacit knowledge looking for recurring asset income',
'Creators wanting to move away from sponsorships into owned products',
'Engineers and analysts who prefer writing structured guides over recording videos',
],
chapters: [
{
number: '01',
title: 'Mining Expensive Problems in Narrow Niches',
summary: 'How to spot $500 problems hiding inside everyday workflows.',
pages: 'pp. 01 – 48',
},
{
number: '02',
title: 'The 14-Day Manuscript Sprint',
summary: 'Outlining and drafting high-density guides without writer’s block.',
pages: 'pp. 49 – 112',
},
{
number: '03',
title: 'Packaging That Commands PremiumMultiples',
summary: 'Typography, tactile layout, and companion workbooks.',
pages: 'pp. 113 – 184',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-005',
title: 'Cognitive Ergonomics',
subtitle: 'Structuring Deep Work, Physical Space, and Digital Tools for Peak Synthesis',
author: 'Kenji Takahashi',
authorRole: 'Industrial Designer & Researcher in Human-Computer Interaction',
description:
'Redesign your desk, file hierarchy, reading workflows, and energy rhythms for sustained four-hour creative output.',
longDescription:
'Productivity is rarely a willpower problem—it is an environmental friction problem. Kenji Takahashi blends Japanese studio craft with cognitive science to help you calibrate your digital workspace, eliminate visual noise, and preserve mental stamina for your highest-value thinking.',
category: 'Productivity',
coverImage:
'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#E8E6E1',
accent: '#42594E',
spine: '#D1CEC7',
badge: 'EDITION NO. 05',
},
pdfFile: 'vault://zenvero-editions/cognitive-ergonomics.pdf',
price: 30,
salePrice: 25,
pages: 198,
rating: 4.9,
reviewsCount: 189,
format: 'PDF',
featured: false,
bestSeller: false,
newRelease: true,
createdAt: '2025-02-12',
whoIsThisFor: [
'Architects, writers, and programmers who rely on uninterrupted mental synthesis',
'Knowledge workers recovering from chronic digital fragmentation',
],
chapters: [
{
number: '01',
title: 'Visual Silence & Desktop Architecture',
summary: 'Removing micro-distractions from your operating environment.',
pages: 'pp. 01 – 62',
},
{
number: '02',
title: 'The Zettelkasten Ledger Simplified',
summary: 'A low-maintenance plain-text note ecosystem that actually compounds.',
pages: 'pp. 63 – 134',
},
{
number: '03',
title: 'Circadian Ultradian Sprints',
summary: 'Matching analytical and creative work to biological alertness windows.',
pages: 'pp. 135 – 198',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-006',
title: 'The Sovereign Balance Sheet',
subtitle: 'Personal Treasury Management, Cashflow Buffers, and Asymmetric Bets',
author: 'Henrik Lindholm',
authorRole: 'Independent Portfolio Strategist',
description:
'Manage personal and studio capital like an enduring endowment—balancing ultra-safe liquidity with calculated creative equity.',
longDescription:
'Traditional personal finance advice ignores the realities of modern creators, consultants, and tech operators with variable equity or studio cashflow. Henrik Lindholm introduces the Barbell Treasury System: how to structure 24 months of serene runway while systematically funding high-upside ventures.',
category: 'Finance',
coverImage:
'https://images.unsplash.com/photo-1554415707-c18c60fe62a8?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#EDE8E0',
accent: '#2A5C4D',
spine: '#D7D0C5',
badge: 'EDITION NO. 06',
},
pdfFile: 'vault://zenvero-editions/sovereign-balance-sheet.pdf',
price: 42,
salePrice: 36,
pages: 264,
rating: 4.85,
reviewsCount: 153,
format: 'PDF + Treasury Model',
featured: false,
bestSeller: false,
newRelease: false,
createdAt: '2025-01-09',
whoIsThisFor: [
'Independent founders and principals managing both business and personal liquidity',
'Tech professionals navigating equity concentration and runway planning',
],
chapters: [
{
number: '01',
title: 'Runway as Creative Oxygen',
summary: 'Why liquidity changes the quality of contracts and decisions you accept.',
pages: 'pp. 01 – 74',
},
{
number: '02',
title: 'The Two-Bucket Studio Treasury',
summary: 'Automating tax reserves, T-bill ladders, and quarterly profit dividends.',
pages: 'pp. 75 – 178',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-007',
title: 'The Principal Individual Contributor',
subtitle: 'Commanding Executive Compensation and Autonomy Without Managing People',
author: 'Maya Lin-Kowalski',
authorRole: 'Staff Product Designer & Principal Advisor',
description:
'How to ascend the technical and creative track, write organization-shaping RFCs, and negotiate principal-level packages.',
longDescription:
'You do not have to abandon your craft for people management to reach the top tier of compensation and strategic influence. Maya Lin-Kowalski maps the unwritten rules of Staff, Principal, and Distinguished individual contributor roles.',
category: 'Career',
coverImage:
'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#E6E9EC',
accent: '#395159',
spine: '#CFD5DA',
badge: 'EDITION NO. 07',
},
pdfFile: 'vault://zenvero-editions/principal-ic.pdf',
price: 36,
salePrice: 29,
pages: 228,
rating: 4.9,
reviewsCount: 211,
format: 'PDF',
featured: false,
bestSeller: false,
newRelease: true,
createdAt: '2025-02-15',
whoIsThisFor: [
'Senior engineers, designers, and product managers aiming for Staff/Principal scope',
'Leaders looking to maximize high-craft impact without calendar bloat',
],
chapters: [
{
number: '01',
title: 'Scoping Problems Above Your Pay Grade',
summary: 'Identifying cross-org bottlenecks before leadership asks.',
pages: 'pp. 01 – 82',
},
{
number: '02',
title: 'The Art of the Architecture Vision Doc',
summary: 'Aligning 40 stakeholders with a single 4-page illustrated memo.',
pages: 'pp. 83 – 228',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
{
id: 'zv-008',
title: 'Zero-Dilution Craftsmanship',
subtitle: 'Building Enduring Bootstrapped Software & Design Companies on Your Own Terms',
author: 'Lucas Vermeer',
authorRole: 'Founder of Atelier Vermeer & Co.',
description:
'Why patient capital, deliberate customer onboarding, and craftsmanship build calmer, more durable software companies.',
longDescription:
'Venture hypergrowth is only one narrow path—and often the wrong one for craftsmen. Lucas Vermeer recounts the exact playbooks used by twelve profitable bootstrapped software companies generating $2M to $15M in annual recurring profit with teams under ten people.',
category: 'Entrepreneurship',
coverImage:
'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=85',
coverPalette: {
bg: '#EFEBE4',
accent: '#2A5C4D',
spine: '#DAD3C8',
badge: 'EDITION NO. 08',
},
pdfFile: 'vault://zenvero-editions/zero-dilution-craftsmanship.pdf',
price: 39,
salePrice: 31,
pages: 276,
rating: 4.95,
reviewsCount: 284,
format: 'PDF + Playbook',
featured: false,
bestSeller: false,
newRelease: true,
createdAt: '2025-02-17',
whoIsThisFor: [
'Bootstrapped software founders and independent studio owners',
'Product makers who value customer profitability over fundraising headlines',
],
chapters: [
{
number: '01',
title: 'Profit First Day One',
summary: 'Designing onboarding that converts within the first 15 minutes.',
pages: 'pp. 01 – 94',
},
{
number: '02',
title: 'High-Retention Craft Details',
summary: 'How tactile interfaces and sub-50ms responsiveness reduce churn.',
pages: 'pp. 95 – 276',
},
],
preview: [
  {
    pageNumber: 1,
    image: '/previews/demo/preview-1.jpg',
  },
  {
    pageNumber: 2,
    image: '/previews/demo/preview-2.jpg',
  },
  {
    pageNumber: 3,
    image: '/previews/demo/preview-3.jpg',
  },
],
},
];

export const INITIAL_ORDERS: OrderRecord[] = [
{
id: 'ORD-9482',
customerName: 'Alistair Sterling',
customerEmail: 'alistair@sterlingstudio.co',
items: [
{ ebookId: 'zv-001', title: 'The Calm Compounding Operator', price: 29 },
{ ebookId: 'zv-002', title: 'Applied Agentic Workflows', price: 34 },
],
subtotal: 63,
discount: 0,
total: 63,
date: '2025-02-18 14:22',
downloadToken: 'zv_sig_884920a1b4f',
status: 'Verified',
},
{
id: 'ORD-9481',
customerName: 'Nadia Lindqvist',
customerEmail: 'nadia@ateliernord.se',
items: [{ ebookId: 'zv-003', title: 'Editorial Positioning', price: 28 }],
subtotal: 28,
discount: 0,
total: 28,
date: '2025-02-18 11:05',
downloadToken: 'zv_sig_773190c3e2d',
status: 'Verified',
},
{
id: 'ORD-9479',
customerName: 'Marcus Vance',
customerEmail: 'm.vance@monolith.io',
items: [
{ ebookId: 'zv-004', title: 'Micro-Monographs & Digital Assets', price: 24 },
{ ebookId: 'zv-008', title: 'Zero-Dilution Craftsmanship', price: 31 },
],
subtotal: 55,
discount: 5.5,
total: 49.5,
date: '2025-02-17 19:40',
downloadToken: 'zv_sig_662019f8a1c',
status: 'Verified',
},
];