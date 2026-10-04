import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main(){
  const widget=await db.widget.upsert({where:{publicId:'demo'},update:{name:'ChatNex'},create:{publicId:'demo',name:'ChatNex',settings:{create:{}}}});
  const knowledge=[
    {title:'About ChatNex',category:'About',content:'ChatNex is a modern embeddable website chatbot platform with a widget, knowledge base, FAQs, analytics and configurable AI providers.',keywords:'chatbot,widget,AI,website'},
    {title:'Demo Mode',category:'Support',content:'ChatNex works without an AI API key by using the built-in mock provider. Configure AI_API_KEY for production AI responses.',keywords:'demo,local,mock,API'}
  ];
  for(const item of knowledge) await db.knowledgeEntry.upsert({where:{id:`seed-${item.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`},update:item,create:{id:`seed-${item.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,widgetId:widget.id,...item}});
  const faqs=[
    {id:'seed-faq-help',question:'What can you help with?',answer:'I can answer questions from the website knowledge base and configured FAQs.',category:'General'},
    {id:'seed-faq-config',question:'How do I configure ChatNex?',answer:'Use the admin dashboard or the documented REST API and environment variables.',category:'Setup'}
  ];
  for(const item of faqs) await db.fAQ.upsert({where:{id:item.id},update:item,create:{widgetId:widget.id,...item,enabled:true}});
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>db.$disconnect());
