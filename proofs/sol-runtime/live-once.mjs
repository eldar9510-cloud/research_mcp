import { runInvestigation } from './src/research.mjs';
import { makeLiveDependencies } from './src/live-dependencies.mjs';

// This guard is an explicit operator acknowledgement, NOT an approval/authentication mechanism.
// Never run until the user authorizes this exact question, providers, scope and bounds.
if (process.argv.length !== 3 || process.argv[2] !== '--approved-rfc2606') {
  console.error('Not run: requires separately authorized --approved-rfc2606.');
  process.exitCode = 2;
} else {
  try {
    const dependencies = await makeLiveDependencies({ searchToken: process.env.BRAVE_SEARCH_API_KEY });
    const result = await runInvestigation({
      question: 'Which second-level example domain names does RFC 2606 reserve, and for what use?',
      scope: 'Only official RFC Editor pages for RFC 2606; short answer with inspected source citations.',
    }, dependencies);
    console.log(JSON.stringify(result)); // No SDK transcript, credential or hidden reasoning.
    if (result.status !== 'completed') process.exitCode = 1;
  } catch {
    console.error('Live setup failed (model runtime or search credential unavailable).');
    process.exitCode = 1;
  }
}
