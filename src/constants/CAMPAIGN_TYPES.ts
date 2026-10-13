export enum CampaignType {
  PAYBACK_REVIEW = 'PAYBACK_REVIEW',
  PURCHASE_REVIEW = 'PURCHASE_REVIEW',
  PRODUCT_PROVIDE = 'PRODUCT_PROVIDE',
  VISIT = 'VISIT',
  PRESS = 'PRESS',
  MISSION = 'MISSION',
}

export interface CampaignTypeInfo {
  type: CampaignType;
  title: string;
  process: string;
  platforms: string;
}

export const CAMPAIGN_TYPES: CampaignTypeInfo[] = [
  {
    type: CampaignType.PAYBACK_REVIEW,
    title: '페이백 + 구매평(기타배송)',
    process: '선구매 → 기타배송 + 구매처 구매확정 구매평 작성 제품비페이백',
    platforms: '스마트스토어, 쿠팡 외 다수플랫폼 가능',
  },
  {
    type: CampaignType.PURCHASE_REVIEW,
    title: '구매평(기타배송)',
    process: '선구매 → 기타배송 + 구매처 구매확정 구매평 작성',
    platforms: '스마트스토어, 쿠팡 외 다수플랫폼 가능',
  },
  {
    type: CampaignType.PRODUCT_PROVIDE,
    title: '페이백 + 구매평(제공형)',
    process: '선구매 → 제품배송 + 구매처 구매확정 구매평 작성 제품비페이백',
    platforms: '스마트스토어, 쿠팡 외 다수플랫폼 가능',
  },
  {
    type: CampaignType.VISIT,
    title: '구매평(제공형)',
    process: '선구매 → 제품배송 + 구매처 구매확정 구매평 작성',
    platforms: '스마트스토어, 쿠팡 외 다수플랫폼 가능',
  },
  {
    type: CampaignType.PRESS,
    title: '쿠팡 대량작업',
    process: '페이백 + 구매평(기타배송) 형태로 대량 작업',
    platforms: '쿠팡',
  },
  {
    type: CampaignType.MISSION,
    title: '기타작업',
    process: '리뷰 체험단 외 후기 댓글 감상평등 다양하게 진행 가능',
    platforms: '전체 플랫폼',
  },
];
