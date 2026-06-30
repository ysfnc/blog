// 광고 승인 마법사 — 애드포스트/애드센스 조건·절차 체크리스트 + 필수 정책페이지 생성기.
// 출처: 자료(애드포스트 조건/애드센스 SOP) + 2026 애드센스 공식 요건 보강(자료 갭).

export interface CheckItem {
	label: string;
	detail?: string;
	note?: string; // '경험값' 등 출처 신뢰도 표시
}

export const APPROVAL: {
	key: 'adpost' | 'adsense';
	title: string;
	subtitle: string;
	conditions: CheckItem[];
	steps: string[];
}[] = [
	{
		key: 'adpost',
		title: '네이버 애드포스트',
		subtitle: '초보 1순위 — 승인 쉽고 원화 정산. 실명계정만 수익화.',
		conditions: [
			{ label: '만 19세 이상 + 실명 본인인증 완료', detail: '애드포스트 수익화는 실명계정만 가능' },
			{ label: '블로그 개설 후 일정 운영기간 경과', note: '공식 수치 비공개 — 글 품질 우선' },
			{ label: '게시글 12~20개 이상 확보', note: '경험값(공식 최소치 아님)' },
			{ label: '정산용 계좌 등록', detail: '최소 지급액 50,000원' },
			{ label: '저품질·도배·복제 없이 정상 운영', detail: '신청 전 품질 가드 통과 권장' },
		],
		steps: [
			'adpost.naver.com 접속 → 회원 유형(개인/사업자) 선택해 가입',
			'미디어(블로그) 등록 — 1인 1아이디로 여러 미디어 수익 합산',
			'정산 정보(계좌) 입력',
			'심사 신청 → 보류 시 글 추가 후 재신청',
			'승인 후 자동광고 ON + 쇼핑커넥트 동시 활성화(즉시 수익 채널)',
		],
	},
	{
		key: 'adsense',
		title: '구글 애드센스',
		subtitle: '달러 수익·천장 없음. 2025년 이후 승인 까다로움 → 준비 철저히.',
		conditions: [
			{ label: '필수 페이지 3종: 소개 / 개인정보처리방침 / 문의', detail: '없으면 심사 자동 중단. 아래 생성기로 만들 수 있음', note: '애드센스 공식 필수' },
			{ label: 'HTTPS 적용(SSL)', detail: 'HTTP 사이트는 원칙적 승인 불가. Let’s Encrypt 무료 인증서라도 필수', note: '공식' },
			{ label: '게시글 10~15개 이상, 각 1,500~2,000자', detail: '짧은 일기·감상문은 거절 확률↑', note: '공식 권장' },
			{ label: '원본 콘텐츠(복붙·AI 자동생성 그대로 금지)', detail: '표절 검사에 탐지됨 — 직접 재구성·다듬기 필수', note: '공식' },
			{ label: '명확한 메뉴/내비게이션 + 작성자(E-E-A-T) 표기' },
		],
		steps: [
			'사이트에 필수 3페이지 + HTTPS + 글 10~15개 준비',
			'google.com/adsense 접속 → 로그인 → "지금 시작하기"',
			'사이트 URL 등록 + 광고 코드(또는 ads.txt) 사이트에 삽입',
			'검토 대기 — 평균 2~4주 (Ads.txt 경고·색인 오류는 무시 OK)',
			'거절 시: 부족 사유 보완 + 글 1~2개 추가 후 재신청',
		],
	},
];

// 필수 정책 페이지 생성기 — 블로그 정보만 넣으면 복붙용 텍스트 생성(애드센스 승인 필수)
export interface SiteInfo {
	siteName: string;
	ownerName: string;
	email: string;
	domain: string;
}

export function privacyPolicy(s: SiteInfo): string {
	const today = '(작성일)';
	return `# 개인정보처리방침

「${s.siteName}」(이하 '사이트')은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수합니다.

## 1. 수집하는 정보
사이트는 별도의 회원가입 없이 이용할 수 있으며, 문의 시 입력하신 이메일 주소 외 개인정보를 직접 수집하지 않습니다. 다만 서비스 이용 과정에서 접속 로그, 쿠키, 방문 기록 등이 자동으로 생성·수집될 수 있습니다.

## 2. 광고 및 쿠키
본 사이트는 Google AdSense 등 제3자 광고를 게재하며, 이 과정에서 쿠키를 사용해 이용자 관심 기반 광고를 제공할 수 있습니다. 이용자는 브라우저 설정에서 쿠키를 거부할 수 있습니다. Google의 광고 쿠키 정책은 policies.google.com/technologies/ads 에서 확인할 수 있습니다.

## 3. 개인정보의 보유 및 이용기간
수집된 정보는 목적 달성 후 지체 없이 파기합니다.

## 4. 문의
개인정보 관련 문의: ${s.email}

본 방침은 ${today}부터 적용됩니다.`;
}

export function aboutPage(s: SiteInfo): string {
	return `# 소개 (About)

안녕하세요. 「${s.siteName}」을 운영하는 ${s.ownerName}입니다.

이 사이트는 실생활에 도움이 되는 정보(생활·금융·정책·건강 등)를 직접 조사하고 정리해 전달하기 위해 만들었습니다. 정확하고 신뢰할 수 있는 정보를 쉽게 풀어내는 것을 목표로 합니다.

- 운영자: ${s.ownerName}
- 사이트: ${s.domain}
- 문의: ${s.email}

읽어주셔서 감사합니다.`;
}

export function contactPage(s: SiteInfo): string {
	return `# 문의 (Contact)

「${s.siteName}」에 대한 문의·제휴·정정 요청은 아래로 연락 주세요.

- 이메일: ${s.email}
- 운영자: ${s.ownerName}

보내주신 문의는 확인 후 순차적으로 답변드리겠습니다.`;
}
