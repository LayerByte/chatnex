import {describe,it,expect} from 'vitest';import {searchKnowledge} from '../lib/knowledge/search';
describe('knowledge search',()=>{it('ranks keyword matches',()=>{const r=searchKnowledge('python projects',[{title:'Projects',category:'work',content:'Python tools',keywords:'python security'},{title:'About',category:'about',content:'Design'}]);expect(r[0].title).toBe('Projects')})});
