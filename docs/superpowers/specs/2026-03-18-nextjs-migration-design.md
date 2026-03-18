# KIJ Studio: Gatsby → Next.js Migration Design

**Date:** 2026-03-18
**Status:** Draft
**Author:** Bartosz Grabski + Claude

## Context

KIJ Studio (kijstudio.com) is a portfolio website for an interior design and architectural visualization studio. It is built with Gatsby 5, which is effectively end-of-life and unmaintained. The goal is to migrate to Next.js — a supported, actively developed framework — while preserving the site's current functionality and appearance.

### Current Stack
- **Framework:** Gatsby 5.14 (React 18)
- **CMS:** Sanity (project: 53l346w4, dataset: production)
- **Styling:** CSS Modules + PostCSS (with nesting)
- **Language:** TypeScript
- **Hosting:** Netlify
- **Analytics:** Google Analytics (G-086HYGYM9B)

### Current Pages
| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Homepage with background video, intro text |
| `/about` | Static | About the studio |
| `/interior-design` | Static | Gallery listing of interior design projects |
| `/visualizations` | Static | Gallery listing of visualization projects |
| `/interior-design/[slug]` | Dynamic | Individual interior design project |
| `/visualizations/[slug]` | Dynamic | Individual visualization project |
| `/404` | Static | Not found page |

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js (App Router) | Modern, supported, Server Components for simple data fetching |
| CMS integration | `next-sanity` | Official package, GROQ queries, image helpers |
| Hosting | Vercel | Purpose-built for Next.js, replaces Netlify |
| Migration approach | Fresh project on new branch | Clean result, old site as reference |
| Styling | CSS Modules (keep) | Works identically in Next.js, no migration needed |
| Routing | App Router with static generation | All pages statically generated at build time |

## Architecture

### Project Structure

```
app/
├── layout.tsx              # Root layout (fonts, analytics, header, footer)
├── page.tsx                # Home (/)
├── page.module.css
├── not-found.tsx           # 404
├── about/
│   ├── page.tsx
│   └── page.module.css
├── interior-design/
│   ├── page.tsx            # Listing
│   ├── page.module.css
│   └── [slug]/
│       ├── page.tsx        # Detail
│       └── page.module.css
├── visualizations/
│   ├── page.tsx            # Listing
│   ├── page.module.css
│   └── [slug]/
│       ├── page.tsx        # Detail
│       └── page.module.css
└── sitemap.ts              # Dynamic sitemap
components/
├── header.tsx
├── header.module.css
├── slider.tsx
├── slider.module.css
├── split-screen.tsx
└── split-screen.module.css
lib/
├── sanity.ts               # Sanity client + GROQ queries
└── image.ts                # Sanity image URL builder
styles/
├── global.css
└── breakpoints.ts
public/
├── images/                 # Static images (logos, favicon)
└── videos/                 # Homepage background video (mp4, webm)
next.config.ts
postcss.config.js           # Keep existing (postcss-preset-env with nesting)
tsconfig.json
```

### Data Flow

All pages are Server Components by default. Data fetching happens at build time via `next-sanity`:

```
Sanity CMS → GROQ query (next-sanity) → Server Component (async) → Static HTML (at build)
```

- Pages use `async` Server Components that call Sanity directly
- Dynamic routes use `generateStaticParams` to pre-render all slugs at build time
- Content updates trigger Vercel rebuild via Sanity webhook

### Gatsby → Next.js Concept Mapping

| Gatsby | Next.js |
|--------|---------|
| `gatsby-config.ts` plugins | `next.config.ts` + npm packages |
| `gatsby-node.ts` createPages | `[slug]/page.tsx` + `generateStaticParams` |
| `gatsby-browser.tsx` / `gatsby-ssr.tsx` | `app/layout.tsx` (root layout) |
| GraphQL page queries | GROQ queries in Server Components |
| `GatsbyImage` / `StaticImage` | `next/image` with Sanity image loader |
| `react-helmet` (SEO component) | `metadata` export / `generateMetadata` |
| `gatsby-plugin-sitemap` | `app/sitemap.ts` (built-in) |
| `gatsby-plugin-google-gtag` | `@next/third-parties/google` |
| `gatsby-plugin-postcss` | Built-in PostCSS support |
| `Link` from `gatsby` | `Link` from `next/link` |

## Component Migration

### Components that port directly

**Header** (`src/components/header.tsx`)
- Replace `import { Link } from "gatsby"` → `import Link from "next/link"`
- CSS module unchanged

**Slider** (`src/components/Slider.tsx`)
- 831-line custom carousel — framework-agnostic React component
- Only change: callers pass `next/image` instead of `GatsbyImage` via render props
- Mark as `"use client"` (uses state, effects, touch events)

**SplitScreen** (`src/components/SplitScreen.tsx`)
- Pure layout component, no framework dependencies
- No changes needed

**useBreakpoints hook** (`src/hooks/useBreakpoints.ts`)
- Pure React hook with SSR-safe `typeof window` checks
- No changes needed, move to `hooks/` or `lib/`

### Components replaced by Next.js built-ins

**SEO component** (`src/components/seo.tsx`)
- Replaced by Next.js Metadata API
- Each page exports `metadata` (static) or `generateMetadata` (dynamic)
- No client-side head injection needed

**Layout component** (`src/components/layout.tsx`)
- Becomes `app/layout.tsx` — Next.js automatically wraps all pages
- Header and footer rendered in root layout

### Gatsby-specific files (deleted, no equivalent)

