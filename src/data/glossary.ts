// 용어 사전 + 수익 지표 공식/계산기 데이터 (자료의 용어 종합사전 기반).

export interface Term {
	term: string;
	full?: string;
	desc: string;
	formula?: string;
}

export const METRICS: Term[] = [
	{ term: 'CPC', full: 'Cost Per Click', desc: '광고 1클릭당 단가. 고단가 키워드(보험·대출)일수록 높음.', formula: '수익 = 클릭수 × CPC' },
	{ term: 'CTR', full: 'Click Through Rate', desc: '노출 대비 클릭 비율(클릭률).', formula: 'CTR(%) = 클릭수 ÷ 노출수 × 100' },
	{ term: 'RPM', full: 'Revenue Per Mille', desc: '페이지뷰 1,000회당 예상 수익. 채널 효율 비교 핵심 지표.', formula: 'RPM = 수익 ÷ 페이지뷰 × 1,000' },
	{ term: 'CPM', full: 'Cost Per Mille', desc: '노출 1,000회당 광고 단가(노출형).', formula: 'CPM = 광고비 ÷ 노출수 × 1,000' },
	{ term: 'PV', full: 'Page View', desc: '페이지 조회수. 수익의 출발점(트래픽).' },
	{ term: 'UV', full: 'Unique Visitor', desc: '순 방문자 수(중복 제외).' },
];

export const TERMS: Term[] = [
	{ term: '애드포스트', desc: '네이버 광고 수익 프로그램(원화 정산, 자동광고).' },
	{ term: '애드센스', desc: '구글 광고 수익 프로그램(달러 정산, 천장 없음).' },
	{ term: '쇼핑커넥트', desc: '네이버 쇼핑 연동 수익(애드포스트 승인 전에도 활성화 가능).' },
	{ term: '펍벤(PubBan)', desc: '게시자(Publisher) 차단 — 애드센스 계정 영구 정지. 복구 불가.' },
	{ term: '저품질', desc: '검색 노출이 크게 떨어지는 상태. 플랫폼별로 독립적이며 어뷰징(복제·도배·부정클릭)이 주원인.' },
	{ term: '통누락', desc: '작성 글이 검색에 색인되지 않는 현상. 다음 검색 등으로 자가진단.' },
	{ term: '연관검색어', desc: '검색창에 뜨는 함께 찾는 단어. 제목·세부키워드 발굴의 핵심 소스.' },
	{ term: '슬러그(slug)', desc: 'URL의 글 식별 부분. 키워드 영문으로 두면 SEO 유리.' },
	{ term: 'E-E-A-T', desc: '경험·전문성·권위·신뢰. 구글이 평가하는 콘텐츠 신뢰 신호(작성자 표기 등).' },
	{ term: 'ads.txt', desc: '광고 판매자 인증 파일. 사이트 루트에 두며 경고는 대개 무시 OK.' },
];

// '구식=무시' 경고
export const OUTDATED = ['파소나(Pasona) 코드', '섹션 타게팅 주석', '메모장 세탁', '발행 후 20분 대기'];

// 수익 계산기 — 페이지뷰·CTR·CPC로 예상 수익/RPM 추정
export function estimate(pv: number, ctrPct: number, cpc: number) {
	const clicks = pv * (ctrPct / 100);
	const revenue = clicks * cpc;
	const rpm = pv > 0 ? (revenue / pv) * 1000 : 0;
	return { clicks: Math.round(clicks), revenue: Math.round(revenue), rpm: Math.round(rpm) };
}
