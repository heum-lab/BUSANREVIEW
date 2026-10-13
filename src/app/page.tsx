import type { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CampaignTypes } from '@/components/landing/CampaignTypes';
import { Metrics } from '@/components/landing/Metrics';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { PRIMARY_KEYWORDS, SITE_ALT_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_TAGLINE} | ${SITE_ALT_NAME}`,
  description: SITE_DESCRIPTION,
  keywords: [...PRIMARY_KEYWORDS],
  alternates: { canonical: '/' },
  openGraph: {
    title: `${SITE_TAGLINE} | ${SITE_ALT_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
    locale: 'ko_KR',
  },
};

const SERVICE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GOOD TO GREAT 리뷰체험단 마케팅',
  serviceType: '리뷰체험단·가구매·상위노출 마케팅',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: { '@type': 'Country', name: '대한민국' },
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
  mainEntity: [
    {
      '@type': 'Question',
      name: '가구매와 리뷰체험단은 어떻게 다른가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '가구매는 실제 구매가 일어나는 형태로, 구매 후 구매확정과 구매평 작성까지 진행되며 제품비를 페이백 받습니다. 리뷰체험단은 제품 또는 비용을 제공받아 리뷰만 작성하는 방식입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '쿠팡 상위노출과 스마트스토어 상위노출도 가능한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 쿠팡과 스마트스토어 모두 가구매·구매평 캠페인을 통한 상위노출 작업이 가능합니다. 전담 매니저가 키워드 전략을 함께 설계합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '단가는 어떻게 산정되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '건당 1,000원 ~ 10,000원 범위에서 구매 플랫폼과 리뷰어 컨디션에 따라 차등 적용됩니다. VAT는 별도입니다.',
      },
    },
  ],
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
        <CTA />
      </main>
      <Footer />
    </>
  );
}
