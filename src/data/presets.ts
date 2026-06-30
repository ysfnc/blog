// 플랫폼 세팅 프리셋 — 자료의 티스토리/블로그스팟/워드프레스 세팅 핵심값(복붙 적용용).
// ⚠️ 일부 세부값(스킨 HTML 원문 등)은 자료에 코드 텍스트가 없어 '항목/위치'만 안내.

export interface Preset {
	platform: string;
	emoji: string;
	monetize: string;
	groups: { title: string; items: string[] }[];
	snippets?: { name: string; code: string }[];
}

export const PRESETS: Preset[] = [
	{
		platform: '티스토리',
		emoji: '🟧',
		monetize: '애드센스(달러) + 카카오 애드핏',
		groups: [
			{ title: '기본 설정', items: ['블로그 이름/설명/대표주소 = 키워드 포함', '주소 형식: 문자(슬러그) 권장(숫자 X)', 'RSS 전체 공개', '메타: KEYWORDS / ROBOTS(index,follow) 설정'] },
			{ title: '스킨/구성', items: ['Book Club 등 심플 스킨 + 사이드바 최소화', '모바일 웹 자동, 메뉴바 = 소개/문의/카테고리', '글쓰기 양식: H2/H3 + 목차'] },
			{ title: '승인 후 광고', items: ['전면광고 1개 + 본문 중간 1~2개(과밀 금지)', '광고는 스킨 편집/플러그인으로만(본문 코드 직삽 금지)'] },
		],
	},
	{
		platform: '블로그스팟(구글)',
		emoji: '🟦',
		monetize: '애드센스(달러) + 쿠팡파트너스',
		groups: [
			{ title: 'SEO 설정', items: ['검색 설정 → 메타 설명 사용 ON(120~160자)', '맞춤 robots.txt + 맞춤 robots 헤더 태그', '커스텀 도메인(2차 도메인) 연결 권장'] },
			{ title: '필수 파일', items: ['robots.txt(아래 코드)', 'sitemap.xml / sitemap_index.xml 제출', 'ads.txt(승인 후 pub 코드)'] },
			{ title: '승인 후 광고', items: ['수익화 스킨(Easy-press류) 적용', '본문 상단 첫 이미지 = 히어로(og 자동 채택)'] },
		],
		snippets: [
			{ name: 'robots.txt (블로그스팟)', code: 'User-agent: *\nDisallow: /search\nAllow: /\n\nSitemap: https://(내도메인)/sitemap.xml' },
			{ name: 'ads.txt (승인 후)', code: 'google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0' },
		],
	},
	{
		platform: '워드프레스',
		emoji: '🟪',
		monetize: '애드센스 + 제휴(쿠팡/CPA)',
		groups: [
			{ title: '테마/구조', items: ['GeneratePress(+GP Premium) 1단 레이아웃', '고유주소: 글 이름(/%postname%/)', '카테고리/태그 = 키워드 기반'] },
			{ title: '필수 플러그인', items: ['Rank Math(SEO 점수 90+ 발행)', 'Ad Inserter 또는 WPQuads(광고 배치)', 'Converter for Media(WebP 자동변환)', '캐시(WP Rocket 등) + 보안'] },
			{ title: '광고 배치', items: ['제목 아래 1 / 본문 중간 1 / 글 끝 1(과밀 금지)', 'ads.txt 오류 = 루트에 파일 업로드로 해결'] },
		],
	},
];

// 검색엔진 등록(출생신고) — 색인 가속
export const SEARCH_ENGINES: { name: string; url: string }[] = [
	{ name: '구글 서치콘솔', url: 'https://search.google.com/search-console' },
	{ name: '네이버 서치어드바이저', url: 'https://searchadvisor.naver.com' },
	{ name: '빙 웹마스터', url: 'https://www.bing.com/webmasters' },
	{ name: '다음(카카오) 검색등록', url: 'https://register.search.daum.net' },
	{ name: 'Zum 검색등록', url: 'https://help.zum.com' },
];
