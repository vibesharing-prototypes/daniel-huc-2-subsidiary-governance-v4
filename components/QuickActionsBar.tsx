'use client'

import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import { useAgentActivity } from '@/components/AgentActivityContext'
import { ENTITIES } from '@/components/data'

// ─── Action definitions ───────────────────────────────────────────────────────

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  entityIds: number[]
  title: string
  description: string
  affectedSection?: string
  proposedEdit?: string
  actionLabel: string
  badgeLabel: string
  badgeClasses: string
}

function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5 1v3M11 1v3M2 7h12" />
    </svg>
  )
}

function IconCalendarYear() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5 1v3M11 1v3M2 7h12M5 11h1M8 11h1M11 11h1" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M12 7c1.1 0 2 .9 2 2s-.9 2-2 2M14.5 14H15c0-1.8-1-3.3-2.5-4" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L3 4.5v3.5C3 11 5.2 13.5 8 14.5c2.8-1 5-3.5 5-6.5V4.5L8 2z" />
      <path d="M6 8.5l1.5 1.5L10.5 7" />
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3C9 3 5 6.5 5 11c0 .5.1 1 .2 1.5" />
      <path d="M5 11c1.5 0 5-1.5 8-8" />
      <path d="M3 14l2-3" />
    </svg>
  )
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'q3-plan',
    label: 'Create Q3 Plan',
    icon: <IconCalendar />,
    entityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    title: 'Create Q3 2026 board meeting plans for all 8 entities',
    description: 'Generate draft agenda frameworks for every Q3 2026 board meeting across all eight entities, based on standing items, the regulatory calendar, prior meeting patterns, and any open action items.',
    actionLabel: 'Create Q3 plans',
    badgeLabel: 'Board Planning',
    badgeClasses: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400',
  },
  {
    id: '2027-plan',
    label: 'Create 2027 Plan',
    icon: <IconCalendarYear />,
    entityIds: [1, 2, 3, 4, 5, 6, 7, 8],
    title: 'Create 2027 annual board calendar for all 8 entities',
    description: 'Generate a full-year 2027 board meeting schedule and agenda frameworks for all entities, aligned with statutory reporting cycles, regulatory filing deadlines, and governance best practices.',
    actionLabel: 'Create 2027 plans',
    badgeLabel: 'Annual Planning',
    badgeClasses: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400',
  },
  {
    id: 'sync-presenters',
    label: 'Sync All Presenters',
    icon: <IconUsers />,
    entityIds: [2, 4, 1],
    title: 'Update presenter assignments across 3 board packs',
    description: 'Apply all recent personnel changes to presenter fields in one step: Anna Bauer replaces Klaus Weber as CFO presenter at Apex Ventures, Erik Lindqvist takes over Financial Review at Nordic Solutions, and the unassigned Financial Review section at Meridian Capital is assigned.',
    affectedSection: 'Financial Review',
    actionLabel: 'Sync all presenters',
    badgeLabel: 'Personnel',
    badgeClasses: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400',
  },
  {
    id: 'update-risk',
    label: 'Update Risk Sections',
    icon: <IconShield />,
    entityIds: [2, 3, 4, 7],
    title: 'Apply latest regulatory changes to Risk & Compliance across 4 EU entities',
    description: 'Update Risk & Compliance sections for all four EU entities to reflect the revised EU AI Act enforcement deadline (Q3 2026, shifted from Q2) and the ECB rate cut to 2.90% on 6 March 2026. Outdated references are flagged and replaced automatically.',
    affectedSection: 'Risk & Compliance',
    proposedEdit: 'Update EU AI Act enforcement deadline from Q2 to Q3 2026, revise remediation budget timelines, and update ECB rate references from 3.15% to 2.90% across Apex Ventures, Horizon Digital, Nordic Solutions, and Iberian Holdings.',
    actionLabel: 'Update all 4',
    badgeLabel: 'Regulatory',
    badgeClasses: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400',
  },
  {
    id: 'align-esg',
    label: 'Align ESG Disclosures',
    icon: <IconLeaf />,
    entityIds: [2, 3, 4, 7],
    title: 'Add CSRD-compliant ESG disclosure sections to all 4 EU entity packs',
    description: 'Add standardised ESG disclosure sections to all four qualifying EU entity board packs, covering scope 1 & 2 emissions, social metrics, and board oversight of sustainability strategy — as required under CSRD from January 2026. None of the four packs currently include this section.',
    affectedSection: 'ESG Disclosure',
    proposedEdit: 'Add an ESG Disclosure section to board packs for Apex Ventures, Horizon Digital, Nordic Solutions, and Iberian Holdings covering scope 1 & 2 emissions, social metrics, and board oversight of sustainability strategy as required under CSRD.',
    actionLabel: 'Align all 4',
    badgeLabel: 'CSRD',
    badgeClasses: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const ITEM_GAP = 8
const APPROX_MORE_BTN_W = 90 // reserve space for "+N more ▾" button

export default function QuickActionsBar() {
  const [confirmAction, setConfirmAction] = useState<QuickAction | null>(null)
  const [visibleCount, setVisibleCount] = useState(QUICK_ACTIONS.length)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const agentActivity = useAgentActivity()

  // Overflow detection
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function measure() {
      if (!container) return
      const cw = container.offsetWidth
      const widths = itemRefs.current.map(el => el?.offsetWidth ?? 0)

      // Check if everything fits without a "more" button
      const totalW = widths.reduce((s, w, i) => s + w + (i > 0 ? ITEM_GAP : 0), 0)
      if (totalW <= cw) {
        setVisibleCount(QUICK_ACTIONS.length)
        return
      }

      // Reserve space for "more" button and count how many fit
      let used = 0
      let count = 0
      for (let i = 0; i < widths.length; i++) {
        const w = widths[i] + (i > 0 ? ITEM_GAP : 0)
        if (used + w + APPROX_MORE_BTN_W + ITEM_GAP > cw) break
        used += w
        count++
      }
      setVisibleCount(count)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e: MouseEvent) {
      if (!(e.target as Element).closest('[data-more-dropdown]')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  function handleConfirm(action: QuickAction) {
    if (!agentActivity) return
    const entities = action.entityIds.map(id => ENTITIES.find(e => e.id === id)!).filter(Boolean)
    const allApps = Array.from(new Set(entities.flatMap(e => e.connectedApps)))
    const steps = [
      'Scanning all affected board packs',
      allApps.includes('Boards NextGen') ? 'Opening packs in Boards NextGen' : 'Retrieving pack data',
      'Applying changes across entities',
      allApps.includes('Minutes') ? 'Updating documents in Minutes' : 'Finalising updates',
      'Running cross-entity consistency check',
      'Notifying stakeholders',
    ]
    const jobId = agentActivity.addJob({
      type: 'action',
      entityId: entities[0]?.id ?? 1,
      entityShortName: `${entities.length} entities`,
      title: action.title,
      workflowSteps: steps,
    })
    setTimeout(() => agentActivity.completeJob(jobId), 30_000)
  }

  const hiddenActions = QUICK_ACTIONS.slice(visibleCount)

  return (
    <>
      <div ref={containerRef} className="flex items-center gap-2 overflow-hidden">
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={action.id}
            ref={el => { itemRefs.current[i] = el }}
            onClick={() => setConfirmAction(action)}
            className={`flex-shrink-0 flex items-center gap-1.5 h-8 pl-2.5 pr-3 bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-zinc-700 rounded-lg text-[12px] font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-black/[0.13] dark:hover:border-zinc-600 hover:text-slate-800 dark:hover:text-zinc-100 transition-all whitespace-nowrap ${i >= visibleCount ? 'hidden' : ''}`}
          >
            <span className="text-slate-400 dark:text-zinc-500">{action.icon}</span>
            {action.label}
          </button>
        ))}

        {hiddenActions.length > 0 && (
          <div className="relative flex-shrink-0" data-more-dropdown>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-1 h-8 px-3 bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-zinc-700 rounded-lg text-[12px] font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-black/[0.13] transition-all whitespace-nowrap"
            >
              +{hiddenActions.length} more
              <svg
                className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-zinc-700 rounded-2xl shadow-xl py-1.5 z-30 min-w-[200px]"
                style={{ animation: 'confirmModalIn 150ms cubic-bezier(0.22,1,0.36,1) both' }}
              >
                {hiddenActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => { setConfirmAction(action); setDropdownOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <span className="text-slate-400 dark:text-zinc-500">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {confirmAction && (
        <ConfirmActionModal
          entityIds={confirmAction.entityIds}
          title={confirmAction.title}
          description={confirmAction.description}
          affectedSection={confirmAction.affectedSection}
          proposedEdit={confirmAction.proposedEdit}
          actionLabel={confirmAction.actionLabel}
          badgeLabel={confirmAction.badgeLabel}
          badgeClasses={confirmAction.badgeClasses}
          onConfirm={() => handleConfirm(confirmAction)}
          onClose={() => setConfirmAction(null)}
        />
      )}
    </>
  )
}
