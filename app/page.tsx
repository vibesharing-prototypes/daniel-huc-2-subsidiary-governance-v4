import type { Metadata } from 'next'
import ContextBar from '@/components/ContextBar'
import HomeContent from '@/components/HomeContent'
import FloatingChatPanel from '@/components/FloatingChatPanel'

export const metadata: Metadata = { title: 'Home' }

export default function Home() {
  return (
    <div className="h-full overflow-hidden bg-[#f0f0f1] dark:bg-zinc-950">
      <main className="h-full flex flex-col overflow-hidden">
        <ContextBar />
        <HomeContent />
      </main>
      <FloatingChatPanel />
    </div>
  )
}
