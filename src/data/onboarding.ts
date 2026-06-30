// 1:1 맞춤 온보딩 — 시작 단계를 묻고, 그에 맞춰 대시보드/추천을 설계하고 진화시킨다.

export type Stage = 'none' | 'created' | 'seeding' | 'pending' | 'approved' | 'running';
export type Goal = '광고수익' | '제품홍보' | '둘다';
export type ChannelId = 'naver' | 'blogspot' | 'threads' | 'instagram';

export interface Profile {
	name?: string;
	stage: Stage;
	goal: Goal;
	channels: ChannelId[];
	niche?: string; // 주력 주제 분야
	createdAt?: string;
}

export const STAGES: { id: Stage; label: string; desc: string }[] = [
	{ id: 'none', label: '아직 블로그가 없어요', desc: '채널 개설부터 시작' },
	{ id: 'created', label: '개설은 했는데 글이 없어요', desc: '승인용 글 채우기' },
	{ id: 'seeding', label: '승인용 글을 쌓는 중', desc: '12~20개 목표' },
	{ id: 'pending', label: '광고 승인 신청/대기 중', desc: '승인 기다리며 글 추가' },
	{ id: 'approved', label: '승인됐어요! 수익화 시작', desc: '본격 발행' },
	{ id: 'running', label: '운영 중 — 더 키우고 싶어요', desc: '최적화·확장' },
];

export const NICHES = ['금융·재테크', '정부지원·복지', '건강·의료', '자동차', '교육·취업', '생활·이슈', '여행', '자사 제품 홍보'];

// 단계별 '지금 집중할 것' — 대시보드 개인화 + 진화
export interface StagePlan {
	headline: string;
	focus: string;
	primaryCta: { label: string; href: string };
	startPhase: string; // /start 에서 강조할 phase 키
	nextMilestone: string;
}

export function stagePlan(p: Profile): StagePlan {
	switch (p.stage) {
		case 'none':
			return { headline: '먼저 수익을 받을 그릇(채널)을 만들어요', focus: '네이버 블로그 개설 + 실명인증부터. 블로그스팟은 병행.', primaryCta: { label: '채널 개설 가이드', href: '/start' }, startPhase: 'setup', nextMilestone: '블로그 개설 완료' };
		case 'created':
			return { headline: '승인용 글을 채울 시간이에요', focus: '고CPC 키워드로 12~20개를 차근차근. 생성기로 빠르게.', primaryCta: { label: '글 생성하기', href: '/tools/generate' }, startPhase: 'daily', nextMilestone: '승인용 글 12개' };
		case 'seeding':
			return { headline: '승인 신청까지 한 걸음', focus: '글 수를 채우고 필수 페이지(소개·개인정보·문의)를 준비.', primaryCta: { label: '승인 체크리스트', href: '/approval' }, startPhase: 'setup', nextMilestone: '애드포스트/애드센스 신청' };
		case 'pending':
			return { headline: '승인 대기 중 — 멈추지 말고 글을 쌓아요', focus: '대기 중에도 고CPC 글을 계속 발행하면 승인·노출에 유리.', primaryCta: { label: '글 생성하기', href: '/tools/generate' }, startPhase: 'daily', nextMilestone: '승인 완료' };
		case 'approved':
			return { headline: '이제 돈이 흐르게 — 매일 발행 루프', focus: '오늘의 시즌 키워드로 채널별 글을 뽑아 발행.', primaryCta: { label: '오늘의 글 생성', href: '/tools/generate' }, startPhase: 'daily', nextMilestone: '첫 정산(애드포스트 5만원)' };
		case 'running':
			return { headline: '최적화·확장 단계', focus: '성과 좋은 글 재활용 + 채널/키워드 확장. 시즌 선점 발행.', primaryCta: { label: '시즌 키워드 보기', href: '/keywords' }, startPhase: 'weekly', nextMilestone: '안정적 월 수익' };
	}
}

export const PROFILE_KEY = 'studio-profile-v1';
