# Phase 23: Communication & Boost Rules - Research

**Researched:** 2026-03-04
**Domain:** Next.js App Router marketing pages, stake wizard extension, UI disclosure patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Seed Launch Page Structure**
- Section-based layout matching existing marketing page pattern (Hero + stacked sections)
- Story-first hero: lead with narrative ("Every seed token funds the HELIX liquidity pool"), APY boost is the reward for participating
- 5-6 content sections: Hero → What is the seed token → How boost works → SOL flow / LP funding → Headroom & revocation mechanics → CTA
- Include a SOL flow diagram showing: Buy seed → Creator rewards → Fund LP pool
- Route: `app/(public)/seed/page.tsx` at URL path `/seed`

**Messaging Tone & Framing**
- Direct & plain tone — straightforward DeFi language, no hype, no jargon-soup
- Risk/reward framing for revocation: "Your boost is protected by headroom. Sell within your headroom and keep your boost. Sell below your snapshot and it's gone — that's the trade-off for 10% extra APY."
- Include numeric worked example showing boost math: base APY vs boosted APY with concrete numbers
- Mention pump.fun as the platform but no direct link yet

**Boost Rules Disclosure (COMM-04)**
- Implemented as a required step in the existing stake wizard (`components/stake/stake-wizard/`) — user must pass through boost rules before the confirmation step
- Checkbox acknowledgment required: "I understand that selling seed tokens below my snapshot permanently revokes my boost for this stake"
- Must check the checkbox before the stake button enables
- All four rules covered: Snapshot, Headroom, Permanent revocation, 10% multiplier
- Shown to everyone — seed holders see "You qualify for boost!", non-holders see "Hold seed tokens to earn 10% boost"

**Navigation & Discoverability**
- New nav link "Seed Launch" added to MarketingNav as 4th item: How It Works | Tokenomics | Seed Launch | [Launch App]
- URL path: `/seed` — route at `app/(public)/seed/page.tsx`
- Add secondary CTA on the existing landing page: "Learn about the Seed Launch" alongside "Start Staking"
- Custom OG image and meta tags for social sharing when `/seed` URL is shared

### Claude's Discretion
- Exact section ordering and copy within the established structure
- ScrollReveal animation delays and stagger timing
- SOL flow diagram visual implementation (CSS/SVG approach)
- Responsive breakpoints for the seed launch page
- Exact wording of the acknowledgment checkbox
- Icon choices for boost rules list items
- Whether to use the existing Card component for rule items or custom styled sections

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COMM-01 | Seed launch page clearly states creator rewards from seed token fund the HLX/SOL liquidity pool | SOL flow diagram pattern; section composition from existing marketing pages |
| COMM-02 | Seed launch page explains the seed token's purpose and its relationship to the HELIX protocol | Section-based page pattern; existing how-it-works/tokenomics page templates |
| COMM-03 | Seed launch page explains boost eligibility — hold seed tokens for better APY when staking HLX | Feature card grid pattern from `features.tsx`; numbered step pattern from `mechanics.tsx` |
| COMM-04 | Pre-staking boost rules displayed prominently before any stake action — snapshot, headroom, permanent revocation explained in plain language | Stake wizard step extension; Zustand store step type expansion; Checkbox component already available |
</phase_requirements>

---

## Summary

Phase 23 is a pure frontend content phase — no on-chain instructions, no wallet transactions. It creates one new public page (`/seed`) and inserts one new step into the existing stake wizard. The entire implementation lives in `app/web/`.

The project already has every technical building block needed: section-based marketing page composition, scroll reveal animations via Framer Motion, the Zustand-backed stake wizard, the Checkbox component, and the `(public)` route group with shared nav/footer. No new libraries need to be installed.

The primary risk is the stake wizard step insertion. The wizard currently has steps 1, 2, 3 ("success") rendered in `app/dashboard/stake/page.tsx` and state type `1 | 2 | 3 | "success"` in `ui-store.ts`. Adding the boost rules disclosure as step 3 requires shifting the existing confirm step to step 4, updating the step indicator, and extending the Zustand state type. This is the only structural change with real coupling risk.

