const $=s=>document.querySelector(s);
const cats=["commission","commercial","personal","thumbnail","fanart","others"];
let works=[],connected=false,editing=null;
const tokenKey="portfolio-gh-token";
const storedToken=sessionStorage.getItem(tokenKey);
if(storedToken)$("#ghToken").value=storedToken;
function readForm(){return {id:editing||("art-"+Date.now()),title:{ko:$("#titleKo").value.trim(),en:$("#titleEn").value.trim()},category:$("#category").value,date:$("#date").value.trim(),description:{ko:$("#descriptionKo").value.trim(),en:$("#descriptionEn").value.trim()},tools:$("#tools").value.trim()}}
function render(){
 $("#artCount").textContent=`${works.length} WORKS`;
 $("#adminList").innerHTML=works.length?works.map(a=>`<div class="admin-item"><img src="${a.image||""}" alt=""><div class="admin-item-info"><strong>${escapeHtml(a.title?.ko||"Untitled")}</strong><span>${a.category} · ${escapeHtml(a.date||"")}</span></div><button data-edit="${a.id}" class="mini-button">수정</button><button data-delete="${a.id}" class="mini-button danger">삭제</button></div>`).join(""):'<p class="muted">작품 데이터가 아직 없습니다.</p>';
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editWork(b.dataset.edit));
 document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteWork(b.dataset.delete));
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function editWork(id){const a=works.find(x=>x.id===id);if(!a)return;editing=id;$("#titleKo").value=a.title?.ko||"";$("#titleEn").value=a.title?.en||"";$("#category").value=a.category;$("#date").value=a.date||"";$("#descriptionKo").value=a.description?.ko||"";$("#descriptionEn").value=a.description?.en||"";$("#tools").value=a.tools||"";$("#formHeading").textContent="작품 수정";$("#saveButton").textContent="변경사항 저장";$("#cancelEdit").hidden=false;window.scrollTo({top:0,behavior:"smooth"})}
function resetForm(){$("#artForm").reset();editing=null;$("#artId").value="";$("#formHeading").textContent="새 작품 등록";$("#saveButton").textContent="작품 저장";$("#cancelEdit").hidden=true}
$("#cancelEdit").onclick=resetForm;
function fileToBase64(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(",")[1]);r.onerror=reject;r.readAsDataURL(file)})}
async function ghRequest(path,opts={}){const owner=$("#ghOwner").value.trim(),repo=$("#ghRepo").value.trim(),branch=$("#ghBranch").value.trim()||"main";const url=`https://api.github.com/repos/${owner}/${repo}/contents/${path}`;const res=await fetch(url,{...opts,headers:{"Accept":"application/vnd.github+json","Authorization":`Bearer ${sessionStorage.getItem(tokenKey)}`,"X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json",...(opts.headers||{})}});if(!res.ok){const e=await res.json().catch(()=>({message:res.statusText}));throw new Error(e.message||"GitHub API error")}return res.json()}
async function getFile(path){try{return await ghRequest(path)}catch(e){if(String(e.message).includes("Not Found"))return null;throw e}}
async function putFile(path,content,message,sha){const body={message,content,branch:$("#ghBranch").value.trim()||"main"};if(sha)body.sha=sha;return ghRequest(path,{method:"PUT",body:JSON.stringify(body)})}
async function loadRemote(){const f=await getFile("data/artworks.json");if(!f){works=[];return}const decoded=decodeURIComponent(escape(atob(f.content.replace(/\n/g,""))));const data=JSON.parse(decoded);works=Array.isArray(data)?data:(data.artworks||[]);render()}
$("#githubForm").onsubmit=async e=>{e.preventDefault();const t=$("#ghToken").value.trim();if(!t)return;sessionStorage.setItem(tokenKey,t);$("#connectionStatus").textContent="연결 확인 중…";try{await loadRemote();connected=true;$("#connectionStatus").textContent="✓ GitHub 저장소 연결됨 — "+$("#ghOwner").value+"/"+$("#ghRepo").value;$("#connectionStatus").classList.add("connected")}catch(err){connected=false;$("#connectionStatus").textContent="연결 실패: "+err.message;$("#connectionStatus").classList.remove("connected");sessionStorage.removeItem(tokenKey)}};
$("#disconnect").onclick=()=>{sessionStorage.removeItem(tokenKey);$("#ghToken").value="";connected=false;$("#connectionStatus").textContent="연결 해제됨";$("#connectionStatus").classList.remove("connected")};
async function saveRemote(imageFile,art){
 if(imageFile){const ext=(imageFile.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");const path=`images/${art.category}/${art.id}.${ext}`;const existing=await getFile(path);await putFile(path,await fileToBase64(imageFile),`Add artwork image: ${art.id}`,existing?.sha);art.image=path}
 const f=await getFile("data/artworks.json");const payload=btoa(unescape(encodeURIComponent(JSON.stringify({artworks:works},null,2))));await putFile("data/artworks.json",payload,"Update portfolio artworks",f?.sha);
}
$("#artForm").onsubmit=async e=>{e.preventDefault();const file=$("#imageFile").files[0];if(!editing&&!file){alert("새 작품에는 이미지 파일이 필요합니다.");return}
 const old=works.find(a=>a.id===editing);const art=readForm();if(old)art.image=old.image;
 if(file){const preview=URL.createObjectURL(file);art.image=preview}
 const idx=works.findIndex(a=>a.id===art.id);if(idx>=0)works[idx]=art;else works.unshift(art);render();
 if(connected){$("#saveButton").disabled=true;$("#saveButton").textContent="GitHub에 저장 중…";try{await saveRemote(file,art);alert("GitHub에 저장했습니다. Pages 반영까지 잠시 기다려 주세요.");}catch(err){alert("GitHub 저장 실패: "+err.message+"\n브랜치, 저장소 권한, 토큰 설정을 확인하세요.");works=works.filter(a=>a.id!==art.id);if(old)works.unshift(old);render()}finally{$("#saveButton").disabled=false;$("#saveButton").textContent="작품 저장"}}
 else{alert("브라우저 임시 목록에 반영했습니다. 공개 사이트에 반영하려면 GitHub 저장소에 연결하세요.");}
 resetForm();render();
};
async function deleteWork(id){const a=works.find(x=>x.id===id);if(!a||!confirm("이 작품을 목록에서 삭제할까요?"))return;const backup=[...works];works=works.filter(x=>x.id!==id);render();if(connected){try{const f=await getFile("data/artworks.json");await putFile("data/artworks.json",btoa(unescape(encodeURIComponent(JSON.stringify({artworks:works},null,2)))),"Delete artwork: "+id,f?.sha);alert("작품 데이터에서 삭제했습니다. 이미지 파일은 저장소에 남아 있으니 필요하면 직접 삭제하세요.")}catch(e){works=backup;render();alert("삭제 실패: "+e.message)}}}
$("#exportJson").onclick=()=>{const blob=new Blob([JSON.stringify({artworks:works},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="artworks.json";a.click();URL.revokeObjectURL(a.href)};
render();
