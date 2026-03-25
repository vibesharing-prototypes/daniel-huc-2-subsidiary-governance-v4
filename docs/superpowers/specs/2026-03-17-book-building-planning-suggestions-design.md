# Book Building & Planning Suggestions — Design Spec
**Date:** 2026-03-17
**Status:** Approved for implementation

---

## Overview

Replace the current two-column "Action Items / Edit Suggestions" layout with two full-width single-column sections: **Book Building** and **Planning Suggestions**. The redesign surfaces opportunities and required actions directly in each row, with an inline one-click CTA — reducing friction for the most common decisions.

---

## Layout Change

`HomeContent.tsx` changes from a two-column grid to a vertical stack:

```tsx
// Before
<div className="grid grid-cols-2 gap-6 items-stretch">
  <NeedsYouNow />
  <EditSuggestions />
</div>

// After
<div className="flex flex-col gap-6">
  <BookBuilding />
  <PlanningSuggestions />
</div>
```

---

## Item Row Anatomy (both sections)

```
[ 32×32 icon box ]  [ Title — gap / opportunity statement  12px semibold ]  [ CTA button ]
                    [ Entity name · context meta            11px muted    ]
```

- **Icon box**: 32px rounded-lg, coloured bg + stroke SVG icon. Colour encodes category (see per-section tables below).
- **Title**: the gap, risk, or action stated plainly — NOT a generic label.
- **Meta line**: entity shortName + brief context (last date, current agenda position, etc.).
- **CTA pill**: small dark button right-aligned. Clicking it **dispatches the agent job immediately from the row** — no modal required.
- **Row body click** (anywhere except the CTA pill): opens a detail modal for context.
- **Applying state**: CTA replaced by a spinner + "Applying…" text.
- **Applied state**: spinner replaced by green check + "Applied" text.

---

## Section 1: Book Building

**Replaces:** `NeedsYouNow.tsx` (delete after)
**New file:** `components/BookBuilding.tsx`
**Section title:** "Book Building"
**Subtitle:** "Gaps and missing items detected in your board packs."

### TypeScript type

```ts
export interface BookBuildingItem {
  id: number
  entityId: number
  category: 'gap' | 'overdue' | 'assignment' | 'signature' | 'approval'
  title: string        // the gap/opportunity as a plain statement
  meta: string         // short context shown in row meta line (e.g. "Last covered Mar 2025")
  detail: string       // longer explanation shown in modal body
  actionLabel: string  // CTA button text
  states: ProtoState[]
}
```

> `tag` / `tagColor` fields are **not needed** — entity identity is derived by lookup from `ENTITIES` via `entityId`.

### Category → icon box visual

| Category | Box bg | Box border | Icon | SVG path hint | Modal badge label | Modal badge classes |
|---|---|---|---|---|---|---|
| `gap` | red-50 | red-200 | Warning circle with dot | circle + vertical line + dot | "Gap detected" | `bg-red-50 border border-red-200 text-red-700` |
| `overdue` | amber-50 | amber-200 | Clock | circle + hour/minute hands | "Overdue" | `bg-amber-50 border border-amber-200 text-amber-700` |
| `assignment` | amber-50 | amber-200 | Person with plus | head+shoulders + plus | "Needs assignment" | `bg-amber-50 border border-amber-200 text-amber-700` |
| `signature` | slate-100 | slate-300 | Pen/signature | diagonal pen stroke | "Awaiting signatures" | `bg-slate-100 border border-slate-300 text-slate-600` |
| `approval` | slate-100 | slate-300 | Checkmark in circle | circle + check | "Awaiting approval" | `bg-slate-100 border border-slate-300 text-slate-600` |

### Agent job dispatch (CTA click)

```ts
const jobId = agentActivity.addJob({
  type: 'action',
  entityId: entity.id,
  entityShortName: entity.shortName,       // looked up from ENTITIES by entityId
  title: item.title,
  workflowSteps: buildBookBuildingSteps(entity.connectedApps),
})
setTimeout(() => agentActivity.completeJob(jobId), 30_000)
```

This applies to **both** the row CTA dispatch and the modal "Run in background" link — both schedule `completeJob` after 30 s.

`buildBookBuildingSteps` replaces `buildActionSteps` — **same implementation, rename only**. Logic: `['Retrieving task details from Entities', (if Minutes) 'Opening document in Minutes', 'Preparing task for processing', (if Boards NextGen) 'Updating status in Boards NextGen', 'Sending notification to stakeholders']`.

### Detail modal content (row body click)

