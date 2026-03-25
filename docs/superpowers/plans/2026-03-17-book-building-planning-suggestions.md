# Book Building & Planning Suggestions Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two-column "Action Items / Edit Suggestions" layout with two full-width single-column sections — "Book Building" and "Planning Suggestions" — featuring compact action rows with inline one-click CTAs.

**Architecture:** Update `data.ts` with new types and data arrays, create two new section components (`BookBuilding`, `PlanningSuggestions`) that share the same compact row pattern, delete the old components, and update `HomeContent` to stack them vertically. The modal pattern is preserved for both sections; the new inline CTA dispatches the agent job immediately without requiring a modal.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, React hooks. No test framework — verification is visual via `npm run dev`.

**Spec:** `docs/superpowers/specs/2026-03-17-book-building-planning-suggestions-design.md`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `components/data.ts` | Add `BookBuildingItem`, `PlanningSuggestion` types + data; remove old types + arrays |
| Create | `components/BookBuilding.tsx` | Section 1 — compact rows with category icons, detail modal, inline CTA |
| Create | `components/PlanningSuggestions.tsx` | Section 2 — compact rows with source badges, detail modal, inline CTA |
| Modify | `components/HomeContent.tsx` | Swap grid for flex-col, update imports |
| Delete | `components/NeedsYouNow.tsx` | Replaced by BookBuilding |
| Delete | `components/EditSuggestions.tsx` | Replaced by PlanningSuggestions |

---

## Task 1: Update `data.ts` — new types and data arrays

**Files:**
- Modify: `components/data.ts`

### Step 1: Add `BookBuildingItem` type and remove `ActionItem`

In `components/data.ts`, replace:

```ts
export interface ActionItem {
  id: number
  entityId: number
  entityName: string
  entityTag: string
  tagColor: string
  title: string
  description: string
  actionLabel: string
  states: ProtoState[]
}
```

With:

```ts
export interface BookBuildingItem {
  id: number
  entityId: number
  category: 'gap' | 'overdue' | 'assignment' | 'signature' | 'approval'
  title: string       // gap/opportunity as a plain statement
  meta: string        // short context for row meta line
  detail: string      // longer explanation for modal body
  actionLabel: string // CTA button text
  states: ProtoState[]
}
```

- [ ] Make the edit to `data.ts`

### Step 2: Replace `ACTION_ITEMS` with `BOOK_BUILDING_ITEMS`

Remove the entire `export const ACTION_ITEMS: ActionItem[]` block and replace with:

```ts
export const BOOK_BUILDING_ITEMS: BookBuildingItem[] = [
  {
    id: 1,
    entityId: 4,
    category: 'signature',
    title: 'Resolution awaiting 3 of 5 director signatures',
    meta: 'Nordic Solutions · 3 of 5 complete',
    detail: 'Capital restructuring resolution approved in December — 3 of 5 e-signatures complete.',
    actionLabel: 'Send reminder',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entityId: 6,
    category: 'approval',
    title: 'Pack at 95% — Chair approval required before distribution',
    meta: 'Atlantic Resources · Pack at 95%',
    detail: 'Pack is complete and awaiting final sign-off from the Chair before it can be distributed to directors.',
    actionLabel: 'Send for approval',
    states: ['calm', 'busy'],
  },
  {
    id: 3,
    entityId: 1,
    category: 'gap',
    title: 'No cybersecurity topic on the agenda in 12 months',
    meta: 'Meridian Capital · Last covered Mar 2025',
    detail: 'Cybersecurity was last discussed in March 2025. Rising threat landscape may make this a material governance gap.',
    actionLabel: 'Add section',
    states: ['busy', 'critical'],
  },
  {
    id: 4,
    entityId: 2,
    category: 'gap',
    title: 'Carbon neutrality goals set Feb 2025 — no check-in since',
    meta: 'Apex Ventures · 13 months since last mention',
    detail: 'Board committed to interim carbon reduction targets 13 months ago. No progress update has been added to any subsequent agenda.',
    actionLabel: 'Add to agenda',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entityId: 1,
    category: 'assignment',
    title: 'Financial Review section has no presenter assigned',
    meta: 'Meridian Capital · Meeting in 15 days',
    detail: 'Section 3.2 is unassigned. The board meeting is in 15 days and the pack is already in review.',
    actionLabel: 'Assign owner',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entityId: 2,
    category: 'approval',
    title: 'GDPR data processing addendum sign-off blocking pack completion',
    meta: 'Apex Ventures · Pack blocked',
    detail: 'EU data processing addendum requires legal sign-off before the pack can be finalised and distributed.',
    actionLabel: 'Review item',
    states: ['critical'],
  },
  {
    id: 7,
    entityId: 5,
    category: 'overdue',
    title: 'Q4 Financial Statements not received — pack cannot progress',
    meta: 'Pacific Rim Ops · Meeting in 9 days',
    detail: 'Finance has not submitted Q4 statements. The pack is blocked at 60% and the board meeting is in under two weeks.',
    actionLabel: 'Notify Finance',
    states: ['critical'],
  },
]
```

