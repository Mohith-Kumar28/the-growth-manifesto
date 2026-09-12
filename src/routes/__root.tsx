import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { BookACall } from '#/components/growth/book-a-call'
import { SITE_NAME, SITE_URL, TAGLINE, absolute, ldScript } from '#/lib/seo'
import appCss from '../styles.css?url'

const DESCRIPTION =
  'We engineer growth systems for AI and SaaS startups — Reddit, TikTok Shop, influencer and ProductHunt distribution that compounds into revenue.'

/* Organization + WebSite. Rendered by the router as application/ld+json so it
   stays in sync with the route that owns it, and so per-page structured data
   can be added the same way. */
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: TAGLINE,
  url: SITE_URL,
  description: DESCRIPTION,
  logo: {
    '@type': 'ImageObject',
    url: absolute('/icon-512.png'),
    width: 512,
    height: 512,
  },
  foundingDate: '2026',
  knowsAbout: [
    'Growth engineering',
    'Go-to-market strategy',
    'Distribution channels',
    'Reddit marketing',
    'TikTok Shop',
    'Influencer marketing',
    'Product Hunt launches',
  ],
  // Fill these in once the footer's social links are live.
  // sameAs: ['https://x.com/...', 'https://www.linkedin.com/company/...'],
}

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: 'en-US',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Fallbacks — every route below overrides these with its own copy.
      { title: `${SITE_NAME} — ${TAGLINE}` },
      { name: 'description', content: DESCRIPTION },
      {
        name: 'keywords',
        content:
          'growth engineering, startup growth, growth systems, AI growth, go-to-market, distribution, demand generation, TikTok Shop, Reddit marketing, influencer marketing',
      },
      { name: 'author', content: SITE_NAME },
      { name: 'publisher', content: SITE_NAME },
      { name: 'application-name', content: SITE_NAME },
      { name: 'apple-mobile-web-app-title', content: SITE_NAME },
      // max-image-preview:large is what lets Google show the OG card in SERPs.
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'theme-color', content: '#1c1710' },
      { name: 'color-scheme', content: 'light' },
      // Stops iOS Safari turning the stat figures into tel: links.
      { name: 'format-detection', content: 'telephone=no' },
    ],
    scripts: [ldScript(ORGANIZATION), ldScript(WEBSITE)],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // The masthead nameplate is above the fold on every route.
      {
        rel: 'preload',
        href: '/fonts/chomsky.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/caslon-ionic.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <BookACall />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
