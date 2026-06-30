// 생성 엔진 — 기본은 "Claude 구독(로컬 claude CLI 헤드리스)", 옵션으로 Anthropic API.
// 구독 경로는 사장님 PC에서 claude 가 로그인(Pro/Max)된 상태로 `npm run dev` 할 때만 동작.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { GenResultSchema, SYSTEM_PROMPT, type GenResult } from './channel-rules';

const execFileAsync = promisify(execFile);

const JSON_SHAPE = `반드시 아래 JSON 객체 "하나만" 출력하라. 코드펜스(\`\`\`)·설명·인사·머리말 전부 금지, 순수 JSON만:
{
  "primaryKeyword": "문자열",
  "recommendedKeywords": [ { "keyword": "...", "category": "40대이상검색|행동요구|돈(고단가)", "cpcTier": "💰💰💰|💰💰|💰|🔥이슈|📅상시", "reason": "..." } ],
  "titles": [ { "title": "...", "type": "검색형|홈판형" } ],
  "naver": { "title": "...", "body": "...", "hashtags": ["..."] },
  "blogspot": { "title": "...", "body": "..." }
}
recommendedKeywords 는 5~8개, titles 는 4~6개, naver.hashtags 는 정확히 10개(# 없이 단어만).`;

function buildUserMsg(topic: string, keyword: string): string {
	return keyword
		? `주제어: ${topic || keyword}\n사용자가 직접 지정한 핵심 키워드: ${keyword}\n이 키워드를 primaryKeyword로 사용하되, 연관 고CPC 키워드도 함께 추천하라.`
		: `주제어: ${topic}\n이 주제에서 고CPC 키워드를 발굴해 가장 돈이 되는 것을 primaryKeyword로 골라라.`;
}

// 모델이 코드펜스나 머리말을 붙여도 본문 JSON만 안전하게 추출.
function extractJson(text: string): unknown {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const raw = fenced ? fenced[1] : text;
	const start = raw.indexOf('{');
	const end = raw.lastIndexOf('}');
	if (start === -1 || end === -1) throw new Error('응답에서 JSON 객체를 찾지 못했습니다.');
	return JSON.parse(raw.slice(start, end + 1));
}

export type Engine = 'cli' | 'api';

export function chosenEngine(): Engine {
	const e = (import.meta.env.GEN_ENGINE ?? (typeof process !== 'undefined' ? process.env.GEN_ENGINE : '') ?? 'cli')
		.toString()
		.toLowerCase();
	return e === 'api' ? 'api' : 'cli';
}

// 구독 경로: 로컬 claude CLI 를 헤드리스로 호출(과금 없음, 구독 인증 사용).
async function generateViaClaudeCLI(topic: string, keyword: string): Promise<GenResult> {
	const bin = process.env.CLAUDE_BIN || 'claude';
	const args = [
		'-p',
		buildUserMsg(topic, keyword) + '\n\n' + JSON_SHAPE,
		'--append-system-prompt',
		SYSTEM_PROMPT,
		'--output-format',
		'json',
		'--strict-mcp-config', // 세션 MCP 서버(노심 등) 로드 안 함
		'--disallowed-tools',
		'Bash',
		'Edit',
		'Write',
		'Read',
		'Glob',
		'Grep',
		'WebFetch',
		'WebSearch',
		'Task', // 순수 텍스트 생성만
	];
	if (process.env.GEN_MODEL) args.push('--model', process.env.GEN_MODEL);

	// API 키가 환경에 있어도 구독을 쓰도록 자식 프로세스에서 키를 제거.
	const childEnv = { ...process.env };
	delete childEnv.ANTHROPIC_API_KEY;
	delete childEnv.ANTHROPIC_AUTH_TOKEN;

	let stdout: string;
	try {
		const r = await execFileAsync(bin, args, {
			cwd: os.tmpdir(), // 블로그 CLAUDE.md/컨텍스트 안 끌고 오게 중립 디렉터리에서 실행
			timeout: 180_000,
			maxBuffer: 24 * 1024 * 1024,
			env: childEnv,
		});
		stdout = r.stdout;
	} catch (e) {
		const err = e as NodeJS.ErrnoException;
		if (err.code === 'ENOENT') {
			throw new Error('claude CLI 를 찾지 못했습니다. Claude Code 설치 후 로그인(구독)하거나 GEN_ENGINE=api 로 전환하세요.');
		}
		throw new Error('claude CLI 실행 실패: ' + (err.message || 'unknown'));
	}

	let envelope: { is_error?: boolean; result?: string };
	try {
		envelope = JSON.parse(stdout);
	} catch {
		throw new Error('claude CLI 응답(JSON 엔벌로프) 파싱 실패');
	}
	if (envelope.is_error) throw new Error('claude CLI 오류: ' + (envelope.result || 'unknown'));

	const obj = extractJson(String(envelope.result ?? ''));
	return GenResultSchema.parse(obj);
}

// 옵션 경로: Anthropic API(메터링). GEN_ENGINE=api 일 때.
async function generateViaAPI(topic: string, keyword: string): Promise<GenResult> {
	const apiKey =
		import.meta.env.ANTHROPIC_API_KEY ?? (typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined);
	if (!apiKey) throw new Error('ANTHROPIC_API_KEY가 없습니다. .env 또는 Vercel 환경변수에 추가하세요.');
	const client = new Anthropic({ apiKey });
	const res = await client.messages.parse({
		model: 'claude-opus-4-8',
		max_tokens: 16000,
		thinking: { type: 'adaptive' },
		system: SYSTEM_PROMPT,
		messages: [{ role: 'user', content: buildUserMsg(topic, keyword) }],
		output_config: { format: zodOutputFormat(GenResultSchema) },
	});
	if (res.stop_reason === 'refusal') throw new Error('REFUSAL');
	if (!res.parsed_output) throw new Error('결과 파싱에 실패했습니다.');
	return res.parsed_output;
}

export async function generate(topic: string, keyword: string): Promise<{ result: GenResult; engine: Engine }> {
	const engine = chosenEngine();
	const result = engine === 'api' ? await generateViaAPI(topic, keyword) : await generateViaClaudeCLI(topic, keyword);
	return { result, engine };
}
