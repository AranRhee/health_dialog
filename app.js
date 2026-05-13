/* ════════════ Timer ════════════ */
const CIRC = 2*Math.PI*15;
let timerInterval=null, timerSecs=60;
function startTimer(){
  stopTimer(); timerSecs=60; updateTimerUI();
  document.getElementById('timer-float').classList.remove('hidden');
  timerInterval=setInterval(()=>{
    timerSecs--;
    if(timerSecs<=0){ timerSecs=0; updateTimerUI(); stopTimer(); if(navigator.vibrate)navigator.vibrate([150,80,150]); }
    else updateTimerUI();
  },1000);
}
function stopTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
  document.getElementById('timer-float').classList.add('hidden');
}
function updateTimerUI(){
  const pct=timerSecs/60;
  document.getElementById('t-prog').style.strokeDashoffset=CIRC*(1-pct);
  document.getElementById('t-num').textContent=timerSecs;
  const m=String(Math.floor(timerSecs/60)).padStart(2,'0'), s=String(timerSecs%60).padStart(2,'0');
  document.getElementById('t-big').textContent=m+':'+s;
}
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
}

/* ════════════ Default Routine ════════════ */
const DEFAULT_DAYS=[
  {
    label:'월요일',short:'월요일',sub:'Push',title:'하체 & 가슴 중심',theme:'Push Day',
    exercises:[
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'15분, 가벼운 강도'},
      {name:'시티드 레그프레스',tag:'하체',tagClass:'tag-lower',reps:15,sets:3,note:'발 위치를 높게 두어 무릎 부담을 줄입니다.',defaultWeight:0,defaultReps:15},
      {name:'체스트 프레스',tag:'가슴',tagClass:'tag-upper',reps:12,sets:3,note:'',defaultWeight:0,defaultReps:12},
      {name:'숄더 프레스',tag:'어깨',tagClass:'tag-upper',reps:12,sets:3,note:'',defaultWeight:0,defaultReps:12},
      {name:'힙 어브덕션 (바깥쪽)',tag:'하체',tagClass:'tag-lower',reps:20,sets:3,note:'중둔근 강화로 무릎 안정성을 돕습니다.',defaultWeight:0,defaultReps:20},
      {name:'덤벨 암컬 & 크런치 머신',tag:'팔/복근',tagClass:'tag-core',reps:15,sets:3,note:'',defaultWeight:0,defaultReps:15},
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'20분, 중간 강도'},
    ]
  },
  {
    label:'수요일',short:'수요일',sub:'Pull',title:'등 & 어깨 중심',theme:'Pull Day',
    exercises:[
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'15분'},
      {name:'랫풀다운',tag:'등',tagClass:'tag-upper',reps:12,sets:3,note:'',defaultWeight:0,defaultReps:12},
      {name:'시티드 로우',tag:'등',tagClass:'tag-upper',reps:12,sets:3,note:'허리가 굽지 않게 복압을 유지합니다.',defaultWeight:0,defaultReps:12},
      {name:'펙덱 플라이',tag:'가슴',tagClass:'tag-upper',reps:15,sets:3,note:'',defaultWeight:0,defaultReps:15},
      {name:'레터럴 레이즈 머신',tag:'어깨',tagClass:'tag-upper',reps:15,sets:3,note:'',defaultWeight:0,defaultReps:15},
      {name:'시티드 레그 익스텐션',tag:'하체',tagClass:'tag-lower',reps:20,sets:2,note:'가장 가벼운 무게 / 재활 목적으로 천천히 수행합니다.',defaultWeight:0,defaultReps:20},
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'20분, 인터벌 (1분 빠르게 + 2분 보통)'},
    ]
  },
  {
    label:'금요일',short:'금요일',sub:'Balance',title:'하체 & 어깨 후면',theme:'Balance Day',
    exercises:[
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'15분'},
      {name:'힙 어덕션 (안쪽)',tag:'하체',tagClass:'tag-lower',reps:20,sets:3,note:'',defaultWeight:0,defaultReps:20},
      {name:'시티드 레그 컬',tag:'하체',tagClass:'tag-lower',reps:15,sets:3,note:'무릎 뒤쪽 근육을 강화하여 관절을 보호합니다.',defaultWeight:0,defaultReps:15},
      {name:'리어 델토이드',tag:'어깨',tagClass:'tag-upper',reps:15,sets:3,note:'어깨 후면과 등 상부를 함께 강화합니다.',defaultWeight:0,defaultReps:15},
      {name:'덤벨 스쿼트',tag:'전신',tagClass:'tag-lower',reps:12,sets:3,note:'덤벨을 가슴 앞에 들고 허리를 세운 채 내려갑니다.',defaultWeight:0,defaultReps:12},
      {name:'크런치 머신',tag:'복근',tagClass:'tag-core',reps:20,sets:3,note:'',defaultWeight:0,defaultReps:20},
      {name:'좌식 사이클',tag:'유산소',tagClass:'tag-cardio',reps:0,sets:0,note:'30분, 일정한 속도로 체지방 연소'},
    ]
  }
];

