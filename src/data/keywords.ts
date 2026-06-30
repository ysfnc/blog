// 키워드 시드 DB — 자료(부록1 고단가 30 + 부록2 12개월 캘린더 + 365일 상시) 원문 기반.
// 생성 엔진의 grounding 자료 + 키워드 브라우저/시즌 캘린더의 원천.
// ⚠️ 키워드별 정확한 원/USD CPC 수치는 원문에 없어 '등급(💰)'만 보유 — 절대값 추정 금지.

export type Tier = '💰💰💰' | '💰💰' | '💰' | '🔥' | '📅';

export interface Keyword {
	kw: string;
	tiers: Tier[];
	note?: string;
}

export const TIER_LEGEND: { tier: string; label: string; cpc: string; desc: string }[] = [
	{ tier: '💰💰💰', label: '황금 고단가', cpc: '예상 CPC 3,000원↑', desc: '보험·금융·법률·대출' },
	{ tier: '💰💰', label: '고단가', cpc: '1,500~3,000원', desc: '트래픽+단가 균형' },
	{ tier: '💰', label: '트래픽형', cpc: '500~1,500원', desc: '폭발적 검색량' },
	{ tier: '🔥', label: '이슈 시즌형', cpc: '단기 급상승', desc: '타이밍이 핵심' },
	{ tier: '📅', label: '상시 롱런형', cpc: '연중 안정적', desc: '꾸준한 수익 기반' },
];

// 부록1: 고단가 + 행동유도 시드 30개 (6카테고리 × 5)
export const GOLDEN: { category: string; items: string[] }[] = [
	{ category: '금융 & 재테크', items: ['ISA 계좌 신청하기', '연말정산 간소화 바로가기', '청년 내일채움공제 가입 방법', '신용카드 포인트 전환 신청', '전세자금대출 조건 확인'] },
	{ category: '정부 지원 & 복지', items: ['청년 지원금 신청 방법', '긴급 생계지원금 신청하기', '근로장려금 신청기간', '육아휴직 급여 바로 신청', '보조금24 조회하기'] },
	{ category: '건강 & 의료', items: ['건강보험료 환급 신청', '스케일링 건강보험 적용 대상', '임플란트 보험 적용 여부', '다이어트 약 처방받기 가격 비교', '한방 다이어트 효과 분석'] },
	{ category: '자동차 & 교통', items: ['자동차세 납부 방법', '고속도로 통행료 할인 신청', '전기차 보조금 신청 일정', '중고차 시세 조회 바로가기', '자동차 보험료 비교 신청'] },
	{ category: '교육 & 취업', items: ['국비지원 학원 찾기', '공무원 시험 원서접수 바로가기', '워드프레스 강의 무료 듣기', '직장인 자기계발 추천 강의', '자격증 취득 비용 조회하기'] },
	{ category: 'IT & 인터넷 서비스', items: ['VPS 호스팅 신청 방법', '홈페이지 제작 견적 바로보기', '워드프레스 SEO 최적화 방법', '유튜브 수익 창출 조건 확인', '도메인 구매 비교 사이트'] },
];

