import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { createAgentSession } from '@earendil-works/pi-coding-agent';
import { MODEL } from '../src/research.js';

export const URL = 'https://www.w3.org/WAI/fundamentals/accessibility-intro/';
export const INPUT = { mode: 'new', question: 'What does web accessibility enable?', scope: 'W3C guidance; compare inclusive access with exclusion, and state limits.' };
// Original synthetic text, not a capture or claimed quotation from the live W3C site.
export const TEXT = 'This synthetic guide defines web accessibility as enabling people with disabilities to use websites and tools.';
export const model = { ...MODEL, api: 'openai-codex-responses', baseUrl: 'https://chatgpt.com/backend-api', reasoning: true,
  thinkingLevelMap: { max: 'max' }, contextWindow: 272000, maxTokens: 4096, input: ['text'], name: 'Offline synthetic fixture' };
export const searchStep = { tool: 'research_search', args: { query: 'W3C web accessibility introduction', plan: 'Inspect primary W3C definition; compare inclusion with barriers and note applicability limits.' } };
export const fetchStep = { tool: 'research_fetch', args: { url: URL } };
export const report = () => ({ title: 'Web accessibility', summary: 'Inclusive design enables disabled people to use web technology.',
  findings: [{ text: 'Accessible web technology supports people with disabilities.', kind: 'evidence', sources: ['S1'],
    quote: { source: 'S1', text: 'people with disabilities' } }],
  comparison: { text: 'Inclusive design supports access rather than excluding disabled users.', sources: ['S1'] },
  limitations: ['The passage is a definition, not a measured implementation evaluation.'], gaps: ['Which implementation best fits a specific site requires further investigation.'] });
export const steps = (answer = report()) => [searchStep, fetchStep, { text: typeof answer === 'string' ? answer : JSON.stringify(answer) }];
export function adapter(overrides = {}) {
  return { search: async () => [{ url: URL, title: 'Transient API title marker', snippet: 'Transient API snippet marker' }],
    fetch: async url => ({ url, title: 'Direct W3C fixture title', text: TEXT, offset: 0, rawTruncated: false, truncated: false,
      accessedAt: new Date().toISOString(), rawPrefixSha256: createHash('sha256').update(TEXT).digest('hex') }), ...overrides };
}
// Real Pi SDK sessions and tool loop, with only the external transport scripted.
export function runtime(script = steps(), { candidate = model, auth = true, routes = [], authError } = {}) {
  const trace = [];
  const object = {
    getModel: () => candidate, hasConfiguredAuth: () => auth, isUsingOAuth: () => false,
    async getAuth() { if (authError) throw authError; return { auth: { apiKey: 'synthetic-only-placeholder', baseUrl: routes.shift() } }; },
    streamSimple(selected, context, options) {
      const dispatch = this, step = script.shift();
      if (!step) throw new Error('fixture_exhausted');
      const message = { role: 'assistant', api: model.api, provider: selected.provider, model: selected.id,
        content: step.tool ? [{ type: 'toolCall', id: `call-${script.length}`, name: step.tool, arguments: step.args }] : [{ type: 'text', text: step.text ?? '' }],
        stopReason: step.stopReason ?? (step.tool ? 'toolUse' : 'stop'), errorMessage: step.errorMessage, timestamp: Date.now(),
        usage: step.usage ?? { input: 5, output: 2, cacheRead: 0, cacheWrite: 0, totalTokens: 7 } };
      return { async *[Symbol.asyncIterator]() {
        await dispatch.getAuth(selected, { signal: options.signal });
        trace.push({ model: selected, reasoning: options.reasoning, tools: context.tools.map(t => t.name),
          maxRetries: options.maxRetries, transport: options.transport, signal: options.signal,
          // Only synthetic tests retain context; production must NEVER persist this.
          context });
        yield { type: 'start', partial: step.streamArguments ? { ...message, content: [] } : message };
        if (step.streamArguments) yield { type: 'toolcall_delta', delta: JSON.stringify(step.args), partial: { ...message,
          content: [{ type: 'toolCall', name: step.tool, id: 'streaming', arguments: {}, partialJson: JSON.stringify(step.args) }] } };
        yield { type: message.stopReason === 'error' ? 'error' : 'done', message, reason: message.stopReason };
      }, async result() { return message; } };
    },
  };
  return { runtime: object, trace };
}
export async function terminal(research, start) {
  for (let i = 0; i < 2000; i++) {
    const status = research.get({ jobId: start.jobId });
    if (status.status !== 'running') return status;
    await new Promise(resolve => setTimeout(resolve, 2));
  }
  throw new Error('fixture_job_did_not_terminate');
}
export const createSession = createAgentSession;
export function httpFixture({ body = TEXT, type = 'text/plain', status = 200, answers = [{ address: '93.184.215.14', family: 4 }], stalled = false } = {}) {
  const calls = [], dns = [];
  let destroyed = 0;
  return { calls, dns, get destroyed() { return destroyed; },
    lookup(host, options, callback) { dns.push({ host, options }); callback(null, answers); },
    request(url, options, callback) {
      calls.push({ url, options });
      const req = new EventEmitter();
      req.destroy = () => { destroyed++; };
      req.end = () => {
        setImmediate(() => {
          if (stalled) return;
          const response = new PassThrough();
          response.statusCode = status; response.headers = { 'content-type': type };
          callback(response); response.end(Buffer.from(body));
        });
      };
      return req;
    },
  };
}