- [ ] Make the edit to `data.ts`

### Step 3: Add `PlanningSuggestion` type and remove `EditSuggestion`

Remove the entire `export interface EditSuggestion` block and replace with:

```ts
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
```

- [ ] Make the edit to `data.ts`

### Step 4: Replace `EDIT_SUGGESTIONS` with `PLANNING_SUGGESTIONS`

Remove the entire `export const EDIT_SUGGESTIONS: EditSuggestion[]` block and replace with:

```ts
export const PLANNING_SUGGESTIONS: PlanningSuggestion[] = [
  {
    id: 1,
    entities: [{ entityId: 2 }],
    sourceType: 'personnel',
    sourceLabel: 'CFO Succession',
    title: 'Update presenter for Financial Review and Budget — Anna Bauer appointed CFO 10 Mar',
    reason: 'Klaus Weber (departing CFO) is still listed as presenter on Sections 3 and 5. Anna Bauer was appointed on 10 March 2026.',
    affectedSection: 'Financial Review',
    suggestedPrompt: 'Update the presenter field on Sections 3 and 5 of the Apex Ventures board pack from Klaus Weber to Anna Bauer, effective 10 March 2026.',
    actionLabel: 'Update presenter',
    states: ['calm', 'busy'],
  },
  {
    id: 2,
    entities: [{ entityId: 2 }],
    sourceType: 'regulation',
    sourceLabel: 'EU AI Act',
    title: 'EU AI Act enforcement deadline shifted to Q3 — update Risk section',
    reason: 'EU AI Act enforcement guidelines revised 24 Feb 2026 — key deadline shifted from Q2 to Q3 2026.',
    affectedSection: 'Risk & Compliance',
    suggestedPrompt: 'Update the Risk & Compliance section for Apex Ventures to reflect the revised EU AI Act enforcement deadline (Q3 2026) and adjust the remediation budget timeline accordingly.',
    actionLabel: 'Apply',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 3,
    entities: [{ entityId: 3 }],
    sourceType: 'market',
    sourceLabel: 'ECB Rate Cut',
    title: 'ECB cut to 2.90% — revise FX hedging commentary',
    reason: 'ECB cut rates 25bps to 2.90% on 6 Mar 2026. Pack currently references the superseded rate of 3.15%.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: "Update Horizon Digital's Q4 Financial Statements to reflect the ECB rate cut to 2.90% (6 Mar 2026) and revise all FX hedging commentary to align with the current rate environment.",
    actionLabel: 'Apply',
    states: ['calm', 'busy', 'critical'],
  },
  {
    id: 4,
    entities: [{ entityId: 4 }],
    sourceType: 'reorder',
    sourceLabel: 'Agenda Reorder',
    title: 'Move EU Regulatory Update to agenda item 2 — AI Act enforcement revised',
    reason: 'Item is currently listed at position 7. Given the AI Act enforcement revision, board attention is needed early in the meeting.',
    actionLabel: 'Reorder',
    states: ['busy', 'critical'],
  },
  {
    id: 5,
    entities: [{ entityId: 6 }],
    sourceType: 'source-material',
    sourceLabel: 'Auditor Revision',
    title: 'Reconcile EBITDA — PwC revised Q4 accounts (£2.6m, was £2.8m)',
    reason: 'PwC submitted revised management accounts on 28 Feb 2026. EBITDA now £2.6m; pack currently states £2.8m.',
    affectedSection: 'Q4 Financial Statements',
    suggestedPrompt: "Reconcile the Q4 Financial Statements for Atlantic Resources with PwC's revised management accounts: update EBITDA from £2.8m to £2.6m and recalculate EBITDA margin.",
    actionLabel: 'Apply',
    states: ['busy', 'critical'],
  },
  {
    id: 6,
    entities: [{ entityId: 1 }, { entityId: 6 }, { entityId: 8 }],
    sourceType: 'geopolitical',
    sourceLabel: 'Geopolitical Risk',
    title: 'Add Geopolitical Risk section — armed conflict escalation affecting supply chain exposure',
    reason: 'Escalation in Eastern Europe since 12 Mar 2026 may affect supply chain exposure for three entities with operations or counterparties in the region.',
    actionLabel: 'Add section',
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
    actionLabel: 'Apply',
    states: ['busy', 'critical'],
  },
]
```

