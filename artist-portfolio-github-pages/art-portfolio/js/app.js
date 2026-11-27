const categories = [
  ["all","전체","All"],["commission","커미션","Commission"],["commercial","외주","Commercial"],
  ["personal","개인작","Personal"],["thumbnail","썸네일","Thumbnail"],["fanart","2차 창작","Fan art"],["others","기타","Others"]
];
const copy = {
 ko:{navWork:"WORK",navAbout:"ABOUT",navContact:"CONTACT",heroKicker:"ILLUSTRATION & VISUAL ART",heroTitle:"이미지로 기록하는<br><em>작은 세계.</em>",heroDesc:"일러스트와 다양한 시각 작업을 모아둔 포트폴리오입니다. 마음에 머무는 장면과 이야기를 만듭니다.",workTitle:"Selected works",workDesc:"카테고리를 선택해 작업물을 둘러보세요.",aboutTitle:"그림으로 생각하고,<br><em>이야기로 표현합니다.</em>",aboutText:"캐릭터와 장면, 색과 형태에 관심을 두고 다양한 시각 작업을 이어가고 있습니다. 이곳은 작업의 기록이자 새로운 가능성을 모아두는 공간입니다.",aboutLink:"함께 작업하기 ↗",contactTitle:"좋은 이야기를<br>함께 만들어요.",contactText:"외주 및 협업 문의는 아래 채널로 연락해 주세요.",empty:"아직 등록된 작품이 없습니다.",all:"전체"},
 en:{navWork:"WORK",navAbout:"ABOUT",navContact:"CONTACT",heroKicker:"ILLUSTRATION & VISUAL ART",heroTitle:"A small world,<br><em>captured in images.</em>",heroDesc:"A collection of illustrations and visual experiments. Creating scenes and stories that stay with you.",workTitle:"Selected works",workDesc:"Choose a category to explore the archive.",aboutTitle:"Thinking through images,<br><em>speaking through stories.</em>",aboutText:"Exploring characters, scenes, colors and forms through visual work. This space is both an archive and a place for new possibilities.",aboutLink:"Let's work together ↗",contactTitle:"Let's make<br>something meaningful.",contactText:"For commissions and collaborations, get in touch.",empty:"No artworks have been added yet.",all:"All"}
};
let lang = localStorage.getItem("portfolio-lang") || "ko";
let active = "all", artworks = [];
const $ = s => document.querySelector(s);
function applyLanguage(){
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.innerHTML=copy[lang][key]});
 $("#langToggle").textContent=lang==="ko"?"EN":"KO";
 renderFilters(); renderGallery();
}
function renderFilters(){
 $("#filters").innerHTML=categories.map(([id,ko,en])=>`<button class="filter-chip ${active===id?"active":""}" data-category="${id}">${lang==="ko"?ko:en}</button>`).join("");
 $("#filters").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{active=b.dataset.category;renderFilters();renderGallery()}));
}
function renderGallery(){
 const items=artworks.filter(a=>active==="all"||a.category===active);
 $("#galleryCount").textContent=`${String(items.length).padStart(2,"0")} ${lang==="ko"?"작품":"WORKS"}`;
 if(!items.length){$("#gallery").innerHTML=`<div class="empty-state">${copy[lang].empty}<br><a href="admin.html">ADMIN에서 작품 추가하기 ↗</a></div>`;return;}
 $("#gallery").innerHTML=items.map((a,i)=>`<article class="art-card" data-id="${a.id}" tabindex="0"><div class="art-image"><img src="${a.image}" alt="${esc(a.title?.[lang]||a.title?.ko||"Artwork")}" loading="lazy"><span class="art-index">${String(i+1).padStart(2,"0")}</span><span class="art-open">↗</span></div><div class="art-caption"><div><h3>${esc(a.title?.[lang]||a.title?.ko||"Untitled")}</h3><p>${esc(categoryName(a.category))}</p></div><span>${esc(a.date||"")}</span></div></article>`).join("");
 $("#gallery").querySelectorAll(".art-card").forEach(card=>{const open=()=>showModal(artworks.find(a=>a.id===card.dataset.id));card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==="Enter")open()})});
}
function categoryName(id){const c=categories.find(x=>x[0]===id);return c?(lang==="ko"?c[1]:c[2]):id}
function showModal(a){if(!a)return;$("#modalImage").src=a.image;$("#modalImage").alt=a.title?.[lang]||a.title?.ko||"";$("#modalCategory").textContent=categoryName(a.category);$("#modalTitle").textContent=a.title?.[lang]||a.title?.ko||"Untitled";$("#modalDescription").textContent=a.description?.[lang]||a.description?.ko||"";$("#modalMeta").textContent=[a.date,a.tools].filter(Boolean).join(" · ");$("#artModal").classList.add("open");$("#artModal").setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
function closeModal(){$("#artModal").classList.remove("open");$("#artModal").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#langToggle").addEventListener("click",()=>{lang=lang==="ko"?"en":"ko";localStorage.setItem("portfolio-lang",lang);applyLanguage()});
$("#modalClose").addEventListener("click",closeModal);$("#artModal").addEventListener("click",e=>{if(e.target.id==="artModal")closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#year").textContent=new Date().getFullYear();
fetch("data/artworks.json").then(r=>r.ok?r.json():{artworks:[]}).then(d=>{artworks=Array.isArray(d)?d:(d.artworks||[]);applyLanguage()}).catch(()=>{artworks=[];applyLanguage()});
