# OGModders

## Current State
- GTA 5 mod hub with dark/black theme (oklch near-black background)
- 12 sample/placeholder mods hardcoded in INITIAL_MODS
- Mod cards show downloads count and star rating
- AdminPanel is unprotected (opens directly on button click)
- Mod detail page: not present -- clicking mod card shows download directly on card
- Search bar visible in navbar
- Stats bar in hero shows: mods count, downloads, modders

## Requested Changes (Diff)

### Add
- PIN protection on Admin panel: user must enter PIN `4098203457810923` before panel opens
- Mod detail page: clicking a mod card navigates to a detail view showing title, description, image, tags, author, and a download button
- Clickable mod cards (whole card is clickable, opens detail page)

### Modify
- Background changed from dark/black to white
- Full design adapted to look clean, professional, and visually impressive on a white background with bold GTA-style dark accents
- Remove sample/placeholder mods from INITIAL_MODS (start with empty array)
- Remove downloads count from mod cards, detail page, and admin form
- Remove ratings/stars from mod cards, detail page, and admin form
- CSS/index.css updated to white background theme with dark GTA accents
- Hero section stats: remove downloads stat, keep relevant ones
- Category colors adapted for light background
- Admin panel form: remove rating and downloads fields

### Remove
- 12 hardcoded sample mods (INITIAL_MODS becomes empty array [])
- Downloads display on mod cards
- Star/rating display on mod cards
- Rating and downloads fields in admin form

## Implementation Plan
1. Update index.css: white background, light theme tokens, dark accent colors, adapted glow/hover effects
2. Rewrite App.tsx:
   - INITIAL_MODS = [] (empty)
   - Remove downloads/rating fields from Mod interface or mark optional
   - Add PIN gate: state `pinUnlocked`, modal prompt for PIN before opening AdminPanel
   - Add ModDetailPage component: shows mod image, title, description, tags, author, download button
   - Update ModCard: make whole card clickable (cursor pointer, onClick opens detail), remove downloads/rating display
   - Update AdminPanel form: remove rating and downloads fields
   - Update FeaturedMods: handle card click to set selectedMod and show detail page
   - Adapt all colors for white/light background with dark GTA text and accents
   - Update HeroSection stats to remove downloads stat
