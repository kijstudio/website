# KIJ Studio: Gatsby → Next.js Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the KIJ Studio website from Gatsby 5 to Next.js App Router while preserving all existing functionality, and improving SEO.

**Architecture:** Fresh Next.js project on a new branch (`nextjs-migration`). App Router with static generation. Sanity CMS via `next-sanity` with GROQ queries replacing GraphQL. CSS Modules carry over unchanged.

**Tech Stack:** Next.js 15, React 18, TypeScript, next-sanity, @sanity/image-url, @next/third-parties (Google Analytics), PostCSS, CSS Modules

**Spec:** `docs/superpowers/specs/2026-03-18-nextjs-migration-design.md`

---

## File Structure

### New files to create
| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout — HTML shell, fonts, analytics, header, footer |
| `app/page.tsx` | Homepage — video background, split screen, JSON-LD |
| `app/page.module.css` | Homepage styles (copy from `src/pages/index.module.css`) |
| `app/not-found.tsx` | 404 page |
| `app/about/page.tsx` | About page |
| `app/about/page.module.css` | About styles (copy from `src/pages/about.module.css`) |
| `app/interior-design/page.tsx` | Interior design listing |
| `app/interior-design/[slug]/page.tsx` | Interior design detail |
| `app/interior-design/[slug]/page.module.css` | Detail styles (copy from `src/templates/common.module.css`) |
| `app/visualizations/page.tsx` | Visualizations listing |
| `app/visualizations/[slug]/page.tsx` | Visualization detail |
| `app/visualizations/[slug]/page.module.css` | Detail styles (copy from `src/templates/common.module.css`) |
| `app/sitemap.ts` | Dynamic sitemap from Sanity data |
| `components/header.tsx` | Site header (migrated from Gatsby) |
| `components/header.module.css` | Header styles (copy from `src/components/header.module.css`) |
| `components/slider.tsx` | Carousel component (migrated from Gatsby) |
| `components/slider.module.css` | Slider styles (copy from `src/components/Slider.module.css`) |
| `components/detail-content.tsx` | Shared detail page layout (back button + slider) |
| `components/detail-content.module.css` | Detail page styles (copy from `src/templates/common.module.css`) |
| `components/split-screen.tsx` | Split screen layout (copy, no changes) |
| `components/split-screen.module.css` | Split screen styles (copy from `src/components/SplitScreen.module.css`) |
| `lib/sanity.ts` | Sanity client + all GROQ queries |
| `lib/image.ts` | Sanity image URL builder |
| `hooks/use-breakpoints.ts` | Breakpoint hook (copy from `src/hooks/useBreakpoints.ts`) |
| `styles/global.css` | Global CSS (copy from `src/styles/global.css`) |
| `styles/breakpoints.ts` | Breakpoint constants (copy from `src/styles/breakpoints.ts`) |
| `public/images/logo.png` | Logo (copy from `src/images/logo.png`) |
| `public/images/logo.svg` | Logo SVG (copy from `src/images/logo.svg`) |
| `public/images/favicon.png` | Favicon (copy from `src/images/favicon.png`) |
| `public/images/contact.jpg` | About page image (copy from `src/images/contact.jpg`) |
| `public/videos/P2.webm` | Homepage video (copy from `src/movies/P2.webm`) |
| `public/videos/P2.mp4` | Homepage video fallback (copy from `src/movies/P2.mp4`) |
| `next.config.ts` | Next.js configuration (Sanity image domain) |
| `postcss.config.js` | PostCSS config (copy existing) |
| `tsconfig.json` | TypeScript config (Next.js defaults) |
| `.env.local` | Environment variables (SANITY_TOKEN) |
| `package.json` | Dependencies |

### Files deleted (after migration complete)
All `gatsby-*` files, `src/` directory, `netlify.toml`, `.cache/`

---

