# Willow Design System

> *"Leave them clarity. Leave them your voice."*

Willow is an agentic AI platform that enables individuals to prepare their estate and leave behind a voice-cloned digital companion for their loved ones. It automates the complex administrative tasks of inheritance — locating financial accounts, insurance policies, key documents — while providing emotional support and guidance in the user's own voice.

**Brand values:** Responsibility · Warmth · Competence · Autonomy · Continuity
**Aesthetic:** Warm and hopeful · Botanical and natural · Soft whitespace · Rounded elements
**Tone of voice:** Plainspoken · Tender · Reassuring · Compassionate · Professional

## Sources

- `uploads/Willow Brandbook by Pomelli.pdf` — 6-page brandbook (overview, logo, typography, color palette, brand voice). All foundations in this system derive from it; extracted page images live in `extract/`.
- No codebase, Figma file, or product screenshots were provided. The UI kits in this project are **original compositions** built strictly from the brandbook's foundations — treat them as the reference product surfaces unless real product designs are supplied later.

## Products represented

1. **Willow App** (`ui_kits/app/`) — the estate-preparation product: a readiness dashboard, the document/account vault, and the voice companion conversation surface.
2. **Marketing website** (`ui_kits/website/`) — the public homepage that introduces Willow's promise.

---

## CONTENT FUNDAMENTALS

How Willow writes:

