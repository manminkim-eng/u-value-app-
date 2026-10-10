// 검증: 앱 U_STD·T_STD ↔ 매뉴얼 4장 표(LawMCP 원문에서 옮긴 값) · 예제 수치 · 표시점 범위
const fs=require('fs');const repo=process.argv[2];
const s=fs.readFileSync(repo+'/index.html','utf8');let U_STD,T_STD;
eval(s.slice(s.indexOf('const U_STD='),s.indexOf('const DB={')).replace('const U_STD=','U_STD=').replace('const T_STD=','T_STD='));
const h=fs.readFileSync(repo+'/manual/index.html','utf8');const txt=h.replace(/<[^>]+>/g,'|').replace(/\|+/g,'|');
const R=['중부1지역','중부2지역','남부지역','제주도'];
const rowsU=[['거실의 외벽','외기에 직접 면하는 경우','공동주택','외기 직접 · 공동주택'],['거실의 외벽','외기에 직접 면하는 경우','공동주택 외','외기 직접 · 공동주택 외'],['거실의 외벽','외기에 간접 면하는 경우','공동주택','외기 간접 · 공동주택'],['거실의 외벽','외기에 간접 면하는 경우','공동주택 외','외기 간접 · 공동주택 외'],
['최상층 거실 반자/지붕','외기에 직접 면하는 경우','해당없음','외기 직접'],['최상층 거실 반자/지붕','외기에 간접 면하는 경우','해당없음','외기 간접'],
['최하층 거실 바닥','외기에 직접 면하는 경우','바닥난방인 경우','외기 직접 · 바닥난방'],['최하층 거실 바닥','외기에 직접 면하는 경우','바닥난방이 아닌 경우','외기 직접 · 바닥난방 아님'],['최하층 거실 바닥','외기에 간접 면하는 경우','바닥난방인 경우','외기 간접 · 바닥난방'],['최하층 거실 바닥','외기에 간접 면하는 경우','바닥난방이 아닌 경우','외기 간접 · 바닥난방 아님'],['바닥난방인 층간바닥','해당없음','해당없음','—']];
const rowsT=['외벽 · 직접 · 공동주택','외벽 · 직접 · 공동주택 외','외벽 · 간접 · 공동주택','외벽 · 간접 · 공동주택 외','지붕 · 직접','지붕 · 간접','바닥 · 직접 · 바닥난방','바닥 · 직접 · 난방 아님','바닥 · 간접 · 바닥난방','바닥 · 간접 · 난방 아님','바닥난방인 층간바닥'];
let badU=0,badT=0,nU=0,nT=0;
const sec42=txt.slice(txt.indexOf('4-2. 별표1 열관류율 기준'),txt.indexOf('4-3. 지역 구분',txt.indexOf('4-2. 별표1 열관류율 기준')));
const sec46=txt.slice(txt.lastIndexOf('별표3 — 단열재의 두께'),txt.lastIndexOf('4-7. 적용 시점'));
rowsU.forEach((r,i)=>{const app=R.map(g=>U_STD[g][r[0]][r[1]][r[2]].toFixed(3)).join('|');nU+=4;if(!sec42.includes('|'+r[3]+'|'+app+'|')){badU++;console.log('U mismatch',r.join('/'),app);}
 const appT=R.map(g=>T_STD[g][r[0]][r[1]][r[2]].join('/')).join('|');nT+=16;if(!sec46.includes(rowsT[i]+'|'+appT+'|')){badT++;console.log('T mismatch',rowsT[i],appT);}});
const ex=JSON.parse(fs.readFileSync(repo+'/manual/_tools/_example.json','utf8'));const mk=JSON.parse(fs.readFileSync(repo+'/manual/images/_marks.json','utf8'));
let out=0,tot=0;Object.values(mk).forEach(v=>v.marks.forEach(m=>{tot++;if(m.miss||m.x<0||m.y<0||m.x>100||m.y>100||m.x+m.w>100.5||m.y+m.h>100.5)out++;}));
const figs=[...h.matchAll(/id="fig-(s\d+_[a-z_0-9]+)"[\s\S]*?<\/figure>/g)];let legBad=0;figs.forEach(f=>{const pins=(f[0].match(/class="pin"/g)||[]).length;const li=(f[0].match(/<li>/g)||[]).length;if(li&&pins!==li){legBad++;console.log('legend≠pins',f[1],pins,li);}});
const u=t=>1/(0.043+0.02/1.4*2+0.2/1.6+0.11+t/1000/0.026);
const C=[['별표1 기준값 44개: 앱 = 매뉴얼 4-2 표',badU===0,nU+'개'],['별표3 두께 176개: 앱 = 매뉴얼 4-6 표',badT===0,nT+'개'],
['예제 ΣR 6.268',ex.example.rows[7].includes('6.268')&&h.includes('6.268'),ex.example.rows[7]],['예제 U 0.160 · 기준 0.240 · 적합',ex.example.u.includes('0.160')&&ex.example.std.includes('0.240')&&ex.example.sum.includes('판정: 적합'),ex.example.sum],
['부적합 비교 80mm → 3.383 · 0.296',ex.fail.formula.includes('3.383')&&ex.fail.formula.includes('0.296')&&ex.fail.sum.includes('부적합'),ex.fail.formula],
['독립 계산 U(155)=0.160',u(155).toFixed(3)==='0.160',u(155).toFixed(5)],['독립 계산 U(100)=0.241 · U(101)=0.239',u(100).toFixed(3)==='0.241'&&u(101).toFixed(3)==='0.239',u(100).toFixed(4)+' / '+u(101).toFixed(4)],
['캡처 전후 예제 값 동일(복원)',JSON.stringify(ex.example)===JSON.stringify(ex.after),''],['표시점 '+tot+'개 모두 이미지 안',out===0,'벗어남 '+out],['그림 '+figs.length+'개 범례 수 = 번호 수',legBad===0,''],
['고시번호·시행일 표기',h.includes('제2026-360호(2026.7.8. 시행')&&h.includes('제2025-738호 2025.12.31. 시행'),'']];
console.log('| # | 항목 | 결과 | 비고 |\n|---|---|---|---|');C.forEach((c,i)=>console.log(`| ${i+1} | ${c[0]} | ${c[1]?'✓':'✗'} | ${c[2]} |`));
