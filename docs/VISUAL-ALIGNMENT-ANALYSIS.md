# Visual Alignment Analysis: HUC6 Spec → Subsidiary Governance

## Current State vs. Target Spec

### ✅ Already Aligned

These elements already match the HUC6 specification:

1. **Font Family**: Plus Jakarta Sans ✅
2. **Font Weights**: 300, 400, 600 (no 700) ✅
3. **Max Width**: `max-w-6xl` (1152px) for main content ✅
4. **Card Border Radius**: `rounded-[20px]` ✅
5. **Button Border Radius**: `rounded-xl` (12px) ✅
6. **Dark Mode**: Class-based toggle via `<html>` ✅
7. **Base Background**: `bg-[#f0f0f1] dark:bg-zinc-950` ✅

---

## 🔧 Changes Needed

### 1. Typography Adjustments

**Current State**: Mix of semantic classes and arbitrary values
**Target**: Consistent arbitrary value sizing

| Element | Current | Target | Action |
|---------|---------|--------|--------|
| Card title | `text-[16px] font-semibold` | Same ✅ | No change |
| Body text | `text-[13px]` | Same ✅ | No change |
| Button text | `text-[14px] font-normal` | Same ✅ | No change |
| Secondary CTA | `text-[13px]` | Same ✅ | No change |
| Badge/pill | `text-[11px] font-semibold` | Same ✅ | No change |
| Section headers | Mixed | `text-[11px] font-semibold uppercase tracking-wide` | **Standardize** |

**Changes Required**:
- Audit all section headers to use consistent `text-[11px] font-semibold uppercase tracking-wide`
- Check for any `text-sm`, `text-xs`, `text-base` semantic classes → convert to arbitrary values

---

### 2. Border System

**Current State**: Mixed border styles
**Target**: Consistent transparent black borders

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Standard card border | `border border-black/[0.09] dark:border-zinc-700` | Same ✅ | Aligned |
| Card hover border | `hover:border-slate-200 dark:hover:border-zinc-600` | Same ✅ | Aligned |
| Subtle divider | Mixed | `border-black/[0.05] dark:border-zinc-800` | **Check usage** |

**Changes Required**:
- Audit all borders to ensure using transparent black (`border-black/[0.09]`) not solid colors
- Verify all borders have dark mode variants

---

### 3. Text Color System

**Current State**: Mix of slate-500/900 and zinc colors
**Target**: Consistent slate in light, zinc in dark

| Usage | Current | Target | Action |
|-------|---------|--------|--------|
| Primary text | `text-slate-900 dark:text-zinc-100` | `text-slate-800 dark:text-zinc-100` | **Lighten light mode** |
| Secondary text | `text-slate-500 dark:text-zinc-400` | Same ✅ | Aligned |
| Muted text | Mixed | `text-slate-400 dark:text-zinc-500` | **Standardize** |
| Very muted | Mixed | `text-slate-300 dark:text-zinc-600` | **Add if needed** |

**Changes Required**:
- Replace `text-slate-900` with `text-slate-800` for primary text
- Audit all text colors for consistency with the 4-tier system:
  - Primary: `slate-800 / zinc-100`
  - Secondary: `slate-500 / zinc-400`
  - Muted: `slate-400 / zinc-500`
  - Very muted: `slate-300 / zinc-600`

---

### 4. Background Colors

**Current State**: Mostly aligned, minor variations
**Target**: Consistent layering

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Page background | `bg-[#f0f0f1] dark:bg-zinc-950` | Same ✅ | Aligned |
| Cards/panels | `bg-white dark:bg-zinc-900` | Same ✅ | Aligned |
| Inset areas | Mixed | `bg-slate-50/50 dark:bg-zinc-800/30` | **Standardize** |
| Inset (opaque) | Mixed | `bg-slate-50 dark:bg-zinc-800` | **Standardize** |

**Changes Required**:
- Audit all background colors for the proper layering system
- Ensure side panels, footers use `bg-slate-50/50 dark:bg-zinc-800/30` or opaque variant

---

### 5. Button Styles

**Current State**: Close to target, needs minor refinement

#### Primary CTA
**Current**:
```tsx
text-[14px] font-normal bg-slate-800 dark:bg-zinc-700 text-white dark:text-zinc-100
```

**Target**:
```tsx
text-[14px] font-normal bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900
```

**Change**: Dark mode should use light background with dark text (inverted)

#### Secondary CTA
**Current**:
```tsx
text-[13px] font-normal text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-800
border border-black/[0.09] dark:border-zinc-700
```

**Target**: Same ✅

**Changes Required**:
- Update primary button dark mode: `dark:bg-zinc-100 dark:text-zinc-900` (not `dark:bg-zinc-700`)
- Verify hover states match spec

---

### 6. Card Padding

**Current State**: Likely varies
**Target**: Consistent padding system

| Card Type | Current | Target | Action |
|-----------|---------|--------|--------|
| Standard card | Unknown | `p-[22px_24px]` (22px vertical, 24px horizontal) | **Audit & update** |
| Compact card | Unknown | `p-[18px_20px]` | **Add if needed** |

**Changes Required**:
- Replace generic `p-6` or other padding with specific `p-[22px_24px]` for action cards
- Measure current padding and adjust to spec

---

### 7. Spacing & Gaps

**Current State**: Needs audit
**Target**: Consistent spacing scale

| Usage | Target | Action |
|-------|--------|--------|
| Section spacing | `space-y-6` (24px) | **Verify** |
| Cards in list | `space-y-3` (12px) | **Verify** |
| Section header to content | `mb-3` (12px) | **Verify** |
| Button groups | `gap-2` (8px) | **Verify** |
| Horizontal elements | `gap-3` (12px) | **Verify** |

