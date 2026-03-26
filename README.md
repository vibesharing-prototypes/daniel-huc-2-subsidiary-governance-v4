# Subsidiary Board Management (HUC 2)

Multi-entity governance dashboard prototype for managing board packs, planning suggestions, and book building across 8 subsidiary entities.

**Live Prototype:** https://github.com/vibesharing-prototypes/daniel-huc-2-subsidiary-governance-v4

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy (via git push)
git push origin main
```

## Features

### Core Functionality
- **Multi-Entity Dashboard**: Manage 8 subsidiary entities with real-time progress tracking
- **Book Building**: Track gaps, overdue items, and missing sections across board packs
- **Planning Suggestions**: AI-driven recommendations from regulatory changes and external events
- **Board Pack Viewer**: Browse and navigate board meeting materials
- **Document Editor**: Edit board pack sections with AI assistance

### Marketing Mode
Toggle between **Full Mode** (complete functionality) and **Marketing Mode** (sanitized for promo videos):
- Single-line skeleton masks for subtitles
- Demoted CTAs to secondary style
- Shortened hero status lines
- Cleaner entity dropdown layout
- Access via proto-panel toggle (top of page)

### State System
Three dynamic states showing different scenarios:
- **CALM**: Normal operations, routine tasks
- **BUSY**: Multiple items requiring review
- **CRITICAL**: Emerging risks requiring disclosure

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   ├── entity/[id]/page.tsx    # Entity detail page
│   └── globals.css             # Tailwind + custom styles
├── components/
│   ├── AgentActivityBanner.tsx # Hero section with state
│   ├── BookBuilding.tsx        # Book building cards
│   ├── PlanningSuggestions.tsx # Planning suggestion cards
│   ├── ContextBar.tsx          # Entities dropdown
│   ├── MarketingModeContext.tsx# Marketing mode provider
│   ├── SkeletonBar.tsx         # Skeleton placeholder component
│   └── data.ts                 # Mock entity data
├── public/
│   ├── logos/                  # Entity logos
│   └── proto-panel.js          # Prototype controls
├── CLAUDE.md                   # Project instructions
└── docs/                       # Session notes & specs
```

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (via GitHub)
- **Typography**: Plus Jakarta Sans

## Deployment

Push to main branch - Vercel auto-deploys within 30-60 seconds:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Do NOT use** `vercel deploy` CLI or VibeSharing MCP tools.

## Z-Index Hierarchy

- **z-[200]**: All modals (top layer)
- **z-[100]**: FloatingChatPanel
- **z-[60]**: ContextBar (Entities dropdown)
- **z-[30]**: Dropdown menus
- **z-[20]**: Tooltips

## Key Documentation

- `CLAUDE.md` - Project instructions and conventions
- `docs/MARKETING-MODE-INTEGRATION.md` - Marketing mode implementation details
- `docs/SESSION-2026-03-26-marketing-mode.md` - Latest session summary
- `visual_direction.md` - Design principles and visual spec
