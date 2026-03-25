# Card Redesign: Book Building & Planning Suggestions

## Goal

Replace compact 64px action rows with spacious, data-rich cards that surface the *reason* behind each suggestion. Cards use layered animations (staggered entrance, breathing glow, hover-reveal, priority bar fill) for expo-floor impact. Visual style matches the Automated Audit Reporting reference prototype.

## What Changes

- **BookBuilding.tsx** — row items become standalone cards; remove outer `divide-y` list wrapper
- **PlanningSuggestions.tsx** — row items become standalone cards; remove outer `divide-y` list wrapper
- **globals.css** — new keyframe animations and card utility classes
- **data.ts** — no changes (existing `detail`, `reason`, `affectedSection`, `suggestedPrompt` fields provide the content)

Modals, agent job dispatch, CTA behaviour, show-more pattern, and proto-state filtering all remain unchanged.

---

## Card Anatomy

Both sections share the same card structure. Each card is a white `border-radius: 20px` container with `border: 1px solid rgba(0,0,0,0.09)`. Cards are separated by `space-y-3` (12px gap) — no outer wrapper border or `divide-y`.

### Layout (top to bottom)

1. **Category glow** — absolute-positioned radial gradient at top (80px tall), colour keyed to category/source, breathing animation (`glowBreath 3.5s ease-in-out infinite`)
2. **Entity row** — `EntityLogo` (36px, 10px radius) + entity name (13px/600) + country & board date (12px/400 `#525252`) + category/source badge (pill, 20px radius, 11px/600)
   - For PlanningSuggestions with multiple entities: use `LogoStack` (existing component) in place of single `EntityLogo`. Show first entity name + "+ N more" in the entity name area.
3. **Title** — 16px/600 `#282E37`, line-height 1.35
4. **Detail text** — always visible; 13px/400 `#525252`, line-height 1.6
   - BookBuilding: `item.detail` (full text, no truncation)
   - PlanningSuggestions: `suggestion.reason`
5. **Hover-reveal block** — hidden by default; expands on hover (max-height transition 0.4s). See detailed rules below.
6. **Priority bar** — 4px track with animated fill (1.2s ease-out) + shimmer overlay + label
7. **CTA row** — primary button (flex: 1) + "Details" secondary button

**Removed elements:** The existing 32px category icon box (coloured square with SVG) is removed. Category identity is now conveyed by the glow, badge, and priority bar colour — the icon box added clutter in the larger card format.

**`item.meta` field:** Not rendered in the new card layout. The information it contained (entity name, contextual snippet) is now surfaced through the entity row (step 2) and the always-visible detail text (step 4). No data is lost.

### Hover-Reveal Block Rules

**BookBuilding:**
- The detail text (step 4) always shows the full `item.detail` — no truncation.
- The hover-reveal block is therefore **not used** for BookBuilding cards. There is no additional text to reveal beyond what's already visible.

**PlanningSuggestions:**
- If `affectedSection` is present: show a left-bordered block with "AFFECTED SECTION: {name}" label (11px/600 uppercase) + `suggestedPrompt` text (12px/400) if present
- If `affectedSection` is absent but `suggestedPrompt` is present: show just the `suggestedPrompt` in the left-bordered block
- If both `affectedSection` and `suggestedPrompt` are absent: **omit the hover-reveal block entirely** (no empty expanding block)
- Left border colour matches the source type's glow colour at full opacity

### Priority Derivation (no data change)

Use a single `PRIORITY_CONFIG` map keyed by category/source type. Apply via inline style for the fill width (since each level needs a different `width` target).

BookBuilding categories:
| Category | Fill % | Gradient | Label |
|---|---|---|---|
| gap | 85% | `#D3222A` → `#f97316` | High priority |
| overdue | 85% | `#D3222A` → `#f97316` | High priority |
| assignment | 55% | `#f59e0b` → `#eab308` | Medium |
| signature | 35% | `#94a3b8` → `#cbd5e1` | Low |
| approval | 35% | `#94a3b8` → `#cbd5e1` | Low |

PlanningSuggestions source types:
| Source Type | Fill % | Gradient | Label |
|---|---|---|---|
| regulation | 85% | `#D3222A` → `#f97316` | High priority |
| geopolitical | 85% | `#D3222A` → `#f97316` | High priority |
| market | 70% | `#f59e0b` → `#eab308` | Medium-high |
| source-material | 70% | `#f59e0b` → `#eab308` | Medium-high |
| personnel | 55% | `#f59e0b` → `#eab308` | Medium |
| reorder | 55% | `#f59e0b` → `#eab308` | Medium |

**Implementation:** Use a single CSS keyframe (`barFill`) that animates `width: 0%` → `width: var(--bar-target)`. Set `--bar-target` as an inline CSS variable per card (e.g. `style={{ '--bar-target': '85%' } as React.CSSProperties}`). This avoids needing separate keyframes per fill level.

```css
@keyframes barFill {
  from { width: 0%; }
  to { width: var(--bar-target); }
}
```

### Glow Colours

BookBuilding — keyed to category:
| Category | Glow |
|---|---|
| gap | `rgba(239,68,68,0.07)` (red) |
| overdue | `rgba(239,68,68,0.07)` (red) |
| assignment | `rgba(245,158,11,0.07)` (amber) |
| signature | `rgba(148,163,184,0.05)` (slate) |
| approval | `rgba(148,163,184,0.05)` (slate) |