/* ════════════ Alpine App ════════════ */
function app(){
  const TODAY=new Date();
  const DOW=TODAY.getDay();
  const tabMap={1:0,3:1,5:2};
  const defaultTab=tabMap[DOW]!==undefined?tabMap[DOW]:0;
  const dateKey=TODAY.toISOString().slice(0,10);

  const TAG_OPTIONS=[
    {value:'하체',label:'하체',emoji:'🦵',cls:'tag-lower'},
    {value:'가슴',label:'가슴',emoji:'💪',cls:'tag-upper'},
    {value:'등',label:'등',emoji:'🔙',cls:'tag-upper'},
    {value:'어깨',label:'어깨',emoji:'🏋️',cls:'tag-upper'},
    {value:'팔/복근',label:'팔/복근',emoji:'💥',cls:'tag-core'},
    {value:'유산소',label:'유산소',emoji:'🚴',cls:'tag-cardio'},
    {value:'전신',label:'전신',emoji:'⚡',cls:'tag-lower'},
    {value:'복근',label:'복근',emoji:'🎯',cls:'tag-core'},
    {value:'기타',label:'기타',emoji:'➕',cls:'tag-etc'},
  ];

  return {
    days:[],
    activeTab:defaultTab,
    todayStr:TODAY.toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'}),
    workoutData:{},
    smartDefaults:{},
    editMode:false,
    tagOptions:TAG_OPTIONS,
    modalOpen:false,
    modalEditIdx:-1,
    modalForm:{name:'',tag:'하체',tagClass:'tag-lower',sets:3,reps:12,defaultWeight:'',defaultReps:'',note:''},
    settingsOpen:false,
    jsonPanelOpen:false,
    jsonMode:'export',
    jsonText:'',

    /* ── init ── */
    init(){
      const savedRoutine=localStorage.getItem('wt3_routine');
      this.days=savedRoutine?JSON.parse(savedRoutine):JSON.parse(JSON.stringify(DEFAULT_DAYS));
      const saved=localStorage.getItem('wt3_'+dateKey);
      if(saved){try{this.workoutData=JSON.parse(saved);}catch(e){}}
      const savedDef=localStorage.getItem('wt3_def_'+dateKey);
      if(savedDef){try{this.smartDefaults=JSON.parse(savedDef);}catch(e){}}
      const savedTab=localStorage.getItem('wt3_tab_'+dateKey);
      if(savedTab!==null)this.activeTab=parseInt(savedTab);
    },

    /* ── storage ── */
    key(d,e,f){return d+'_'+e+'_'+f;},
    getData(d,e,f){return this.workoutData[this.key(d,e,f)]||'';},
    setData(d,e,f,v){this.workoutData[this.key(d,e,f)]=v;this.saveWorkout();},

    saveWorkout(){
      localStorage.setItem('wt3_'+dateKey,JSON.stringify(this.workoutData));
      localStorage.setItem('wt3_def_'+dateKey,JSON.stringify(this.smartDefaults));
      localStorage.setItem('wt3_tab_'+dateKey,this.activeTab);
    },
    saveRoutine(){
      localStorage.setItem('wt3_routine',JSON.stringify(this.days));
      localStorage.setItem('wt3_tab_'+dateKey,this.activeTab);
    },

    /* ── Smart Default helpers ── */
    defKey(d,e){return d+'_'+e;},

    effectiveDefaultWeight(d,e){
      const ex=this.days[d].exercises[e];
      const sd=this.smartDefaults[this.defKey(d,e)];
      if(sd && sd.weight!=null && sd.weight!=='') return sd.weight;
      if(ex.defaultWeight!=null && ex.defaultWeight!=='') return ex.defaultWeight;
      return null;
    },
    effectiveDefaultReps(d,e){
      const ex=this.days[d].exercises[e];
      const sd=this.smartDefaults[this.defKey(d,e)];
      if(sd && sd.reps!=null && sd.reps!=='') return sd.reps;
      if(ex.defaultReps!=null && ex.defaultReps!=='') return ex.defaultReps;
      return null;
    },

    getDisplayWeight(d,e,s){
      const real=this.getData(d,e,'weight_'+s);
      if(real!=='') return real;
      const def=this.effectiveDefaultWeight(d,e);
      return (def!=null && def!==0 && def!=='') ? def : '';
    },
    getDisplayReps(d,e,s){
      const real=this.getData(d,e,'reps_'+s);
      if(real!=='') return real;
      const ex=this.days[d].exercises[e];
      const sd=this.smartDefaults[this.defKey(d,e)];
      if(sd && sd.reps!=null && sd.reps!=='') return sd.reps;
      if(ex.defaultReps!=null && ex.defaultReps!=='') return ex.defaultReps;
      if(ex.reps) return ex.reps;
      return '';
    },

    getActiveSet(d,e){
      const ex=this.days[d].exercises[e];
      for(let s=0;s<ex.sets;s++){
        if(!this.workoutData[this.key(d,e,'set_'+s)]) return s;
      }
      return -1;
    },

    getSetDone(d,e,s){
      return !!this.workoutData[this.key(d,e,'set_'+s)];
    },

    /* ── Input event handlers ── */
    onInputFocus(ev, d, e, s, field){
      ev.target.select();
    },

    onWeightInput(ev, d, e, s){
      const val=ev.target.value;
      this.setData(d,e,'weight_'+s, val);
    },
    onRepsInput(ev, d, e, s){
      const val=ev.target.value;
      this.setData(d,e,'reps_'+s, val);
    },

    onInputBlur(ev, d, e, s, field){
      if(ev.target.value==='' || ev.target.value===null){
        this.workoutData[this.key(d,e,(field==='weight'?'weight_':'reps_')+s)]='';
        this.saveWorkout();
      }
    },

    /* ── Toggle set completion + carry-over logic ── */
    toggleSet(d,e,s,ex){
      const k=this.key(d,e,'set_'+s);
      const nowDone=!this.workoutData[k];
      this.workoutData[k]=nowDone;

      if(nowDone){
        const usedWeight = this.getData(d,e,'weight_'+s) || this.getDisplayWeight(d,e,s);
        const usedReps   = this.getData(d,e,'reps_'+s)   || this.getDisplayReps(d,e,s);

        if(this.getData(d,e,'weight_'+s)==='') this.workoutData[this.key(d,e,'weight_'+s)]=usedWeight;
        if(this.getData(d,e,'reps_'+s)==='')   this.workoutData[this.key(d,e,'reps_'+s)]=usedReps;

        const defK=this.defKey(d,e);
        if(!this.smartDefaults[defK]) this.smartDefaults[defK]={};
        this.smartDefaults[defK].weight = usedWeight!=='' ? usedWeight : this.smartDefaults[defK].weight;
        this.smartDefaults[defK].reps   = usedReps!==''   ? usedReps   : this.smartDefaults[defK].reps;

        startTimer();
      } else {
        stopTimer();
      }
      this.saveWorkout();
    },

    /* ── Progress ── */
    completedSets(){
      let c=0;
      this.days[this.activeTab].exercises.forEach((ex,ei)=>{
        for(let s=0;s<ex.sets;s++) if(this.workoutData[this.key(this.activeTab,ei,'set_'+s)]) c++;
      });
      return c;
    },
    totalSets(){return this.days[this.activeTab].exercises.reduce((a,ex)=>a+ex.sets,0);},
    progressPct(){const t=this.totalSets();return t>0?Math.round(this.completedSets()/t*100):0;},

    /* ── Edit mode ── */
    toggleEditMode(){this.editMode=!this.editMode;if(!this.editMode)stopTimer();},

    /* ── Modal ── */
    openAddModal(){
      this.modalEditIdx=-1;
      this.modalForm={name:'',tag:'하체',tagClass:'tag-lower',sets:3,reps:12,defaultWeight:'',defaultReps:'',note:''};
      this.modalOpen=true;
    },
    openEditModal(exIdx){
      this.modalEditIdx=exIdx;
      const ex=this.days[this.activeTab].exercises[exIdx];
      this.modalForm={
        name:ex.name,tag:ex.tag,tagClass:ex.tagClass,
        sets:ex.sets,reps:ex.reps,
        defaultWeight:ex.defaultWeight||'',
        defaultReps:ex.defaultReps||'',
        note:ex.note||''
      };
      this.modalOpen=true;
    },
    saveModal(){
      if(!this.modalForm.name.trim()) return;
      const found=this.tagOptions.find(o=>o.value===this.modalForm.tag);
      const entry={
        name:this.modalForm.name.trim(),
        tag:this.modalForm.tag,
        tagClass:found?found.cls:'tag-etc',
        reps:this.modalForm.reps,
        sets:this.modalForm.sets,
        defaultWeight:this.modalForm.defaultWeight!==''?Number(this.modalForm.defaultWeight):null,
        defaultReps:this.modalForm.defaultReps!==''?Number(this.modalForm.defaultReps):null,
        note:this.modalForm.note.trim()
      };
      if(this.modalEditIdx===-1){
        this.days[this.activeTab].exercises.push(entry);
        showToast('✅ 운동이 추가되었어요!');
      } else {
        this.days[this.activeTab].exercises[this.modalEditIdx]=entry;
        showToast('✅ 수정되었어요!');
      }
      this.saveRoutine();
      this.modalOpen=false;
    },

    deleteEx(exIdx){
      if(!confirm('이 운동을 삭제할까요?')) return;
      this.days[this.activeTab].exercises.splice(exIdx,1);
      this.saveRoutine();
      showToast('🗑 삭제되었어요.');
    },
    moveEx(exIdx,dir){
      const arr=this.days[this.activeTab].exercises;
      const newIdx=exIdx+dir;
      if(newIdx<0||newIdx>=arr.length) return;
      [arr[exIdx],arr[newIdx]]=[arr[newIdx],arr[exIdx]];
      this.saveRoutine();
    },

    /* ── Copy to clipboard ── */
    copyToClipboard(){
      const day=this.days[this.activeTab];
      let lines=[];
      lines.push('📅 '+this.todayStr+' 운동 기록');
      lines.push('📌 '+day.title+' ('+day.theme+')');
      lines.push('');
      day.exercises.forEach((ex,ei)=>{
        lines.push('▶ '+ex.name+' ['+ex.tag+']');
        if(ex.sets>0){
          let doneCount=0;
          for(let s=0;s<ex.sets;s++){
            const done=!!this.workoutData[this.key(this.activeTab,ei,'set_'+s)];
            const w=this.getData(this.activeTab,ei,'weight_'+s)||this.getDisplayWeight(this.activeTab,ei,s);
            const r=this.getData(this.activeTab,ei,'reps_'+s)||this.getDisplayReps(this.activeTab,ei,s);
            if(done) doneCount++;
            const wLabel=w!==''&&w!==null?w+'kg':'-';
            const rLabel=r!==''&&r!==null?r+'회':'-';
            lines.push('  세트'+(s+1)+': '+wLabel+' / '+rLabel+' '+(done?'✓':'○'));
          }
          lines.push('  완료: '+doneCount+'/'+ex.sets+'세트');
          const fb=this.getData(this.activeTab,ei,'feedback');
          if(fb) lines.push('  난이도: '+fb);
        } else {
          lines.push('  → '+(ex.note||'유산소'));
        }
        lines.push('');
      });
      lines.push('─────────────────');
      lines.push('총 완료: '+this.completedSets()+' / '+this.totalSets()+'세트 ('+this.progressPct()+'%)');
      navigator.clipboard.writeText(lines.join('\n'))
        .then(()=>showToast('✅ 클립보드에 복사됐어요!'))
        .catch(()=>showToast('❌ 복사 실패 — 직접 선택해 주세요'));
    },

    resetConfirm(){
      if(confirm('오늘 기록을 모두 초기화할까요?')){
        this.workoutData={};
        this.smartDefaults={};
        this.saveWorkout();
        stopTimer();
        showToast('🗑 초기화 완료');
      }
    },

    exportJSON(){return JSON.stringify(this.days,null,2);},
    copyJSON(){
      navigator.clipboard.writeText(this.jsonText)
        .then(()=>showToast('📋 JSON이 복사됐어요!'))
        .catch(()=>showToast('❌ 복사 실패'));
    },
    importJSON(){
      try{
        const parsed=JSON.parse(this.jsonText);
        if(!Array.isArray(parsed)) throw new Error('배열 형식이어야 합니다.');
        this.days=parsed;
        this.saveRoutine();
        this.jsonPanelOpen=false;
        this.settingsOpen=false;
        showToast('✅ 루틴을 가져왔어요!');
      }catch(e){
        showToast('❌ JSON 형식 오류: '+e.message);
      }
    },
    resetRoutineConfirm(){
      if(confirm('기본 루틴으로 초기화할까요? 커스텀 운동이 모두 삭제됩니다.')){
        this.days=JSON.parse(JSON.stringify(DEFAULT_DAYS));
        this.saveRoutine();
        this.settingsOpen=false;
        showToast('🔄 기본 루틴으로 초기화했어요.');
      }
    }
  };
}
