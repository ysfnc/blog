// 생성 엔진 — 기본 Claude 구독(로컬 claude CLI 헤드리스), 옵션 Anthropic API.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import type { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
	MASTER_SYSTEM,
	MASTER_SHAPE,
	MasterSchema,
	channelSystem,
	CHANNEL_SHAPE,
	ChannelSchema,
	type Channel,
	type Master,
	type ChannelOut,
} from './channel-rules';

const execFileAsync = promisify(execFile);

export type Engine = 'cli' | 'api';
export function chosenEngine(): Engine {
	const e = (import.meta.env.GEN_ENGINE ?? (typeof process !== 'undefined' ? process.env.GEN_ENGINE : '') ?? 'cli')
		.toString()
		.toLowerCase();
	return e === 'api' ? 'api' : 'cli';
}

function extractJson(text: string): unknown {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const raw = fenced ? fenced[1] : text;
	const start = raw.indexOf('{');
	const end = raw.lastIndexOf('}');
	if (start === -1 || end === -1) throw new Error('응답에서 JSON 객체를 찾지 못했습니다.');
	return JSON.parse(raw.slice(start, end + 1));
}

async function runViaCLI<T>(system: string, user: string, schema: z.ZodType<T>, shape: string): Promise<T> {
	const bin = process.env.CLAUDE_BIN || 'claude';
	const args = [
		'-p',
		user + '\n\n반드시 아래 JSON 객체 "하나만" 출력하라(코드펜스·설명·머리말 금지):\n' + shape,
		'--append-system-prompt',
		system,
		'--output-format',
		'json',
		'--strict-mcp-config',
		'--disallowed-tools',
		'Bash',
		'Edit',
		'Write',
		'Read',
		'Glob',
		'Grep',
		'WebFetch',
		'WebSearch',
		'Task',
	];
	if (process.env.GEN_MODEL) args.push('--model', process.env.GEN_MODEL);

	const childEnv = { ...process.env };
	delete childEnv.ANTHROPIC_API_KEY;
	delete childEnv.ANTHROPIC_AUTH_TOKEN;

	let stdout: string;
	try {
		const r = await execFileAsync(bin, args, {
			cwd: os.tmpdir(),
			timeout: 180_000,
			maxBuffer: 24 * 1024 * 1024,
			env: childEnv,
		});
		stdout = r.stdout;
	} catch (e) {
		const err = e as NodeJS.ErrnoException;
		if (err.code === 'ENOENT')
			throw new Error('claude CLI 를 찾지 못했습니다. Claude Code 로그인(구독)하거나 GEN_ENGINE=api 로 전환하세요.');
		throw new Error('claude CLI 실행 실패: ' + (err.message || 'unknown'));
	}

	let envelope: { is_error?: boolean; result?: string };
	try {
		envelope = JSON.parse(stdout);
	} catch {
		throw new Error('claude CLI 응답 파싱 실패');
	}
	if (envelope.is_error) throw new Error('claude CLI 오류: ' + (envelope.result || 'unknown'));
	return schema.parse(extractJson(String(envelope.result ?? '')));
}

async function runViaAPI<T>(system: string, user: string, schema: z.ZodType<T>): Promise<T> {
	const apiKey =
		import.meta.env.ANTHROPIC_API_KEY ?? (typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined);
	if (!apiKey) throw new Error('ANTHROPIC_API_KEY가 없습니다. GEN_ENGINE=cli(구독) 또는 키를 등록하세요.');
	const client = new Anthropic({ apiKey });
	const res = await client.messages.parse({
		model: 'claude-opus-4-8',
		max_tokens: 16000,
		thinking: { type: 'adaptive' },
		system,
		messages: [{ role: 'user', content: user }],
		output_config: { format: zodOutputFormat(schema as z.ZodType<object>) },
	});
	if (res.stop_reason === 'refusal') throw new Error('REFUSAL');
	if (!res.parsed_output) throw new Error('결과 파싱에 실패했습니다.');
	return res.parsed_output as T;
}

async function runJSON<T>(system: string, user: string, schema: z.ZodType<T>, shape: string): Promise<T> {
	return chosenEngine() === 'api' ? runViaAPI(system, user, schema) : runViaCLI(system, user, schema, shape);
}

// ── 공개 API ──────────────────────────────────────────────
export async function generateMaster(topic: string, keyword: string): Promise<Master> {
	const user = keyword
		? `주제어: ${topic || keyword}\n사용자가 직접 지정한 핵심 키워드: ${keyword}\n이 키워드를 primaryKeyword로 사용하되 연관 고CPC 키워드도 추천하라.`
		: `주제어: ${topic}\n이 주제에서 고CPC 키워드를 발굴해 가장 돈이 되는 것을 primaryKeyword로 골라라.`;
	return runJSON(MASTER_SYSTEM, user, MasterSchema, MASTER_SHAPE);
}

export async function generateChannel(channel: Channel, master: Master): Promise<ChannelOut> {
	const user = `[마스터]\n핵심 키워드: ${master.primaryKeyword}\n관점: ${master.angle}\n추천 키워드: ${master.recommendedKeywords
		.map((k) => `${k.cpcTier} ${k.keyword}(${k.category})`)
		.join(', ')}\n핵심 포인트:\n- ${master.keyPoints.join('\n- ')}\n\n이 마스터로 이 채널 맞춤 글과 이미지 문구를 만들어라.`;
	return runJSON(channelSystem(channel), user, ChannelSchema, CHANNEL_SHAPE);
}
