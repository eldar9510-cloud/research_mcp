// #11 controlled integration handoffs, not live model/source, human consent or publication proof.
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
const code=resolve('.');
await import(pathToFileURL(join(code,'tests/research-tripwire.cjs')));
assert.equal(process.env.PI_SDK_ROOT,join(code,'node_modules/@earendil-works/pi-coding-agent'),'Use this checkout\'s exact SDK instance');
assert.ok(process.env.PI_ADAPTER_INDEX);
assert.equal(JSON.parse(await fs.readFile(join(process.env.PI_SDK_ROOT,'package.json'),'utf8')).version,'0.84.2');
const sdk=await import(pathToFileURL(join(process.env.PI_SDK_ROOT,'dist/index.js')));
const {createArchive}=await import(pathToFileURL(join(code,'src/archive.js')));
const root=await fs.mkdtemp(join(tmpdir(),'issue11-chained-'));
const cwd=join(root,'project'),agentDir=join(root,'agent'),archiveRoot=join(root,'archive'),workRoot=join(root,'work'),importRoot=join(root,'imports');
for(const p of [cwd,agentDir,archiveRoot,workRoot,importRoot])await fs.mkdir(p,{mode:0o700});
const log=join(root,'transport.log'),network=join(root,'network.log');
const archive=createArchive({archiveRoot,workRoot,importRoot,now:()=> '2024-02-03T00:00:00.000Z'});
const body='# Historical accessibility note\nWeb accessibility aims to support disabled people using web resources [old].\n\n## Limitations\nThis original note does not compare inclusive and exclusionary design. It is not freshly checked.\n\n[old]: https://example.org/old\n';
const meta={id:'web-accessibility-prior',title:'Historical web accessibility boundaries',
 question:'What does web accessibility enable within an introductory scope?',
 scope:'One historical introductory note; missing inclusive versus exclusionary design comparison. Not current advice.',
 summary:'A historical web accessibility note, missing an evidence comparison of inclusion and exclusion.',
 researched_at:null,last_improved_at:null,language:'en',origin:{kind:'imported',platform:'offline fixture',author:'synthetic fixture',model:'none'},
 related_reports:[],warnings:['Synthetic offline fixture; not real research.','Old evidence has not been rechecked.'],superseded_by:null};
// Explicit bootstrap after inspecting this newly created, genuinely empty fixture archive.
await archive.rebuildCatalogue();
Object.assign(process.env,{RESEARCH_ARCHIVE_ROOT:archiveRoot,RESEARCH_WORK_ROOT:workRoot,RESEARCH_IMPORT_ROOT:importRoot,
 PI_CODING_AGENT_DIR:agentDir,PI_OFFLINE:'1',PI_SKIP_VERSION_CHECK:'1',PI_TELEMETRY:'0',
 BRAVE_SEARCH_API_KEY:'synthetic-host-only-token',RESEARCH_HOST_TRANSPORT_LOG:log,RESEARCH_TRIPWIRE:network});
const config={settings:{sampling:false,autoAuth:false},mcpServers:{workflow_fixture:{command:process.execPath,args:[join(code,'src/stdio.js')],lifecycle:'lazy',
 approveTools:false,env:{RESEARCH_ARCHIVE_ROOT:archiveRoot,RESEARCH_WORK_ROOT:workRoot,RESEARCH_IMPORT_ROOT:importRoot}}}};
