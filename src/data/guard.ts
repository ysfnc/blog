// 발행 전 품질/준법 가드 — 자료의 펍벤·저품질·약관위반 룰을 린터로 코드화.
// 계정 사망(펍벤=복구불가) 방어가 목적. 생성기/대시보드에서 발행·복사 직전 검사.

export interface LintHit {
	level: 'red' | 'yellow';
	rule: string;
	matched: string;
	advice: string;
}

interface Rule {
	level: 'red' | 'yellow';
	rule: string;
	re: RegExp;
	advice: string;
}

const RULES: Rule[] = [
	// 🔴 펍벤·계정정지 직결 (절대 금지)
	{ level: 'red', rule: '클릭 유도 문구', re: /(여기[를]?\s*클릭|클릭\s*하세요|클릭\s*해\s*주세요|광고[를]?\s*눌러|아래\s*광고|꼭\s*눌러|눌러\s*주세요)/g, advice: '애드센스/애드포스트 부정클릭 유도 = 계정 정지. 문구를 삭제하세요.' },
	{ level: 'red', rule: '광고 클릭 보상 언급', re: /(광고\s*보면|광고\s*클릭하면|클릭\s*시\s*적립)/g, advice: '광고 클릭 대가 언급은 정책 위반. 제거하세요.' },
	{ level: 'red', rule: '외부/의심 스크립트·광고코드', re: /<script[\s>]|adsbygoogle|data-ad-client|googlesyndication/gi, advice: '본문에 광고/스크립트 코드 직접 삽입 금지(펍벤 위험). 광고는 플랫폼 설정에서만.' },
	{ level: 'red', rule: '과장 수익 보장', re: /(무조건|100%|반드시)\s*(수익|돈|월\s*\d|벌)|월\s*\d{3,}만원\s*(보장|확정)/g, advice: '수익 보장·과장 표현은 신뢰·정책 리스크. 가능성으로만 서술하세요.' },

	// 🟡 저품질·신뢰 리스크 (주의)
	{ level: 'yellow', rule: 'YMYL 고지 누락 가능', re: /(대출|보험|세금|투자|의료|진단|처방|부작용)/g, advice: '대출·보험·세금·의료 등 민감 주제 — "정확한 내용은 공식 채널 확인이 필요합니다" 한 줄을 본문에 넣었는지 확인.' },
	{ level: 'yellow', rule: '미확인 수치 표기', re: /\(확인\s*필요\)|___|XX/g, advice: '확인 필요/빈 슬롯이 남아 있습니다. 발행 전 실제 값으로 채우세요.' },
	{ level: 'yellow', rule: '단정적 의료·법률 조언', re: /(반드시\s*(복용|신청)|꼭\s*(받으세요|하세요)|틀림없)/g, advice: '단정적 조언은 위험. "~할 수 있습니다/권장됩니다" 톤으로 완화.' },
];

export function lintContent(text: string): LintHit[] {
	if (!text) return [];
	const hits: LintHit[] = [];
	const seen = new Set<string>();
	for (const r of RULES) {
		const m = text.match(r.re);
		if (m && m.length) {
			const key = r.rule;
			if (seen.has(key)) continue;
			seen.add(key);
			hits.push({ level: r.level, rule: r.rule, matched: [...new Set(m)].slice(0, 4).join(', '), advice: r.advice });
		}
	}
	// red 먼저
	return hits.sort((a, b) => (a.level === b.level ? 0 : a.level === 'red' ? -1 : 1));
}

// 발행 전 자가진단 체크리스트(품질 가드 룰셋 → UI 체크박스)
export const QUALITY_CHECKLIST: { label: string; critical?: boolean }[] = [
	{ label: '본문에 광고/스크립트 코드를 직접 넣지 않았다 (펍벤 방지)', critical: true },
	{ label: '클릭 유도 문구가 없다 (부정클릭 정책)', critical: true },
	{ label: '타인 글 복붙이 아니라 직접 작성/재구성했다', critical: true },
	{ label: '같은 사진/문장을 다른 채널과 똑같이 쓰지 않았다 (중복 회피)', critical: true },
	{ label: 'YMYL(보험·대출·세금·의료) 주제면 정보 고지 한 줄을 넣었다' },
	{ label: '제목·소제목에 핵심 키워드가 들어갔다 (SEO)' },
	{ label: '확인 필요/빈 슬롯을 실제 값으로 채웠다' },
	{ label: '발행 간격을 두고 한 번에 몰아 발행하지 않는다' },
];

// 저품질 미신 깨기(과잉 방어 차단 — 자료 기반 안내)
export const QUALITY_MYTHS: { myth: string; truth: string }[] = [
	{ myth: '복붙하면 무조건 저품질', truth: '직접 재구성·인용 출처 표기면 OK. 타인 글 무단 복제만 문제.' },
	{ myth: '메모장에 붙였다 떼야 한다(세탁)', truth: '불필요. 에디터에 바로 작성해도 무방.' },
	{ myth: '발행 후 20분 기다려야 한다', truth: '근거 없음. 즉시 발행 OK.' },
	{ myth: '하루 발행 수 제한이 있다', truth: '품질이 핵심. 어뷰징(복제·도배·부정클릭) 3종만 실제 차단 대상.' },
];
