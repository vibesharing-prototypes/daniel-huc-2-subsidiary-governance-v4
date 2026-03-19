'use client'

import { useEffect, useRef, useState } from 'react'
import { type AgentJob } from '@/components/AgentActivityContext'
import RedirectModal, { type RedirectDestination } from '@/components/RedirectModal'

const JOB_DURATION = 30_000
const MIN_STEP_MS = 2_000

function generateSchedule(stepCount: number): number[] {
  if (stepCount === 0) return []
  const extra = JOB_DURATION - stepCount * MIN_STEP_MS
  const weights = Array.from({ length: stepCount }, () => Math.random())
  const totalW = weights.reduce((a, b) => a + b, 0)
  let cum = 0
  return weights.map(w => { cum += Math.round(MIN_STEP_MS + (w / totalW) * extra); return cum })
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  )
}

export default function AgentProgressWidget({
  job,
  onDismiss,
}: {
  job: AgentJob
  onDismiss?: () => void
}) {
  const isDone = job.status === 'done'
  const steps = job.workflowSteps ?? []

  const [init] = useState(() => {
    const schedule = generateSchedule(steps.length)
    const elapsed = Date.now() - job.startedAt
    const completed = isDone
      ? steps.length
      : Math.min(schedule.filter(t => elapsed >= t).length, Math.max(0, steps.length - 1))
    return { schedule, completed }
  })

  const scheduleRef = useRef(init.schedule)
  const runConfigRef = useRef({ fromStep: init.completed, startedAt: job.startedAt })

  const [completedCount, setCompletedCount] = useState(init.completed)
  const [justCompleted, setJustCompleted] = useState<number | null>(null)
  const [stoppedAtStep, setStoppedAtStep] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [redirectDest, setRedirectDest] = useState<RedirectDestination | null>(null)

  const isStopped = stoppedAtStep !== null
  const showDone = isDone && !isStopped

  function handleStop() {
    setStoppedAtStep(completedCount)
  }

  function handleResume() {
    const resumeFrom = stoppedAtStep ?? completedCount
    const offset = resumeFrom > 0 ? (scheduleRef.current[resumeFrom - 1] ?? 0) : 0
    runConfigRef.current = { fromStep: resumeFrom, startedAt: Date.now() - offset }
    setStoppedAtStep(null)
    setCompletedCount(resumeFrom)
    setRunKey(k => k + 1)
  }

  function handleRestart() {
    runConfigRef.current = { fromStep: 0, startedAt: Date.now() }
    setStoppedAtStep(null)
    setCompletedCount(0)
    setRunKey(k => k + 1)
  }

  useEffect(() => {
    if (isDone || isStopped) return
    const { fromStep, startedAt } = runConfigRef.current
    const schedule = scheduleRef.current
    const now = Date.now()
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = fromStep; i < steps.length; i++) {
      const delay = startedAt + schedule[i] - now
      if (delay <= 0) { setCompletedCount(c => Math.max(c, i + 1)); continue }
      const idx = i
      timers.push(setTimeout(() => {
        setCompletedCount(idx + 1)
        setJustCompleted(idx)
        setTimeout(() => setJustCompleted(p => (p === idx ? null : p)), 750)
      }, delay))
    }
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone, isStopped, runKey, steps.length])

  const currentStepIndex = showDone ? steps.length - 1 : completedCount

  return (
    <div className="w-full">
      {/* Label */}
      <div className="mb-3">
        <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${
          showDone
            ? 'text-emerald-600 dark:text-emerald-500'
            : isStopped
            ? 'text-rose-500 dark:text-rose-400'
            : 'text-slate-500 dark:text-zinc-600'
        }`}>
          {showDone ? 'Task Complete' : isStopped ? 'Process Interrupted' : 'Agent Working'}
        </span>
      </div>

      {/* Milestone stepper */}
      <div className="flex items-center w-full mb-3">
        {steps.map((_, i) => {
          const isComplete = i < completedCount
          const isCurrent = !showDone && !isStopped && i === completedCount
          const isStoppedAt = isStopped && i === stoppedAtStep
          const isJustCompleted = i === justCompleted
          return (
            <div key={i} className="flex items-center" style={{ flex: i < steps.length - 1 ? '1 1 0' : '0 0 auto' }}>
              <div className="relative flex-shrink-0">
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-amber-400 dark:bg-amber-500 animate-ping opacity-40" />
                )}
                <div className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isJustCompleted ? 'step-pop' : ''
                } ${
                  isComplete
                    ? 'bg-emerald-500 dark:bg-emerald-600 shadow-sm'
                    : isStoppedAt
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-600'
                    : isCurrent
                    ? 'bg-amber-400 dark:bg-amber-500'
                    : 'bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700'
                }`}>
                  {isComplete && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                  {isStoppedAt && (
                    <svg className="w-3 h-3 text-rose-500 dark:text-rose-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  )}
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-white" />}
                  {!isComplete && !isCurrent && !isStoppedAt && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      i < completedCount ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-transparent'
                    }`}
                    style={{ width: i < completedCount ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Running footer */}
      {!showDone && !isStopped && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-snug">
            {steps[currentStepIndex] ?? ''}
          </span>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <button
              onClick={handleStop}
              className="text-[11px] text-slate-500 dark:text-zinc-700 hover:text-rose-500 dark:hover:text-rose-500 underline underline-offset-2 transition-colors"
            >
              Stop
            </button>
            <span className="text-[10px] text-slate-500 dark:text-zinc-600 tabular-nums">
              {Math.min(completedCount + 1, steps.length)}/{steps.length}
            </span>
          </div>
        </div>
      )}

      {/* Stopped footer */}
      {isStopped && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <XIcon />
                Interrupted at: {steps[stoppedAtStep!] ?? ''}
              </span>
              <button
                onClick={() => setShowDetails(v => !v)}
                className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-[11px] text-slate-500 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleResume}
              className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
            >
              Resume from here
            </button>
            <span className="text-[10px] text-slate-400 dark:text-zinc-700">·</span>
            <button
              onClick={handleRestart}
              className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
            >
              Restart from beginning
            </button>
          </div>
          {showDetails && (
            <div className="mt-2.5 pl-0.5 space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  {i < (stoppedAtStep ?? 0) ? (
                    <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  ) : i === stoppedAtStep ? (
                    <svg className="w-3 h-3 text-rose-400 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l6 6M9 3l-6 6" />
                    </svg>
                  ) : (
                    <span className="w-3 h-3 flex-shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    </span>
                  )}
                  <span className={
                    i < (stoppedAtStep ?? 0)
                      ? 'text-slate-500 dark:text-zinc-400'
                      : i === stoppedAtStep
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-slate-500 dark:text-zinc-600'
                  }>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Done footer */}
      {showDone && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckIcon />
                All steps complete — {job.entityShortName}
              </span>
              <button
                onClick={() => setShowDetails(v => !v)}
                className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              {job.destination && (
                <button
                  onClick={() => setRedirectDest(job.destination!)}
                  className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 underline underline-offset-2 transition-colors"
                >
                  {job.destination === 'forward-planner' ? 'Check in Forward Planner' : 'Check in Smart Book Builder'}
                  <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5h6M5 2l3 3-3 3"/><path d="M7 2h2v2"/>
                  </svg>
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-[11px] text-slate-500 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
          {showDetails && (
            <div className="mt-2.5 pl-0.5 space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                  <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {redirectDest && (
        <RedirectModal destination={redirectDest} onClose={() => setRedirectDest(null)} />
      )}
    </div>
  )
}
