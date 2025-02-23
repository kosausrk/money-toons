import { ElevenLabsClient } from 'elevenlabs';

export const eleven = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});
