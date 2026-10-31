import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createBraveRfcAdapter } from './brave-rfc.mjs';

// Call only under a separate, scoped user approval. Offline tests cover missing-key refusal only.
// Pi resolves Codex authentication itself; no credential file is read by this module.
// Validate the host-supplied Brave key BEFORE runtime/auth initialization or model dispatch.
export async function makeLiveDependencies({ signal, braveSearchApiKey }) {
  signal?.throwIfAborted();
  const adapter = createBraveRfcAdapter({ token: braveSearchApiKey });
  const modelRuntime = await ModelRuntime.create({ allowModelNetwork: false, signal });
  signal?.throwIfAborted();
  return { adapter, modelRuntime };
}