PlanningSuggestions — keyed to source type:
| Source Type | Glow |
|---|---|
| regulation | `rgba(244,63,94,0.07)` (rose) |
| market | `rgba(59,130,246,0.07)` (blue) |
| reorder | `rgba(59,130,246,0.07)` (blue) |
| source-material | `rgba(139,92,246,0.07)` (violet) |
| personnel | `rgba(20,184,166,0.07)` (teal) |
| geopolitical | `rgba(249,115,22,0.07)` (orange) |

### Badge Styles

BookBuilding badges use existing `CATEGORY_CONFIG.badgeLabel` text, styled as pills (20px radius, 11px/600, 4px 12px padding, border 1px solid). Colours match existing `badgeClasses` but updated to pill shape.

PlanningSuggestions badges display `sourceLabel` text using existing `SOURCE_CONFIG` colours, updated to pill shape (20px radius).

---

## Animations

All animations use CSS keyframes defined in `globals.css` — no JavaScript animation libraries.

### 1. Staggered Entrance (`fadeSlideUp`)
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- Duration: 0.5s ease-out, `animation-fill-mode: both`
- Each card gets `style={{ animationDelay: '${index * 120}ms' }}` (inline style — Tailwind has no dynamic delay utility)
- On "Show more" toggle: newly revealed cards use their absolute index in the full list (not reset to 0), so they stagger naturally from where the visible cards left off

### 2. Breathing Glow (`glowBreath`)
```css
@keyframes glowBreath {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```
- Applied to the glow overlay div, duration 3.5s infinite

### 3. Priority Bar Fill (`barFill`)
```css
@keyframes barFill {
  from { width: 0%; }
  to { width: var(--bar-target); }
}
```
- Duration: 1.2s ease-out forwards
- Delay: applied via inline style `animationDelay: '${500 + index * 120}ms'` (starts after card entrance)
- Shimmer overlay: `shimmer 2.5s 1.5s infinite`

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}
```

### 4. Hover Expand (PlanningSuggestions only)
- Base: `max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease, opacity 0.3s ease`
- On card `:hover`: `max-height: 150px; opacity: 1`
- Not used on touch devices — this content is supplementary and always accessible via the "Details" modal button

### 5. Card Hover Lift
- `transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s`
- Hover: `transform: translateY(-2px); box-shadow: 0 8px 30px -8px rgba(0,0,0,0.1); border-color: rgba(0,0,0,0.14)`

---

## Visual Style (matching Automated Audit Reporting reference)

| Element | Value |
|---|---|
| Font family | `var(--font-plus-jakarta-sans)` (already loaded) |
| Card border-radius | 20px (`rounded-[20px]`) |
| Card border | `1px solid rgba(0,0,0,0.09)` (`border border-black/[0.09]`) |
| Card background | `bg-white dark:bg-zinc-900` |
| Card padding | 22px 24px |
| Primary button | bg `#1e293b` (`bg-slate-800`), text white, 14px/400, 12px radius, padding 11px 16px |
| Primary button hover | `bg-slate-900` (`#0f172a`) |
| Secondary button | bg white, border `rgba(0,0,0,0.09)`, text `#525252`, 13px/400, 12px radius |
| Text primary | `text-slate-900 dark:text-zinc-100` |
| Text secondary | `text-slate-500 dark:text-zinc-400` |
| Section label | 11px/600 uppercase tracking-wide |
| Card spacing | 12px gap between cards (`space-y-3`) |

### Dark Mode

All card elements must include dark variants matching existing codebase patterns:
| Element | Light | Dark |
|---|---|---|
| Card background | `bg-white` | `dark:bg-zinc-900` |
| Card border | `border-black/[0.09]` | `dark:border-zinc-700` |
| Card hover border | `border-black/[0.14]` | `dark:border-zinc-600` |
| Glow opacity | as specified | same values (the rgba already works on dark backgrounds) |
| Primary button | `bg-slate-800` | `dark:bg-zinc-100 dark:text-zinc-900` |
| Primary button hover | `bg-slate-900` | `dark:bg-white` |
| Secondary button bg | `bg-white` | `dark:bg-zinc-800` |
| Secondary button border | `border-black/[0.09]` | `dark:border-zinc-700` |
| Priority track bg | `bg-slate-100` | `dark:bg-zinc-800` |
| Hover-reveal border | colour-keyed (same) | same values |

---

## Interaction Behaviour (unchanged)

- **Primary CTA click** (on card): dispatches agent job immediately (same `handleCTA` / `handleRowCTA` logic), sets item status to `'applying'`
- **"Details" button click** (`e.stopPropagation()`): opens existing modal (`BookBuildingModal` / `PlanningSuggestionModal`)
- **Card body click**: opens modal (same as current row click)
- **Applying state**: card content fades to 40% opacity, CTA row replaced with spinner + "Applying..." text
- **Applied state**: BookBuilding shows green checkmark + "Done"; PlanningSuggestions shows green checkmark + "Applied" (preserving existing per-component labels)
- **Show more**: same toggle pattern, `VISIBLE_COUNT = 3`

---

## What Stays the Same

- Data types and arrays in `data.ts`
- Modal components (BookBuildingModal, PlanningSuggestionModal)
- Agent workflow step builders (buildBookBuildingSteps, buildEditSteps)
- Proto-state filtering
- AgentActivity context integration
- LogoStack and BatchIcon components in PlanningSuggestions
- Show-more button pattern
