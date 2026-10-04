export type AIInput={system:string;messages:{role:'user'|'assistant';content:string}[]};
export interface AIProvider { generateResponse(input:AIInput):Promise<string> }
