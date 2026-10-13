import type { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CampaignTypes } from '@/components/landing/CampaignTypes';
import { Metrics } from '@/components/landing/Metrics';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { FAQ } from '@/components/landing/FAQ';
import { FAQ_ITEMS } from '@/constants/FAQ';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${SITE_NAME} 블로그 RSS` }],
    },
  },
};

const SERVICE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GOOD TO GREAT 리뷰체험단 마케팅',
  serviceType: '리뷰체험단·가구매·상위노출 마케팅',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: [
    { '@type': 'City', name: '부산광역시' },
    { '@type': 'Country', name: '대한민국' },
  ],
  description:
    '쿠팡, 스마트스토어 등 주요 커머스 플랫폼의 가구매·구매평·상위노출·체험단을 한 번에 운영합니다.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'KRW',
    lowPrice: '1000',
    highPrice: '10000',
    offerCount: '7',
  },
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function HomePage(): JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify([SERVICE_JSONLD, FAQ_JSONLD]) }}
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <CampaignTypes />
        <Metrics />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
