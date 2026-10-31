import test from 'node:test';
import assert from 'node:assert/strict';
import { zstdDecompressSync } from 'node:zlib';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';
// Pin to the locally installed provider source: exercise ModelRuntime.prepareRequest
// and the real Codex SSE serializer, never a simulated request builder or network.
import { streamSimple as codexStreamSimple } from '../node_modules/@earendil-works/pi-coding-agent/node_modules/@earendil-works/pi-ai/dist/api/openai-codex-responses.js';

globalThis.fetch = () => { throw new Error('OFFLINE NETWORK FORBIDDEN'); };

test('actual installed Codex SDK transport does NOT send model.maxTokens as a remote token cap', async () => {
  let requests = 0;
  let serialized;
  const model = { provider: 'openai-codex', id: 'gpt-6.1-sol', api: 'openai-codex-responses',
    baseUrl: 'https://chatgpt.com/backend-api', maxTokens: 1, contextWindow: 272000,
    reasoning: true, thinkingLevelMap: { max: 'max' }, input: ['text'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } };
  const syntheticToken = ['local', Buffer.from(JSON.stringify({
    'https://api.openai.com/auth': { chatgpt_account_id: 'offline-fixture' },
  })).toString('base64url'), 'local'].join('.');
  const runtime = {
    models: { getProvider: () => ({ streamSimple: codexStreamSimple }) },
    getAuth: async () => ({ auth: { apiKey: syntheticToken, baseUrl: model.baseUrl } }),
    prepareRequest: ModelRuntime.prototype.prepareRequest,
  };
  const context = { systemPrompt: 'Offline request inspection.',
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Do not dispatch remotely.' }], timestamp: Date.now() }],
    tools: [{ name: 'research_search', label: 'Search', description: 'Synthetic only',
      parameters: Type.Object({ query: Type.String() }) }] };
  const stream = ModelRuntime.prototype.streamSimple.call(runtime, model, context, {
    reasoning: 'max', transport: 'sse', maxRetries: 0,
    fetch: async (url, init) => {
      requests++;
      assert.equal(url, 'https://chatgpt.com/backend-api/codex/responses');
      assert.equal(init.method, 'POST');
      const body = init.headers.get('content-encoding') === 'zstd'
        ? zstdDecompressSync(init.body).toString('utf8') : String(init.body);
      serialized = JSON.parse(body);
      return new Response('data: {"type":"response.completed","response":{"status":"completed","output":[]}}\n\n',
        { headers: { 'content-type': 'text/event-stream' } });
    },
  });
  const message = await stream.result();
  assert.equal(message.stopReason, 'stop', message.errorMessage); assert.equal(requests, 1);
  assert.equal(serialized.model, 'gpt-6.1-sol');
  assert.equal(serialized.reasoning.effort, 'max');
  assert.equal(serialized.tools[0].name, 'research_search');
  assert.equal(Object.hasOwn(serialized, 'max_output_tokens'), false);
  assert.equal(Object.hasOwn(serialized, 'max_completion_tokens'), false);
  assert.equal(Object.hasOwn(serialized, 'max_tokens'), false);
  assert.equal(JSON.stringify(serialized).includes(syntheticToken), false);
});
