# Stage 8 — Release candidate freeze

- Branch: revamp/studio-pulse-production
- HEAD: 3267969997c9806bb872ae96bf8659b01f970b8b
- Checkpoint tag: studio-pulse-before-final-stage-8
- Working tree: clean of tracked changes (untracked zip/screenshot archives only)
- Stage 7 LCP: 63bd835, 3267969
- Production assumptions:
  - NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false/absent
  - NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app
  - ALLOW_MOCK_PUBLISH unset
  - ANKITS_PRODUCTION_RELEASE=true for release builds
