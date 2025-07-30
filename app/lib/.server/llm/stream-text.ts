import { streamText as _streamText, convertToCoreMessages, type Message } from 'ai';
import { getAPIKey } from '~/lib/.server/llm/api-key';
import { getOpenAIModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  return _streamText({
    model: getOpenAIModel(getAPIKey(env)),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