## Task 1: Project scaffolding and configuration

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.js`, `.env.local`, `.gitignore` updates

- [ ] **Step 1: Create migration branch**

```bash
git checkout -b nextjs-migration
```

- [ ] **Step 2: Remove Gatsby files and dependencies**

Delete these files:
- `gatsby-config.ts`
- `gatsby-node.ts`
- `gatsby-browser.tsx`
- `gatsby-ssr.tsx`
- `netlify.toml`
- `src/` directory (entire)
- `.cache/` directory
- `public/` directory

```bash
rm -f gatsby-config.ts gatsby-node.ts gatsby-browser.tsx gatsby-ssr.tsx netlify.toml
rm -rf src/ .cache/ public/
```

- [ ] **Step 3: Create new package.json**

```json
{
  "name": "kij-studio-website",
  "version": "1.0.0",
  "private": true,
  "description": "KIJ Studio - Architectural Visualization and Interior Design",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,css}\""
  },
  "dependencies": {
    "@next/third-parties": "^15.0.0",
    "@portabletext/react": "^3.2.1",
    "@sanity/image-url": "^1.1.0",
    "next": "^15.0.0",
    "next-sanity": "^9.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.15.30",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "postcss": "^8.5.4",
    "postcss-preset-env": "^10.2.1",
    "prettier": "^3.5.3",
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 4: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
module.exports = {
  plugins: [
    require("postcss-preset-env")({
      features: {
        "nesting-rules": true,
      },
      browsers: [">0.25%", "not dead"],
    }),
  ],
};
```

- [ ] **Step 7: Create .env.local**

```
SANITY_TOKEN=<copy from existing .env file>
```

Read the value from the existing `.env` file first.

- [ ] **Step 8: Update .gitignore for Next.js**

Add these entries to `.gitignore`:
```
.next/
out/
.env.local
.superpowers/
```

Remove Gatsby-specific entries (`.cache/`).

- [ ] **Step 9: Install dependencies**

```bash
npm install
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project, remove Gatsby"
```

---

## Task 2: Static assets and shared utilities

**Files:**
- Create: `public/images/*`, `public/videos/*`, `styles/global.css`, `styles/breakpoints.ts`, `hooks/use-breakpoints.ts`, `lib/sanity.ts`, `lib/image.ts`

Note: Before starting this task, copy the necessary files from the old Gatsby source. The old files should be accessible via git (they were deleted in the previous task but still in history). Use `git show HEAD~1:src/...` to retrieve them, OR checkout the files from the `main` branch.

- [ ] **Step 1: Copy static assets from main branch**

```bash
mkdir -p public/images public/videos
git checkout main -- src/images/logo.png src/images/logo.svg src/images/favicon.png src/images/contact.jpg src/movies/P2.webm src/movies/P2.mp4
mv src/images/logo.png public/images/logo.png
mv src/images/logo.svg public/images/logo.svg
mv src/images/favicon.png public/images/favicon.png
mv src/images/contact.jpg public/images/contact.jpg
mv src/movies/P2.webm public/videos/P2.webm
mv src/movies/P2.mp4 public/videos/P2.mp4
rm -rf src/images src/movies
```

- [ ] **Step 2: Create styles/global.css**

Copy from `main` branch:
```bash
mkdir -p styles
git show main:src/styles/global.css > styles/global.css
```

No modifications needed — CSS is framework-agnostic.

- [ ] **Step 3: Create styles/breakpoints.ts**

Copy from `main` branch:
```bash
git show main:src/styles/breakpoints.ts > styles/breakpoints.ts
```

No modifications needed.

- [ ] **Step 4: Create hooks/use-breakpoints.ts**

Copy from `main` branch:
```bash
mkdir -p hooks
git show main:src/hooks/useBreakpoints.ts > hooks/use-breakpoints.ts
```

No modifications needed — it's a pure React hook.

- [ ] **Step 5: Create lib/sanity.ts**

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "53l346w4",
  dataset: "production",
  apiVersion: "2026-03-01",
  useCdn: true,
});

// --- GROQ Queries ---

export async function getVisualizations() {
  return client.fetch(`
    *[_type == "visualisation"] | order(orderRank asc) {
      title,
      description,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt
      }
    }
  `);
}

export async function getVisualization(slug: string) {
  return client.fetch(
    `
    *[_type == "visualisation" && slug.current == $slug][0] {
      title,
      description,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt,
        caption
      }
    }
  `,
    { slug }
  );
}

export async function getVisualizationSlugs() {
  return client.fetch<{ slug: { current: string } }[]>(`
    *[_type == "visualisation" && defined(slug.current)] {
      slug
    }
  `);
}

export async function getInteriors() {
  return client.fetch(`
    *[_type == "interior"] | order(orderRank asc) {
      title,
      description,
      location,
      livingArea,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt
      }
    }
  `);
}

export async function getInterior(slug: string) {
  return client.fetch(
    `
    *[_type == "interior" && slug.current == $slug][0] {
      title,
      description,
      location,
      livingArea,
      slug,
      gallery[] {
        asset-> {
          _id,
          url,
          metadata { dimensions }
        },
        alt,
        caption
      }
    }
  `,
    { slug }
  );
}

export async function getInteriorSlugs() {
  return client.fetch<{ slug: { current: string } }[]>(`
    *[_type == "interior" && defined(slug.current)] {
      slug
    }
  `);
}

export async function getAllSlugs() {
  return client.fetch<
    { _type: string; slug: { current: string }; _updatedAt: string }[]
  >(`
    *[_type in ["visualisation", "interior"] && defined(slug.current)] {
      _type,
      slug,
      _updatedAt
    }
  `);
}
```

- [ ] **Step 6: Create lib/image.ts**

```typescript
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add static assets, styles, and Sanity integration layer"
```

---

## Task 3: Root layout and header component

**Files:**
- Create: `app/layout.tsx`, `components/header.tsx`, `components/header.module.css`, `components/layout.module.css`

- [ ] **Step 1: Copy CSS modules from main branch**

```bash
mkdir -p components
git show main:src/components/header.module.css > components/header.module.css
git show main:src/components/layout.module.css > components/layout.module.css
```

- [ ] **Step 2: Create components/header.tsx**

Migrate from `src/components/header.tsx`. Key changes:
- `"use client"` directive (uses state/effects)
- `import Link from "next/link"` replaces `import { Link } from "gatsby"`
- `import Image from "next/image"` replaces `StaticImage`
- Remove `activeClassName` (not supported in Next.js Link — use `usePathname` instead)
- Logo uses `next/image` with static import

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { breakpoints } from "@/styles/breakpoints";
import styles from "./header.module.css";

interface HeaderProps {
  siteTitle: string;
  isSticky?: boolean;
  transparentBg?: boolean;
  fullWidth?: boolean;
  navColor?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
}

export default function Header({
  siteTitle,
  isSticky = false,
  transparentBg = false,
  fullWidth = false,
  navColor = "black",
  className = "",
  innerClassName = "",
  style = {},
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= breakpoints.md);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const navItems = [
    { path: "/interior-design", label: "Interior Design" },
    { path: "/visualizations", label: "Visualizations" },
    { path: "/about", label: "About Us" },
  ];

  const headerClasses = [styles.headerWrapper];
  if (className) headerClasses.push(className);
  if (isSticky && !isMobile) headerClasses.push(styles.sticky);
  if (transparentBg && !isMobile) headerClasses.push(styles.transparent);
  if (fullWidth) headerClasses.push(styles.fullWidth);

  const innerClasses = [styles.inner];
  if (innerClassName) innerClasses.push(innerClassName);

  return (
    <header className={headerClasses.join(" ")}>
      <div className={innerClasses.join(" ")} style={style}>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt={siteTitle}
            width={120}
            height={40}
            className="logo"
            priority
          />
        </Link>

        {!isMobile && (
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                className={`${styles.navLink} ${navColor === "white" ? styles.white : ""} ${pathname === item.path ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navText}>{item.label}</span>
              </Link>
            ))}
            <a
              href="https://www.instagram.com/kijstudio"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.instagramLink} ${navColor === "white" ? styles.white : ""}`}
              aria-label="Follow us on Instagram"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.instagramIcon}
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </nav>
        )}

        {isMobile && (
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div
              className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>

      {isMobile && isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link
              href={item.path}
              key={item.path}
              className={`${styles.mobileNavLink} ${pathname === item.path ? styles.navLinkActive : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navText}>{item.label}</span>
            </Link>
          ))}
          <a
            href="https://www.instagram.com/kijstudio"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileInstagramLink}
            aria-label="Follow us on Instagram"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.instagramIcon}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      )}
    </header>
  );
}
```

Note: The logo `height` prop (40) is approximate — check the actual image dimensions and adjust. The key change from `StaticImage` is that `next/image` requires explicit width/height for non-static imports.

- [ ] **Step 3: Create app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/header";
import layoutStyles from "@/components/layout.module.css";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "KIJ Studio",
    template: "%s | KIJ Studio",
  },
  description:
    "Bringing your dream spaces to life with creative design and breathtaking visuals.",
  keywords: [
    "KIJ Studio",
    "interior design",
    "architectural visualization",
    "3D rendering",
  ],
  metadataBase: new URL("https://kijstudio.com"),
  openGraph: {
    type: "website",
    siteName: "KIJ Studio",
  },
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gzh3byk.css" />
      </head>
      <body>
        <Header siteTitle="KIJ Studio" />
        <div className={layoutStyles.contentInner}>
          <main>{children}</main>
          <footer className={layoutStyles.footer}>
            © {currentYear}, Kij Studio
          </footer>
        </div>
        <GoogleAnalytics gaId="G-086HYGYM9B" />
      </body>
    </html>
  );
}
```

**Important note:** The homepage (`app/page.tsx` in Task 5) does NOT use the standard header from the layout — it has its own nav inside the split screen. The about page also uses its own header with different props. We need to handle this. Two approaches:

1. Make the root layout header conditional based on route (complex).
2. Keep the header out of root layout and include it per-page as needed.

Looking at the current Gatsby code: the `Layout` component (with Header) is used by the listing pages and detail pages, but NOT by the homepage or about page. The homepage has its own nav, and about page renders its own `<Header>` with custom props.

**Revised approach:** Remove `<Header>` from root layout. Each page that needs a header includes it explicitly. This matches the current behavior.

Revised `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import layoutStyles from "@/components/layout.module.css";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "KIJ Studio",
    template: "%s | KIJ Studio",
  },
  description:
    "Bringing your dream spaces to life with creative design and breathtaking visuals.",
  keywords: [
    "KIJ Studio",
    "interior design",
    "architectural visualization",
    "3D rendering",
  ],
  metadataBase: new URL("https://kijstudio.com"),
  openGraph: {
    type: "website",
    siteName: "KIJ Studio",
  },
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gzh3byk.css" />
      </head>
      <body>
        {children}
        <GoogleAnalytics gaId="G-086HYGYM9B" />
      </body>
    </html>
  );
}
```

Pages that use the standard layout (listing + detail pages) will wrap their content in a shared `PageLayout` component or directly include the header and footer. Since the current `Layout` component wraps header + footer + main, create a lightweight wrapper:

- [ ] **Step 4: Create components/page-layout.tsx**

This replaces the Gatsby `Layout` component — used by listing and detail pages.

```typescript
import Header from "@/components/header";
import layoutStyles from "./layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header siteTitle="KIJ Studio" />
      <div className={layoutStyles.contentInner}>
        <main>{children}</main>
        <footer className={layoutStyles.footer}>
          © {currentYear}, Kij Studio
        </footer>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Next.js dev server starts. It will show a blank page (no `app/page.tsx` yet), but no build errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add root layout, header component, and page layout wrapper"
```

---

## Task 4: Slider and SplitScreen components

**Files:**
- Create: `components/slider.tsx`, `components/slider.module.css`, `components/split-screen.tsx`, `components/split-screen.module.css`

- [ ] **Step 1: Copy CSS modules**

```bash
git show main:src/components/Slider.module.css > components/slider.module.css
git show main:src/components/SplitScreen.module.css > components/split-screen.module.css
```

- [ ] **Step 2: Create components/split-screen.tsx**

Copy directly from `main` — this component has zero Gatsby dependencies:

```bash
git show main:src/components/SplitScreen.tsx > components/split-screen.tsx
```

Then update the CSS module import:
- Change `import * as styles from "./SplitScreen.module.css"` → `import styles from "./split-screen.module.css"`

No other changes needed.

- [ ] **Step 3: Create components/slider.tsx**

This is the largest migration. Copy from `main` then apply these changes:

```bash
git show main:src/components/Slider.tsx > components/slider.tsx
```

Changes to make in `components/slider.tsx`:

1. Add `"use client"` at the top
2. Replace imports:
   - `import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"` → remove entirely
   - `import { navigate } from "gatsby"` → `import { useRouter } from "next/navigation"`
   - `import * as styles from "./Slider.module.css"` → `import styles from "./slider.module.css"`
3. Update `SliderItem` interface:
   - Change `image: IGatsbyImageData` → `image: string` (URL string from Sanity)
   - Add `imageWidth?: number` and `imageHeight?: number`
4. Inside the component, add: `const router = useRouter()`
5. Replace `navigate(item.link)` → `router.push(item.link)`
6. Replace all `<GatsbyImage image={getImage(item.image)!} alt={...} />` with:
   ```tsx
   <img
     src={item.image}
     alt={item.imageAlt || ""}
     style={{ width: "100%", height: "100%", objectFit: "cover" }}
     loading="lazy"
   />
   ```
   (Using `<img>` instead of `next/image` here because the Slider handles its own sizing and the images come from Sanity CDN which already optimizes. This avoids complexity with `next/image` layout issues inside the carousel.)
7. Same replacement for the fullscreen popup image — use `item.fullImageUrl || item.image`

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds (pages still missing but components compile).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migrate Slider and SplitScreen components"
```

---

## Task 5: Homepage

**Files:**
- Create: `app/page.tsx`, `app/page.module.css`

- [ ] **Step 1: Copy homepage CSS**

```bash
git show main:src/pages/index.module.css > app/page.module.css
```

- [ ] **Step 2: Create app/page.tsx**

The homepage is a Client Component (video playback, state). It does NOT use the standard layout (no header/footer) — it has its own nav inside the split screen.

Key changes from original:
- `"use client"` directive
- `import Link from "next/link"` replaces Gatsby Link
- Video source is `/videos/P2.webm` (from public/)
- Logo is `/images/logo.png` (from public/)
- Remove `<Seo>` — metadata handled separately (see Step 3)
- JSON-LD structured data moved to metadata export or a server component wrapper

Since the homepage needs both client-side video logic AND server-side metadata, use this pattern:
- `app/page.tsx` exports metadata (server-side)
- The actual component is a Client Component imported into the page

```typescript
import type { Metadata } from "next";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: "KIJ Studio | Architectural Visualization & Interior Design",
  description:
    "Bringing your dream spaces to life with creative design and breathtaking visuals. Specializing in architectural visualization and interior design.",
  keywords: [
    "KIJ Studio",
    "interior design",
    "visualization",
    "architecture",
    "3D renderings",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "KIJ Studio",
                description:
                  "Bringing your dream spaces to life with creative design and breathtaking visuals. Specializing in architectural visualization and interior design.",
                url: "https://kijstudio.com",
                logo: "https://kijstudio.com/images/logo.png",
                sameAs: ["https://www.instagram.com/kijstudio"],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                },
                areaServed: "Global",
                knowsAbout: [
                  "Interior Design",
                  "Architectural Visualization",
                  "3D Rendering",
                  "Space Design",
                  "Home Design",
                ],
              },
              {
                "@type": "WebSite",
                name: "KIJ Studio",
                url: "https://kijstudio.com",
              },
            ],
          }),
        }}
      />
      <HomeContent />
    </>
  );
}
```

- [ ] **Step 3: Create app/home-content.tsx**

Client Component with all the video/interaction logic. Port from `src/pages/index.tsx`:
- Replace `import { Link } from "gatsby"` → `import Link from "next/link"`
- Remove `import { StaticImage } from "gatsby-plugin-image"` and `import Seo`
- Video source: `"/videos/P2.webm"`
- Logo: `"/images/logo.png"` used as `<img>` tag
- Remove the `<Seo>` component usage (handled in page.tsx metadata)
- Remove the JSON-LD script (moved to page.tsx server component)
- Remove the `isClient` state for JSON-LD (no longer needed)
- Keep `isVideoLoading` / `videoError` / video ref logic as-is

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SplitScreen from "@/components/split-screen";
import styles from "./page.module.css";

export default function HomeContent() {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoReady = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsVideoLoading(false);
    } catch (error) {
      console.error("Video play failed:", error);
      setVideoError(true);
      setIsVideoLoading(false);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleLoadedData = () => {
    handleVideoReady();
  };

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.load();

      const timeout = setTimeout(() => {
        if (isVideoLoading) {
          setIsVideoLoading(false);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isVideoLoading]);

  const leftContent = (
    <div className={styles.contentWrapper}>
      <img
        src="/images/logo.png"
        alt="KIJ Studio"
        className={"logo " + styles.logo}
        width={200}
      />
      <div className={styles.info}>
        <p>
          Bringing your dream spaces to life with creative design and
          breathtaking visuals.
        </p>
      </div>
      <nav className={styles.nav}>
        <Link href="/visualizations" className={styles.navLink}>
          Visualizations
        </Link>
        <Link href="/interior-design" className={styles.navLink}>
          Interior Design
        </Link>
        <Link href="/about" className={styles.navLink}>
          About us
        </Link>
        <a
          href="https://www.instagram.com/kijstudio"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </nav>
    </div>
  );

  const rightContent = (
    <div className={styles.videoWrapper}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className={styles.homeVideo}
        onLoadedData={handleLoadedData}
        onPlay={handleVideoPlay}
        onError={handleVideoError}
      >
        <source src="/videos/P2.webm" type="video/webm" />
      </video>
      {videoError && (
        <div>
          <p>Video unavailable</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={styles.pageContent}>
        <SplitScreen
          leftContent={leftContent}
          rightContent={rightContent}
          fullWidth={true}
          leftRatio={4}
          rightRatio={6}
        />
      </div>
      {isVideoLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Verify homepage renders**

```bash
npm run dev
```

Open http://localhost:3000 — verify video loads, navigation links work, layout matches original.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port homepage with video background and split screen"
```

---

## Task 6: About page

**Files:**
- Create: `app/about/page.tsx`, `app/about/page.module.css`

- [ ] **Step 1: Copy about CSS**

```bash
mkdir -p app/about
git show main:src/pages/about.module.css > app/about/page.module.css
```

- [ ] **Step 2: Create app/about/page.tsx**

The about page has its own Header with custom props and does NOT use the standard layout. It also uses `StaticImage` for the contact photo, which becomes `next/image` with a static import from `public/`.

```typescript
import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/header";
import SplitScreen from "@/components/split-screen";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Get in touch with KIJ Studio. Founded by two Kraków-based architects specializing in high-quality 3D renderings and visualizations.",
  keywords: [
    "contact",
    "about us",
    "KIJ Studio",
    "architecture firm",
    "visualization studio",
  ],
};

export default function AboutPage() {
  const leftContent = (
    <div className={styles.contactContentWrapper}>
      <div className={styles.contactContent}>
        <div className={styles.studioInfo}>
          <p className={styles.studioText}>
            KIJ STUDIO WAS FOUNDED BY TWO KRAKÓW-BASED ARCHITECTS WHO
            SPECIALIZE IN HIGH-QUALITY 3D RENDERINGS AND VISUALIZATIONS,
            TRANSFORMING ARCHITECTURAL IDEAS INTO STUNNING, LIFELIKE IMAGES. BY
            COMBINING CREATIVITY WITH PRECISION, WE BRING YOUR DESIGNS TO LIFE,
            ENSURING EVERY DETAIL IS CAREFULLY CRAFTED
          </p>
          <p>
            CONTACT:{" "}
            <a className={styles.contactLink} href="mailto:info@kijstudio.com">
              INFO@KIJSTUDIO.COM
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <Image
      src="/images/contact.jpg"
      alt="Contact"
      fill
      style={{ objectFit: "cover" }}
      sizes="60vw"
      quality={95}
    />
  );

  return (
    <div className={styles.contactPage}>
      <Header
        siteTitle="KIJ Studio"
        isSticky={true}
        transparentBg={true}
        fullWidth={true}
        navColor="white"
        className={styles.header}
      />
      <SplitScreen
        leftContent={leftContent}
        rightContent={<div style={{ position: "relative", height: "100%", width: "100%" }}>{rightContent}</div>}
        fullWidth={true}
        leftRatio={4}
        rightRatio={6}
        backgroundImageSrc="/images/contact.jpg"
      />
    </div>
  );
}
```

Note: The `Image` component with `fill` requires a positioned parent — hence the wrapper div. Check if the existing `SplitScreen` right section already has `position: relative`; if so, the wrapper may not be needed.

- [ ] **Step 3: Verify about page**

Open http://localhost:3000/about — verify image loads, header renders with white nav, layout matches.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: port about page"
```

---

## Task 7: Visualizations listing page

**Files:**
- Create: `app/visualizations/page.tsx`

- [ ] **Step 1: Create app/visualizations/page.tsx**

This is a Server Component that fetches data from Sanity, then passes it to the client-side Slider. The listing pages in Gatsby used `Layout` (header + footer), so we use `PageLayout`.

```typescript
import type { Metadata } from "next";
import { getVisualizations } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import VisualizationsContent from "./visualizations-content";

export const metadata: Metadata = {
  title: "Visualizations",
  description:
    "Explore our architectural visualizations and 3D renderings at KIJ Studio.",
  keywords: [
    "architectural visualization",
    "3D rendering",
    "architectural design",
    "KIJ Studio",
  ],
};

export default async function VisualizationsPage() {
  const visualizations = await getVisualizations();

  // Transform Sanity data to slider format
  const sliderItems = visualizations
    .filter(
      (item: any) => item.gallery?.[0]?.asset
    )
    .map((item: any, index: number) => ({
      id: `viz-${index}`,
      title: item.title,
      description: item.description,
      image: urlFor(item.gallery[0].asset).width(800).format("webp").url(),
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/visualizations/${item.slug.current}` : undefined,
      singleImageGallery: item.gallery.length === 1,
      galleryLength: item.gallery.length,
      fullImageUrl: item.gallery[0].asset.url,
    }));

  return (
    <PageLayout>
      <VisualizationsContent items={sliderItems} />
    </PageLayout>
  );
}
```

- [ ] **Step 2: Create app/visualizations/visualizations-content.tsx**

Client Component wrapper for the Slider:

```typescript
"use client";

import Slider, { SliderItem } from "@/components/slider";
import sliderStyles from "@/components/slider.module.css";
import { breakpoints } from "@/styles/breakpoints";

interface Props {
  items: SliderItem[];
}

export default function VisualizationsContent({ items }: Props) {
  const renderHoverContent = (item: SliderItem) => {
    const shouldRender = item.title || item.description;
    return (
      <div className={sliderStyles.hoverContent}>
        {shouldRender && (
          <div className={sliderStyles.hoverContentInner}>
            <h3 className={sliderStyles.imageTitle}>{item.title}</h3>
          </div>
        )}
      </div>
    );
  };

  const fullScreenPredicate = (item: SliderItem) => {
    return item.singleImageGallery === true;
  };

  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      return;
    }
    return true;
  };

  return (
    <Slider
      items={items}
      renderHoverContent={renderHoverContent}
      itemsPerPageDefault={4}
      breakpoints={{
        mobile: breakpoints.md,
        tablet: breakpoints.lg,
        desktop: breakpoints.xl,
      }}
      mobileItems={1}
      tabletItems={2}
      transitionDuration={500}
      autoplay={true}
      autoplayInterval={5000}
      enableFullScreenView={false}
      fullScreenPredicate={fullScreenPredicate}
      onItemClick={handleItemClick}
    />
  );
}
```

- [ ] **Step 3: Verify visualizations listing**

Open http://localhost:3000/visualizations — verify images load from Sanity, slider works, hover content appears.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: port visualizations listing page"
```

---

## Task 8: Interior design listing page

**Files:**
- Create: `app/interior-design/page.tsx`, `app/interior-design/interior-design-content.tsx`

- [ ] **Step 1: Create app/interior-design/page.tsx**

Same pattern as visualizations. Key difference: interior items have `location` and `livingArea` fields.

```typescript
import type { Metadata } from "next";
import { getInteriors } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import InteriorDesignContent from "./interior-design-content";

export const metadata: Metadata = {
  title: "Interior Design",
  description:
    "Explore our interior design projects at KIJ Studio.",
  keywords: [
    "interior design",
    "interior visualization",
    "home design",
    "KIJ Studio",
    "living spaces",
  ],
};

export default async function InteriorDesignPage() {
  const interiors = await getInteriors();

  const sliderItems = interiors
    .filter((item: any) => item.gallery?.[0]?.asset)
    .map((item: any, index: number) => ({
      id: `interior-${index}`,
      title: item.title,
      description: item.description,
      location: item.location,
      livingArea: item.livingArea,
      image: urlFor(item.gallery[0].asset).width(800).format("webp").url(),
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/interior-design/${item.slug.current}` : undefined,
      singleImageGallery: item.gallery.length === 1,
      galleryLength: item.gallery.length,
      fullImageUrl: item.gallery[0].asset.url,
    }));

  return (
    <PageLayout>
      <InteriorDesignContent items={sliderItems} />
    </PageLayout>
  );
}
```

- [ ] **Step 2: Create app/interior-design/interior-design-content.tsx**

```typescript
"use client";

import Slider, { SliderItem } from "@/components/slider";
import sliderStyles from "@/components/slider.module.css";
import { breakpoints } from "@/styles/breakpoints";

interface Props {
  items: SliderItem[];
}

export default function InteriorDesignContent({ items }: Props) {
  const renderHoverContent = (item: SliderItem) => {
    const shouldRender = item.title || item.location || item.livingArea;
    return (
      <div className={sliderStyles.hoverContent}>
        {shouldRender && (
          <div className={sliderStyles.hoverContentInner}>
            <h3 className={sliderStyles.imageTitle}>{item.title}</h3>
            <div className={sliderStyles.imageDetails}>
              {item.location && <p>{item.location}</p>}
              {item.livingArea && <p>{item.livingArea} m²</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  const fullScreenPredicate = (item: SliderItem) => {
    return item.singleImageGallery === true;
  };

  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      return;
    }
    return true;
  };

  return (
    <Slider
      items={items}
      renderHoverContent={renderHoverContent}
      itemsPerPageDefault={4}
      breakpoints={{
        mobile: breakpoints.md,
        tablet: breakpoints.lg,
        desktop: breakpoints.xl,
      }}
      mobileItems={1}
      tabletItems={2}
      transitionDuration={500}
      autoplay={true}
      autoplayInterval={5000}
      enableFullScreenView={false}
      fullScreenPredicate={fullScreenPredicate}
      onItemClick={handleItemClick}
    />
  );
}
```

- [ ] **Step 3: Verify interior design listing**

Open http://localhost:3000/interior-design — verify it matches the visualizations page behavior but with location/area in hover content.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: port interior design listing page"
```

---

## Task 9: Dynamic detail pages (visualizations + interior design)

**Files:**
- Create: `app/visualizations/[slug]/page.tsx`, `app/visualizations/[slug]/page.module.css`
- Create: `app/interior-design/[slug]/page.tsx`, `app/interior-design/[slug]/page.module.css`
- Create: `components/detail-content.tsx` (shared detail layout for both)

- [ ] **Step 1: Copy detail page CSS**

```bash
mkdir -p app/visualizations/\[slug\] app/interior-design/\[slug\]
git show main:src/templates/common.module.css > app/visualizations/\[slug\]/page.module.css
cp app/visualizations/\[slug\]/page.module.css app/interior-design/\[slug\]/page.module.css
```

- [ ] **Step 2: Create app/visualizations/[slug]/page.tsx**

Server Component with `generateStaticParams` and `generateMetadata`:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVisualization, getVisualizationSlugs } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import DetailContent from "@/components/detail-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getVisualizationSlugs();
  return slugs.map((item) => ({ slug: item.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const visualization = await getVisualization(slug);
  if (!visualization) return { title: "Not Found" };

  return {
    title: visualization.title,
    description:
      visualization.description ||
      `${visualization.title} - Architectural visualization by KIJ Studio`,
    keywords: [
      "architectural visualization",
      "3D rendering",
      visualization.title,
      "KIJ Studio",
    ],
  };
}

export default async function VisualizationPage({ params }: Props) {
  const { slug } = await params;
  const visualization = await getVisualization(slug);

  if (!visualization) {
    notFound();
  }

  const sliderItems = visualization.gallery
    ? visualization.gallery.map((item: any, index: number) => ({
        id: index,
        image: urlFor(item.asset).width(1600).format("webp").url(),
        imageAlt: item.alt || visualization.title,
        title: "",
        fullImageUrl: item.asset.url,
      }))
    : [];

  return (
    <PageLayout>
      <DetailContent
        title={visualization.title}
        description={visualization.description}
        items={sliderItems}
        backLink="/visualizations"
      />
    </PageLayout>
  );
}
```

- [ ] **Step 3: Create components/detail-content.tsx**

Shared Client Component for detail page layout (used by both visualization and interior detail pages):

```typescript
"use client";

import Link from "next/link";
import Slider, { SliderItem } from "@/components/slider";
import styles from "./detail-content.module.css";

interface Props {
  title: string;
  description?: string;
  items: SliderItem[];
  backLink: string;
}

export default function DetailContent({
  title,
  description,
  items,
  backLink,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.descriptionColumn}>
        <Link href={backLink} className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12H8.414l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L8.414 14H19a1 1 0 0 0 0-2z" />
          </svg>
        </Link>
        <div className={styles.descriptionWrapper}>
          <h1 className={styles.title}>{title}</h1>
          {description && description.trim() !== "" && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </div>
      <div className={styles.sliderColumn}>
        {items.length > 0 && (
          <Slider
            items={items}
            itemsPerPageDefault={2}
            mobileItems={1}
            tabletItems={1}
            breakpoints={{ mobile: 768, tablet: 992, desktop: 1200 }}
            enableFullScreenView={true}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create app/interior-design/[slug]/page.tsx**

Same pattern, different data source:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInterior, getInteriorSlugs } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import DetailContent from "@/components/detail-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getInteriorSlugs();
  return slugs.map((item) => ({ slug: item.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const interior = await getInterior(slug);
  if (!interior) return { title: "Not Found" };

  return {
    title: interior.title,
    description:
      interior.description ||
      `${interior.title} - Interior design by KIJ Studio`,
    keywords: [
      "interior design",
      "interior visualization",
      interior.title,
      "KIJ Studio",
    ],
  };
}

export default async function InteriorPage({ params }: Props) {
  const { slug } = await params;
  const interior = await getInterior(slug);

  if (!interior) {
    notFound();
  }

  const sliderItems = interior.gallery
    ? interior.gallery.map((item: any, index: number) => ({
        id: index,
        image: urlFor(item.asset).width(1600).format("webp").url(),
        imageAlt: item.alt || interior.title,
        title: "",
        fullImageUrl: item.asset.url,
      }))
    : [];

  return (
    <PageLayout>
      <DetailContent
        title={interior.title}
        description={interior.description}
        items={sliderItems}
        backLink="/interior-design"
      />
    </PageLayout>
  );
}
```

Note: We reuse the shared `DetailContent` component since both detail page layouts are identical.

- [ ] **Step 5: Verify detail pages**

Navigate to a visualization detail page and an interior detail page via the listing pages. Verify:
- Back button works
- Gallery slider renders
- Fullscreen popup works
- Title and description display correctly

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: port visualization and interior design detail pages"
```

---

## Task 10: 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create app/not-found.tsx**

```typescript
import PageLayout from "@/components/page-layout";

export default function NotFound() {
  return (
    <PageLayout>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&apos;t exist... the sadness.</p>
    </PageLayout>
  );
}
```

Metadata for the 404 page is automatically handled by Next.js.

- [ ] **Step 2: Verify 404**

Open http://localhost:3000/nonexistent — verify 404 page renders.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add 404 page"
```

---

## Task 11: SEO improvements — sitemap and structured data

**Files:**
- Create: `app/sitemap.ts`
- Modify: detail pages to add breadcrumb + CreativeWork structured data

- [ ] **Step 1: Create app/sitemap.ts**

```typescript
import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  const projectPages = slugs.map((item) => {
    const prefix =
      item._type === "visualisation" ? "visualizations" : "interior-design";
    return {
      url: `https://kijstudio.com/${prefix}/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.6 as const,
    };
  });

  return [
    {
      url: "https://kijstudio.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://kijstudio.com/visualizations",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://kijstudio.com/interior-design",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://kijstudio.com/about",
      lastModified: new Date(),
      priority: 0.5,
    },
    ...projectPages,
  ];
}
```

- [ ] **Step 2: Add breadcrumb structured data to visualization detail page**

In `app/visualizations/[slug]/page.tsx`, add JSON-LD before the `<PageLayout>`:

```tsx
// Inside the VisualizationPage component, before return:
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://kijstudio.com" },
    { "@type": "ListItem", position: 2, name: "Visualizations", item: "https://kijstudio.com/visualizations" },
    { "@type": "ListItem", position: 3, name: visualization.title },
  ],
};

const creativeWorkJsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: visualization.title,
  description: visualization.description,
  creator: { "@type": "Organization", name: "KIJ Studio" },
  image: visualization.gallery?.map((item: any) => item.asset.url).filter(Boolean),
};

// In the return JSX, add before <PageLayout>:
<>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
  <PageLayout>...</PageLayout>
</>
```

- [ ] **Step 3: Add breadcrumb structured data to interior detail page**

Same pattern in `app/interior-design/[slug]/page.tsx`, with "Interior Design" as the second breadcrumb item.

- [ ] **Step 4: Verify sitemap and structured data**

```bash
npm run build
```

Check:
- http://localhost:3000/sitemap.xml renders with all pages
- View source on detail pages — JSON-LD blocks are present

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dynamic sitemap and structured data for SEO"
```

---

## Task 12: Full build verification and cleanup

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. All static pages generated.

- [ ] **Step 2: Test production server**

```bash
npm run start
```

Walk through every page:
- `/` — homepage with video
- `/about` — about page with contact image
- `/visualizations` — listing with slider
- `/interior-design` — listing with slider
- `/visualizations/[any-slug]` — detail page
- `/interior-design/[any-slug]` — detail page
- `/nonexistent` — 404 page

- [ ] **Step 3: Verify SEO**

For each page, view source and confirm:
- Unique `<title>` tag
- `<meta name="description">` present
- Open Graph tags present
- JSON-LD structured data on homepage and detail pages
- `/sitemap.xml` accessible

- [ ] **Step 4: Clean up any remaining Gatsby references**

Search for any leftover Gatsby references:
```bash
grep -r "gatsby" --include="*.ts" --include="*.tsx" --include="*.json" .
```

Remove any found.

- [ ] **Step 5: Verify .gitignore includes .superpowers/**

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: production build verification and cleanup"
```

---

## Task 13: Deployment setup (Vercel)

This task happens outside the codebase but is documented here for completeness.

- [ ] **Step 1: Connect repository to Vercel**

Go to vercel.com, import the GitHub repository. Vercel will auto-detect Next.js.

- [ ] **Step 2: Set environment variables in Vercel**

Set `SANITY_TOKEN` in Vercel project settings (if needed — check if public read access works without token).

- [ ] **Step 3: Deploy and verify**

Push the `nextjs-migration` branch. Verify the preview deployment works.

- [ ] **Step 4: Configure custom domain**

Add `kijstudio.com` to Vercel project. Update DNS records to point to Vercel.

- [ ] **Step 5: Set up Sanity webhook**

In Sanity dashboard, create a webhook:
- URL: Vercel Deploy Hook URL (from Vercel project settings → Git → Deploy Hooks)
- Filter: `_type in ["visualisation", "interior"]`
- Trigger: Create, Update, Delete

- [ ] **Step 6: Merge branch**

Once verified on Vercel preview:
```bash
git checkout main
git merge nextjs-migration
git push
```

- [ ] **Step 7: Remove Netlify**

After DNS propagation is confirmed, remove the Netlify site.
