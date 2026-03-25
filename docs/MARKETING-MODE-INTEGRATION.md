# Marketing Mode Integration

## Overview

Marketing mode is now integrated as a toggle in the proto panel. When enabled, it shows skeleton placeholder bars instead of real content, creating a sanitized demo version suitable for public presentations.

## Implementation

### 1. Components Added

**`components/MarketingModeContext.tsx`**
- Context provider that listens for `proto:marketing` events
- Provides `useMarketingMode()` hook to access the current mode state

**`components/SkeletonBar.tsx`**
- Reusable skeleton placeholder component
- Configurable width, height, and opacity
- Supports dark mode via Tailwind classes

### 2. Proto Panel Updates

**`public/proto-panel.js`**
- Added `marketingToggle` option to DEFAULTS
- Created `pp-marketing-pill` CSS styles with amber highlight for active state
- Added "MODE" toggle group with "FULL" and "MARKETING" buttons
- Implemented event dispatcher for `proto:marketing` custom event
- Marketing mode toggle appears after STATE toggle in the expanded panel

### 3. Layout Integration

**`app/layout.tsx`**
- Wrapped children with `<MarketingModeProvider>`
- All pages now have access to marketing mode state

### 4. Component Updates

**`components/BookBuilding.tsx`**
- Added `useMarketingMode()` hook
- Title shows skeleton bars (2 lines, 85% and 65% width) when in marketing mode
- Detail text shows skeleton bars (3 lines, full to 88% width) when in marketing mode
- CTAs show skeleton bars (100px and 70px width) when in marketing mode

**`components/PlanningSuggestions.tsx`**
- Added `useMarketingMode()` hook
- Title shows skeleton bars (2 lines, 90% and 70% width) when in marketing mode
- Reason text shows skeleton bars (3 lines, full to 85% width) when in marketing mode
- CTAs show skeleton bars (110px and 70px width) when in marketing mode

## Usage

1. **Enable Marketing Mode**: Open proto panel and toggle MODE to "MARKETING"
2. **Disable Marketing Mode**: Toggle MODE back to "FULL"

When marketing mode is active:
- All card titles and detail text are replaced with skeleton bars
- All CTA buttons are replaced with skeleton bars
- Entity information and badges remain visible
- Card structure and layout are preserved
- Agent progress widgets and applied states are hidden

## Benefits

- **Single Codebase**: No need to maintain separate repos or branches
- **Live Toggle**: Switch between full and marketing mode instantly
- **Easy Demo**: Perfect for screenshots, videos, and live presentations
- **Privacy**: No real entity data or sensitive content exposed
- **Consistent UI**: Marketing mode preserves the visual structure and design

## Technical Details

### Event Flow

1. User clicks "MARKETING" in proto panel
2. Proto panel dispatches `proto:marketing` event with `{mode: 'marketing'}`
3. `MarketingModeContext` listens and updates state
4. Components using `useMarketingMode()` re-render
5. Conditional rendering shows skeleton bars

### Skeleton Bar Configuration

```tsx
<SkeletonBar
  w="85%"        // width (string or number)
  h={10}         // height in px
  opacity={0.14} // base opacity (adds 0.06 for final value)
/>
```

The component automatically handles dark mode with `dark:bg-white/[0.08]` class.

## Future Enhancements

Potential additions:
- Obfuscate entity names and dates
- Show placeholder text for section titles
- Add marketing mode to other components (TopNav, AgentActivityBanner, etc.)
- Save marketing mode preference in localStorage