**Primary recommendation:** Build the `/seed` page first (zero risk, isolated), then extend the stake wizard to add the boost rules step as the final required step before confirmation.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | ^14.2.0 | Page routing, ISR via `export const revalidate` | Project standard — all pages use it |
| Framer Motion | ^12.34.4 | ScrollReveal animations | Project standard — `lib/animation.ts` defines shared variants |
| Tailwind CSS | ^3.4.0 | Styling with `helix-*` and `zinc-*` tokens | Project standard |
| Zustand | ^5.0.0 | Stake wizard UI state | Already manages wizard steps/amount/days |
| @radix-ui/react-checkbox | ^1.1.0 | Accessible checkbox for disclosure acknowledgment | Already installed; `components/ui/checkbox.tsx` wraps it |
| lucide-react | ^0.460.0 | Icons for boost rules list items | Already installed project-wide |

### No New Installations Required

All dependencies exist. Zero `npm install` steps in this phase.

---

## Architecture Patterns

### Recommended Project Structure (additions only)

```
app/web/
├── app/
│   └── (public)/
│       └── seed/
│           └── page.tsx              # NEW: /seed route (Server Component + ISR)
├── components/
│   ├── marketing/
│   │   ├── seed-hero.tsx             # NEW: seed launch hero section
│   │   ├── seed-what-is.tsx          # NEW: what is the seed token
│   │   ├── seed-boost-explain.tsx    # NEW: how boost works + worked example
│   │   ├── seed-sol-flow.tsx         # NEW: SOL flow diagram section
│   │   ├── seed-headroom.tsx         # NEW: headroom & revocation mechanics
│   │   └── seed-cta.tsx              # NEW: seed launch CTA
│   └── stake/
│       └── stake-wizard/
│           └── boost-rules-step.tsx  # NEW: boost rules disclosure step
```

### Pattern 1: Marketing Page Composition (Server Component)

**What:** `page.tsx` is an async Server Component that optionally fetches stats, then renders a sequence of named section components. Each section is a separate file under `components/marketing/`.

**When to use:** Every public-facing informational page.

**Example:**
```typescript
// Source: app/web/app/(public)/page.tsx (existing pattern)
import type { Metadata } from "next";
import { SeedHero } from "@/components/marketing/seed-hero";
import { SeedWhatIs } from "@/components/marketing/seed-what-is";
import { SeedBoostExplain } from "@/components/marketing/seed-boost-explain";
import { SeedSolFlow } from "@/components/marketing/seed-sol-flow";
import { SeedHeadroom } from "@/components/marketing/seed-headroom";
import { SeedCta } from "@/components/marketing/seed-cta";

export const metadata: Metadata = {
  title: "HELIX Seed Launch — Fund the Liquidity Pool",
  description: "...",
  openGraph: { ... },
  twitter: { ... },
};

export const revalidate = 86400; // daily revalidation

export default function SeedPage() {
  return (
    <>
      <SeedHero />
      <SeedWhatIs />
      <SeedBoostExplain />
      <SeedSolFlow />
      <SeedHeadroom />
      <SeedCta />
    </>
  );
}
```

### Pattern 2: ScrollReveal Section Wrapper

**What:** Wrap each section's content in `<ScrollReveal>` from `components/marketing/scroll-reveal.tsx`. Use `delay` prop to stagger children within a section.

**When to use:** Every content block on marketing pages (all existing sections use this).

**Example:**
```typescript
// Source: components/marketing/mechanics.tsx (existing pattern)
import { ScrollReveal } from "./scroll-reveal";

export function SeedBoostExplain() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-4">
            How the Boost Works
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          {/* content */}
        </ScrollReveal>
      </div>
    </section>
  );
}
```

### Pattern 3: Stake Wizard Step Extension

**What:** The wizard renders steps via a union type in Zustand. Adding a new step requires: (1) extending the step type, (2) adding the new component to the step render switch in `stake/page.tsx`, (3) updating the step indicator count.

**Current state:** Steps are `1 | 2 | 3 | "success"` where 1=Amount, 2=Duration, 3=Confirm.

**Required change:** New step 3 = BoostRules (disclosure), old step 3 Confirm becomes step 4. Type becomes `1 | 2 | 3 | 4 | "success"`.

**When to use:** Any time a new required step is inserted before confirmation.

**Example:**
```typescript
// Source: lib/store/ui-store.ts — extend step type
interface StakeWizardState {
  step: 1 | 2 | 3 | 4 | "success";  // 3=BoostRules, 4=Confirm
  boostRulesAcknowledged: boolean;    // NEW: checkbox state
  // ...existing fields...
  setBoostRulesAcknowledged: (v: boolean) => void;  // NEW
}
```