- `gatsby-config.ts`
- `gatsby-node.ts`
- `gatsby-browser.tsx`
- `gatsby-ssr.tsx`
- All embedded GraphQL query strings

## Sanity Integration

### Client Setup (`lib/sanity.ts`)

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "53l346w4",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

### GROQ Queries (replace all GraphQL)

**Visualizations listing:**
```groq
*[_type == "visualisation"] | order(_createdAt desc) {
  title, description, slug, gallery[] { asset->, alt }
}
```

**Single visualization:**
```groq
*[_type == "visualisation" && slug.current == $slug][0] {
  title, description, gallery[] { asset->, alt, caption }
}
```

**Interior design listing:**
```groq
*[_type == "interior"] | order(_createdAt desc) {
  title, description, location, livingArea, slug, gallery[] { asset->, alt }
}
```

**Single interior:**
```groq
*[_type == "interior" && slug.current == $slug][0] {
  title, description, location, livingArea, gallery[] { asset->, alt, caption }
}
```

### Image Handling (`lib/image.ts`)

Use `@sanity/image-url` to generate optimized URLs for `next/image`:

```typescript
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

Configure `next.config.ts` to allow Sanity image domain:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};
```

## SEO Improvements

The current site has poor search appearance: the Google snippet shows cluttered text ("VisualizationsInterior DesignAbout us. Your browser does not...") because navigation and video fallback text leak into the crawled content. No sitelinks are shown. These improvements are bundled with the migration.

### Fix the search snippet
- Set unique `meta description` on every page via Next.js `metadata` exports
- Clean semantic HTML: navigation in `<nav>`, main content in `<main>`, video fallback text hidden from crawlers via client-only rendering
- Ensure each page has a clear, descriptive `<title>` (e.g. "Interior Design | KIJ Studio")

### Enable sitelinks
- Descriptive, unique `<title>` per page
- Clean internal linking with descriptive anchor text
- Breadcrumb structured data on detail pages
- Consistent, crawlable navigation structure

### Structured data (JSON-LD)

**All pages — Organization:**
```json
{
  "@type": "Organization",
  "name": "KIJ Studio",
  "url": "https://kijstudio.com",
  "logo": "https://kijstudio.com/images/logo.png",
  "description": "Architectural visualization and interior design studio"
}
```

**All pages — WebSite:**
```json
{
  "@type": "WebSite",
  "name": "KIJ Studio",
  "url": "https://kijstudio.com"
}
```

**Detail pages — BreadcrumbList:**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kijstudio.com" },
    { "@type": "ListItem", "position": 2, "name": "Interior Design", "item": "https://kijstudio.com/interior-design" },
    { "@type": "ListItem", "position": 3, "name": "Project Name" }
  ]
}
```

**Detail pages — CreativeWork (for project pages):**
```json
{
  "@type": "CreativeWork",
  "name": "Project Title",
  "description": "Project description",
  "creator": { "@type": "Organization", "name": "KIJ Studio" },
  "image": ["gallery image URLs"]
}
```

### Sitemap improvements
- Dynamic `app/sitemap.ts` that queries Sanity for all slugs
- Include `lastModified` dates from Sanity `_updatedAt`
- Priority: homepage (1.0) > listings (0.8) > detail pages (0.6) > about (0.5)

### Follow-up: Google Business Profile
Out of scope for this migration, but the GBP listing should be updated separately:
- Add more photos of completed projects
- Write a proper business description
- Ensure category is accurate ("Interior Designer" + "Architectural Visualization")

## Analytics

Replace `gatsby-plugin-google-gtag` with `@next/third-parties/google`:

```tsx
// In app/layout.tsx
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-086HYGYM9B" />
      </body>
    </html>
  );
}
```

## Deployment

### Vercel Setup
- Connect the GitHub repository to Vercel
- Set environment variable: `SANITY_TOKEN`
- Framework preset: Next.js (auto-detected)
- Build command: `next build` (default)

### Sanity Webhook
- Configure a Sanity webhook to trigger Vercel deploy on content publish
- Endpoint: Vercel Deploy Hook URL
- Filter: document types `visualisation` and `interior`

### DNS Migration
- Update kijstudio.com DNS to point to Vercel
- Vercel handles SSL automatically
- Remove Netlify configuration after cutover

## Dependencies

### Add
- `next` — framework
- `react`, `react-dom` — keep (already used)
- `next-sanity` — Sanity integration
- `@sanity/image-url` — keep (already used)
- `@portabletext/react` — keep (already used)
- `@next/third-parties` — Google Analytics
- `postcss-preset-env` — keep (already used)

### Remove
- `gatsby` and all `gatsby-*` plugins
- `react-helmet`, `@types/react-helmet`
- All Gatsby type definitions

## Client vs Server Component Boundaries

By default, all components are Server Components (no "use client" directive). Only components that need browser APIs or React state get marked as Client Components:

| Component | Type | Reason |
|-----------|------|--------|
| Page components | Server | Fetch data, render static HTML |
| Header | Client | Mobile menu toggle state, scroll listeners |
| Slider | Client | Touch events, state, effects |
| SplitScreen | Server | Pure layout, no interactivity |
| Video (homepage) | Client | Video element control, loading logic |

## Out of Scope

- Sanity schema changes
- New pages or features
- Design/visual changes (beyond SEO HTML semantics)
- Google Business Profile updates (noted as follow-up)
- i18n / localization
- PWA support (was already disabled in Gatsby config)
