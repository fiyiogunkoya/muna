import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  foundationName,
  tagline,
  contactEmail,
  socialLinks[] {
    _key,
    platform,
    url
  },
  donateUrl,
  donateButtonText,
  missionStatement,
  heroImage{..., asset->, "alt": coalesce(alt, asset->altText, "")},
  heroQuote,
  stickyDonateEnabled,
  stickyDonateMessage,
  newsletterEnabled,
  newsletterUrl,
  newsletterCtaText
}`)

// ---------------------------------------------------------------------------
// Shared fragments for the foundation content model.
// ---------------------------------------------------------------------------

const imageFields = /* groq */ `
  ...,
  asset->,
  "alt": coalesce(alt, asset->altText, "")
`

const programCardFields = /* groq */ `
  _id, _type, "slug": slug.current, title, tagline, summary, accentColor, icon,
  "coverImage": coverImage{${imageFields}}
`

const storyCardFields = /* groq */ `
  _id, _type, "slug": slug.current, title, excerpt, location, date,
  "program": program->{_id, title, "slug": slug.current},
  "heroImage": heroImage{${imageFields}}
`

const metricFields = /* groq */ `
  _id, _type, label, value, prefix, suffix, description, icon, category, asOfDate, source
`

const testimonialFields = /* groq */ `
  _id, _type, quote, attributionName, attributionRole,
  "attributionImage": attributionImage{${imageFields}}
`

const partnerFields = /* groq */ `
  _id, _type, name, url, tier, order,
  "logo": logo{${imageFields}}
`

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "programGrid" => {
        ...,
        "programs": programs[]->{${programCardFields}}
      },
      _type == "impactMetricsRow" => {
        ...,
        "metrics": metrics[]->{${metricFields}}
      },
      _type == "storyCarousel" => {
        ...,
        "stories": stories[]->{${storyCardFields}}
      },
      _type == "partnerLogos" => {
        ...,
        "partners": partners[]->{${partnerFields}}
      },
      _type == "testimonialBlock" => {
        ...,
        "testimonials": testimonials[]->{${testimonialFields}}
      },
      _type == "donateBanner" => {
        ...,
        "image": image{${imageFields}},
        "resolvedDonateUrl": select(
          useSettingsUrl == true => *[_type == "settings"][0].donateUrl,
          overrideUrl
        )
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const galleryListingQuery = defineQuery(`
  *[_type == "gallery" && defined(slug.current)] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    date,
    "imageCount": count(images)
  }
`)

export const galleryBySlugQuery = defineQuery(`
  *[_type == "gallery" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    date,
    images[] {
      _key,
      image {
        ...,
        asset->
      },
      caption,
      "alt": image.alt
    },
    "relatedStory": *[_type == "story" && references(^._id)][0] {
      _id, title, "slug": slug.current
    }
  }
`)

export const gallerySlugsQuery = defineQuery(`
  *[_type == "gallery" && defined(slug.current)]
  {"slug": slug.current}
`)

export const siteThemeQuery = defineQuery(`
  *[_type == "siteTheme"][0] {
    headingFont,
    "colorPrimary": colorPrimary.hex,
    "colorAccent": colorAccent.hex,
    "colorInk": colorInk.hex,
    "colorSurface": colorSurface.hex
  }
`)

// ---------------------------------------------------------------------------
// Foundation content queries.
// ---------------------------------------------------------------------------

export const homepageQuery = defineQuery(`{
  "settings": *[_type == "settings"][0]{
    foundationName, tagline, donateUrl, donateButtonText,
    heroQuote, missionStatement,
    "heroImage": heroImage{${imageFields}}
  },
  "featuredPrograms": *[_type == "program" && featured == true]
    | order(order asc, _createdAt asc) [0...3] { ${programCardFields} },
  "featuredStory": *[_type == "story" && featured == true]
    | order(date desc) [0] { ${storyCardFields} },
  "moreStories": *[_type == "story" && featured == true]
    | order(date desc) [1...4] { ${storyCardFields} },
  "metrics": *[_type == "impactMetric"]
    | order(_createdAt asc) [0...4] { ${metricFields} },
  "featuredTestimonial": *[_type == "testimonial" && featured == true]
    | order(_createdAt desc) [0] { ${testimonialFields} },
  "partners": *[_type == "partner"]
    | order(order asc, _createdAt asc) { ${partnerFields} },
  "activeCampaign": *[_type == "campaign" && active == true && featured == true]
    | order(startDate desc) [0] {
      _id, title, "slug": slug.current, tagline,
      "heroImage": heroImage{${imageFields}},
      donateUrl, goalAmount, currentAmount
    }
}`)

export const allProgramsQuery = defineQuery(`
  *[_type == "program"] | order(order asc, _createdAt asc) {
    ${programCardFields}
  }
