export interface MetricItem {
  label: string;
  value: string;
  suffix?: string;
  caption?: string;
}

export const METRICS: MetricItem[] = [
  { label: '누적 회원 수', value: '3,000', suffix: '명', caption: '리뷰어' },
  { label: '캠페인수', value: '200', suffix: '개/일', caption: '모든플랫폼' },
  { label: '누적 매출', value: '100', suffix: '억/연', caption: '캠페인매출' },
  { label: '월누적리뷰수', value: '30,000', suffix: '건', caption: '체험단 리뷰 수' },
];
