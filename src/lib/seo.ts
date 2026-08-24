/**
 * Per-route document head: title, description, Open Graph, Twitter cards,
 * canonical URL and JSON-LD. Every page gets its own OG card under
 * /assets/og — social scrapers only follow absolute URLs, so paths are
 * resolved against SITE_URL.
 */

/** Change this (and public/sitemap.xml + robots.txt) when the domain moves. */
export const SITE_URL =
  'https://the-growth-manifesto.mohithkumar808.workers.dev'
export const SITE_NAME = 'The Growth Manifesto'
export const TAGLINE = 'Growth Intelligence for Ambitious Operators'

export const absolute = (path: string) =>
  path.startsWith('http') ? path : `${SITE_URL}${path}`

/** A structured-data block for a route's `head().scripts`. */
export const ldScript = (data: unknown) => ({
  type: 'application/ld+json',
  // Escaping '<' keeps a stray "</script>" inside the data from closing the tag.
  children: JSON.stringify(data).replace(/</g, '\\u003c'),
})

/** Two-level BreadcrumbList for a child page — gives Google the site trail. */
export const breadcrumb = (name: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
    { '@type': 'ListItem', position: 2, name, item: absolute(path) },
  ],
})

type SeoOptions = {
  /** Full <title>. Keep it under ~60 characters so Google doesn't truncate. */
  title: string
  /** ~150 characters. Written for a human scanning a result, not a crawler. */
  description: string
  /** Route path, e.g. '/confessions'. Becomes og:url and rel=canonical. */
  path: string
  /** OG card for this page. Defaults to the homepage card. */
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  /** Extra schema.org objects to emit alongside the page. */
  jsonLd?: Array<unknown>
}

export function seo({
  title,
  description,
  path,
  image = '/assets/og/og-home.jpg',
  imageAlt = `${SITE_NAME} — ${TAGLINE}`,
  type = 'website',
  jsonLd = [],
}: SeoOptions) {
  const url = absolute(path)
  const img = absolute(image)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      // Open Graph — Facebook, LinkedIn, Slack, WhatsApp, iMessage.
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image', content: img },
      { property: 'og:image:secure_url', content: img },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: imageAlt },
      // Twitter / X.
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: img },
      { name: 'twitter:image:alt', content: imageAlt },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: jsonLd.map(ldScript),
  }
}
