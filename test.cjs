const fs=require('fs'),vm=require('vm'),assert=require('assert');const html=fs.readFileSync(__dirname+'/index.html','utf8'),code=html.split('<script>')[1].split('</script>')[0];
const nodes=new Map(),storage=new Map();function el(id){if(!nodes.has(id)){const classes=new Set();nodes.set(id,{value:'',textContent:id==='privateData'?'null':'',checked:false,classList:{add(x){classes.add(x)},remove(x){classes.delete(x)},toggle(x,on){on?classes.add(x):classes.delete(x)},contains(x){return classes.has(x)}},style:{},setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]},focus(){this.focused=true},insertAdjacentElement(){},add(){},replaceChildren(){},addEventListener(){},click(){}})}return nodes.get(id)}
const ctx={document:{getElementById:el,createElement:()=>el('download'),addEventListener(){}},window:{addEventListener(){}},localStorage:{setItem(k,v){storage.set(k,v)},getItem(k){return storage.get(k)||null}},Option:function(){},URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},Blob,Date,console,setTimeout,confirm:()=>true};vm.createContext(ctx);vm.runInContext(code,ctx);const run=s=>vm.runInContext(s,ctx);
run(`setPack({schema:'uav-record-pack-v1',sample_id:'TEST',sample_sha256:'testhash',people:['Ali Torabi','Md Omor Faruk','Abiam Asif Khalid'],adjudicator:'Abiam Asif Khalid',return_folders:{},records:Array.from({length:100},(_,i)=>({sample_id:'TEST'+i,record_id:'R'+i,title:'Synthetic test',abstract:'Test only'}))});$('person').value='Ali Torabi';start()`);
assert.equal(run('Object.keys(answers).length'),0);assert.throws(()=>run('validate()'),/Finish 100/);
run(`$('decision').value='Uncertain';$('route').value='Unclear';$('rationale').value='Synthetic test';$('evidence').value='Test abstract';$('seconds').value='10';$('assistance').value='None';finish()`);assert.equal(run('idx'),1);assert.equal(run('visibleIndexes().includes(0)'),false);assert.equal(run('!!answers.TEST0.finished_at'),true);
// Finish second record, diagnose missing assistance, and preserve the first.
const first=run("JSON.stringify(payload('DRAFT').answers[0])");
run(`$('decision').value='Include';$('route').value='A';$('rationale').value='Crop-state updating [1]';$('evidence').value='Abstract: [crop observations]';$('seconds').value='';finish()`);
assert.equal(run('idx'),1);assert.equal(el('assistance')['aria-invalid'],'true');assert.equal(el('assistance').focused,true);
assert.equal(run("JSON.stringify(payload('DRAFT').answers[0])"),first);
run(`$('assistance').value='None';finish()`);assert.equal(run('idx'),2);assert.equal(run('!!answers.TEST1.finished_at'),true);
assert.equal(el('assistance')['aria-invalid'],undefined);
const backup=run('JSON.stringify(payload("DRAFT"))');
run('start()');assert.equal(run('idx'),2);assert.equal(run("JSON.stringify(payload('DRAFT').answers[0])"),first);
ctx.backup=JSON.parse(backup);ctx.backup.app_version=2;run('restore(backup)');assert.equal(run('idx'),2);
assert.equal(run("JSON.stringify(payload('DRAFT').answers[0])"),first);
assert.equal(run('answers.TEST1.evidence'),'Abstract: [crop observations]');
for(const [field,value] of [['decision',''],['route',''],['rationale',''],['evidence',''],['assistance',''],['seconds','-1']]){
 ctx.sample={decision:'Include',route:'A',rationale:'Crop method [2]',evidence:'Abstract [3]',assistance:'None',seconds:'', [field]:value};
 assert(run('fieldErrors(sample)').some(e=>e.field===field),field);
}
assert(run(`fieldErrors({decision:'Exclude',route:'Unclear',rationale:'Outside scope',evidence:'Title',assistance:'None',seconds:''})`).some(e=>e.field==='reason'));
assert(run(`fieldErrors({decision:'Include',route:'A',rationale:'This fits [describe the crop/UAV link and mechanism or decision]',evidence:'Abstract',assistance:'None'})`).some(e=>e.field==='rationale'));
run(`$('queueView').value='all';render();go(0);go(1)`);assert.equal(run('!!answers.TEST0.finished_at'),true);
run(`go(0);$('rationale').value='Changed test';capture()`);assert.equal(run('!!answers.TEST0.finished_at'),false);run('finish()');assert.equal(run('!!answers.TEST0.finished_at'),true);
run(`$('person').value='Md Omor Faruk';start()`);assert.equal(run('idx'),0);assert.equal(run('Object.keys(answers).length'),0);
run(`$('person').value='FNU Dayan';start()`);assert.equal(run('assigned().length'),34);assert.equal(run('idx'),0);assert.equal(run('stage()'),'metadata_verification');
run(`$('person').value='Sanjog Gaihre';start()`);assert.equal(run('assigned().length'),33);assert.equal(run('idx'),34);
run(`$('person').value='Muhammad Mujahid Iqbal';start()`);assert.equal(run('assigned().length'),33);assert.equal(run('idx'),67);assert.equal(run('payload("DRAFT").answers.length'),33);
assert.throws(()=>run(`validSubmission({...payload('DRAFT'),reviewer:'Ali Torabi'},person)`),/Wrong reviewer/);
assert.equal(run(`complete({decision:'Verified',route:'Publisher',rationale:'[correct information]',evidence:'Page',assistance:'None',seconds:''})`),false);
run(`assigned().forEach(r=>answers[r.sample_id]={decision:'Verified',route:'Publisher',rationale:'Test matched',evidence:'Test source',assistance:'None',seconds:'',finished_at:'test'});render();$('declare').checked=true;validate()`);assert.equal(run('visibleIndexes().length'),0);assert.equal(run('payload("COMPLETED").answers.length'),33);
assert(!html.includes('R000772'));assert(!html.includes('1q7sPT'));console.log('PASS: blank human fields, independent A/B queues, disjoint 34/33/33 support assignments, finished hiding without deletion, correction reopening, assignment exports, template rejection, public/private separation.');
