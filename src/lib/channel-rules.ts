// 멀티채널 발행 엔진 — 마스터(키워드·핵심포인트) → 채널별 맞춤 생성.
// 채널: 네이버블로그 / 블로그스팟(구글) / 스레드 / 인스타(카드뉴스).
import { z } from 'zod';

export const KEYWORD_CATEGORIES = ['40대이상검색', '행동요구', '돈(고단가)'] as const;
export const CPC_TIERS = ['💰💰💰', '💰💰', '💰', '🔥이슈', '📅상시'] as const;
export const CHANNELS = ['naver', 'blogspot', 'threads', 'instagram'] as const;
export type Channel = (typeof CHANNELS)[number];
export const CHANNEL_LABEL: Record<Channel, string> = {
	naver: '네이버 블로그',
	blogspot: '블로그스팟(구글)',
	threads: '스레드',
	instagram: '인스타(카드뉴스)',
};

// ── 1단계: 마스터(공통 재료) ──────────────────────────────
export const MasterSchema = z.object({
	primaryKeyword: z.string(),
	recommendedKeywords: z
		.array(
			z.object({
				keyword: z.string(),
				category: z.enum(KEYWORD_CATEGORIES),
				cpcTier: z.enum(CPC_TIERS),
				reason: z.string(),
			}),
		)
		.describe('고CPC 키워드 후보 5~8개'),
	keyPoints: z.array(z.string()).describe('이 주제의 핵심 포인트 5~8개 — 모든 채널 글의 공통 재료'),
	angle: z.string().describe('글의 관점/후크 한 줄'),
});
export type Master = z.infer<typeof MasterSchema>;

export const MASTER_SHAPE = `{
  "primaryKeyword": "문자열",
  "recommendedKeywords": [ { "keyword": "...", "category": "40대이상검색|행동요구|돈(고단가)", "cpcTier": "💰💰💰|💰💰|💰|🔥이슈|📅상시", "reason": "..." } ],
  "keyPoints": ["핵심 포인트 5~8개"],
  "angle": "관점/후크 한 줄"
}`;

export const MASTER_SYSTEM = `너는 한국어 고CPC 키워드 리서처이자 콘텐츠 기획자다(광고수익형 블로그). 주제어 또는 키워드를 받으면 '모든 채널 글의 공통 재료'를 만든다.
- recommendedKeywords: 돈 되는 키워드 5~8개. 3분류 태깅(①40대이상검색 ②행동요구: 신청·가입·구매·조회 방법 ③돈: 보험·대출·세금·주식). CPC 등급(💰💰💰 초고단가 ~ 💰, 🔥이슈, 📅상시). reason은 왜 단가가 높/꾸준한지 한 줄.
- primaryKeyword: 그중 가장 돈이 되는 1개.
- keyPoints: 이 주제로 글을 쓸 때 들어갈 핵심 포인트 5~8개(채널마다 재사용할 공통 사실/논점).
- angle: 독자의 클릭을 부르는 관점/후크 한 줄.
가드: 사실·수치·통계를 임의로 지어내지 마라. 확인 필요한 값은 '(확인 필요)'로. 과장 수익 주장 금지. 한국어. 출력은 JSON 스키마만.`;

// ── 2단계: 채널별 맞춤 ────────────────────────────────────
export const ChannelSchema = z.object({
	keywordFocus: z.string().describe('이 채널에서 노릴 키워드 각도(채널마다 다르게)'),
	title: z.string(),
	body: z.string(),
	hashtags: z.array(z.string()).describe('해시태그(네이버·인스타는 많이, 나머지는 빈 배열 가능)'),
	thumbnail: z
		.object({ headline: z.string(), sub: z.string() })
		.describe('텍스트 썸네일/표지/히어로 이미지에 얹을 문구'),
	photoSlots: z.array(z.string()).describe('본문에 넣을 실사 사진 자리 설명(없으면 빈 배열)'),
	cards: z.array(z.object({ heading: z.string(), body: z.string() })).describe('인스타 카드뉴스 6~8장(없으면 빈 배열)'),
});
export type ChannelOut = z.infer<typeof ChannelSchema>;

