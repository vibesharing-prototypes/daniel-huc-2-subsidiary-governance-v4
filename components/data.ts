export type ProtoState = 'calm' | 'busy' | 'critical'

export interface Entity {
  id: number
  name: string
  shortName: string
  country: string
  countryCode: string
  nextBoard: string
  nextBoardDate: Date
  completion: number
  connectedApps: string[]
}

export interface BookBuildingItem {
  id: number
  entityIds: number[]
  category: 'gap' | 'overdue' | 'assignment' | 'signature' | 'approval'
  title: string       // gap/opportunity as a plain statement
  meta: string        // short context for row meta line
  detail: string      // longer explanation for modal body
  actionLabel: string // CTA button text
  states: ProtoState[]
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export const ENTITIES: Entity[] = [
  {
    id: 1,
    name: 'Meridian Capital Holdings Ltd',
    shortName: 'Meridian Capital',
    country: 'United Kingdom',
    countryCode: 'UK',
    nextBoard: '14 Mar 2026',
    nextBoardDate: new Date('2026-03-14'),
    completion: 72,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes', 'Risk Manager'],
  },
  {
    id: 2,
    name: 'Apex Ventures GmbH',
    shortName: 'Apex Ventures',
    country: 'Germany',
    countryCode: 'DE',
    nextBoard: '18 Mar 2026',
    nextBoardDate: new Date('2026-03-18'),
    completion: 45,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager', 'Data Intelligence'],
  },
  {
    id: 3,
    name: 'Horizon Digital S.A.',
    shortName: 'Horizon Digital',
    country: 'France',
    countryCode: 'FR',
    nextBoard: '11 Mar 2026',
    nextBoardDate: new Date('2026-03-11'),
    completion: 88,
    connectedApps: ['Entities', 'Boards NextGen', 'Data Intelligence'],
  },
  {
    id: 4,
    name: 'Nordic Solutions AB',
    shortName: 'Nordic Solutions',
    country: 'Sweden',
    countryCode: 'SE',
    nextBoard: '25 Mar 2026',
    nextBoardDate: new Date('2026-03-25'),
    completion: 31,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes'],
  },
  {
    id: 5,
    name: 'Pacific Rim Operations Pte Ltd',
    shortName: 'Pacific Rim Ops',
    country: 'Singapore',
    countryCode: 'SG',
    nextBoard: '7 Mar 2026',
    nextBoardDate: new Date('2026-03-07'),
    completion: 60,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager', 'Minutes'],
  },
  {
    id: 6,
    name: 'Atlantic Resources Inc',
    shortName: 'Atlantic Resources',
    country: 'United States',
    countryCode: 'US',
    nextBoard: '20 Mar 2026',
    nextBoardDate: new Date('2026-03-20'),
    completion: 95,
    connectedApps: ['Entities', 'Boards NextGen', 'Data Intelligence', 'Risk Manager'],
  },
  {
    id: 7,
    name: 'Iberian Holdings S.L.',
    shortName: 'Iberian Holdings',
    country: 'Spain',
    countryCode: 'ES',
    nextBoard: '28 Mar 2026',
    nextBoardDate: new Date('2026-03-28'),
    completion: 18,
    connectedApps: ['Entities', 'Boards NextGen', 'Minutes', 'Data Intelligence'],
  },
  {
    id: 8,
    name: 'Eastern Markets Ltd',
    shortName: 'Eastern Markets',
    country: 'UAE',
    countryCode: 'AE',
    nextBoard: '4 Apr 2026',
    nextBoardDate: new Date('2026-04-04'),
    completion: 55,
    connectedApps: ['Entities', 'Boards NextGen', 'Risk Manager'],
  },
]

export const BOOK_BUILDING_ITEMS: BookBuildingItem[] = [
  {
    id: 1,
    entityIds: [2, 1, 7],
    category: 'gap',
    title: 'Cybersecurity section missing across 3 board packs — was a standing agenda item',
    meta: 'Apex Ventures, Meridian Capital, Iberian Holdings · CISO: Dr. Sarah Chen',
    detail: 'Cybersecurity was a standing agenda item through Q1 2025 but has not appeared on any board agenda since across three entities. Generate board materials covering the current threat landscape, incident summary, and security investment review for all three packs in one action.',
    actionLabel: 'Generate sections',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entityIds: [4, 7, 8],
    category: 'gap',
    title: 'Q2 and Q3 board meeting outlines not started — 3 entities',
    meta: 'Nordic Solutions, Iberian Holdings, Eastern Markets · Next meetings: Jun–Sep 2026',
    detail: 'No draft outlines exist for the next two quarterly board meetings for three entities. Generate agenda frameworks for all three packs at once based on standing items, the regulatory calendar, and prior meeting patterns.',
    actionLabel: 'Draft outlines',
    states: ['calm', 'busy'],
  },
  {
    id: 3,
    entityIds: [1, 2, 8],
    category: 'gap',
    title: 'No cybersecurity topic on agenda in 12+ months — 3 packs affected',
    meta: 'Meridian Capital, Apex Ventures, Eastern Markets · Last covered Q1 2025',
    detail: 'Cybersecurity was last discussed in Q1 2025 across three entities. Rising threat landscape creates a material governance gap. Add a consistent cybersecurity section to all three packs simultaneously.',
    actionLabel: 'Add sections',
    states: ['busy', 'critical'],
  },
  {
    id: 4,
    entityIds: [2, 3, 7],
    category: 'gap',
    title: 'Carbon neutrality goals set Feb 2025 — no check-in across 3 EU entities',
    meta: 'Apex Ventures, Horizon Digital, Iberian Holdings · 13 months since commitment',
    detail: 'Board committed to interim carbon reduction targets 13 months ago across three EU entities. No progress update has been added to any subsequent agenda. Add a progress update item to all three packs at once.',
    actionLabel: 'Add to agendas',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entityIds: [1, 4],
    category: 'assignment',
    title: 'Financial Review sections have no presenter assigned — 2 entities',
    meta: 'Meridian Capital · 15 days · Nordic Solutions · 18 days',
    detail: 'Financial Review sections are unassigned in both the Meridian Capital and Nordic Solutions board packs. Both meetings are within three weeks and packs are already in review. Assign presenters across both packs in one action.',
    actionLabel: 'Assign owners',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entityIds: [2, 3],
    category: 'approval',
    title: 'GDPR data processing addendum sign-off blocking 2 EU packs',
    meta: 'Apex Ventures, Horizon Digital · Both packs blocked',
    detail: 'The same EU data processing addendum requires legal sign-off before either pack can be finalised. Both Apex Ventures and Horizon Digital are blocked on the identical approval item — resolve in one step for both.',
    actionLabel: 'Review item',
    states: ['critical'],
  },
  {
    id: 7,
    entityIds: [5, 4],
    category: 'overdue',
    title: 'Q4 Financial Statements not received — 2 packs cannot progress',
    meta: 'Pacific Rim Ops · 9 days · Nordic Solutions · 18 days',
    detail: 'Finance has not submitted Q4 statements for Pacific Rim Ops or Nordic Solutions. Both packs are blocked and cannot be finalised. Send a joint notification to Finance for both entities at once.',
    actionLabel: 'Notify Finance',
    states: ['critical'],
  },
]

export interface PlanningSuggestion {
  id: number
  entities: Array<{ entityId: number }>
  sourceType: 'regulation' | 'market' | 'source-material' | 'personnel' | 'geopolitical' | 'reorder'
  sourceLabel: string
  title: string
  reason: string
  affectedSection?: string
  suggestedPrompt?: string
  actionLabel: string
  states: ProtoState[]
}

export const PLANNING_SUGGESTIONS: PlanningSuggestion[] = [
  {
    id: 1,
    entities: [{ entityId: 2 }, { entityId: 4 }],
    sourceType: 'personnel',
    sourceLabel: 'CFO Transitions',
    title: 'Update Financial Review presenters — CFO changes at 2 entities in March',
    reason: 'Klaus Weber (departing CFO, Apex Ventures) still listed as presenter on Sections 3 and 5. Nordic Solutions CFO also changed effective 1 March 2026. Both packs reference outgoing personnel.',
    affectedSection: 'Financial Review',
    suggestedPrompt: 'Update the presenter field on Financial Review and Budget sections for Apex Ventures (Klaus Weber → Anna Bauer) and Nordic Solutions (outgoing CFO → Erik Lindqvist), both effective March 2026.',
    actionLabel: 'Update presenters',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entities: [{ entityId: 2 }, { entityId: 3 }, { entityId: 4 }, { entityId: 7 }],
    sourceType: 'regulation',
    sourceLabel: 'EU AI Act',
    title: 'EU AI Act enforcement deadline shifted to Q3 — update Risk sections across 4 EU entities',
    reason: 'EU AI Act enforcement guidelines revised 24 Feb 2026 — key deadline shifted from Q2 to Q3 2026. All four EU entity packs reference the superseded Q2 deadline.',
    affectedSection: 'Risk & Compliance',
    suggestedPrompt: 'Update the Risk & Compliance sections for Apex Ventures, Horizon Digital, Nordic Solutions, and Iberian Holdings to reflect the revised EU AI Act enforcement deadline (Q3 2026) and adjust remediation budget timelines accordingly.',
    actionLabel: 'Apply to all 4',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 3,
    entities: [{ entityId: 2 }, { entityId: 3 }, { entityId: 7 }],
    sourceType: 'market',
    sourceLabel: 'ECB Rate Cut',
    title: 'ECB cut to 2.90% — revise FX hedging commentary in 3 EU packs',
    reason: 'ECB cut rates 25bps to 2.90% on 6 Mar 2026. Apex Ventures, Horizon Digital, and Iberian Holdings all reference the superseded rate of 3.15% in their Q4 Financial Statements.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: 'Update Q4 Financial Statements for Apex Ventures, Horizon Digital, and Iberian Holdings to reflect the ECB rate cut to 2.90% (6 Mar 2026) and revise all FX hedging commentary across all three packs.',
    actionLabel: 'Apply to all 3',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 4,
    entities: [{ entityId: 4 }, { entityId: 2 }],
    sourceType: 'reorder',
    sourceLabel: 'Agenda Reorder',
    title: 'Move EU Regulatory Update to item 2 — AI Act enforcement requires early board attention',
    reason: 'Item sits at position 7 in both Nordic Solutions and Apex Ventures agendas. Given the AI Act enforcement revision, board attention is needed early in both meetings.',
    actionLabel: 'Reorder both',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entities: [{ entityId: 6 }, { entityId: 1 }],
    sourceType: 'source-material',
    sourceLabel: 'Auditor Revision',
    title: 'Reconcile EBITDA across 2 packs — PwC revised Q4 management accounts',
    reason: 'PwC submitted revised management accounts on 28 Feb 2026 covering both Atlantic Resources (EBITDA £2.6m, was £2.8m) and Meridian Capital (EBITDA £4.1m, was £4.4m). Both packs are out of date.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: "Reconcile Q4 Financial Statements for Atlantic Resources (EBITDA £2.8m → £2.6m) and Meridian Capital (EBITDA £4.4m → £4.1m) with PwC's revised management accounts and recalculate EBITDA margins for both.",
    actionLabel: 'Apply to both',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entities: [{ entityId: 1 }, { entityId: 6 }, { entityId: 8 }],
    sourceType: 'geopolitical',
    sourceLabel: 'Geopolitical Risk',
    title: 'Add Geopolitical Risk section — armed conflict escalation affecting supply chain exposure',
    reason: 'Escalation in Eastern Europe since 12 Mar 2026 may affect supply chain exposure for three entities with operations or counterparties in the region.',
    actionLabel: 'Add to all 3',
    states: ['critical'],
  },
  {
    id: 7,
    entities: [{ entityId: 2 }, { entityId: 3 }, { entityId: 4 }, { entityId: 7 }],
    sourceType: 'regulation',
    sourceLabel: 'CSRD',
    title: 'Add mandatory ESG disclosure section to all 4 EU entity packs',
    reason: 'CSRD mandatory reporting applies from Jan 2026 for qualifying EU entities. No ESG disclosure section exists in any of the 4 affected packs.',
    affectedSection: 'ESG Disclosure',
    suggestedPrompt: 'Add an ESG disclosure section to board packs for Apex Ventures, Horizon Digital, Nordic Solutions, and Iberian Holdings, covering scope 1 & 2 emissions, social metrics, and board oversight of sustainability strategy as required under CSRD.',
    actionLabel: 'Apply to all 4',
    states: ['busy', 'critical'],
  },
]

export const PROMPT_STARTERS: string[] = [
  'Which packs are at risk this quarter?',
  'Create board pack',
  'Show all outstanding director signatures',
  'Draft a circular resolution across entities',
]

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Q1 2026 pack status: 6 of 8 entities are in progress. Most urgent — Pacific Rim Ops meets on 7 March and Q4 Financials are still missing from Finance. Atlantic Resources is nearly done, pending chair sign-off only. Four items need your review before I can proceed.',
  },
]
