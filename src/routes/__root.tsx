import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

const SITE_URL = 'https://the-growth-manifesto.mohithkumar808.workers.dev'
const TITLE = 'The Growth Manifesto — Growth Intelligence for Ambitious Operators'
const DESCRIPTION =
  'We engineer growth systems for startups that refuse to wait. Not hacks, not campaigns — tested, compounding systems that turn traction into revenue.'
const OG_IMAGE = `${SITE_URL}/assets/growth/hero.webp`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      {
        name: 'keywords',
        content:
          'growth engineering, startup growth, growth systems, AI growth, go-to-market, distribution, demand generation',
      },
      { name: 'author', content: 'The Growth Manifesto' },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#1c1710' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'The Growth Manifesto' },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: OG_IMAGE },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: SITE_URL },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Growth Manifesto',
  url: SITE_URL,
  description: DESCRIPTION,
  logo: `${SITE_URL}/assets/growth/tgm-logo.svg`,
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        {children}
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
