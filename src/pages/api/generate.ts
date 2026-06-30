import type { APIRoute } from 'astro';
import { generateMaster, generateChannel } from '../../lib/engine';
import { CHANNELS, type Channel, type Master } from '../../lib/channel-rules';

export const prerender = false;

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});
}

export const POST: APIRoute = async ({ request }) => {
	let body: { mode?: string; topic?: string; keyword?: string; channel?: string; master?: Master };
	try {
		body = await request.json();
	} catch {
		return json({ error: '요청 형식이 올바르지 않습니다.' }, 400);
	}
	const mode = body.mode === 'channel' ? 'channel' : 'master';

	try {
		if (mode === 'master') {
			const topic = (body.topic ?? '').toString().trim();
			const keyword = (body.keyword ?? '').toString().trim();
			if (!topic && !keyword) return json({ error: '주제어 또는 키워드를 입력해주세요.' }, 400);
			const result = await generateMaster(topic, keyword);
			return json({ ok: true, master: result });
		}
		// channel
		const channel = body.channel as Channel;
		if (!CHANNELS.includes(channel)) return json({ error: '알 수 없는 채널입니다.' }, 400);
		if (!body.master?.primaryKeyword) return json({ error: '먼저 키워드 조사를 실행해주세요.' }, 400);
		const result = await generateChannel(channel, body.master);
		return json({ ok: true, channel, result });
	} catch (e) {
		const msg = e instanceof Error ? e.message : '생성 중 오류가 발생했습니다.';
		if (msg === 'REFUSAL') return json({ error: '안전 정책에 의해 거부되었습니다. 주제를 바꿔보세요.' }, 422);
		return json({ error: msg }, 500);
	}
};
