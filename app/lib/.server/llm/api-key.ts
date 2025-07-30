import { env } from 'node:process';

export function getAnthropicAPIKey(cloudflareEnv: Env) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
}

export function getOpenAIAPIKey(cloudflareEnv: Env) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return env.OPENAI_API_KEY || cloudflareEnv.OPENAI_API_KEY;
}

// Default to OpenAI for backwards compatibility
export function getAPIKey(cloudflareEnv: Env) {
  return getOpenAIAPIKey(cloudflareEnv);
}
