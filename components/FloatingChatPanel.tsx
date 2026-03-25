'use client'

export default function FloatingChatPanel() {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, pointerEvents: 'none' }}>
      <div style={{ maxWidth: 768, margin: '0 auto', padding: '0 24px 20px', pointerEvents: 'auto' }}>
        <div className="rounded-2xl border border-black/[0.09] dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-2 shadow-[0_-4px_32px_rgba(0,0,0,0.10)]">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-800 border border-black/[0.05] dark:border-zinc-700 flex-shrink-0 p-1.5">
              <svg viewBox="0 0 210 222" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
                <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
                <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
              </svg>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Ask about entities, board packs, compliance…"
              className="flex-1 bg-transparent text-[14px] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
            />

            {/* Send button */}
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-900 dark:hover:bg-white active:bg-slate-950 dark:active:bg-zinc-200 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2L7 9" />
                <path d="M14 2L9.5 14L7 9L2 6.5L14 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
