import { useEffect, useRef } from "react";

/* ─── constants ─────────────────────────────────────── */
const ROWS=4, COLS=8, FSY=46, FORM_TOP=80;
const P_SPD=4, B_SPD=13, EB_SPD=3.8, FIRE_CD=18;
const ENEMY_R=11, PLAYER_R=12;
const ROW_COLOR=["#f5c800","#a78bfa","#818cf8","#22d3ee"];

type ES = "entering"|"formation"|"diving"|"dead";
type GS = "menu"|"controls"|"playing"|"challenging"|"gameover";

interface Enemy {
  x:number; y:number; formX:number; formY:number;
  state:ES; row:number; col:number;
  hp:number; maxHp:number; t:number; delay:number;
  ep:[number,number,number,number,number,number];
  dp:[number,number,number,number,number,number,number,number]|null;
  shootCd:number; flash:number;
  beaming:boolean; capturedShip:boolean;
}
interface CEnemy { x:number;y:number;t:number;delay:number;row:number;dead:boolean;
  p:[number,number,number,number,number,number,number,number]; }
interface Bullet  { x:number;y:number;vy:number;fp:boolean;dead?:boolean }
interface Spark   { x:number;y:number;vx:number;vy:number;life:number;max:number;color:string;r:number }

const bz=(p0:number,p1:number,p2:number,p3:number,t:number)=>{const m=1-t;return m*m*m*p0+3*m*m*t*p1+3*m*t*t*p2+t*t*t*p3};

