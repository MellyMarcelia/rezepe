# Rezepe

**Keep your family’s recipes — and the stories behind them — alive for the next generation.**

Most recipe apps are built for discovering something new. Rezepe is built for the recipes you already have: Grandma’s noodles written on a torn piece of paper, Mum’s voice note, the cookie recipe that only exists in someone’s head. It turns them into a shared family cookbook where every dish keeps its story, and every new generation can add its own twist.

Rezepe started as a UX research project (interviews, personas, journey mapping, Figma prototype) and is now a working, tablet-first web app built with Vue 3.

## What it does

- **Family circles** — private cookbooks for each part of the family (“Grandma’s Cookbook”, “Thanksgiving Menus”), with members, a recipe feed and an activity stream.
- **Recipes with a story** — every recipe carries the memory behind it (“in the family for 21 years”), shown as a pull quote, not hidden at the bottom.
- **Twists** — change a family recipe without overwriting it. A twist is saved next to the original with a required *“what did you change?”* note, so you can see how a dish evolved.
- **Hands-free cook mode** — one step at a time in large type, read aloud, with voice commands (“next”, “back”, “repeat”, “ingredients”, “start timer”). Timers are detected from the step text (“simmer for 10 minutes”), and the screen stays awake. Built for tablets propped up on a kitchen counter.
- **Smart ingredients** — scale servings, switch between metric and US units, and tick ingredients off as you go.
- **Bring recipes in from anywhere** — paste a message from WhatsApp or email and it is parsed into ingredients and steps; dictate the story by voice; add a photo of the dish or the handwritten card.
- **Social, but family-sized** — love, save to your own cookbook, and comment (“Kitchen table talk”).

## From research to product

Interview findings that shaped the app:

| What people told us | What Rezepe does |
| --- | --- |
| “I want to avoid touching my tablet while cooking.” | Voice-controlled cook mode with read-aloud, swipe and big tap targets |
| “Mum sends recipes as texts, voice notes or videos.” | Paste-to-parse import, voice dictation, photo upload |
| “I want to add my own twist, as a different version of the original.” | Twists with lineage and a “what changed” note |
| “I want to know if my family likes my recipe.” | Loves, saves, comments and a family activity feed |

### Design iteration

The coded version deliberately improves on the original Figma prototype:

- **Type that matches the brand** — the logo is set in Sansita, so headings use Sansita too, and body text uses Asap, its companion sans from the same foundry (Omnibus-Type). Body text went from small serif type to 16px+, with high-contrast warm brown instead of light grey-pink.
- **Navigation** — one consistent navigation (side rail in landscape, tab bar in portrait) instead of a different header on every screen.
- **Focus** — the home screen was decluttered into four clear sections; family activity moves to a side column only when there is room.
- **Real cook mode** — the prototype’s “voice mode” was a button on a dense recipe page; it is now a dedicated full-screen, step-by-step experience.
- **Empty states and covers** — recipes without a photo get a typographic cover in the brand palette instead of grey placeholders.
- **Accessibility** — visible focus states, labelled controls, skip link, reduced-motion support and touch targets of at least 44px.

## Tech

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vite](https://vite.dev/), [Vue Router](https://router.vuejs.org/), [Pinia](https://pinia.vuejs.org/)
- Web Speech API (speech recognition and synthesis), Screen Wake Lock API
- [Lucide](https://lucide.dev/) icons, self-hosted Sansita and Asap via Fontsource
- Installable as a full-screen app on iPad and Android (web app manifest, home-screen icons, launch splash)
- No backend: data is seeded with a demo family and persisted to `localStorage`. *Profile → Reset demo data* restores it.

```
src/
├── components/   UI building blocks (cards, navigation, avatars, covers)
├── composables/  voice, wake lock and kitchen timers
├── data/         demo family, circles and recipes
├── lib/          quantity scaling, unit conversion, recipe text parser
├── stores/       Pinia store (activity feed is derived from data)
└── views/        screens
```

## Running it locally

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

Best experienced on a tablet or a browser window around 834×1194 (portrait) or 1194×834 (landscape). Voice control works in Chrome, Edge and Safari.

## Credits

Design, research and development by **Melly Marcelia**.

- Food photography is openly licensed (public domain and CC BY), found via [Openverse](https://openverse.org/). Every photo, its creator and licence are listed in [`src/data/credits.ts`](src/data/credits.ts) and in the app under *Profile → Photo credits*.
- Avatar illustrations and family photos come from the original Figma prototype and are used for demonstration purposes only.
