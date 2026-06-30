import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { GenResultSchema, SYSTEM_PROMPT } from '../../lib/channel-rules';

// 서버에서 실행(정적 빌드 제외) — Claude API 키가 노출되지 않게 서버 측에서만 호출.
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

	// dev: import.meta.env(.env) / prod: Vercel 환경변수(process.env) 둘 다 지원
	const apiKey =
		import.meta.env.ANTHROPIC_API_KEY ?? (typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined);
	if (!apiKey) {
		return json(
			{ error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다. 로컬은 .env, 배포는 Vercel 환경변수에 추가하세요.' },
			500,
		);
	}

	const userMsg = keyword
		? `주제어: ${topic || keyword}\n사용자가 직접 지정한 핵심 키워드: ${keyword}\n이 키워드를 primaryKeyword로 사용하되, 연관 고CPC 키워드도 함께 추천하라.`
		: `주제어: ${topic}\n이 주제에서 고CPC 키워드를 발굴해 가장 돈이 되는 것을 primaryKeyword로 골라라.`;

	try {
		const client = new Anthropic({ apiKey });
		const res = await client.messages.parse({
			model: 'claude-opus-4-8',
			max_tokens: 16000,
			thinking: { type: 'adaptive' },
			system: SYSTEM_PROMPT,
			messages: [{ role: 'user', content: userMsg }],
			output_config: { format: zodOutputFormat(GenResultSchema) },
		});

		if (res.stop_reason === 'refusal') {
			return json({ error: '안전 정책에 의해 생성이 거부되었습니다. 주제를 바꿔 다시 시도해주세요.' }, 422);
		}
		if (!res.parsed_output) {
			return json({ error: '결과 파싱에 실패했습니다. 다시 시도해주세요.' }, 502);
		}
		return json({ ok: true, result: res.parsed_output });
	} catch (e) {
		const msg = e instanceof Error ? e.message : '생성 중 오류가 발생했습니다.';
		return json({ error: msg }, 500);
	}
};