// 365일 통용 — 계절 무관 연중 최고단가 상시 키워드
export const EVERGREEN: { group: string; items: Keyword[] }[] = [
	{
		group: '🏛 금융·대출 (CPC 최상위)',
		items: [
			{ kw: '자동차보험 비교', tiers: ['💰💰💰'], note: '연중 최상위 CPC' },
			{ kw: '주택담보대출 금리', tiers: ['💰💰💰'], note: '부동산 최고단가' },
			{ kw: '전세자금대출 조건', tiers: ['💰💰💰'], note: '대출 최고단가' },
			{ kw: '카드론 vs 대출 비교', tiers: ['💰💰💰'], note: '금융 상담형' },
			{ kw: '신용점수 올리는 법', tiers: ['💰💰💰'], note: '금융 상시 수요' },
			{ kw: '청년도약계좌 조건', tiers: ['💰💰💰'], note: '정부 정책 금융' },
			{ kw: 'ISA 계좌 장단점', tiers: ['💰💰💰'], note: '절세 투자 상품' },
		],
	},
	{
		group: '🏥 보험·의료 (고단가 핵심)',
		items: [
			{ kw: '실손보험 청구', tiers: ['💰💰💰'], note: '보험 최고단가' },
			{ kw: '암보험 추천', tiers: ['💰💰💰'], note: '보험 상시' },
			{ kw: '임플란트 가격', tiers: ['💰💰💰'], note: '치과 최고단가' },
			{ kw: '치아교정 비용', tiers: ['💰💰💰'], note: '치과 상시' },
			{ kw: '피부과 레이저 비용', tiers: ['💰💰💰'], note: '의료 고단가' },
			{ kw: '탈모약 가격', tiers: ['💰💰💰'], note: '의료 상시' },
			{ kw: '도수치료 실손', tiers: ['💰💰💰'], note: '보험+의료 이중' },
		],
	},
	{
		group: '⚖ 법률·세무 (최고 CPC)',
		items: [
			{ kw: '개인회생 조건', tiers: ['💰💰💰'], note: '법률 최최고단가' },
			{ kw: '파산 신청 비용', tiers: ['💰💰💰'], note: '법률 최고단가' },
			{ kw: '종합소득세 신고', tiers: ['💰💰💰'], note: '세무 최고단가' },
			{ kw: '연말정산 공제', tiers: ['💰💰💰'], note: '세금 상시' },
			{ kw: '개인사업자 비용처리', tiers: ['💰💰💰'], note: '세무 상시' },
			{ kw: '상속세 계산', tiers: ['💰💰💰'], note: '법률+세금 이중' },
			{ kw: '세후월급 계산기', tiers: ['💰💰'], note: '트래픽+단가' },
		],
	},
];

export interface MonthPlan {
	month: number;
	theme: string;
	strategy: string;
	keywords: Keyword[];
}

