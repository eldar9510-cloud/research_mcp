import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createBraveRfcAdapter } from './brave-rfc.mjs';

// Not invoked by offline tests. Call only under a separate, scoped user approval.
// Pi resolves Codex authentication itself through its supported ModelRuntime; we never read/print it.
// searchToken is a new Brave API credential, supplied by the host only after setup approval.
export async function makeLiveDependencies({ searchToken, signal }) {
  signal?.throwIfAborted();
  const adapter = createBraveRfcAdapter({ token: searchToken });
  const modelRuntime = await ModelRuntime.create({ allowModelNetwork: false, signal });
  signal?.throwIfAborted();
  return { adapter, modelRuntime };
}
