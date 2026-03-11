import{u as zn,j as e,L as ln,r as E,P as re,a as On,N as En,R as ie,A as te,S as se,b as Bn,T as jn,E as ae,c as oe,C as Ee,d as Ie,X as le,e as ce,f as Ne,g as Ue,h as sn,i as Ae,k as Te,B as ye}from"./vendor-1jWIULEY.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const I of a.addedNodes)I.tagName==="LINK"&&I.rel==="modulepreload"&&t(I)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const Ce=[{path:"/",label:"Home"},{path:"/calculator",label:"Calculator"},{path:"/admin",label:"Login"}];function Se({children:r}){const{pathname:i}=zn(),n=t=>`rounded-lg px-3 py-2 text-sm font-medium transition ${i===t?"bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-sm":"text-slate-700 hover:bg-slate-100"}`;return e.jsxs("div",{className:"min-h-screen bg-mesh text-slate-900",children:[e.jsx("header",{className:"sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur",children:e.jsxs("div",{className:"mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4",children:[e.jsx(ln,{to:"/",className:"text-lg font-semibold tracking-tight text-slate-900",children:"Cluster Calculation"}),e.jsx("nav",{className:"flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm",children:Ce.map(t=>e.jsx(ln,{to:t.path,className:n(t.path),children:t.label},t.path))})]})}),e.jsx("main",{className:"mx-auto w-full max-w-7xl px-4 py-8",children:r})]})}const wn={danger:"border-rose-200 bg-rose-50 text-rose-700",warning:"border-amber-200 bg-amber-50 text-amber-700",success:"border-emerald-200 bg-emerald-50 text-emerald-700",info:"border-slate-200 bg-slate-50 text-slate-700"};function F({message:r,tone:i="info",className:n=""}){return r?e.jsx("p",{className:`rounded-lg border px-3 py-2 text-sm ${wn[i]||wn.info} ${n}`,children:r}):null}const Re=["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"],ue=(r,i)=>{const n=Number(r);return Number.isFinite(n)?n:i},de="150".trim(),Pn=ue(de,150),Ln=r=>/^https?:\/\//i.test(r),Oe=r=>{const i=String(r||"").trim();return i?Ln(i)?i.replace(/\/+$/,""):(i.startsWith("/")?i:`/${i}`).replace(/\/+$/,""):""},me="".trim(),Nn=Oe(me),he=r=>{if(!r)return"";if(Ln(r))try{return new URL(r).pathname.replace(/\/+$/,"")||""}catch{return""}return r.startsWith("/")?r.replace(/\/+$/,""):""},ge=(r,i)=>{if(!r)return i;const n=he(r);if(!n||n==="/")return i;const t=n.toLowerCase(),s=i.toLowerCase();return s===t?"":s.startsWith(`${t}/`)?i.slice(n.length):i},q=r=>{const i=String(r||"").trim();if(!i)return Nn||"";if(Ln(i)||!Nn)return i;const n=i.startsWith("/")?i:`/${i}`,t=ge(Nn,n);return t?`${Nn}${t.startsWith("/")?t:`/${t}`}`:Nn},fn=async r=>{try{const i=await r.text();return i?JSON.parse(i):null}catch{return null}},Dn=(r,i)=>String((r==null?void 0:r.error)||(r==null?void 0:r.message)||i).trim()||i,ve=({enabled:r=!0}={})=>{const[i,n]=E.useState(null),[t,s]=E.useState(null),[a,I]=E.useState(r),[N,A]=E.useState(!1),[T,c]=E.useState(""),d=E.useMemo(()=>!0,[]),y=E.useCallback(async()=>{I(!0);try{const C=await fetch(q("/api/admin/me"),{method:"GET",credentials:"include"}),f=await fn(C);if(!C.ok){n(null),s(null);return}n((f==null?void 0:f.user)||null),s((f==null?void 0:f.profile)||null),c("")}catch{n(null),s(null)}finally{I(!1)}},[]);E.useEffect(()=>{if(!r){I(!1);return}y().catch(()=>{})},[r,y]);const u=E.useCallback(async(C,f)=>{A(!0),c("");try{const v=await fetch(q("/api/admin/login"),{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:String(C||"").trim(),password:String(f||"")})}),g=await fn(v);if(!v.ok){let H=Dn(g,`Authentication request failed (HTTP ${v.status}).`);return v.status===404&&H.startsWith("Authentication request failed")&&(H="Admin login endpoint not found. Check VITE_API_BASE_URL or backend routes."),c(H),{success:!1,error:H}}return n((g==null?void 0:g.user)||null),s((g==null?void 0:g.profile)||null),c(""),{success:!0,user:(g==null?void 0:g.user)||void 0,profile:(g==null?void 0:g.profile)||void 0,error:""}}catch(v){const g=(v==null?void 0:v.message)||"Authentication request failed.";return c(g),{success:!1,error:g}}finally{A(!1)}},[]),x=E.useCallback(async()=>{const C="Google popup login is disabled in backend-auth mode. Use email and password.";return c(C),{success:!1,error:C}},[]),O=E.useCallback(async()=>{A(!0);try{await fetch(q("/api/admin/logout"),{method:"POST",credentials:"include"})}finally{n(null),s(null),c(""),A(!1)}},[]),h=E.useCallback(async({email:C,password:f,name:v})=>{if(!i||!t)throw new Error("You must be logged in as admin.");if(t.role!=="super")throw new Error("Only a super admin can add regular admin users.");const g=await fetch(q("/api/admin/regular-admin"),{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:String(C||"").trim(),password:String(f||""),name:String(v||"").trim()})}),H=await fn(g);if(!g.ok)throw new Error(Dn(H,"Unable to create regular admin."));return{user:(H==null?void 0:H.user)||null,profile:(H==null?void 0:H.profile)||null}},[t,i]);return{firebaseAuthReady:d,adminUser:i,adminProfile:t,authLoading:a,authWorking:N,authError:T,isAdminAuthenticated:!!(i&&t),login:u,loginWithGoogle:x,logout:O,addRegularAdmin:h}},bn={A:12,"A-":11,"B+":10,B:9,"B-":8,"C+":7,C:6,"C-":5,"D+":4,D:3,"D-":2,E:1},xn={ENG:"English",KIS:"Kiswahili",MAT:"Mathematics",BIO:"Biology",CHE:"Chemistry",PHY:"Physics",GSC:"General Science",HAG:"History",GEO:"Geography",CRE:"CRE",IRE:"IRE",HRE:"HRE",CMP:"Computer Studies",AGR:"Agriculture",ARD:"Art & Design",HSC:"Home Science",BST:"Business Studies",FRE:"French",GER:"German",MUS:"Music",ARB:"Arabic"},kn=[{title:"Group I",required:!0,subjects:["ENG","KIS","MAT"]},{title:"Group II (Sciences)",required:!1,subjects:["BIO","CHE","PHY","GSC"]},{title:"Group III (Humanities)",required:!1,subjects:["HAG","GEO","CRE","IRE","HRE"]},{title:"Group IV (Technical)",required:!1,subjects:["CMP","AGR","ARD","HSC"]},{title:"Group V (Others)",required:!1,subjects:["BST","FRE","GER","MUS","ARB"]}],Ye=["ENG","KIS","MAT"],L=["BIO","CHE","PHY","GSC"],K=["HAG","GEO","CRE","IRE","HRE"],j=["CMP","AGR","ARD","HSC"],w=["BST","FRE","GER","MUS","ARB"],Sn=[...Ye,...L,...K,...j,...w],l=(r,i)=>Math.max(...i.map(n=>n in r?r[n]:0),0),D=(r,i,n)=>{const t=i.filter(s=>s in r).map(s=>r[s]).sort((s,a)=>a-s);return t.length>=n?t[n-1]:0},Me=r=>{const i=Object.values(r).sort((n,t)=>t-n);return i.length>=7?i.slice(0,7).reduce((n,t)=>n+t,0):0},fe=(r,i)=>Number((Math.sqrt(r/48*(i/84))*48*.94).toFixed(3)),Ve=r=>["BIO","CHE","MAT","PHY"].every(n=>r[n]&&r[n]in bn),Ke=(r,i)=>{const n={};for(const[I,N]of Object.entries(i))N in bn&&(n[I]=bn[N]);if(Object.keys(n).length<7)return 0;const t=Me(n),s=()=>0;let a=0;if(r===1){if(!("ENG"in n||"KIS"in n))return s();a=l(n,["ENG","KIS"])+Math.max(n.MAT??0,l(n,L))+l(n,K)+Math.max(l(n,L),D(n,K,2),l(n,j),l(n,w))}else if(r===2){if(!("ENG"in n||"KIS"in n))return s();a=l(n,["ENG","KIS"])+(n.MAT??0)+Math.max(l(n,L),l(n,K))+Math.max(l(n,L),l(n,K),l(n,j),l(n,w))}else if(r===3){if(!("ENG"in n||"KIS"in n))return s();a=l(n,["ENG","KIS"])+Math.max(n.MAT??0,l(n,L))+l(n,K)+Math.max(l(n,L),D(n,K,2),l(n,j),l(n,w))}else if(r===4){if(!("MAT"in n&&"PHY"in n))return s();a=n.MAT+n.PHY+Math.max(n.BIO??0,n.CHE??0,n.GEO??0)+Math.max(l(n,L),l(n,K),l(n,j),l(n,w))}else if(r===5){if(!("MAT"in n&&"PHY"in n&&"CHE"in n))return s();a=n.MAT+n.PHY+n.CHE+Math.max(n.BIO??0,l(n,K),l(n,j),l(n,w))}else if(r===6){if(!("MAT"in n&&"PHY"in n))return s();a=n.MAT+n.PHY+l(n,K)+Math.max(D(n,L,2),D(n,K,2),l(n,j),l(n,w))}else if(r===7){if(!("MAT"in n&&"PHY"in n))return s();a=n.MAT+n.PHY+Math.max(D(n,L,2),l(n,K))+Math.max(l(n,L),l(n,K),l(n,j),l(n,w))}else if(r===8){if(!("MAT"in n&&"BIO"in n))return s();a=n.MAT+n.BIO+Math.max(n.PHY??0,n.CHE??0)+Math.max(D(n,L,3),l(n,K),l(n,j),l(n,w))}else if(r===9){if(!("MAT"in n))return s();a=n.MAT+l(n,L)+D(n,L,2)+Math.max(D(n,L,3),l(n,K),l(n,j),l(n,w))}else if(r===10){if(!("MAT"in n))return s();a=n.MAT+l(n,L)+l(n,K)+Math.max(D(n,L,2),D(n,K,2),l(n,j),l(n,w))}else if(r===11)a=Math.max((n.CHE??0)+Math.max(n.MAT??0,n.PHY??0)+Math.max(n.BIO??0,n.HSC??0)+Math.max(l(n,["ENG","KIS"]),l(n,K),l(n,j),l(n,w)),Math.max(n.BIO??0,n.GSC??0)+(n.MAT??0)+Math.max(l(n,L),l(n,K))+Math.max(l(n,["ENG","KIS"]),l(n,L),l(n,K),l(n,j),l(n,w)));else if(r===12||r===13){if(!("BIO"in n&&"CHE"in n))return s();a=n.BIO+n.CHE+Math.max(n.MAT??0,n.PHY??0)+Math.max(l(n,["ENG","KIS"]),D(n,L,3),l(n,K),l(n,j),l(n,w))}else if(r===14){if(!("CHE"in n))return s();a=Math.max(n.BIO??0,n.AGR??0,n.HSC??0)+n.CHE+Math.max(n.MAT??0,n.PHY??0,n.GEO??0)+Math.max(l(n,["ENG","KIS"]),l(n,K),l(n,j),l(n,w))}else if(r===15){if(!("BIO"in n&&"CHE"in n))return s();a=n.BIO+n.CHE+Math.max(n.MAT??0,n.PHY??0,n.AGR??0)+Math.max(l(n,["ENG","KIS"]),l(n,K),l(n,j),l(n,w))}else if(r===16){if(!("GEO"in n))return s();a=n.GEO+(n.MAT??0)+l(n,L)+Math.max(D(n,L,2),D(n,K,2),l(n,j),l(n,w))}else if(r===17){if(!("FRE"in n||"GER"in n))return s();a=l(n,["FRE","GER"])+l(n,["ENG","KIS"])+Math.max(n.MAT??0,l(n,L),l(n,K))+Math.max(l(n,L),l(n,K),l(n,j),D(n,w,2))}else if(r===18){if(!("MUS"in n))return s();a=n.MUS+l(n,["ENG","KIS"])+Math.max(n.MAT??0,l(n,L),l(n,K))+Math.max(l(n,L),l(n,K),l(n,j),D(n,w,2))}else if(r===19)a=l(n,Sn)+D(n,Sn,2)+D(n,Sn,3)+D(n,Sn,4);else if(r===20){if(!(n.CRE||n.IRE||n.HRE))return s();a=l(n,["CRE","IRE","HRE"])+l(n,["ENG","KIS"])+D(n,K,2)+Math.max(l(n,L),l(n,j),l(n,w))}else return s();return fe(a,t)},be=r=>{const i={};for(let n=1;n<=20;n+=1)i[n]=Ke(n,r);return i},Zn="kuccps.cluster.sessions",en={catalog:q("/api/catalog"),adminCatalogUpload:q("/api/admin/catalog/upload"),adminCatalogCourse:q("/api/admin/catalog/course"),sessions:q("/api/sessions"),adminSessions:q("/api/admin/sessions"),adminSessionsBulkDelete:q("/api/admin/sessions/delete-many"),adminMe:q("/api/admin/me")},mn=async r=>{try{const i=await r.text();return i?JSON.parse(i):null}catch{return null}},pn=async r=>{const i=await fetch(r,{method:"GET",credentials:"include"}),n=await mn(i);return{ok:i.ok,status:i.status,data:n}},yn=async(r,i)=>{const n=await fetch(r,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(i??{})}),t=await mn(n);return{ok:n.ok,status:n.status,data:t}},Le=async(r,i)=>{const n=await fetch(r,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(i??{})}),t=await mn(n);return{ok:n.ok,status:n.status,data:t}},xe=async r=>{const i=await fetch(r,{method:"DELETE",credentials:"include"}),n=await mn(i);return{ok:i.ok,status:i.status,data:n}},rn=(r,i)=>{const n=(r==null?void 0:r.data)||{};return String((n==null?void 0:n.error)||(n==null?void 0:n.message)||i)},cn=r=>String(r||"").trim().toUpperCase().replace(/[^A-Z0-9]/g,""),An=r=>{const i=r&&typeof r=="object"?r:{},n={};for(let t=1;t<=20;t+=1){const s=Number(i[t]??i[String(t)]??0);n[t]=Number.isFinite(s)?s:0}return n},Gn=r=>{if(!r||typeof r!="object")return{};const i={};return Object.entries(r).forEach(([n,t])=>{const s=String(n||"").trim().toUpperCase(),a=String(t||"").trim().toUpperCase();!s||!a||(i[s]=a)}),i},pe=(r,i)=>{if(!i||String(r||"").trim().toUpperCase()!=="BACHELOR OF SCIENCE CLINICAL MEDICINE")return i;const n=i.replace(/\s+/g," ").trim();return/^mathematics\s*\/\s*physics$/i.test(n)?"Mathematics":i},Ge=(r,i)=>{const n={};return Object.entries(i||{}).forEach(([t,s])=>{const a=pe(r,String(t||"").trim()),I=String(s||"").trim().toUpperCase();!a||!I||(n[a]=I)}),n},hn=()=>{if(typeof window>"u")return{};try{const r=window.localStorage.getItem(Zn);if(!r)return{};const i=JSON.parse(r);return i&&typeof i=="object"?i:{}}catch{return{}}},Qn=r=>{typeof window>"u"||window.localStorage.setItem(Zn,JSON.stringify(r||{}))},Rn="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",Fe=(r=8)=>{if(typeof crypto<"u"&&crypto.getRandomValues){const n=new Uint8Array(r);return crypto.getRandomValues(n),Array.from(n,t=>Rn[t%Rn.length]).join("")}let i="";for(let n=0;n<r;n+=1){const t=Math.floor(Math.random()*Rn.length);i+=Rn[t]}return i},He=()=>{const r=hn();for(let i=0;i<20;i+=1){const n=Fe();if(!r[n])return n}throw new Error("Unable to generate a local access code.")},Be=r=>{const i=hn();i[r.code]=r,Qn(i)},je=(r,i="")=>({name:(r==null?void 0:r.name)||i,requirements:Ge((r==null?void 0:r.name)||i,(r==null?void 0:r.requirements)||{}),universities:Array.isArray(r==null?void 0:r.universities)?r.universities.map(n=>({name:String((n==null?void 0:n.name)||""),cutoff:Number((n==null?void 0:n.cutoff)??0),courseCode:String((n==null?void 0:n.courseCode)||"")})):[]}),we=r=>(Array.isArray(r)?r:Object.values(r||{})).map(n=>je(n)).filter(n=>!!n.name),Pe=r=>{if(!r||typeof r!="object")return{};const i={};return Object.entries(r).forEach(([n,t])=>{const s=Number(n);!Number.isInteger(s)||s<1||(i[s]=we(t))}),i},De=()=>!0,ke=async()=>{const r=await pn(en.catalog);if(!r.ok)throw new Error(rn(r,"Unable to load course catalog from backend."));return Pe(r.data||{})},Je=async r=>{if(!r||typeof r!="object")throw new Error("Invalid course catalog payload.");const i=await yn(en.adminCatalogUpload,r);if(!i.ok)throw new Error(rn(i,"Unable to upload course catalog to backend."))},qe=async({cluster:r,name:i,requirements:n,universities:t})=>{const s=await yn(en.adminCatalogCourse,{cluster:r,name:i,requirements:n,universities:t});if(!s.ok)throw new Error(rn(s,"Unable to save course entry to backend."));return s.data||{}},$e=async({code:r,email:i,phoneNumber:n,amountPaid:t,grades:s,results:a,medicineEligible:I,paymentResponse:N})=>{const A={email:i,phoneNumber:n,amountPaid:t,grades:s,results:a,medicineEligible:I,paymentResponse:N};r&&(A.code=r);const T=await yn(en.sessions,A);if(!T.ok)throw new Error(rn(T,"Unable to save session to backend."));const c=T.data||{};return{code:cn(c.code),email:String(c.email||"").trim(),phoneNumber:String(c.phoneNumber||"").trim(),amountPaid:Number(c.amountPaid??0),grades:Gn(c.grades),results:An(c.results),medicineEligible:!!c.medicineEligible,paymentResponse:c.paymentResponse||null,createdAt:String(c.createdAt||""),updatedAt:String(c.updatedAt||""),storage:"firebase"}},Xn=async()=>{const r=hn(),i=Object.entries(r);if(!i.length)return 0;let n=0;const t={...r};for(const[s,a]of i)try{const I={code:cn(a.code||s),email:String(a.email||"").trim(),phoneNumber:String(a.phoneNumber||"").trim(),amountPaid:Number(a.amountPaid??0),grades:a.grades||{},results:a.results||{},medicineEligible:!!a.medicineEligible,paymentResponse:a.paymentResponse||null},N=await yn(en.sessions,I);if(!N.ok)throw new Error(rn(N,"Unable to sync session to backend."));delete t[s],n+=1}catch{}return n>0&&Qn(t),n},_e=async r=>{try{const i=await $e(r);return Xn().catch(()=>{}),{session:i,storage:"firebase",warning:""}}catch(i){const n=new Date().toISOString(),s={code:He(),email:String((r==null?void 0:r.email)||"").trim(),phoneNumber:String((r==null?void 0:r.phoneNumber)||"").trim(),amountPaid:Number((r==null?void 0:r.amountPaid)??0),grades:(r==null?void 0:r.grades)||{},results:An((r==null?void 0:r.results)||{}),medicineEligible:!!(r!=null&&r.medicineEligible),paymentResponse:(r==null?void 0:r.paymentResponse)||null,createdAt:n,updatedAt:n,storage:"local"};return Be(s),{session:s,storage:"local",warning:(i==null?void 0:i.message)||"Backend save failed. Session saved locally on this browser only."}}},We=async r=>{const i=cn(r);if(!i)return null;const n=await pn(`${en.sessions}/${i}`);if(n.ok&&n.data){const s=n.data;return{code:i,email:String(s.email||"").trim(),phoneNumber:String(s.phoneNumber||"").trim(),amountPaid:Number(s.amountPaid??0),grades:Gn(s.grades),results:An(s.results),medicineEligible:!!s.medicineEligible,paymentResponse:s.paymentResponse||null,createdAt:String(s.createdAt||""),updatedAt:String(s.updatedAt||""),storage:"firebase"}}const t=hn()[i];if(t)return{code:i,email:t.email||"",phoneNumber:t.phoneNumber||"",amountPaid:Number(t.amountPaid??0),grades:t.grades||{},results:An(t.results||{}),medicineEligible:!!t.medicineEligible,paymentResponse:t.paymentResponse||null,createdAt:t.createdAt||"",updatedAt:t.updatedAt||"",storage:"local"};if(n.status!==404)throw new Error(rn(n,"Unable to load session from backend."));return null},ze=async()=>{const r=await pn(en.adminSessions);if(!r.ok)throw new Error(rn(r,"Unable to load calculated sessions from backend."));return(Array.isArray(r.data)?r.data:[]).map(n=>({code:cn(n.code),email:String(n.email||"").trim(),phoneNumber:String(n.phoneNumber||"").trim(),amountPaid:Number(n.amountPaid??0),createdAt:String(n.createdAt||""),updatedAt:String(n.updatedAt||""),medicineEligible:!!n.medicineEligible,grades:Gn(n.grades),results:An(n.results),paymentResponse:n.paymentResponse||null,storage:"firebase"})).filter(n=>n.code).sort((n,t)=>(Date.parse(t.createdAt||"")||0)-(Date.parse(n.createdAt||"")||0))},Ze=async(r,i={})=>{const n=cn(r);if(!n)throw new Error("Session code is required.");const t=await Le(`${en.adminSessions}/${n}`,i);if(!t.ok)throw new Error(rn(t,"Unable to update session."))},Qe=async r=>{const i=cn(r);if(!i)throw new Error("Session code is required.");const n=await xe(`${en.adminSessions}/${i}`);if(!n.ok)throw new Error(rn(n,"Unable to delete session."))},Xe=async(r=[])=>{var n;const i=await yn(en.adminSessionsBulkDelete,{codes:Array.isArray(r)?r:[]});if(!i.ok)throw new Error(rn(i,"Unable to delete selected sessions."));return Number(((n=i.data)==null?void 0:n.deleted)??0)},In={courseName:"COURSE NAME",cluster:"CLUSTER",courseCode:"COURSE CODE",university:"UNIVERSITY",cutoff:"CUT-OFF POINTS",requirements:"MINIMUM SUBJECT REQUIREMENTS"},an=r=>String(r??"").replace(/\u00a0/g," ").trim(),nr=r=>{const i=an(r).replace(/,/g,"");if(!i||i==="-")return 0;const n=Number.parseFloat(i);return Number.isFinite(n)?n:0},Jn=r=>{const i=an(r);if(!i||/^none$/i.test(i)||i==="-")return[];const n=[];return i.split(/\r?\n|;/).map(t=>t.trim()).filter(Boolean).forEach(t=>{if(/^none$/i.test(t)||t==="-")return;const s=t.indexOf(":");if(s<0)return;const a=t.slice(0,s).trim(),I=t.slice(s+1).trim().toUpperCase();!a||!I||I==="-"||n.push({subject:a,grade:I})}),n},er=(r,i)=>{if(!i||String(r||"").trim().toUpperCase()!=="BACHELOR OF SCIENCE CLINICAL MEDICINE")return i;const n=i.replace(/\s+/g," ").trim();return/^mathematics\s*\/\s*physics$/i.test(n)?"Mathematics":i},rr=(r,i=[])=>{const n=[];return i.forEach(t=>{if(!(t!=null&&t.subject)||!(t!=null&&t.grade))return;const s=er(r,t.subject);if(!s)return;const a=String(t.grade||"").trim().toUpperCase();if(!a)return;const I=n.findIndex(N=>N.subject===s);I>=0?n[I]={subject:s,grade:a}:n.push({subject:s,grade:a})}),n},ir=(r=[],i=[])=>{const n=[...r];return i.forEach(t=>{if(!(t!=null&&t.subject)||!(t!=null&&t.grade))return;const s=n.findIndex(a=>a.subject===t.subject);s>=0?n[s]=t:n.push(t)}),n},tr=r=>{const i=new Set,n=[];return r.forEach(t=>{const s=`${t.name}|${t.courseCode}`;!t.name||i.has(s)||(i.add(s),n.push(t))}),n},sr=r=>Object.values(In).some(i=>an(r==null?void 0:r[i])),ne=r=>{const i=re.parse(r,{header:!0,skipEmptyLines:!1});if(!Array.isArray(i.data)||!i.data.length)throw new Error("CSV has no records.");const n={};let t=null;const s=()=>{t&&(n[t.cluster]||(n[t.cluster]=[]),n[t.cluster].push({name:t.name,requirements:rr(t.name,t.requirements),universities:tr(t.universities)}),t=null)};if(i.data.forEach(a=>{if(!a||typeof a!="object"||!sr(a))return;const I=an(a[In.courseName]),N=an(a[In.cluster]),A=an(a[In.courseCode]),T=an(a[In.university]),c=an(a[In.cutoff]),d=an(a[In.requirements]),y=Number(N);if(!!(I&&Number.isInteger(y)&&y>0))s(),t={name:I,cluster:y,requirements:Jn(d),universities:[]};else if(!t)return;d&&(t.requirements=ir(t.requirements,Jn(d))),(T||A||c)&&t.universities.push({name:T||"Unknown University",courseCode:A,cutoff:nr(c)})}),s(),!Object.keys(n).length)throw new Error("CSV did not produce a valid course catalog.");return n},ar=r=>{const i=Object.keys(r||{}).length;let n=0,t=0;return Object.values(r||{}).forEach(s=>{Array.isArray(s)&&(n+=s.length,s.forEach(a=>{t+=Array.isArray(a.universities)?a.universities.length:0}))}),{clusters:i,courses:n,universities:t}},or=`COURSE NAME,CLUSTER,COURSE CODE,UNIVERSITY,CUT-OFF POINTS,MINIMUM SUBJECT REQUIREMENTS\r
BACHELOR OF LAWS (LL.B.),1,,,,\r
,,1078134,Africa Nazarene University,35.173,English/Kiswahili: B\r
,,1480134,Catholic University of Eastern Africa,36.9,\r
,,1105134,Chuka University,39.419,\r
,,1162134,Daystar University,35.479,\r
,,1057134,Egerton University,39.126,\r
,,1249134,Jomo Kenyatta University of Agriculture and Technology,40.369,\r
,,1061134,Kabarak University,37.927,\r
,,1111134,Kenyatta University,40.746,\r
,,1087134,Kisii University,39.066,\r
,,1229134,Maseno University,39.699,\r
,,1253134,Moi University,33.665,\r
,,1279134,Mount Kenya University,40.165,\r
,,1060134,Riara University,37.369,\r
,,1166134,South Eastern Kenya University,36.887,\r
,,1685134,Tharaka University,36.078,\r
,,1515134,Tom Mboya University,36.839,\r
,,1093134,University of Embu,38.428,\r
,,1263134,University of Nairobi,40.402,\r
,,1425134,Zetech University,24.456,\r
,,,,,\r
BACHELOR OF COMMERCE,2,,,,Mathematics: C\r
,,1078133,Africa Nazarene University,21.375,\r
,,1600133,Alupe University,-,\r
,,1480133,Catholic University of Eastern Africa,21.375,\r
,,1105133,Chuka University,25.421,\r
,,1080133,Co-operative University of Kenya,24.003,\r
,,1162433,Daystar University,-,\r
,,1162133,Daystar University,21.375,\r
,,1173133,Dedan Kimathi University of Technology,24.388,\r
,,1057133,Egerton University,30.01,\r
,,1088133,Gretsa University,21.375,\r
,,1249133,Jomo Kenyatta University of Agriculture & Technology,32.291,\r
,,1061133,Kabarak University,21.375,\r
,,1470133,Kaimosi Friends University,21.375,\r
,,1103133,KCA University,21.375,\r
,,1111133,Kenyatta University,32.613,\r
,,1580133,Kenyatta University � Mama Ngina University College,24.044,\r
,,1108133,Kibabii University,21.375,\r
,,1079133,Kirinyaga University,21.375,\r
,,1087133,Kisii University,24.305,\r
,,3890133,Koitaleel Samoei University College,21.375,\r
,,1176133,Laikipia University,21.375,\r
,,1495133,Lukenya University,21.375,\r
,,1165133,Maasai Mara University,21.375,\r
,,1170133,Machakos University,24.21,\r
,,1066133,Management University of Africa,21.375,\r
,,1082133,Masinde Muliro University of Science & Technology,23.929,\r
,,1240133,Meru University of Science and Technology,21.375,\r
,,1279133,Mount Kenya University,21.375,\r
,,1164133,Multimedia University of Kenya,24.16,\r
,,1246133,Murang�a University of Technology,21.375,\r
,,5510133,Nyandarua University College,-,\r
,,5145133,Open University of Kenya,-,\r
,,1068133,Pan Africa Christian University,21.375,\r
,,1117133,Pwani University,21.375,\r
,,1073133,Rongo University,21.375,\r
,,1166133,South Eastern Kenya University,21.375,\r
,,1107133,St Pauls University,21.375,\r
,,1091133,Taita Taveta University,21.375,\r
,,1112133,Technical University of Kenya,30.286,\r
,,1063133,Technical University of Mombasa,21.375,\r
,,1685133,Tharaka University,21.375,\r
,,1515133,Tom Mboya University,-,\r
,,1570133,Turkana University College,21.375,\r
,,1114133,University of Eldoret,-,\r
,,1093133,University of Embu,21.375,\r
,,1118133,University of Kabianga,23.545,\r
,,1263133,University of Nairobi,34.426,\r
,,1425133,Zetech University,21.375,\r
,,,,,\r
BACHELOR OF SCIENCE (RECORDS MANAGEMENT AND INFORMATION TECHNOLOGY),2,,,,\r
,,1169148,Kenya Highlands Evangelical University,19.799,Mathematics: C\r
,,1111148,Kenyatta University,24.175,\r
,,,,,\r
BACHELOR OF SCIENCE (INFORMATION SCIENCE),2,,,,Mathematics: C\r
,,1105233,Chuka University,21.375,\r
,,1096150,Garissa University,21.375,\r
,,1077150,Kenya Methodist University,21.375,\r
,,1165150,Maasai Mara University,21.375,\r
,,1082150,Masinde Muliro University of Science & Technology,21.375,\r
,,1240150,Meru University of Science and Technology,21.375,\r
,,1253150,Moi University,21.375,\r
,,1279150,Mount Kenya University,21.375,\r
,,1073150,Rongo University,21.375,\r
,,1112150,Technical University of Kenya,28.183,\r
,,1063150,Technical University of Mombasa,21.375,\r
,,1118150,University of Kabianga,21.375,\r
,,,,,\r
BACHELOR OF BUSINESS AND MANAGEMENT,2,,,,\r
,,1600151,Alupe University,21.375,Mathematics: C\r
,,1700151,Bomet University College,21.375,\r
,,1080151,Co-operative University of Kenya,21.375,\r
,,1096151,Garissa University,21.375,\r
,,3895151,Islamic University of Kenya,21.375,\r
,,5535151,Kabarnet University College,-,\r
,,1244151,Karatina University,21.375,\r
,,1169151,Kenya Highlands Evangelical University,21.375,\r
,,1108151,Kibabii University,21.375,\r
,,1079151,Kirinyaga University,21.375,\r
,,1087651,Kisii University,21.375,\r
,,1087151,Kisii University,21.375,\r
,,1530151,Marist International University College,21.375,\r
,,1229151,Maseno University,21.375,\r
,,1253151,Moi University,21.375,\r
,,1279151,Mount Kenya University,21.375,\r
,,1068447,Pan Africa Christian University,21.375,\r
,,1073151,Rongo University,21.375,\r
,,1063154,Technical University of Mombasa,21.375,\r
,,1500151,The East African University,21.375,\r
,,1515151,Tom Mboya University,-,\r
,,1570151,Turkana University College,21.375,\r
,,1181154,"University of Eastern Africa, Baraton",21.375,\r
,,1181151,"University of Eastern Africa, Baraton",21.375,\r
,,1114151,University of Eldoret,21.375,\r
,,,,,\r
BACHELOR IN BUSINESS ADMINISTRATION,2,,,,Mathematics: C\r
,,1600151,Alupe University,19.799,\r
,,1700151,Bomet University College,19.799,\r
,,1080151,Co-operative University of Kenya,21.375,\r
,,1096151,Garissa University,19.799,\r
,,3895151,Islamic University of Kenya,21.375,\r
,,5535151,Kabarnet University College,-,\r
,,1244151,Karatina University,19.799,\r
,,1169151,Kenya Highlands Evangelical University,21.375,\r
,,1108151,Kibabii University,19.799,\r
,,1079151,Kirinyaga University,19.799,\r
,,1087651,Kisii University (Business Info & Management),21.375,\r
,,1087151,Kisii University,21.375,\r
,,1530151,Marist International University College,21.375,\r
,,1229151,Maseno University,21.375,\r
,,1253151,Moi University,21.375,\r
,,1279151,Mount Kenya University,21.375,\r
,,1068447,Pan Africa Christian University,21.375,\r
,,1073151,Rongo University,21.375,\r
,,1063154,Technical University of Mombasa,21.375,\r
,,1500151,The East African University,21.375,\r
,,1515151,Tom Mboya University,-,\r
,,1570151,Turkana University College,21.375,\r
,,1181154,"University of Eastern Africa, Baraton (Office Admin)",21.375,\r
,,1181151,"University of Eastern Africa, Baraton (Management)",21.375,\r
,,1114151,University of Eldoret,21.375,\r
,,,,,\r
BACHELOR OF TOURISM MANAGEMENT,2,,,,None\r
,,1600157,Alupe University,22.311,\r
,,1105222,Chuka University,24.284,\r
,,1080684,Co-operative University of Kenya,29.219,\r
,,1053235,Jaramogi Oginga Odinga University of Science and Technology,22.618,\r
,,1244157,Karatina University,23.831,\r
,,1077684,Kenya Methodist University,19.799,\r
,,1087234,Kisii University,22.277,\r
,,1165157,Maasai Mara University,27.437,\r
,,1253157,Moi University,22.365,\r
,,1253234,Moi University,22.292,\r
,,1279684,Mount Kenya University,22.158,\r
,,1246157,Murang'a University of Technology,22.257,\r
,,1246234,Murang'a University of Technology,22.316,\r
,,1073157,Rongo University,22.806,\r
,,1091684,Taita Taveta University,-,\r
,,1112157,Technical University of Kenya,28.064,\r
,,1063157,Technical University of Mombasa,23.801,\r
,,1114234,University of Eldoret,23.068,\r
,,1114157,University of Eldoret,23.155,\r
,,1118157,University of Kabianga,21.375,\r
,,,,,\r
BACHELOR OF SCIENCE IN HUMAN REOURCE MANAGEMENT,2,,,,None\r
,,1700189,Bomet University College,22.476,\r
,,1080189,Co-operative University of Kenya,29.337,\r
,,1096189,Garissa University,19.799,\r
,,1249189,Jomo Kenyatta University of Agriculture and Technology,30.427,\r
,,1244189,Karatina University,24.975,\r
,,1111189,Kenyatta University,32.565,\r
,,1079189,Kirinyaga University,22.665,\r
,,1087189,Kisii University,25.726,\r
,,1165189,Maasai Mara University,22.084,\r
,,1229189,Maseno University,28.799,\r
,,1240189,Meru University of Science and Technology,24.659,\r
,,1253189,Moi University,26.656,\r
,,1246189,Murang'a University of Technology,23.632,\r
,,1073189,Rongo University,22.86,\r
,,1063189,Technical University of Mombasa,28.452,\r
,,1515189,Tom Mboya University,22.366,\r
,,1118189,University of Kabianga,23.016,\r
,,,,,\r
BACHELOR OF SCIENCE IN EMPLOYMENT AND LABOUR STUDIES,2,,,,Mathematics: C\r
,,1515C20,Tom Mboya University,19.799,\r
,,,,,\r
BACHELOR OF BUSINESS INFORMATION TECHNOLOGY,2,,,,Mathematics: C\r
,,1078244,AFRICANAZARENEUNIVERSITY,19.799,\r
,,1600244,ALUPEUNIVERSITY,19.799,\r
,,1080206,CO-OPERATIVEUNIVERSITYOFKENYA,30.772,\r
,,1173244,DEDANKIMATHIUNIVERSITYOFTECHNOLOGY,31.259,\r
,,1053554,JARAMOGIOGINGAODINGAUNIVERSITYOFSCIENCEANDTECHNOLOGY,19.799,\r
,,1249536,JOMOKENYATTAUNIVERSITYOFAGRICULTUREANDTECHNOLOGY,28.168,\r
,,1249244,JOMOKENYATTAUNIVERSITYOFAGRICULTUREANDTECHNOLOGY,34.605,\r
,,1061206,KABARAKUNIVERSITY,19.799,\r
,,1061301,KABARAKUNIVERSITY,19.799,\r
,,1103206,KCAUNIVERSITY,19.799,\r
,,1077244,KENYAMETHODISTUNIVERSITY,19.799,\r
,,1079206,KIRINYAGAUNIVERSITY,19.799,\r
,,1460206,KIRIRIWOMENSUNIVERSITYOFSCIENCEANDTECHNOLOGY,19.799,\r
,,1066244,MANAGEMENTUNIVERSITYOFAFRICA,19.799,\r
,,1240244,MERUUNIVERSITYOFSCIENCEANDTECHNOLOGY,24.231,\r
,,1279244,MOUNTKENYAUNIVERSITY,24.087,\r
,,1164244,MULTIMEDIAUNIVERSITYOFKENYA,31.802,\r
,,1246244,MURANG'AUNIVERSITYOFTECHNOLOGY,27.402,\r
,,1068244,PANAFRICACHRISTIANUNIVERSITY,19.799,\r
,,1060244,RIARAUNIVERSITY,30.961,\r
,,1090244,SCOTTCHRISTIANUNIVERSITY,19.799,\r
,,1166244,SOUTHEASTERNKENYAUNIVERSITY,19.799,\r
,,1107206,STPAULSUNIVERSITY,19.799,\r
,,1091244,TAITATAVETAUNIVERSITY,19.799,\r
,,1063244,TECHNICALUNIVERSITYOFMOMBASA,19.799,\r
,,1500244,THEEASTAFRICANUNIVERSITY,19.799,\r
,,1181244,"UNIVERSITYOFEASTERNAFRICA,BARATON",19.799,\r
,,1093244,UNIVERSITYOFEMBU,25.619,\r
,,1425244,ZETECHUNIVERSITY,19.799,\r
,,,,,\r
BACHELOR OF HOTEL AND HOSPITALITY MANAGEMENT,2,,,,None\r
,,1600222,ALUPE UNIVERSITY,23.083,\r
,,1105223,CHUKA UNIVERSITY,25.581,\r
,,1173221,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,26.091,\r
,,1057223,EGERTON UNIVERSITY,27.917,\r
,,1088224,GRETSA UNIVERSITY,19.799,\r
,,1088221,GRETSA UNIVERSITY,19.799,\r
,,1061224,KABARAK UNIVERSITY,21.764,\r
,,1244222,KARATINA UNIVERSITY,24.717,\r
,,1077224,KENYA METHODIST UNIVERSITY,19.799,\r
,,1111221,KENYATTA UNIVERSITY,30.444,\r
,,1580221,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,26.381,\r
,,1460821,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1087223,KISII UNIVERSITY,23.063,\r
,,1087387,KISII UNIVERSITY,25.298,\r
,,1165222,MAASAI MARA UNIVERSITY,27.31,\r
,,1170221,MACHAKOS UNIVERSITY,26.125,\r
,,1229223,MASENO UNIVERSITY,28.14,\r
,,1082427,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,26.523,\r
,,1240224,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,23.048,\r
,,1253222,MOI UNIVERSITY,22.894,\r
,,1279224,MOUNT KENYA UNIVERSITY,27.319,\r
,,1246821,MURANG'A UNIVERSITY OF TECHNOLOGY,23.037,\r
,,1196221,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,19.799,\r
,,1117224,PWANI UNIVERSITY,27.353,\r
,,1073222,RONGO UNIVERSITY,22.435,\r
,,1073223,RONGO UNIVERSITY,22.458,\r
,,1090221,SCOTT CHRISTIAN UNIVERSITY,19.799,\r
,,1112821,TECHNICAL UNIVERSITY OF KENYA,29.113,\r
,,1515223,TOM MBOYA UNIVERSITY,21.964,\r
,,1114222,UNIVERSITY OF ELDORET,26.44,\r
,,1093224,UNIVERSITY OF EMBU,25.735,\r
,,,,,\r
BACHELOR OF INFORMATION SCIENCE,2,,,,Mathematics: C\r
,,1087B69,KISII UNIVERSITY,19.799,\r
,,1093B69,UNIVERSITY OF EMBU,19.799,\r
,,1263B69,UNIVERSITY OF NAIROBI,19.799,\r
,,,,,\r
BACHELOR OF SCIENCE IN PROCUREMENT AND CONTRACT MANAGEMENT,2,,,,\r
,,1078249,AFRICA NAZARENE UNIVERSITY,19.799,\r
,,1105247,CHUKA UNIVERSITY,19.799,Mathematics: C\r
,,1080247,CO-OPERATIVE UNIVERSITY OF KENYA,19.799,\r
,,1173247,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,19.799,\r
,,1057249,EGERTON UNIVERSITY,19.799,\r
,,1053248,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1249247,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,23.199,\r
,,1249245,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.127,\r
,,1061250,KABARAK UNIVERSITY,19.799,\r
,,1103250,KCA UNIVERSITY,19.799,\r
,,1079247,KIRINYAGA UNIVERSITY,19.799,\r
,,1460249,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1087247,KISII UNIVERSITY,19.799,\r
,,1229245,MASENO UNIVERSITY,19.799,\r
,,1240250,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1279255,MOUNT KENYA UNIVERSITY,19.799,\r
,,1164250,MULTIMEDIA UNIVERSITY OF KENYA,19.799,\r
,,1246249,MURANG'A UNIVERSITY OF TECHNOLOGY,19.799,\r
,,1073247,RONGO UNIVERSITY,19.799,\r
,,1166249,SOUTH EASTERN KENYA UNIVERSITY,19.799,\r
,,1091247,TAITA TAVETA UNIVERSITY,19.799,\r
,,1063247,TECHNICAL UNIVERSITY OF MOMBASA,19.799,\r
,,1685250,THARAKA UNIVERSITY,19.799,\r
,,1093249,UNIVERSITY OF EMBU,19.799,\r
,,1425255,ZETECH UNIVERSITY,19.799,\r
,,,,,\r
BACHELOR OF ENTREPRENEURSHIP,2,,,,Mathematics: C\r
,,1119298,AFRICA INTERNATIONAL UNIVERSITY,19.799,\r
,,1700299,BOMET UNIVERSITY COLLEGE,19.799,\r
,,1105299,CHUKA UNIVERSITY,19.799,\r
,,1080297,CO-OPERATIVE UNIVERSITY OF KENYA,19.799,\r
,,1057298,EGERTON UNIVERSITY,19.799,\r
,,1057299,EGERTON UNIVERSITY,19.799,\r
,,1249298,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,19.799,\r
,,1079298,KIRINYAGA UNIVERSITY,19.799,\r
,,1087299,KISII UNIVERSITY,19.799,\r
,,1165298,MAASAI MARA UNIVERSITY,19.799,\r
,,1229299,MASENO UNIVERSITY,19.799,\r
,,5145299,OPEN UNIVERSITY OF KENYA,19.799,\r
,,1685298,THARAKA UNIVERSITY,19.799,\r
,,1114299,UNIVERSITY OF ELDORET,19.799,\r
,,,,,\r
BACHELOR OF PROJECT MANAGEMENT,2,,,,None\r
,,1700327,BOMET UNIVERSITY COLLEGE,19.799,\r
,,1249327,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.434,\r
,,5535327,KABARNET UNIVERSITY COLLEGE,-,\r
,,1244327,KARATINA UNIVERSITY,21.877,\r
,,1087327,KISII UNIVERSITY,22.206,\r
,,3890327,KOITALEEL SAMOEI UNIVERSITY COLLEGE,19.799,\r
,,1165327,MAASAI MARA UNIVERSITY,19.799,\r
,,1253327,MOI UNIVERSITY,19.799,\r
,,1073327,RONGO UNIVERSITY,19.799,\r
,,1166327,SOUTH EASTERN KENYA UNIVERSITY,19.799,\r
,,1515327,TOM MBOYA UNIVERSITY,19.799,\r
,,1114327,UNIVERSITY OF ELDORET,25.208,\r
,,1263327,UNIVERSITY OF NAIROBI,26.752,\r
,,,,,\r
BACHELOR OF SCIENCE IN INTERNATIONAL BUSINESS MANAGEMENT,2,,,,Mathematics: C\r
,,1119153,AFRICA INTERNATIONAL UNIVERSITY,19.799,\r
,,1078647,AFRICA NAZARENE UNIVERSITY,19.799,\r
,,1173153,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,19.799,\r
,,1053153,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1103647,KCA UNIVERSITY,19.799,\r
,,1555153,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,19.799,\r
,,1077153,KENYA METHODIST UNIVERSITY,19.799,\r
,,1460205,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1229153,MASENO UNIVERSITY,19.799,\r
,,1240153,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,1196153,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,19.799,\r
,,1060153,RIARA UNIVERSITY,19.799,\r
,,1090153,SCOTT CHRISTIAN UNIVERSITY,19.799,\r
,,1107153,ST PAULS UNIVERSITY,19.799,\r
,,1063153,TECHNICAL UNIVERSITY OF MOMBASA,19.799,\r
,,1515153,TOM MBOYA UNIVERSITY,19.799,\r
,,1181153,"UNIVERSITY OF EASTERN AFRICA, BARATON",19.799,\r
,,1425168,ZETECH UNIVERSITY,19.799,\r
,,,,,\r
BACHELOR OF CO-OPERATIVE MANAGEMENT,2,,,,Mathematics: C\r
,,1105510,CHUKA UNIVERSITY,19.799,\r
,,1080510,CO-OPERATIVE UNIVERSITY OF KENYA,19.799,\r
,,1080610,CO-OPERATIVE UNIVERSITY OF KENYA,19.799,\r
,,1108510,KIBABII UNIVERSITY,19.799,\r
,,1087510,KISII UNIVERSITY,19.799,\r
,,1240510,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,19.799,\r
,,,,,\r
BACHELOR OF CATERING AND HOSPITALITY MANAGEMENT,2,,,,\r
,,1105387,CHUKA UNIVERSITY,22.257,None\r
,,1080387,CO-OPERATIVE UNIVERSITY OF KENYA,28.062,\r
,,1229B52,MASENO UNIVERSITY,25.466,\r
,,1112470,TECHNICAL UNIVERSITY OF KENYA,26.419,\r
,,1685387,THARAKA UNIVERSITY,22.406,\r
,,,,,\r
BACHELOR OF SCIENCE (FOOD OPERATIONS MANAGEMENT),2,,,,\r
,,1249639,Jomo Kenyatta University of Agriculture and Technology,26.241,None\r
,,1114353,University of Eldoret,19.799,\r
,,,,,\r
BACHELOR OF ARTS,3,,,,None\r
,,1700201,BOMET UNIVERSITY COLLEGE,22.194,\r
,,1700101,BOMET UNIVERSITY COLLEGE,23.388,\r
,,1105101,CHUKA UNIVERSITY,24.851,\r
,,1057101,EGERTON UNIVERSITY,21.799,\r
,,5535101,KABARNET UNIVERSITY COLLEGE,-,\r
,,1244201,KARATINA UNIVERSITY,21.736,\r
,,1111101,KENYATTA UNIVERSITY,25.617,\r
,,1087101,KISII UNIVERSITY,22.173,\r
,,3890101,KOITALEEL SAMOEI UNIVERSITY COLLEGE,23.541,\r
,,1170101,MACHAKOS UNIVERSITY,23.405,\r
,,1229101,MASENO UNIVERSITY,23.582,\r
,,1253101,MOI UNIVERSITY,22.729,\r
,,1253201,MOI UNIVERSITY,22.132,\r
,,1164101,MULTIMEDIA UNIVERSITY OF KENYA,22.851,\r
,,1117101,PWANI UNIVERSITY,23.038,\r
,,1073101,RONGO UNIVERSITY,24.252,\r
,,1166101,SOUTH EASTERN KENYA UNIVERSITY,23.008,\r
,,1685101,THARAKA UNIVERSITY,23.322,\r
,,1515101,TOM MBOYA UNIVERSITY,24.247,\r
,,1263101,UNIVERSITY OF NAIROBI,23.031,\r
,,,,,\r
BACHELOR OF ARTS (CRIMINOLOGY & SECURITY STUDIES),3,,,,None\r
,,1078136,AFRICA NAZARENE UNIVERSITY,20.473,\r
,,1700598,BOMET UNIVERSITY COLLEGE,20.473,\r
,,1105136,CHUKA UNIVERSITY,27.699,\r
,,1057136,EGERTON UNIVERSITY,28.366,\r
,,1470136,KAIMOSI FRIENDS UNIVERSITY,20.473,\r
,,1244136,KARATINA UNIVERSITY,25.545,\r
,,1103136,KCA UNIVERSITY,20.473,\r
,,1077136,KENYA METHODIST UNIVERSITY,20.473,\r
,,1108136,KIBABII UNIVERSITY,23.537,\r
,,1087136,KISII UNIVERSITY,25.081,\r
,,1176136,LAIKIPIA UNIVERSITY,20.473,\r
,,1165136,MAASAI MARA UNIVERSITY,23.094,\r
,,1229136,MASENO UNIVERSITY,27.306,\r
,,1082136,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,25.242,\r
,,1279672,MOUNT KENYA UNIVERSITY,23.009,\r
,,1246136,MURANG'A UNIVERSITY OF TECHNOLOGY,22.212,\r
,,1166136,SOUTH EASTERN KENYA UNIVERSITY,23.425,\r
,,1107136,ST PAULS UNIVERSITY,20.473,\r
,,1063672,TECHNICAL UNIVERSITY OF MOMBASA,23.569,\r
,,1685136,THARAKA UNIVERSITY,20.473,\r
,,1515136,TOM MBOYA UNIVERSITY,20.473,\r
,,1570136,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1093136,UNIVERSITY OF EMBU,22.254,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF ARTS (ANTHROPOLOGY),3,,,,None\r
,,1480106,Catholic University of Eastern Africa,20.473,\r
,,1117106,Pwani University,20.473,\r
,,1263106,University of Nairobi,20.473,\r
,,,,,\r
BACHELOR OF ARTS (SOCIAL WORK),3,,,,None\r
,,1480144,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1162144,DAYSTAR UNIVERSITY,20.473,\r
,,1470145,KAIMOSI FRIENDS UNIVERSITY,20.473,\r
,,1108145,KIBABII UNIVERSITY,20.473,\r
,,1165144,MAASAI MARA UNIVERSITY,20.473,\r
,,1082145,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,23.223,\r
,,1253144,MOI UNIVERSITY,20.473,\r
,,1279685,MOUNT KENYA UNIVERSITY,20.473,\r
,,1166144,SOUTH EASTERN KENYA UNIVERSITY,20.473,\r
,,1107144,ST PAULS UNIVERSITY,20.473,\r
,,1570685,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1093144,UNIVERSITY OF EMBU,23.586,\r
,,,,,\r
BACHELOR OF ARTS (PUBLIC ADMINISTRATION),3,,,,\r
,,1700550,BOMET UNIVERSITY COLLEGE,23.009,None\r
,,1480550,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1096550,GARISSA UNIVERSITY,20.473,\r
,,1249259,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,26.936,\r
,,1249149,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.402,\r
,,1244550,KARATINA UNIVERSITY,23.283,\r
,,1103259,KCA UNIVERSITY,20.473,\r
,,1111659,KENYATTA UNIVERSITY,30.243,\r
,,1580659,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,22.152,\r
,,1087159,KISII UNIVERSITY,23.236,\r
,,1495671,LUKENYA UNIVERSITY,20.473,\r
,,1165550,MAASAI MARA UNIVERSITY,23.465,\r
,,1170159,MACHAKOS UNIVERSITY,24.423,\r
,,1279659,MOUNT KENYA UNIVERSITY,20.473,\r
,,1279671,MOUNT KENYA UNIVERSITY,20.473,\r
,,1246159,MURANG'A UNIVERSITY OF TECHNOLOGY,23.221,\r
,,1073550,RONGO UNIVERSITY,20.473,\r
,,1091659,TAITA TAVETA UNIVERSITY,-,\r
,,1118159,UNIVERSITY OF KABIANGA,23.179,\r
,,1263550,UNIVERSITY OF NAIROBI,30.429,\r
,,1425550,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS (COMMUNITY DEVELOPMENT),3,,,,\r
,,1119303,AFRICA INTERNATIONAL UNIVERSITY,20.473,None\r
,,1078171,AFRICA NAZARENE UNIVERSITY,20.473,\r
,,1600171,ALUPE UNIVERSITY,20.473,\r
,,1480303,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1105239,CHUKA UNIVERSITY,22.941,\r
,,1080239,CO-OPERATIVE UNIVERSITY OF KENYA,22.945,\r
,,1080303,CO-OPERATIVE UNIVERSITY OF KENYA,23.347,\r
,,1162171,DAYSTAR UNIVERSITY,20.473,\r
,,1057239,EGERTON UNIVERSITY,23.488,\r
,,1096171,GARISSA UNIVERSITY,20.473,\r
,,1088171,GRETSA UNIVERSITY,20.473,\r
,,1249303,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,23.896,\r
,,1249243,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,26.503,\r
,,1244171,KARATINA UNIVERSITY,20.473,\r
,,1555171,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,20.473,\r
,,1460386,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,20.473,\r
,,1087303,KISII UNIVERSITY,20.473,\r
,,1087171,KISII UNIVERSITY,20.473,\r
,,1176239,LAIKIPIA UNIVERSITY,20.473,\r
,,1495171,LUKENYA UNIVERSITY,20.473,\r
,,1165171,MAASAI MARA UNIVERSITY,20.473,\r
,,1170386,MACHAKOS UNIVERSITY,20.473,\r
,,1066303,MANAGEMENT UNIVERSITY OF AFRICA,20.473,\r
,,1229303,MASENO UNIVERSITY,20.473,\r
,,1253171,MOI UNIVERSITY,20.473,\r
,,1279171,MOUNT KENYA UNIVERSITY,20.473,\r
,,1279303,MOUNT KENYA UNIVERSITY,20.473,\r
,,1246303,MURANG'A UNIVERSITY OF TECHNOLOGY,20.473,\r
,,1068171,PAN AFRICA CHRISTIAN UNIVERSITY,20.473,\r
,,1090171,SCOTT CHRISTIAN UNIVERSITY,20.473,\r
,,1107171,ST PAULS UNIVERSITY,20.473,\r
,,1063303,TECHNICAL UNIVERSITY OF MOMBASA,20.473,\r
,,1685239,THARAKA UNIVERSITY,20.473,\r
,,1515303,TOM MBOYA UNIVERSITY,20.473,\r
,,1570303,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1181303,"UNIVERSITY OF EASTERN AFRICA, BARATON",20.473,\r
,,1114303,UNIVERSITY OF ELDORET,20.473,\r
,,,,,\r
BACHELOR OF JOURNALISM & MASS COMMUNICATION,3,,,,\r
,,1078242,AFRICA NAZARENE UNIVERSITY,20.473,English/Kiswahili: C+\r
,,1105385,CHUKA UNIVERSITY,29.384,\r
,,1057385,EGERTON UNIVERSITY,30.162,\r
,,1249242,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,30.205,\r
,,1249183,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,30.976,\r
,,1061242,KABARAK UNIVERSITY,20.473,\r
,,1103649,KCA UNIVERSITY,20.473,\r
,,1077182,KENYA METHODIST UNIVERSITY,20.473,\r
,,1111449,KENYATTA UNIVERSITY,31.668,\r
,,1108181,KIBABII UNIVERSITY,26.49,\r
,,1087385,KISII UNIVERSITY,27.868,\r
,,1176385,LAIKIPIA UNIVERSITY,23.827,\r
,,1165182,MAASAI MARA UNIVERSITY,26.581,\r
,,1229385,MASENO UNIVERSITY,28.67,\r
,,1082181,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,27.444,\r
,,1240182,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,25.762,\r
,,1253182,MOI UNIVERSITY,23.564,\r
,,1279181,MOUNT KENYA UNIVERSITY,22.68,\r
,,1164183,MULTIMEDIA UNIVERSITY OF KENYA,30.494,\r
,,1246649,MURANG'A UNIVERSITY OF TECHNOLOGY,26.578,\r
,,5145649,OPEN UNIVERSITY OF KENYA,20.473,\r
,,1196242,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,20.473,\r
,,1073449,RONGO UNIVERSITY,23.887,\r
,,1073182,RONGO UNIVERSITY,23.723,\r
,,1112400,TECHNICAL UNIVERSITY OF KENYA,30.63,\r
,,1063181,TECHNICAL UNIVERSITY OF MOMBASA,27.849,\r
,,1063177,TECHNICAL UNIVERSITY OF MOMBASA,26.8,\r
,,1685181,THARAKA UNIVERSITY,23.431,\r
,,1181242,"UNIVERSITY OF EASTERN AFRICA, BARATON",20.473,\r
,,1093604,UNIVERSITY OF EMBU,25.771,\r
,,1263181,UNIVERSITY OF NAIROBI,31.685,\r
,,1425183,ZETECH UNIVERSITY,20.473,\r
,,1425449,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF SCIENCE IN PUBLIC MANAGEMENT,3,,,,\r
,,1700550,BOMET UNIVERSITY COLLEGE,23.009,None\r
,,1480550,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1096550,GARISSA UNIVERSITY,20.473,\r
,,1249259,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,26.936,\r
,,1249149,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.402,\r
,,1244550,KARATINA UNIVERSITY,23.283,\r
,,1103259,KCA UNIVERSITY,20.473,\r
,,1111659,KENYATTA UNIVERSITY,30.243,\r
,,1580659,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,22.152,\r
,,1087159,KISII UNIVERSITY,23.236,\r
,,1495671,LUKENYA UNIVERSITY,20.473,\r
,,1165550,MAASAI MARA UNIVERSITY,23.465,\r
,,1170159,MACHAKOS UNIVERSITY,24.423,\r
,,1279659,MOUNT KENYA UNIVERSITY,20.473,\r
,,1279671,MOUNT KENYA UNIVERSITY,20.473,\r
,,1246159,MURANG'A UNIVERSITY OF TECHNOLOGY,23.221,\r
,,1073550,RONGO UNIVERSITY,20.473,\r
,,1091659,TAITA TAVETA UNIVERSITY,-,\r
,,1118159,UNIVERSITY OF KABIANGA,23.179,\r
,,1263550,UNIVERSITY OF NAIROBI,30.429,\r
,,1425550,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS (INTERNATIONAL RELATIONS AND DIPLOMACY),3,,,,\r
,,1480296,CATHOLIC UNIVERSITY OF EASTERN AFRICA,23.142,English/Kiswahili: C+\r
,,1162307,DAYSTAR UNIVERSITY,20.473,\r
,,1077296,KENYA METHODIST UNIVERSITY,20.473,\r
,,1111295,KENYATTA UNIVERSITY,33.921,\r
,,1229295,MASENO UNIVERSITY,26.49,\r
,,1279295,MOUNT KENYA UNIVERSITY,24.662,\r
,,1060295,RIARA UNIVERSITY,32.701,\r
,,1073295,RONGO UNIVERSITY,22.045,\r
,,1112295,TECHNICAL UNIVERSITY OF KENYA,32.439,\r
,,1263296,UNIVERSITY OF NAIROBI,33.02,\r
,,1425296,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS (GENDER AND DEVELOPMENT STUDIES),3,,,,\r
,,1057304,EGERTON UNIVERSITY,20.473,None\r
,,1111302,KENYATTA UNIVERSITY,20.473,\r
,,1087302,KISII UNIVERSITY,20.473,\r
,,1170302,MACHAKOS UNIVERSITY,20.473,\r
,,1166304,SOUTH EASTERN KENYA UNIVERSITY,20.473,\r
,,1263302,UNIVERSITY OF NAIROBI,20.473,\r
,,,,,\r
BACHELOR OF ARTS IN DEVELOPMENT STUDIES,3,,,,\r
,,1119303,AFRICA INTERNATIONAL UNIVERSITY,20.473,None\r
,,1078171,AFRICA NAZARENE UNIVERSITY,20.473,\r
,,1600171,ALUPE UNIVERSITY,20.473,\r
,,1480303,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1105239,CHUKA UNIVERSITY,22.941,\r
,,1080239,CO-OPERATIVE UNIVERSITY OF KENYA,22.945,\r
,,1080303,CO-OPERATIVE UNIVERSITY OF KENYA,23.347,\r
,,1162171,DAYSTAR UNIVERSITY,20.473,\r
,,1057239,EGERTON UNIVERSITY,23.488,\r
,,1096171,GARISSA UNIVERSITY,20.473,\r
,,1088171,GRETSA UNIVERSITY,20.473,\r
,,1249303,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,23.896,\r
,,1249243,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,26.503,\r
,,1244171,KARATINA UNIVERSITY,20.473,\r
,,1555171,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,20.473,\r
,,1460386,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,20.473,\r
,,1087303,KISII UNIVERSITY,20.473,\r
,,1087171,KISII UNIVERSITY,20.473,\r
,,1176239,LAIKIPIA UNIVERSITY,20.473,\r
,,1495171,LUKENYA UNIVERSITY,20.473,\r
,,1165171,MAASAI MARA UNIVERSITY,20.473,\r
,,1170386,MACHAKOS UNIVERSITY,20.473,\r
,,1066303,MANAGEMENT UNIVERSITY OF AFRICA,20.473,\r
,,1229303,MASENO UNIVERSITY,20.473,\r
,,1253171,MOI UNIVERSITY,20.473,\r
,,1279171,MOUNT KENYA UNIVERSITY,20.473,\r
,,1279303,MOUNT KENYA UNIVERSITY,20.473,\r
,,1246303,MURANG'A UNIVERSITY OF TECHNOLOGY,20.473,\r
,,1068171,PAN AFRICA CHRISTIAN UNIVERSITY,20.473,\r
,,1090171,SCOTT CHRISTIAN UNIVERSITY,20.473,\r
,,1107171,ST PAULS UNIVERSITY,20.473,\r
,,1063303,TECHNICAL UNIVERSITY OF MOMBASA,20.473,\r
,,1685239,THARAKA UNIVERSITY,20.473,\r
,,1515303,TOM MBOYA UNIVERSITY,20.473,\r
,,1570303,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1181303,"UNIVERSITY OF EASTERN AFRICA, BARATON",20.473,\r
,,1114303,UNIVERSITY OF ELDORET,20.473,\r
,,,,,\r
BACHELOR OF ARTS IN KISWAHILI,3,,,,\r
,,1700324,BOMET UNIVERSITY COLLEGE,20.473,Kiswahili: C+\r
,,1480325,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1087324,KISII UNIVERSITY,23.482,\r
,,1176325,LAIKIPIA UNIVERSITY,20.473,\r
,,1165325,MAASAI MARA UNIVERSITY,20.473,\r
,,1229324,MASENO UNIVERSITY,23.587,\r
,,1253324,MOI UNIVERSITY,20.473,\r
,,1117324,PWANI UNIVERSITY,20.473,\r
,,1073324,RONGO UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF SCIENCE (DISASTER RISK MANAGEMENT AND SUSTAINABLE DEVELOPMENT),3,,,,\r
,,1080549,CO-OPERATIVE UNIVERSITY OF KENYA,20.473,None\r
,,1470644,KAIMOSI FRIENDS UNIVERSITY,20.473,\r
,,1229544,MASENO UNIVERSITY,20.473,\r
,,1082368,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1082369,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1082644,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1082744,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1082844,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1570549,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,,,,\r
BACHELOR OF COMMUNICATION AND MEDIA STUDIES,3,,,,\r
,,1078242,AFRICA NAZARENE UNIVERSITY,20.473,English/Kiswahili: C+\r
,,1105385,CHUKA UNIVERSITY,29.384,\r
,,1057385,EGERTON UNIVERSITY,30.162,\r
,,1249242,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,30.205,\r
,,1249183,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,30.976,\r
,,1061242,KABARAK UNIVERSITY,20.473,\r
,,1103649,KCA UNIVERSITY,20.473,\r
,,1077182,KENYA METHODIST UNIVERSITY,20.473,\r
,,1111449,KENYATTA UNIVERSITY,31.668,\r
,,1108181,KIBABII UNIVERSITY,26.49,\r
,,1087385,KISII UNIVERSITY,27.868,\r
,,1176385,LAIKIPIA UNIVERSITY,23.827,\r
,,1165182,MAASAI MARA UNIVERSITY,26.581,\r
,,1229385,MASENO UNIVERSITY,28.67,\r
,,1082181,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,27.444,\r
,,1240182,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,25.762,\r
,,1253182,MOI UNIVERSITY,23.564,\r
,,1279181,MOUNT KENYA UNIVERSITY,22.68,\r
,,1164183,MULTIMEDIA UNIVERSITY OF KENYA,30.494,\r
,,1246649,MURANG'A UNIVERSITY OF TECHNOLOGY,26.578,\r
,,5145649,OPEN UNIVERSITY OF KENYA,20.473,\r
,,1196242,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,20.473,\r
,,1073449,RONGO UNIVERSITY,23.887,\r
,,1073182,RONGO UNIVERSITY,23.723,\r
,,1112400,TECHNICAL UNIVERSITY OF KENYA,30.63,\r
,,1063181,TECHNICAL UNIVERSITY OF MOMBASA,27.849,\r
,,1063177,TECHNICAL UNIVERSITY OF MOMBASA,26.8,\r
,,1685181,THARAKA UNIVERSITY,23.431,\r
,,1181242,"UNIVERSITY OF EASTERN AFRICA, BARATON",20.473,\r
,,1093604,UNIVERSITY OF EMBU,25.771,\r
,,1263181,UNIVERSITY OF NAIROBI,31.685,\r
,,1425183,ZETECH UNIVERSITY,20.473,\r
,,1425449,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS IN PHILOSOPHY,3,,,,\r
,,1480392,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,None\r
,,1105392,CHUKA UNIVERSITY,20.473,\r
,,1165392,MAASAI MARA UNIVERSITY,20.473,\r
,,1117585,PWANI UNIVERSITY,20.473,\r
,,1475392,TANGAZA UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS IN LANGUAGE AND COMMUNICATION,3,,,,\r
,,1119621,AFRICA INTERNATIONAL UNIVERSITY,-,English/Kiswahili: C+\r
,,1105497,CHUKA UNIVERSITY,20.473,\r
,,1162602,DAYSTAR UNIVERSITY,20.473,\r
,,1162620,DAYSTAR UNIVERSITY,20.473,\r
,,1087520,KISII UNIVERSITY,20.473,\r
,,1176583,LAIKIPIA UNIVERSITY,20.473,\r
,,1165393,MAASAI MARA UNIVERSITY,20.473,\r
,,1229621,MASENO UNIVERSITY,20.473,\r
,,1253621,MOI UNIVERSITY,20.473,\r
,,1164497,MULTIMEDIA UNIVERSITY OF KENYA,20.473,\r
,,1246621,MURANG'A UNIVERSITY OF TECHNOLOGY,20.473,\r
,,1068620,PAN AFRICA CHRISTIAN UNIVERSITY,20.473,\r
,,1073520,RONGO UNIVERSITY,20.473,\r
,,1073621,RONGO UNIVERSITY,20.473,\r
,,1107620,ST PAULS UNIVERSITY,20.473,\r
,,1475323,TANGAZA UNIVERSITY,20.473,\r
,,,,,\r
"BACHELOR OF ARTS IN LITERATURE, THEATRE AND FILM",3,,,,\r
,,1105524,CHUKA UNIVERSITY,23.965,English/Kiswahili: C+\r
,,1087524,KISII UNIVERSITY,20.473,\r
,,1165394,MAASAI MARA UNIVERSITY,20.473,\r
,,1229524,MASENO UNIVERSITY,23.689,\r
,,1117524,PWANI UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF MANAGEMENT AND LEADERSHIP,3,,,,\r
,,1225448,INTERNATIONAL LEADERSHIP UNIVERSITY,20.473,None\r
,,1249493,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,19.799,\r
,,1066448,MANAGEMENT UNIVERSITY OF AFRICA,20.473,\r
,,1117448,PWANI UNIVERSITY,20.473,\r
,,1090448,SCOTT CHRISTIAN UNIVERSITY,20.473,\r
,,1107448,ST PAULS UNIVERSITY,20.473,\r
,,1475448,TANGAZA UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS IN POLITICAL SCIENCE,3,,,,\r
,,1700550,BOMET UNIVERSITY COLLEGE,23.009,None\r
,,1480550,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1096550,GARISSA UNIVERSITY,20.473,\r
,,1249259,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,26.936,\r
,,1249149,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.402,\r
,,1244550,KARATINA UNIVERSITY,23.283,\r
,,1103259,KCA UNIVERSITY,20.473,\r
,,1111659,KENYATTA UNIVERSITY,30.243,\r
,,1580659,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,22.152,\r
,,1087159,KISII UNIVERSITY,23.236,\r
,,1495671,LUKENYA UNIVERSITY,20.473,\r
,,1165550,MAASAI MARA UNIVERSITY,23.465,\r
,,1170159,MACHAKOS UNIVERSITY,24.423,\r
,,1279659,MOUNT KENYA UNIVERSITY,20.473,\r
,,1279671,MOUNT KENYA UNIVERSITY,20.473,\r
,,1246159,MURANG'A UNIVERSITY OF TECHNOLOGY,23.221,\r
,,1073550,RONGO UNIVERSITY,20.473,\r
,,1091659,TAITA TAVETA UNIVERSITY,-,\r
,,1118159,UNIVERSITY OF KABIANGA,23.179,\r
,,1263550,UNIVERSITY OF NAIROBI,30.429,\r
,,1425550,ZETECH UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF ARTS (LITERATURE),3,,,,\r
,,1105524,CHUKA UNIVERSITY,23.965,English/Kiswahili: C+\r
,,1087524,KISII UNIVERSITY,20.473,\r
,,1165394,MAASAI MARA UNIVERSITY,20.473,\r
,,1229524,MASENO UNIVERSITY,23.689,\r
,,1117524,PWANI UNIVERSITY,20.473,\r
,,,,,\r
BACHELOR OF SCIENCE IN CONFLICT RESOLUTION AND HUMANITARIAN ASSISTANCE,3,,,,\r
,,1078669,AFRICA NAZARENE UNIVERSITY,20.473,None\r
,,1480652,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1162662,DAYSTAR UNIVERSITY,20.473,\r
,,1111668,KENYATTA UNIVERSITY,20.473,\r
,,1087662,KISII UNIVERSITY,20.473,\r
,,1176581,LAIKIPIA UNIVERSITY,20.473,\r
,,1082595,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1279669,MOUNT KENYA UNIVERSITY,20.473,\r
,,1107662,ST PAULS UNIVERSITY,20.473,\r
,,1570595,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1118581,UNIVERSITY OF KABIANGA,20.473,\r
,,,,,\r
BACHELOR OF JUSTICE AND PEACE,3,,,,\r
,,1078669,AFRICA NAZARENE UNIVERSITY,20.473,None\r
,,1480652,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.473,\r
,,1162662,DAYSTAR UNIVERSITY,20.473,\r
,,1111668,KENYATTA UNIVERSITY,20.473,\r
,,1087662,KISII UNIVERSITY,20.473,\r
,,1176581,LAIKIPIA UNIVERSITY,20.473,\r
,,1082595,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.473,\r
,,1279669,MOUNT KENYA UNIVERSITY,20.473,\r
,,1107662,ST PAULS UNIVERSITY,20.473,\r
,,1570595,TURKANA UNIVERSITY COLLEGE,20.473,\r
,,1118581,UNIVERSITY OF KABIANGA,20.473,\r
,,,,,\r
BACHELOR OF SCIENCE (METEOROLOGY),4,,,,\r
,,1166110,South Eastern Kenya University,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1263110,University of Nairobi,15.794,\r
,,,,,\r
BACHELOR OF SCIENCE (GEOLOGY),4,,,,\r
,,1173113,Dedan Kimathi University of Technology,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1166113,South Eastern Kenya University,15.794,\r
,,1263113,University of Nairobi,15.794,\r
,,,,,\r
BACHELOR OF ENGINEERING (GEOSPATIAL ENGINEERING),4,,,,\r
,,1112119,Technical University of Kenya,35.033,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1263119,University of Nairobi,36.025,\r
,,,,,\r
BACHELOR OF SCIENCE (ASTRONOMY AND ASTROPHYSICS),4,,,,\r
,,1263127,UNIVERSITY OF NAIROBI,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,,,,\r
"BACHELOR OF SCIENCE (EARTH SCIENCE, WITH IT)",4,,,,\r
,,1515210,TOM MBOYA UNIVERSITY,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,,,,\r
BACHELOR OF SCIENCE (MINING PHYSICS),4,,,,\r
,,1105C28,CHUKA UNIVERSITY,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,,,,\r
BACHELOR OF SCIENCE (GEOPHYSICS),4,,,,\r
,,1249377,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1087579,KISII UNIVERSITY,15.794,\r
,,,,,\r
BACHELOR OF TECHNOLOGY (GEOINFORMATION TECHNOLOGY),4,,,,\r
,,1112378,TECHNICAL UNIVERSITY OF KENYA,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,,,,\r
BACHELOR OF SCIENCE (HYDROLOGY AND WATER RESOURCES MANAGEMENT),4,,,,\r
,,1166487,SOUTH EASTERN KENYA UNIVERSITY,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,,,,\r
BACHELOR OF APPLIED SCIENCE (GEO-INFORMATICS),4,,,,\r
,,1249619,Jomo Kenyatta University of Agriculture and Technology,33.669,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1091619,Taita Taveta University,15.794,\r
,,1112553,Technical University of Kenya,29.656,\r
,,1515619,Tom Mboya University,15.794,\r
,,,,,\r
BACHELOR OF SCIENCE (GEOPHYSICS AND MINERALOGY),4,,,,\r
,,1249377,Jomo Kenyatta University of Agriculture and Technology,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1087579,Kisii University,15.794,\r
,,,,,\r
BACHELOR OF SCIENCE IN GEOSPATIAL INFORMATION SCIENCE AND REMOTE SENSING,4,,,,\r
,,1173719,Dedan Kimathi University of Technology,15.794,"Mathematics: C+
Physics: C+
Chemistry/Geography: C"\r
,,1249719,Jomo Kenyatta University of Agriculture and Technology,24.92,\r
,,1165719,Maasai Mara University,15.794,\r
,,1229819,Maseno University,15.794,\r
,,1082719,Masinde Muliro University of Science & Technology,15.794,\r
,,,,,\r
"BACHELOR OF SCIENCE (INDUSTRIAL CHEMISTRY, WITH IT)",5,,,,\r
,,1105108,CHUKA UNIVERSITY,15.299,"Mathematics: C
Physics: C
Chemistry: C+"\r
,,1173108,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,15.299,\r
,,1249108,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,23.033,\r
,,1111508,KENYATTA UNIVERSITY,23.749,\r
,,1087108,KISII UNIVERSITY,15.299,\r
,,1229108,MASENO UNIVERSITY,15.299,\r
,,1082108,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,15.299,\r
,,1279108,MOUNT KENYA UNIVERSITY,15.299,\r
,,1164108,MULTIMEDIA UNIVERSITY OF KENYA,15.299,\r
,,1246108,MURANG'A UNIVERSITY OF TECHNOLOGY,15.299,\r
,,1117108,PWANI UNIVERSITY,15.299,\r
,,1091108,TAITA TAVETA UNIVERSITY,15.299,\r
,,1112425,TECHNICAL UNIVERSITY OF KENYA,15.299,\r
,,1515108,TOM MBOYA UNIVERSITY,15.299,\r
,,1093108,UNIVERSITY OF EMBU,15.299,\r
,,1263108,UNIVERSITY OF NAIROBI,26.864,\r
,,,,,\r
BACHELOR OF SCIENCE (ANALYTICAL CHEMISTRY),5,,,,\r
,,1249114,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.299,"Mathematics: C
Physics: C
Chemistry: C+"\r
,,1111114,KENYATTA UNIVERSITY,15.299,\r
,,1079114,KIRINYAGA UNIVERSITY,15.299,\r
,,1087114,KISII UNIVERSITY,15.299,\r
,,1170114,MACHAKOS UNIVERSITY,15.299,\r
,,1229114,MASENO UNIVERSITY,15.299,\r
,,1164114,MULTIMEDIA UNIVERSITY OF KENYA,15.299,\r
,,1246114,MURANG'A UNIVERSITY OF TECHNOLOGY,15.299,\r
,,1091114,TAITA TAVETA UNIVERSITY,15.299,\r
,,1114114,UNIVERSITY OF ELDORET,15.299,\r
,,1093114,UNIVERSITY OF EMBU,15.299,\r
,,1263114,UNIVERSITY OF NAIROBI,24.726,\r
,,,,,\r
BACHELOR OF ENGINEERING (CIVIL ENGINEERING),5,,,,\r
,,1173116,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,39.366,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1057116,EGERTON UNIVERSITY,-,\r
,,1249116,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,42.3,\r
,,1111116,KENYATTA UNIVERSITY,42.546,\r
,,1170116,MACHAKOS UNIVERSITY,37.272,\r
,,1082616,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,38.276,\r
,,1253616,MOI UNIVERSITY,27.907,\r
,,1164116,MULTIMEDIA UNIVERSITY OF KENYA,38.79,\r
,,1246116,MURANG'A UNIVERSITY OF TECHNOLOGY,36.156,\r
,,1166116,SOUTH EASTERN KENYA UNIVERSITY,35.556,\r
,,1091116,TAITA TAVETA UNIVERSITY,34.293,\r
,,1112116,TECHNICAL UNIVERSITY OF KENYA,40.572,\r
,,1063116,TECHNICAL UNIVERSITY OF MOMBASA,37.233,\r
,,1114616,UNIVERSITY OF ELDORET,37.697,\r
,,1093116,UNIVERSITY OF EMBU,36.545,\r
,,1263116,UNIVERSITY OF NAIROBI,43.121,\r
,,,,,\r
BACHELOR OF SCIENCE (ELECTRICAL & ELECTRONICS ENGINEERING),5,,,,\r
,,1105117,CHUKA UNIVERSITY,36.952,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1173117,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,39.302,\r
,,1057117,EGERTON UNIVERSITY,39.003,\r
,,1249117,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,42.755,\r
,,1111117,KENYATTA UNIVERSITY,42.271,\r
,,1170117,MACHAKOS UNIVERSITY,36.61,\r
,,1253697,MOI UNIVERSITY,15.299,\r
,,1246117,MURANG'A UNIVERSITY OF TECHNOLOGY,35.822,\r
,,1166117,SOUTH EASTERN KENYA UNIVERSITY,33.976,\r
,,1063117,TECHNICAL UNIVERSITY OF MOMBASA,36.417,\r
,,1263117,UNIVERSITY OF NAIROBI,42.208,\r
,,,,,\r
BACHELOR OF SCIENCE (AGRICULTURAL AND BIOSYSTEMS ENGINEERING),5,,,,\r
,,1057121,EGERTON UNIVERSITY,27.448,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1249121,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,31.683,\r
,,1111121,KENYATTA UNIVERSITY,29.162,\r
,,1166121,SOUTH EASTERN KENYA UNIVERSITY,15.299,\r
,,1114121,UNIVERSITY OF ELDORET,15.299,\r
,,1263121,UNIVERSITY OF NAIROBI,28.245,\r
,,,,,\r
BACHELOR OF TECHNOLOGY EDUCATION,5,,,,\r
,,1246192,MURANG'A UNIVERSITY OF TECHNOLOGY,15.299,"Mathematics: C+
Physics: C+
Chemistry: C+
"\r
,,5145192,OPEN UNIVERSITY OF KENYA,15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (TELECOMMUNICATION AND INFORMATION ENGINEERING),5,,,,\r
,,1173197,Dedan Kimathi University of Technology,26.288,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1249197,Jomo Kenyatta University of Agriculture and Technology,38.053,\r
,,1111197,Kenyatta University,27.365,\r
,,1117197,Pwani University,15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (INSTRUMENTATION & CONTROL),5,,,,\r
,,1249231,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.299,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1164230,MULTIMEDIA UNIVERSITY OF KENYA,15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (ELECTRICAL AND COMMUNICATION ENGINEERING),5,,,,\r
,,1082246,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,31.158,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1253617,MOI UNIVERSITY,15.299,\r
,,1253697,MOI UNIVERSITY,15.299,\r
,,1164246,MULTIMEDIA UNIVERSITY OF KENYA,32.736,\r
,,1112617,TECHNICAL UNIVERSITY OF KENYA,36.409,\r
,,,,,\r
BACHELOR OF EDUCATION IN TECHNOLOGY (MECHANICAL ENGINEERING),5,,,,\r
,,1173318,Dedan Kimathi University of Technology,15.299,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1082318,Masinde Muliro University of Science & Technology,15.299,\r
,,1240318,Meru University of Science and Technology,15.299,\r
,,,,,\r
BACHELOR OF EDUCATION IN TECHNOLOGY (ELECTRICAL & ELECTRONIC ENGINEERING),5,,,,\r
,,1173319,Dedan Kimathi University of Technology,27.944,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1082319,Masinde Muliro University of Science & Technology,26.21,\r
,,1240319,Meru University of Science and Technology,15.299,\r
,,,,,\r
BACHELOR OF EDUCATION IN TECHNOLOGY (CIVIL ENGINEERING),5,,,,\r
,,1173320,Dedan Kimathi University of Technology,25.949,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1082320,Masinde Muliro University of Science & Technology,15.299,\r
,,1240320,Meru University of Science and Technology,15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (MINING AND MINERAL PROCESSING ENGINEERING),5,,,,\r
,,1249349,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.299,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1091349,TAITA TAVETA UNIVERSITY,15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (ELECTRONIC AND COMPUTER ENGINEERING),5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1249350,Jomo Kenyatta University of Agriculture and Technology,40.33,\r
,,1079350,Kirinyaga University,15.299,\r
,,1279350,Mount Kenya University,15.299,\r
,,,,,\r
BACHELOR OF ENGINEERING (AERONAUTICAL ENGINEERING),5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1112503,TECHNICAL UNIVERSITY OF KENYA,42.162,\r
,,,,,\r
BACHELOR OF SCIENCE IN ELECTRONICS,5,,,,"Mathematics: C
Physics: C
Chemistry: C
"\r
,,1166502,SOUTH EASTERN KENYA UNIVERSITY,15.299,\r
,,1181506,"UNIVERSITY OF EASTERN AFRICA, BARATON",15.299,\r
,,,,,\r
BACHELOR OF SCIENCE (RENEWABLE ENERGY),5,,,,"Mathematics: C
Physics: C
Chemistry: C"\r
,,1249512,Jomo Kenyatta University of Agriculture and Technology,15.299,\r
,,1108526,Kibabii University,15.299,\r
,,1087525,Kisii University,15.299,\r
,,1082627,Masinde Muliro University of Science & Technology,15.299,\r
,,1164627,Multimedia University of Kenya,15.299,\r
,,1570627,Turkana University College,15.299,\r
,,,,,\r
BACHELOR OF TECHNOLOGY IN ELECTRICAL AND ELECTRONIC ENGINEERING,5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1240527,Meru University of Science and Technology,15.299,\r
,,1246527,Murang'a University of Technology,24.732,\r
,,1112527,Technical University of Kenya,26.408,\r
,,1063527,Technical University of Mombasa,15.299,\r
,,,,,\r
BACHELOR OF TECHNOLOGY IN CIVIL ENGINEERING,5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1240532,Meru University of Science and Technology,15.299,\r
,,1112532,Technical University of Kenya,27.22,\r
,,1063532,Technical University of Mombasa,26.314,\r
,,,,,\r
BACHELOR OF TECHNOLOGY (MECHANICAL ENGINEERING TECHNOLOGY),5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1240532,Meru University of Science and Technology,15.299,\r
,,1112532,Technical University of Kenya,27.22,\r
,,1063532,Technical University of Mombasa,26.314,\r
,,,,,\r
BACHELOR OF TECHNOLOGY IN MEDICAL ENGINEERING,5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+"\r
,,1079534,Kirinyaga University,15.299,\r
,,1063534,Technical University of Mombasa,25.29,\r
,,,,,\r
BACHELOR OF SCIENCE (MEDICAL ENGINEERING),5,,,,"Mathematics: C
Physics: C
Chemistry: C"\r
,,1079534,Kirinyaga University,15.299,\r
,,1063534,Technical University of Mombasa,25.29,\r
,,,,,\r
BACHELOR OF SCIENCE IN MECHATRONIC ENGINEERING,5,,,,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1173240,Dedan Kimathi University of Technology,40.296,\r
,,1249240,Jomo Kenyatta University of Agriculture and Technology,44.028,\r
,,1246240,Murang'a University of Technology,36.557,\r
,,,,,\r
BACHELOR OF ARCHITECTURE,6,,,,"Mathematics: C+
Physics: C+
English/Kiswahili: C+"\r
,,1249564,Jomo Kenyatta University of Agriculture and Technology,41.779,\r
,,1111102,Kenyatta University,41.119,\r
,,1112102,Technical University of Kenya,39.883,\r
,,1063102,Technical University of Mombasa,39.021,\r
,,1263102,University of Nairobi,42.524,\r
,,,,,\r
BACHELOR OF QUANTITY SURVEYING,6,,,,"Mathematics: C+
Physics: C+
English/Kiswahili: C+"\r
,,1249103,Jomo Kenyatta University of Agriculture and Technology,38.243,\r
,,1112103,Technical University of Kenya,36.648,\r
,,1063103,Technical University of Mombasa,34.023,\r
,,1263103,University of Nairobi,35.904,\r
,,,,,\r
BACHELOR OF ARTS (DESIGN),6,,,,"Mathematics: C+
Physics: C+
"\r
,,1263165,UNIVERSITY OF NAIROBI,18.126,\r
,,1112372,TECHNICAL UNIVERSITY OF KENYA,18.126,\r
,,1263105,UNIVERSITY OF NAIROBI,18.126,\r
,,,,,\r
BACHELOR OF CONSTRUCTION MANAGEMENT,6,,,,"Mathematics: C+
Physics: C+"\r
,,1173376,Dedan Kimathi University of Technology,28.866,\r
,,1053776,Jaramogi Oginga Odinga University of Science and Technology,18.126,\r
,,1249176,Jomo Kenyatta University of Agriculture and Technology,34.616,\r
,,1111776,Kenyatta University,32.713,\r
,,1079376,Kirinyaga University,18.126,\r
,,1082376,Masinde Muliro University of Science & Technology,29.989,\r
,,1112376,Technical University of Kenya,32.502,\r
,,1263176,University of Nairobi,34.163,\r
,,,,,\r
BACHELOR OF SCIENCE (REAL ESTATE),6,,,,"Mathematics: C+
"\r
,,1249300,Jomo Kenyatta University of Agriculture and Technology,32.676,\r
,,1111300,Kenyatta University,29.68,\r
,,1112300,Technical University of Kenya,27.402,\r
,,1263300,University of Nairobi,21.077,\r
,,,,,\r
BACHELOR OF URBAN AND REGIONAL PLANNING,6,,,,"English/Kiswahili: C+
Mathematics: C
Geography: C"\r
,,1165340,Maasai Mara University,18.126,\r
,,1229765,Maseno University,18.126,\r
,,1112472,Technical University of Kenya,25.516,\r
,,1112665,Technical University of Kenya,22.391,\r
,,,,,\r
BACHELOR OF LANDSCAPE ARCHITECTURE,6,,,,"English/Kiswahili: C+
Mathematics: C+
Physics: C+"\r
,,1249353,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.014,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (LAND ADMINISTRATION),6,,,,Mathematics: C+\r
,,1249351,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1112371,Technical University of Kenya,23.214,\r
,,1515351,Tom Mboya University,15.092,\r
,,,,,\r
BACHELOR OF ARTS(SPATIAL PLANNING),6,,,,"English/Kiswahili: C+
Mathematics: C
Geography: C"\r
,,1053485,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.126,\r
,,1111485,KENYATTA UNIVERSITY,18.126,\r
,,,,,\r
BACHELOR OF PHILOSOPHY IN TECHNOLOGY (SURVEYING TECHNOLOGY),6,,,,"English/Kiswahili: C+
Mathematics: C+
Physics: C+"\r
,,1112538,TECHNICAL UNIVERSITY OF KENYA,18.126,\r
,,,,,\r
BACHELOR OF SCIENCE (COMPUTER SCIENCE,7,,,,\r
,,1078115,Africa Nazarene University,18.126,"English/Kiswahili: C+
Mathematics: C+
Physics: C+"\r
,,1600115,Alupe University,18.126,\r
,,1700115,Bomet University College,18.126,\r
,,1480115,Catholic University of Eastern Africa,18.126,\r
,,1105388,Chuka University (Applied CS),25.877,\r
,,1105115,Chuka University,35.794,\r
,,1080309,Co-operative University of Kenya,38.858,\r
,,1162388,Daystar University (Applied CS),18.126,\r
,,1173115,Dedan Kimathi University of Technology,39.579,\r
,,1057388,Egerton University (Applied CS),31.018,\r
,,1057115,Egerton University,38.369,\r
,,1096115,Garissa University,18.126,\r
,,1088115,Gretsa University,18.126,\r
,,1249115,Jomo Kenyatta University of Agriculture and Technology,43.23,\r
,,1061115,Kabarak University,23.223,\r
,,1470115,Kaimosi Friends University,18.126,\r
,,1244115,Karatina University,28.128,\r
,,1103388,KCA University (Applied Computing),18.126,\r
,,1169115,Kenya Highlands Evangelical University,18.126,\r
,,1111115,Kenyatta University,42.399,\r
,,1580115,Kenyatta University � Mama Ngina University College,34.654,\r
,,1108115,Kibabii University,23.984,\r
,,1079115,Kirinyaga University,23.768,\r
,,1460115,Kiriri Women�s University of Science and Technology,18.126,\r
,,1087115,Kisii University,24.741,\r
,,1087388,Kisii University (Applied CS),18.126,\r
,,1176115,Laikipia University,25.433,\r
,,1165115,Maasai Mara University,33.828,\r
,,1170115,Machakos University,34.156,\r
,,1229115,Maseno University,36.264,\r
,,1082115,Masinde Muliro University of Science & Technology,34.815,\r
,,1240115,Meru University of Science and Technology,33.319,\r
,,1253115,Moi University,22.815,\r
,,1279115,Mount Kenya University,38.362,\r
,,1164115,Multimedia University of Kenya,41.29,\r
,,1246115,Murang'a University of Technology,35.478,\r
,,5145115,Open University of Kenya,18.126,\r
,,1196115,Presbyterian University of East Africa,18.126,\r
,,1117115,Pwani University,30.942,\r
,,1060115,Riara University,36.745,\r
,,1073115,Rongo University,18.126,\r
,,1166115,South Eastern Kenya University,18.126,\r
,,1107115,St Pauls University,18.126,\r
,,1091115,Taita Taveta University,18.126,\r
,,1063115,Technical University of Mombasa,34.639,\r
,,1685115,Tharaka University,18.126,\r
,,1500115,The East African University,18.126,\r
,,1515115,Tom Mboya University,18.126,\r
,,1570115,Turkana University College,18.126,\r
,,1114115,University of Eldoret,26.594,\r
,,1093115,University of Embu,32.223,\r
,,1118115,University of Kabianga,24.8,\r
,,1263115,University of Nairobi,44.401,\r
,,1425115,Zetech University,18.126,\r
,,,,,\r
BACHELOR OF INFORMATION COMMUNICATION TECHNOLOGY,7,,,,"English/Kiswahili: C
Mathematics: C
"\r
,,1119232,Africa International University,18.126,\r
,,1600232,Alupe University,20.933,\r
,,1080232,Co-operative University of Kenya,33.614,\r
,,1173232,Dedan Kimathi University of Technology,33.018,\r
,,1192232,Great Lakes University of Kisumu,18.126,\r
,,1053158,Jaramogi Oginga Odinga University of Science and Technology,21.536,\r
,,1249232,Jomo Kenyatta University of Agriculture and Technology,38.307,\r
,,1061232,Kabarak University,18.126,\r
,,1470232,Kaimosi Friends University,21.915,\r
,,1244232,Karatina University,26.545,\r
,,1103158,KCA University (ICT),22.152,\r
,,1103232,KCA University (IT),18.126,\r
,,1169232,Kenya Highlands Evangelical University,18.126,\r
,,1111232,Kenyatta University,37.781,\r
,,1580236,Kenyatta University � Mama Ngina University College,27.693,\r
,,1108232,Kibabii University,23.94,\r
,,1079232,Kirinyaga University,23.847,\r
,,1087236,Kisii University,21.165,\r
,,1176158,Laikipia University,21.831,\r
,,1495232,Lukenya University,18.126,\r
,,1170232,Machakos University,30.268,\r
,,1229158,Maseno University (ICT Management),29.229,\r
,,1229232,Maseno University (IT),32.037,\r
,,1082232,Masinde Muliro University of Science & Technology,29.514,\r
,,1240232,Meru University of Science and Technology,25.762,\r
,,1279232,Mount Kenya University,27.771,\r
,,1164232,Multimedia University of Kenya,36.113,\r
,,1246232,Murang'a University of Technology,30.543,\r
,,1090158,Scott Christian University,18.126,\r
,,1166232,South Eastern Kenya University,20.797,\r
,,1091232,Taita Taveta University,18.126,\r
,,1112384,Technical University of Kenya (Business IT),33.574,\r
,,1112232,Technical University of Kenya (IT),35.975,\r
,,1063232,Technical University of Mombasa (IT),29.049,\r
,,1063158,Technical University of Mombasa (ICT),26.961,\r
,,1515232,Tom Mboya University,18.126,\r
,,1570232,Turkana University College,18.126,\r
,,1114232,University of Eldoret,30.026,\r
,,1093232,University of Embu,27.469,\r
,,1118232,University of Kabianga,26.399,\r
,,1425232,Zetech University,18.126,\r
,,,,,\r
BACHELOR OF SCIENCE ( APPLIED STATISTICS WITH COMPUTING),7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C"\r
,,1600164,ALUPE UNIVERSITY,18.126,\r
,,1700164,BOMET UNIVERSITY COLLEGE,18.126,\r
,,1080163,CO-OPERATIVE UNIVERSITY OF KENYA,18.814,\r
,,1057163,EGERTON UNIVERSITY,26.311,\r
,,1096164,GARISSA UNIVERSITY,18.814,\r
,,1249163,JOMO KENYATTA UNIVERSITY OF AGRICULTURE & TECHNOLOGY,30.147,\r
,,1111164,KENYATTA UNIVERSITY,23.869,\r
,,1580164,KENYATTA UNIVERSITY � MAMA NGINA UNIVERSITY COLLEGE,18.814,\r
,,1079163,KIRINYAGA UNIVERSITY,18.831,\r
,,1176163,LAIKIPIA UNIVERSITY,18.831,\r
,,1165164,MAASAI MARA UNIVERSITY,18.814,\r
,,1170664,MACHAKOS UNIVERSITY,18.814,\r
,,1240163,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.831,\r
,,1253164,MOI UNIVERSITY,18.814,\r
,,1246164,MURANG'A UNIVERSITY OF TECHNOLOGY,18.814,\r
,,1166163,SOUTH EASTERN KENYA UNIVERSITY,18.831,\r
,,1091163,TAITA TAVETA UNIVERSITY,18.831,\r
,,1063856,TECHNICAL UNIVERSITY OF MOMBASA,18.814,\r
,,1114164,UNIVERSITY OF ELDORET,18.814,\r
,,1093163,UNIVERSITY OF EMBU,18.831,\r
,,1118164,UNIVERSITY OF KABIANGA,18.814,\r
,,1263163,UNIVERSITY OF NAIROBI,35.192,\r
,,,,,\r
BACHELOR OF SCIENCE (COMPUTER TECHNOLOGY),7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C+"\r
,,1249208,JOMO KENYATTA UNIVERSITY OF AGRICULTURE & TECHNOLOGY,37.867,\r
,,1229208,MASENO UNIVERSITY,25.315,\r
,,1240208,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.814,\r
,,1164208,MULTIMEDIA UNIVERSITY OF KENYA,31.181,\r
,,1246208,MURANG'A UNIVERSITY OF TECHNOLOGY,18.814,\r
,,,,,\r
BACHELOR OF SCIENCE (MATHEMATICS AND COMPUTING),7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C"\r
,,1460428,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,-,\r
,,1087308,KISII UNIVERSITY,18.814,\r
,,5145308,OPEN UNIVERSITY OF KENYA,-,\r
,,1073428,RONGO UNIVERSITY,18.814,\r
,,1114428,UNIVERSITY OF ELDORET,18.814,\r
,,1093308,UNIVERSITY OF EMBU,18.814,\r
,,,,,\r
BACHELOR OF SCIENCE (MATHEMATICS & COMPUTER SCIENCE),7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C+"\r
,,1249309,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,34.761,\r
,,1077309,KENYA METHODIST UNIVERSITY,-,\r
,,1111309,KENYATTA UNIVERSITY,30.18,\r
,,1580309,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,18.814,\r
,,1079309,KIRINYAGA UNIVERSITY,18.814,\r
,,1170309,MACHAKOS UNIVERSITY,18.814,\r
,,1229309,MASENO UNIVERSITY,24.314,\r
,,1240309,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.814,\r
,,1164309,MULTIMEDIA UNIVERSITY OF KENYA,28.885,\r
,,1246309,MURANG'A UNIVERSITY OF TECHNOLOGY,18.814,\r
,,1091309,TAITA TAVETA UNIVERSITY,18.814,\r
,,1063309,TECHNICAL UNIVERSITY OF MOMBASA,18.814,\r
,,1515309,TOM MBOYA UNIVERSITY,18.814,\r
,,1425309,ZETECH UNIVERSITY,18.814,\r
,,,,,\r
BACHELOR OF SCIENCE IN NETWORKS AND COMMUNICATION SYSTEMS,7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C+"\r
,,1080471,CO-OPERATIVE UNIVERSITY OF KENYA,18.126,\r
,,1112476,TECHNICAL UNIVERSITY OF KENYA,30.686,\r
,,1181471,"UNIVERSITY OF EASTERN AFRICA, BARATON",18.814,\r
,,,,,\r
BACHELOR OF SCIENCE (CLOUD COMPUTING AND INFORMATION SECURITY),7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C+"\r
,,1053511,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.814,\r
,,1061511,KABARAK UNIVERSITY,18.814,\r
,,1103511,KCA UNIVERSITY,18.814,\r
,,1170511,MACHAKOS UNIVERSITY,25.586,\r
,,1082511,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,-,\r
,,1240511,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,18.814,\r
,,1246511,MURANG'A UNIVERSITY OF TECHNOLOGY,-,\r
,,5145511,OPEN UNIVERSITY OF KENYA,18.814,\r
,,1093511,UNIVERSITY OF EMBU,-,\r
,,,,,\r
BACHELOR OF BUSINESS INFORMATION TECHNOLOGY,7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C"\r
,,1078244,AFRICA NAZARENE UNIVERSITY,25.254,\r
,,1600244,ALUPE UNIVERSITY,-,\r
,,1080206,CO-OPERATIVE UNIVERSITY OF KENYA,26.774,\r
,,1173244,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,31.074,\r
,,1053554,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,21.375,\r
,,1249536,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,25.731,\r
,,1249244,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,34.173,\r
,,1061206,KABARAK UNIVERSITY,21.375,\r
,,1061301,KABARAK UNIVERSITY,21.375,\r
,,1103206,KCA UNIVERSITY,21.375,\r
,,1077244,KENYA METHODIST UNIVERSITY,21.375,\r
,,1079206,KIRINYAGA UNIVERSITY,21.375,\r
,,1460206,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,21.375,\r
,,1066244,MANAGEMENT UNIVERSITY OF AFRICA,-,\r
,,1240244,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,26.523,\r
,,1279244,MOUNT KENYA UNIVERSITY,27.32,\r
,,1164244,MULTIMEDIA UNIVERSITY OF KENYA,31.205,\r
,,1246244,MURANG'A UNIVERSITY OF TECHNOLOGY,27.359,\r
,,1068244,PAN AFRICA CHRISTIAN UNIVERSITY,21.375,\r
,,1060244,RIARA UNIVERSITY,32.503,\r
,,1090244,SCOTT CHRISTIAN UNIVERSITY,21.375,\r
,,1166244,SOUTH EASTERN KENYA UNIVERSITY,21.375,\r
,,1107206,ST PAULS UNIVERSITY,21.375,\r
,,1091244,TAITA TAVETA UNIVERSITY,21.375,\r
,,1063244,TECHNICAL UNIVERSITY OF MOMBASA,21.375,\r
,,1500244,THE EAST AFRICAN UNIVERSITY,21.375,\r
,,1181244,"UNIVERSITY OF EASTERN AFRICA, BARATON",21.375,\r
,,1093244,UNIVERSITY OF EMBU,25.384,\r
,,1425244,ZETECH UNIVERSITY,21.375,\r
,,,,,\r
BACHELOR OF SCIENCE IN SOFTWARE ENGINEERING,7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C+"\r
,,1080542,CO-OPERATIVE UNIVERSITY OF KENYA,40.162,\r
,,1103542,KCA UNIVERSITY,24.055,\r
,,1079542,KIRINYAGA UNIVERSITY,33.884,\r
,,1087542,KISII UNIVERSITY,36.957,\r
,,1164542,MULTIMEDIA UNIVERSITY OF KENYA,41.368,\r
,,1246542,MURANG'A UNIVERSITY OF TECHNOLOGY,38.437,\r
,,1181542,"UNIVERSITY OF EASTERN AFRICA, BARATON",25.573,\r
,,1425542,ZETECH UNIVERSITY,18.814,\r
,,,,,\r
BACHELOR OF SCIENCE IN APPLIED STATISTICS AND DATA SCIENCE,7,,,,"English/Kiswahili: C
Mathematics: C+
Physics: C"\r
,,,CO-OPERATIVE UNIVERSITY OF KENYA,24.213,\r
,,,,,\r
BACHELOR OF SCIENCE (AGRI BUSINESS MANAGEMENT),8,,,,"Mathematics: C
Biology: C/Agriculture/Business Studies: C+"\r
,,1105257,CHUKA UNIVERSITY,15.864,\r
,,1080187,CO-OPERATIVE UNIVERSITY OF KENYA,15.864,\r
,,1057257,EGERTON UNIVERSITY,15.864,\r
,,1192187,GREAT LAKES UNIVERSITY,15.864,\r
,,1053187,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.864,\r
,,1249B54,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.864,\r
,,1249787,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,22.911,\r
,,1061187,KABARAK UNIVERSITY,15.864,\r
,,1111587,KENYATTA UNIVERSITY,22.511,\r
,,1087256,KISII UNIVERSITY,15.864,\r
,,1176257,LAIKIPIA UNIVERSITY,15.864,\r
,,1165257,MAASAI MARA UNIVERSITY,15.864,\r
,,1170258,MACHAKOS UNIVERSITY,15.864,\r
,,1229187,MASENO UNIVERSITY,15.864,\r
,,1082256,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,15.864,\r
,,1240187,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.864,\r
,,1253187,MOI UNIVERSITY,15.864,\r
,,5510257,NYANDARUA UNIVERSITY COLLEGE,-,\r
,,1117187,PWANI UNIVERSITY,15.864,\r
,,1073587,RONGO UNIVERSITY,15.864,\r
,,1091256,TAITA TAVETA UNIVERSITY,15.864,\r
,,1685257,THARAKA UNIVERSITY,15.864,\r
,,1515187,TOM MBOYA UNIVERSITY,15.864,\r
,,1181587,"UNIVERSITY OF EASTERN AFRICA, BARATON",15.864,\r
,,1093187,UNIVERSITY OF EMBU,15.864,\r
,,1263187,UNIVERSITY OF NAIROBI,15.864,\r
,,,,,\r
BACHELOR OF SCIENCE ( AGRICULTURAL ECONOMICS AND RESOURCE MANAGEMENT),8,,,,"Mathematics: C
Biology: C/Agriculture/Business Studies: C+"\r
,,1700215,BOMET UNIVERSITY COLLEGE,15.864,\r
,,1105216,CHUKA UNIVERSITY,15.864,\r
,,1080216,CO-OPERATIVE UNIVERSITY OF KENYA,15.864,\r
,,1057216,EGERTON UNIVERSITY,15.864,\r
,,1249615,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.864,\r
,,1470215,KAIMOSI FRIENDS UNIVERSITY,15.864,\r
,,1111215,KENYATTA UNIVERSITY,15.864,\r
,,1108215,KIBABII UNIVERSITY,15.864,\r
,,1087216,KISII UNIVERSITY,15.864,\r
,,1176216,LAIKIPIA UNIVERSITY,15.864,\r
,,1165215,MAASAI MARA UNIVERSITY,15.864,\r
,,1229216,MASENO UNIVERSITY,15.864,\r
,,1082215,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,15.864,\r
,,1253215,MOI UNIVERSITY,15.864,\r
,,1073215,RONGO UNIVERSITY,15.864,\r
,,1515216,TOM MBOYA UNIVERSITY,15.864,\r
,,1570215,TURKANA UNIVERSITY COLLEGE,15.864,\r
,,1114216,UNIVERSITY OF ELDORET,15.864,\r
,,1118215,UNIVERSITY OF KABIANGA,15.864,\r
,,,,,\r
BACHELOR OF SCIENCE IN AGRIBUSINESS ECONOMICS AND FOOD INDUSTRY MANAGEMENT,8,,,,"Mathematics: C
Biology: C/Agriculture/Business Studies: C+"\r
,,1080187,CO-OPERATIVE UNIVERSITY OF KENYA,15.864,\r
,,1053187,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.864,\r
,,1249B54,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.864,\r
,,1061187,KABARAK UNIVERSITY,15.864,\r
,,1111587,KENYATTA UNIVERSITY,22.511,\r
,,1229187,MASENO UNIVERSITY,15.864,\r
,,1240187,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.864,\r
,,1253187,MOI UNIVERSITY,15.864,\r
,,1117187,PWANI UNIVERSITY,15.864,\r
,,1515187,TOM MBOYA UNIVERSITY,15.864,\r
,,,,,\r
BACHELOR OF SCIENCE (BIOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1480111,CATHOLIC UNIVERSITY OF EASTERN AFRICA,15.683,\r
,,1105111,CHUKA UNIVERSITY,15.683,\r
,,1053111,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.683,\r
,,1249477,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.683,\r
,,1470111,KAIMOSI FRIENDS UNIVERSITY,15.683,\r
,,1077477,KENYA METHODIST UNIVERSITY,-,\r
,,1111111,KENYATTA UNIVERSITY,24.74,\r
,,1108111,KIBABII UNIVERSITY,15.683,\r
,,1087111,KISII UNIVERSITY,15.683,\r
,,3890111,KOITALEEL SAMOEI UNIVERSITY COLLEGE,-,\r
,,1170111,MACHAKOS UNIVERSITY,15.683,\r
,,1082111,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,15.683,\r
,,1166111,SOUTH EASTERN KENYA UNIVERSITY,-,\r
,,1181111,"UNIVERSITY OF EASTERN AFRICA, BARATON",15.683,\r
,,1093111,UNIVERSITY OF EMBU,15.683,\r
,,1263111,UNIVERSITY OF NAIROBI,24.957,\r
,,,,,\r
BACHELOR OF SCIENCE (BIOCHEMISTRY AND MOLECULAR BIOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1105112,CHUKA UNIVERSITY,15.683,\r
,,1057112,EGERTON UNIVERSITY,25.661,\r
,,1249437,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,32.07,\r
,,1077112,KENYA METHODIST UNIVERSITY,-,\r
,,1111112,KENYATTA UNIVERSITY,32.976,\r
,,1087112,KISII UNIVERSITY,15.683,\r
,,1176112,LAIKIPIA UNIVERSITY,15.683,\r
,,1229112,MASENO UNIVERSITY,30.294,\r
,,1082112,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,23.504,\r
,,1240112,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.683,\r
,,1253112,MOI UNIVERSITY,25.581,\r
,,1117112,PWANI UNIVERSITY,15.683,\r
,,1073112,RONGO UNIVERSITY,15.683,\r
,,1166437,SOUTH EASTERN KENYA UNIVERSITY,15.683,\r
,,1112112,TECHNICAL UNIVERSITY OF KENYA,31.23,\r
,,1063112,TECHNICAL UNIVERSITY OF MOMBASA,15.683,\r
,,1114112,UNIVERSITY OF ELDORET,15.683,\r
,,1093112,UNIVERSITY OF EMBU,15.683,\r
,,1118112,UNIVERSITY OF KABIANGA,15.683,\r
,,1263112,UNIVERSITY OF NAIROBI,32.695,\r
,,,,,\r
BACHELOR OF SCIENCE,9,,,,"Mathematics: C
Biology/Chemistry/Physics: C
Biology/Chemistry/Physics: C"\r
,,1700418,BOMET UNIVERSITY COLLEGE,23.483,\r
,,1700120,BOMET UNIVERSITY COLLEGE,25.637,\r
,,1105120,CHUKA UNIVERSITY,15.683,\r
,,1057120,EGERTON UNIVERSITY,15.683,\r
,,1096120,GARISSA UNIVERSITY,15.683,\r
,,1249120,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,15.683,\r
,,1061120,KABARAK UNIVERSITY,15.683,\r
,,1244418,KARATINA UNIVERSITY,21.858,\r
,,1111120,KENYATTA UNIVERSITY,15.683,\r
,,1079120,KIRINYAGA UNIVERSITY,15.683,\r
,,1176120,LAIKIPIA UNIVERSITY,15.683,\r
,,1229120,MASENO UNIVERSITY,15.683,\r
,,1240120,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,15.683,\r
,,1253418,MOI UNIVERSITY,21.858,\r
,,1253120,MOI UNIVERSITY,15.683,\r
,,1246120,MURANG'A UNIVERSITY OF TECHNOLOGY,15.683,\r
,,1117120,PWANI UNIVERSITY,-,\r
,,1685120,THARAKA UNIVERSITY,15.683,\r
,,1515120,TOM MBOYA UNIVERSITY,15.683,\r
,,1114120,UNIVERSITY OF ELDORET,15.683,\r
,,1114418,UNIVERSITY OF ELDORET,21.858,\r
,,1093120,UNIVERSITY OF EMBU,15.683,\r
,,1118120,UNIVERSITY OF KABIANGA,15.683,\r
,,1263120,UNIVERSITY OF NAIROBI,15.683,\r
,,,,,\r
BACHELOR OF SCIENCE (MICROBIOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1600123,ALUPE UNIVERSITY,15.683,\r
,,1105278,CHUKA UNIVERSITY,15.683,\r
,,1249123,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,25.28,\r
,,1111123,KENYATTA UNIVERSITY,25.46,\r
,,1087123,KISII UNIVERSITY,15.683,\r
,,1165123,MAASAI MARA UNIVERSITY,15.683,\r
,,1253123,MOI UNIVERSITY,26.794,\r
,,1117123,PWANI UNIVERSITY,15.683,\r
,,1073123,RONGO UNIVERSITY,15.683,\r
,,1114279,UNIVERSITY OF ELDORET,15.683,\r
,,1093278,UNIVERSITY OF EMBU,15.683,\r
,,1118123,UNIVERSITY OF KABIANGA,15.683,\r
,,1263278,UNIVERSITY OF NAIROBI,25.645,\r
,,1116281,UZIMA UNIVERSITY,15.683,\r
,,,,,\r
BACHELOR OF SCIENCE GENOMIC SCIENCE,9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE (PHYSICS),9,,,,"Mathematics: C
Physics: C+"\r
,,1480366,CATHOLIC UNIVERSITY OF EASTERN AFRICA,15.683,\r
,,1105170,CHUKA UNIVERSITY,15.683,\r
,,1470366,KAIMOSI FRIENDS UNIVERSITY,15.683,\r
,,1108366,KIBABII UNIVERSITY,15.683,\r
,,1087170,KISII UNIVERSITY,-,\r
,,3890170,KOITALEEL SAMOEI UNIVERSITY COLLEGE,-,\r
,,1165366,MAASAI MARA UNIVERSITY,15.683,\r
,,1229170,MASENO UNIVERSITY,15.683,\r
,,1082366,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,15.683,\r
,,1117366,PWANI UNIVERSITY,15.683,\r
,,1073366,RONGO UNIVERSITY,15.683,\r
,,1166366,SOUTH EASTERN KENYA UNIVERSITY,-,\r
,,1091498,TAITA TAVETA UNIVERSITY,15.683,\r
,,1515170,TOM MBOYA UNIVERSITY,15.683,\r
,,,,,\r
BACHELOR OF SCIENCE (BIOTECHNOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1249226,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,28.953,\r
,,1111226,KENYATTA UNIVERSITY,22.345,\r
,,1087226,KISII UNIVERSITY,14.796,\r
,,1082226,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,14.796,\r
,,1240226,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,14.796,\r
,,1117226,PWANI UNIVERSITY,14.796,\r
,,1112227,TECHNICAL UNIVERSITY OF KENYA,25.607,\r
,,1114359,UNIVERSITY OF ELDORET,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE INDUSTRIAL BIOTECHNOLOGY,9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1249728,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,14.796,\r
,,1063280,TECHNICAL UNIVERSITY OF MOMBASA,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE (MEDICAL MICROBIOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1249281,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,23.852,\r
,,1240281,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE IN CHEMISTRY,9,,,,"Mathematics: C
Chemistry: C+"\r
,,1480513,CATHOLIC UNIVERSITY OF EASTERN AFRICA,14.796,\r
,,1105513,CHUKA UNIVERSITY,14.796,\r
,,1173513,DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY,14.796,\r
,,1470513,KAIMOSI FRIENDS UNIVERSITY,14.796,\r
,,1108513,KIBABII UNIVERSITY,14.796,\r
,,3890513,KOITALEEL SAMOEI UNIVERSITY COLLEGE,14.796,\r
,,1495513,LUKENYA UNIVERSITY,14.796,\r
,,1165513,MAASAI MARA UNIVERSITY,14.796,\r
,,1082513,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,14.796,\r
,,1117513,PWANI UNIVERSITY,14.796,\r
,,1073513,RONGO UNIVERSITY,14.796,\r
,,1166513,SOUTH EASTERN KENYA UNIVERSITY,14.796,\r
,,1181513,"UNIVERSITY OF EASTERN AFRICA, BARATON",14.796,\r
,,1263513,UNIVERSITY OF NAIROBI,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE (ZOOLOGY),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1249462,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,14.796,\r
,,1249464,JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY,14.796,\r
,,1165464,MAASAI MARA UNIVERSITY,14.796,\r
,,1117464,PWANI UNIVERSITY,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE (FORENSIC SCIENCE),9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1111568,KENYATTA UNIVERSITY,28.618,\r
,,1079568,KIRINYAGA UNIVERSITY,14.796,\r
,,1515568,TOM MBOYA UNIVERSITY,14.796,\r
,,,,,\r
BACHELOR OF SCIENCE IN MEDICAL BIOTECHNOLOGY,9,,,,"Mathematics: C
Biology: C+
Chemistry: C"\r
,,1079591,KIRINYAGA UNIVERSITY,14.796,\r
,,1229591,MASENO UNIVERSITY,26.116,\r
,,1082591,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,14.796,\r
,,,,,\r
BACHELOR OF ARTS (GEOGRAPHY),16,,,,Geography: C+\r
,,1105B72,CHUKA UNIVERSITY,20.148,\r
,,1700292,BOMET UNIVERSITY COLLEGE,21.686,\r
,,1480292,CATHOLIC UNIVERSITY OF EASTERN AFRICA,18.004,\r
,,1105292,CHUKA UNIVERSITY,25.415,\r
,,1057292,EGERTON UNIVERSITY,26.717,\r
,,1244292,KARATINA UNIVERSITY,20.619,\r
,,1087292,KISII UNIVERSITY,21.372,\r
,,1176292,LAIKIPIA UNIVERSITY,20.187,\r
,,1253292,MOI UNIVERSITY,18.004,\r
,,1117292,PWANI UNIVERSITY,20.988,\r
,,1073292,RONGO UNIVERSITY,18.004,\r
,,,,,\r
"BACHELOR OF SCIENCE (GEOGRAPHY AND NATURAL RESOURCE MANAGEMENT, WITH IT)",16,,,,Geography: C+\r
,,1229692,MASENO UNIVERSITY,22.596,\r
,,1515692,TOM MBOYA UNIVERSITY,18.004,\r
,,,,,\r
BACHELOR OF ARTS (FRENCH),17,,,,French/German: B\r
,,1162B62,DAYSTAR UNIVERSITY,21.672,\r
,,1253B62,MOI UNIVERSITY,21.672,\r
,,1117B62,PWANI UNIVERSITY,21.672,\r
,,,,,\r
BACHELOR OF ARTS (GERMAN),17,,,,French/German: B\r
,,1253B63,MOI UNIVERSITY,,\r
,,1117B63,PWANI UNIVERSITY,,\r
,,,,,\r
BACHELOR OF MUSIC,18,,,,Music: C+\r
,,1162161,DAYSTAR UNIVERSITY,22.36,\r
,,1061160,KABARAK UNIVERSITY,22.36,\r
,,1111160,KENYATTA UNIVERSITY,22.36,\r
,,1229161,MASENO UNIVERSITY,22.36,\r
,,1253161,MOI UNIVERSITY,22.36,\r
,,1112160,TECHNICAL UNIVERSITY OF KENYA,22.36,\r
,,1181161,"UNIVERSITY OF EASTERN AFRICA, BARATON",22.36,\r
,,,,,\r
BACHELOR OF MUSIC (TECHNOLOGY),18,,,,Music: C+\r
,,1061661,KABARAK UNIVERSITY,22.36,\r
,,1111661,KENYATTA UNIVERSITY,22.36,\r
,,,,,\r
BACHELOR OF EDUCATION (ARTS),19,,,,"English/Kiswahili/Mathematics Alternative A/Mathematics Alternative B/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+
English/Kiswahili/Mathematics Alternative A/Mathematics Alternative B/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1119135,AFRICA INTERNATIONAL UNIVERSITY,21.858,\r
,,1078135,AFRICA NAZARENE UNIVERSITY,23.442,\r
,,1600135,ALUPE UNIVERSITY,27.787,\r
,,1700494,BOMET UNIVERSITY COLLEGE,24.056,\r
,,1700135,BOMET UNIVERSITY COLLEGE,26.78,\r
,,1480135,CATHOLIC UNIVERSITY OF EASTERN AFRICA,22.986,\r
,,1105135,CHUKA UNIVERSITY,31.468,\r
,,1057135,EGERTON UNIVERSITY,32.306,\r
,,1096135,GARISSA UNIVERSITY,23.967,\r
,,1192135,GREAT LAKES UNIVERSITY OF KISUMU,23.897,\r
,,1088135,GRETSA UNIVERSITY,23.657,\r
,,3895135,ISLAMIC UNIVERSITY OF KENYA,21.858,\r
,,1053135,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,29.533,\r
,,1061135,KABARAK UNIVERSITY,26.546,\r
,,5535135,KABARNET UNIVERSITY COLLEGE,-,\r
,,1470135,KAIMOSI FRIENDS UNIVERSITY,27.773,\r
,,1244135,KARATINA UNIVERSITY,29.47,\r
,,1103135,KCA UNIVERSITY,24.216,\r
,,1555135,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,21.858,\r
,,1169135,KENYA HIGHLANDS EVANGELICAL UNIVERSITY,21.858,\r
,,1077135,KENYA METHODIST UNIVERSITY,23.104,\r
,,1111135,KENYATTA UNIVERSITY,33.556,\r
,,1108135,KIBABII UNIVERSITY,28.747,\r
,,1079494,KIRINYAGA UNIVERSITY,28.171,\r
,,1460135,KIRIRI WOMENS UNIVERSITY OF SCIENCE AND TECHNOLOGY,21.858,\r
,,1087135,KISII UNIVERSITY,29.991,\r
,,3890135,KOITALEEL SAMOEI UNIVERSITY COLLEGE,26.62,\r
,,1176135,LAIKIPIA UNIVERSITY,27.574,\r
,,1495135,LUKENYA UNIVERSITY,22.937,\r
,,1165135,MASAAI MARA UNIVERSITY,29.507,\r
,,1170135,MACHAKOS UNIVERSITY,29.206,\r
,,1066135,MANAGEMENT UNIVERSITY OF AFRICA,-,\r
,,1530135,MARIST INTERNATIONAL UNIVERSITY COLLEGE,21.858,\r
,,1229135,MASENO UNIVERSITY,31.535,\r
,,1082135,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,30.054,\r
,,1240135,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,27.526,\r
,,1253494,MOI UNIVERSITY,26.949,\r
,,1253135,MOI UNIVERSITY,30.04,\r
,,1279135,MOUNT KENYA UNIVERSITY,27.323,\r
,,1246135,MURANG'A UNIVERSITY OF TECHNOLOGY,28.166,\r
,,5510135,NYANDARUA UNIVERSITY COLLEGE,-,\r
,,1196135,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,21.858,\r
,,1117135,PWANI UNIVERSITY,29.26,\r
,,1073135,RONGO UNIVERSITY,28.096,\r
,,1090135,SCOTT CHRISTIAN UNIVERSITY,21.858,\r
,,1166135,SOUTH EASTERN KENYA UNIVERSITY,27.258,\r
,,1107135,ST PAULS UNIVERSITY,23.857,\r
,,1091135,TAITA TAVETA UNIVERSITY,26.314,\r
,,1475135,TANGAZA UNIVERSITY,23.781,\r
,,1685135,THARAKA UNIVERSITY,26.777,\r
,,1500494,THE EAST AFRICAN UNIVERSITY,21.858,\r
,,1515135,TOM MBOYA UNIVERSITY,27.837,\r
,,1570135,TURKANA UNIVERSITY COLLEGE,22.358,\r
,,1181135,"UNIVERSITY OF EASTERN AFRICA, BARATON",23.471,\r
,,1114135,UNIVERSITY OF ELDORET,29.002,\r
,,1093135,UNIVERSITY OF EMBU,28.208,\r
,,1118135,UNIVERSITY OF KABIANGA,29.077,\r
,,1263135,UNIVERSITY OF NAIROBI,32.421,\r
,,1425135,ZETECH UNIVERSITY,23.305,\r
,,,,,\r
BACHELOR OF EDUCATION (SCIENCE),19,,,,"Mathematics/Biology/Physics/Chemistry: C+
Mathematics/Biology/Physics/Chemistry: C+"\r
,,1600137,ALUPE UNIVERSITY,28.016,\r
,,1700137,BOMET UNIVERSITY COLLEGE,-,\r
,,1480137,CATHOLIC UNIVERSITY OF EASTERN AFRICA,20.477,\r
,,1105137,CHUKA UNIVERSITY,30.456,\r
,,1057137,EGERTON UNIVERSITY,32.396,\r
,,1096137,GARISSA UNIVERSITY,20.477,\r
,,1053137,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,27.392,\r
,,1061137,KABARAK UNIVERSITY,20.477,\r
,,1470137,KAIMOSI FRIENDS UNIVERSITY,28.778,\r
,,1244137,KARATINA UNIVERSITY,30.118,\r
,,1169137,KENYA HIGHLANDS EVANGELICAL UNIVERSITY,20.477,\r
,,1077137,KENYA METHODIST UNIVERSITY,20.477,\r
,,1111137,KENYATTA UNIVERSITY,36.268,\r
,,1108137,KIBABII UNIVERSITY,30.505,\r
,,1079138,KIRINYAGA UNIVERSITY,29.343,\r
,,1087137,KISII UNIVERSITY,34.361,\r
,,3890137,KOITALEEL SAMOEI UNIVERSITY COLLEGE,28.732,\r
,,1176137,LAIKIPIA UNIVERSITY,28.815,\r
,,1495137,LUKENYA UNIVERSITY,20.477,\r
,,1165332,MASAAI MARA UNIVERSITY (SCIENCE WITH SPECIAL NEEDS EDUCATION),27.621,\r
,,1165137,MASAAI MARA UNIVERSITY,31.612,\r
,,1170137,MACHAKOS UNIVERSITY,31.346,\r
,,1229137,"MASENO UNIVERSITY (SCIENCE, WITH IT)",35.16,\r
,,1082137,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,32.547,\r
,,1240137,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,28.213,\r
,,1253137,MOI UNIVERSITY,25.341,\r
,,1279137,MOUNT KENYA UNIVERSITY,20.477,\r
,,1246137,MURANG'A UNIVERSITY OF TECHNOLOGY,22.425,\r
,,1196137,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,20.477,\r
,,1117137,PWANI UNIVERSITY,30.148,\r
,,1073137,RONGO UNIVERSITY,28.567,\r
,,1166137,SOUTH EASTERN KENYA UNIVERSITY,22.682,\r
,,1091137,TAITA TAVETA UNIVERSITY,25.692,\r
,,1475137,TANGAZA UNIVERSITY,20.477,\r
,,1685137,THARAKA UNIVERSITY,22.853,\r
,,1515137,"TOM MBOYA UNIVERSITY (SCIENCE, WITH IT)",27.997,\r
,,1570137,TURKANA UNIVERSITY COLLEGE,22.627,\r
,,1181137,"UNIVERSITY OF EASTERN AFRICA, BARATON",20.477,\r
,,1114137,UNIVERSITY OF ELDORET,32.693,\r
,,1093137,UNIVERSITY OF EMBU,28.991,\r
,,1118137,UNIVERSITY OF KABIANGA,31.422,\r
,,1263137,UNIVERSITY OF NAIROBI,35.542,\r
,,1425138,ZETECH UNIVERSITY,20.477,\r
,,,,,\r
BACHELOR OF EDUCATION (SPECIAL NEEDS EDUCATION),19,,,,"Biology/General Science: C+
Mathematics/Physics/Chemistry/Geography: C+"\r
,,1700155,BOMET UNIVERSITY COLLEGE,22.802,\r
,,1053155,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,28.613,\r
,,1077155,KENYA METHODIST UNIVERSITY,20.477,\r
,,1111155,KENYATTA UNIVERSITY,35.53,\r
,,1087155,KISII UNIVERSITY,26.332,\r
,,1170155,MACHAKOS UNIVERSITY,25.397,\r
,,1229155,MASENO UNIVERSITY,33.905,\r
,,1253656,MOI UNIVERSITY,23.359,\r
,,1279656,MOUNT KENYA UNIVERSITY,20.477,\r
,,1117155,PWANI UNIVERSITY,24.487,\r
,,1073155,RONGO UNIVERSITY,22.781,\r
,,1107155,ST PAULS UNIVERSITY,20.477,\r
,,1515155,TOM MBOYA UNIVERSITY,23.849,\r
,,1114155,UNIVERSITY OF ELDORET,31.079,\r
,,,,,\r
BACHELOR OF EDUCATION (ARTS) MUSIC,19,,,,"Music: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1111162,KENYATTA UNIVERSITY�,,\r
,,1229162,MASENO UNIVERSITY,,\r
,,,,,\r
"BACHELOR OF EDUCATION (FRENCH, WITH IT)",19,,,,"French: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1470282,Kaimosi Friends University,20.477,\r
,,1111282,Kenyatta University,30.555,\r
,,1229166,Maseno University,27.515,\r
,,1082282,Masinde Muliro University of Science & Technology,20.477,\r
,,1117282,Pwani University,20.477,\r
,,1515166,Tom Mboya University,20.477,\r
,,1111169,KENYATTA UNIVERSITY,24.499,\r
,,,,,\r
BACHELOR OF EDUCATION(EARLY CHILDHOOD DEVELOPMENT),19,,,,"English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1119180,AFRICA INTERNATIONAL UNIVERSITY,20.477,\r
,,1105680,CHUKA UNIVERSITY,22.965,\r
,,1057680,EGERTON UNIVERSITY,22.636,\r
,,1096680,GARISSA UNIVERSITY,20.477,\r
,,1053180,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,22.049,\r
,,1470180,KAIMOSI FRIENDS UNIVERSITY,22.459,\r
,,1103180,KCA UNIVERSITY,20.477,\r
,,1077180,KENYA METHODIST UNIVERSITY,20.477,\r
,,1111180,KENYATTA UNIVERSITY,24.665,\r
,,1108880,KIBABII UNIVERSITY,22.766,\r
,,1087180,KISII UNIVERSITY,23.345,\r
,,3890180,KOITALEEL SAMOEI UNIVERSITY COLLEGE,22.156,\r
,,1176180,LAIKIPIA UNIVERSITY,20.477,\r
,,1495180,LUKENYA UNIVERSITY,20.477,\r
,,1165680,MAASAI MARA UNIVERSITY,23.382,\r
,,1170180,MACHAKOS UNIVERSITY,20.477,\r
,,1229180,MASENO UNIVERSITY,22.993,\r
,,1082180,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,22.463,\r
,,1196180,PRESBYTERIAN UNIVERSITY OF EAST AFRICA,20.477,\r
,,1117180,PWANI UNIVERSITY,20.477,\r
,,1090680,SCOTT CHRISTIAN UNIVERSITY,20.477,\r
,,1107680,ST PAULS UNIVERSITY,20.477,\r
,,1685180,THARAKA UNIVERSITY,22.816,\r
,,1515180,TOM MBOYA UNIVERSITY,21.972,\r
,,1570180,TURKANA UNIVERSITY COLLEGE,20.477,\r
,,1114680,UNIVERSITY OF ELDORET,22.436,\r
,,1118680,UNIVERSITY OF KABIANGA,22.971,\r
,,1263180,UNIVERSITY OF NAIROBI,21.889,\r
,,,,,\r
BACHELOR OF ARTS (WITH EDUCATION),19,,,,"English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1700201,BOMET UNIVERSITY COLLEGE,22.194,\r
,,1244201,KARATINA UNIVERSITY,21.736,\r
,,1253201,MOI UNIVERSITY,22.132,\r
,,,,,\r
BACHELOR OF EDUCATION IN PHYSICAL EDUCATION AND RECREATION,19,,,,"Biology/General Science: C+
Mathematics/Physics/Chemistry/Geography: C+"\r
,,1111315,KENYATTA UNIVERSITY,20.477,\r
,,1082315,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,20.477,\r
,,5510315,NYANDARUA UNIVERSITY COLLEGE,20.477,\r
,,1114315,UNIVERSITY OF ELDORET,20.477,\r
,,1263316,UNIVERSITY OF NAIROBI,20.477,\r
,,,,,\r
BACHELOR OF EDUCATION (GUIDANCE AND COUNSELLING),19,,,,"English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1700326,BOMET UNIVERSITY COLLEGE,23.784,\r
,,1244326,KARATINA UNIVERSITY,25.039,\r
,,1165326,MAASAI MARA UNIVERSITY,25.485,\r
,,1253326,MOI UNIVERSITY,22.571,\r
,,1118326,UNIVERSITY OF KABIANGA,26.219,\r
,,,,,\r
"BACHELOR OF EDUCATION (HOME SCIENCE , WITH IT)",19,,,,"English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+
English/Kiswahili/Mathematics/History and Government/Geography/Christian Religious Education/Islamic Religious Education/Hindu Religious Education/Social Education and Ethics/Home Science/Art and Design/Computer Studies/French/German/Arabic/Kenya Sign Language/Music/Accounting/Commerce/Business Studies: C+"\r
,,1229362,MASENO UNIVERSITY,30.163,\r
,,1515362,TOM MBOYA UNIVERSITY,28.682,\r
,,1114362,UNIVERSITY OF ELDORET,29.143,\r
,,1111310,KENYATTA UNIVERSITY,26.815,\r
,,,,,\r
BACHELOR OF SCIENCE AGRICULTURAL EXTENSION AND EDUCATION,19,,,,"Biology: C+
Biology/Agriculture: C+"\r
,,1700415,BOMET UNIVERSITY COLLEGE,26.576,\r
,,1105416,CHUKA UNIVERSITY,30.186,\r
,,1057346,EGERTON UNIVERSITY,23.342,\r
,,1057417,EGERTON UNIVERSITY,31.387,\r
,,1053415,JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY,26.758,\r
,,1061417,KABARAK UNIVERSITY,20.477,\r
,,1244415,KARATINA UNIVERSITY,24.499,\r
,,1111417,KENYATTA UNIVERSITY,30.997,\r
,,1108417,KIBABII UNIVERSITY,28.74,\r
,,1087615,KISII UNIVERSITY,28.682,\r
,,1087417,KISII UNIVERSITY,30.042,\r
,,1176417,LAIKIPIA UNIVERSITY,24.695,\r
,,1170415,MACHAKOS UNIVERSITY,27.103,\r
,,1229417,MASENO UNIVERSITY,30.637,\r
,,1082417,MASINDE MULIRO UNIVERSITY OF SCIENCE & TECHNOLOGY,29.932,\r
,,1240415,MERU UNIVERSITY OF SCIENCE AND TECHNOLOGY,26.582,\r
,,1253415,MOI UNIVERSITY,22.994,\r
,,1246417,MURANG'A UNIVERSITY OF TECHNOLOGY,22.249,\r
,,1117417,PWANI UNIVERSITY,22.597,\r
,,1073417,RONGO UNIVERSITY,27.642,\r
,,1166415,SOUTH EASTERN KENYA UNIVERSITY,23.016,\r
,,1091415,TAITA TAVETA UNIVERSITY,22.805,\r
,,1685417,THARAKA UNIVERSITY,22.62,\r
,,1515417,TOM MBOYA UNIVERSITY,24.572,\r
,,1570417,TURKANA UNIVERSITY COLLEGE,22.202,\r
,,1114415,UNIVERSITY OF ELDORET,30.023,\r
,,1093417,UNIVERSITY OF EMBU,27.666,\r
,,1118416,UNIVERSITY OF KABIANGA,28.771,\r
,,1263417,UNIVERSITY OF NAIROBI,31.596,\r
,,,,,\r
BACHELOR OF SCIENCE WITH EDUCATION,19,,,,"Mathematics/Biology/Physics/Chemistry: C+
Mathematics/Biology/Physics/Chemistry: C+"\r
,,1700418,BOMET UNIVERSITY COLLEGE,23.483,\r
,,1244418,KARATINA UNIVERSITY,20.477,\r
,,1253418,MOI UNIVERSITY,20.477,\r
,,1114418,UNIVERSITY OF ELDORET,20.477,\r
,,,,,\r
BACHELOR OF SCIENCE (ENVIRONMENTAL EDUCATION),19,,,,"Biology: C+
Biology/Agriculture: C+"\r
,,1111228,KENYATTA UNIVERSITY,15.092,\r
,,1111570,KENYATTA UNIVERSITY,20.477,\r
,,1111686,KENYATTA UNIVERSITY,15.092,\r
,,1111986,KENYATTA UNIVERSITY,20.473,\r
,,1580986,KENYATTA UNIVERSITY - MAMA NGINA UNIVERSITY COLLEGE,20.473,\r
,,1165339,MAASAI MARA UNIVERSITY,15.092,\r
,,1170986,MACHAKOS UNIVERSITY,15.092,\r
,,1117228,PWANI UNIVERSITY,15.092,\r
,,1114229,UNIVERSITY OF ELDORET,15.092,\r
,,1118229,UNIVERSITY OF KABIANGA,15.092,\r
,,,,,\r
BACHELOR OF ARTS IN THEOLOGY,20,,,,"English/Kiswahili: C+ 
CRE/IRE/HRE: C+"\r
,,1119446,Africa International University,19.729,\r
,,1192446,Great Lakes University of Kisumu,19.729,\r
,,1225446,International Leadership University,19.729,\r
,,1061446,Kabarak University,19.729,\r
,,1061C81,Kabarak University,19.729,\r
,,1169446,Kenya Highlands Evangelical University,19.729,\r
,,1077446,Kenya Methodist University,19.729,\r
,,1196446,Presbyterian University of East Africa,19.729,\r
,,1117446,Pwani University,19.729,\r
,,1090446,Scott Christian University,19.729,\r
,,1107446,St Pauls University,19.729,\r
,,1181446,"University of Eastern Africa, Baraton",19.729,\r
,,,,,\r
BACHELOR OF ARTS IN RELIGION,20,,,,"English/Kiswahili: C+ 
CRE/IRE/HRE: C+"\r
,,1057B87,EGERTON UNIVERSITY�,19.729,\r
,,1165B87,MAASAI MARA UNIVERSITY,19.729,\r
,,,,,\r
BACHELOR OF CHRISTIAN EDUCATION,20,,,,"English/Kiswahili: C+ 
CRE/IRE/HRE: C+"\r
,,1555253,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,19.729,\r
,,1169653,KENYA HIGHLANDS EVANGELICAL UNIVERSITY,19.729,\r
,,,,,\r
BACHELOR OF ARTS IN ISLAMIC STUDIES,20,,,,"English/Kiswahili: C+ 
CRE/IRE/HRE: C+"\r
,,3895642,ISLAMIC UNIVERSITY OF KENYA,19.729,\r
,,1117630,PWANI UNIVERSITY,19.729,\r
,,,,,\r
BA IN INTER-CULTURAL STUDIES,20,,,,"English/Kiswahili: C+ 
CRE/IRE/HRE: C+"\r
,,1555254,KENYA ASSEMBLIES OF GOD EAST UNIVERSITY,19.729,\r
,,,,,\r
BACHELOR OF ACTUARIAL SCIENCE,10,,,,\r
,,1480107,Catholic University of Eastern Africa,18.467,Mathematics: C+\r
,,1105107,Chuka University,28.461,\r
,,1080107,Co-operative University of Kenya,30.015,\r
,,1162107,Daystar University,18.467,\r
,,1173107,Dedan Kimathi University of Technology,25.832,\r
,,1057107,Egerton University,31.992,\r
,,1096107,Garissa University,18.467,\r
,,1053107,Jaramogi Oginga Odinga University of Science and Technology,18.467,\r
,,1249107,Jomo Kenyatta University of Agriculture and Technology,34.725,\r
,,1061107,Kabarak University,18.467,\r
,,1244107,Karatina University,18.467,\r
,,1103107,KCA University,18.467,\r
,,1111107,Kenyatta University,34.712,\r
,,1079107,Kirinyaga University,18.467,\r
,,1087107,Kisii University,18.467,\r
,,1170107,Machakos University,18.467,\r
,,1229107,Maseno University,29.152,\r
,,1240107,Meru University of Science and Technology,18.467,\r
,,1253107,Moi University,18.467,\r
,,1279107,Mount Kenya University,18.467,\r
,,1164107,Multimedia University of Kenya,30.819,\r
,,1246107,Murang'a University of Technology,18.467,\r
,,1166107,South Eastern Kenya University,18.467,\r
,,1685107,Tharaka University,18.467,\r
,,1515107,Tom Mboya University,18.467,\r
,,1114107,University of Eldoret,23.479,\r
,,1093107,University of Embu,18.467,\r
,,1118107,University of Kabianga,18.467,\r
,,1263107,University of Nairobi,37.039,\r
,,1425107,Zetech University,18.467,\r
,,,,,\r
"BACHELOR OF SCIENCE (MATHEMATICAL SCIENCES, WITH IT)",10,,,,\r
,,1480109,Catholic University of Eastern Africa,18.467,Mathematics: C+\r
,,1105109,Chuka University,22.238,\r
,,1080409,Co-operative University of Kenya,35.322,\r
,,1173709,Dedan Kimathi University of Technology,18.467,\r
,,1249409,Jomo Kenyatta University of Agriculture and Technology,39.111,\r
,,1061409,Kabarak University,28.848,\r
,,1470309,Kaimosi Friends University,18.467,\r
,,1103409,KCA University,31.116,\r
,,1108109,Kibabii University,18.467,\r
,,1460109,Kiriri Women�s University of Science and Technology,18.467,\r
,,1087709,Kisii University,18.467,\r
,,1165109,Maasai Mara University,18.467,\r
,,1170109,Machakos University,18.467,\r
,,1229109,Maseno University,22.338,\r
,,1082409,Masinde Muliro University of Science & Technology,18.467,\r
,,1240109,Meru University of Science and Technology,18.467,\r
,,1240409,Meru University of Science and Technology,32.053,\r
,,1240709,Meru University of Science and Technology,18.467,\r
,,1279709,Mount Kenya University,18.467,\r
,,5145409,Open University of Kenya,18.467,\r
,,1117109,Pwani University,18.467,\r
,,1073109,Rongo University,18.467,\r
,,1166109,South Eastern Kenya University,18.467,\r
,,1112109,Technical University of Kenya,28.706,\r
,,1515109,Tom Mboya University,18.467,\r
,,1181109,"University of Eastern Africa, Baraton",18.467,\r
,,1263409,University of Nairobi,35.848,\r
,,1263109,University of Nairobi,29.054,\r
,,,,,\r
,,,,,\r
BACHELOR OF ECONOMICS,10,1600646,Alupe University,18.467,"Mathematics C+, Eng /Kis  C"\r
,,1700334,Bomet University College,18.467,\r
,,1700646,Bomet University College,18.467,\r
,,1480146,Catholic University of Eastern Africa,18.467,\r
,,1480540,Catholic University of Eastern Africa,18.467,\r
,,1480199,Catholic University of Eastern Africa,18.467,\r
,,1105200,Chuka University,18.467,\r
,,1105198,Chuka University,18.467,\r
,,1080146,Co-operative University of Kenya,22.131,\r
,,1080200,Co-operative University of Kenya,21.802,\r
,,1080540,Co-operative University of Kenya,25.268,\r
,,1162146,Daystar University,18.467,\r
,,1057198,Egerton University,18.467,\r
,,1057200,Egerton University,21.92,\r
,,1096646,Garissa University,18.467,\r
,,1249540,JKUAT,28.552,\r
,,1249146,JKUAT,28.381,\r
,,1249352,JKUAT,32.589,\r
,,1061540,Kabarak University,18.467,\r
,,1061199,Kabarak University,18.467,\r
,,1470200,Kaimosi Friends University,18.467,\r
,,1470146,Kaimosi Friends University,18.467,\r
,,1244146,Karatina University,18.467,\r
,,1103199,KCA University,18.467,\r
,,1103646,KCA University,18.467,\r
,,1111146,Kenyatta University,27.068,\r
,,1111199,Kenyatta University,29.878,\r
,,1111540,Kenyatta University,30.581,\r
,,1580540,Mama Ngina University College,18.467,\r
,,1580199,Mama Ngina University College,18.467,\r
,,1079146,Kirinyaga University,18.467,\r
,,1079199,Kirinyaga University,18.467,\r
,,1079352,Kirinyaga University,18.467,\r
,,1079540,Kirinyaga University,18.467,\r
,,1087199,Kisii University,18.467,\r
,,1087198,Kisii University,18.467,\r
,,1176200,Laikipia University,18.467,\r
,,1176198,Laikipia University,18.467,\r
,,1165200,Maasai Mara University,18.467,\r
,,1165334,Maasai Mara University,18.467,\r
,,1165146,Maasai Mara University,18.467,\r
,,1170146,Machakos University,18.467,\r
,,1170199,Machakos University,18.467,\r
,,1170540,Machakos University,18.467,\r
,,1229646,Maseno University,18.467,\r
,,1082200,Masinde Muliro University,18.467,\r
,,1082146,Masinde Muliro University,18.467,\r
,,1240146,Meru University of Science & Technology,18.467,\r
,,1240199,Meru University of Science & Technology,24.321,\r
,,1253334,Moi University,18.467,\r
,,1279352,Mount Kenya University,18.467,\r
,,1279200,Mount Kenya University,18.467,\r
,,1279334,Mount Kenya University,18.467,\r
,,1164146,Multimedia University of Kenya,18.467,\r
,,5145199,Open University of Kenya,18.467,\r
,,5145200,Open University of Kenya,18.467,\r
,,1117646,Pwani University,18.467,\r
,,1073646,Rongo University,18.467,\r
,,1166199,South Eastern Kenya University,18.467,\r
,,1166146,South Eastern Kenya University,18.467,\r
,,1091146,Taita Taveta University,18.467,\r
,,1112146,Technical University of Kenya,26.467,\r
,,1685200,Tharaka University,18.467,\r
,,1515646,Tom Mboya University,18.467,\r
,,1515540,Tom Mboya University,18.467,\r
,,1515334,Tom Mboya University,18.467,\r
,,1570146,Turkana University College,18.467,\r
,,1114646,University of Eldoret,18.467,\r
,,1093540,University of Embu,18.467,\r
,,1093199,University of Embu,18.467,\r
,,1093146,University of Embu,18.467,\r
,,1118646,University of Kabianga,18.467,\r
,,1263199,University of Nairobi,30.303,\r
,,1263146,University of Nairobi,27.034,\r
,,1425199,Zetech University,18.467,\r
,,,,,\r
,, , , ,\r
BACHELOR OF SCIENCE (STATISTICS),10,1600164,Alupe University,18.126,Mathematics C+\r
,,1700164,Bomet University College,18.126,\r
,,1080163,Co-operative University of Kenya,23.275,\r
,,1057163,Egerton University,24.769,\r
,,1096164,Garissa University,18.126,\r
,,1249163,Jomo Kenyatta University of Agriculture and Technology,28.979,\r
,,1111164,Kenyatta University,28.99,\r
,,1580164,Mama Ngina University College,18.126,\r
,,1079163,Kirinyaga University,18.467,\r
,,1176163,Laikipia University,18.467,\r
,,1165164,Maasai Mara University,18.126,\r
,,1170664,Machakos University,18.126,\r
,,1240163,Meru University of Science and Technology,18.467,\r
,,1253164,Moi University,18.126,\r
,,1246164,Murang'a University of Technology,18.126,\r
,,1166163,South Eastern Kenya University,18.467,\r
,,1091163,Taita Taveta University,18.467,\r
,,1063856,Technical University of Mombasa,18.126,\r
,,1114164,University of Eldoret,18.126,\r
,,1093163,University of Embu,18.467,\r
,,1118164,University of Kabianga,18.126,\r
,,1263163,University of Nairobi,28.424,\r
,,,,,\r
,, ,,,\r
BACHELOR OF SCIENCE (INDUSTRIAL MATHEMATICS),10,1249311,Jomo Kenyatta University of Agriculture and Technology,18.467,Mathematics  C+\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (FINANCE),10,1080541,Co-operative University of Kenya,18.467,"Mathematics: C+
English/Kiswahili: C+"\r
,,3890539,Koitaleel Samoei University College,18.467,\r
,,1240541,Meru University of Science and Technology,18.467,\r
,,1093541,University of Embu,18.467,\r
,,,,,\r
,,,,,\r
BACHELOR OF ACCOUNTING,10,1119469,Africa International University,18.467,"Mathematics: C+
English/Kiswahili: C+"\r
,,1080654,Co-operative University of Kenya,32.186,\r
,,1229654,Maseno University,27.978,\r
,,1082466,Masinde Muliro University of Science & Technology,27.98,\r
,,1240466,Meru University of Science and Technology,23.215,\r
,,1112466,Technical University of Kenya,35.097,\r
,,1181654,"University of Eastern Africa, Baraton",18.467,\r
,,1093469,University of Embu,29.169,\r
,,1425469,Zetech University,18.467,\r
,,,,,\r
,,,,,\r
BACHELOR OF ACCOUNTING AND FINANCE,10,1119469,Africa International University,18.467,"Mathematics: C+
English/Kiswahili: C+"\r
,,1080654,Co-operative University of Kenya,32.186,\r
,,1229654,Maseno University,27.978,\r
,,1082466,Masinde Muliro University of Science & Technology,27.98,\r
,,1240466,Meru University of Science and Technology,23.215,\r
,,1112466,Technical University of Kenya,35.097,\r
,,1181654,"University of Eastern Africa, Baraton",18.467,\r
,,1093469,University of Embu,29.169,\r
,,1425469,Zetech University,18.467,\r
,,,,,\r
,,,,,\r
BACHELOR OF DATA SCIENCE,10,1480109,Catholic University of Eastern Africa,18.467,"Mathematics: C+
English/Kiswahili: C+"\r
,,1105109,Chuka University,22.238,\r
,,1080409,Co-operative University of Kenya,35.322,\r
,,1173709,Dedan Kimathi University of Technology,18.467,\r
,,1249409,Jomo Kenyatta University of Agriculture & Technology,39.111,\r
,,1061409,Kabarak University,28.848,\r
,,1470309,Kaimosi Friends University,18.467,\r
,,1103409,KCA University,31.116,\r
,,1108109,Kibabii University,18.467,\r
,,1460109,Kiriri Women�s University of Science & Technology,18.467,\r
,,1087709,Kisii University,18.467,\r
,,1165109,Maasai Mara University,18.467,\r
,,1170109,Machakos University,18.467,\r
,,1229109,Maseno University,22.338,\r
,,1082409,Masinde Muliro University of Science & Technology,18.467,\r
,,1240109,Meru University of Science & Technology,18.467,\r
,,1240409,Meru University of Science & Technology (Data Science),32.053,\r
,,1240709,Meru University of Science & Technology (Math & Physics),18.467,\r
,,1279709,Mount Kenya University,18.467,\r
,,5145409,Open University of Kenya,18.467,\r
,,1117109,Pwani University,18.467,\r
,,1073109,Rongo University,18.467,\r
,,1166109,South Eastern Kenya University,18.467,\r
,,1112109,Technical University of Kenya,28.706,\r
,,1515109,Tom Mboya University,18.467,\r
,,1181109,"University of Eastern Africa, Baraton",18.467,\r
,,1263409,University of Nairobi (Data Science),35.848,\r
,,1263109,University of Nairobi (Mathematics),29.054,\r
,,,,,\r
,,,,,\r
BACHELOR OF DATA SCIENCE AND ANALYTICS,10,1425Q01,Zetech University,�,Mathematics:  C+\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (APPAREL & FASHION TECHNOLOGY),11,1057217,Egerton University,23.611,Chemistry: C\r
,,1111217,Kenyatta University,25.263,\r
,,1079217,Kirinyaga University,15.479,\r
,,1170217,Machakos University,15.479,\r
,,1229217,Maseno University,15.479,\r
,,1073217,Rongo University,15.479,\r
,,1166217,South Eastern Kenya University,15.479,\r
,,1114217,University of Eldoret,15.479,\r
,,,,,\r
,,,,,\r
BACHELOR OF ARTS INTERIOR DESIGN,11,1229317,Maseno University,21.3,Chemistry C\r
,,1263317,University of Nairobi,32.597,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (EXERCISE & SPORT SCIENCE),12,1111434,Kenyatta University,22.131,Biology: C\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SPORTS SCIENCE & MANAGEMENT,12,1111571,Kenyatta University,22.365,Biology: C \r
,,1176435,Laikipia University,19.175,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (HEALTH PROMOTION),12,1111618,Kenyatta University,21.845,Biology: C\r
,,1082436,Masinde Muliro University of Science & Technology,19.175,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF DENTAL SURGERY,13,1253128,Moi University,39.192,"Mathematics/Physics: B
Biology: B
Chemistry: B
English/Kiswahili: B"\r
,,1263128,University of Nairobi,44.577,\r
,,,,,\r
,,,,,\r
BACHELOR OF PHARMACY,13,1249129,Jomo Kenyatta University of Agriculture and Technology,43.697,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1061129,Kabarak University,41.648,\r
,,1077129,Kenya Methodist University,39.918,\r
,,1111129,Kenyatta University,43.381,\r
,,1087129,Kisii University,42.776,\r
,,1229129,Maseno University,42.967,\r
,,1279129,Mount Kenya University,42.484,\r
,,1263129,University of Nairobi,43.457,\r
,,,,,\r
,,,,,\r
BACHELOR OF VETERINARY MEDICINE,13,1057130,Egerton University,36.836,"Mathematics/Physics/Agric: C+
Chemistry: C+
Biology: C+"\r
,,1263130,University of Nairobi,37.826,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF MEDICINE & BACHELOR OF SURGERY,13,1057131,Egerton University,44.504,"Mathematics/Physics: B
Biology: B
Chemistry: B
English/Kiswahili: B"\r
,,1249131,Jomo Kenyatta University of Agriculture and Technology,44.834,\r
,,1077131,Kenya Methodist University,43.076,\r
,,1111131,Kenyatta University,44.904,\r
,,1087131,Kisii University,44.149,\r
,,1229131,Maseno University,44.602,\r
,,1082131,Masinde Muliro University of Science & Technology,44.16,\r
,,1253131,Moi University,42.066,\r
,,1279131,Mount Kenya University,44.504,\r
,,1117131,Pwani University,43.048,\r
,,1063131,Technical University of Mombasa,43.734,\r
,,1263131,University of Nairobi,44.926,\r
,,1116131,Uzima University,41.734,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (NURSING),13,1600132,Alupe University,39.156,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1480132,Catholic University of Eastern Africa,39.609,\r
,,1105132,Chuka University,41.023,\r
,,1162132,Daystar University,37.512,\r
,,1173132,Dedan Kimathi University of Technology,40.07,\r
,,1057132,Egerton University,42.049,\r
,,1192132,Great Lakes University of Kisumu,36.19,\r
,,1249132,Jomo Kenyatta University of Agriculture and Technology,41.614,\r
,,1061132,Kabarak University,40.468,\r
,,1470132,Kaimosi Friends University,39.061,\r
,,1244132,Karatina University,39.658,\r
,,1169132,Kenya Highlands Evangelical University,35.725,\r
,,1077132,Kenya Methodist University,38.665,\r
,,1111132,Kenyatta University,40.809,\r
,,1580132,Mama Ngina University College,40.726,\r
,,1108132,Kibabii University,39.838,\r
,,1079132,Kirinyaga University,39.372,\r
,,1087132,Kisii University,41.164,\r
,,1495132,Lukenya University,28.948,\r
,,1165132,Maasai Mara University,40.069,\r
,,1229132,Maseno University,41.836,\r
,,1082132,Masinde Muliro University of Science & Technology,40.358,\r
,,1240132,Meru University of Science and Technology,38.64,\r
,,1253132,Moi University,36.592,\r
,,1279132,Mount Kenya University,41.325,\r
,,1246132,Murang�a University of Technology,39.052,\r
,,1196132,Presbyterian University of East Africa,36.671,\r
,,1117132,Pwani University,39.838,\r
,,1166132,South Eastern Kenya University,39.342,\r
,,1685132,Tharaka University,39.715,\r
,,1093132,University of Embu,40.171,\r
,,1118132,University of Kabianga,40.003,\r
,,1263132,University of Nairobi,41.935,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN BIOMEDICAL SCIENCE,13,1105195,Chuka University,34.106,"Mathematics/Physics: C+
Biology: C+"\r
,,1162172,Daystar University,15.092,\r
,,1057195,Egerton University,35.041,\r
,,1087195,Kisii University,33.536,\r
,,1176195,Laikipia University,30.791,\r
,,1112195,Technical University of Kenya,35.596,\r
,,1181172,"University of Eastern Africa, Baraton",15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (ENVIRONMENTAL HEALTH),13,1700188,Bomet University College,15.092,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1162188,Daystar University,15.092,\r
,,1077188,Kenya Methodist University,15.092,\r
,,1111188,Kenyatta University,26.591,\r
,,1079188,Kirinyaga University,15.092,\r
,,1082188,Masinde Muliro University of Science & Technology,15.092,\r
,,1117188,Pwani University,15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (MEDICAL LABORATORY SCIENCE & TECHNOLOGY),13,1600194,Alupe University,36.185,"Mathematics/Physics: C+
Biology: C+"\r
,,1249194,Jomo Kenyatta University of Agriculture & Technology,40.314,\r
,,1244194,Karatina University,37.094,\r
,,1111194,Kenyatta University,38.844,\r
,,1087194,Kisii University,38.05,\r
,,1229194,Maseno University,38.368,\r
,,1082194,Masinde Muliro University of Science & Technology,37.268,\r
,,1240194,Meru University of Science & Technology,35.249,\r
,,1253194,Moi University,34.368,\r
,,1279194,Mount Kenya University,38.535,\r
,,1246194,Murang'a University of Technology,34.746,\r
,,1166194,South Eastern Kenya University,36.32,\r
,,1515194,Tom Mboya University,35.208,\r
,,1181194,"University of Eastern Africa, Baraton",31.769,\r
,,1263194,University of Nairobi,38.753,\r
,,,,,\r
,,,,,\r
,13,1105195,Chuka University,34.106,"Mathematics/Physics: C+
Biology: C+"\r
,,1162172,Daystar University,15.092,\r
,,1057195,Egerton University,35.041,\r
,,1087195,Kisii University,33.536,\r
,,1176195,Laikipia University,30.791,\r
,,1112195,Technical University of Kenya,35.596,\r
,,1181172,"University of Eastern Africa, Baraton",15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (BIOMEDICAL SCIENCE AND TECHNOLOGY),13,1105195,Chuka University,34.106,"Mathematics/Physics: C+
Biology: C+"\r
,,1162172,Daystar University,15.092,\r
,,1057195,Egerton University,35.041,\r
,,1087195,Kisii University,33.536,\r
,,1176195,Laikipia University,30.791,\r
,,1112195,Technical University of Kenya,35.596,\r
,,1181172,"University of Eastern Africa, Baraton",15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (PUBLIC HEALTH),13,1600732,Alupe University,15.092,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1600566,Alupe University,26.839,\r
,,1105188,Chuka University,29.56,\r
,,1053732,Jaramogi Oginga Odinga University of Science & Technology,15.092,\r
,,1249732,Jomo Kenyatta University of Agriculture & Technology,35.849,\r
,,1061732,Kabarak University,15.092,\r
,,1111566,Kenyatta University,28.251,\r
,,1580566,Kenyatta University � Mama Ngina University College,26.558,\r
,,1087732,Kisii University,27.204,\r
,,1170732,Machakos University,27.888,\r
,,1229732,Maseno University,28.738,\r
,,1082546,Masinde Muliro University of Science & Technology,22.856,\r
,,1240732,Meru University of Science & Technology,27.93,\r
,,1279732,Mount Kenya University,15.092,\r
,,1246732,Murang�a University of Technology,26.604,\r
,,1166566,South Eastern Kenya University,15.092,\r
,,1166732,South Eastern Kenya University,15.092,\r
,,1107732,St Pauls University,15.092,\r
,,1063732,Technical University of Mombasa,25.577,\r
,,1181732,"University of Eastern Africa, Baraton",15.092,\r
,,1118732,University of Kabianga,28.681,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN GLOBAL HEALTH AND TRAVEL MEDICINE,13,1600732,Alupe University,15.092,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1600566,Alupe University,26.839,\r
,,1105188,Chuka University,29.56,\r
,,1053732,Jaramogi Oginga Odinga University of Science & Technology,15.092,\r
,,1249732,Jomo Kenyatta University of Agriculture & Technology,35.849,\r
,,1061732,Kabarak University,15.092,\r
,,1111566,Kenyatta University,28.251,\r
,,1580566,Kenyatta University � Mama Ngina University College,26.558,\r
,,1087732,Kisii University,27.204,\r
,,1170732,Machakos University,27.888,\r
,,1229732,Maseno University,28.738,\r
,,1082546,Masinde Muliro University of Science & Technology,22.856,\r
,,1240732,Meru University of Science & Technology,27.93,\r
,,1279732,Mount Kenya University,15.092,\r
,,1246732,Murang�a University of Technology,26.604,\r
,,1166566,South Eastern Kenya University,15.092,\r
,,1166732,South Eastern Kenya University,15.092,\r
,,1107732,St Pauls University,15.092,\r
,,1063732,Technical University of Mombasa,25.577,\r
,,1181732,"University of Eastern Africa, Baraton",15.092,\r
,,1118732,University of Kabianga,28.681,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE CLINICAL MEDICINE,13,1057560,Egerton University,42.413,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1192560,Great Lakes University of Kisumu,34.643,\r
,,1249560,Jomo Kenyatta University of Agriculture & Technology,42.949,\r
,,1061560,Kabarak University,38.974,\r
,,1470560,Kaimosi Friends University,38.686,\r
,,1244560,Karatina University,39.314,\r
,,1079560,Kirinyaga University,38.941,\r
,,1087560,Kisii University,40.772,\r
,,1082560,Masinde Muliro University of Science & Technology,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (PHYSICAL THERAPY),13,1600561,Alupe University,31.282,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,4275465,Amref International University,27.517,\r
,,1192465,Great Lakes University of Kisumu,15.092,\r
,,1249465,Jomo Kenyatta University of Agriculture and Technology,38.322,\r
,,1082465,Masinde Muliro University of Science and Technology,35.383,\r
,,1253561,Moi University,32.581,\r
,,,,,\r
,,,,,\r
BACHELOR OF RADIOGRAPHY,13,1249562,Jomo Kenyatta University of Agriculture and Technology,41.666,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (POPULATION HEALTH),13,1600732,Alupe University,15.092,"Mathematics/Physics: C
Biology: C
Chemistry: C
English/Kiswahili: C"\r
,,1600566,Alupe University,26.839,\r
,,1105188,Chuka University,29.56,\r
,,1053732,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249732,Jomo Kenyatta University of Agriculture and Technology,35.849,\r
,,1061732,Kabarak University,15.092,\r
,,1111566,Kenyatta University,28.251,\r
,,1580566,Mama Ngina University College,26.558,\r
,,1087732,Kisii University,27.204,\r
,,1170732,Machakos University,27.888,\r
,,1229732,Maseno University,28.738,\r
,,1082546,Masinde Muliro University of Science and Technology,22.856,\r
,,1240732,Meru University of Science and Technology,27.93,\r
,,1279732,Mount Kenya University,15.092,\r
,,1246732,Murang'a University of Technology,26.604,\r
,,1166566,South Eastern Kenya University,15.092,\r
,,1166732,South Eastern Kenya University,15.092,\r
,,1107732,St Pauls University,15.092,\r
,,1063732,Technical University of Mombasa,25.577,\r
,,1181732,University of Eastern Africa Baraton,15.092,\r
,,1118732,University of Kabianga,28.681,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (OPTOMETRY AND VISION SCIENCES),13,1470597,Kaimosi Friends University,35.964,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1082597,Masinde Muliro University of Science and Technology,38.061,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN MIDWIFERY,13,1240631,Meru University of Science and Technology,35.186,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN EPIDEMIOLOGY AND BIOSTATISTICS,13,1080638,Co-operative University of Kenya,25.918,"Mathematics: C+
Biology: C+"\r
,,1249638,Jomo Kenyatta University of Agriculture and Technology,24.755,\r
,,1079637,Kirinyaga University,15.092,\r
,,1082637,Masinde Muliro University of Science and Technology,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN HEALTH SYSTEMS MANAGEMENT,13,4275657,AMREF International University,15.092,"Mathematics/Physics: C
Biology: C
Chemistry: C
English/Kiswahili: C"\r
,,1077657,Kenya Methodist University,15.092,\r
,,1111643,Kenyatta University,23.572,\r
,,1079657,Kirinyaga University,15.092,\r
,,1240657,Meru University of Science and Technology,15.092,\r
,,1279657,Mount Kenya University,15.092,\r
,,1073657,Rongo University,15.092,\r
,,1107657,St Pauls University,15.092,\r
,,1116657,Uzima University,15.092,\r
,,1425657,Zetech University,15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (BIOSTATISTICS),13,1080638,Co-operative University of Kenya,25.918,"Mathematics: C+
Biology: C+"\r
,,1249638,Jomo Kenyatta University of Agriculture and Technology,24.755,\r
,,1079637,Kirinyaga University,15.092,\r
,,1082637,Masinde Muliro University of Science and Technology,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF HEALTH SERVICES MANAGEMENT,13,4275657,Amref International University,15.092,"Mathematics/Physics: C
Biology: C
Chemistry: C
English/Kiswahili: C"\r
,,1077657,Kenya Methodist University,15.092,\r
,,1111643,Kenyatta University,23.572,\r
,,1079657,Kirinyaga University,15.092,\r
,,1240657,Meru University of Science and Technology,15.092,\r
,,1279657,Mount Kenya University,15.092,\r
,,1073657,Rongo University,15.092,\r
,,1107657,St Pauls University,15.092,\r
,,1116657,Uzima University,15.092,\r
,,1425657,Zetech University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN HEALTH INFORMATICS,13,1253678,Moi University,15.092,"Mathematics/Physics: C
Biology: C
Chemistry: C
English/Kiswahili: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN HEALTH RECORDS AND INFORMATION TECHNOLOGY,13,4275681,Amref International University,15.092,"Mathematics: C
Biology: C-
Physics/Chemistry: C
English/Kiswahili: C+"\r
,,1105681,Chuka University,15.092,\r
,,1249543,Jomo Kenyatta University of Agriculture and Technology,24.418,\r
,,1111543,Kenyatta University,25.274,\r
,,1580681,Mama Ngina University College,15.092,\r
,,1229543,Maseno University,22.591,\r
,,1240543,Meru University of Science and Technology,15.092,\r
,,1279681,Mount Kenya University,15.092,\r
,,1073543,Rongo University,15.092,\r
,,1166681,South Eastern Kenya University,15.092,\r
,,1107543,St Pauls University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (POPULATION HEALTH),13,1600732,Alupe University,15.092,"Mathematics/Physics: C
Biology: C
Chemistry: C
English/Kiswahili: C"\r
,,1600566,Alupe University,26.839,\r
,,1105188,Chuka University,29.56,\r
,,1053732,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249732,Jomo Kenyatta University of Agriculture and Technology,35.849,\r
,,1061732,Kabarak University,15.092,\r
,,1111566,Kenyatta University,28.251,\r
,,1580566,Mama Ngina University College,26.558,\r
,,1087732,Kisii University,27.204,\r
,,1170732,Machakos University,27.888,\r
,,1229732,Maseno University,28.738,\r
,,1082546,Masinde Muliro University of Science and Technology,22.856,\r
,,1240732,Meru University of Science and Technology,27.93,\r
,,1279732,Mount Kenya University,15.092,\r
,,1246732,Murang'a University of Technology,26.604,\r
,,1166566,South Eastern Kenya University,15.092,\r
,,1166732,South Eastern Kenya University,15.092,\r
,,1107732,St Pauls University,15.092,\r
,,1063732,Technical University of Mombasa,25.577,\r
,,1181732,University of Eastern Africa Baraton,15.092,\r
,,1118732,University of Kabianga,28.681,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (OPTOMETRY AND VISION SCIENCES),13,1470597,Kaimosi Friends University,35.964,"Mathematics/Physics: C+
Biology: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1082597,Masinde Muliro University of Science and Technology,38.061,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF ARTS (HISTORY),14,1480522,Catholic University of Eastern Africa,19.339,History: C+\r
,,1105342,Chuka University,18.467,\r
,,1057342,Egerton University,18.467,\r
,,1057622,Egerton University,22.697,\r
,,1087522,Kisii University,23.743,\r
,,1165522,Maasai Mara University,23.546,\r
,,1229523,Maseno University,23.115,\r
,,1117522,Pwani University,19.339,\r
,,1117523,Pwani University,19.339,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (AGRICULTURE),15,1105122,Chuka University,15.092,"Mathematics: C+
Physics: C+
Chemistry: C+
English/Kiswahili: C+"\r
,,1057346,Egerton University,23.342,\r
,,1057122,Egerton University,23.659,\r
,,1249122,Jomo Kenyatta University of Agriculture and Technology,29.108,\r
,,1077122,Kenya Methodist University,15.092,\r
,,1111122,Kenyatta University,15.092,\r
,,1087122,Kisii University,15.092,\r
,,1495346,Lukenya University,15.092,\r
,,1240122,Meru University of Science and Technology,15.092,\r
,,1246122,Murang'a University of Technology,15.092,\r
,,5510122,Nyandarua University College,15.092,\r
,,1117122,Pwani University,15.092,\r
,,1073122,Rongo University,15.092,\r
,,1166122,South Eastern Kenya University,15.092,\r
,,1091122,Taita Taveta University,15.092,\r
,,1685122,Tharaka University,15.092,\r
,,1181122,"University of Eastern Africa, Baraton",15.092,\r
,,1114122,University of Eldoret,15.092,\r
,,1093122,University of Embu,15.092,\r
,,1118122,University of Kabianga,15.092,\r
,,1263122,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (FOOD SCIENCE & TECHNOLOGY),15,1105124,Chuka University,15.092,"Mathematics: C
Biology/Agriculture: C
Chemistry: C
"\r
,,1173124,Dedan Kimathi University of Technology,15.092,\r
,,1057124,Egerton University,23.108,\r
,,1249124,Jomo Kenyatta University of Agriculture and Technology,31.175,\r
,,1082124,Masinde Muliro University of Science and Technology,15.092,\r
,,1240124,Meru University of Science and Technology,15.092,\r
,,1246124,Murang'a University of Technology,15.092,\r
,,1112124,Technical University of Kenya,15.092,\r
,,1063124,Technical University of Mombasa,15.092,\r
,,1263124,University of Nairobi,29.591,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (WOOD SCIENCE AND INDUSTRIAL PROCESSES),15,1114141,University of Eldoret,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (WILDLIFE ENTERPRISE MANAGEMENT),15,1105142,Chuka University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1057142,Egerton University,15.092,\r
,,1165142,Maasai Mara University,15.092,\r
,,1114143,University of Eldoret,15.092,\r
,,1263143,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN SOIL ENVIRONMENT & LAND USE MANAGEMENT),15,1057B65,Egerton University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
"BACHELOR OF SCIENCE IN ENVIRONMENT, LANDS AND SUSTAINABLE INFRASTRUCTURE",15,1078186,Africa Nazarene University,15.092,"Biology/Agriculture: C+
Chemistry/Geography: C+
"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,JOOUST,15.092,\r
,,1249213,JKUAT,27.687,\r
,,1249489,JKUAT,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,MMUST,15.092,\r
,,1082213,MMUST,15.092,\r
,,1240786,MUST,15.092,\r
,,1253229,Moi University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,SEKU,15.092,\r
,,1166886,SEKU,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN ANIMAL PRODUCTS TECHNOLOGY,15,1105693,Chuka University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (ENVIRONMENTAL MANAGEMENT),15,1078186,Africa Nazarene University,15.092,"Biology/Agriculture: C+
Chemistry/Geography: C+
"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science & Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture & Technology,27.687,\r
,,1249489,Jomo Kenyatta University of Agriculture & Technology,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science & Technology,15.092,\r
,,1082213,Masinde Muliro University of Science & Technology,15.092,\r
,,1240786,Meru University of Science & Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,South Eastern Kenya University,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN RANGELAND ECOSYSTEM MANAGEMENT,15,1091G67,Taita Taveta University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN FISHERIES AND AQUACULTURE,15,1105518,Chuka University,15.092,"Biology: C
Chemistry: C"\r
,,1057347,Egerton University,15.092,\r
,,1249518,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1249519,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1087347,Kisii University,15.092,\r
,,1087518,Kisii University,15.092,\r
,,1229515,Maseno University,15.092,\r
,,1082519,Masinde Muliro University of Science and Technology,15.092,\r
,,1166518,South Eastern Kenya University,15.092,\r
,,1063531,Technical University of Mombasa,15.092,\r
,,1570519,Turkana University College,�,\r
,,1114517,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF MARITIME STUDIES,15,1117548,Pwani University,15.092,"Biology: C
Chemistry: C"\r
,,1063548,Technical University of Mombasa,15.092,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE ( BIO-RESOURCES MANAGEMENT AND CONSERVATION),15,1111611,Kenyatta University,14.796,"Biology/Agriculture: C+
Chemistry/Geography: C+"\r
,,1108547,Kibabii University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN MARINE RESOURCE MANAGEMENT,15,1111565,Kenyatta University,15.092,"Biology: C
Chemistry: C"\r
,,1117565,Pwani University,15.092,\r
,,1063565,Technical University of Mombasa,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (UTILIZATION & SUSTAINABILITY OF ARID LANDS (USAL),15,1176582,Laikipia University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN ANIMAL HEALTH MANAGEMENT,15,1105290,Chuka University,23.177,"Biology: C+
Chemistry/Mathematics/Physics: C"\r
,,1105293,Chuka University,15.092,\r
,,1057293,Egerton University,22.376,\r
,,1057689,Egerton University,28.213,\r
,,1053293,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249290,Jomo Kenyatta University of Agriculture and Technology,32.819,\r
,,1111294,Kenyatta University,29.526,\r
,,1087293,Kisii University,15.092,\r
,,1165294,Maasai Mara University,23.477,\r
,,1229293,Maseno University,15.092,\r
,,1082290,Masinde Muliro University of Science and Technology,15.092,\r
,,1240294,Meru University of Science and Technology,15.092,\r
,,1253293,Moi University,15.092,\r
,,1279290,Mount Kenya University,15.092,\r
,,1117291,Pwani University,15.092,\r
,,1685293,Tharaka University,24.181,\r
,,1114358,University of Eldoret,15.092,\r
,,1114293,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF ENVIRONMENTAL SCIENCE (RESOURCE CONSERVATION),15,1111228,Kenyatta University,15.092,"Biology/Agriculture: C+
Chemistry/Geography: C+"\r
,,1111570,Kenyatta University,20.477,\r
,,1111686,Kenyatta University,15.092,\r
,,1111986,Kenyatta University,20.473,\r
,,1580986,Kenyatta University - Mama Ngina University College,20.473,\r
,,1165339,Maasai Mara University,15.092,\r
,,1170986,Machakos University,15.092,\r
,,1117228,Pwani University,15.092,\r
,,1114229,University of Eldoret,15.092,\r
,,1118229,University of Kabianga,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (AGRICULTURE BIOTECHNOLOGY),15,1053594,Jaramogi Oginga Odinga University of Science and Technology,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1108594,Kibabii University,15.092,\r
,,1165594,Maasai Mara University,15.092,\r
,,1082594,Masinde Muliro University of Science and Technology,15.092,\r
,,1253594,Moi University,15.092,\r
,,1114594,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
"BACHELOR OF SCIENCE (AGRONOMY, WITH IT)",15,1229593,Maseno University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1515593,Tom Mboya University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN CLIMATE CHANGE AND AGROFORESTRY,15,1229590,Maseno University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1082590,Masinde Muliro University of Science and Technology,15.092,\r
,,1166590,South Eastern Kenya University,15.092,\r
,,1114590,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (SOILS & LAND USE MANAGEMENT),15,1078186,Africa Nazarene University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture and Technology,27.687,\r
,,1249489,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science & Technology,15.092,\r
,,1082213,Masinde Muliro University of Science & Technology,15.092,\r
,,1240786,Meru University of Science and Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,South Eastern Kenya University,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (HORTICULTURE),15,1105185,Chuka University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1057185,Egerton University,15.092,\r
,,1053185,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249185,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1087185,Kisii University,15.092,\r
,,1229185,Maseno University,15.092,\r
,,1073185,Rongo University,15.092,\r
,,1091185,Taita Taveta University,15.092,\r
,,1515185,Tom Mboya University,15.092,\r
,,1114185,University of Eldoret,15.092,\r
,,1093185,University of Embu,15.092,\r
,,1118185,University of Kabianga,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (ENVIRONMENTAL CONSERVATION AND NATURAL RESOURCES MANAGEMENT),15,1078186,Africa Nazarene University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture and Technology,27.687,\r
,,1249489,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science and Technology,15.092,\r
,,1082213,Masinde Muliro University of Science and Technology,15.092,\r
,,1240786,Meru University of Science and Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,South Eastern Kenya University,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (FOOD NUTRITION & DIETETICS),15,1105405,Chuka University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1173190,Dedan Kimathi University of Technology,15.092,\r
,,1057190,Egerton University,25.147,\r
,,1192202,Great Lakes University of Kisumu,15.092,\r
,,1249405,Jomo Kenyatta University of Agriculture and Technology,29.165,\r
,,1061405,Kabarak University,15.092,\r
,,1077405,Kenya Methodist University,15.092,\r
,,1111190,Kenyatta University,23.451,\r
,,1087190,Kisii University,15.092,\r
,,1165190,Maasai Mara University,15.092,\r
,,1170190,Machakos University,15.092,\r
,,1229190,Maseno University,15.092,\r
,,1082405,Masinde Muliro University of Science and Technology,15.092,\r
,,1240405,Meru University of Science and Technology,15.092,\r
,,1279202,Mount Kenya University,15.092,\r
,,1117190,Pwani University,15.092,\r
,,1166190,South Eastern Kenya University,15.092,\r
,,1107202,St Pauls University,15.092,\r
,,1112381,Technical University of Kenya,25.405,\r
,,1515190,Tom Mboya University,15.092,\r
,,1181202,"University of Eastern Africa, Baraton",15.092,\r
,,1263190,University of Nairobi,31.912,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (FOOD SCIENCE & NUTRITION),15,1249191,Jomo Kenyatta University of Agriculture and Technology,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1114191,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN COMMUNITY NUTRITION AND HEALTH DEVELOPMENT,15,1105405,Chuka University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1173190,Dedan Kimathi University of Technology,15.092,\r
,,1057190,Egerton University,25.147,\r
,,1192202,Great Lakes University of Kisumu,15.092,\r
,,1249405,Jomo Kenyatta University of Agriculture and Technology,29.165,\r
,,1061405,Kabarak University,15.092,\r
,,1077405,Kenya Methodist University,15.092,\r
,,1111190,Kenyatta University,23.451,\r
,,1087190,Kisii University,15.092,\r
,,1165190,Maasai Mara University,15.092,\r
,,1170190,Machakos University,15.092,\r
,,1229190,Maseno University,15.092,\r
,,1082405,Masinde Muliro University of Science and Technology,15.092,\r
,,1240405,Meru University of Science and Technology,15.092,\r
,,1279202,Mount Kenya University,15.092,\r
,,1117190,Pwani University,15.092,\r
,,1166190,South Eastern Kenya University,15.092,\r
,,1107202,St Pauls University,15.092,\r
,,1112381,Technical University of Kenya,25.405,\r
,,1515190,Tom Mboya University,15.092,\r
,,1181202,"University of Eastern Africa, Baraton",15.092,\r
,,1263190,University of Nairobi,31.912,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN ANIMAL HEALTH AND PRODUCTION,15,1105290,Chuka University,23.177,"Mathematics/Physics/Chemistry: C
Biology: C+"\r
,,1105293,Chuka University,15.092,\r
,,1057293,Egerton University,22.376,\r
,,1057689,Egerton University,28.213,\r
,,1053293,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249290,Jomo Kenyatta University of Agriculture and Technology,32.819,\r
,,1111294,Kenyatta University,29.526,\r
,,1087293,Kisii University,15.092,\r
,,1165294,Maasai Mara University,23.477,\r
,,1229293,Maseno University,15.092,\r
,,1082290,Masinde Muliro University of Science and Technology,15.092,\r
,,1240294,Meru University of Science and Technology,15.092,\r
,,1253293,Moi University,15.092,\r
,,1279290,Mount Kenya University,15.092,\r
,,1117291,Pwani University,15.092,\r
,,1685293,Tharaka University,24.181,\r
,,1114358,University of Eldoret,15.092,\r
,,1114293,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (ANIMAL SCIENCE),15,1105290,Chuka University,23.177,"Mathematics/Physics/Chemistry: C+
Biology: C+"\r
,,1105293,Chuka University,15.092,\r
,,1057293,Egerton University,22.376,\r
,,1057689,Egerton University,28.213,\r
,,1053293,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249290,Jomo Kenyatta University of Agriculture and Technology,32.819,\r
,,1111294,Kenyatta University,29.526,\r
,,1087293,Kisii University,15.092,\r
,,1165294,Maasai Mara University,23.477,\r
,,1229293,Maseno University,15.092,\r
,,1082290,Masinde Muliro University of Science and Technology,15.092,\r
,,1240294,Meru University of Science and Technology,15.092,\r
,,1253293,Moi University,15.092,\r
,,1279290,Mount Kenya University,15.092,\r
,,1117291,Pwani University,15.092,\r
,,1685293,Tharaka University,24.181,\r
,,1114358,University of Eldoret,15.092,\r
,,1114293,University of Eldoret,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF ARTS IN ENVIRONMENTAL PLANNING AND MANAGEMENT,15,1078186,Africa Nazarene University,15.092,"Chemistry/Geography: C+
Biology/Agriculture: C+"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture and Technology,27.687,\r
,,1249489,JKUAT,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science and Technology,15.092,\r
,,1082213,Masinde Muliro University,15.092,\r
,,1240786,Meru University of Science and Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,SEKU,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF ECONOMICS AND POLICY,15,1078186,Africa Nazarene University,15.092,"Chemistry/Geography: C+
Biology/Agriculture: C+"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture and Technology,27.687,\r
,,1249489,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science and Technology,15.092,\r
,,1082213,Masinde Muliro University of Science and Technology,15.092,\r
,,1240786,Meru University of Science and Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,South Eastern Kenya University,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (FORESTRY),15,1057419,Egerton University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1166330,South Eastern Kenya University,15.092,\r
,,1166389,South Eastern Kenya University,15.092,\r
,,1114330,University of Eldoret,15.092,\r
,,1118330,University of Kabianga,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (DAIRY TECHNOLOGY & MANAGEMENT),15,1057345,Egerton University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (AGRICULTURE & HUMAN ECOLOGY EXTENSION),15,1700415,Bomet University College,26.576,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1105416,Chuka University,30.186,\r
,,1105122,Chuka University,15.092,\r
,,1057122,Egerton University,23.659,\r
,,1057346,Egerton University,23.342,\r
,,1057417,Egerton University,31.387,\r
,,1053415,JOOUST,26.758,\r
,,1249122,JKUAT,29.108,\r
,,1061417,Kabarak University,20.477,\r
,,1244415,Karatina University,24.499,\r
,,1077122,Kenya Methodist University,15.092,\r
,,1111417,Kenyatta University,30.997,\r
,,1111122,Kenyatta University,15.092,\r
,,1108417,Kibabii University,28.74,\r
,,1087122,Kisii University,15.092,\r
,,1087615,Kisii University,28.682,\r
,,1087417,Kisii University,30.042,\r
,,1176417,Laikipia University,24.695,\r
,,1495346,Lukenya University,15.092,\r
,,1170415,Machakos University,27.103,\r
,,1229417,Maseno University,30.637,\r
,,1082417,MMUST,29.932,\r
,,1240415,Meru University of Science & Technology,26.582,\r
,,1240122,Meru University of Science & Technology,15.092,\r
,,1253415,Moi University,22.994,\r
,,1246417,Murang�a University of Technology,22.249,\r
,,1246122,Murang�a University of Technology,15.092,\r
,,5510122,Nyandarua University College,15.092,\r
,,1117122,Pwani University,15.092,\r
,,1117417,Pwani University,22.597,\r
,,1073122,Rongo University,15.092,\r
,,1073417,Rongo University,27.642,\r
,,1166122,SEKU,15.092,\r
,,1166415,SEKU,23.016,\r
,,1091415,Taita Taveta University,22.805,\r
,,1091122,Taita Taveta University,15.092,\r
,,1685122,Tharaka University,15.092,\r
,,1685417,Tharaka University,22.62,\r
,,1515417,Tom Mboya University,24.572,\r
,,1570417,Turkana University College,22.202,\r
,,1181122,"University of Eastern Africa, Baraton",15.092,\r
,,1114415,University of Eldoret,30.023,\r
,,1114122,University of Eldoret,15.092,\r
,,1093417,University of Embu,27.666,\r
,,1093122,University of Embu,15.092,\r
,,1118122,University of Kabianga,15.092,\r
,,1118416,University of Kabianga,28.771,\r
,,1263122,University of Nairobi,15.092,\r
,,1263417,University of Nairobi,31.596,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE IN ETHNOBOTANY,15,1114356,University of Eldoret,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (NATURAL RESOURCE MANAGEMENT),15,1078186,Africa Nazarene University,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1480312,Catholic University of Eastern Africa,15.092,\r
,,1105348,Chuka University,15.092,\r
,,1105213,Chuka University,15.092,\r
,,1080174,Co-operative University of Kenya,15.092,\r
,,1080213,Co-operative University of Kenya,15.092,\r
,,1080312,Co-operative University of Kenya,15.092,\r
,,1057213,Egerton University,22.095,\r
,,1057348,Egerton University,15.092,\r
,,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,\r
,,1249213,Jomo Kenyatta University of Agriculture and Technology,27.687,\r
,,1249489,JKUAT,15.092,\r
,,1061213,Kabarak University,15.092,\r
,,1111213,Kenyatta University,24.298,\r
,,1111312,Kenyatta University,20.715,\r
,,1087348,Kisii University,15.092,\r
,,1087213,Kisii University,23.519,\r
,,1176213,Laikipia University,15.092,\r
,,1165213,Maasai Mara University,15.092,\r
,,1170228,Machakos University,15.092,\r
,,1170213,Machakos University,15.092,\r
,,1229213,Maseno University,21.584,\r
,,1082348,Masinde Muliro University of Science and Technology,15.092,\r
,,1082213,MMUST,15.092,\r
,,1240786,Meru University of Science and Technology,15.092,\r
,,1253229,Moi University,15.092,\r
,,1279312,Mount Kenya University,15.092,\r
,,1117213,Pwani University,15.092,\r
,,1117312,Pwani University,15.092,\r
,,1073213,Rongo University,15.092,\r
,,1166186,South Eastern Kenya University,15.092,\r
,,1166886,SEKU,15.092,\r
,,1112467,Technical University of Kenya,22.232,\r
,,1515213,Tom Mboya University,15.092,\r
,,1570213,Turkana University College,15.092,\r
,,1570886,Turkana University College,15.092,\r
,,1570348,Turkana University College,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1114357,University of Eldoret,15.092,\r
,,1114356,University of Eldoret,15.092,\r
,,1114348,University of Eldoret,15.092,\r
,,1114312,University of Eldoret,15.092,\r
,,1114213,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
,,1093186,University of Embu,15.092,\r
,,1093184,University of Embu,15.092,\r
,,1263186,University of Nairobi,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (CROP PROTECTION),15,1249421,Jomo Kenyatta University of Agriculture and Technology,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1111422,Kenyatta University,15.092,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE(FOOD SECURITY),15,1053483,Jaramogi Oginga Odinga University of Science and Technology,15.092,"Biology/Agriculture: C
Chemistry: C
Mathematics: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (SOIL SCIENCE),15,1053479,Jaramogi Oginga Odinga University of Science and Technology,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
,,,,,\r
BACHELOR OF SCIENCE (WATER RESOURCE MANAGEMENT),15,1053486,Jaramogi Oginga Odinga University of Science and Technology,15.092,"Mathematics/Physics/Geography: C
Agriculture: C+
Chemistry: C
Biology: C"\r
,,1249489,Jomo Kenyatta University of Agriculture and Technology,15.092,\r
,,1114488,University of Eldoret,15.092,\r
,,1093488,University of Embu,15.092,\r
`,Er=r=>{if(!Array.isArray(r))return{};const i={};return r.forEach(n=>{const t=String((n==null?void 0:n.subject)||"").trim(),s=String((n==null?void 0:n.grade)||"").trim().toUpperCase();!t||!s||(i[t]=s)}),i},Ir=r=>{if(!r||typeof r!="object")return{};const i={};return Object.entries(r).forEach(([n,t])=>{const s=Number(n);if(!Number.isInteger(s)||s<1)return;const a=Array.isArray(t)?t:[];i[s]=a.map(I=>({name:String((I==null?void 0:I.name)||"").trim(),requirements:Er(I==null?void 0:I.requirements),universities:Array.isArray(I==null?void 0:I.universities)?I.universities.map(N=>({name:String((N==null?void 0:N.name)||"").trim(),courseCode:String((N==null?void 0:N.courseCode)||"").trim(),cutoff:Number((N==null?void 0:N.cutoff)??0)})).filter(N=>!!N.name):[]})).filter(I=>!!I.name)}),i};let un=null;const qn=()=>{if(un)return un;const r=ne(or);return un=Ir(r),un},lr=({mode:r="public"}={})=>{const[i,n]=E.useState({}),[t,s]=E.useState(!0),[a,I]=E.useState(""),N=E.useCallback(async()=>{if(s(!0),r!=="admin"){try{const c=qn();n(c),I("")}catch(c){n({}),I((c==null?void 0:c.message)||"Unable to load bundled course catalog.")}finally{s(!1)}return}try{const c=await ke();n(c),I("")}catch(c){const d=qn();n(d);const y=(c==null?void 0:c.message)||"Unable to load courses from realtime database.";I(`${y} Showing bundled courses until backend connection is available.`)}finally{s(!1)}},[r]),A=E.useCallback(async c=>{if(r!=="admin")throw new Error("Catalog updates are only available in admin mode.");await Je(c),I(""),await N()},[N,r]),T=E.useCallback(async c=>{if(r!=="admin")throw new Error("Catalog updates are only available in admin mode.");await qe(c),I(""),await N()},[N,r]);return E.useEffect(()=>{N().catch(()=>{})},[N]),{courseCatalog:i,catalogLoading:t,courseCatalogError:a,loadCatalog:N,saveCatalog:A,saveSingleCourse:T}};function cr({isAuthenticated:r,onLogin:i,onGoogleLogin:n,authError:t,isLoading:s}){const a=On(),[I,N]=E.useState(""),[A,T]=E.useState(""),[c,d]=E.useState(!1),[y,u]=E.useState("");if(r)return e.jsx(En,{to:"/admin",replace:!0});const x=async h=>{h.preventDefault(),u("");const C=await i(I,A);if(C.success){a("/admin");return}u(C.error||"Invalid admin credentials.")},O=async()=>{u("");const h=await n();if(h.success){a("/admin");return}u(h.error||"Google sign-in failed.")};return e.jsxs("section",{className:"mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h1",{className:"text-2xl font-semibold tracking-tight",children:"Admin Login"}),e.jsx("p",{className:"mt-2 text-sm text-slate-600",children:"Only admins can upload course data to Firebase."}),e.jsxs("form",{onSubmit:x,className:"mt-6 space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"admin_email",className:"mb-1 block text-sm font-medium text-slate-700",children:"Email"}),e.jsx("input",{id:"admin_email",type:"email",value:I,onChange:h=>N(h.target.value),required:!0,className:"ui-input",placeholder:"admin@example.com"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"admin_password",className:"mb-1 block text-sm font-medium text-slate-700",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{id:"admin_password",type:c?"text":"password",value:A,onChange:h=>T(h.target.value),required:!0,className:"ui-input pr-20"}),e.jsx("button",{type:"button",onClick:()=>d(h=>!h),className:"absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50",children:c?"Hide":"View"})]})]}),e.jsx(F,{tone:"danger",message:y}),e.jsx(F,{tone:"danger",message:t}),e.jsx("button",{type:"submit",disabled:s,className:"inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-700",children:s?"Signing in...":"Login"}),e.jsxs("div",{className:"relative py-1",children:[e.jsx("div",{className:"absolute inset-0 flex items-center",children:e.jsx("span",{className:"w-full border-t border-slate-200"})}),e.jsx("div",{className:"relative flex justify-center",children:e.jsx("span",{className:"bg-white px-2 text-xs text-slate-500",children:"OR"})})]}),e.jsx("button",{type:"button",onClick:O,disabled:s,className:"inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:"Continue with Google"})]})]})}const Nr="/assets/courses-CtX9VR_p.csv",Ur=r=>new Promise((i,n)=>{const t=new FileReader;t.onload=()=>i(String(t.result||"")),t.onerror=()=>n(new Error("Unable to read selected file.")),t.readAsText(r)});function Ar({firebaseConfigured:r,onUploadCatalog:i,bundledCoursesCsvUrl:n}){const[t,s]=E.useState(""),[a,I]=E.useState(""),[N,A]=E.useState(!1),[T,c]=E.useState(null),d=async(O,h)=>{s(""),I(""),A(!0);try{const C=ne(O);await i(C);const f=ar(C);I(`${h} uploaded: ${f.clusters} clusters, ${f.courses} courses, ${f.universities} universities.`)}catch(C){s(C.message||"Failed to upload course catalog.")}finally{A(!1)}},y=async()=>{if(!T){s("Select a CSV file first.");return}try{const O=await Ur(T);await d(O,T.name)}catch(O){s(O.message||"Failed to read selected CSV file.")}},u=async()=>{try{const O=await fetch(n);if(!O.ok)throw new Error(`Unable to load bundled CSV (status ${O.status}).`);const h=await O.text();await d(h,"courses.csv")}catch(O){s(O.message||"Failed to upload bundled courses.csv.")}},x=O=>{var h;c(((h=O.target.files)==null?void 0:h[0])||null)};return e.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h2",{className:"text-xl font-semibold tracking-tight",children:"Courses Upload"}),e.jsx("p",{className:"mt-1 text-sm text-slate-600",children:"Upload a `courses.csv` compatible file through backend API into Firebase realtime database. Uploading replaces the entire catalog (existing courses are deleted)."}),r?null:e.jsx(F,{className:"mt-4",tone:"warning",message:"Backend Firebase integration is not available."}),e.jsxs("div",{className:"mt-5 flex flex-col gap-3 sm:flex-row sm:items-end",children:[e.jsxs("div",{className:"w-full sm:max-w-md",children:[e.jsx("label",{htmlFor:"admin_csv_upload",className:"mb-1 block text-sm font-medium text-slate-700",children:"Select CSV file"}),e.jsx("input",{id:"admin_csv_upload",type:"file",accept:".csv,text/csv",onChange:x,className:"ui-file-input"})]}),e.jsx("button",{type:"button",onClick:y,disabled:N||!r,className:"inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400",children:"Replace With Selected CSV"}),e.jsx("button",{type:"button",onClick:u,disabled:N||!r,className:"inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:"Replace With Bundled courses.csv"})]}),e.jsx(F,{className:"mt-3",tone:"danger",message:t}),e.jsx(F,{className:"mt-3",tone:"success",message:a})]})}const $n={name:"",email:"",password:""},Tr={cluster:"",name:"",requirementsText:"",universityName:"",courseCode:"",cutoff:""},yr=r=>{const i={};return String(r||"").split(/\r?\n|;/).map(n=>n.trim()).filter(Boolean).forEach(n=>{const t=n.indexOf(":");if(t<0)return;const s=n.slice(0,t).trim(),a=n.slice(t+1).trim().toUpperCase();!s||!a||(i[s]=a)}),i},Cr=r=>{const i=Object.entries(r||{});return i.length?i.map(([n,t])=>({subject:String(n||"").trim(),grade:String(t||"").trim().toUpperCase()})).filter(n=>n.subject&&n.grade).sort((n,t)=>n.subject.localeCompare(t.subject)).map(n=>`${n.subject}: ${n.grade}`).join(", "):"None"},Sr=r=>{const i=Object.keys(r||{}).length;let n=0,t=0;return Object.values(r||{}).forEach(s=>{Array.isArray(s)&&(n+=s.length,s.forEach(a=>{t+=Array.isArray(a==null?void 0:a.universities)?a.universities.length:0}))}),{clusters:i,courses:n,universities:t}};function Rr({firebaseConfigured:r,onUploadCatalog:i,onAddSingleCourse:n,onLogout:t,onAddRegularAdmin:s,adminProfile:a,adminEmail:I,authError:N,courseCatalog:A}){const[T,c]=E.useState($n),[d,y]=E.useState(!1),[u,x]=E.useState(""),[O,h]=E.useState(""),[C,f]=E.useState(Tr),[v,g]=E.useState(!1),[H,B]=E.useState(""),[Q,X]=E.useState(""),[W,tn]=E.useState(""),[$,P]=E.useState("all"),_=(a==null?void 0:a.role)==="super",z=E.useMemo(()=>Sr(A),[A]),Z=E.useMemo(()=>{const U=[];return Object.entries(A||{}).forEach(([V,G])=>{const nn=Number(V);!Number.isInteger(nn)||nn<1||Array.isArray(G)&&G.forEach(J=>{const o=String((J==null?void 0:J.name)||"").trim();o&&U.push({cluster:nn,name:o,requirements:(J==null?void 0:J.requirements)||{},universities:Array.isArray(J==null?void 0:J.universities)?J.universities.length:0})})}),U.sort((V,G)=>V.cluster-G.cluster||V.name.localeCompare(G.name))},[A]),R=E.useMemo(()=>{const U=new Set;return Z.forEach(V=>U.add(V.cluster)),Array.from(U).sort((V,G)=>V-G)},[Z]),M=E.useMemo(()=>{const U=W.trim().toLowerCase(),V=$==="all"?null:Number($);return Z.filter(G=>V&&G.cluster!==V?!1:U?G.name.toLowerCase().includes(U):!0)},[Z,$,W]),m=(U,V)=>{c(G=>({...G,[U]:V}))},Y=(U,V)=>{f(G=>({...G,[U]:V}))},p=async U=>{if(U.preventDefault(),x(""),h(""),!_){x("Only a super admin can add regular admins.");return}if(!T.email||!T.password){x("Email and password are required.");return}y(!0);try{const V=await s({name:T.name,email:T.email,password:T.password});h(`Regular admin added: ${V.user.email}`),c($n)}catch(V){x(V.message||"Unable to add regular admin.")}finally{y(!1)}},on=async U=>{if(U.preventDefault(),B(""),X(""),!r){B("Firebase is not configured.");return}const V=Number(C.cluster);if(!Number.isInteger(V)||V<1){B("Cluster must be a whole number greater than 0.");return}const G=String(C.name||"").trim();if(!G){B("Course name is required.");return}const nn=String(C.universityName||"").trim();if(!nn){B("University name is required.");return}const J=String(C.cutoff||"").trim(),o=J?Number(J):0;if(!Number.isFinite(o)||o<0){B("Cutoff must be a number equal to or greater than 0.");return}g(!0);try{await n({cluster:V,name:G,requirements:yr(C.requirementsText),universities:[{name:nn,courseCode:String(C.courseCode||"").trim(),cutoff:o}]}),X(`Saved "${G}" in cluster ${V}.`),f(S=>({...S,universityName:"",courseCode:"",cutoff:""}))}catch(S){B(S.message||"Unable to save course.")}finally{g(!1)}};return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 shadow-sm",children:[e.jsx("div",{className:"pointer-events-none absolute -top-14 -right-12 h-44 w-44 rounded-full bg-cyan-200/40 blur-2xl"}),e.jsx("div",{className:"pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-2xl"}),e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"flex flex-wrap items-start justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"inline-flex rounded-full border border-cyan-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700",children:"Control Center"}),e.jsx("h1",{className:"mt-3 text-3xl font-semibold tracking-tight text-slate-900",children:"Admin Dashboard"}),e.jsx("p",{className:"mt-2 max-w-2xl text-sm text-slate-600",children:"Manage admins and maintain course catalog content for calculator results and eligibility checks."}),e.jsxs("p",{className:"mt-3 text-xs font-medium text-slate-500",children:["Signed in as: ",I||"unknown"," (",(a==null?void 0:a.role)||"regular"," admin)"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ln,{to:"/admin/sessions",className:"inline-flex items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100",children:"View Calculated Users"}),e.jsx("button",{type:"button",onClick:t,className:"inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",children:"Logout"})]})]}),e.jsxs("div",{className:"mt-5 grid gap-3 sm:grid-cols-3",children:[e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white/80 p-4",children:[e.jsx("p",{className:"text-xs uppercase tracking-wider text-slate-500",children:"Clusters"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold text-slate-900",children:z.clusters})]}),e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white/80 p-4",children:[e.jsx("p",{className:"text-xs uppercase tracking-wider text-slate-500",children:"Courses"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold text-slate-900",children:z.courses})]}),e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white/80 p-4",children:[e.jsx("p",{className:"text-xs uppercase tracking-wider text-slate-500",children:"University Entries"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold text-slate-900",children:z.universities})]})]})]}),e.jsx(F,{className:"mt-3",tone:"danger",message:N})]}),e.jsxs("div",{className:"grid gap-6 xl:grid-cols-2",children:[e.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h2",{className:"text-xl font-semibold tracking-tight text-slate-900",children:"Admin Users"}),e.jsx("p",{className:"mt-1 text-sm text-slate-600",children:"Create regular admin accounts that can log in and access admin tools."}),_?null:e.jsx(F,{className:"mt-3",tone:"warning",message:"Only a super admin can add regular admin users."}),e.jsxs("form",{onSubmit:p,className:"mt-5 grid gap-4 md:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"regular_admin_name",className:"mb-1 block text-sm font-medium text-slate-700",children:"Full Name"}),e.jsx("input",{id:"regular_admin_name",type:"text",value:T.name,onChange:U=>m("name",U.target.value),className:"ui-input",placeholder:"Admin Name"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"regular_admin_email",className:"mb-1 block text-sm font-medium text-slate-700",children:"Email"}),e.jsx("input",{id:"regular_admin_email",type:"email",value:T.email,onChange:U=>m("email",U.target.value),required:!0,className:"ui-input",placeholder:"newadmin@example.com"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"regular_admin_password",className:"mb-1 block text-sm font-medium text-slate-700",children:"Password"}),e.jsx("input",{id:"regular_admin_password",type:"password",value:T.password,onChange:U=>m("password",U.target.value),required:!0,minLength:6,className:"ui-input",placeholder:"At least 6 characters"})]}),e.jsx("div",{className:"md:col-span-3",children:e.jsx("button",{type:"submit",disabled:!_||d,className:"inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-slate-800 enabled:hover:to-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400",children:d?"Creating...":"Add Regular Admin"})})]}),e.jsx(F,{className:"mt-3",tone:"danger",message:u}),e.jsx(F,{className:"mt-3",tone:"success",message:O})]}),e.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h2",{className:"text-xl font-semibold tracking-tight text-slate-900",children:"Add Single Course"}),e.jsx("p",{className:"mt-1 text-sm text-slate-600",children:"Add one course entry at a time. If the course already exists in the same cluster, the university entry is merged into it."}),r?null:e.jsx(F,{className:"mt-3",tone:"warning",message:"Firebase is not configured for catalog writes."}),e.jsxs("form",{onSubmit:on,className:"mt-5 grid gap-4 md:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"single_course_cluster",className:"mb-1 block text-sm font-medium text-slate-700",children:"Cluster"}),e.jsx("input",{id:"single_course_cluster",type:"number",min:1,value:C.cluster,onChange:U=>Y("cluster",U.target.value),required:!0,className:"ui-input",placeholder:"e.g. 2"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"single_course_name",className:"mb-1 block text-sm font-medium text-slate-700",children:"Course Name"}),e.jsx("input",{id:"single_course_name",type:"text",value:C.name,onChange:U=>Y("name",U.target.value),required:!0,className:"ui-input",placeholder:"BACHELOR OF COMMERCE"})]}),e.jsxs("div",{className:"md:col-span-2",children:[e.jsx("label",{htmlFor:"single_course_requirements",className:"mb-1 block text-sm font-medium text-slate-700",children:"Minimum Subject Requirements"}),e.jsx("textarea",{id:"single_course_requirements",value:C.requirementsText,onChange:U=>Y("requirementsText",U.target.value),rows:4,className:"ui-textarea",placeholder:`Mathematics: C+
English/Kiswahili: B`})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"single_course_university",className:"mb-1 block text-sm font-medium text-slate-700",children:"University"}),e.jsx("input",{id:"single_course_university",type:"text",value:C.universityName,onChange:U=>Y("universityName",U.target.value),required:!0,className:"ui-input",placeholder:"University of Nairobi"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"single_course_code",className:"mb-1 block text-sm font-medium text-slate-700",children:"Course Code"}),e.jsx("input",{id:"single_course_code",type:"text",value:C.courseCode,onChange:U=>Y("courseCode",U.target.value),className:"ui-input",placeholder:"1263134"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"single_course_cutoff",className:"mb-1 block text-sm font-medium text-slate-700",children:"Cutoff Points"}),e.jsx("input",{id:"single_course_cutoff",type:"number",step:"0.001",min:0,value:C.cutoff,onChange:U=>Y("cutoff",U.target.value),className:"ui-input",placeholder:"32.613"})]}),e.jsx("div",{className:"md:col-span-2",children:e.jsx("button",{type:"submit",disabled:v||!r,className:"inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-emerald-500 enabled:hover:to-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400",children:v?"Saving...":"Save Course Entry"})})]}),e.jsx(F,{className:"mt-3",tone:"danger",message:H}),e.jsx(F,{className:"mt-3",tone:"success",message:Q})]})]}),e.jsx(Ar,{firebaseConfigured:r,onUploadCatalog:i,bundledCoursesCsvUrl:Nr}),e.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsxs("div",{className:"flex flex-wrap items-start justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-semibold tracking-tight text-slate-900",children:"Course Requirements"}),e.jsx("p",{className:"mt-1 text-sm text-slate-600",children:"Review subject requirements per course to verify catalog accuracy."})]}),e.jsxs("div",{className:"text-xs font-medium text-slate-500",children:["Showing ",M.length," of ",Z.length," courses"]})]}),e.jsxs("div",{className:"mt-4 grid gap-4 md:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"admin_course_search",className:"mb-1 block text-sm font-medium text-slate-700",children:"Search course"}),e.jsx("input",{id:"admin_course_search",type:"text",value:W,onChange:U=>tn(U.target.value),className:"ui-input",placeholder:"e.g. Clinical Medicine"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"admin_course_cluster",className:"mb-1 block text-sm font-medium text-slate-700",children:"Filter by cluster"}),e.jsxs("select",{id:"admin_course_cluster",value:$,onChange:U=>P(U.target.value),className:"ui-select",children:[e.jsx("option",{value:"all",children:"All clusters"}),R.map(U=>e.jsxs("option",{value:U,children:["Cluster ",U]},U))]})]})]}),e.jsx("div",{className:"mt-4 overflow-x-auto rounded-xl border border-slate-200",children:e.jsxs("table",{className:"min-w-full divide-y divide-slate-200 text-sm",children:[e.jsx("thead",{className:"bg-slate-50 text-left text-slate-700",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Cluster"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Course"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Subject Requirements"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Universities"})]})}),e.jsx("tbody",{className:"divide-y divide-slate-100 bg-white text-slate-700",children:M.map(U=>e.jsxs("tr",{className:"hover:bg-slate-50/70",children:[e.jsxs("td",{className:"px-3 py-2 font-medium text-slate-900",children:["Cluster ",U.cluster]}),e.jsx("td",{className:"px-3 py-2",children:U.name}),e.jsx("td",{className:"px-3 py-2 text-slate-600",children:Cr(U.requirements)}),e.jsx("td",{className:"px-3 py-2 text-slate-600",children:U.universities})]},`${U.cluster}-${U.name}`))})]})})]})]})}const Un=20,ur=["BIO","CHE","MAT","PHY"],dn={code:"",email:"",phoneNumber:"",amountPaid:"0",medicineEligible:!1},dr=r=>{if(!r)return"Unknown";const i=Date.parse(r);return Number.isFinite(i)?new Date(i).toLocaleString():"Unknown"},Vn=r=>{const i=Number(r);return Number.isFinite(i)?i.toFixed(3):"0.000"},ee=r=>{const i=r&&typeof r=="object"?r:{};return Array.from({length:20},(n,t)=>{const s=t+1;return{cluster:s,score:Number(i[s]??i[String(s)]??0)}}).map(n=>({...n,score:Number.isFinite(n.score)?n.score:0}))},Or=(r,i=3)=>ee(r).sort((n,t)=>t.score-n.score||n.cluster-t.cluster).slice(0,i),mr=r=>[r.code,r.email,r.phoneNumber,r.amountPaid,r.createdAt,r.medicineEligible?"eligible":"not-eligible"].join(" ").toLowerCase(),hr=(r,i)=>{if(i<=7)return Array.from({length:i},(t,s)=>s+1);const n=Math.max(1,Math.min(r-3,i-6));return Array.from({length:7},(t,s)=>n+s)};function gr({firebaseConfigured:r}){const[i,n]=E.useState([]),[t,s]=E.useState(!0),[a,I]=E.useState(""),[N,A]=E.useState(""),[T,c]=E.useState(""),[d,y]=E.useState(""),[u,x]=E.useState(""),[O,h]=E.useState([]),[C,f]=E.useState(1),[v,g]=E.useState(dn),[H,B]=E.useState(!1),[Q,X]=E.useState(!1),[W,tn]=E.useState(""),$=E.useCallback(async()=>{if(!r){s(!1),I("Firebase is not configured."),n([]);return}s(!0),I("");try{const o=await ze();n(o)}catch(o){I(o.message||"Unable to load cluster sessions."),n([])}finally{s(!1)}},[r]);E.useEffect(()=>{$().catch(()=>{})},[$]);const P=E.useMemo(()=>{const o=String(d||"").trim().toLowerCase();return o?i.filter(S=>mr(S).includes(o)):i},[d,i]),_=E.useMemo(()=>Math.max(1,Math.ceil(P.length/Un)),[P.length]),z=E.useMemo(()=>{const o=(C-1)*Un;return P.slice(o,o+Un)},[C,P]);E.useMemo(()=>{const o=new Set(P.map(b=>b.email||b.phoneNumber||b.code)).size,S=P.filter(b=>b.medicineEligible).length;return{totalSessions:P.length,uniqueUsers:o,medicineQualifiedCount:S}},[P]);const Z=E.useMemo(()=>new Set(O),[O]),R=E.useMemo(()=>z.map(o=>o.code),[z]),M=R.length>0&&R.every(o=>Z.has(o));E.useEffect(()=>{f(1)},[d]),E.useEffect(()=>{C>_&&f(_)},[C,_]),E.useEffect(()=>{const o=new Set(P.map(S=>S.code));h(S=>S.filter(b=>o.has(b))),u&&!o.has(u)&&x(""),v.code&&!o.has(v.code)&&g(dn)},[v.code,u,P]);const m=o=>{h(S=>{const b=new Set(S);return b.has(o)?b.delete(o):b.add(o),Array.from(b)})},Y=()=>{h(o=>{const S=new Set(o);return M?R.forEach(b=>S.delete(b)):R.forEach(b=>S.add(b)),Array.from(S)})},p=()=>{H||g(dn)},on=async o=>{if(o.preventDefault(),!v.code)return;A(""),c("");const S=Number(v.amountPaid);if(!Number.isFinite(S)||S<0){A("Amount paid must be a valid number equal to or greater than 0.");return}B(!0);try{await Ze(v.code,{email:v.email,phoneNumber:v.phoneNumber,amountPaid:S,medicineEligible:v.medicineEligible}),c(`Session ${v.code} updated successfully.`),g(dn),await $()}catch(b){A(b.message||"Unable to update session.")}finally{B(!1)}},U=async o=>{if(o&&(A(""),c(""),!!window.confirm(`Delete session ${o}?`))){tn(o);try{await Qe(o),c(`Session ${o} deleted.`),h(S=>S.filter(b=>b!==o)),u===o&&x(""),await $()}catch(S){A(S.message||"Unable to delete session.")}finally{tn("")}}},V=async()=>{if(O.length&&(A(""),c(""),!!window.confirm(`Delete ${O.length} selected session(s)?`))){X(!0);try{const o=await Xe(O);c(`${o} session(s) deleted.`),h([]),u&&O.includes(u)&&x(""),await $()}catch(o){A(o.message||"Unable to delete selected sessions.")}finally{X(!1)}}},G=E.useMemo(()=>hr(C,_),[C,_]),nn=P.length?(C-1)*Un+1:0,J=Math.min(P.length,C*Un);return e.jsxs("section",{className:"space-y-6",children:[e.jsx("div",{className:"rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 shadow-sm",children:e.jsxs("div",{className:"flex flex-wrap items-start justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"inline-flex rounded-full border border-cyan-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700",children:"Admin Analytics"}),e.jsx("h1",{className:"mt-3 text-3xl font-semibold tracking-tight text-slate-900",children:"Calculated Users Table"}),e.jsx("p",{className:"mt-2 text-sm text-slate-600",children:"Review users who calculated cluster points and manage records safely."})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{type:"button",onClick:()=>$(),className:"inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",children:[e.jsx(ie,{className:"h-4 w-4"}),"Refresh"]}),e.jsxs(ln,{to:"/admin",className:"inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-600",children:[e.jsx(te,{className:"h-4 w-4"}),"Back to Admin"]})]})]})}),e.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsx("h2",{className:"text-xl font-semibold tracking-tight text-slate-900",children:"User Calculations"}),e.jsxs("div",{className:"flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto",children:[e.jsx("input",{type:"search",value:d,onChange:o=>y(o.target.value),placeholder:"Search by email, code, phone...",className:"ui-input w-full max-w-sm"}),e.jsxs("button",{type:"button",onClick:Y,disabled:!R.length,className:"inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:[M?e.jsx(se,{className:"h-4 w-4"}):e.jsx(Bn,{className:"h-4 w-4"}),M?"Unselect Page":"Select Page"]}),e.jsxs("button",{type:"button",onClick:V,disabled:!O.length||Q,className:"inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition enabled:hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-400",children:[e.jsx(jn,{className:"h-4 w-4"}),Q?"Deleting...":`Delete Selected (${O.length})`]})]})]}),e.jsx(F,{className:"mt-3",tone:"danger",message:a}),e.jsx(F,{className:"mt-3",tone:"danger",message:N}),e.jsx(F,{className:"mt-3",tone:"success",message:T}),t?e.jsx(F,{className:"mt-3",tone:"info",message:"Loading sessions..."}):null,e.jsx("div",{className:"mt-4 overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-slate-200 text-sm",children:[e.jsx("thead",{className:"bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-3 font-semibold",children:e.jsx("input",{type:"checkbox",checked:M,onChange:Y,"aria-label":"Select all on current page",className:"ui-checkbox"})}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"Date"}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"Access Code"}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"User"}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"Best Cluster"}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"Top 3 Cluster Points"}),e.jsx("th",{className:"px-3 py-3 font-semibold",children:"Actions"})]})}),e.jsxs("tbody",{className:"divide-y divide-slate-200 bg-white text-slate-700",children:[!t&&!z.length?e.jsx("tr",{children:e.jsx("td",{colSpan:8,className:"px-3 py-8 text-center text-sm text-slate-500",children:"No calculation sessions found."})}):null,z.map(o=>{const S=Or(o.results),b=S[0],Mn=Object.entries(o.grades||{}).filter(([,k])=>k),Fn=W===o.code;return e.jsxs(E.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"whitespace-nowrap px-3 py-3",children:e.jsx("input",{type:"checkbox",checked:Z.has(o.code),onChange:()=>m(o.code),"aria-label":`Select ${o.code}`,className:"ui-checkbox"})}),e.jsx("td",{className:"whitespace-nowrap px-3 py-3",children:dr(o.createdAt)}),e.jsx("td",{className:"whitespace-nowrap px-3 py-3 font-mono font-semibold text-slate-900",children:o.code}),e.jsxs("td",{className:"px-3 py-3",children:[e.jsx("p",{className:"font-medium text-slate-900",children:o.email||"No email"}),e.jsx("p",{className:"text-xs text-slate-500",children:o.phoneNumber||"No phone"})]}),e.jsx("td",{className:"whitespace-nowrap px-3 py-3",children:b?`C${b.cluster}: ${Vn(b.score)}`:"N/A"}),e.jsx("td",{className:"px-3 py-3",children:e.jsx("div",{className:"flex flex-wrap gap-1.5",children:S.map(k=>e.jsxs("span",{className:"rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700",children:["C",k.cluster,": ",Vn(k.score)]},`${o.code}-${k.cluster}`))})}),e.jsx("td",{className:"whitespace-nowrap px-3 py-3",children:e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsxs("button",{type:"button",onClick:()=>x(k=>k===o.code?"":o.code),className:"inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100",children:[u===o.code?e.jsx(ae,{className:"h-3.5 w-3.5"}):e.jsx(oe,{className:"h-3.5 w-3.5"}),u===o.code?"Hide":"View"]}),e.jsxs("button",{type:"button",onClick:()=>U(o.code),disabled:Fn,className:"inline-flex items-center justify-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition enabled:hover:bg-rose-100 disabled:cursor-not-allowed disabled:text-rose-400",children:[e.jsx(jn,{className:"h-3.5 w-3.5"}),Fn?"Deleting...":"Delete"]})]})})]}),u===o.code?e.jsx("tr",{className:"bg-slate-50/70",children:e.jsx("td",{colSpan:8,className:"px-3 py-4",children:e.jsxs("div",{className:"grid gap-4 lg:grid-cols-3",children:[e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white p-3",children:[e.jsx("h3",{className:"text-sm font-semibold text-slate-900",children:"Qualification Details"}),e.jsx("p",{className:"mt-2 text-xs text-slate-600",children:"Medicine core subjects (BIO, CHE, MAT, PHY):"}),e.jsx("div",{className:"mt-2 flex flex-wrap gap-1.5",children:ur.map(k=>{var Cn,Hn;return e.jsxs("span",{className:`rounded-full border px-2 py-1 text-xs font-medium ${(Cn=o.grades)!=null&&Cn[k]?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-rose-200 bg-rose-50 text-rose-700"}`,children:[k,": ",((Hn=o.grades)==null?void 0:Hn[k])||"Missing"]},`${o.code}-${k}`)})}),e.jsxs("p",{className:"mt-3 text-xs text-slate-500",children:["Amount Paid: KES ",o.amountPaid||0]})]}),e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2",children:[e.jsx("h3",{className:"text-sm font-semibold text-slate-900",children:"All Cluster Points"}),e.jsx("div",{className:"mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5",children:ee(o.results).map(k=>e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs",children:[e.jsxs("p",{className:"font-semibold text-slate-700",children:["Cluster ",k.cluster]}),e.jsx("p",{className:"mt-1 font-mono text-slate-900",children:Vn(k.score)})]},`${o.code}-cluster-${k.cluster}`))}),e.jsxs("p",{className:"mt-3 text-xs text-slate-500",children:["Graded subjects: ",Mn.length," ",Mn.length?`(${Mn.map(([k,Cn])=>`${k}:${Cn}`).join(", ")})`:""]})]})]})})}):null]},o.code)})]})]})}),e.jsxs("div",{className:"mt-4 flex flex-wrap items-center justify-between gap-3",children:[e.jsxs("p",{className:"text-sm text-slate-600",children:["Showing ",nn,"-",J," of ",P.length]}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsxs("button",{type:"button",onClick:()=>f(o=>Math.max(1,o-1)),disabled:C<=1,className:"inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:[e.jsx(Ee,{className:"h-4 w-4"}),"Prev"]}),G.map(o=>e.jsx("button",{type:"button",onClick:()=>f(o),className:`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${o===C?"border-slate-900 bg-slate-900 text-white":"border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`,children:o},`page-${o}`)),e.jsxs("button",{type:"button",onClick:()=>f(o=>Math.min(_,o+1)),disabled:C>=_,className:"inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:["Next",e.jsx(Ie,{className:"h-4 w-4"})]})]})]})]}),v.code?e.jsx("div",{className:"fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4",children:e.jsxs("div",{className:"w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl",children:[e.jsxs("h3",{className:"text-lg font-semibold text-slate-900",children:["Edit Session ",v.code]}),e.jsx("p",{className:"mt-1 text-sm text-slate-600",children:"Update user contact details, payment amount, and qualification flag."}),e.jsxs("form",{onSubmit:on,className:"mt-4 grid gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"edit_session_email",className:"mb-1 block text-sm font-medium text-slate-700",children:"Email"}),e.jsx("input",{id:"edit_session_email",type:"email",value:v.email,onChange:o=>g(S=>({...S,email:o.target.value})),className:"ui-input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"edit_session_phone",className:"mb-1 block text-sm font-medium text-slate-700",children:"Phone Number"}),e.jsx("input",{id:"edit_session_phone",type:"text",value:v.phoneNumber,onChange:o=>g(S=>({...S,phoneNumber:o.target.value})),className:"ui-input"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"edit_session_amount",className:"mb-1 block text-sm font-medium text-slate-700",children:"Amount Paid"}),e.jsx("input",{id:"edit_session_amount",type:"number",min:0,step:"0.01",value:v.amountPaid,onChange:o=>g(S=>({...S,amountPaid:o.target.value})),className:"ui-input"})]}),e.jsxs("label",{className:"inline-flex items-center gap-2 text-sm font-medium text-slate-700",children:[e.jsx("input",{type:"checkbox",checked:v.medicineEligible,onChange:o=>g(S=>({...S,medicineEligible:o.target.checked})),className:"ui-checkbox"}),"Medicine Eligible"]}),e.jsxs("div",{className:"mt-2 flex items-center justify-end gap-2",children:[e.jsxs("button",{type:"button",onClick:p,disabled:H,className:"inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400",children:[e.jsx(le,{className:"h-4 w-4"}),"Cancel"]}),e.jsxs("button",{type:"submit",disabled:H,className:"inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400",children:[e.jsx(Bn,{className:"h-4 w-4"}),H?"Saving...":"Save Changes"]})]})]})]})}):null]})}const Tn={darajaPayment:q("/api/payments"),darajaQuery:q("/api/payments/query"),email:q("/api/sendEmail"),calculateCluster:q("/api/calculateClusterPoints"),adminHealth:q("/api/admin/health")},vr=async r=>{try{const i=await r.text();return i?JSON.parse(i):null}catch{return null}},gn=async({url:r,headers:i,body:n})=>{const t=await fetch(r,{method:"POST",credentials:"include",headers:i||{},body:n||void 0}),s=await vr(t);return{ok:t.ok,status:t.status,data:s}},vn=(r,i)=>{const n=(r==null?void 0:r.data)||{},t=(n==null?void 0:n.error)||(n==null?void 0:n.message)||(n==null?void 0:n.errorMessage)||(n==null?void 0:n.ResultDesc);return t?String(t):i},Yn=r=>r&&typeof r=="object"&&"data"in r&&r.success!==!1?r.data:r,Yr=r=>({source:"local-engine",results:be(r),medicineEligible:Ve(r)}),Mr=async r=>{const i=(r==null?void 0:r["phone number"])||(r==null?void 0:r.phone_number)||(r==null?void 0:r.phoneNumber)||(r==null?void 0:r.phone)||"",n=Number((r==null?void 0:r.amount)??0),t=await gn({url:Tn.darajaPayment,headers:{"Content-Type":"application/json"},body:JSON.stringify({phone_number:i,amount:n,account_reference:String((r==null?void 0:r.account_reference)||(r==null?void 0:r.accountReference)||"KUCCPS-CLUSTER"),transaction_description:String((r==null?void 0:r.transaction_description)||(r==null?void 0:r.transactionDesc)||"Cluster payment")})});if(!t.ok)throw new Error(vn(t,"Unable to initiate STK push."));return Yn(t.data)},fr=async r=>{const i=String((r==null?void 0:r.email)||"").trim(),n=String(r==null?void 0:r.subject).trim(),t=String((r==null?void 0:r.message)||"");if(!i||!n||!t)throw new Error("Email, subject and message are required.");const s=new URLSearchParams({email:i,subject:n,message:t}).toString(),a=[{url:Tn.email,headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,subject:n,message:t})},{url:Tn.email,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s}],I=[],N=[];for(const T of a){const c=await gn(T);if(c.ok)return Yn(c.data);I.push(c.status),N.push(vn(c,`HTTP ${c.status}`))}const A=N.filter(Boolean).join(" | ");throw new Error(`Email API request failed. ${A||`Status codes: ${I.join(", ")}.`}`)},Vr=async({checkoutRequestId:r})=>{const i={checkoutRequestId:String(r||"").trim()};if(!i.checkoutRequestId)throw new Error("checkoutRequestId is required.");const n=await gn({url:Tn.darajaQuery,headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(n.ok)return Yn(n.data);throw new Error(vn(n,"Unable to fetch payment status."))},_n=r=>new Promise(i=>window.setTimeout(i,r)),Kr=async({checkoutRequestId:r,timeoutMs:i=3e5,intervalMs:n=3e3,onStatus:t})=>{var I;const s=Date.now();let a="";for(;Date.now()-s<=i;){let N;try{N=await Vr({checkoutRequestId:r})}catch(c){a=String((c==null?void 0:c.message)||"").trim()||a,t==null||t({status:"pending",transientError:!0,resultDesc:a||"Temporary payment status check issue."}),await _n(n);continue}t==null||t(N);const A=String((N==null?void 0:N.status)||"").trim().toLowerCase(),T=Number(((I=N==null?void 0:N.queryResponse)==null?void 0:I.ResultCode)??NaN);if(A==="success"||T===0)return N;if(A==="failed")throw new Error((N==null?void 0:N.resultDesc)||"Payment failed. Please try again.");await _n(n)}throw new Error(a?`Timed out while waiting for M-Pesa confirmation. Last status: ${a}`:"Timed out while waiting for M-Pesa confirmation.")},br=async({grades:r,checkoutRequestId:i,merchantRequestId:n})=>{const t={grades:r||{},checkoutRequestId:String(i||"").trim(),merchantRequestId:String(n||"").trim()};if(!t.checkoutRequestId&&!t.merchantRequestId)throw new Error("checkoutRequestId or merchantRequestId is required before calculation.");const s=await gn({url:Tn.calculateCluster,headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(s.ok)return Yn(s.data);throw new Error(vn(s,"Unable to calculate cluster points after payment."))},Lr=r=>r==="saved-session"?"Saved Session":r==="firebase-function"?"Firebase Function":"Local Cluster Engine",xr=r=>Number(r||0).toFixed(3).replace(/\.?0+$/,""),pr=(r,i)=>{const n=Object.entries(r||{}).map(([t,s])=>[t,Number(s)]).filter(([,t])=>Number.isFinite(t)&&t>0).sort((t,s)=>s[1]-t[1]).slice(0,i);return n.length?["Top cluster points:",...n.map(([t,s],a)=>`${a+1}. Cluster ${t}: ${xr(s)}`)]:[]},Gr=({code:r,results:i,medicineEligible:n})=>{const t=["Your KUCCPS cluster calculation is ready.","",`Access code: ${r}`];return i&&Object.keys(i).length>0&&t.push("",...pr(i,3)),typeof n=="boolean"&&t.push("",`Medicine eligibility: ${n?"Eligible":"Not eligible"}.`),t.push("","Use this code on the home page to open your saved cluster points and continue course selection."),t.join(`
`)},Fr=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,Hr=r=>Fr.test(String(r||"").trim()),Br=r=>{const i=String(r||"").replace(/\D/g,"");return i.length===10&&i.startsWith("0")?`254${i.slice(1)}`:i.length===9&&i.startsWith("7")?`254${i}`:i.length===12&&i.startsWith("254")?i:null},Wn=()=>Object.fromEntries(Object.keys(xn).map(r=>[r,""])),jr="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow",wr="mt-3 inline-flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",Pr="ui-select";function Dr({onCalculationReady:r,payableAmount:i,gradeOptions:n}){const t=On(),[s,a]=E.useState(Wn()),[I,N]=E.useState(Object.fromEntries(kn.map((R,M)=>[R.title,M===0]))),[A,T]=E.useState(!1),[c,d]=E.useState(""),[y,u]=E.useState(""),[x,O]=E.useState(""),[h,C]=E.useState(null),[f,v]=E.useState(""),[g,H]=E.useState(""),[B,Q]=E.useState(!1),[X,W]=E.useState(""),tn=(R,M)=>{a(m=>({...m,[R]:M}))},$=R=>xn[R]||R,P=()=>Object.entries(s).filter(([,R])=>R&&R!=="").map(([R])=>R),_=R=>{N(M=>{const m=Object.fromEntries(Object.keys(M).map(Y=>[Y,!1]));return m[R]=!M[R],m})},z=async R=>{R.preventDefault(),W(""),u(""),O("");const M=P();if(M.length<7){W("Select grades for at least 7 subjects across all groups to compute cluster points.");return}const m=Wn();M.forEach(p=>{m[p]=s[p]});const Y=String(g||"").trim();if(!Hr(Y)){W("Enter a valid email address.");return}C(m),v(Y),T(!0)},Z=async R=>{if(R.preventDefault(),u(""),O(""),!h){u("Please submit your grades and email first.");return}if(!f){u("Enter a valid email before continuing.");return}const M=Br(c);if(!M){u("Enter a valid M-Pesa phone number e.g. 0712345678 or 254712345678.");return}Q(!0);try{O("Sending the STK push to your phone...");const m=await Mr({amount:i,phone_number:M,phone:M,phoneNumber:M,"phone number":M}),Y=String((m==null?void 0:m.CheckoutRequestID)||(m==null?void 0:m.checkoutRequestId)||"").trim(),p=String((m==null?void 0:m.MerchantRequestID)||(m==null?void 0:m.merchantRequestId)||"").trim();if(!Y&&!p)throw new Error("STK push response did not include a payment reference.");O("STK push sent. Complete the payment on your phone. Waiting for confirmation...");const on=await Kr({checkoutRequestId:Y,merchantRequestId:p,onStatus:S=>{(S==null?void 0:S.status)==="pending"&&O("Waiting for M-Pesa confirmation. Complete the prompt on your phone to continue.")}});O("Payment confirmed. Calculating cluster points...");let U,V="";try{U=await br({grades:h,checkoutRequestId:Y,merchantRequestId:p})}catch(S){U=Yr(h),V=String((S==null?void 0:S.message)||"").trim()||"Backend calculation API was unavailable, so a local verified fallback was used."}const{session:G,storage:nn,warning:J}=await _e({email:f,phoneNumber:M,amountPaid:i,grades:h,results:U.results,medicineEligible:U.medicineEligible,paymentResponse:{initiation:m,confirmation:on}}),o=["Payment confirmed."];V&&o.push(`Cluster points calculated locally (${V}).`),nn==="local"?o.push(J||"Firebase save failed. Session was saved on this browser only, so code restore works only on this device."):o.push("Session saved to Firebase.");try{await fr({email:f,subject:"KUCCPS Cluster Calculator Results",message:Gr({code:G.code,results:U.results,medicineEligible:U.medicineEligible})}),o.push(`Results email sent to ${f}.`)}catch(S){const b=S instanceof Error?S.message:"";o.push(b?`Email delivery failed (${b}). Save this code: ${G.code}.`:`Email delivery failed. Save this code: ${G.code}.`)}r({grades:h,results:U.results,source:U.source,accessCode:G.code,sessionMessage:o.join(" ")}),T(!1),u(""),O(""),W(""),t("/results")}catch(m){const Y=m instanceof Error?m.message:"Payment or calculation failed.";u(Y),W(Y),O("")}finally{Q(!1)}};return e.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h1",{className:"text-2xl font-semibold tracking-tight",children:"Cluster Points Calculator"}),e.jsx("p",{className:"mt-2 text-sm text-slate-600",children:"Enter your grades and email, then start payment. Cluster points are only shown after the M-Pesa payment is confirmed."}),e.jsxs("p",{className:"mt-1 text-sm font-medium text-emerald-700",children:["Amount: KES ",i]}),e.jsxs("form",{onSubmit:z,className:"mt-6 space-y-6",children:[e.jsx(F,{tone:"danger",message:X}),e.jsx("div",{className:"grid gap-5 xl:grid-cols-2",children:kn.map(R=>e.jsxs("article",{className:jr,children:[e.jsx("div",{className:"flex items-start justify-between gap-3",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-semibold text-slate-900",children:R.title}),e.jsx("p",{className:"mt-1 text-xs text-slate-500",children:R.required?"Core group. Enter grades for all listed subjects.":"Optional group. Fill available subjects."})]})}),e.jsxs("button",{type:"button",onClick:()=>_(R.title),className:wr,children:[e.jsx("span",{children:I[R.title]?"Hide grade fields":"Show grade fields"}),e.jsx(ce,{className:`h-4 w-4 text-slate-500 transition-transform ${I[R.title]?"rotate-180":"rotate-0"}`})]}),I[R.title]?e.jsx("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:R.subjects.map(M=>e.jsxs("div",{children:[e.jsxs("label",{htmlFor:`${R.title}-${M}`,className:"mb-1 block text-sm font-medium text-slate-700",children:[$(M),R.required?e.jsx("span",{className:"text-rose-600",children:" *"}):null]}),e.jsxs("select",{id:`${R.title}-${M}`,value:s[M],onChange:m=>tn(M,m.target.value),required:R.required,className:Pr,children:[e.jsx("option",{value:"",children:"Select grade"}),n.map(m=>e.jsx("option",{value:m,children:m},m))]})]},M))}):null]},R.title))}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"mb-1 block text-sm font-medium text-slate-700",children:"Email Address (for access code)"}),e.jsx("input",{id:"email",type:"email",value:g,onChange:R=>H(R.target.value),placeholder:"you@example.com",required:!0,className:"ui-input"})]}),e.jsx("button",{type:"submit",disabled:B,className:"inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-700",children:B?"Processing...":"Calculate Cluster Points"})]}),A?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4",children:e.jsxs("div",{className:"w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900",children:"Enter M-Pesa Phone Number"}),e.jsxs("p",{className:"mt-1 text-sm text-slate-600",children:["We will send an STK push for KES ",i,". Your cluster points remain locked until the payment is confirmed."]}),e.jsxs("form",{onSubmit:Z,className:"mt-4 space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"dialog_phone_number",className:"mb-1 block text-sm font-medium text-slate-700",children:"M-Pesa Phone Number"}),e.jsx("input",{id:"dialog_phone_number",type:"tel",value:c,onChange:R=>d(R.target.value),placeholder:"0712345678",autoFocus:!0,required:!0,className:"ui-input"})]}),e.jsx(F,{tone:"info",message:x}),e.jsx(F,{tone:"danger",message:y}),e.jsxs("div",{className:"flex items-center justify-end gap-3",children:[e.jsx("button",{type:"button",onClick:()=>{B||(T(!1),u(""))},disabled:B,className:"inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:B,className:"inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-slate-800 enabled:hover:to-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400",children:B?"Processing...":"Send STK Push"})]})]})]})}):null]})}const Kn={A:12,"A-":11,"B+":10,B:9,"B-":8,"C+":7,C:6,"C-":5,"D+":4,D:3,"D-":2,E:1},kr={ENGLISH:"ENG",KISWAHILI:"KIS",MATHEMATICS:"MAT",MATH:"MAT",BIOLOGY:"BIO",CHEMISTRY:"CHE",PHYSICS:"PHY","GENERAL SCIENCE":"GSC",HISTORY:"HAG","HISTORY & GOVERNMENT":"HAG",GEOGRAPHY:"GEO",CRE:"CRE",IRE:"IRE",HRE:"HRE","COMPUTER STUDIES":"CMP",AGRICULTURE:"AGR","ART & DESIGN":"ARD","HOME SCIENCE":"HSC","BUSINESS STUDIES":"BST",FRENCH:"FRE",GERMAN:"GER",MUSIC:"MUS",ARABIC:"ARB"},Jr=(r,i)=>{const n=[];for(const[t,s]of Object.entries(i||{})){const a=String(s||"").trim().toUpperCase();if(!(a in Kn))continue;const I=String(t).split("/").map(c=>{const d=c.trim().toUpperCase();return kr[d]||d});let N=!1,A=null,T=null;for(const c of I){const d=(r[c]||"").toUpperCase();if(d){if((Kn[d]||0)>=Kn[a]){N=!0;break}A=c,T=d}}N||n.push({subject:t,required:a,studentSubject:A,studentGrade:T})}return{passed:n.length===0,failed:n}};function qr({results:r,grades:i,courseCatalog:n}){const[t]=Ne(),s=Number(t.get("cluster")||0),a=t.get("course")||"";if(!r||!i)return e.jsx(En,{to:"/",replace:!0});if(!s||!a)return e.jsx(En,{to:"/results",replace:!0});const N=(n[s]||[]).find(y=>y.name===a);if(!N)return e.jsx(En,{to:"/results",replace:!0});const A=Number(r[s]??r[String(s)]??0),T=Jr(i,N.requirements),c=[],d=y=>Number(y||0).toFixed(3).replace(/\.?0+$/,"");if(T.passed)for(const y of N.universities||[])A>=Number(y.cutoff)&&c.push(y);return e.jsxs("section",{className:"space-y-6",children:[e.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h1",{className:"text-2xl font-semibold tracking-tight",children:a}),e.jsxs("div",{className:"mt-3 flex flex-wrap gap-4 text-sm text-slate-700",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold text-slate-900",children:"Cluster:"})," ",s]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold text-slate-900",children:"Cluster Points:"})," ",A]})]})]}),T.passed?c.length?e.jsxs("article",{className:"rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm",children:[e.jsx("h2",{className:"text-lg font-semibold text-emerald-900",children:"Qualified Universities"}),e.jsxs("p",{className:"mt-1 text-sm text-slate-600",children:["You qualify for ",c.length," ",c.length===1?"university":"universities"," based on your cluster points."]}),e.jsx("div",{className:"mt-4 overflow-x-auto rounded-xl border border-emerald-100",children:e.jsxs("table",{className:"min-w-full divide-y divide-emerald-100 text-sm",children:[e.jsx("thead",{className:"bg-emerald-50 text-left text-emerald-900",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-2 font-semibold",children:"University"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Cutoff"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Your Points"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Margin"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Status"})]})}),e.jsx("tbody",{className:"divide-y divide-emerald-50 bg-white text-slate-700",children:c.slice().sort((y,u)=>Number(u.cutoff)-Number(y.cutoff)).map(y=>e.jsxs("tr",{className:"hover:bg-emerald-50/40",children:[e.jsx("td",{className:"px-3 py-2 font-medium text-slate-900",children:y.name}),e.jsx("td",{className:"px-3 py-2",children:d(y.cutoff)}),e.jsx("td",{className:"px-3 py-2",children:d(A)}),e.jsxs("td",{className:"px-3 py-2 text-emerald-700",children:["+",d(A-Number(y.cutoff))]}),e.jsx("td",{className:"px-3 py-2",children:e.jsx("span",{className:"rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800",children:"Qualified"})})]},`${y.name}-${y.cutoff}`))})]})})]}):e.jsxs("article",{className:"rounded-2xl border border-amber-200 bg-amber-50 p-5",children:[e.jsx("h2",{className:"text-lg font-semibold text-amber-900",children:"Not Qualified for Any University"}),e.jsx("p",{className:"mt-2 text-sm text-amber-900",children:"Based on your current cluster points, you do not qualify for any listed university for this course."})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("article",{className:"rounded-2xl border border-amber-200 bg-amber-50 p-5",children:[e.jsx("h2",{className:"text-lg font-semibold text-amber-900",children:"Not Qualified for Any University"}),e.jsx("p",{className:"mt-2 text-sm text-amber-900",children:"You do not meet subject requirements for this course, so you are not qualified for any listed university."})]}),e.jsxs("article",{className:"rounded-2xl border border-rose-200 bg-rose-50 p-5",children:[e.jsx("h2",{className:"text-lg font-semibold text-rose-900",children:"Subject Requirements Not Met"}),e.jsx("ul",{className:"mt-3 space-y-1 text-sm text-rose-900",children:T.failed.map(y=>e.jsxs("li",{children:[y.subject," required >= ",y.required,y.studentSubject?` (you had ${y.studentSubject}: ${y.studentGrade})`:" (subject not done)"]},`${y.subject}-${y.required}`))})]})]}),e.jsx("div",{children:e.jsx(ln,{to:"/results",className:"text-sm font-medium text-slate-700 hover:text-slate-900",children:"Back to Results"})})]})}function $r({onRestoreByCode:r,payableAmount:i}){const n=On(),[t,s]=E.useState(""),[a,I]=E.useState(""),[N,A]=E.useState(!1),T=async c=>{c.preventDefault(),I(""),A(!0);try{if(!await r(t)){I("Code not found. Confirm the code sent to your email.");return}n("/results")}catch(d){I(d.message||"Unable to load code.")}finally{A(!1)}};return e.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12",children:[e.jsx("h1",{className:"mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl",children:"Start a new calculation or continue with your access code"}),e.jsxs("p",{className:"mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg",children:["New users pay KES ",i,", then receive a unique code by email to reopen saved results later."]}),e.jsxs("div",{className:"mt-6 flex flex-row items-center gap-4",children:[e.jsx("div",{className:"mt-8",children:e.jsx(ln,{to:"/calculator",className:"inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-700",children:"Get Started"})}),e.jsxs("form",{onSubmit:T,className:"max-w-xl space-y-3 rounded-xl",children:[e.jsx("label",{htmlFor:"access_code",className:"block text-sm font-medium text-slate-700",children:"Have an access code? Paste it here"}),e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row",children:[e.jsx("input",{id:"access_code",type:"text",value:t,onChange:c=>s(c.target.value.toUpperCase()),placeholder:"e.g. 8F3KQ2P9",className:"ui-input",required:!0}),e.jsx("button",{type:"submit",disabled:N,className:"inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white transition enabled:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-400",children:N?"Opening...":"Open"})]}),e.jsx(F,{tone:"danger",message:a})]})]})]})}function _r({clusters:r,getScore:i,courseCatalog:n,selectedCourses:t,onSelectCourse:s,onCheckCourse:a}){return e.jsx("div",{className:"mt-6 overflow-x-auto rounded-xl border border-slate-200",children:e.jsxs("table",{className:"min-w-full divide-y divide-slate-200 text-sm",children:[e.jsx("thead",{className:"bg-slate-100 text-left text-slate-700",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Cluster"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Points"}),e.jsx("th",{className:"px-3 py-2 font-semibold",children:"Course Check"})]})}),e.jsx("tbody",{className:"divide-y divide-slate-100 bg-white text-slate-700",children:r.map(I=>{const N=n[I]||[];return e.jsxs("tr",{className:"align-top hover:bg-slate-50",children:[e.jsx("td",{className:"px-3 py-2 font-medium text-slate-900",children:I}),e.jsx("td",{className:"px-3 py-2",children:i(I)}),e.jsx("td",{className:"px-3 py-2",children:e.jsxs("div",{className:"flex flex-col gap-2 sm:flex-row",children:[e.jsxs("select",{value:t[I]||"",onChange:A=>s(I,A.target.value),className:"ui-select sm:max-w-sm",children:[e.jsx("option",{value:"",children:"Select Course"}),N.map(A=>e.jsx("option",{value:A.name,children:A.name},A.name))]}),e.jsx("button",{type:"button",disabled:!t[I],onClick:()=>a(I,t[I]),className:"inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400",children:"Check"})]})})]},I)})})]})})}function Wr({results:r,grades:i,source:n,courseCatalog:t,courseCatalogError:s,catalogLoading:a,accessCode:I,sessionMessage:N}){const A=On(),[T,c]=E.useState({});if(!r||!i)return e.jsx(En,{to:"/",replace:!0});const d=Array.from({length:20},(u,x)=>x+1),y=u=>Number(r[u]??r[String(u)]??0);return e.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsx("h1",{className:"text-2xl font-semibold tracking-tight",children:"All Cluster Points"}),e.jsx("p",{className:"mt-2 text-sm text-slate-600",children:"Select a course to evaluate your qualification details."}),e.jsxs("p",{className:"mt-1 text-xs font-medium text-slate-500",children:["Calculation source: ",Lr(n)]}),I?e.jsx(F,{className:"mt-3",tone:"success",message:`Access code: ${I}`}):null,e.jsx(F,{className:"mt-2",tone:"info",message:N}),a?e.jsx(F,{className:"mt-2",tone:"info",message:"Loading course catalog..."}):null,e.jsx(F,{className:"mt-2",tone:"danger",message:s}),e.jsx(_r,{clusters:d,getScore:y,courseCatalog:t,selectedCourses:T,onSelectCourse:(u,x)=>c(O=>({...O,[u]:x})),onCheckCourse:(u,x)=>A(`/course-result?cluster=${u}&course=${encodeURIComponent(x)}`)})]})}const zr=()=>Object.fromEntries(Object.keys(xn).map(r=>[r,""]));function Zr(){const r=zn(),[i,n]=E.useState(null),[t,s]=E.useState(null),[a,I]=E.useState("local-engine"),[N,A]=E.useState(""),[T,c]=E.useState(""),d=E.useMemo(()=>De(),[]),y=r.pathname.startsWith("/admin");E.useEffect(()=>{Xn().catch(()=>{})},[]);const{courseCatalog:u,catalogLoading:x,courseCatalogError:O,saveCatalog:h,saveSingleCourse:C}=lr({mode:y?"admin":"public"}),{adminUser:f,adminProfile:v,authLoading:g,authWorking:H,authError:B,isAdminAuthenticated:Q,login:X,loginWithGoogle:W,logout:tn,addRegularAdmin:$}=ve({enabled:y}),P=E.useCallback(async Y=>{const p=await We(Y);return!p||!p.results?null:(n(p.grades||zr()),s(p.results||null),I("saved-session"),A(p.code),c(p.createdAt?`Loaded ${p.storage==="local"?"local":"saved"} session from ${new Date(p.createdAt).toLocaleString()}.`:`Loaded ${p.storage==="local"?"local":"saved"} session.`),p)},[]),_=E.useCallback(async Y=>{await h(Y)},[h]),z=E.useCallback(async Y=>{await C(Y)},[C]),Z=E.useCallback(async(Y,p)=>await X(Y,p),[X]),R=E.useCallback(async()=>await W(),[W]),M=E.useCallback(async()=>{await tn()},[tn]),m=E.useCallback(Y=>g?e.jsx("section",{className:"mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",children:e.jsx(F,{tone:"info",message:"Checking admin authentication..."})}):Q?Y:e.jsx(En,{to:"/admin/login",replace:!0}),[g,Q]);return e.jsx(Se,{children:e.jsxs(Ue,{children:[e.jsx(sn,{path:"/",element:e.jsx($r,{onRestoreByCode:P,payableAmount:Pn})}),e.jsx(sn,{path:"/admin/login",element:e.jsx(cr,{isAuthenticated:Q,onLogin:Z,onGoogleLogin:R,authError:B,isLoading:H||g})}),e.jsx(sn,{path:"/admin",element:m(e.jsx(Rr,{firebaseConfigured:d,onUploadCatalog:_,onAddSingleCourse:z,onLogout:M,onAddRegularAdmin:$,adminProfile:v,adminEmail:(f==null?void 0:f.email)||"",authError:B,courseCatalog:u}))}),e.jsx(sn,{path:"/admin/sessions",element:m(e.jsx(gr,{firebaseConfigured:d}))}),e.jsx(sn,{path:"/calculator",element:e.jsx(Dr,{gradeOptions:Re,payableAmount:Pn,onCalculationReady:({grades:Y,results:p,source:on,accessCode:U,sessionMessage:V})=>{n(Y),s(p),I(on),A(U||""),c(V||"")}})}),e.jsx(sn,{path:"/payment",element:e.jsx(En,{to:"/calculator",replace:!0})}),e.jsx(sn,{path:"/results",element:e.jsx(Wr,{results:t,grades:i,source:a,courseCatalog:u,courseCatalogError:O,catalogLoading:x,accessCode:N,sessionMessage:T})}),e.jsx(sn,{path:"/course-result",element:e.jsx(qr,{results:t,grades:i,courseCatalog:u})}),e.jsx(sn,{path:"*",element:e.jsx(En,{to:"/",replace:!0})})]})})}Ae.createRoot(document.getElementById("root")).render(e.jsx(Te.StrictMode,{children:e.jsx(ye,{children:e.jsx(Zr,{})})}));
