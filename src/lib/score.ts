// 돈 되는 키워드 판별 엔진 — 자료(CPC 등급표·고단가 카테고리·행동요구어)를 결정적 로직으로 코드화.
// LLM 없이 즉시 채점: 실시간 트렌드/자동완성 키워드에 등급·이유·예상단가를 부여한다.
import { CALENDAR, EVERGREEN, GOLDEN, type Tier } from '../data/keywords';

export interface Scored {
	kw: string;
	tier: Tier;
	score: number; // 0~100 수익 잠재력
	category: string;
	reason: string;
	cpcRange: string; // 등급 기반 추정 범위(자료 범례)
	seasonal?: string; // 이번 달 시즌 부스트 사유
}

// 고단가 카테고리 패턴 (자료: 보험·금융·법률·대출·세금·의료 = 💰💰💰)
const CATS: { name: string; re: RegExp; base: number; tier: Tier }[] = [
	{ name: '보험', re: /(보험|실손|실비|암보험|운전자보험|치아보험|태아보험|간병)/, base: 88, tier: '💰💰💰' },
	{ name: '대출·금융', re: /(대출|주담대|주택담보|전세자금|카드론|대환|리볼빙|금리|신용점수|신용카드|카드\s*추천|연체)/, base: 86, tier: '💰💰💰' },
	{ name: '법률', re: /(개인회생|파산|상속|이혼|소송|변호사|위자료|형사|합의금)/, base: 90, tier: '💰💰💰' },
	{ name: '세금', re: /(연말정산|종합소득세|종소세|세액공제|절세|환급|양도세|증여세|부가세|원천징수)/, base: 85, tier: '💰💰💰' },
	{ name: '의료·시술', re: /(임플란트|치아교정|교정\s*비용|피부과|레이저|탈모|다이어트\s*약|한약|도수치료|라식|라섹|내시경|건강검진)/, base: 84, tier: '💰💰💰' },
	{ name: '투자·연금', re: /(ISA|IRP|연금저축|퇴직연금|ETF|배당|공모주|국민연금)/, base: 82, tier: '💰💰💰' },
	{ name: '부동산', re: /(전세|월세|청약|분양|DSR|LTV|중개수수료|등기|재개발)/, base: 78, tier: '💰💰' },
	{ name: '정부지원', re: /(지원금|보조금|장려금|급여|수당|바우처|감면|정부24|보조금24|복지)/, base: 74, tier: '💰💰' },
	{ name: '교육·취업', re: /(학원|자격증|수강료|국비지원|실업급여|공무원|재수|인강)/, base: 70, tier: '💰💰' },
	{ name: '자동차', re: /(중고차|렌트카|장기렌트|자동차세|취득세|과태료|리스)/, base: 72, tier: '💰💰' },
	{ name: 'IT·호스팅', re: /(호스팅|도메인|워드프레스|VPN|백업|서버)/, base: 68, tier: '💰💰' },
];

// 행동요구어 (자료: 신청방법·가격·조회… = 광고 클릭 직전 검색 의도)
const ACTION = /(신청|가입|조회|계산|비용|가격|방법|비교|후기|조건|환급|해지|다시보기|바로가기|총정리|기간|자격|견적|발급|예약)/;
// 트래픽·이슈형
const TRAFFIC = /(일정|명소|시간표|인사말|모음|순위|추천|무료|결과|프로필|나이|재방송)/;

const CPC_BY_TIER: Record<string, string> = {
	'💰💰💰': '클릭당 3,000원↑',
	'💰💰': '클릭당 1,500~3,000원',
	'💰': '클릭당 500~1,500원',
	'🔥': '단가 변동(트래픽 폭발)',
	'📅': '연중 안정',
};

export function scoreKeyword(kw: string, month?: number): Scored {
	const m = month ?? new Date().getMonth() + 1;
	let best: { name: string; base: number; tier: Tier } | null = null;
	for (const c of CATS) if (c.re.test(kw)) { best = c; break; }

	let score = best ? best.base : 40;
	let tier: Tier = best ? best.tier : '💰';
	let category = best?.name ?? '일반';
	const reasons: string[] = [];
	if (best) reasons.push(`${best.name} = 고단가 광고 카테고리`);

	if (ACTION.test(kw)) { score += 8; reasons.push('행동요구형(클릭 직전 의도)'); }
	if (TRAFFIC.test(kw) && !best) { score += 10; tier = '🔥'; category = '트래픽·이슈'; reasons.push('검색량 폭발형'); }

	// 이번 달 시즌 부스트 (12개월 캘린더 매칭)
	const mp = CALENDAR.find((c) => c.month === m);
	let seasonal: string | undefined;
	if (mp) {
		const hit = mp.keywords.find((k) => kw.includes(k.kw.replace(/\s?2026|\s?2027/g, '').slice(0, 4)) || k.kw.includes(kw.slice(0, 4)));
		const themeHit = mp.theme.split('·').some((t) => kw.includes(t.trim().slice(0, 2)));
		if (hit || themeHit) { score += 7; seasonal = `${m}월 시즌(${mp.theme}) 수요 구간`; reasons.push(seasonal); }
	}

	score = Math.min(100, score);
	if (!reasons.length) reasons.push('일반 정보성 — 단가 낮음, 트래픽으로 승부');
	return { kw, tier, score, category, reason: reasons.join(' · '), cpcRange: CPC_BY_TIER[tier], seasonal };
}

export function scoreMany(kws: string[], month?: number): Scored[] {
	const seen = new Set<string>();
	return kws
		.map((k) => k.trim())
		.filter((k) => k && !seen.has(k) && (seen.add(k), true))
		.map((k) => scoreKeyword(k, month))
		.sort((a, b) => b.score - a.score);
}

// 시리즈(내부링크) 추천 — 같은 카테고리의 시드 키워드에서 후속글 후보를 꺼낸다.
// 내부링크 순환 = 체류시간·PV 증가 = 수익 구조의 핵심.
export function clusterSuggest(kw: string, limit = 3): string[] {
	const s = scoreKeyword(kw);
	const pool: string[] = [];
	for (const g of EVERGREEN) for (const k of g.items) pool.push(k.kw);
	for (const g of GOLDEN) for (const k of g.items) pool.push(k);
	for (const c of CALENDAR) for (const k of c.keywords) pool.push(k.kw);
	const related = pool.filter((p) => p !== kw && scoreKeyword(p).category === s.category);
	// 중복 제거 후 상위
	return [...new Set(related)].slice(0, limit);
}

// 1,000뷰당 예상 수익(자료 범례 기반 범위 — 단정 금지, 범위로만)
export function revenuePer1000(tier: Tier): string {
	const table: Record<string, [number, number]> = {
		'💰💰💰': [3000, 9000],
		'💰💰': [1500, 4500],
		'💰': [500, 1500],
		'🔥': [500, 3000],
		'📅': [1000, 3000],
	};
	const [lo, hi] = table[tier] ?? [500, 1500];
	return `${lo.toLocaleString()}~${hi.toLocaleString()}원`;
}
