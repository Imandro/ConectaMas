import assert from 'node:assert/strict';
import { createNvidiaResponse, NvidiaProviderError } from '../app/lib/ai/nvidia';

void (async () => {
  delete process.env.NVIDIA_API_KEY;
  await assert.rejects(
    () => createNvidiaResponse([{ role: 'user', content: 'Hola' }]),
    (error: unknown) => error instanceof NvidiaProviderError && error.code === 'NOT_CONFIGURED',
  );

  console.log('AI chat provider passed');
})();
