# Muna Foundation Website — Design Spec

## Context

The Muna Foundation needs a website focused on awareness and storytelling. 1-2 non-technical admins must be able to upload photos (standalone galleries and within blog posts) and change the site's heading font — all through Sanity Studio, with no code changes required.

The project already has a Sanity Studio + Next.js 16 frontend monorepo with schemas for pages, posts, people, and site settings. This spec extends that foundation with gallery support, font customization, and new pages.

## Architecture

**Approach: Sanity-Native** — all admin-managed content lives in Sanity schemas. No external services. Admins use the existing Sanity Studio for everything.

- **CMS:** Sanity (project `iabl5duq`, dataset `production`)
- **Frontend:** Next.js 16 (App Router), Tailwind CSS
- **Images:** Sanity CDN with hotspot cropping, Unsplash integration
- **Fonts:** Google Fonts loaded dynamically based on Sanity siteTheme document
- **Visual style:** Bold & impactful — dark sections, full-bleed imagery, dramatic heavy headings, high contrast

## Sanity Schema Changes

### New: `gallery` document type

**File:** `studio/src/schemaTypes/documents/gallery.ts`

| Field | Type | Notes |
|-------|------|-------|
| title | string | Required |
| slug | slug | Auto-generated from title |
| description | text | Optional short summary |
| coverImage | image | Thumbnail for gallery listing, hotspot enabled |
| images | array of objects | Each item: `image` (with hotspot), `caption` (string, optional), `alt` (string, AI-assisted) |
| date | date | When photos were taken |
| orderRank | string | For drag-and-drop ordering in Studio via `@sanity/orderable-document-list` plugin |

### New: `siteTheme` singleton

**File:** `studio/src/schemaTypes/singletons/siteTheme.ts`

| Field | Type | Notes |
|-------|------|-------|
| headingFont | string | Dropdown with options: "Playfair Display", "Oswald", "Bebas Neue", "Montserrat", "Libre Baskerville" |

The frontend reads this value and loads the corresponding Google Font. Body font remains fixed (Inter or system font) for readability.

### Extended: `settings` singleton

**File:** `studio/src/schemaTypes/singletons/settings.tsx` (modify existing)

New fields to add:

| Field | Type | Notes |
|-------|------|-------|
| foundationName | string | Used in hero, header, footer |
| tagline | string | Mission one-liner for hero sections |
| contactEmail | string | Displayed on contact page |
| socialLinks | array of `{ platform: string, url: url }` | Platform options: Instagram, Twitter/X, Facebook, LinkedIn, YouTube |
| donateUrl | url | Link to external donation platform (GoFundMe, PayPal, etc.) |
| donateButtonText | string | e.g., "Support Our Mission" (defaults to "Donate") |

### Unchanged schemas

- `page` — already has page builder with CTA and InfoSection blocks
- `post` — already has cover images, rich content with inline images, author references
- `person` — already has name and picture fields

## Studio Structure

Update `studio/src/structure/index.ts` to organize the sidebar:

1. **Galleries** — gallery document list
2. **Stories** — post document list (renamed from "Posts" for foundation context)
3. **Pages** — page document list
4. **People** — person document list
5. *(separator)*
6. **Site Settings** — settings singleton
7. **Site Theme** — siteTheme singleton

## Frontend Pages

### Homepage (`/`)

**File:** `frontend/app/page.tsx` (modify existing)

- Full-screen hero section with background image, foundation name, tagline, and donate CTA button (all from settings)
- Featured Stories section: latest 2-3 published posts with cover images
- Photo Highlights section: thumbnails from recent galleries
- Bottom CTA section linking to About or Donate

### Gallery listing (`/gallery`)

**File:** `frontend/app/gallery/page.tsx` (new)

- Page title
- Grid of gallery cards, each showing: cover image, title, photo count, date
- Cards link to individual gallery pages
- Sorted by date descending

### Single gallery (`/gallery/[slug]`)

**File:** `frontend/app/gallery/[slug]/page.tsx` (new)

- Gallery title and date
- Responsive photo grid (CSS grid, not masonry — simpler, works well)
- Click any photo to open a lightbox overlay with caption (build a simple custom lightbox component — no external library needed for this scope)
- Navigation between photos in lightbox (prev/next via arrow keys and buttons)

### About (`/about`)

Built using the existing page builder system. Admins create a page with slug "about" and compose it using CTA and InfoSection blocks. No new code needed — just content in Sanity.

### Donate (`/donate`)

Built using the existing page builder system. Admins create a page with slug "donate". The CTA block's button links to the `donateUrl` from settings. No new code needed beyond the settings fields.

### Contact (`/contact`)

**File:** `frontend/app/contact/page.tsx` (new)

- Pulls `contactEmail` and `socialLinks` from settings
- Displays email with mailto link and social media links with icons
- Simple, clean layout — no contact form (avoids backend complexity; mailto is sufficient)

### Blog/Stories (`/posts/[slug]`)

Already exists and works. No changes needed.

## Dynamic Font Loading

**File:** `frontend/app/layout.tsx` (modify existing)

- Fetch `siteTheme` document at the layout level
- Dynamically load the selected Google Font via a `<link>` tag in `<head>` (since the font choice is dynamic from CMS, `next/font/google` static imports won't work — use a Google Fonts CSS `<link>` instead)
- Apply the heading font as a CSS variable (`--font-heading`) on `<html>`
- Tailwind config references this variable for heading styles
- Fallback to a default font if siteTheme is not published yet

## GROQ Queries

**File:** `frontend/sanity/lib/queries.ts` (modify existing)

New queries needed:

```groq
// All galleries for listing page
*[_type == "gallery"] | order(date desc) {
  title, slug, description, coverImage, date,
  "imageCount": count(images)
}

// Single gallery by slug
*[_type == "gallery" && slug.current == $slug][0] {
  title, description, date, images[] { image, caption, alt }
}

// Site theme
*[_id == "siteTheme"][0] { headingFont }

// Extended settings (add to existing query)
*[_id == "siteSettings"][0] {
  ...,
  foundationName, tagline, contactEmail, socialLinks, donateUrl, donateButtonText
}
```

## Admin Safeguards

- **Draft/Publish workflow:** All changes are drafts until explicitly published
- **Visual editing preview:** Presentation Tool (already configured) lets admins preview changes on the live site before publishing
- **Required field validation:** title, slug, and coverImage are required on galleries
- **AI-assisted alt text:** Sanity AI Assist (already installed) generates image descriptions
- **Font preview:** The Presentation Tool preview will show the selected font applied to the site before the admin publishes

## Verification Plan

1. **Schema deployment:** Run `npm run dev:studio`, verify all new document types appear in the sidebar with correct field configurations
2. **Gallery workflow:** Create a gallery, upload 3+ images with captions, publish, verify it appears on `/gallery` and `/gallery/[slug]`
3. **Font switching:** Open Site Theme, change heading font, verify the font changes in the Presentation Tool preview, publish, verify on the live frontend
4. **Settings fields:** Update foundation name, tagline, donate URL, social links — verify they render on homepage, contact page, and footer
5. **Lightbox:** Click photos in a gallery, verify lightbox opens with caption, prev/next navigation works
6. **Mobile:** Check gallery grid and lightbox work on mobile viewport
7. **About/Donate pages:** Create pages via page builder with slugs "about" and "donate", verify they render correctly