1. Entity logo + name + country (top left)
2. Category badge (e.g. "Gap detected", "Overdue", "Needs assignment") — styled to match icon box colour
3. Title (`item.title`) as `text-base font-semibold`
4. Detail (`item.detail`) as `text-sm text-slate-500`
5. Footer: "Cancel" text button · "Run in background" underline link (calls `addJob` then `onClose`, dispatches a 30-second `setTimeout` that calls `completeJob` — identical to NeedsYouNow pattern) · `item.actionLabel` primary button linking to `/entity/{entityId}`

### Data — `BOOK_BUILDING_ITEMS`

| id | entityId | category | title | meta | detail | actionLabel | states |
|---|---|---|---|---|---|---|---|
| 1 | 4 (Nordic Solutions) | signature | Resolution awaiting 3 of 5 director signatures | Nordic Solutions · 3 of 5 complete | Capital restructuring resolution approved in December — 3 of 5 e-signatures complete. | Send reminder | calm, busy |
| 2 | 6 (Atlantic Resources) | approval | Pack at 95% — Chair approval required before distribution | Atlantic Resources · Pack at 95% | Pack is complete and awaiting final sign-off from the Chair before it can be distributed to directors. | Send for approval | calm, busy |
| 3 | 1 (Meridian Capital) | gap | No cybersecurity topic on the agenda in 12 months | Meridian Capital · Last covered Mar 2025 | Cybersecurity was last discussed in March 2025. Rising threat landscape may make this a material governance gap. | Add section | busy, critical |
| 4 | 2 (Apex Ventures) | gap | Carbon neutrality goals set Feb 2025 — no check-in since | Apex Ventures · 13 months since last mention | Board committed to interim carbon reduction targets 13 months ago. No progress update has been added to any subsequent agenda. | Add to agenda | busy, critical |
| 5 | 1 (Meridian Capital) | assignment | Financial Review section has no presenter assigned | Meridian Capital · Meeting in 15 days | Section 3.2 is unassigned. The board meeting is in 15 days and the pack is already in review. | Assign owner | busy, critical |
| 6 | 2 (Apex Ventures) | approval | GDPR data processing addendum sign-off blocking pack completion | Apex Ventures · Pack blocked | EU data processing addendum requires legal sign-off before the pack can be finalised and distributed. | Review item | critical |
| 7 | 5 (Pacific Rim Ops) | overdue | Q4 Financial Statements not received — pack cannot progress | Pacific Rim Ops · Meeting in 9 days | Finance has not submitted Q4 statements. The pack is blocked at 60% and the board meeting is in under two weeks. | Notify Finance | critical |

---

## Section 2: Planning Suggestions

**Replaces:** `EditSuggestions.tsx` (delete after)
**New file:** `components/PlanningSuggestions.tsx`
**Section title:** "Planning Suggestions"
**Subtitle:** "Agenda and presenter changes driven by external events."

### TypeScript type

```ts
export interface PlanningSuggestion {
  id: number
  entities: Array<{ entityId: number }>   // tag/tagColor removed; badge colour comes from sourceType
  sourceType: 'regulation' | 'market' | 'source-material' | 'personnel' | 'geopolitical' | 'reorder'
  sourceLabel: string
  title: string             // clear action description
  reason: string            // why this is being suggested
  affectedSection?: string  // optional — hide "Affected Section" block in modal when absent
  suggestedPrompt?: string  // optional — hide "Proposed Edit" block in modal when absent
  actionLabel: string       // one-click CTA text
  states: ProtoState[]
}
```

> `tag` / `tagColor` on entities are **intentionally removed**. Badge colour is driven by `sourceType` via `SOURCE_CONFIG` (see below).

### Source type → badge style (new `SOURCE_CONFIG`)

| sourceType | Badge classes |
|---|---|
| `regulation` | rose text / rose-50 bg / rose-200 border (existing) |
| `market` | blue-700 text / blue-50 bg / blue-200 border (existing) |
| `source-material` | violet-700 text / violet-50 bg / violet-200 border (existing) |
| `personnel` | teal-700 text / teal-50 bg / teal-200 border (new) |
| `geopolitical` | orange-700 text / orange-50 bg / orange-200 border (new) |
| `reorder` | blue-700 text / blue-50 bg / blue-200 border (**intentionally same as market** — both are informational/external triggers) |

### Agent job dispatch (CTA click)

Same as existing `EditSuggestions` `handleApply` logic — dispatches immediately from the row, no modal required. The modal's "Make changes" button also dispatches (for users who open modal first). Both paths schedule `completeJob` after 30 s.

`buildEditSteps` is called as `buildEditSteps(entity.connectedApps, suggestion.affectedSection ?? '')` — pass empty string as fallback when `affectedSection` is absent (items 4 and 6).

### Detail modal content (row body click)