- [ ] Make the edit to `data.ts`

### Step 5: Verify TypeScript compiles

```bash
cd "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3" && npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only from `NeedsYouNow.tsx` and `EditSuggestions.tsx` still importing the old types — not from `data.ts` itself.

- [ ] Run the command and confirm `data.ts` errors are zero

### Step 6: Commit

```bash
git add components/data.ts
git commit -m "feat: add BookBuildingItem and PlanningSuggestion types and data"
```

- [ ] Commit

---

## Task 2: Create `BookBuilding.tsx`

**Files:**
- Create: `components/BookBuilding.tsx`

This replaces `NeedsYouNow.tsx`. Copy the overall structure (LogoWithTooltip, modal, show-more pattern) and adapt for the new item shape and inline CTA.

### Step 1: Create the file with types and helpers

Create `components/BookBuilding.tsx` with the following content in full:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BOOK_BUILDING_ITEMS, ENTITIES, type BookBuildingItem } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { useProtoState } from '@/components/ProtoStateContext'

// ─── Agent workflow steps ────────────────────────────────────────────────────

function buildBookBuildingSteps(connectedApps: string[]): string[] {
  const steps: string[] = ['Retrieving task details from Entities']
  if (connectedApps.includes('Minutes')) steps.push('Opening document in Minutes')
  steps.push('Preparing task for processing')
  if (connectedApps.includes('Boards NextGen')) steps.push('Updating status in Boards NextGen')
  steps.push('Sending notification to stakeholders')
  return steps
}

// ─── Category config ─────────────────────────────────────────────────────────

type Category = BookBuildingItem['category']

const CATEGORY_CONFIG: Record<Category, {
  boxBg: string
  boxBorder: string
  iconColor: string
  badgeClasses: string
  badgeLabel: string
  icon: React.ReactNode
}> = {
  gap: {
    boxBg: 'bg-red-50',
    boxBorder: 'border-red-200',
    iconColor: 'text-red-500',
    badgeClasses: 'bg-red-50 border border-red-200 text-red-700',
    badgeLabel: 'Gap detected',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3.5" />
        <circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  overdue: {
    boxBg: 'bg-amber-50',
    boxBorder: 'border-amber-200',
    iconColor: 'text-amber-500',
    badgeClasses: 'bg-amber-50 border border-amber-200 text-amber-700',
    badgeLabel: 'Overdue',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    ),
  },
  assignment: {
    boxBg: 'bg-amber-50',
    boxBorder: 'border-amber-200',
    iconColor: 'text-amber-500',
    badgeClasses: 'bg-amber-50 border border-amber-200 text-amber-700',
    badgeLabel: 'Needs assignment',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" />
        <path d="M11.5 3v3M13 4.5h-3" />
      </svg>
    ),
  },
  signature: {
    boxBg: 'bg-slate-100',
    boxBorder: 'border-slate-300',
    iconColor: 'text-slate-500',
    badgeClasses: 'bg-slate-100 border border-slate-300 text-slate-600',
    badgeLabel: 'Awaiting signatures',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12l3-1 6-6-2-2-6 6-1 3z" />
        <path d="M11 3l2 2" />
      </svg>
    ),
  },
  approval: {
    boxBg: 'bg-slate-100',
    boxBorder: 'border-slate-300',
    iconColor: 'text-slate-500',
    badgeClasses: 'bg-slate-100 border border-slate-300 text-slate-600',
    badgeLabel: 'Awaiting approval',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M5 8l2.5 2.5L11 5.5" />
      </svg>
    ),
  },
}

// ─── LogoWithTooltip ──────────────────────────────────────────────────────────

function LogoWithTooltip({ entityId }: { entityId: number }) {
  const entity = ENTITIES.find(e => e.id === entityId)!
  return (
    <div className="relative group/logo flex-shrink-0">
      <EntityLogo entity={entity} size="sm" />
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-slate-800 rounded-lg shadow-md opacity-0 group-hover/logo:opacity-100 transition-opacity z-20 whitespace-nowrap">
        <p className="text-[11px] font-semibold text-white leading-snug">{entity.name}</p>
        <p className="text-[10px] text-slate-400 leading-snug">{entity.country}</p>
      </div>
    </div>
  )
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function BookBuildingModal({ item, onClose }: { item: BookBuildingItem; onClose: () => void }) {
  const entity = ENTITIES.find(e => e.id === item.entityId)!
  const agentActivity = useAgentActivity()
  const cfg = CATEGORY_CONFIG[item.category]

  function handleRunInBackground() {
    if (agentActivity) {
      const jobId = agentActivity.addJob({
        type: 'action',
        entityId: entity.id,
        entityShortName: entity.shortName,
        title: item.title,
        workflowSteps: buildBookBuildingSteps(entity.connectedApps),
      })
      setTimeout(() => agentActivity.completeJob(jobId), 30_000)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]" />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:bg-slate-300 dark:active:bg-zinc-600 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5 pr-8">
            <EntityLogo entity={entity} size="md" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 leading-snug">{entity.country}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 leading-snug truncate">{entity.name}</p>
            </div>
          </div>

          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${cfg.badgeClasses}`}>
            {cfg.badgeLabel}
          </span>

          <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mt-3 mb-2 leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
            {item.detail}
          </p>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-zinc-800">
          <button onClick={onClose} className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {agentActivity && (
              <button
                onClick={handleRunInBackground}
                className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
              >
                Run in background
              </button>
            )}
            <Link
              href={`/entity/${item.entityId}`}
              className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors"
            >
              {item.actionLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type ItemStatus = 'applying' | 'applied'

const VISIBLE_COUNT = 3

export default function BookBuilding() {
  const [selectedItem, setSelectedItem] = useState<BookBuildingItem | null>(null)
  const [itemStatus, setItemStatus] = useState<Record<number, ItemStatus>>({})
  const [showAll, setShowAll] = useState(false)
  const state = useProtoState()
  const agentActivity = useAgentActivity()

  function handleCTA(e: React.MouseEvent, item: BookBuildingItem) {
    e.stopPropagation()
    const entity = ENTITIES.find(en => en.id === item.entityId)
    if (!entity || !agentActivity) return
    setItemStatus(prev => ({ ...prev, [item.id]: 'applying' }))
    const jobId = agentActivity.addJob({
      type: 'action',
      entityId: entity.id,
      entityShortName: entity.shortName,
      title: item.title,
      workflowSteps: buildBookBuildingSteps(entity.connectedApps),
    })
    setTimeout(() => {
      setItemStatus(prev => ({ ...prev, [item.id]: 'applied' }))
      agentActivity.completeJob(jobId)
    }, 30_000)
  }

  const stateItems = BOOK_BUILDING_ITEMS.filter(i => i.states.includes(state))
  const visibleItems = showAll ? stateItems : stateItems.slice(0, VISIBLE_COUNT)
  const hasMore = stateItems.length > VISIBLE_COUNT

  return (
    <section className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
          Book Building
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
          Gaps and missing items detected in your board packs.
        </p>
      </div>

      <div className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 divide-y divide-slate-100 dark:divide-zinc-800 flex flex-col">
        {visibleItems.map((item, i) => {
          const cfg = CATEGORY_CONFIG[item.category]
          const status = itemStatus[item.id]
          const isApplying = status === 'applying'
          const isApplied = status === 'applied'
          const isFirst = i === 0
          const isLast = !hasMore && i === visibleItems.length - 1

          return (
            <div
              key={item.id}
              onClick={isApplying ? undefined : () => setSelectedItem(item)}
              className={`flex items-center gap-3 px-4 py-3 min-h-[64px] overflow-hidden transition-colors cursor-pointer
                ${isFirst ? 'rounded-t-lg' : ''}
                ${isLast ? 'rounded-b-lg' : ''}
                ${isApplying
                  ? 'bg-slate-50 dark:bg-zinc-800 cursor-default'
                  : 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700'
                }`}
            >
              {/* Category icon box */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${cfg.boxBg} ${cfg.boxBorder} ${cfg.iconColor} ${isApplying || isApplied ? 'opacity-40' : ''}`}>
                {cfg.icon}
              </div>

              {/* Text */}
              <div className={`flex-1 min-w-0 ${isApplying || isApplied ? 'opacity-40' : ''}`}>
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 leading-snug truncate">
                  {item.meta}
                </p>
              </div>

              {/* CTA / status */}
              {isApplying ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-[11px] text-slate-400">Applying…</span>
                </div>
              ) : isApplied ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l3.5 3.5L13 5" />
                  </svg>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Done</span>
                </div>
              ) : (
                <button
                  onClick={e => handleCTA(e, item)}
                  className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-medium rounded-md hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  {item.actionLabel}
                </button>
              )}
            </div>
          )
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center justify-center gap-1 w-full py-2.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors rounded-b-lg"
          >
            {showAll ? 'Show less' : `Show ${stateItems.length - VISIBLE_COUNT} more`}
            <svg className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      {selectedItem && (
        <BookBuildingModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  )
}
```

- [ ] Create the file

### Step 2: Verify TypeScript compiles

```bash
cd "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3" && npx tsc --noEmit 2>&1 | grep "BookBuilding"
```

Expected: no errors from `BookBuilding.tsx`.

- [ ] Run and confirm

### Step 3: Commit

```bash
git add components/BookBuilding.tsx
git commit -m "feat: add BookBuilding component with inline CTA and category icons"
```

- [ ] Commit

---

## Task 3: Create `PlanningSuggestions.tsx`

**Files:**
- Create: `components/PlanningSuggestions.tsx`

This replaces `EditSuggestions.tsx`. Reuse `LogoStack` from the old component, update `SOURCE_CONFIG` with the three new source types, and wire the inline CTA pattern.

### Step 1: Create the file

Create `components/PlanningSuggestions.tsx` with the following full content:

```tsx
'use client'

import { useState } from 'react'
import { PLANNING_SUGGESTIONS, ENTITIES, type PlanningSuggestion } from '@/components/data'
import EntityLogo from '@/components/EntityLogo'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { useProtoState } from '@/components/ProtoStateContext'

// ─── Agent workflow steps ─────────────────────────────────────────────────────

function buildEditSteps(connectedApps: string[], affectedSection: string): string[] {
  return [
    'Fetching regulatory source data',
    `Analysing ${affectedSection || 'document'}`,
    connectedApps.includes('Minutes') ? 'Drafting updates in Minutes' : 'Preparing document update',
    connectedApps.includes('Boards NextGen') ? 'Syncing with Boards NextGen' : 'Applying to board pack',
    'Running cross-entity consistency check',
  ]
}

// ─── Source config ────────────────────────────────────────────────────────────

type SourceType = PlanningSuggestion['sourceType']

const SOURCE_CONFIG: Record<SourceType, { className: string }> = {
  regulation: { className: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800' },
  market:     { className: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800' },
  'source-material': { className: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800' },
  personnel:  { className: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800' },
  geopolitical: { className: 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800' },
  reorder:    { className: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800' },
}

// ─── BatchIcon ────────────────────────────────────────────────────────────────

function BatchIcon() {
  return (
    <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="2" width="8" height="10" rx="1.5" opacity="0.5" />
      <rect x="2" y="4" width="9" height="10" rx="1.5" />
    </svg>
  )
}

// ─── LogoStack ────────────────────────────────────────────────────────────────

function LogoStack({ entityIds }: { entityIds: number[] }) {
  const entities = entityIds.map(id => ENTITIES.find(e => e.id === id)).filter(Boolean) as NonNullable<typeof ENTITIES[number]>[]
  const primary = entities[0]
  const extra = entities.length - 1
  if (!primary) return null
  return (
    <div className="relative group/logos flex-shrink-0">
      <EntityLogo entity={primary} size="sm" />
      {extra > 0 && (
        <div className="absolute -bottom-1 -right-1 min-w-[16px] h-4 px-1 bg-slate-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
          +{extra}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 px-2.5 py-2 bg-slate-800 rounded-lg shadow-md opacity-0 group-hover/logos:opacity-100 transition-opacity z-20 whitespace-nowrap space-y-2">
        {entities.map((entity, i) => (
          <div key={entity.id} className={i > 0 ? 'pt-2 border-t border-slate-700' : ''}>
            <p className="text-[11px] font-semibold text-white leading-snug">{entity.name}</p>
            <p className="text-[10px] text-slate-400 leading-snug">{entity.country}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function PlanningSuggestionModal({
  suggestion,
  isApplied,
  onApply,
  onClose,
}: {
  suggestion: PlanningSuggestion
  isApplied: boolean
  onApply: () => void
  onClose: () => void
}) {
  const entities = suggestion.entities
    .map(e => ENTITIES.find(ent => ent.id === e.entityId))
    .filter(Boolean) as NonNullable<typeof ENTITIES[number]>[]
  const sourceStyle = SOURCE_CONFIG[suggestion.sourceType]
  const isBatch = suggestion.entities.length > 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px]" />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:bg-slate-300 dark:active:bg-zinc-600 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start gap-2.5 mb-4 pr-8 flex-wrap">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 mt-0.5 ${sourceStyle.className}`}>
              {suggestion.sourceLabel}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {entities.map(entity => (
                <div key={entity.id} className="flex items-center gap-1.5">
                  <EntityLogo entity={entity} size="sm" />
                  <span className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">{entity.shortName}</span>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 mb-2 leading-snug">
            {suggestion.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
            {suggestion.reason}
          </p>

          {suggestion.affectedSection && (
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Affected Section
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                  <svg className="w-3 h-3 text-slate-500 dark:text-zinc-500 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="2" width="10" height="12" rx="1.5" />
                    <path d="M6 6h4M6 9h4M6 12h2" />
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-zinc-300 font-medium">{suggestion.affectedSection}</span>
                </div>
                {isBatch && (
                  <span className="text-xs text-slate-500">across {suggestion.entities.length} board packs</span>
                )}
              </div>
            </div>
          )}

          {suggestion.suggestedPrompt && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Proposed Edit
              </p>
              <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700">
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {suggestion.suggestedPrompt}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <button onClick={onClose} className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">
            Cancel
          </button>
          {isApplied ? (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l3.5 3.5L13 5" />
              </svg>
              Changes applied
            </div>
          ) : (
            <button
              onClick={() => { onApply(); onClose() }}
              className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors"
            >
              {suggestion.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type CardStatus = 'applying' | 'applied'

const VISIBLE_COUNT = 3

export default function PlanningSuggestions() {
  const [cardStatus, setCardStatus] = useState<Record<number, CardStatus>>({})
  const [selectedSuggestion, setSelectedSuggestion] = useState<PlanningSuggestion | null>(null)
  const [showAll, setShowAll] = useState(false)
  const agentActivity = useAgentActivity()
  const state = useProtoState()

  function handleApply(suggestion: PlanningSuggestion) {
    const id = suggestion.id
    setCardStatus(prev => ({ ...prev, [id]: 'applying' }))
    const firstEntityId = suggestion.entities[0]?.entityId
    const entity = firstEntityId ? ENTITIES.find(e => e.id === firstEntityId) : null
    const jobId = entity && agentActivity
      ? agentActivity.addJob({
          type: 'edit',
          entityId: entity.id,
          entityShortName: entity.shortName,
          title: suggestion.title,
          sectionTitle: suggestion.affectedSection,
          workflowSteps: buildEditSteps(entity.connectedApps, suggestion.affectedSection ?? ''),
        })
      : null
    setTimeout(() => {
      setCardStatus(prev => ({ ...prev, [id]: 'applied' }))
      if (jobId && agentActivity) agentActivity.completeJob(jobId)
    }, 30_000)
  }

  function handleRowCTA(e: React.MouseEvent, suggestion: PlanningSuggestion) {
    e.stopPropagation()
    handleApply(suggestion)
  }

  const stateSuggestions = PLANNING_SUGGESTIONS.filter(s => s.states.includes(state))
  const visibleSuggestions = showAll ? stateSuggestions : stateSuggestions.slice(0, VISIBLE_COUNT)
  const hasMore = stateSuggestions.length > VISIBLE_COUNT

  return (
    <section className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
          Planning Suggestions
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
          Agenda and presenter changes driven by external events.
        </p>
      </div>

      <div className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 divide-y divide-slate-100 dark:divide-zinc-800 flex flex-col">
        {visibleSuggestions.map((suggestion, i) => {
          const status = cardStatus[suggestion.id]
          const isApplying = status === 'applying'
          const isApplied = status === 'applied'
          const isBatch = suggestion.entities.length > 1
          const sourceStyle = SOURCE_CONFIG[suggestion.sourceType]
          const isFirst = i === 0
          const isLast = !hasMore && i === visibleSuggestions.length - 1

          return (
            <div
              key={suggestion.id}
              onClick={isApplying ? undefined : () => setSelectedSuggestion(suggestion)}
              className={`flex items-center gap-3 px-4 py-3 min-h-[64px] overflow-hidden transition-colors
                ${isFirst ? 'rounded-t-lg' : ''}
                ${isLast ? 'rounded-b-lg' : ''}
                ${isApplying
                  ? 'bg-slate-50 dark:bg-zinc-800 cursor-default'
                  : 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 active:bg-slate-100 dark:active:bg-zinc-700 cursor-pointer'
                }`}
            >
              {/* Logo(s) */}
              <div className={isApplying || isApplied ? 'opacity-40' : ''}>
                <LogoStack entityIds={suggestion.entities.map(e => e.entityId)} />
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${isApplying || isApplied ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`inline-flex items-center px-1.5 py-px rounded text-[10px] font-medium ${sourceStyle.className}`}>
                    {suggestion.sourceLabel}
                  </span>
                  {isBatch && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-1.5 py-px rounded">
                      <BatchIcon />
                      {suggestion.entities.length} packs
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2">
                  {suggestion.title}
                </p>
              </div>

              {/* CTA / status */}
              {isApplying ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-[11px] text-slate-400">Applying…</span>
                </div>
              ) : isApplied ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l3.5 3.5L13 5" />
                  </svg>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Applied</span>
                </div>
              ) : (
                <button
                  onClick={e => handleRowCTA(e, suggestion)}
                  className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-medium rounded-md hover:bg-slate-700 dark:hover:bg-white active:bg-slate-800 dark:active:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  {suggestion.actionLabel}
                </button>
              )}
            </div>
          )
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center justify-center gap-1 w-full py-2.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors rounded-b-lg"
          >
            {showAll ? 'Show less' : `Show ${stateSuggestions.length - VISIBLE_COUNT} more`}
            <svg className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>

      {selectedSuggestion && (
        <PlanningSuggestionModal
          suggestion={selectedSuggestion}
          isApplied={cardStatus[selectedSuggestion.id] === 'applied'}
          onApply={() => handleApply(selectedSuggestion)}
          onClose={() => setSelectedSuggestion(null)}
        />
      )}
    </section>
  )
}
```

- [ ] Create the file

### Step 2: Verify TypeScript compiles

```bash
cd "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3" && npx tsc --noEmit 2>&1 | grep "PlanningSuggestions"
```

Expected: no errors from `PlanningSuggestions.tsx`.

- [ ] Run and confirm

### Step 3: Commit

```bash
git add components/PlanningSuggestions.tsx
git commit -m "feat: add PlanningSuggestions component with inline CTA and source badges"
```

- [ ] Commit

---

## Task 4: Update `HomeContent.tsx` and delete old components

**Files:**
- Modify: `components/HomeContent.tsx`
- Delete: `components/NeedsYouNow.tsx`
- Delete: `components/EditSuggestions.tsx`

### Step 1: Update `HomeContent.tsx`

Replace the imports and grid in `components/HomeContent.tsx`:

```tsx
// Remove these imports:
import NeedsYouNow from '@/components/NeedsYouNow'
import EditSuggestions from '@/components/EditSuggestions'

// Add these:
import BookBuilding from '@/components/BookBuilding'
import PlanningSuggestions from '@/components/PlanningSuggestions'
```

Replace the grid div:

```tsx
// Remove:
<div className="grid grid-cols-2 gap-6 items-stretch">
  <NeedsYouNow />
  <EditSuggestions />
</div>

// Replace with:
<div className="flex flex-col gap-6">
  <BookBuilding />
  <PlanningSuggestions />
</div>
```

- [ ] Make the edit

### Step 2: Delete old component files

```bash
rm "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3/components/NeedsYouNow.tsx"
rm "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3/components/EditSuggestions.tsx"
```

- [ ] Run the commands

### Step 3: Verify full TypeScript compile

```bash
cd "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3" && npx tsc --noEmit 2>&1
```

Expected: no output (zero errors).

- [ ] Run and confirm zero errors

### Step 4: Visual verification

```bash
cd "/Users/dszabo/Documents/Claude Projects/83f44ff5-multi-entity-meeting-materials-v3" && npm run dev
```

Open http://localhost:3000 and verify:

- [ ] Two sections stack vertically (no side-by-side columns)
- [ ] "Book Building" header visible with subtitle "Gaps and missing items detected in your board packs."
- [ ] "Planning Suggestions" header visible with subtitle "Agenda and presenter changes driven by external events."
- [ ] **Calm state**: 2 items in Book Building (signature, approval categories); 3 items in Planning Suggestions (personnel, regulation × 2)
- [ ] **Busy state** (toggle proto-panel): additional items appear in both sections
- [ ] **Critical state** (toggle proto-panel): full item lists including geopolitical and CSRD items
- [ ] CTA button click: spinner appears, button replaced — no modal required
- [ ] Row body click: detail modal opens with entity logo, badge, title, detail text
- [ ] Dark mode: category icon boxes and source badges render correctly

### Step 5: Commit

```bash
git add components/HomeContent.tsx
git rm components/NeedsYouNow.tsx components/EditSuggestions.tsx
git commit -m "feat: replace Action Items/Edit Suggestions with Book Building/Planning Suggestions single-column layout"
```

- [ ] Commit
