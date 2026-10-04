import {describe,it,expect} from 'vitest';import {chatSchema} from '../lib/validation';
describe('validation',()=>{it('rejects oversized messages',()=>{expect(()=>chatSchema.parse({widgetId:'demo',visitorId:'12345678',message:'x'.repeat(4001)})).toThrow()})});