`)

export const programBySlugQuery = defineQuery(`
  *[_type == "program" && slug.current == $slug][0] {
    _id, _type, title, "slug": slug.current, tagline, summary, accentColor, icon,
    "coverImage": coverImage{${imageFields}},
    body[]{
      ...,
      markDefs[]{..., ${linkReference}}
    },
    "impactMetrics": impactMetrics[]->{ ${metricFields} },
    "relatedStories": relatedStories[]->{ ${storyCardFields} },
    "relatedGallery": relatedGallery->{
      _id, title, "slug": slug.current,
      "coverImage": coverImage{${imageFields}}
    },
    seo
  }
`)

export const programSlugsQuery = defineQuery(`
  *[_type == "program" && defined(slug.current)] {"slug": slug.current}
`)

export const allStoriesQuery = defineQuery(`
  *[_type == "story" && defined(slug.current)] | order(date desc) {
    ${storyCardFields},
    "programSlug": program->slug.current
  }
`)

export const programSlugsForFilterQuery = defineQuery(`
  *[_type == "program" && defined(slug.current)] | order(order asc, _createdAt asc) {
    _id, title, "slug": slug.current
  }
`)

export const storyBySlugQuery = defineQuery(`
  *[_type == "story" && slug.current == $slug][0] {
    _id, _type, title, "slug": slug.current, excerpt, location, date, heroQuote,
    "heroImage": heroImage{${imageFields}},
    "program": program->{_id, title, "slug": slug.current},
    challenge, approach, impact,
    body[]{
      ...,
      markDefs[]{..., ${linkReference}}
    },
    pullQuotes[]{_key, quote, attribution, role},
    "featuredMetrics": featuredMetrics[]->{ ${metricFields} },
    "gallery": gallery->{
      _id, title, "slug": slug.current,
      "images": images[0...6]{
        _key,
        "src": image.asset->url,
        "alt": image.alt,
        caption
      }
    },
    "relatedStories": relatedStories[]->{ ${storyCardFields} },
    seo
  }
`)

export const storySlugsQuery = defineQuery(`
  *[_type == "story" && defined(slug.current)] {"slug": slug.current}
`)

export const impactPageQuery = defineQuery(`{
  "metrics": *[_type == "impactMetric"] | order(category asc, _createdAt asc) { ${metricFields} },
  "stories": *[_type == "story"] | order(date desc) [0...6] { ${storyCardFields} },
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc) [0...3] { ${testimonialFields} },
  "settings": *[_type == "settings"][0]{
    heroQuote, missionStatement, donateUrl, donateButtonText
  }
}`)

export const aboutPageQuery = defineQuery(`{
  "settings": *[_type == "settings"][0]{
    foundationName, tagline, missionStatement, visionStatement,
    philosophy, differentiators,
    "heroImage": heroImage{${imageFields}},
    donateUrl, donateButtonText
  },
  "team": *[_type == "person"] | order(_createdAt asc) {
    _id, firstName, lastName, role, bio,
    "picture": picture{${imageFields}}
  },
  "partners": *[_type == "partner"] | order(order asc, _createdAt asc) { ${partnerFields} }
}`)

export const getInvolvedQuery = defineQuery(`{
  "settings": *[_type == "settings"][0]{
    donateUrl, donateButtonText, contactEmail,
    socialLinks[]{_key, platform, url},
    newsletterEnabled, newsletterUrl, newsletterCtaText,
    foundationName, tagline
  },
  "activeCampaigns": *[_type == "campaign" && active == true] | order(startDate desc) {
    _id, title, "slug": slug.current, tagline,
    "heroImage": heroImage{${imageFields}},
    donateUrl, goalAmount, currentAmount
  }
}`)

export const galleryRelatedStoryQuery = defineQuery(`
  *[_type == "story" && references($galleryId)][0] {
    _id, title, "slug": slug.current
  }
`)
