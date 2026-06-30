import type { APIRoute } from 'astro';
import { generate } from '../../lib/engine';

// 서버에서 실행(정적 빌드 제외). 기본 엔진=Claude 구독(로컬 claude CLI), 옵션=API.
export const prerender = false;

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
}

export const POST: APIRoute = async ({ request }) => {
	let payload: { topic?: string; keyword?: string };
	try {
		payload = await request.json();
	} catch {
		return json({ error: '요청 형식이 올바르지 않습니다.' }, 400);
	}

	const topic = (payload.topic ?? '').toString().trim();
	const keyword = (payload.keyword ?? '').toString().trim();
	if (!topic && !keyword) {
		return json({ error: '주제어 또는 키워드를 입력해주세요.' }, 400);
	}

	try {
		const { result, engine } = await generate(topic, keyword);
		return json({ ok: true, engine, result });
	} catch (e) {
		const msg = e instanceof Error ? e.message : '생성 중 오류가 발생했습니다.';
		if (msg === 'REFUSAL') {
			return json({ error: '안전 정책에 의해 생성이 거부되었습니다. 주제를 바꿔 다시 시도해주세요.' }, 422);
		}
		return json({ error: msg }, 500);
	}
};