// 부록2: 12개월 시즌 키워드 캘린더 (원문 기반)
export const CALENDAR: MonthPlan[] = [
	{
		month: 1,
		theme: '신년·운세·연말정산·세금 준비',
		strategy: '12월 말부터 신년운세·새해인사말 미리 발행 → 연말정산 선점 → 신년 다이어트·보험 갱신 3단계',
		keywords: [
			{ kw: '2026 신년운세 무료', tiers: ['💰💰💰', '🔥'], note: '무료운세 큐레이션 형식' },
			{ kw: '무료사주 사이트', tiers: ['💰💰💰', '🔥'], note: '1월 초 폭발 검색량' },
			{ kw: '2026년 새해인사말', tiers: ['🔥'], note: '문자·카톡 인사말 모음 복붙' },
			{ kw: '연말정산 환급 많이 받는 법', tiers: ['💰💰💰', '📅'], note: '공제항목 총정리형' },
			{ kw: '2026 근로장려금 조건', tiers: ['💰💰💰', '📅'], note: '연초 정책 안내' },
			{ kw: '개인회생 조건 총정리', tiers: ['💰💰💰', '📅'], note: '법률 최상위 단가' },
			{ kw: '자동차보험 갱신 할인 방법', tiers: ['💰💰💰', '📅'], note: '보험 최고단가 신년 갱신' },
			{ kw: '다이어트 약 처방 비용', tiers: ['💰💰💰', '🔥'], note: '신년 다이어트 수요 폭발' },
		],
	},
	{
		month: 2,
		theme: '동계올림픽·졸업·이직·학자금·대출',
		strategy: '밀라노 올림픽 한국 선수 경기 결과 → 24시간 내 즉각 발행(단기 트래픽 폭발)',
		keywords: [
			{ kw: '2026 밀라노 동계올림픽 일정', tiers: ['💰💰', '🔥'], note: '종목별 경기 일정' },
			{ kw: '청년 전세자금대출 조건', tiers: ['💰💰💰', '🔥'], note: '부동산·대출 최상위' },
			{ kw: '학자금대출 상환 방법', tiers: ['💰💰💰', '📅'], note: '졸업 시즌 급등' },
			{ kw: '전세보증보험 가입 방법', tiers: ['💰💰💰', '📅'], note: '전세 보증 이슈' },
			{ kw: '청약 가점 계산기', tiers: ['💰💰💰', '📅'], note: '부동산 고단가 상시' },
			{ kw: '온라인 로또 구매방법', tiers: ['💰💰', '🔥'], note: '2/9부터 스마트폰 구매' },
			{ kw: '이직 준비 체크리스트', tiers: ['💰💰', '🔥'], note: '이직 성수기' },
		],
	},
	{
		month: 3,
		theme: '이사·이직·보험·건강·신학기',
		strategy: '벚꽃 포스팅은 2월 하순 선발행 → 이사·포장이사 견적 비교는 보험 광고 유입 최고',
		keywords: [
			{ kw: '이사 비용 평균', tiers: ['💰💰💰', '🔥'], note: '이사 성수기 견적 비교 폭발' },
			{ kw: '포장이사 견적 비교', tiers: ['💰💰💰', '🔥'], note: '업체 비교 큐레이션' },
			{ kw: '임플란트 비용 2026', tiers: ['💰💰💰', '📅'], note: '치과 최고단가' },
			{ kw: '건강검진 비용', tiers: ['💰💰💰', '📅'], note: '봄 검진 시즌' },
			{ kw: '청년도약계좌 신청', tiers: ['💰💰💰', '📅'], note: '금융 고단가 청년 정책' },
			{ kw: '자동차보험 비교', tiers: ['💰💰💰', '📅'], note: '보험 최상위 상시' },
			{ kw: '신학기 준비물 추천', tiers: ['💰💰', '🔥'], note: '초중고·대학생별 분류' },
		],
	},
	{
		month: 4,
		theme: '종합소득세·부업·투자·벚꽃',
		strategy: '종합소득세 포스팅 4월 초 발행 → 5월까지 수익 극대화(RPM 최상위 구간)',
		keywords: [
			{ kw: '종합소득세 신고 방법', tiers: ['💰💰💰', '🔥'], note: '4월 선점→5월 폭발 최고단가' },
			{ kw: '프리랜서 세금 계산법', tiers: ['💰💰💰', '📅'], note: '블로거·유튜버 수요' },
			{ kw: '블로그 수익 신고 방법', tiers: ['💰💰💰', '🔥'], note: '세금+부업 이중 공략' },
			{ kw: 'ETF 추천 2026', tiers: ['💰💰💰', '📅'], note: '투자 상시 고단가' },
			{ kw: '해외주식 세금 정리', tiers: ['💰💰💰', '📅'], note: '세금+투자 더블' },
			{ kw: '대출 갈아타기', tiers: ['💰💰💰', '🔥'], note: '금융 최고단가 상시' },
			{ kw: '부업 추천 현실적인 것', tiers: ['💰💰', '🔥'], note: '광고 밀도 높음' },
		],
	},
	{
		month: 5,
		theme: '가정의달·지원금·보험·여행',
		strategy: '가정의달+종소세 마감+보험 → 단일 월 중 광고 단가 최고 구간',
		keywords: [
			{ kw: '종합소득세 신고 방법', tiers: ['💰💰💰', '🔥'], note: '5월 최대 검색량' },
			{ kw: '부모님 건강보험 피부양자 조건', tiers: ['💰💰💰', '📅'], note: '보험+복지 이중' },
			{ kw: '제주도 렌트카 가격', tiers: ['💰💰💰', '🔥'], note: '여행+렌트카 이중' },
			{ kw: '삼쩜삼 환급 신청', tiers: ['💰💰', '🔥'], note: '종소세 연계 환급' },
			{ kw: '어린이날 선물 연령별', tiers: ['💰💰', '🔥'], note: '연령 세분화' },
			{ kw: '어버이날 선물 추천', tiers: ['💰💰', '🔥'], note: '건강식품·꽃·체험' },
			{ kw: '신용대출 금리비교', tiers: ['💰💰', '📅'], note: '금융 최고단가 상시' },
		],
	},
	{
		month: 6,
		theme: 'FIFA 월드컵·장마·에어컨·전기요금',
		strategy: '월드컵 한국 경기 결과·하이라이트 → 경기 후 즉시 포스팅 = 당일 수만 뷰',
		keywords: [
			{ kw: '한국 월드컵 경기 일정', tiers: ['💰💰', '🔥'], note: '태극전사 출전 일정' },
			{ kw: '여름철 다이어트 약', tiers: ['💰💰💰', '🔥'], note: '의료+다이어트 여름 전' },
			{ kw: '신용카드 추천 2026', tiers: ['💰💰', '🔥', '📅'], note: '카드 상시 고단가' },
			{ kw: '자동차보험 비교견적', tiers: ['💰💰', '📅'], note: '보험 최상위 상시' },
			{ kw: '웹호스팅 추천', tiers: ['💰💰', '📅'], note: 'IT 최고단가 중 하나' },
			{ kw: '제습기 전기요금', tiers: ['💰💰', '🔥'], note: '장마철 구매 수요' },
			{ kw: '에어컨 전기세 절약 방법', tiers: ['💰💰', '🔥'], note: '여름 가전 연관' },
		],
	},
	{
		month: 7,
		theme: '여름 극성수기·의료·대출·휴가',
		strategy: '의료 키워드(탈모·피부과·치아교정)는 여름 비수기에 CPC 안정적 → 꾸준히 작성 유리',
		keywords: [
			{ kw: '여름휴가 대출 가능할까', tiers: ['💰💰💰', '🔥'], note: '대출 비수기 금융' },
			{ kw: '탈모약 가격', tiers: ['💰💰💰', '📅'], note: '의료 연중 수요' },
			{ kw: '피부과 레이저 비용', tiers: ['💰💰💰', '📅'], note: '피부과 최고단가' },
			{ kw: '치아교정 비용 2026', tiers: ['💰💰💰', '📅'], note: '치과 최고단가' },
			{ kw: '렌트카 사고 처리 방법', tiers: ['💰💰💰', '📅'], note: '보험+렌트카 이중' },
			{ kw: '제주도 숙소 추천', tiers: ['💰💰', '🔥'], note: '가성비·럭셔리 구분' },
			{ kw: '해외여행 환전 방법', tiers: ['💰💰', '🔥'], note: '환율·환전 우대' },
		],
	},
	{
		month: 8,
		theme: '전세·월세·이사·대출·부동산',
		strategy: "전세·부동산은 연간 최고단가 → '전세사기·DSR·주담대 비교' 시리즈 강력 추천",
		keywords: [
			{ kw: '전세대출 조건 2026', tiers: ['💰💰💰', '🔥'], note: '부동산+대출 최상위' },
			{ kw: '월세 세액공제', tiers: ['💰💰💰', '🔥'], note: '세금 고단가' },
			{ kw: '전세사기 피하는 법', tiers: ['💰💰💰', '🔥'], note: '사회 이슈 연계 지속' },
			{ kw: '주택담보대출 금리 비교', tiers: ['💰💰💰', '📅'], note: '대출 최상위 상시' },
			{ kw: 'DSR 계산 방법', tiers: ['💰💰💰', '📅'], note: '부동산 금융 고단가' },
			{ kw: '청약 통장 1순위 조건', tiers: ['💰💰💰', '📅'], note: '부동산 최고단가' },
			{ kw: '한전 전기요금 조회', tiers: ['💰', '🔥'], note: '8월 전기세 폭탄 시즌' },
		],
	},
	{
		month: 9,
		theme: '추석·보험·건강검진·포스트시즌',
		strategy: '추석 전후 보험 관심 폭발 → 부모님 보험·실버보험 집중 발행으로 단가 극대화',
		keywords: [
			{ kw: '부모님 실버보험', tiers: ['💰💰💰', '🔥'], note: '추석 후 보험 관심 폭발' },
			{ kw: '자동차보험 만기 확인', tiers: ['💰💰💰', '🔥'], note: '보험 갱신 시즌' },
			{ kw: '암보험 필요할까', tiers: ['💰💰💰', '📅'], note: '보험 최고단가' },
			{ kw: '실손보험 갱신', tiers: ['💰💰💰', '📅'], note: '9월 갱신 안내 급증' },
			{ kw: '건강검진 병원 추천', tiers: ['💰💰💰', '🔥'], note: '추석 후 건강 관심' },
			{ kw: '2026 추석 인사말', tiers: ['💰', '🔥'], note: '가족·직장 인사말 모음' },
			{ kw: '추석 선물세트 추천', tiers: ['💰💰', '🔥'], note: '가격대별 쿠팡 연계' },
		],
	},
	{
		month: 10,
		theme: '연말 준비·투자·난방비·수능 D-30',
		strategy: 'IRP·ETF·배당주 연말 절세 투자 시리즈 → 금융 광고 단가 피크 시작',
		keywords: [
			{ kw: '연말정산 미리 준비', tiers: ['💰💰💰', '🔥'], note: '10월 하순부터 선점 필수' },
			{ kw: 'IRP 세액공제', tiers: ['💰💰💰', '🔥'], note: '연금저축 절세 관심 폭발' },
			{ kw: '퇴직연금 수령 방법', tiers: ['💰💰💰', '📅'], note: '금융·연금 고단가' },
			{ kw: 'ETF 수익률 비교', tiers: ['💰💰💰', '📅'], note: '투자 안정 고단가' },
			{ kw: '배당주 추천 2026', tiers: ['💰💰💰', '📅'], note: '연말 배당 시즌' },
			{ kw: '자동차보험 갱신 할인', tiers: ['💰💰💰', '📅'], note: '보험 고단가 상시' },
			{ kw: '도시가스 요금조회', tiers: ['💰', '🔥'], note: '10월 난방 시즌 시작' },
		],
	},
	{
		month: 11,
		theme: '수능·대출·블프·연말정산',
		strategy: '수능 직후 재수 학원비·학자금대출 즉각 발행 + 연말정산 시리즈 가동',
		keywords: [
			{ kw: '재수 학원 비용', tiers: ['💰💰💰', '🔥'], note: '수능 직후 최고 검색량' },
			{ kw: '학자금대출 조건', tiers: ['💰💰💰', '🔥'], note: '대출 고단가 수험생' },
			{ kw: '대환대출 가능한가', tiers: ['💰💰💰', '📅'], note: '금융 최고단가' },
			{ kw: '연말정산 공제항목', tiers: ['💰💰💰', '🔥'], note: '11월부터 세금 관심 폭발' },
			{ kw: '개인사업자 세금 절세', tiers: ['💰💰💰', '📅'], note: '세무·회계 최고단가' },
			{ kw: '신용점수 800점 만드는 법', tiers: ['💰💰💰', '📅'], note: '금융 고단가' },
			{ kw: '블랙프라이데이 추천 2026', tiers: ['💰💰', '🔥'], note: '직구 할인 큐레이션' },
		],
	},
	{
		month: 12,
		theme: '연말·세금·보험·신년 준비 (연간 최고 수익)',
		strategy: '12월=연간 최고 광고 단가 월 → 세금·보험·신년 집중 + 내년 1월용 신년운세 미리 작성',
		keywords: [
			{ kw: '연말정산 간소화 서비스', tiers: ['💰💰💰', '🔥'], note: '12월 내 최고 단가' },
			{ kw: '세액공제 많이 받는 법', tiers: ['💰💰💰', '🔥'], note: '절세 관심 연간 최고점' },
			{ kw: '연말정산 환급금 조회', tiers: ['💰💰💰', '🔥'], note: '환급 기대로 검색 폭발' },
			{ kw: 'IRP·연금저축 세액공제', tiers: ['💰💰💰', '🔥'], note: '12월 말 납입 마감' },
			{ kw: '자동차보험 할인 특약', tiers: ['💰💰💰', '🔥'], note: '보험 연말 갱신' },
			{ kw: '신용카드 혜택 비교', tiers: ['💰💰💰', '📅'], note: '카드 광고 연말 피크' },
			{ kw: '2027 신년운세 무료', tiers: ['💰💰', '🔥'], note: '12월 말 폭발, 미리 발행 필수' },
		],
	},
];

