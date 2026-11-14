/* Account scoring for Promo Campaign. Input: list of videos {created (ms), views}. Works in Node and in the browser. */
(function(root){
var DAY=86400000;
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function win(list,from,to){
  var v=list.filter(function(x){return x.created>=from&&x.created<=to}),views=0;
  v.forEach(function(x){views+=x.views});
  return {videos:v.length,views:views,avg:v.length?Math.round(views/v.length):0};
}
/* Price-independent part: windows, activity status, whether the account can be taken at all */
function analyze(videos,now){
  now=now||Date.now();
  var d0=new Date(now);d0.setHours(0,0,0,0);
  var s=videos.slice().sort(function(a,b){return b.created-a.created});
  var total=0;s.forEach(function(v){total+=v.views});
  var A={now:now,total:{videos:s.length,views:total},
    today:win(s,d0.getTime(),now),week:win(s,now-7*DAY,now),month:win(s,now-30*DAY,now),
    lastDaysAgo:s.length?Math.floor((now-s[0].created)/DAY):null};
  var rs=0,rec=s.slice(0,10);rec.forEach(function(v){rs+=v.views});
  A.refAvg=A.month.videos?A.month.avg:(rec.length?Math.round(rs/rec.length):0);
  if(!s.length||total===0){A.status="empty";A.accepted=false;A.reject={code:"empty"};return A}
  if(A.month.videos===0){
    if(A.lastDaysAgo>120){A.status="abandoned";A.accepted=false;A.reject={code:"abandoned",n:A.lastDaysAgo};return A}
    A.status="dormant";A.accepted=true;return A;
  }
  A.status="active";A.accepted=true;return A;
}
/* Chance of approval for a given price (USD per video). cpm = price per 1000 average views. */
function evaluate(A,price){
  var r={good:[],bad:[],chance:0,decision:"no",cpm:null};
  if(!A.accepted){r.bad.push(A.reject);return r}
  var hasPrice=price>0&&A.refAvg>0;
  var cpm=hasPrice?price/A.refAvg*1000:null;r.cpm=cpm;
  if(A.status==="dormant"){
    r.chance=(cpm!==null&&cpm>0.12)?9:17;
    r.bad.push({code:"no_month"});r.bad.push({code:"last_old",n:A.lastDaysAgo});
    if(cpm!==null&&cpm>0.12)r.bad.push({code:"price_high",c:cpm});
    r.decision="risky";return r;
  }
  var m=A.month,w=A.week;
  var V=clamp(Math.log(Math.max(A.refAvg,1)/1000)/Math.log(300),0,1);
  var F=m.videos>=8?1:(m.videos>=4?0.8:(m.videos>=2?0.6:0.35));
  var P=hasPrice?clamp(1-(cpm-0.05)/0.15,0,1):0.6;
  var score=0.45*V+0.25*F+0.30*P;
  var ch=score*97;
  if(w.videos===0){ch*=0.85;r.bad.push({code:"week_none"})}
  else{
    if(w.videos>=2)r.good.push({code:"week_active",n:w.videos});
    if(m.avg>0&&w.avg>=1.2*m.avg){ch+=3;r.good.push({code:"growing"})}
    else if(m.avg>0&&w.avg<0.5*m.avg){ch-=4;r.bad.push({code:"dropping"})}
  }
  if(A.refAvg<1000)ch=Math.min(ch,25);
  r.chance=clamp(Math.round(ch),5,97);
  if(A.refAvg>=100000)r.good.push({code:"views_high",n:A.refAvg});
  else if(A.refAvg>=20000)r.good.push({code:"views_ok",n:A.refAvg});
  else r.bad.push({code:"views_low",n:A.refAvg});
  if(m.videos>=8)r.good.push({code:"freq_high",n:m.videos});
  else if(m.videos<=3)r.bad.push({code:"freq_low",n:m.videos});
  if(hasPrice){
    if(cpm<=0.08)r.good.push({code:"price_ok",c:cpm});
    else if(cpm>0.12)r.bad.push({code:"price_high",c:cpm});
  }
  r.decision=r.chance>=70?"take":(r.chance>=40?"maybe":"risky");
  return r;
}
/* Price the site proposes automatically: low relative to the 30-day average views, so the approval chance stays high */
function recommend(A){
  if(!A.accepted)return null;
  var k=A.status==="dormant"?0.00002:0.00004;
  return Math.max(1,Math.min(200,Math.round(A.refAvg*k)));
}
var api={analyze:analyze,evaluate:evaluate,recommend:recommend,DAY:DAY};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.PCAnalysis=api;
})(typeof window!=="undefined"?window:this);
