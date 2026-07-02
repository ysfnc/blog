import type { APIRoute } from 'astro';
import { scoreMany, type Scored } from '../../lib/score';

// 실시간 키워드 인텔리전스 — 무료 공개 소스만 사용(키 불필요).
// mode=trends : 구글 트렌드 KR 실시간 급상승 → 채점
// mode=expand&q=키워드 : 네이버 자동완성 + 구글 서제스트 확장 → 채점
export const prerender = false;

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

async function fetchTrends(): Promise<{ kw: string; traffic?: string }[]> {
	const r = await fetch('https://trends.google.co.kr/trending/rss?geo=KR', {
		headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000),
	});
	const xml = await r.text();
	const items: { kw: string; traffic?: string }[] = [];
	const re = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?(?:<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>)?[\s\S]*?<\/item>/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) && items.length < 20) {
		const kw = m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
		if (kw) items.push({ kw, traffic: m[2]?.trim() });
	}
	return items;
}

async function naverSuggest(q: string): Promise<string[]> {
	try {
		const u = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&con=1&frm=nv&ans=2&r_format=json&r_enc=UTF-8&st=100&q_enc=UTF-8`;
		const r = await fetch(u, { headers: { referer: 'https://www.naver.com', 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(6000) });
		const d = await r.json();
		return (d.items?.[0] ?? []).map((x: string[]) => x[0]).filter(Boolean);
	} catch { return []; }
}

async function googleSuggest(q: string): Promise<string[]> {
	try {
		const u = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&ie=UTF-8&oe=UTF-8&q=${encodeURIComponent(q)}`;
		const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(6000) });
		const d = await r.json();
		return (d[1] ?? []).filter(Boolean);
	} catch { return []; }
}

export const GET: APIRoute = async ({ url }) => {
	const mode = url.searchParams.get('mode') || 'trends';
	try {
		if (mode === 'trends') {
			const raw = await fetchTrends();
			const scored = scoreMany(raw.map((x) => x.kw));
			const withTraffic: (Scored & { traffic?: string })[] = scored.map((s) => ({ ...s, traffic: raw.find((x) => x.kw === s.kw)?.traffic }));
			return json({ ok: true, source: '구글 트렌드 KR 실시간', items: withTraffic });
		}
		if (mode === 'expand') {
			const q = (url.searchParams.get('q') || '').trim();
			if (!q) return json({ error: '키워드를 입력해주세요.' }, 400);
			const [n, g] = await Promise.all([naverSuggest(q), googleSuggest(q)]);
			const merged = [...n, ...g];
			if (!merged.length) return json({ ok: true, source: '자동완성(결과 없음)', items: scoreMany([q]) });
			return json({ ok: true, source: `네이버 자동완성 ${n.length} + 구글 서제스트 ${g.length}`, items: scoreMany(merged) });
		}
		return json({ error: '알 수 없는 mode' }, 400);
	} catch (e) {
		return json({ error: e instanceof Error ? e.message : '수집 실패' }, 502);
	}
};
