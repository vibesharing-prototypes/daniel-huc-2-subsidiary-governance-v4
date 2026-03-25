# Branch Divergence Analysis

## Situation Overview

**Date:** 2026-03-25

We have two divergent branches that could not be automatically merged:

1. **Current `main`** (local) - Full functional version with latest UI improvements
2. **`v4/main`** (remote: daniel-huc-2-subsidiary-governance-v4) - Marketing mode obfuscation

---

## Our Branch (Current Main)

**Latest commits:**
- `1f320d3` - chore: update prototype ID to HUC 2 Subsidiary Governance (V4)
- `8a55e2f` - feat: add max-width container and improve card CTA layout

**Key changes:**
- Added centered `max-w-6xl` container to main content areas
- Updated card CTAs to right-align (no more full-width stretch)
- Fixed dark mode button colors (`dark:bg-zinc-700` instead of bright white)
- Updated `vibesharing.json` to point to prototype ID `25b644f4-1813-49fb-95b2-c8bdc50507d6`

**Status:** ✅ Fully functional, latest features working

---

## V4 Remote Branch (Marketing Mode)

**Latest commits:**
- `c012c78` - Import from vibesharing-prototypes/daniel-huc-2-subsidiary-governance-v4
- `1240f08` - feat: marketing mode obfuscation on marketing-mode branch

**What Marketing Mode Does:**

### 1. Component Deletions
The marketing mode **deleted** these core functional components:
- `components/AgentActivityBanner.tsx`
- `components/AgentProgressWidget.tsx`
- `components/AgentUsecaseHeroes.tsx`
- `components/BoardPackViewer.tsx`
- `components/BookBuilding.tsx` ⚠️ (we modified this)
- `components/ConfirmActionModal.tsx`
- `components/ContextBar.tsx`
- `components/DocumentEditor.tsx`
- `components/EntityCardStrip.tsx`
- `components/EntitySidebar.tsx`
- `components/HomeContent.tsx` ⚠️ (we modified this)
- `components/HomeSidePanel.tsx`
- `components/PlanningSuggestions.tsx` ⚠️ (we modified this)
- `components/QuickActionsBar.tsx`
- `components/RedirectModal.tsx`
- `components/Sidebar.tsx`
- `components/TopNav.tsx`

### 2. Data Obfuscation
- Stripped `components/data.ts` from ~300 lines to minimal placeholders
- Removed real entity data (Meridian Capital, Apex Ventures, etc.)
- Removed all book building items and planning suggestions
- Kept only skeleton structure

### 3. Marketing Components Added
Created `components/marketing.tsx`:
```tsx
export const MARKETING_MODE = true

export function SkeletonBar({
  w = '100%',
  h = 7,
  opacity = 0.14,
}: {
  w?: string | number
  h?: number
  opacity?: number
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        background: `rgba(0,0,0,${opacity + 0.06})`,
        flexShrink: 0,
      }}
    />
  )
}
```

### 4. Build Artifacts Removed
- Deleted entire `out/` directory (static build)
- Deleted `package-lock.json`
- Removed `vibesharing.json` ⚠️ (we modified this)
- Deleted reference images and deploy scripts

### 5. Config Changes
- Updated `CLAUDE.md` to "Subsidiary Governance v4 — Marketing Mode"
- Modified README to reflect marketing/demo purpose
- Removed deployment documentation

**Purpose:** Create a "sanitized" demo version without real data or full functionality for public presentation/marketing.

---

## Merge Conflicts

When attempting to merge, we hit these conflicts:

| File | Status | Issue |
|------|--------|-------|
| `components/BookBuilding.tsx` | Deleted on v4, modified by us | We added UI improvements |
| `components/HomeContent.tsx` | Deleted on v4, modified by us | We added max-width container |
| `components/PlanningSuggestions.tsx` | Deleted on v4, modified by us | We added CTA layout fixes |
| `vibesharing.json` | Deleted on v4, modified by us | We updated prototype ID |

---

## Recommended Approach

### Option 1: Push Full Working Version to V4 (Recommended)

**Goal:** Make the fully functional version with your latest changes the canonical V4

**Steps:**
1. Force push our working `main` to `v4` remote
2. This overwrites the marketing mode on the v4 repo
3. V4 becomes the working prototype with max-width and CTA improvements
4. Verify VibeSharing prototype `25b644f4-1813-49fb-95b2-c8bdc50507d6` deploys correctly

**Commands:**
```bash
git push v4 main --force
```

**Pros:**
- Clean slate, no conflicts
- Your new changes go to the right place
- V4 has full functionality

**Cons:**
- Permanently loses the marketing mode on v4 repo
- Must recreate marketing mode separately if needed

---

### Option 2: Create Separate V5 Marketing Repo

**Goal:** Preserve marketing mode in a new dedicated repo/prototype

**Steps:**

#### A. Set up new V5 Marketing repo
```bash
# Create new directory for V5 Marketing
cd ~/Documents/Claude\ Projects/
mkdir subsidiary-governance-v5-marketing
cd subsidiary-governance-v5-marketing

# Clone the v4 remote to get marketing mode
git clone https://github.com/vibesharing-prototypes/daniel-huc-2-subsidiary-governance-v4.git .

# Or create fresh repo and cherry-pick marketing commits
git init
git remote add origin <NEW_V5_MARKETING_REPO_URL>
```

#### B. Create new VibeSharing prototype
1. Go to https://vibesharing.app
2. Create new prototype: "HUC 2 Subsidiary Governance V5 - Marketing"
3. Copy the new prototype ID

#### C. Configure deployment
```bash
# Add vibesharing.json with new V5 Marketing prototype ID
echo '{
  "prototypeId": "NEW_V5_MARKETING_PROTOTYPE_ID",
  "deployToken": "YOUR_DEPLOY_TOKEN"
}' > vibesharing.json

git add vibesharing.json
git commit -m "chore: configure V5 marketing prototype"
git push origin main
```

---

### Option 3: Marketing Mode as a Branch

**Goal:** Keep both versions in same repo via branches

**Structure:**
- `main` branch → Full functional version (V4)
- `marketing` branch → Obfuscated demo version (V5 Marketing)

**Not Recommended Because:**
- VibeSharing auto-deploy watches one branch per prototype
- Would need two separate repos anyway for two prototypes
- Confusing to maintain

---

## Recommendation Summary

**For immediate deployment:**
1. ✅ Force push working version to `v4` remote to restore functionality to V4 prototype
2. ✅ Verify changes deploy to prototype `25b644f4-1813-49fb-95b2-c8bdc50507d6`

**For marketing mode:**
1. Create fresh repo: `subsidiary-governance-v5-marketing`
2. Create new VibeSharing prototype: "HUC 2 Subsidiary Governance V5 - Marketing"
3. Cherry-pick commit `1240f08` or manually recreate marketing mode on top of working version
4. Configure separate `vibesharing.json` with V5 prototype ID

This keeps both versions clean, separate, and deployable without conflicts.