```typescript
// Source: app/dashboard/stake/page.tsx — step indicator + render
// Step indicator: change [1, 2, 3] → [1, 2, 3, 4]
{[1, 2, 3, 4].map((stepNum) => (
  // ...existing indicator pattern...
))}

// Step render
{step === 3 && <BoostRulesStep />}
{step === 4 && <ConfirmStep />}
```

```typescript
// Source: components/stake/stake-wizard/boost-rules-step.tsx — NEW component
"use client";

import { useState } from "react";
import { useStakeWizard } from "@/lib/store/ui-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function BoostRulesStep() {
  const { setStep, setBoostRulesAcknowledged } = useStakeWizard();
  const [checked, setChecked] = useState(false);

  const handleNext = () => {
    setBoostRulesAcknowledged(true);
    setStep(4);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Seed Boost Rules</h2>
        {/* 4 rule items */}
        {/* Checkbox acknowledgment */}
        <div className="flex items-start gap-3 mt-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
          <Checkbox
            id="boost-ack"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            className="mt-0.5"
          />
          <label htmlFor="boost-ack" className="text-sm text-amber-200 cursor-pointer">
            I understand that selling seed tokens below my snapshot permanently
            revokes my boost for this stake
          </label>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(2)} size="lg">Back</Button>
        <Button onClick={handleNext} disabled={!checked} size="lg" className="min-w-32">
          Continue
        </Button>
      </div>
    </div>
  );
}
```

### Pattern 4: OG / Twitter Meta Tags

**What:** `export const metadata: Metadata` in the page file. The `(public)/layout.tsx` already demonstrates the full pattern with `openGraph` and `twitter` properties.

**When to use:** Every public page that should be shareable.

**Example:**
```typescript
// Source: app/(public)/layout.tsx (existing OG pattern)
export const metadata: Metadata = {
  title: "HELIX Seed Launch — Fund the Liquidity Pool, Earn 10% Boost",
  description:
    "Every seed token funds the HLX/SOL liquidity pool. Hold seed tokens when you stake HELIX and earn 10% extra APY on every reward claim.",
  openGraph: {
    title: "HELIX Seed Launch",
    description: "Buy seed tokens. Fund the LP. Earn a 10% APY boost.",
    siteName: "HELIX Protocol",
    images: [{ url: "/brand/og-seed.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-seed.jpg"],
  },
};
```

Note: The OG image file `/brand/og-seed.jpg` must be added to `app/web/public/brand/`. If no new image is prepared, use the existing `/brand/og-image.jpg` as fallback.

### Pattern 5: SOL Flow Diagram (CSS-only, no SVG library)

**What:** A horizontal flow diagram showing "Buy Seed → Creator Rewards → Fund LP Pool" using CSS flexbox with connecting arrows. No new library — build with Tailwind divs and Unicode/SVG arrows.

**When to use:** Visual flow explanation where each node has a label and arrow connector.

**Example structure:**
```typescript
// Pure CSS / Tailwind approach — no additional library
<div className="flex items-center justify-center gap-4 py-8">
  <FlowNode icon="..." label="Buy Seed Token" sublabel="on pump.fun" color="helix" />
  <FlowArrow />
  <FlowNode icon="..." label="Creator Rewards" sublabel="go to team wallet" color="blue" />
  <FlowArrow />
  <FlowNode icon="..." label="Fund HLX/SOL LP" sublabel="permanent liquidity" color="purple" />
</div>
```

Each `FlowNode` is a styled div; `FlowArrow` is `→` or a right-pointing SVG inline.

### Anti-Patterns to Avoid