Reuses existing `EditSuggestionModal` layout:
1. Source badge + entity logos/names
2. Title as `text-base font-semibold`
3. Reason as `text-sm text-slate-500`
4. "Affected Section" block — **only rendered if `affectedSection` is present**
5. "Proposed Edit" block — **only rendered if `suggestedPrompt` is present**
6. Footer: "Cancel" · "Make changes" primary button (dispatches agent job)

### Data — `PLANNING_SUGGESTIONS`

| id | entities | sourceType | sourceLabel | title | reason | affectedSection | suggestedPrompt | actionLabel | states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [2] Apex Ventures | personnel | CFO Succession | Update presenter for Financial Review and Budget — Anna Bauer appointed CFO 10 Mar | Klaus Weber (departing CFO) is still listed as presenter on Sections 3 and 5. Anna Bauer was appointed on 10 March 2026. | Financial Review | Update the presenter field on Sections 3 and 5 of the Apex Ventures board pack from Klaus Weber to Anna Bauer, effective 10 March 2026. | Update presenter | calm, busy |
| 2 | [2] Apex Ventures | regulation | EU AI Act | EU AI Act enforcement deadline shifted to Q3 — update Risk section | EU AI Act enforcement guidelines revised 24 Feb 2026 — key deadline shifted from Q2 to Q3 2026. | Risk & Compliance | Update the Risk & Compliance section for Apex Ventures to reflect the revised EU AI Act enforcement deadline (Q3 2026) and adjust the remediation budget timeline accordingly. | Apply | calm, busy, critical |
| 3 | [3] Horizon Digital | market | ECB Rate Cut | ECB cut to 2.90% — revise FX hedging commentary | ECB cut rates 25bps to 2.90% on 6 Mar 2026. Pack currently references the superseded rate of 3.15%. | Q4 Financial Statements | Update Horizon Digital's Q4 Financial Statements to reflect the ECB rate cut to 2.90% (6 Mar 2026) and revise all FX hedging commentary to align with the current rate environment. | Apply | calm, busy, critical |
| 4 | [4] Nordic Solutions | reorder | Agenda Reorder | Move EU Regulatory Update to agenda item 2 — AI Act enforcement revised | Item is currently listed at position 7. Given the AI Act enforcement revision, board attention is needed early in the meeting. | _(absent)_ | _(absent)_ | Reorder | busy, critical |
| 5 | [6] Atlantic Resources | source-material | Auditor Revision | Reconcile EBITDA — PwC revised Q4 accounts (£2.6m, was £2.8m) | PwC submitted revised management accounts on 28 Feb 2026. EBITDA now £2.6m; pack currently states £2.8m. | Q4 Financial Statements | Reconcile the Q4 Financial Statements for Atlantic Resources with PwC's revised management accounts: update EBITDA from £2.8m to £2.6m and recalculate EBITDA margin. | Apply | busy, critical |
| 6 | [1, 6, 8] Meridian, Atlantic, Eastern Markets | geopolitical | Geopolitical Risk | Add Geopolitical Risk section — armed conflict escalation affecting supply chain exposure | Escalation in Eastern Europe since 12 Mar 2026 may affect supply chain exposure for three entities with operations or counterparties in the region. | _(absent)_ | _(absent)_ | Add section | critical |
| 7 | [2, 3, 4, 7] Apex, Horizon, Nordic, Iberian | regulation | CSRD | Add mandatory ESG disclosure section to all 4 EU entity packs | CSRD mandatory reporting applies from Jan 2026 for qualifying EU entities. No ESG disclosure section exists in any of the 4 affected packs. | ESG Disclosure | Add an ESG disclosure section to board packs for the four EU entities, covering scope 1 & 2 emissions, social metrics, and board oversight of sustainability strategy as required under CSRD. | Apply | busy, critical |

---

## Files Changed

| File | Change |
|---|---|
| `components/data.ts` | Add `BookBuildingItem`, `PlanningSuggestion` types; add `BOOK_BUILDING_ITEMS`, `PLANNING_SUGGESTIONS` arrays; remove `ACTION_ITEMS`, `EDIT_SUGGESTIONS`, `ActionItem`, `EditSuggestion` |
| `components/BookBuilding.tsx` | New file — replaces NeedsYouNow |
| `components/PlanningSuggestions.tsx` | New file — replaces EditSuggestions |
| `components/NeedsYouNow.tsx` | Delete |
| `components/EditSuggestions.tsx` | Delete |
| `components/HomeContent.tsx` | Update imports; change grid to `flex flex-col gap-6` |

---

## Behaviour Preserved

- Proto-panel state toggle (calm / busy / critical) filters items by `states` field — unchanged
- Agent job dispatch (`addJob` / `completeJob`) and 30-second simulated completion — unchanged
- "Show N more / Show less" expand pattern — unchanged
- Dark mode — all new components follow existing `dark:` conventions
- `LogoWithTooltip` and `LogoStack` helper components — reused as-is
