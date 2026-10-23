import type { Metadata } from 'next';
import {
  PRIMARY_KEYWORDS,
  SITE_ALT_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/lib/seo';
import { KakaoConsult } from '@/components/common/KakaoConsult';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TAGLINE} ${SITE_ALT_NAME}`,
    template: `%s | ${SITE_ALT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...PRIMARY_KEYWORDS],
  applicationName: SITE_NAME,
  generator: 'Next.js',
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Marketing',
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${SITE_NAME} 블로그 RSS` }],
    },
  },
  icons: {
    icon: '/brand/logo-dark.png',
    apple: '/brand/logo-dark.png',
  },
  openGraph: {
    title: `${SITE_TAGLINE} ${SITE_ALT_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/brand/logo-dark.png',
        width: 620,
        height: 620,
        alt: `${SITE_NAME} 로고`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `${SITE_TAGLINE} ${SITE_ALT_NAME}`,
    description: SITE_DESCRIPTION,
    images: ['/brand/logo-dark.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    // 추후 발급 받은 코드로 채워 주세요.
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      'yNCpnFaESv57HZP7TpqZGR0gJzBz9uqo0ZacRwQO9e8',
    other: {
      'naver-site-verification':
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ??
        '941abcd897c680cd7ecd1e9600c0b3eb79a878b2',
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: `${SITE_NAME} 부산지사`,
  alternateName: SITE_ALT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-dark.png`,
  image: `${SITE_URL}/brand/logo-dark.png`,
  description: SITE_DESCRIPTION,
  email: 'g2g2024@naver.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '센텀동로 71, 10층 1009호(우동, 벽산이센텀클래스원2차)',
    addressLocality: '해운대구',
    addressRegion: '부산광역시',
    addressCountry: 'KR',
  },
  taxID: '762-43-00973',
  areaServed: [
    { '@type': 'City', name: '부산광역시' },
    { '@type': 'Country', name: '대한민국' },
  ],
  openingHours: 'Mo-Fr 10:00-18:00',
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  url: SITE_URL,
  inLanguage: 'ko-KR',
  publisher: { '@id': `${SITE_URL}/#organization` },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([ORGANIZATION_JSONLD, WEBSITE_JSONLD]),
          }}
        />
        {children}
        <KakaoConsult />
      </body>
    </html>
  );
}