- **Installing a diagram library (e.g., Mermaid, Reactflow) for a 3-node flow:** The SOL flow diagram is a 3-node linear flow. It fits entirely in Tailwind divs. Do not add dependencies.
- **Using a Dialog for boost disclosure:** CONTEXT.md explicitly rules this out — use wizard step instead.
- **Calling `setStep(3)` from DurationStep to go to ConfirmStep:** After the step renumbering, DurationStep must call `setStep(3)` to reach BoostRulesStep, and BoostRulesStep calls `setStep(4)` to reach ConfirmStep. Update the Back button in ConfirmStep to call `setStep(3)` (not `setStep(2)`).
- **Skipping "shown to everyone" requirement:** The boost rules step must render for both seed holders and non-holders. Do not gate the step on seed token ownership — the contextual framing is within the step content, not an access gate.
- **Making boostRulesAcknowledged persistent across sessions:** This is UI-only state. It lives in Zustand (in-memory) and resets on wizard reset/unmount, same as other wizard state. The user sees it fresh each time they open a new stake.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible checkbox | Custom div-based toggle | `components/ui/checkbox.tsx` (Radix) | Focus management, keyboard nav, ARIA state already handled |
| Scroll animations | IntersectionObserver hook | `ScrollReveal` + `lib/animation.ts` | Already covers `once`, `margin`, `ease` — consistent with all other pages |
| Step navigation | Custom state machine | Zustand `useStakeWizard` with extended step type | Existing pattern; avoids dual state |
| Social preview tags | Custom `<head>` manipulation | Next.js `export const metadata` | SSR-friendly, type-safe, consistent with all public pages |
| Icon set | Custom SVGs | `lucide-react` (already installed) | Consistent visual language; tree-shakeable |

**Key insight:** This phase is assembly of existing parts. The project has patterns for everything needed. Any new code should follow the established pattern verbatim — wrong here is deviating from structure, not lacking features.

---

## Common Pitfalls

### Pitfall 1: Step Number Collision After Wizard Extension

**What goes wrong:** ConfirmStep currently calls `setStep(2)` in its Back button. After inserting BoostRulesStep as step 3, ConfirmStep (now step 4) must call `setStep(3)` to go back — otherwise the user skips the disclosure.

**Why it happens:** The step numbers are hardcoded as literals in each step component. The Back button in confirm-step.tsx has `onClick={() => setStep(2)}`.

**How to avoid:** Update `confirm-step.tsx` Back button from `setStep(2)` to `setStep(3)` as part of the same task that introduces the new step. Never update step numbers in isolation.

**Warning signs:** Step indicator shows 4 circles but Back from step 4 goes to step 2 (skipping disclosure).

### Pitfall 2: TypeScript Step Type Not Extended

**What goes wrong:** Adding `step === 4` condition in `stake/page.tsx` without updating the Zustand store type causes TypeScript to flag the comparison as impossible (`step` only goes to 3).

**Why it happens:** The step type `1 | 2 | 3 | "success"` is a discriminated union — TypeScript narrows aggressively.

**How to avoid:** Update `ui-store.ts` type definition to `1 | 2 | 3 | 4 | "success"` first, then add the new step render. The planner should put store type update and page.tsx update in the same task.

**Warning signs:** TypeScript error "This condition will always be false since the types '1 | 2 | 3 | "success"' and '4' have no overlap."

### Pitfall 3: Missing `boostRulesAcknowledged` Reset

**What goes wrong:** If `boostRulesAcknowledged: true` persists in Zustand across wizard sessions, a subsequent stake creation skips the visual disclosure (checkbox appears pre-checked).

**Why it happens:** The `reset()` function in `ui-store.ts` sets `initialState` — if `boostRulesAcknowledged` is not in `initialState`, it won't reset.

**How to avoid:** Add `boostRulesAcknowledged: false` to `initialState` object alongside `step`, `amount`, `days`, `referrer`.

**Warning signs:** Opening stake wizard a second time shows the boost rules step with checkbox already checked.

### Pitfall 4: OG Image File Missing at Build Time

**What goes wrong:** Next.js doesn't error on missing OG images in metadata, but social previews return broken images when the URL is shared before the image file is added to `/public/brand/`.

**Why it happens:** The metadata declaration is just a string path — no build-time validation.

**How to avoid:** Either use the existing `/brand/og-image.jpg` as the OG image for the seed page, or create a Wave 0 task to place `og-seed.jpg` in `/public/brand/` before the metadata references it.

**Warning signs:** Sharing `/seed` on Twitter/Discord shows a broken image or the default HELIX OG image.

### Pitfall 5: `"use client"` Placement on Seed Page Sections

**What goes wrong:** Marketing sections using `ScrollReveal` (which is `"use client"`) inside a Server Component parent is fine — Next.js handles this correctly. But if a seed section accidentally adds `"use client"` at the top, it opts the entire subtree out of RSC, losing ISR benefits.

**Why it happens:** Confusion about where `"use client"` belongs when composing Client Components inside Server Components.

