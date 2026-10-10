// 열관류율 매뉴얼 화면 캡처 — usage: node capture_uval.js <repoDir> <outDir>
// EPI·RTS 매뉴얼과 같은 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표) · _example.json(예제 검증값)
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8893;
/* 예제 = 앱 초기값: 중부2지역 · 거실의 외벽 · 외기 직접 · 공동주택 외 / 몰탈20 + XPS 1종 A-1 155 + RC200 + 몰탈20 → ΣR 6.268 · U 0.160 ≤ 0.240 적합 */
const FREEZE=`(()=>{const T=new Date(2026,9,10,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear()}catch(e){}})()`;
const SETNUM=`window.__setNum=(layerIdx,which,val)=>{const c=document.querySelectorAll('.layer-card')[layerIdx];const el=c.querySelectorAll('input.finput.mono')[which];const st=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;st.call(el,String(val));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));};
window.__setSearch=(v)=>{const el=document.querySelector('.mat-wrap input');const st=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;st.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
window.__tab=(i)=>document.querySelectorAll('.tb')[i].click();
window.__modal=(open,i)=>{const ov=document.querySelector('.fml-overlay');if(open&&!ov)document.querySelectorAll('.help-fab')[1].click();if(!open&&ov){const x=[...ov.querySelectorAll('button')].find(b=>b.textContent.trim()==='✕');x&&x.click();}};
window.__mtab=(t)=>{const ov=document.querySelector('.fml-overlay');const b=[...ov.querySelectorAll('button')].find(b=>b.textContent.includes(t));b&&b.click();};`;
const TAB={input:0,a4:1,mat:2,rts:3};
const SHOTS=[
 {id:'s01_overview',tab:'input',clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar-wrap','요약 스트립'],['card:검토 조건 설정','검토 조건'],['card:실시간 산출 결과','산출 결과'],['card:부위별 상세 산출 근거','산출 근거'],['#fab-group','초기화·계산식 안내']]},
 {id:'s02_tabs',tab:'input',clip:'.app-header',m:[['.tb:nth-child(1)','검토 조건 입력'],['.tb:nth-child(2)','A4 미리보기'],['.tb:nth-child(3)','재료별 열전도율'],['.tb:nth-child(4)','RTS 부하계산 연계'],['.tb-manual','매뉴얼'],['.hdr-right','근거 고시']]},
 {id:'s03_config',tab:'input',clip:'card:검토 조건 설정',m:[['input:0','프로젝트명'],['input:1','설계자'],['select:0','지역 구분'],['select:1','건축 부위'],['select:2','외기 조건'],['select:3','용도/난방 여부'],['text~법적기준','법적 기준'],['.t-grid','별표3 허용 두께'],['text:📤','RTS 전송']]},
 {id:'s04_layers',tab:'input',clip:'card:단열·재료 구성',maxH:396,m:[['.btn-add','레이어 추가'],['.layer-card select:nth-of-type(1)','대분류'],['lsel:1','중분류'],['lsel:2','재료'],['lin:0','두께'],['lin:1','열전도율'],['.layer-card div.finput.mono','열저항 R'],['ldel','삭제']]},
 {id:'s05_result',tab:'input',clip:'card:실시간 산출 결과',m:[['.vc-n','법적 기준'],['.vc-a','설계값'],['.vc-p','판정'],['.fml-box-lg','산출식']]},
 {id:'s06_detail',tab:'input',clip:'card:부위별 상세 산출 근거',m:[['row:0','실외 표면저항'],['row:2','재료층'],['row:5','실내 표면저항'],['row:6','총 열저항']]},
 {id:'s07_fail',tab:'input',pre:"__setNum(1,0,80)",post:"__setNum(1,0,155)",clip:'viewport',m:[['.sum-bar-wrap','요약 스트립 판정'],['.vc-a','설계값'],['.v3 .vc:nth-child(3)','판정'],['.t-grid','별표3 허용 두께']]},
 {id:'s08_a4',tab:'a4',clip:'viewport',m:[['.mm-btn-print','인쇄 / PDF 저장'],['#btn-jpg','JPG 저장'],['#a4Page .a4-tit','A4 계산서']]},
 {id:'s09_a4page',tab:'a4',clip:'#a4Page',cropBottom:'.a4-footer',m:[['.a4-head2','공사명·근거·작성'],['a4sub:1.','검토 조건'],['.a4-verdict','판정 결과'],['.a4-tbl','산출 근거'],['.a4-ubar','U 산출식'],['a4sub:4.','적용 기준']]},
 {id:'s10_material',tab:'mat',pre:"[...document.querySelectorAll('.mat-group-hd')][1].click()",clip:'viewport',m:[['.mat-wrap input','재료명 검색'],['text~가급','등급 범례'],['.mat-cat-bar','대분류'],['.mat-group-hd:nth-of-type(1)','중분류'],['mrow','재료·열전도율']]},
 {id:'s11_search',tab:'mat',pre:"[...document.querySelectorAll('.mat-cat-btn')].find(b=>b.textContent.includes('C.')).click();__setSearch('경량')",post:"__setSearch('');[...document.querySelectorAll('.mat-cat-btn')].find(b=>b.textContent.includes('K.')).click()",clip:'viewport',m:[['.mat-cat-btn.active','대분류 선택'],['.mat-wrap input','검색어']]},
 {id:'s12_rts',tab:'rts',clip:'.full-panel',m:[['text:📤','RTS 전송'],['text~RTS 계산 연계','연계 U값'],['text~연동 프로젝트','프로젝트 정보'],['text~부위별 열관류율 요약','부위별 요약'],['text~RTS 부하계산 수행 절차','수행 절차']]},
 {id:'s13_help',tab:'input',pre:"__modal(true)",clip:'viewport',m:[]},
 {id:'s14_help_formula',tab:null,pre:"__mtab('계산식')",clip:'viewport',m:[]},
 {id:'s15_help_surface',tab:null,pre:"__mtab('표면저항')",clip:'viewport',m:[]},
 {id:'s16_help_grade',tab:null,pre:"__mtab('단열등급')",clip:'viewport',m:[]},
 {id:'s17_help_region',tab:null,pre:"__mtab('지역 구분')",post:"__modal(false)",clip:'viewport',m:[]},
];
const FIND=`window.__find=(sel)=>{const vis=e=>e&&e.getClientRects().length>0;
 if(sel.startsWith('card:')){const t=sel.slice(5);const h=[...document.querySelectorAll('.card-head')].find(e=>vis(e)&&e.textContent.includes(t));return h?h.parentElement:null;}
 if(sel.startsWith('input:')){return document.querySelectorAll('.card input.finput:not(.mono)')[+sel.slice(6)]||null;}
 if(sel.startsWith('select:')){const c=[...document.querySelectorAll('.card-head')].find(e=>e.textContent.includes('검토 조건 설정')).parentElement;return c.querySelectorAll('select')[+sel.slice(7)]||null;}
 if(sel.startsWith('lsel:')){return document.querySelector('.layer-card').querySelectorAll('select')[+sel.slice(5)]||null;}
 if(sel.startsWith('lin:')){return document.querySelector('.layer-card').querySelectorAll('input.finput.mono')[+sel.slice(4)]||null;}
 if(sel==='ldel'){return [...document.querySelector('.layer-card').querySelectorAll('button')].find(b=>b.textContent.trim()==='✕')||null;}
 if(sel.startsWith('row:')){return document.querySelectorAll('.rtbl tr')[+sel.slice(4)+1]||document.querySelector('.rtbl tfoot tr')||null;}
 if(sel.startsWith('a4sub:')){const t=sel.slice(6);return [...document.querySelectorAll('#a4Page .a4-sub')].find(e=>e.textContent.trim().startsWith(t))||null;}
 if(sel==='mrow'){return [...document.querySelectorAll('.mat-wrap table tr, .mat-wrap .mat-row')].filter(vis)[1]||[...document.querySelectorAll('.mat-wrap table')].filter(vis)[0]||null;}
 if(sel.startsWith('text~')){const t=sel.slice(5);const els=[...document.querySelectorAll('div,span,b,strong,td,th,label')].filter(e=>vis(e)&&e.textContent.includes(t));return els.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||null;}
 if(sel.startsWith('text:')){const t=sel.slice(5);const els=[...document.querySelectorAll('button,a')].filter(e=>vis(e)&&e.textContent.trim().startsWith(t));return els.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||null;}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(vis);if(e)return e;}return null;};`;
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(3000);
 await pg.evaluate(SETNUM+FIND);
 const readEx=()=>pg.evaluate(()=>{const q=s=>(document.querySelector(s)||{}).innerText||'';return {sum:q('.sum-bar-wrap').replace(/\s+/g,' ').trim(),std:q('.vc-n').replace(/\s+/g,' ').trim(),u:q('.vc-a').replace(/\s+/g,' ').trim(),verdict:q('.vc-p').replace(/\s+/g,' ').trim(),formula:q('.fml-box-lg').replace(/\s+/g,' ').trim(),tgrid:q('.t-grid').replace(/\s+/g,' ').trim(),rows:[...document.querySelectorAll('.rtbl tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim())};});
 const example=await readEx();let fail=null;
 const meta={};
 for(const S of SHOTS){
  if(S.tab){await pg.evaluate(i=>{__tab(i);window.scrollTo(0,0);},TAB[S.tab]);await pg.waitForTimeout(700);}
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||600);
  if(S.id==='s07_fail')fail=await readEx();
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.cropBottom){const e2=__find(S.cropBottom);if(e2){const a2=abs(e2);clip.height=Math.min(clip.height,a2.y+a2.h+28-clip.y);}}
     if(S.maxH&&clip.height>S.maxH)clip.height=S.maxH;}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=__find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(a.w/clip.width*100).toFixed(2),h:+(a.h/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(cl.height),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){}await pg.waitForTimeout(300);}
 }
 const after=await readEx();
 // 모바일 2장 (390×844 · DSF 2)
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(3000);
 await mp.screenshot({path:path.join(out,'s18_mobile_main.png')});meta['s18_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{const h=[...document.querySelectorAll('.card-head')].find(e=>e.textContent.includes('실시간 산출 결과'));window.scrollTo(0,h.getBoundingClientRect().top+scrollY-110);});await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s19_mobile_result.png')});meta['s19_mobile_result']={w:390,h:844,marks:[]};
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));
 fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify({example,fail,after},null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x>100||m.y>100)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y);}));
 console.log(JSON.stringify({example,fail,same:JSON.stringify(example)===JSON.stringify(after),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();