// ── 헬퍼 ──
export function monthPlan(month: number): MonthPlan {
	return CALENDAR.find((m) => m.month === month) ?? CALENDAR[0];
}

// 생성 엔진 grounding용: 등급별 대표 키워드 샘플(LLM이 CPC 등급을 지어내지 않게)
export function groundingSample(): string {
	const ever = EVERGREEN.flatMap((g) => g.items.map((k) => `${k.tiers.join('')} ${k.kw}`));
	const goldenFlat = GOLDEN.flatMap((g) => g.items.map((k) => `(행동요구) ${k}`)).slice(0, 12);
	return [
		'[고단가 상시 키워드 등급 예시 — 실제 자료 기반, 이 패턴으로 등급 부여]',
		...ever,
		'',
		'[행동유도 결합 예시]',
		...goldenFlat,
	].join('\n');
}

// 전체 키워드 평면 리스트(검색/추천용)
export function allKeywords(): { kw: string; tiers: Tier[]; source: string; note?: string }[] {
	const out: { kw: string; tiers: Tier[]; source: string; note?: string }[] = [];
	for (const g of EVERGREEN) for (const k of g.items) out.push({ kw: k.kw, tiers: k.tiers, source: `상시·${g.group}`, note: k.note });
	for (const m of CALENDAR) for (const k of m.keywords) out.push({ kw: k.kw, tiers: k.tiers, source: `${m.month}월`, note: k.note });
	for (const g of GOLDEN) for (const k of g.items) out.push({ kw: k, tiers: ['💰💰💰'], source: `고단가·${g.category}`, note: '행동유도형' });
	return out;
}