**How to avoid:** Only `scroll-reveal.tsx` (and `boost-rules-step.tsx`) need `"use client"`. The seed section files themselves are pure Server Components that import `ScrollReveal` — they do NOT need `"use client"`.

---

## Code Examples

Verified patterns from existing codebase source files:

### Nav Link Addition (4th item before "Launch App")
```typescript
// Source: components/marketing/nav.tsx — insert before the Launch App Link
<Link
  href="/seed"
  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
>
  Seed Launch
</Link>
```

### Landing Page Secondary CTA
```typescript
// Source: components/marketing/hero.tsx — add alongside existing "Learn How" button
<Link
  href="/seed"
  className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
>
  Learn about Seed Launch
</Link>
```

### Boost Rules List Item (for the 4 rules)
```typescript
// Pattern: icon + bold label + description — matches existing Feature cards
<div className="flex gap-4 items-start">
  <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
    <SomeIcon className="w-5 h-5 text-helix-400" />
  </div>
  <div>
    <h3 className="text-base font-semibold text-zinc-100 mb-1">Snapshot</h3>
    <p className="text-sm text-zinc-400">
      When you stake, your current seed token balance is recorded. This
      becomes your snapshot — the floor you must stay above to keep your boost.
    </p>
  </div>
</div>
```

### Numeric Worked Example Block (APY comparison)
```typescript
// Pattern: callout box with key metric — matches existing tokenomics page callouts
<div className="grid grid-cols-2 gap-4 mt-8">
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
    <div className="text-3xl font-bold text-zinc-400">3.69%</div>
    <div className="text-sm text-zinc-400 mt-2">Base APY</div>
  </div>
  <div className="bg-zinc-900 border border-helix-700 rounded-xl p-6 text-center">
    <div className="text-3xl font-bold text-helix-400">4.06%</div>
    <div className="text-sm text-zinc-400 mt-2">Boosted APY (+10%)</div>
    <div className="text-xs text-zinc-500 mt-1">With seed token boost</div>
  </div>
</div>
```

### Revocation Warning Block (amber callout — matches existing confirm-step.tsx penalty warning)
```typescript
// Source: components/stake/stake-wizard/confirm-step.tsx — same amber pattern
<div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
  <div className="flex gap-3">
    <TriangleAlertIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-semibold text-amber-300">Permanent Revocation</p>
      <p className="text-xs text-amber-200/80">
        Sell below your snapshot and your boost is gone forever for this
        stake. Buying seed back does not restore it. That is the trade-off
        for 10% extra APY.
      </p>
    </div>
  </div>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` for meta tags | `export const metadata` from page.tsx | Next.js 13 App Router | Type-safe, colocated, SSR-correct |
| Local state for multi-step forms | Zustand for wizard state | Project inception | Wizard state survives component remounts, accessible from any child |
| Custom SVG icon sets | lucide-react | Project inception | Consistent, tree-shakeable, no custom SVG maintenance |

---

## Open Questions

1. **OG image for `/seed`**
   - What we know: The layout uses `/brand/og-image.jpg`; the decision specifies a custom OG for `/seed`
   - What's unclear: Whether the design team will provide a new `og-seed.jpg` file before deployment
   - Recommendation: Plan with `/brand/og-seed.jpg` as the target path; add a Wave 0 task to copy/create the file. Fallback to `/brand/og-image.jpg` if not available at build time — this is safe and non-blocking.

2. **pump.fun mention wording**
   - What we know: "Mention pump.fun as the platform but no direct link yet — the actual launch is a manual team action"
   - What's unclear: Exact copy for the pump.fun mention (discretion area)
   - Recommendation: Use "The seed token launches on pump.fun" — plain, factual, no link. This is a Claude's Discretion area.

3. **Seed holder detection in boost rules step**
   - What we know: The step shows contextual framing based on whether the user holds seed tokens
   - What's unclear: No seed token mint address is set yet (that is Phase 24 BOOST-01). Phase 23 has no on-chain boost infrastructure.
   - Recommendation: The BoostRulesStep cannot query actual seed balance in Phase 23 (no mint address known, no on-chain code). Show the non-holder framing ("Hold seed tokens to earn 10% boost...") to everyone in this phase. When Phase 26 adds FRONT-01 (boost indicator), it will retrofit the contextual framing. This is the safe, non-blocking approach.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + @testing-library/react |