- **Plainspoken, never clinical.** Estate planning is full of jargon (probate, beneficiary designations, letters testamentary). Willow translates: say "who receives this account" not "designated beneficiary." Say "your wishes" not "directives."
- **Tender but competent.** Warmth never undermines precision. Pair a gentle frame with an exact fact: *"Your life insurance policy is located and verified. One less thing for them to search for."*
- **Second person, present tense.** Willow speaks to "you" and about "your people," "your loved ones," "your family." Willow refers to itself as "Willow," sparingly — the user's voice is the protagonist, not the product.
- **Sentence case everywhere.** Headlines, buttons, labels: "Record your voice," "Add an account." Never title case, never all-caps shouting (small uppercase *overlines* are the one sanctioned exception, e.g. `YOUR ESTATE`).
- **Short sentences. Room to breathe.** Like the whitespace, copy is unhurried. One idea per sentence. Headlines often two short sentences: *"Leave them clarity. Leave them your voice."*
- **Hopeful, never morbid.** Death is acknowledged plainly but framed as continuity and care: "for the people you love," "when they need you," "what you leave behind." Avoid euphemism stacking ("passing away" once is fine; don't tiptoe) and avoid grim words (corpse, demise) entirely.
- **Reassure after every heavy action.** Completing a hard task earns a quiet acknowledgment: *"Done. Your family will thank you for this."* Never confetti, never gamified streaks.
- **No emoji.** Anywhere. Warmth comes from words and botanical imagery, not 🙂.
- **Numbers carry calm authority.** "3 of 7 accounts located" — progress is stated factually, paired with encouragement, not urgency. Never countdown timers, never scarcity language.

Example voice, by surface:
| Surface | Example |
|---|---|
| Hero headline | Leave them clarity. Leave them your voice. |
| Dashboard greeting | Good morning, Eleanor. Your estate is 68% ready. |
| Task row | Locate your life insurance policy — Willow found 2 likely matches. |
| Empty state | Nothing here yet. When you add an account, Willow keeps it safe for the people you choose. |
| Companion (user's cloned voice) | I set this aside for you, sweetheart. The house papers are in the green folder. |
| Button | Record your voice · Add an account · Review and approve |
| Reassurance toast | Saved. This will be there when they need it. |

## VISUAL FOUNDATIONS

- **Color world:** a single green family, end to end. Chalk White `#ECF2EC` is the canvas; Onyx `#1C3A2E` is the ink; Ocean Teal `#1F6F54` is the action color; Sage `#8FB996` is the soft accent; Obsidian `#1C2620` is reserved for inverse surfaces (footers, the companion's voice surface). There is **no blue, no purple, no red** — even errors are a muted clay `#8C4A3C`, and warnings a warm ochre. The logo's olive `#586330` appears only in the brand mark and illustrations.
- **Type:** Fraunces (variable, opsz 40) for everything display — light weights (300–450), slightly negative tracking, `text-wrap: balance`. Fraunces *italic* is the voice of tenderness: quotes, the companion's words, memorial lines. Inter for all UI and body text at 13.5–17px. Overlines are Inter 600, 11.5px, +0.1em tracking, uppercase.
- **Backgrounds:** flat chalk-white fields; large soft whitespace (sections breathe at 64–96px). Photography is botanical — sunlit willow leaves, warm haze (see `assets/imagery/`). Imagery is warm-toned, low contrast, never cool or saturated. Full-bleed photos get a chalk or obsidian protection gradient from the text side. **No synthetic gradients** as decoration — gradients exist only to protect text over photos.
- **Rounded everything:** pills for buttons and avatars; 20px cards; 28px feature panels; 8px is the *minimum* radius in the system. No sharp corners anywhere.
- **Cards:** chalk-paper surface (`#F7FAF7`), 1px hairline border `#D7E2D8`, 20px radius, soft green-tinted shadow (`--shadow-card`). Elevation is whisper-quiet; overlays use `--shadow-overlay` plus a 40% obsidian scrim.
- **Borders & dividers:** 1px hairlines in green-greys; dividers are rare — whitespace separates first, lines second.
- **Animation:** calm fades and gentle rises (240ms, `cubic-bezier(0.25,0.6,0.3,1)`). Nothing bounces, nothing spins. Progress animates slowly (420ms). Respect `prefers-reduced-motion`.
- **Hover states:** fills deepen one step (teal → `#195C46`); quiet surfaces gain a faint sage wash (`#E6EFE7`). Never opacity-fade interactive text.
- **Press states:** one step darker again + translateY(0.5px); no shrink-scale.
- **Focus:** 3px soft teal ring (`--ring-focus`), always visible, never removed.
- **Transparency & blur:** used only on the obsidian companion surface (frosted chalk at 8% over photos) and modal scrims. Cards are always opaque.
- **Layout:** content max 1080px; app chrome is a fixed 248px sidebar on chalk-deep; the canvas scrolls. Marketing pages are single-column, centered, generous.
- **Voice/audio motif:** the one signature graphic device — a row of slim rounded bars (a waveform) in sage/teal, used for the voice companion. Use bars, never sine waves or circles.

## ICONOGRAPHY

- The brandbook ships **no icon system**. The product uses **Lucide** (CDN-substituted — flagged below): 1.75px stroke, round caps/joins, no fills — its soft line style matches the botanical, rounded brand. A curated set is copied into `assets/icons/` as standalone SVGs (stroke set to `currentColor`).
- Icon color follows text color: onyx on light, chalk on dark, teal when interactive-accenting. Default size 20px in UI, 16px inline with text.
- **Never** filled icon sets, two-tone icons, emoji, or unicode dingbats. The leaf logo mark (`assets/logo/willow-leaf-mark.png`) may be used as a decorative brand glyph at low opacity; never hand-draw new botanical SVGs.
- Copied set (assets/icons/): leaf, shield-check, landmark, file-text, mic, heart-handshake, check, chevron-right, plus, search, lock, audio-lines, archive, users, settings, bell, sparkles, circle-check, folder-open, phone.

## Index

| Path | What it is |
|---|---|
| `styles.css` | Global CSS entry — imports every token file below |
| `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` · `tokens/fonts.css` | Foundations: palette + semantic aliases, type scale, spacing/radii/shadow/motion, @font-face |
| `fonts/` | Fraunces (roman + italic) and Inter variable woff2 |
| `assets/logo/` | Lockups: `willow-logo-full.png` (on paper), `willow-lockup-olive.png` / `-chalk.png` (transparent), `willow-leaf-mark.png` / `-chalk.png` (leaf only) |
| `assets/imagery/willow-leaves-hero.png` | Brand photography — sunlit willow leaves, 1376×768 |
| `assets/icons/` | Curated Lucide SVG set (see ICONOGRAPHY) |
| `guidelines/` | Specimen cards rendered in the Design System tab |
| `components/forms/` | Button, Input, Select, Checkbox, Switch |
| `components/display/` | Card, Badge, Avatar, ProgressBar, Tabs |
| `components/companion/` | ChatBubble, VoiceWave, TaskRow |
| `components/icons/` | Icon — inline Lucide set (inherits currentColor) |
| `ui_kits/app/` | Willow app — dashboard, vault, companion (interactive) |
| `ui_kits/website/` | Marketing homepage |
| `SKILL.md` | Agent-skill entry point for using this system elsewhere |

### Component quick reference

All components are React, exported on the compiled bundle namespace `window.WillowDesignSystem_6e2456`. Each has a sibling `.d.ts` (props) and `.prompt.md` (usage).

- **Button** — pill; primary / secondary / ghost / inverse; sm·md·lg; optional icon
- **Input / Select / Checkbox / Switch** — calm form fields, clay (never red) errors, soft teal focus ring
- **Card** — paper surface, hairline border, 20px radius; `interactive` lifts; `inverse` = obsidian
- **Badge** — soft pills: sage / teal (verified) / pending (ochre) / clay (attention) / chalk
- **Avatar** — circle, sage fill, Fraunces initials
- **ProgressBar** — sage→teal fill, slow animation, factual sublabels
- **Tabs** — pill segmented control on chalk-deep track
- **ChatBubble** — speakers: user (teal), willow (paper), companion (obsidian + Fraunces italic); `voice` adds play + waveform
- **VoiceWave** — the signature audio motif (slim rounded bars)
- **TaskRow** — one estate step with calm status
- **Icon** — curated Lucide set, inline, inherits currentColor