/* ─── component ─────────────────────────────────────── */
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const K = useRef({ left:false, right:false, space:false });
  const menuNav = useRef(0);

  useEffect(()=>{
    const canvas=canvasRef.current!;
    const ctx=canvas.getContext("2d")!;
    const keys=K.current; // direct reference — mutations from pressBtn() are instantly visible
    let W=0,H=0,FSX=44,raf=0,frame=0;
    let gs:GS="menu", menuSel=0;
    let score=0,best=0,wave=1;
    let px=0,py=0,lives=3,fireCd=0,invTimer=0;
    let dualMode=false;
    let enemies:Enemy[]=[], bullets:Bullet[]=[], sparks:Spark[]=[];
    let formShift=0, formDir=1;
    let capturingBoss:Enemy|null=null;
    let captureFlash=0, rescueFlash=0;
    let cEnemies:CEnemy[]=[];
    let challengeHits=0, totalChallenge=0, challengeEndTimer=0;
    const STARS:{x:number;y:number;r:number;a:number;vy:number}[]=[];

    /* ── resize ─────────────────────────────────────── */
    const resize=()=>{
      const w=canvas.offsetWidth,h=canvas.offsetHeight;
      if(!w||!h) return;
      W=canvas.width=w; H=canvas.height=h;
      FSX=Math.max(32,Math.floor((W-40)/COLS));
      py=H-76; if(!px){px=W/2;}
      STARS.length=0;
      for(let i=0;i<120;i++) STARS.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+0.2,a:Math.random()*0.65+0.2,vy:Math.random()*0.15+0.05});
    };
    const ro=new ResizeObserver(resize); ro.observe(canvas);
    // initial size after first paint
    requestAnimationFrame(resize);

    /* ── helpers ────────────────────────────────────── */
    const fmX=(col:number)=>W/2-(COLS-1)*FSX/2+col*FSX;

    const initWave=()=>{
      enemies=[]; bullets=[]; sparks=[]; formShift=0; formDir=1; capturingBoss=null;
      for(let row=0;row<ROWS;row++){
        for(let col=0;col<COLS;col++){
          const fx=fmX(col),fy=FORM_TOP+row*FSY;
          const fr=col>=COLS/2; const sx=fr?W+80:-80,sy=fy*0.15-40;
          const cp1x=fr?W*0.70:W*0.30,cp1y=fy*0.45;
          const cp2x=fx+(fr?55:-55),cp2y=fy-28;
          enemies.push({x:sx,y:sy,formX:fx,formY:fy,state:"entering",row,col,
            hp:row===0?2:1,maxHp:row===0?2:1,t:0,delay:(ROWS-1-row)*28+col*4,
            ep:[sx,sy,cp1x,cp1y,cp2x,cp2y],dp:null,
            shootCd:100+Math.floor(Math.random()*150),flash:0,beaming:false,capturedShip:false});
        }
      }
    };

    const startGame=()=>{score=0;lives=3;wave=1;frame=0;dualMode=false;px=W/2;fireCd=0;invTimer=0;initWave();gs="playing";};

    const spawnChallenge=()=>{
      cEnemies=[]; challengeHits=0; challengeEndTimer=0;
      const groups=5,perGroup=8; totalChallenge=groups*perGroup;
      for(let g=0;g<groups;g++){
        const fromRight=g%2===0;
        for(let i=0;i<perGroup;i++){
          const delay=g*55+i*7;
          const sx=fromRight?W+60:-60,sy=H*0.08+i*22;
          const ex=fromRight?-60:W+60,ey=H*0.3+i*22;
          const cp1x=fromRight?W*0.65:W*0.35,cp1y=H*0.12;
          const cp2x=fromRight?W*0.30:W*0.65,cp2y=H*0.32+i*10;
          cEnemies.push({x:sx,y:sy,t:0,delay,row:g%4,dead:false,p:[sx,sy,cp1x,cp1y,cp2x,cp2y,ex,ey]});
        }
      }
      gs="challenging";
    };

    const dive=(e:Enemy,capture=false)=>{
      const tx=px+(Math.random()-0.5)*60;
      e.dp=[e.x,e.y,e.formX+(Math.random()-0.5)*280,H*0.28+Math.random()*H*0.22,
            tx+(Math.random()-0.5)*120,H*0.60+Math.random()*H*0.14,tx,H+90];
      e.state="diving"; e.t=0; e.beaming=capture;
    };

    const explode=(x:number,y:number,color:string,n=30)=>{
      for(let i=0;i<n;i++){
        const a=Math.random()*Math.PI*2,s=Math.random()*6+1.5,life=Math.floor(Math.random()*28+14);
        sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,life,max:life,color,r:Math.random()*3+1});
      }
    };

    /* ── drawing ────────────────────────────────────── */
    const drawBg=()=>{
      ctx.fillStyle="#04040e"; ctx.fillRect(0,0,W,H);
      for(const s of STARS){
        s.y+=s.vy; if(s.y>H)s.y=0;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${s.a})`; ctx.fill();
      }
    };

    const drawShip=(x:number,y:number,scale=1,alpha=1,color="#38bdf8")=>{
      ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale); ctx.globalAlpha=alpha;
      ctx.shadowBlur=14; ctx.shadowColor=color; ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(0,-17); ctx.lineTo(-4,-7); ctx.lineTo(-13,3);
      ctx.lineTo(-9,9); ctx.lineTo(-4,5); ctx.lineTo(0,9);
      ctx.lineTo(4,5); ctx.lineTo(9,9); ctx.lineTo(13,3); ctx.lineTo(4,-7);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur=0; ctx.fillStyle="rgba(255,255,255,0.5)";
      ctx.beginPath(); ctx.ellipse(0,-4,3,5,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    };

    const drawBoss=(x:number,y:number,flash:number,cap:boolean)=>{
      ctx.save(); ctx.translate(x,y);
      const c=flash>0?"#fff":ROW_COLOR[0];
      ctx.shadowBlur=18; ctx.shadowColor=c; ctx.fillStyle=c;
      ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
      for(const s of[-1,1]){
        ctx.beginPath(); ctx.moveTo(s*8,0);
        ctx.bezierCurveTo(s*20,-14,s*25,-7,s*20,3);
        ctx.bezierCurveTo(s*25,11,s*20,16,s*8,0);
        ctx.closePath(); ctx.fill();
      }
      ctx.shadowBlur=0; ctx.fillStyle="#000";
      ctx.beginPath(); ctx.arc(-4,-2,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(4,-2,2.5,0,Math.PI*2); ctx.fill();
      ctx.restore();
      if(cap) drawShip(x+28,y,0.72,0.85);
    };

    const drawBee=(x:number,y:number,row:number,flash:number)=>{
      ctx.save(); ctx.translate(x,y);
      const c=flash>0?"#fff":ROW_COLOR[row];
      ctx.shadowBlur=12; ctx.shadowColor=c; ctx.fillStyle=c;
      ctx.beginPath();
      ctx.moveTo(0,-12); ctx.lineTo(10,-4); ctx.lineTo(12,6);
      ctx.lineTo(6,12); ctx.lineTo(-6,12); ctx.lineTo(-12,6); ctx.lineTo(-10,-4);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur=0; ctx.strokeStyle=c; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(-5,-12); ctx.lineTo(-8,-19); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5,-12); ctx.lineTo(8,-19); ctx.stroke();
      ctx.restore();
    };

    const drawFighter=(x:number,y:number,flash:number)=>{
      ctx.save(); ctx.translate(x,y);
      const c=flash>0?"#fff":ROW_COLOR[3];
      ctx.shadowBlur=10; ctx.shadowColor=c; ctx.fillStyle=c;
      ctx.beginPath();
      ctx.moveTo(0,-11); ctx.lineTo(9,7); ctx.lineTo(5,3);
      ctx.lineTo(0,8); ctx.lineTo(-5,3); ctx.lineTo(-9,7);
      ctx.closePath(); ctx.fill(); ctx.restore();
    };

    const drawEnemy=(e:Enemy)=>{
      if(e.state==="dead") return;
      if(e.beaming&&e.state==="diving"){
        const pulse=0.5+0.5*Math.sin(frame*0.3);
        const grad=ctx.createLinearGradient(e.x,e.y,e.x,H);
        grad.addColorStop(0,`rgba(255,210,0,${0.7*pulse})`);
        grad.addColorStop(1,"rgba(255,210,0,0)");
        ctx.save(); ctx.fillStyle=grad; ctx.fillRect(e.x-10,e.y,20,H-e.y); ctx.restore();
      }
      if(e.row===0) drawBoss(e.x,e.y,e.flash,e.capturedShip);
      else if(e.row<=2) drawBee(e.x,e.y,e.row,e.flash);
      else drawFighter(e.x,e.y,e.flash);
    };

    const drawBullets=()=>{
      for(const b of bullets){
        const col=b.fp?"#38bdf8":"#f43f5e";
        ctx.shadowBlur=10; ctx.shadowColor=col; ctx.fillStyle=col;
        if(b.fp){ctx.beginPath();ctx.rect(b.x-2,b.y-10,4,18);ctx.fill();}
        else{ctx.beginPath();ctx.ellipse(b.x,b.y,3,7,0,0,Math.PI*2);ctx.fill();}
      }
      ctx.shadowBlur=0;
    };

    const drawSparks=()=>{
      sparks=sparks.filter(p=>{
        p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.vx*=0.96;p.life--;
        const t=p.life/p.max;
        ctx.globalAlpha=t; ctx.fillStyle=p.color;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*t,0,Math.PI*2);ctx.fill();
        return p.life>0;
      });
      ctx.globalAlpha=1;
    };

    const drawHUD=()=>{
      ctx.fillStyle="rgba(255,255,255,0.55)";
      ctx.font="13px 'JetBrains Mono',monospace"; ctx.textAlign="left";
      ctx.fillText(`SCORE  ${String(score).padStart(6,"0")}`,16,30);
      ctx.fillStyle="rgba(255,255,255,0.2)";
      ctx.fillText(`BEST   ${String(best).padStart(6,"0")}`,16,48);
      ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.textAlign="right";
      ctx.fillText(`WAVE ${wave}`,W-16,30);
      const sc=dualMode?lives+1:lives;
      for(let i=0;i<sc;i++) drawShip(W-20-i*26,H-20,0.6,dualMode&&i===0?0.5:0.6);
      if(dualMode){
        ctx.fillStyle="#f5c800"; ctx.font="10px 'JetBrains Mono',monospace"; ctx.textAlign="right";
        ctx.shadowBlur=8; ctx.shadowColor="#f5c800";
        ctx.fillText("DUAL FIGHTER",W-16,H-36); ctx.shadowBlur=0;
      }
      if(captureFlash>0){
        ctx.globalAlpha=Math.min(1,captureFlash/20);
        ctx.fillStyle="#f43f5e"; ctx.font="bold 20px 'JetBrains Mono',monospace"; ctx.textAlign="center";
        ctx.shadowBlur=12; ctx.shadowColor="#f43f5e";
        ctx.fillText("CAPTURED!",W/2,H*0.55); ctx.shadowBlur=0; ctx.globalAlpha=1;
      }
      if(rescueFlash>0){
        ctx.globalAlpha=Math.min(1,rescueFlash/20);
        ctx.fillStyle="#f5c800"; ctx.font="bold 18px 'JetBrains Mono',monospace"; ctx.textAlign="center";
        ctx.shadowBlur=12; ctx.shadowColor="#f5c800";
        ctx.fillText("RESCUED! DUAL FIGHTER!",W/2,H*0.55); ctx.shadowBlur=0; ctx.globalAlpha=1;
      }
    };

    /* ── screens ────────────────────────────────────── */
    const menuEnemies:{x:number;y:number;row:number;t:number}[]=[];
    const initMenuEnemies=()=>{
      menuEnemies.length=0;
      for(let i=0;i<5;i++) menuEnemies.push({x:W*0.1+i*(W*0.2),y:H*0.16+Math.sin(i)*28,row:i%4,t:i*0.4});
    };

    const drawMenu=()=>{
      menuEnemies.forEach(e=>{
        e.t+=0.02; e.y=H*0.15+Math.sin(e.t)*14;
        if(e.row===0) drawBoss(e.x,e.y,0,false);
        else if(e.row<=2) drawBee(e.x,e.y,e.row,0);
        else drawFighter(e.x,e.y,0);
      });
      ctx.save(); ctx.textAlign="center";
      ctx.shadowBlur=36; ctx.shadowColor="#f5c800"; ctx.fillStyle="#f5c800";
      ctx.font=`bold ${Math.floor(W*0.17)}px 'Space Grotesk',sans-serif`;
      const lh=Math.floor(W*0.17)*1.05;
      ctx.fillText("URANUS",W/2,H*0.32);
      ctx.fillText("DEFENDERS",W/2,H*0.32+lh); ctx.shadowBlur=0;
      ctx.fillStyle="rgba(255,255,255,0.45)"; ctx.font="10px 'JetBrains Mono',monospace";
      ctx.fillText("CAPTURE · NOT GALAGA · DUAL FIGHTERS · WORK OF ART",W/2,H*0.5);
      const items=["START GAME","HOW TO PLAY"];
      items.forEach((item,i)=>{
        const y=H*0.58+i*42; const sel=menuSel===i;
        ctx.shadowBlur=sel?14:0; ctx.shadowColor="#38bdf8";
        ctx.fillStyle=sel?"#38bdf8":"rgba(255,255,255,0.35)";
        ctx.font=`${sel?"bold ":""}15px 'JetBrains Mono',monospace`;
        ctx.fillText(`${sel?"▶  ":"   "}${item}`,W/2-15,y);
      });
      ctx.shadowBlur=0;
      ctx.fillStyle="rgba(255,255,255,0.18)"; ctx.font="11px 'JetBrains Mono',monospace";
      ctx.fillText(`BEST  ${String(best).padStart(6,"0")}`,W/2,H*0.73);
      ctx.fillStyle="rgba(255,255,255,0.1)"; ctx.font="9px 'JetBrains Mono',monospace";
      ctx.fillText("← → NAVIGATE   FIRE TO CONFIRM",W/2,H-18);
      ctx.restore();
    };

    const drawControls=()=>{
      ctx.save(); ctx.textAlign="center";
      ctx.shadowBlur=18; ctx.shadowColor="#38bdf8"; ctx.fillStyle="#38bdf8";
      ctx.font="bold 26px 'Space Grotesk',sans-serif";
      ctx.fillText("CONTROLS",W/2,H*0.2); ctx.shadowBlur=0;
      const lines=[
        ["MOVE","← → buttons"],["SHOOT","FIRE button"],["",""],
        ["CAPTURE","Dodge the tractor beam"],["RESCUE","Shoot the boss mid-dive"],
        ["DUAL","Double firepower"],["BONUS","Every 3 waves: no enemy fire"],
      ];
      lines.forEach(([label,desc],i)=>{
        const y=H*0.3+i*36;
        if(label){
          ctx.fillStyle="rgba(255,255,255,0.48)"; ctx.font="bold 11px 'JetBrains Mono',monospace"; ctx.textAlign="right";
          ctx.fillText(label,W/2-10,y);
        }
        ctx.fillStyle="rgba(255,255,255,0.26)"; ctx.font="11px 'JetBrains Mono',monospace"; ctx.textAlign="left";
        ctx.fillText(desc,W/2+10,y);
      });
      ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.font="10px 'JetBrains Mono',monospace"; ctx.textAlign="center";
      if(Math.floor(frame/30)%2===0) ctx.fillText("FIRE TO GO BACK",W/2,H-20);
      ctx.restore();
    };

    const drawGameOver=()=>{
      ctx.save(); ctx.textAlign="center";
      ctx.shadowBlur=22; ctx.shadowColor="#f43f5e"; ctx.fillStyle="#f43f5e";
      ctx.font=`bold ${Math.floor(W*0.12)}px 'Space Grotesk',sans-serif`;
      ctx.fillText("GAME OVER",W/2,H*0.37); ctx.shadowBlur=0;
      ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.font="15px 'JetBrains Mono',monospace";
      ctx.fillText(`SCORE  ${String(score).padStart(6,"0")}`,W/2,H*0.49);
      ctx.fillStyle="rgba(255,255,255,0.22)"; ctx.font="12px 'JetBrains Mono',monospace";
      ctx.fillText(`BEST   ${String(best).padStart(6,"0")}`,W/2,H*0.56);
      if(Math.floor(frame/30)%2===0){
        ctx.fillStyle="rgba(255,255,255,0.45)";
        ctx.fillText("FIRE TO RETURN TO MENU",W/2,H*0.65);
      }
      ctx.restore();
    };

    const drawChallenging=()=>{
      for(const e of cEnemies){
        if(e.dead) continue;
        if(e.row===0) drawBoss(e.x,e.y,0,false);
        else if(e.row<=2) drawBee(e.x,e.y,e.row,0);
        else drawFighter(e.x,e.y,0);
      }
      drawBullets(); drawSparks();
      if(invTimer===0||Math.floor(invTimer/4)%2===0){
        drawShip(px,py);
        if(dualMode) drawShip(px+40,py);
      }
      ctx.save(); ctx.textAlign="center";
      ctx.shadowBlur=18; ctx.shadowColor="#f5c800"; ctx.fillStyle="#f5c800";
      ctx.font="bold 15px 'JetBrains Mono',monospace";
      ctx.fillText("✦  CHALLENGING STAGE  ✦",W/2,H*0.06); ctx.shadowBlur=0;
      ctx.fillStyle="rgba(255,255,255,0.38)"; ctx.font="12px 'JetBrains Mono',monospace";
      ctx.fillText(`HITS ${challengeHits} / ${totalChallenge}`,W/2,H*0.11);
      if(challengeEndTimer>0){
        ctx.globalAlpha=Math.min(1,challengeEndTimer/30);
        ctx.fillStyle="#f5c800"; ctx.font="bold 22px 'Space Grotesk',sans-serif";
        ctx.shadowBlur=14; ctx.shadowColor="#f5c800";
        ctx.fillText(`BONUS  +${challengeHits*500}`,W/2,H*0.5); ctx.shadowBlur=0; ctx.globalAlpha=1;
      }
      ctx.restore();
      drawHUD();
    };

    /* ── update ─────────────────────────────────────── */
    const update=()=>{
      frame++;
      if(captureFlash>0) captureFlash--;
      if(rescueFlash>0)  rescueFlash--;

      // process button menu nav signals
      if(menuNav.current!==0){
        if(gs==="menu") menuSel=((menuSel+menuNav.current)%2+2)%2;
        menuNav.current=0;
      }

      if(gs==="challenging"){
        if(keys.left)  px=Math.max(20,px-P_SPD);
        if(keys.right) px=Math.min(W-20,px+P_SPD);
        if(invTimer>0) invTimer--;
        if(fireCd>0) fireCd--;
        if(keys.space&&fireCd===0){
          bullets.push({x:px,y:py-18,vy:-B_SPD,fp:true});
          if(dualMode) bullets.push({x:px+40,y:py-18,vy:-B_SPD,fp:true});
          fireCd=FIRE_CD;
        }
        for(const e of cEnemies){
          if(e.dead) continue;
          if(e.delay>0){e.delay--;continue;}
          e.t+=0.012;
          e.x=bz(e.p[0],e.p[2],e.p[4],e.p[6],Math.min(1,e.t));
          e.y=bz(e.p[1],e.p[3],e.p[5],e.p[7],Math.min(1,e.t));
        }
        bullets=bullets.filter(b=>{b.y+=b.vy;return b.y>-30&&b.y<H+30&&!b.dead;});
        for(const b of bullets.filter(b=>b.fp)){
          for(const e of cEnemies){
            if(e.dead) continue;
            const dx=b.x-e.x,dy=b.y-e.y;
            if(dx*dx+dy*dy<(ENEMY_R+5)*(ENEMY_R+5)){
              b.dead=true; e.dead=true; challengeHits++;
              explode(e.x,e.y,ROW_COLOR[e.row]);
            }
          }
        }
        const allDone=cEnemies.every(e=>e.dead||e.t>=1);
        if(allDone&&challengeEndTimer===0) challengeEndTimer=120;
        if(challengeEndTimer>0){
          challengeEndTimer--;
          if(challengeEndTimer===0){
            score+=challengeHits*500; if(score>best) best=score;
            wave++; initWave(); gs="playing";
          }
        }
        return;
      }

      // one-shot space press for menu/gameover
      if(gs==="menu"&&keys.space){keys.space=false;menuSel===0?startGame():gs="controls";}
      if(gs==="controls"&&keys.space){keys.space=false;gs="menu";}
      if(gs==="gameover"&&keys.space){keys.space=false;gs="menu";menuSel=0;}
      if(gs!=="playing") return;

      if(keys.left)  px=Math.max(20,px-P_SPD);
      if(keys.right) px=Math.min(W-20,px+P_SPD);
      if(invTimer>0) invTimer--;
      if(fireCd>0) fireCd--;
      if(keys.space&&fireCd===0){
        bullets.push({x:px,y:py-18,vy:-B_SPD,fp:true});
        if(dualMode) bullets.push({x:px+40,y:py-18,vy:-B_SPD,fp:true});
        fireCd=FIRE_CD;
      }

      const alive=enemies.filter(e=>e.state!=="dead").length;
      formShift+=formDir*0.36*(1+(ROWS*COLS-alive)*0.05);
      if(Math.abs(formShift)>34) formDir*=-1;

      const allEntered=enemies.every(e=>e.state!=="entering");
      const diveCt=enemies.filter(e=>e.state==="diving").length;
      const maxDiv=Math.min(2,1+Math.floor(wave/2));
      const diveInt=Math.max(55,170-wave*12);
      if(allEntered&&diveCt<maxDiv&&frame%diveInt===0){
        const pool=enemies.filter(e=>e.state==="formation");
        if(pool.length){
          const chosen=pool[Math.floor(Math.random()*pool.length)];
          const canCapture=chosen.row===0&&!capturingBoss&&!dualMode&&Math.random()<0.22;
          dive(chosen,canCapture);
          if(canCapture) capturingBoss=chosen;
        }
      }

      for(const e of enemies){
        if(e.flash>0) e.flash--;
        if(e.state==="dead") continue;
        if(e.state==="entering"){
          if(e.delay>0){e.delay--;continue;}
          e.t+=0.022;
          if(e.t>=1){e.state="formation";e.x=e.formX+formShift;e.y=e.formY;}
          else{e.x=bz(e.ep[0],e.ep[2],e.ep[4],e.formX,e.t);e.y=bz(e.ep[1],e.ep[3],e.ep[5],e.formY,e.t);}
        } else if(e.state==="formation"){
          e.x=e.formX+formShift; e.y=e.formY;
          e.shootCd--;
          if(e.shootCd<=0&&e.row>=2&&bullets.filter(b=>!b.fp).length<4){
            bullets.push({x:e.x,y:e.y+14,vy:EB_SPD+wave*0.18,fp:false});
            e.shootCd=110+Math.floor(Math.random()*120);
          }
        } else if(e.state==="diving"){
          e.t+=0.009+wave*0.001;
          if(e.dp){e.x=bz(e.dp[0],e.dp[2],e.dp[4],e.dp[6],e.t);e.y=bz(e.dp[1],e.dp[3],e.dp[5],e.dp[7],e.t);}
          if(e.beaming&&invTimer===0&&!dualMode){
            if(Math.abs(e.x-px)<18&&e.y>py-60&&e.y<py+20){
              e.beaming=false; e.capturedShip=true;
              lives--; invTimer=180; captureFlash=90;
              explode(px,py,"#38bdf8",20);
              if(lives<=0){gs="gameover";if(score>best)best=score;}
            }
          }
          if(invTimer===0){
            const dx=e.x-px,dy=e.y-py;
            if(dx*dx+dy*dy<(ENEMY_R+PLAYER_R)*(ENEMY_R+PLAYER_R)){
              e.state="dead"; explode(e.x,e.y,ROW_COLOR[e.row],20);
              if(dualMode){dualMode=false;}
              else{lives--;invTimer=180;explode(px,py,"#38bdf8",20);}
              if(lives<=0){gs="gameover";if(score>best)best=score;}
              if(e===capturingBoss) capturingBoss=null;
            }
          }
          e.shootCd--;
          if(e.shootCd<=0&&bullets.filter(b=>!b.fp).length<5){
            bullets.push({x:e.x,y:e.y+12,vy:EB_SPD,fp:false});
            e.shootCd=30+Math.floor(Math.random()*25);
          }
          if(e.t>=1){e.state="formation";e.dp=null;e.t=0;e.x=e.formX;e.y=e.formY;e.beaming=false;}
        }
      }

      bullets=bullets.filter(b=>{b.y+=b.vy;return b.y>-30&&b.y<H+30&&!b.dead;});
      for(const b of bullets.filter(b=>b.fp)){
        for(const e of enemies){
          if(e.state==="dead"||e.state==="entering") continue;
          const dx=b.x-e.x,dy=b.y-e.y;
          if(dx*dx+dy*dy<(ENEMY_R+5)*(ENEMY_R+5)){
            b.dead=true; e.flash=7; e.hp--;
            if(e.hp<=0){
              const rescue=e===capturingBoss&&e.capturedShip;
              e.state="dead";
              const pts=rescue?1600:e.row===0?400:e.row<=2?200:100;
              score+=pts; if(score>best) best=score;
              explode(e.x,e.y,ROW_COLOR[e.row]);
              if(rescue){dualMode=true;rescueFlash=120;capturingBoss=null;}
              else if(e===capturingBoss) capturingBoss=null;
            }
            break;
          }
          if(e.capturedShip){
            const csx=e.x+28; const cx=b.x-csx,cy=b.y-e.y;
            if(cx*cx+cy*cy<(PLAYER_R+5)*(PLAYER_R+5)){
              b.dead=true; e.capturedShip=false; capturingBoss=null;
              explode(csx,e.y,"#38bdf8",15); break;
            }
          }
        }
      }
      if(invTimer===0){
        for(const b of bullets.filter(b=>!b.fp)){
          const targets=dualMode?[{x:px,y:py},{x:px+40,y:py}]:[{x:px,y:py}];
          for(const t of targets){
            const dx=b.x-t.x,dy=b.y-t.y;
            if(dx*dx+dy*dy<(PLAYER_R+4)*(PLAYER_R+4)){
              b.dead=true;
              if(dualMode){dualMode=false;}
              else{lives--;invTimer=180;explode(px,py,"#38bdf8",24);}
              if(lives<=0){gs="gameover";if(score>best)best=score;}
              break;
            }
          }
        }
      }
      if(enemies.every(e=>e.state==="dead")){
        if(wave%3===0){spawnChallenge();}
        else{wave++;initWave();}
      }
    };

    /* ── main loop ──────────────────────────────────── */
    const loop=()=>{
      update(); drawBg();
      if(gs==="menu"){drawMenu();}
      else if(gs==="controls"){drawControls();}
      else if(gs==="challenging"){drawChallenging();}
      else if(gs==="playing"||gs==="gameover"){
        for(const e of enemies) drawEnemy(e);
        drawBullets();
        if(gs==="playing"&&(invTimer===0||Math.floor(invTimer/4)%2===0)){
          drawShip(px,py);
          if(dualMode) drawShip(px+40,py);
        }
        drawSparks(); drawHUD();
        if(gs==="gameover") drawGameOver();
      }
      raf=requestAnimationFrame(loop);
    };

    /* ── keyboard ───────────────────────────────────── */
    const onKD=(e:KeyboardEvent)=>{
      if(e.key==="ArrowLeft"||e.key==="a"||e.key==="A")  keys.left=true;
      if(e.key==="ArrowRight"||e.key==="d"||e.key==="D") keys.right=true;
      if(e.key===" "||e.key==="Enter"){ e.preventDefault(); keys.space=true; }
      if(gs==="menu"){
        if(e.key==="ArrowUp"||e.key==="w")   menuNav.current-=1;
        if(e.key==="ArrowDown"||e.key==="s") menuNav.current+=1;
      }
    };
    const onKU=(e:KeyboardEvent)=>{
      if(e.key==="ArrowLeft"||e.key==="a"||e.key==="A")  keys.left=false;
      if(e.key==="ArrowRight"||e.key==="d"||e.key==="D") keys.right=false;
      if(e.key===" "||e.key==="Enter") keys.space=false;
    };

    initMenuEnemies();
    window.addEventListener("keydown",onKD);
    window.addEventListener("keyup",onKU);
    raf=requestAnimationFrame(loop);

    return ()=>{
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("keydown",onKD);
      window.removeEventListener("keyup",onKU);
    };
  },[]);

  return (
    <div style={{
      width:"100%", height:"100%", background:"#04040e",
      display:"flex", flexDirection:"column",
      overflow:"hidden",
    }}>
      <canvas ref={canvasRef} style={{display:"block", width:"100%", height:"100%"}} />
    </div>
  );
}
