import {MockProvider} from './mock'; import {OpenAICompatibleProvider} from './openai';
export function getAIProvider(){return process.env.AI_API_KEY?new OpenAICompatibleProvider():new MockProvider()}
