import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createDuckDuckGoRfcAdapter } from './duckduckgo-rfc.mjs';

// Not invoked by offline tests. Call only under a separate, scoped user approval.
// Pi resolves Codex authentication itself through its supported ModelRuntime; we never read/print it.
// DuckDuckGo Lite search is keyless; existing Codex auth remains separately permitted.
export async function makeLiveDependencies({ signal }) {
  signal?.throwIfAborted();
  const adapter = createDuckDuckGoRfcAdapter();
  const modelRuntime = await ModelRuntime.create({ allowModelNetwork: false, signal });
  signal?.throwIfAborted();
  return { adapter, modelRuntime };
}