**Changes Required**:
- Audit all spacing values against the spec
- Replace any custom spacing with standard scale

---

### 8. Status/Semantic Colors

**Current State**: Functional but needs alignment
**Target**: Consistent badge system

| Status | Target Badge Classes |
|--------|---------------------|
| Critical/High | `bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400` |
| Warning | `bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400` |
| Success | `bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400` |
| Neutral/Low | `bg-slate-100 border-slate-300 text-slate-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400` |

**Changes Required**:
- Update all badge components to match this exact pattern
- Ensure using `-50` backgrounds in light mode, `-950/40` in dark mode
- Ensure using `-200` borders in light mode, `-800` in dark mode

---

### 9. Animations

**Current State**: Cards have fade-slide-up animation ✅
**Target**: Consistent animation system

**Check**:
- `fadeSlideUp` keyframe exists ✅
- Staggered delay: `${i * 120}ms` ✅
- Card hover lift with `hover:-translate-y-0.5` — **needs audit**
- Performance hints: `[will-change:transform] [backface-visibility:hidden]` — **needs audit**

**Changes Required**:
- Verify all animated cards have performance hints
- Ensure hover states include subtle lift effect

---

### 10. Missing Patterns to Add

These patterns from the spec don't exist in current app (may not be needed):

- [ ] Hero banner with radial glow overlay
- [ ] Workflow stepper component
- [ ] Floating prompt bar
- [ ] Moody's Intelligence inset card pattern
- [ ] Owner suggestion side panel
- [ ] Gradient dividers

**Decision**: Skip these unless features require them

---

## 📋 Implementation Steps

### Phase 1: Text & Typography (Low Risk)
1. Audit all section headers → standardize to `text-[11px] font-semibold uppercase tracking-wide`
2. Replace `text-slate-900` with `text-slate-800` for primary text
3. Standardize muted text colors to `text-slate-400 dark:text-zinc-500`
4. Convert any semantic text classes (`text-sm`, `text-base`) to arbitrary values

**Files**: All component files with text

---

### Phase 2: Borders (Low Risk)
1. Audit all border usage to ensure `border-black/[0.09] dark:border-zinc-700`
2. Check subtle dividers use `border-black/[0.05] dark:border-zinc-800`
3. Verify all borders have dark mode variants

**Files**: All component files with borders

---

### Phase 3: Backgrounds & Layers (Low Risk)
1. Audit inset areas (footers, side panels) → `bg-slate-50/50 dark:bg-zinc-800/30`
2. Verify card backgrounds use `bg-white dark:bg-zinc-900`

**Files**: Layout components, panels, footers

---

### Phase 4: Buttons (Medium Risk)
1. Update primary button dark mode: `dark:bg-zinc-100 dark:text-zinc-900`
2. Verify secondary button styling matches spec
3. Update hover states if needed

**Files**: `BookBuilding.tsx`, `PlanningSuggestions.tsx`, modal components

---

### Phase 5: Card Padding (Medium Risk)
1. Measure current card padding
2. Replace with `p-[22px_24px]` for action cards
3. Test layout doesn't break

**Files**: `BookBuilding.tsx`, `PlanningSuggestions.tsx`, card components

---

### Phase 6: Spacing & Gaps (Low Risk)
1. Audit spacing between cards → ensure `space-y-3`
2. Audit section spacing → ensure `space-y-6`
3. Audit button groups → ensure `gap-2`

**Files**: Container components, list components

---

### Phase 7: Status Colors & Badges (Medium Risk)
1. Update all badge components to match spec pattern
2. Ensure `-50/-950/40` backgrounds
3. Ensure `-200/-800` borders
4. Test visual consistency

**Files**: Badge components, status indicators

---

### Phase 8: Animations & Performance (Low Risk)
1. Add `[will-change:transform] [backface-visibility:hidden]` to animated cards
2. Verify `hover:-translate-y-0.5` on card hovers
3. Test animations are smooth

**Files**: Card components

---

### Phase 9: Final Polish (Low Risk)
1. Audit for any remaining misalignments
2. Test in both light and dark modes
3. Verify visual consistency across all pages

---

## 🎯 Priority Order

**High Priority** (Most visible, low risk):
1. Text color standardization (Phase 1)
2. Primary button dark mode fix (Phase 4)
3. Status badge updates (Phase 7)

**Medium Priority** (Important, some testing needed):
4. Card padding adjustment (Phase 5)
5. Border standardization (Phase 2)
6. Background layers (Phase 3)

**Low Priority** (Nice to have, minimal impact):
7. Spacing audit (Phase 6)
8. Animation polish (Phase 8)
9. Final polish (Phase 9)

---

## 📊 Estimated Changes

| Category | Files Affected | Complexity | Risk |
|----------|---------------|------------|------|
| Typography | ~10 files | Low | Low |
| Borders | ~8 files | Low | Low |
| Backgrounds | ~5 files | Low | Low |
| Buttons | ~5 files | Medium | Medium |
| Card Padding | ~5 files | Medium | Medium |
| Spacing | ~8 files | Low | Low |
| Status Colors | ~3 files | Medium | Medium |
| Animations | ~5 files | Low | Low |

**Total estimated files**: ~15-20 component files
**Estimated time**: 2-3 hours for full alignment
**Risk level**: Low to Medium (mostly CSS/Tailwind class changes)

---

## ✅ Verification Checklist

After each phase:
- [ ] Check light mode appearance
- [ ] Check dark mode appearance
- [ ] Verify no layout breaks
- [ ] Test hover/active states
- [ ] Commit with descriptive message

---

**Ready to proceed with implementation in phases when you give the word.**
