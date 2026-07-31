# Motion System

## Default: Motion, as an opt-in client island (DECISIONS.md ADR-009)

[Motion](https://motion.dev) (formerly Framer Motion) is the default animation
*library* for standard interaction and reveal animation: scroll reveals,
hover/focus/active states, list/stagger animations. Reach for Motion first,
always — but it is never imported at the root layout or treated as
"needed everywhere." Concretely:

1. Server-rendered content renders first. Motion hydrates only inside
   specific client-boundary components (`src/components/client/**`, see
   [DECISIONS.md ADR-010](./DECISIONS.md#adr-010)) that need it — never
   wraps a whole page.
2. Page transitions and shared layout animations are **not** applied to Tier 1
   SEO landing routes by default. Adding one requires a logged budget
   exception in [DECISIONS.md](./DECISIONS.md).
3. The LCP element (hero image or headline) never depends on client JS to
   become visible — it's in the server HTML unconditionally; motion may
   enhance it after hydration, never gate its initial visibility.
4. **Motion bundle accounting**: shared motion code counts against the JS
   budget of every route that imports it (see
   [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md)). If a landing route would
   exceed budget with motion included, the motion is route-split (dynamically
   imported per-route), never exempted from the budget.

This corrects an earlier contradiction between "Motion is small, needed
everywhere" and the 150kb landing budget — see
[DECISIONS.md ADR-009](./DECISIONS.md#adr-009).

## GSAP: allowed only for specific complex timelines

GSAP may be introduced **only** when a requirement doesn't fit Motion's model —
concretely:

- Scroll-scrubbed, pinned, multi-stage timelines (e.g. a scrollytelling section
  walking through programme benefits) where precise scrub control via
  ScrollTrigger materially outperforms Motion's scroll primitives.
- Complex SVG path drawing/morphing sequences.
- Timeline orchestration across many independently-timed elements that would
  require significant hand-rolled sequencing logic in Motion.

Every GSAP usage must be justified with a short entry in
[DECISIONS.md](./DECISIONS.md) (which section, why Motion wasn't sufficient)
before it's introduced — this keeps GSAP usage auditable and prevents it from
becoming the default by drift. GSAP must be scoped to the specific component that
needs it and dynamically imported (see [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md)),
never added to a shared/global bundle.

## WebGL: not used unless a demonstrated business benefit exists

No WebGL (Three.js, shader work, etc.) by default. If a future case is made, it
must (a) be recorded as a DECISIONS.md entry with the specific business benefit
claimed, (b) be scoped to a single non-critical surface, (c) have a fully
functional non-WebGL fallback, and (d) not compromise the Core Web Vitals budget
in [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md). Nothing in the current brief
demonstrates this benefit, so WebGL is out of scope for the initial build.

## Motion principles for this project

1. **Compositor-friendly properties only** — `transform`, `opacity`, `clip-path`,
   sparing `filter`. Never animate `width`/`height`/`top`/`left`/layout
   properties.
2. **Purposeful, not decorative** — motion should clarify hierarchy, guide
   attention between programme/branch content, or communicate state change. Not
   motion for its own sake, per the schoolofmotion craft benchmark referenced in
   [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) — those sites use restraint and
   timing precision, not maximalism.
3. **`prefers-reduced-motion` is mandatory** — every non-trivial animation has a
   reduced-motion fallback (instant or cross-fade only). See
   [ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md).
4. **Programme-accent-aware, not programme-specific** — motion timing/easing is
   shared system-wide; only the accent color animated through it changes per
   programme context (consistent with the single-system approach in
   [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md)).
5. **Never blocks server-rendered content** — animated reveal states must not
   hide SEO-relevant text from the initial server-rendered HTML (no
   client-only-mount-to-reveal patterns that empty the DOM first). See
   [SEO-STRATEGY.md](./SEO-STRATEGY.md).
6. **Budget-aware** — motion libraries are dynamically imported where reasonable
   and must stay inside the bundle budgets in
   [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md).

## Video is not a motion-library substitute (DECISIONS.md ADR-007, finding I9)

Autoplay hero video is not covered by this doc's animation rules — it's
governed by the video policy in
[PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md) (banned unless muted,
deferred past LCP, and logged as a budget exception in
[DECISIONS.md](./DECISIONS.md)). Nothing in the current brief demonstrates a
need for it.

## Ownership note

Detailed animation implementation is UI-layer work — see the Cursor/Claude
ownership split in [AGENTS.md](../AGENTS.md) and [TASKS.md](./TASKS.md). Adding a
*new* library or graduating a component from Motion to GSAP is an architecture
decision and requires a DECISIONS.md entry regardless of which agent implements
it.