await fs.writeFile(join(cwd,'.mcp.json'),JSON.stringify(config),{mode:0o600});
const adapter=join(cwd,'adapter.ts');
await fs.writeFile(adapter,`import {createMcpAdapter} from ${JSON.stringify(process.env.PI_ADAPTER_INDEX)};\nexport default createMcpAdapter(${JSON.stringify({config})});\n`);
const settings=sdk.SettingsManager.inMemory({compaction:{enabled:false},retry:{enabled:false,provider:{maxRetries:0}}});
const runtime=await sdk.ModelRuntime.create({authPath:join(agentDir,'auth.json'),modelsPath:join(agentDir,'models.json'),modelsStorePath:join(agentDir,'models-store.json'),allowModelNetwork:false});
// Children use the already-tested external runtime/HTTP seam. Every other network/process request is refused.
process.env.NODE_OPTIONS=`--require=${join(code,'tests/research-tripwire.cjs')} --import=${join(code,'tests/fixtures/research-host-preload.mjs')}`;
const sessions=new Set();let maxVisibleBytes=0,dialogs=0;
const value=r=>{const text=r.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');maxVisibleBytes=Math.max(maxVisibleBytes,Buffer.byteLength(text));assert.ok(Buffer.byteLength(text)<=48*1024);return JSON.parse(text.slice(text.lastIndexOf('\n')+1));};
const packets=async()=> (await fs.readFile(log,'utf8').catch(e=>e.code==='ENOENT'?'':Promise.reject(e))).split('\n').filter(Boolean);
const starts=async()=> (await packets()).filter(s=>s==='start_research').length;
async function host(){
 const loader=new sdk.DefaultResourceLoader({cwd,agentDir,settingsManager:settings,additionalExtensionPaths:[adapter,join(code,'.pi/extensions/research-acceptance.ts'),join(code,'.pi/extensions/research-coverage.ts')]});
 await loader.reload();
 const {session,extensionsResult}=await sdk.createAgentSession({cwd,agentDir,resourceLoader:loader,settingsManager:settings,modelRuntime:runtime,sessionManager:sdk.SessionManager.inMemory(cwd),noTools:'builtin'});
 sessions.add(session);assert.deepEqual(extensionsResult.errors,[]);
 await session.bindExtensions({mode:'tui',uiContext:{confirm:async()=>{dialogs++;return false;},select:async()=>{throw Error('No generic consent fallback');},notify(){},setStatus(){}}});
 const tool=n=>{const t=session.agent.state.tools.find(t=>t.name===n);assert.ok(t,n);return t;};
 return {session,tool};
}
async function close(h){await h.session.extensionRunner.emit({type:'session_shutdown',reason:'quit'});h.session.dispose();sessions.delete(h.session);}
const call=(h,tool,args)=>h.tool('mcp').execute('normal-mcp',{server:'workflow_fixture',tool:`workflow_fixture_${tool}`,args});
async function commission(h,request,text,label){
 let stage=0,error,started;
 h.session.agent.getApiKey=async()=>undefined;
 h.session.agent.streamFunction=async()=>{
  let content=[];
  try{
   if(stage++===0)content=[{type:'toolCall',id:`prepare-${label}`,name:'research_request',arguments:{server:'workflow_fixture',request,source:'CURRENT_REQUEST',
    rationale:'The complete delivered synthetic user request explicitly commissions this exact bounded task and selected revision; no source refresh or publication.'}}];
   else if(stage===2){const prepared=value(h.session.messages.find(m=>m.role==='toolResult'&&m.toolCallId===`prepare-${label}`));content=[{type:'toolCall',id:`start-${label}`,name:'mcp',arguments:prepared.mcp}];}
   else{started=value(h.session.messages.find(m=>m.role==='toolResult'&&m.toolCallId===`start-${label}`));}
  }catch(e){error=e;throw e;}
  const message={role:'assistant',api:'offline-fixture',provider:'fixture',model:'synthetic-host',content:content.length?content:[{type:'text',text:'Controlled host decision; no external model.'}],
   stopReason:content.length?'toolUse':'stop',timestamp:Date.now(),usage:{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,cost:{input:0,output:0,cacheRead:0,cacheWrite:0,total:0}}};
  return {async *[Symbol.asyncIterator](){yield {type:'done',reason:message.stopReason,message};},result:async()=>message};
 };
 await h.session.agent.prompt({role:'user',content:[{type:'text',text}],timestamp:Date.now()});assert.ifError(error);assert.equal(stage,3);assert.equal(started.status,'running');
 let done;
 for(let i=0;i<1000;i++){done=value(await call(h,'get_research_job',{jobId:started.jobId}));if(done.status!=='running')break;await new Promise(r=>setTimeout(r,5));}
 assert.equal(done.status,'completed',JSON.stringify(done));assert.equal(done.actualModel.id,'gpt-6.1-sol');assert.equal(done.actualModel.effort,'max');
 assert.ok(done.modelCalls<=5&&done.toolCalls<=4);
 const proposal=value(await call(h,'read_research',done.outputs.proposal));assert.equal(proposal.state,'LOCAL_UNACCEPTED');
 return {started,done,proposal};
}
try{
 const freshHost=await host(),firstCoverage=input=>freshHost.tool('research_coverage').execute('controlled-no-match',input);
 const newQuestion='What does web accessibility enable for disabled people?',newScope='W3C introductory guidance; compare inclusive access and exclusion, state narrow scope and limits. No old source refresh or publication.';
 const empty=value(await firstCoverage({action:'lookup',purpose:'investigation',question:newQuestion,query:'web accessibility inclusion exclusion'}));
 assert.equal(empty.status,'empty');assert.deepEqual(empty.candidates,[]);
 const noMatch=value(await firstCoverage({action:'decide',outcome:'no_useful_match',usefulIds:[],gaps:[],reason:'This successful bounded lookup of the inspected empty fixture found no useful prior material; not universal absence.'}));
 assert.equal(noMatch.outcome,'no_useful_match');assert.deepEqual(Object.values(noMatch.dispatched),[false,false,false,false]);assert.equal(await starts(),0);
 const fresh=await commission(freshHost,{mode:'new',question:newQuestion,scope:newScope},'Explicitly commission one new bounded W3C introductory accessibility investigation for this no-match question. Compare inclusive access with exclusion, use independent primary evidence, state limits. No archive refresh or publication.','new');
 assert.equal(await starts(),1);assert.equal(fresh.proposal.metadata.origin.kind,'engine_generated');await close(freshHost);
 // Separately construct a finished external baseline through the trusted local archive interface.
 // This is fixture preparation, NOT simulated human consent or publication. The earlier new result remains local unaccepted.
 const draft=(await archive.importReport({text:body,metadata:meta})).proposal;
 const review=(await archive.reviewProposal({proposalId:draft.proposalId})).review;
 await archive.acceptProposal({proposalId:review.proposalId,expectedRevision:review.expectedRevision,expectedBaseRevision:review.expectedBaseRevision,
  expectedCatalogueRevision:review.expectedCatalogueRevision,expectedReviewDigest:review.reviewDigest,acceptedAt:review.acceptedAt});
 const beforeIndex=await fs.readFile(join(archiveRoot,'INDEX.json')),beforeReport=await fs.readFile(join(archiveRoot,'reports',meta.id+'.md'));
 const h=await host(),coverage=input=>h.tool('research_coverage').execute('controlled-coverage',input);
 const found=value(await coverage({action:'lookup',purpose:'comparison',question:'What does the prior web accessibility note cover and which comparison is missing?',query:'web accessibility inclusion exclusion'}));
 assert.equal(found.status,'matches');const c=found.candidates.find(c=>c.id===meta.id);assert.ok(c);
 let page=value(await coverage({action:'read',read:{reportId:c.id,expectedRevision:c.revision}}));
 let selectedBody=page.content.text;
 while(page.continuation){page=value(await coverage({action:'read',read:page.continuation}));selectedBody+=page.content.text;}
 assert.match(selectedBody,/does not compare inclusive and exclusionary/);
 const partial=value(await coverage({action:'decide',outcome:'partial',usefulIds:[c.id],gaps:['Missing evidence comparison of inclusive access versus exclusionary design.'],reason:'Historical note is useful, but its stated scope omits the requested comparison.'}));
 assert.equal(partial.outcome,'partial');assert.deepEqual(Object.values(partial.dispatched),[false,false,false,false]);assert.equal(await starts(),1);
 const request={mode:'improve',question:'Add the missing web accessibility comparison.',scope:'W3C introductory guidance only. Compare inclusive access and exclusion. Reuse selected historical note; do not recheck old evidence.',language:'en',
  references:[{reportId:c.id,expectedRevision:c.revision,selection:{startByte:0,endByte:104}}],
  improvement:{base:{reportId:c.id,expectedRevision:c.revision},disposition:'same_report',gaps:['Compare inclusive access with exclusionary design using new evidence only.'],oldSourceChecks:[]}};
 const improved=await commission(h,request,'Explicitly fill this missing comparison in the same report at the exact selected base revision. Reuse the dated old material without rechecking it. No publication.','improvement');
 assert.equal(await starts(),2);assert.equal(improved.proposal.metadata.researched_at,null);assert.deepEqual(improved.proposal.metadata.origin,meta.origin);
 assert.ok(improved.proposal.metadata.last_improved_at);assert.notEqual(fresh.done.jobId,improved.done.jobId);await close(h);
 assert.deepEqual(await fs.readFile(join(archiveRoot,'INDEX.json')),beforeIndex);assert.deepEqual(await fs.readFile(join(archiveRoot,'reports',meta.id+'.md')),beforeReport);
 const traces=await packets();assert.equal(traces.filter(s=>s==='accept_research_draft').length,0);assert.equal(traces.filter(s=>s==='synthetic_source').length,2);
 assert.equal(await fs.readFile(network,'utf8').catch(e=>e.code==='ENOENT'?'':Promise.reject(e)),'');assert.equal(dialogs,0);
 console.log(JSON.stringify({actualSdk:'0.84.2',installedAdapter:true,productionMcp:true,partialThenExplicitSameReportImprovement:true,successfulEmptyThenExplicitNewRequest:true,
  coveredOrNoMatchDispatchesResearch:false,originalDateAndOriginPreserved:true,improvementDateRecorded:true,independentJobIdentities:true,
  investigatorAndHostTransport:'synthetic',realProviderCalls:0,realSourceCalls:0,realHumanConsentAttested:false,publicationPerformed:false,
  acceptedBaselineUnchanged:true,maxVisibleBytes,retainedFixtureRoot:root}));
}finally{for(const session of sessions){await session.extensionRunner.emit({type:'session_shutdown',reason:'quit'});session.dispose();}}