| Config file | `app/web/vitest.config.mts` |
| Quick run command | `cd app/web && npx vitest run --reporter=verbose` |
| Full suite command | `cd app/web && npx vitest run --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COMM-01 | Seed page renders SOL flow section with LP funding copy | unit (RTL render) | `cd app/web && npx vitest run __tests__/components/seed-sol-flow.test.tsx` | Wave 0 |
| COMM-02 | Seed page renders "what is seed token" section | unit (RTL render) | `cd app/web && npx vitest run __tests__/components/seed-what-is.test.tsx` | Wave 0 |
| COMM-03 | Seed page renders boost eligibility explanation | unit (RTL render) | `cd app/web && npx vitest run __tests__/components/seed-boost-explain.test.tsx` | Wave 0 |
| COMM-04 | BoostRulesStep renders all 4 rules; Continue button disabled until checkbox checked | unit (RTL + userEvent) | `cd app/web && npx vitest run __tests__/components/boost-rules-step.test.tsx` | Wave 0 |
| COMM-04 | BoostRulesStep checkbox enables Continue when checked | unit (RTL + userEvent) | included in boost-rules-step.test.tsx | Wave 0 |
| Nav link | MarketingNav renders "Seed Launch" link with href="/seed" | unit (RTL render) | `cd app/web && npx vitest run __tests__/components/nav.test.tsx` | Wave 0 |

Note: Page-level tests (`seed/page.tsx` as async Server Component) follow the established project pattern — covered by E2E (Playwright) not unit tests, matching how `how-it-works/page.tsx` and `tokenomics/page.tsx` are treated.

### Sampling Rate

- **Per task commit:** `cd app/web && npx vitest run __tests__/components/boost-rules-step.test.tsx`
- **Per wave merge:** `cd app/web && npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `app/web/__tests__/components/boost-rules-step.test.tsx` — covers COMM-04 checkbox interactivity
- [ ] `app/web/__tests__/components/seed-sol-flow.test.tsx` — covers COMM-01 content presence
- [ ] `app/web/__tests__/components/seed-what-is.test.tsx` — covers COMM-02 content presence
- [ ] `app/web/__tests__/components/seed-boost-explain.test.tsx` — covers COMM-03 content presence
- [ ] `app/web/__tests__/components/nav.test.tsx` — covers nav link addition

Test framework and config already exist. Only test files need to be created.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — all patterns verified from actual source files
  - `app/web/lib/store/ui-store.ts` — Zustand wizard store type and shape
  - `app/web/components/stake/stake-wizard/confirm-step.tsx` — existing step pattern, amber warning box
  - `app/web/components/stake/stake-wizard/amount-step.tsx` — wizard navigation pattern
  - `app/web/app/dashboard/stake/page.tsx` — step indicator and render switch
  - `app/web/components/marketing/nav.tsx` — current nav structure
  - `app/web/components/marketing/scroll-reveal.tsx` — animation wrapper
  - `app/web/components/marketing/mechanics.tsx` — numbered step pattern
  - `app/web/components/marketing/features.tsx` — feature card grid pattern
  - `app/web/components/marketing/hero.tsx` — hero section pattern with CTA buttons
  - `app/web/components/marketing/cta.tsx` — CTA section with background
  - `app/web/components/ui/checkbox.tsx` — Radix checkbox wrapper
  - `app/web/components/ui/card.tsx` — card component
  - `app/web/app/(public)/layout.tsx` — OG metadata pattern
  - `app/web/app/(public)/how-it-works/page.tsx` — content page structure
  - `app/web/lib/animation.ts` — scrollReveal variant values
  - `app/web/vitest.config.mts` — test framework config
  - `app/web/vitest.setup.ts` — global mocks including framer-motion

### Secondary (MEDIUM confidence)
- Next.js App Router metadata docs (confirmed pattern matches codebase usage)
- Zustand v5 discriminated union state (matches codebase pattern exactly)

### Tertiary (LOW confidence)
- None — all findings verified from project source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified present in package.json and in use
- Architecture: HIGH — all patterns verified from existing source files in the project
- Pitfalls: HIGH — based on direct TypeScript type analysis of existing code
- Test infrastructure: HIGH — vitest.config.mts and setup verified; gap list is exhaustive

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable — no fast-moving dependencies; Next.js 14 App Router is well-established)