export const CHANNEL_SHAPE = `{
  "keywordFocus": "이 채널용 키워드 각도",
  "title": "제목",
  "body": "본문",
  "hashtags": ["..."],
  "thumbnail": { "headline": "썸네일 큰 문구", "sub": "보조 문구" },
  "photoSlots": ["실사 사진 자리 설명들 (없으면 빈 배열)"],
  "cards": [ { "heading": "카드 제목", "body": "카드 내용(짧게)" } ]
}`;

const GUARD = `가드: 같은 사실을 채널마다 다른 표현으로(중복 콘텐츠 회피). 수치·사실 날조 금지(확인 필요는 '(확인 필요)'). 광고 과장·클릭유도("여기 꼭 눌러주세요")·약관위반 문구 금지. 보험·대출·세금 등 YMYL은 '정확한 내용은 공식 채널 확인이 필요합니다' 취지 한 줄. 한국어. 출력은 JSON 스키마만.`;

const CHANNEL_RULES: Record<Channel, string> = {
	naver: `[네이버 블로그] 검색·후기 채널.
- keywordFocus: 네이버 연관검색어/검색 의도형.
- title: 질문·후기형(궁금증 유발).
- body: 해요체(~했어요/~거든요/~더라고요). 이모지 절제(😭😅🙏👇👉 섹션당 최대 1). 소제목은 **진한 글씨**. 소제목 바로 아래 사진 자리를 "> 📷 [사진: 무엇을 찍을지]"로. 문단 짧게+줄바꿈 넉넉히. 1,000자 이상.
- hashtags: 10개(# 없이 단어만).
- thumbnail: 대표 사진 위에 얹을 한 줄 카피(사장님이 실사 사진을 대표 썸네일로 쓸 것).
- photoSlots: 2~3개(외관/핵심/마무리 등 무엇을 찍어 넣을지).
- cards: 빈 배열.`,
	blogspot: `[블로그스팟(구글)] SEO·정보 채널(애드센스).
- keywordFocus: 구글 SEO 정보 키워드.
- title: SEO 제목(키워드 앞배치 + 숫자 + 궁금증).
- body: 정중체(~습니다). 결론 먼저. 마크다운 ## H2 / ### H3 소제목, 표·리스트, FAQ 1개, 마무리. primaryKeyword를 제목·첫문단·소제목·마무리에 반복. 1,500자 이상. (확인 필요한 수치 옆 "(출처: ___)" 자리)
- hashtags: 빈 배열.
- thumbnail: 히어로 썸네일용 headline + sub(텍스트형으로 우리가 이미지 생성).
- photoSlots: 1~2개.
- cards: 빈 배열.`,
	threads: `[스레드] 짧은 멀티포스트·유입 채널.
- keywordFocus: 트렌드/이슈 훅.
- title: 첫 포스트 훅 한 줄(시선 멈추게).
- body: 3~5개의 짧은 포스트를 빈 줄로 구분(각 1~2문장, 1/n 흐름). 마지막 줄에 "👉 자세히는 블로그에서 (링크)" 유입 자리. 전체가 길지 않게.
- hashtags: 2~4개.
- thumbnail: 1장 텍스트 이미지용 headline + sub.
- photoSlots: 빈 배열.
- cards: 빈 배열.`,
	instagram: `[인스타그램] 카드뉴스 채널.
- keywordFocus: 탐색/해시태그형 키워드.
- title: 카드뉴스 표지 문구(강한 한 줄).
- body: 캡션 — 첫 줄 훅 + 줄바꿈 리듬 + 저장 유도 CTA.
- hashtags: 15~20개.
- thumbnail: 표지 카드용 headline + sub.
- photoSlots: 빈 배열.
- cards: 6~8장. 각 card는 heading(카드 제목)과 body(2~3문장, 카드에 들어갈 짧은 텍스트). 1장=표지, 마지막=정리/CTA.`,
};

export function channelSystem(channel: Channel): string {
	return `너는 '${CHANNEL_LABEL[channel]}' 채널 전담 작가다. 아래 '마스터(키워드·핵심포인트·관점)'를 받아 이 채널 규칙대로 맞춤 글과 이미지 문구를 만든다.

${CHANNEL_RULES[channel]}

${GUARD}`;
}
