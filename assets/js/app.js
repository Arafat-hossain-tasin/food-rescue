const API_URL = ""; // Configure your own backend in api.js; front-end package is not production authentication.

let S = null, lang = "bn", tick, FOODS = [], CAT = "", Q = "";
try { S = JSON.parse(sessionStorage.getItem("s")); lang = localStorage.getItem("lang") || "bn"; } catch (e) {}
const $ = s => document.querySelector(s), v = id => $("#" + id).value, sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const act = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, 1); } };
function toast(m, bad) { const t = $("#toast"); t.textContent = m; t.className = "show" + (bad ? " bad" : ""); setTimeout(() => t.className = "", 3000); }
const TR = {"Home":"হোম","Dashboard":"ড্যাশবোর্ড","Login":"লগইন","Register":"নিবন্ধন","Log out":"লগআউট","How it works":"কীভাবে কাজ করে","Get Started":"শুরু করুন",
"Together for a Hunger-Free World":"ক্ষুধামুক্ত বাংলাদেশের পথে, একসাথে","Reduce food waste. Feed the needy.":"খাবারের অপচয় কমান, অভাবীর পাশে দাঁড়ান।",
"Restaurants, hotels and homes list surplus food. Verified NGOs claim it before it expires.":"রেস্তোরাঁ, হোটেল ও বাসার বাড়তি খাবার তালিকাভুক্ত করুন। যাচাইকৃত এনজিও নষ্ট হওয়ার আগেই তা সংগ্রহ করবে।",
"Donor":"দাতা","NGO":"এনজিও","Admin":"অ্যাডমিন","Add Donation":"খাবার দান করুন","My Donations":"আমার দান","Handovers":"হস্তান্তর","My Requests":"আমার অনুরোধ","Matching":"ম্যাচিং",
"All Requests":"সব অনুরোধ","Users & NGOs":"ব্যবহারকারী ও এনজিও","Donor Dashboard":"দাতার ড্যাশবোর্ড","NGO Portal":"এনজিও পোর্টাল","Admin Dashboard":"অ্যাডমিন ড্যাশবোর্ড",
"Share surplus food, make an impact":"বাড়তি খাবার দিন, পরিবর্তন আনুন","Find food, help your community":"খাবার খুঁজুন, সমাজের পাশে দাঁড়ান","Monitor & manage the system":"পুরো সিস্টেম দেখুন ও পরিচালনা করুন",
"Request Now":"অনুরোধ করুন","Available Food":"উপলব্ধ খাবার","Search":"খুঁজুন","Run Matching":"ম্যাচিং চালান","Generate Report":"রিপোর্ট তৈরি করুন","Username":"ইউজারনেম","Password":"পাসওয়ার্ড","Handed over":"হস্তান্তর হয়েছে","View All":"সব দেখুন"};
const t = s => (lang == "bn" && TR[s]) || s;
const setLang = l => { lang = l; try { localStorage.setItem("lang", l); } catch (e) {} render(); };

/* ---------- icons + food art ---------- */
const P = {leaf:"M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8",home:"M3 11l9-8 9 8M5 10v10h14V10",plus:"M12 5v14M5 12h14",list:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
user:"M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",search:"M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5",send:"M22 2L11 13M22 2l-7 20-4-9-9-4z",clock:"M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
sync:"M20 11a8 8 0 00-14-4L4 9M4 4v5h5M4 13a8 8 0 0014 4l2-2M20 20v-5h-5",file:"M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",out:"M9 21H5V3h4M16 17l5-5-5-5M21 12H9",check:"M5 12l5 5 9-10",
box:"M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",users:"M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 4a4 4 0 010 7M22 21c0-3-2-5-4-5.5",lock:"M6 11h12v10H6zM8 11V7a4 4 0 018 0v4",pin:"M12 21s7-6 7-11a7 7 0 00-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",id:"M3 5h18v14H3zM7 10h4M7 14h6M16 11a2 2 0 100-.1"};
const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const ART = {r:'<ellipse cx="32" cy="44" rx="24" ry="6" fill="#e3d6b8"/><path d="M8 38a24 16 0 0048 0z" fill="#fff" stroke="#c9b48a" stroke-width="2"/><path d="M15 37c3-16 31-16 34 0z" fill="#f7f1e2"/><circle cx="26" cy="29" r="1.5" fill="#d8cba8"/><circle cx="36" cy="27" r="1.5" fill="#d8cba8"/>',
b:'<path d="M8 42c-4-15 7-24 24-24s28 9 24 24c0 4-4 6-8 6H16c-4 0-8-2-8-6z" fill="#d99a52"/><path d="M22 28l4 9M32 26l4 10M42 28l4 9" stroke="#b46f2a" stroke-width="3" stroke-linecap="round"/>',
v:'<circle cx="23" cy="40" r="13" fill="#e5483a"/><path d="M17 29c3-5 10-5 12 0" stroke="#2f8f4a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M33 48c0-15 9-24 22-24 0 13-9 24-22 24z" fill="#43a35a"/><path d="M36 45l12-14" stroke="#2a7a40" stroke-width="2"/>',
x:'<path d="M7 24l25-13 25 13v23L32 60 7 47z" fill="#cf9d5f"/><path d="M7 24l25 13 25-13M32 37v23" stroke="#9a6d36" stroke-width="2" fill="none"/><path d="M26 17l25 13" stroke="#e9d3a8" stroke-width="5"/>'};
const art = c => { c=(c||"").toLowerCase(); const k=/rice|bhat|polao|pulao|biryani|khichuri|khichri|chal/.test(c)?"rice":/bread|ruti|roti|paur|bun|cake/.test(c)?"bread":/veg|sabji|shobji|fruit|tomato|potato|alu|begun/.test(c)?"produce":"box";return `<img src="assets/illustrations/food-${k}.svg" alt="" loading="lazy">`; };

/* ---------- animated Bangladesh scene: sharing a meal, rickshaw delivery, Dhaka skyline, paddy fields ---------- */
const wv = (y, a, c, k) => `<g class="${k}"><path fill="${c}" d="M0,${y}${`q120,-${a} 240,0 t240,0 `.repeat(6)}V820H0z"/></g>`;
const palm = (x, h, d) => `<g class="sway" style="animation-delay:${d}s"><path d="M${x},700q16-${h / 2} -4-${h}" stroke="#5a4630" stroke-width="9" fill="none" stroke-linecap="round"/><g stroke="#2b7a3d" stroke-width="5" fill="none" stroke-linecap="round" transform="translate(${x - 4},${700 - h})"><path d="M0 0q-40-30-80-6M0 0q-30-44-62-40M0 0q10-50 44-52M0 0q40-26 78-6M0 0q-14 20-54 30"/></g></g>`;
const city = () => { let x = -10, i = 0, o = ""; const H = [90, 140, 70, 170, 110, 200, 80, 150, 120, 95, 180, 75, 130, 160, 100];
  while (x < 1440) { const h = H[i % H.length], w = 46 + (i * 13) % 34, y = 480 - h;
    o += `<g opacity=".58"><rect x="${x}" y="${y}" width="${w}" height="${h + 66}" rx="2" fill="${i % 3 ? '#78a88d' : '#8ebba0'}"/><rect x="${x + 8}" y="${y + 12}" width="${w - 16}" height="4" fill="#d5ebcd" opacity=".55"/>${Array.from({length:Math.min(5,Math.floor(h / 30))},(_,j)=>`<rect x="${x+10}" y="${y+25+j*27}" width="8" height="13" rx="1" fill="#d9f0d8" opacity=".8"/><rect x="${x+28}" y="${y+25+j*27}" width="8" height="13" rx="1" fill="#d9f0d8" opacity=".65"/>`).join('')}</g>`;
    x += w + 5; i++; } return o; };
const wheel = cx => `<g class="wh"><circle cx="${cx}" cy="-20" r="20" fill="none" stroke="#1d2420" stroke-width="4"/><path d="M${cx} -38V-2M${cx - 18} -20H${cx + 18}M${cx - 13} -33L${cx + 13} -7M${cx + 13} -33L${cx - 13} -7" stroke="#5b6660" stroke-width="1.5"/></g>`;
const rickshaw = () => `<g class="rick"><g class="rb">${wheel(40)}${wheel(150)}
  <path d="M-4 -34h98v8H-4z" fill="#e8452c"/><path d="M-6 -74q52-48 104 0z" fill="#f3b61f" stroke="#0f3a24" stroke-width="2"/><path d="M6 -70q44-36 80 0" stroke="#e8452c" stroke-width="3" fill="none" stroke-dasharray="6 5"/>
  <rect x="10" y="-52" width="32" height="9" rx="4" fill="#cfd6dc"/><rect x="10" y="-43" width="32" height="9" rx="4" fill="#bfc8cf"/><rect x="10" y="-61" width="32" height="9" rx="4" fill="#dde3e8"/><path d="M18 -61q8-10 16 0" stroke="#59646c" stroke-width="2.5" fill="none"/>
  <rect x="52" y="-52" width="32" height="18" rx="5" fill="#2f9e57"/><path d="M68 -40s-8-5-8-9a4 4 0 018-1 4 4 0 018 1c0 4-8 9-8 9z" fill="#fff"/>
  <path d="M94 -34h50l6 14M144 -34l4-30" stroke="#2a2f2c" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M112 -50l9-26" stroke="#14532d" stroke-width="9" stroke-linecap="round"/><circle cx="123" cy="-85" r="8" fill="#6b4428"/><path d="M121 -72L146 -62M112 -50l17 16-5 12" stroke="#14532d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`;
const share = () => `<g transform="translate(540 596) scale(1.12)"><ellipse cx="150" cy="128" rx="150" ry="8" fill="#0f3a24" opacity=".25"/>
  <path d="M82 62Q112 70 130 64" stroke="#7a4b2a" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M16 126V80q0-30 30-30t30 30v46z" fill="#1f7a3f"/><circle cx="46" cy="30" r="17" fill="#7a4b2a"/><path d="M29 27q17-22 34 0q-8-7-17-7t-17 7z" fill="#17120d"/>
  <path d="M218 66Q188 72 172 64" stroke="#8a5a3a" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M214 126V84q0-30 30-30t30 30v42z" fill="#e0a100"/><circle cx="244" cy="34" r="16" fill="#8a5a3a"/><path d="M228 31q16-21 32 0q-8-7-16-7t-16 7z" fill="#17120d"/>
  <g class="give"><path d="M126 60h48c0 16-10 26-24 26s-24-10-24-26z" fill="#fff" stroke="#c9b48a" stroke-width="2"/><path d="M130 60q20-24 40 0z" fill="#fffdf6" stroke="#e3d6b8"/>
  <g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"><path class="steam" d="M140 46q-5-8 0-14"/><path class="steam" style="animation-delay:.8s" d="M150 44q-5-8 0-14"/><path class="steam" style="animation-delay:1.6s" d="M160 46q-5-8 0-14"/></g></g>
  <path class="heart" d="M150 22s-14-8-14-17a7.5 7.5 0 0114-3 7.5 7.5 0 0114 3c0 9-14 17-14 17z" fill="#e8452c"/></g>`;
const scene = () => `<svg class="scene" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf5de"/><stop offset=".5" stop-color="#e4efdb"/><stop offset="1" stop-color="#add4ac"/></linearGradient>
<radialGradient id="gl"><stop offset="0" stop-color="#ff6a3d" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a3d" stop-opacity="0"/></radialGradient>
<symbol id="sb" viewBox="0 0 32 32"><path d="M3 15h26c0 8-5 13-13 13S3 23 3 15z" fill="#fff" stroke="#1f7a3f" stroke-width="1.6"/><path d="M7 15q9-12 18 0z" fill="#fffdf6" stroke="#1f7a3f" stroke-width="1.2"/></symbol>
<symbol id="sh" viewBox="0 0 32 32"><path d="M16 28S3 20 3 11a6.5 6.5 0 0113-2 6.5 6.5 0 0113 2c0 9-13 17-13 17z" fill="#e8452c"/></symbol>
<symbol id="sr" viewBox="0 0 32 32"><path d="M4 21c-2-8 4-14 12-14s14 6 12 14c0 2-2 3-4 3H8c-2 0-4-1-4-3z" fill="#f3c27a" stroke="#b9792d" stroke-width="1.4"/><path d="M11 12l3 6M17 11l3 7" stroke="#b9792d" stroke-width="1.6" stroke-linecap="round"/></symbol></defs>
<rect width="1440" height="820" fill="url(#sky)"/><circle class="glow" cx="1030" cy="180" r="210" fill="url(#gl)"/><circle cx="1030" cy="180" r="52" fill="#f6c879" opacity=".85"/>
${[[110, 0], [190, -16]].map(([y, d]) => `<g class="bird" style="--y:${y}px;--s:${d}s"><path d="M0 0q9-11 18 0q9-11 18 0" stroke="#27583a" stroke-width="2.5" fill="none"/></g>`).join("")}
${city()}${wv(470, 14, "#a6d49c", "w1")}${wv(600, 24, "#55b165", "w2")}${palm(150, 190, 0)}${palm(1250, 200, 1.2)}${wv(690, 30, "#2f8f4a", "w3")}${share()}${wv(755, 30, "#1f6b3a", "w4")}
<rect y="774" width="1440" height="60" fill="#3a3f3b"/><path d="M0 800H1440" stroke="#f3e7a8" stroke-width="3" stroke-dasharray="40 30"/>${rickshaw()}
${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 76} 765q-7-22-2-34m2 34q5-22 14-29" fill="none" stroke="#c4da82" stroke-width="2.5" opacity=".65"/>`).join("")}</svg>`;

/* ---------- helpers ---------- */
const left = ms => { const s = Math.max(0, Math.floor(ms / 1000)), p = n => String(n).padStart(2, "0"); return `${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`; };
const R = () => location.hash.replace(/^#\/?/, "");
const go = r => { if (R() == r) render(); else location.hash = "#/" + r; };
const bd = s => `<span class="bd ${s}">${s}</span>`;
const tbl = (h, rows) => rows.length ? `<div class="wrap"><table><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>` : `<div class="empty">Nothing here yet.</div>`;
const head = (title, sub, right = "") => `<div class="head"><div><h1>${t(title)}</h1><p>${t(sub)}</p></div>${right}</div>`;
const st = (i, c, n, l) => `<div class="st"><span class="ico ${c}">${ic(i, 26)}</span><div><b data-n="${n}">${n}</b><small>${t(l)}</small></div></div>`;
const fld = (id, label, type, icon) => `<div class="f kd-field"><input id="${id}" type="${type}" placeholder=" " autocomplete="${id=="lu"||id=="ru"?"username":type=="password"?(id=="rp"?"new-password":"current-password"):id=="ph"?"tel":id=="rname"?"name":"off"}" ${["lu","lp","rname","ru","rp","ph"].includes(id)?"required":""}><label for="${id}">${label}</label><img class="field-icon" src="assets/icons/${icon==='user'?'user':icon==='lock'?'lock':icon==='pin'?'pin':icon==='id'?'id':'user'}.svg" alt="">${type==="password"?`<button type="button" class="eye-toggle" aria-label="Show password" aria-pressed="false" onclick="togglePassword(this,'${id}')"><img src="assets/icons/eye.svg" alt=""></button>`:""}</div>`;
const donut = (p, l, a, b) => `<div class="dnr"><div class="dn" style="--p:${p}" data-l="${p}%"></div><div><b>${l}</b><small>${a}: ${p}%</small><small>${b}: ${100 - p}%</small></div></div>`;
const donTable = (l, full) => tbl(["Food", "Left", "Urgency", "Status", ""].slice(0, full ? 5 : 4), l.map(d => [esc(d.name), `${d.quantity} of ${d.originalQty} ${esc(d.unit)}`, bd(d.urgency), d.status].concat(full ? [`<button class="soft" onclick="editDon(${d.id},${d.quantity})">Edit</button> <button class="warn" onclick="delDon(${d.id})">Delete</button>`] : [])));
const reqRows = (reqs, extra) => reqs.map(r => [r.id, esc(r.ngoName || r.ngo), esc(r.category), r.quantity, bd(r.status), esc(r.matchedFood || "—")].concat(extra ? [extra(r)] : []));

/* ---------- pages ---------- */
P.truck = "M2 6h12v10H2zM14 10h4l4 3v3h-8zM6 19a2 2 0 100-.1M18 19a2 2 0 100-.1";
Object.assign(TR, {"Delivery jobs":"ডেলিভারি কাজ","My Orders":"আমার অর্ডার","My deliveries":"আমার ডেলিভারি"});
const RECV = [["dash","Dashboard","home"],["mine","My Orders","list"]];
const MENU = {DONOR:[["dash","Dashboard","home"],["add","Add Donation","plus"],["mine","My Donations","box"],["hand","Handovers","check"]], NGO:RECV, INDIVIDUAL:RECV,
  RIDER:[["dash","Delivery jobs","truck"],["mine","My deliveries","list"]], ADMIN:[["dash","Dashboard","home"],["match","Matching","sync"],["reqs","All Requests","send"],["users","Users & NGOs","users"]]};
Object.assign(TR, {"About us":"আমাদের সম্পর্কে","Our team":"আমাদের টিম","Our motive":"আমাদের লক্ষ্য","Join now":"যোগ দিন","No good food should be thrown away while someone goes to bed hungry.":"কেউ না খেয়ে ঘুমাতে গেলে ভালো খাবার ফেলে দেওয়া উচিত নয়।"});
const logo = (s = 32) => `<img class="kd-brandmark" src="assets/brand/mark.svg" width="${s}" height="${s}" alt="">`;
const nav = r => `<div class="nb"><a class="brand" href="#/">${logo(32)}খাও <span class="rs">দাও</span></a>
  <nav>${S ? `<a href="#/dash" class="${r != "about" && r != "team" ? "on" : ""}">${t("Dashboard")}</a>` : `<a href="#/" class="${r ? "" : "on"}">${t("Home")}</a><a href="#/" onclick="toHow();return false">${t("How it works")}</a>`}<a href="#/about" class="${r == "about" ? "on" : ""}">${t("About us")}</a><a href="#/team" class="${r == "team" ? "on" : ""}">${t("Our team")}</a></nav>
  <div class="nr"><button class="lang" onclick="setLang('${lang == "bn" ? "en" : "bn"}')">${lang == "bn" ? "English" : "বাংলা"}</button>${S ? `<button class="soft" onclick="logout()">${ic("out", 18)}${t("Log out")}</button>` : `<button onclick="go('login')">${ic("user", 18)}${t("Login")}</button>`}</div></div>`;
const toHow = () => { const f = () => { const e = document.getElementById("how"); if (e) e.scrollIntoView({ behavior: "smooth" }); }; if (R() == "") f(); else { go(""); setTimeout(f, 300); } };
const foot = () => `<footer><div class="brand">${logo(28)}খাও <span class="rs">দাও</span></div><div class="flinks"><a href="#/">${t("Home")}</a><a href="#/about">${t("About us")}</a><a href="#/team">${t("Our team")}</a>${S ? "" : `<a href="#/login">${t("Login")}</a>`}</div><span class="foot-t">© ${new Date().getFullYear()} খাও দাও · ${b("Built with care in Bangladesh", "বাংলাদেশে ভালোবাসা দিয়ে তৈরি")}</span></footer>`;
let HOW = "DONOR";
const HOWS = {
 DONOR: [["user", "Create a free account", "Sign up as a donor in a minute. Restaurants, hotels, wedding halls and homes are all welcome."], ["plus", "List your surplus food", "Add what you have, how much, how many hours it stays good, and pin the pickup spot on the map. Tick the box if you will pay the delivery fee."], ["check", "A checked receiver orders", "Only NGOs and families approved by our admins can order. The food is reserved for them straight away."], ["truck", "Hand it over", "They collect it, or a rider picks it up. You can watch the delivery on the map until it is done."]],
 RECEIVER: [["id", "Register with proof", "NGOs give a registration number. Families upload a photo or video that shows their situation."], ["check", "Admins check and approve", "A real person reviews every request before you can order."], ["box", "Browse and order", "See the food available, choose pickup or delivery, and drop a pin where it should be brought."], ["pin", "Track it live", "Follow the rider on the map until the food reaches you."]],
 RIDER: [["id", "Register with your ID", "Add your mobile number, your vehicle and a photo of your ID."], ["check", "Get approved", "Admins approve riders before any job is shown to them."], ["send", "Accept a delivery", "See the pickup, drop-off, distance and fee, then accept the job you want."], ["truck", "Pick up and deliver", "Tap Picked up, share your live location, and tap Delivered when you arrive."]]
};
const howBody = () => `<div class="hsteps">${HOWS[HOW].map((s, i) => `<div class="hs2"><span class="num">${i + 1}</span><span class="step-label">STEP ${String(i + 1).padStart(2,"0")}</span><span class="ico g">${ic(s[0], 24)}</span><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join("")}</div>`;
const setHow = r => { HOW = r; $("#howbody").innerHTML = howBody(); document.querySelectorAll(".htab").forEach(b => b.classList.toggle("on", b.dataset.r == r)); };
const FEATS = [["lock", "Checked by people", "NGOs, families and riders are approved by an admin before they can order or deliver."], ["truck", "Pickup or delivery", "Collect the food yourself, or let a rider bring it to your door."], ["pin", "Live map tracking", "See where the rider is and when the food will arrive."], ["leaf", "Free food, fair fees", "Donors can choose to cover the delivery fee, so receivers get free delivery."], ["sync", "Smart matching", "Ask for a food type and the soonest-expiring food is reserved for you first."], ["users", "Bangla and English", "Switch language any time. Areas across Bangladesh, from Dhaka to Sylhet."]];
let preferredRole = "DONOR";
const journeyOptions = { DONOR:{label:"Share food",bn:"খাবার দান করুন"}, NGO:{label:"Find food",bn:"খাবার খুঁজুন"}, RIDER:{label:"Join as a rider",bn:"রাইডার হিসেবে যোগ দিন"} };
function selectJourney(role) { preferredRole=role; document.querySelectorAll("[data-journey]").forEach(x=>{const on=x.dataset.journey===role;x.classList.toggle("on",on);x.setAttribute("aria-pressed",String(on));});const c=$("#hero-action");if(c)c.textContent=b(journeyOptions[role].label,journeyOptions[role].bn); }
function startJourney(){go("register");}
function landing() {
  $("#app").innerHTML = `<section class="hero"><img class="scene" src="assets/illustrations/bangladesh-scene.svg" alt="" aria-hidden="true"><div class="in">
    <div class="hero-copy"><span class="chip">${ic("leaf",16)} ${b("Food connects us · Bangladesh","খাবারেই ভালোবাসা · বাংলাদেশ")}</span>
      <h1>${b("Good food deserves a ","ভালো খাবার ")}<em>${b("second chance.","নষ্ট নয়, ভাগ হোক।")}</em></h1>
      <p class="lead">${b("Share extra meals with people nearby. Less waste, more care, and a community where everyone belongs.","বাড়তি খাবার পৌঁছে দিন আশেপাশের মানুষের কাছে। কমবে অপচয়, বাড়বে মানুষের প্রতি মানুষের ভালোবাসা।")}</p>
      <div class="journey-label">${b("I am here to…","আমি এখানে এসেছি…")}</div>
      <div class="journey" role="group" aria-label="Choose how to take part">
        <button type="button" data-journey="DONOR" aria-pressed="true" class="on" onclick="selectJourney('DONOR')"><img src="assets/illustrations/role-donor.svg" alt="">${b("Give food","খাবার দিতে")}</button>
        <button type="button" data-journey="NGO" aria-pressed="false" onclick="selectJourney('NGO')"><img src="assets/illustrations/role-ngo.svg" alt="">${b("Find food","খাবার নিতে")}</button>
        <button type="button" data-journey="RIDER" aria-pressed="false" onclick="selectJourney('RIDER')"><img src="assets/illustrations/role-rider.svg" alt="">${b("Deliver","পৌঁছে দিতে")}</button>
      </div>
      <div class="hero-actions"><button id="hero-action" onclick="startJourney()">${b(journeyOptions[preferredRole].label,journeyOptions[preferredRole].bn)}</button><button class="ghost" onclick="toHow()">${t("How it works")} ${ic("send",16)}</button></div>
    </div>
    <div class="hero-visual hero-slideshow-visual">${heroSlideshowMarkup()}
      <p class="gallery-footnote">${ic('sync',15)}${b('Twelve little stories. One shared purpose.','বারোটি ছোট গল্প। পাশে থাকার এক ইচ্ছে।')}</p>
    </div>
  </div></section>
  <div class="strip"><div><span class="ico g">${ic("users",24)}</span><span><b>${b("People first","মানুষ সবার আগে")}</b><small>${b("Dignity in every interaction","প্রতিটি পদক্ষেপে সম্মান")}</small></span></div><div><span class="ico o">${ic("truck",24)}</span><span><b>${b("Pickup or delivery","পিকআপ অথবা ডেলিভারি")}</b><small>${b("Choose what works for you","আপনার সুবিধামতো বেছে নিন")}</small></span></div><div><span class="ico b">${ic("leaf",24)}</span><span><b>${b("Less food wasted","খাবার অপচয় কমান")}</b><small>${b("Good food gets a second chance","ভালো খাবারের নতুন ঠিকানা")}</small></span></div></div>
  <section class="sec"><span class="section-eyebrow">${b("A place for every meal","প্রতিটি খাবারের জন্য নতুন সুযোগ")}</span><h2>${b("Every kind of food can make a difference","একটু খাবারও কারও অনেক উপকারে আসে")}</h2>
    <p class="section-intro">${b("From home-cooked meals to bakery surplus, share fresh, properly stored food with your community.","ঘরের রান্না থেকে বেকারির বাড়তি খাবার, ভালোভাবে সংরক্ষিত খাবার ভাগ করুন সবার সঙ্গে।")}</p>
    <div class="food-types">
      <div class="food-type"><div><h3>${b("Home-cooked meals","ঘরে রান্না খাবার")}</h3><p>${b("Rice, khichuri and everyday meals","ভাত, খিচুড়ি ও প্রতিদিনের খাবার")}</p></div><div class="type-art">${art("rice")}</div></div>
      <div class="food-type"><div><h3>${b("Bread & bakery","রুটি ও বেকারি")}</h3><p>${b("Fresh bread, ruti and snacks","তাজা রুটি, পাউরুটি ও নাশতা")}</p></div><div class="type-art">${art("bread")}</div></div>
      <div class="food-type"><div><h3>${b("Fruits & produce","ফল ও সবজি")}</h3><p>${b("Fresh seasonal fruits and vegetables","মৌসুমি ফল ও তাজা সবজি")}</p></div><div class="type-art">${art("vegetable")}</div></div>
    </div>
  </section>
  <section class="sec" id="how"><span class="section-eyebrow">${b("Simple from start to finish","শুরু থেকে শেষ, সহজ")}</span><h2>${t("How it works")}</h2><p class="section-intro">${b("The right next step depends on whether you are giving, receiving or delivering food.","আপনি খাবার দেবেন, নেবেন, নাকি পৌঁছে দেবেন? আপনার জন্য ধাপগুলো দেখুন।")}</p><div class="htabs">${[["DONOR", "I have food to give"], ["RECEIVER", "I need food (NGO or family)"], ["RIDER", "I can deliver"]].map(([k,l])=>`<button class="htab ${k==HOW?"on":""}" data-r="${k}" onclick="setHow('${k}')">${l}</button>`).join("")}</div><div id="howbody">${howBody()}</div></section>
  <section class="sec"><span class="section-eyebrow">${b("Built around trust","বিশ্বাসের ভিত্তিতে")}</span><h2>${b("Care is in the details","শুধু খাবার নয়, পাশে থাকার উদ্যোগ")}</h2><p class="section-intro">${b("Thoughtful tools for donors, receiving families, NGOs and riders.","দাতা, পরিবার, এনজিও ও রাইডার সবার জন্য সহজ ব্যবস্থাপনা।")}</p><div class="feat">${FEATS.map(f=>`<div><span class="ico g">${ic(f[0],24)}</span><div><b>${f[1]}</b><p>${f[2]}</p></div></div>`).join("")}</div></section>
  <section class="sec" style="padding-top:10px"><div class="teaser"><div class="panel"><h3>${t("Our motive")}</h3><p>${t("No good food should be thrown away while someone goes to bed hungry.")}</p><button class="soft" onclick="go('about')">${t("About us")}</button></div><div class="panel"><h3>${t("Our team")}</h3><p>${b("Meet the people shaping a more caring way to share food.","খাবার ভাগাভাগির উদ্যোগটি যারা গড়ে তুলছেন, তাদের চিনে নিন।")}</p><button class="soft" onclick="go('team')">${t("Our team")}</button></div></div></section>
  <section class="band"><h2>${b("Have extra food today?","আজ বাড়তি খাবার আছে?")}</h2><p>${b("It could become someone's next meal. Join the community and start sharing.","আপনার বাড়তি খাবারই হতে পারে কারও পরের বেলার খাবার।")}</p><button onclick="go('register')" style="padding:13px 28px;font-size:17px">${t("Join now")}</button></section>${foot()}`;
  selectJourney(preferredRole); after(); startHeroSlideshow();
}
const VALS = [["leaf", "No food wasted", "Surplus goes to people, not to the bin."], ["lock", "Dignity first", "Families share their proof with admins only, never publicly."], ["check", "Trust through checking", "Every NGO, family and rider is approved by a person before they start."], ["pin", "Open and trackable", "Pickup place, delivery fee and rider location are visible, so nobody is left guessing."]];
const aboutPage = () => `<section class="pghead"><h1>${t("Our motive")}</h1><p>${t("No good food should be thrown away while someone goes to bed hungry.")}</p></section>
  <div class="prose"><h2>Why খাও দাও exists</h2><p>Every day, restaurants, hotels, wedding halls and homes in Bangladesh are left with food that is still fresh. At the same time, many families and NGOs struggle to find a meal. The food and the need are often only a few kilometres apart. What is missing is a fast, trustworthy link between them.</p>
  <p>খাও দাও is that link. Donors list what they have. Approved NGOs and families order it. A rider can bring it, and everyone can follow the delivery on a map.</p><h2>What we stand for</h2></div>
  <div class="vals">${VALS.map(v => `<div><span class="ico g">${ic(v[0], 24)}</span><h3>${v[1]}</h3><p>${v[2]}</p></div>`).join("")}</div>
  ${aboutExtra()}<div class="prose" style="padding-top:20px"><div class="note"><b>A note on food safety.</b> খাও দাও connects people but does not inspect food. Donors should share only fresh, safely stored food, and receivers should check it before eating.</div>
  <p style="text-align:center"><button onclick="go('register')">${t("Join now")}</button> <button class="soft" onclick="go('team')">${t("Our team")}</button></p></div>${foot()}`;
const TEAM = [["Jinat", "User experience & accounts", "Making joining and account management simple."], ["Mahi", "Food donation", "Helping donors share available food clearly."], ["Sibat", "Requests & community", "Supporting food requests and receiving journeys."], ["Rupom", "Operations & insights", "Helping keep the platform organised and accountable."]];
const teamPage = () => `<section class="sky"><div class="team-intro"><span class="section-eyebrow" style="color:#b6e3c7">${b("The people behind the platform","এই উদ্যোগের পেছনে যারা")}</span><h1>${b("Meet our team","আমাদের টিম")}</h1><p>${b("A small group of people building a thoughtful way to reduce food waste and connect communities across Bangladesh.","খাবারের অপচয় কমাতে এবং মানুষের পাশে দাঁড়াতে আমরা একসঙ্গে কাজ করছি।")}</p></div></section>
  <div class="lead2"><div class="card2"><div class="av big">A</div><div><span class="badge2">${b("Team lead","টিম লিড")}</span><h2>Arafat Hossain</h2><p>${b("Guiding product direction and food matching, with a focus on making each donation easier to share and receive.","প্ল্যাটফর্মের পরিকল্পনা ও খাবার ম্যাচিং ব্যবস্থা নিয়ে কাজ করছেন।")}</p></div></div></div>
  <section class="sec" style="padding-bottom:0"><span class="section-eyebrow">${b("People & responsibilities","দায়িত্ব ও পরিচয়")}</span><h2>${b("Working together for a shared purpose","একটি লক্ষ্য নিয়ে একসঙ্গে")}</h2><p class="section-intro">${b("Different roles, one goal: help more good food reach people.","সবার কাজ আলাদা, কিন্তু উদ্দেশ্য একটাই: ভালো খাবার পৌঁছে দেওয়া।")}</p></section>
  <div class="team" style="padding-top:10px">${TEAM.map(m=>`<div class="mem"><div class="av">${m[0][0]}</div><b>${m[0]}</b><small>${m[1]}</small><p>${m[2]}</p></div>`).join("")}</div>
  <section class="sec" style="text-align:center;max-width:750px"><h2>${b("Why this matters to us","কেন এই কাজটি জরুরি")}</h2><p class="section-intro" style="margin:14px auto 20px">${b("Because sharing food should feel simple, respectful, and useful to everyone involved.","খাবার ভাগ করে নেওয়া হওয়া উচিত সহজ, সম্মানজনক এবং সবার জন্য উপকারী।")}</p><button onclick="go('register')">${t("Join now")}</button></section>${foot()}`;
let MAP = null, PR = null, trk = null, PL = { lat: 23.7806, lng: 90.4073 }, PK, PK2, SH, PROOF, gps;
function togglePassword(btn,id){const input=document.getElementById(id);if(!input)return;const visible=input.type==="password";input.type=visible?"text":"password";btn.setAttribute("aria-pressed",String(visible));btn.setAttribute("aria-label",visible?"Hide password":"Show password");const img=btn.querySelector("img");if(img)img.src="assets/icons/"+(visible?"eye-off":"eye")+".svg";input.focus({preventScroll:true});}
async function pickProof(inp) {
  const f = inp.files[0], pv = $("#pv"); PROOF = null; pv.innerHTML = ""; if (!f) return;
  if (f.type.startsWith("video/")) { if (f.size > 30e6) { toast("Video is too large (max 30 MB).", 1); inp.value = ""; return; } PROOF = { type: "video", url: URL.createObjectURL(f) }; pv.innerHTML = `<video src="${PROOF.url}" controls></video>`; }
  else if (f.type.startsWith("image/")) {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = URL.createObjectURL(f); }), sc = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = img.width * sc; c.height = img.height * sc; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); PROOF = { type: "image", url: c.toDataURL("image/jpeg", .7) }; pv.innerHTML = `<img src="${PROOF.url}" alt="">`;
  } else { toast("Please choose a photo or a video.", 1); inp.value = ""; }
}
const doAuth = async (e, kind) => {
  e.preventDefault(); const submitBtn = e.target.querySelector("button[type=submit]"), card = $("#ac"); submitBtn.classList.add("busy"); submitBtn.disabled = true;
  const authError = $("#auth-error");
  if (authError) { authError.hidden = true; authError.textContent = ""; }
  if (kind === "login") rememberAuthUsername();
  try {
    if (kind == "login") { S = await api("/api/login", "POST", { username: v("lu"), password: v("lp") }); try { sessionStorage.setItem("s", JSON.stringify(S)); } catch (x) {} toast(b("Welcome back, ","আবার স্বাগতম, ") + S.name + "!"); go("dash"); }
    else { const role = v("role"); await api("/api/register", "POST", { role, name: v("rname"), username: v("ru"), password: v("rp"), phone: v("ph"), regNo: v("reg"), address: v("addr"), reason: v("reason"), vehicle: v("veh"), proof: PROOF });
      toast(role == "DONOR" ? "Account created. Please log in." : "Account created. An admin will review your details and proof soon."); go("login"); }
  } catch (x) { if (authError) { authError.textContent = x.message; authError.hidden = false; } else toast(x.message, 1); card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }
  finally { submitBtn.classList.remove("busy"); submitBtn.disabled = false; }
};
function logout() { S = null; try { sessionStorage.clear(); } catch (e) {} go(""); }

const VIEWS = {
 DONOR: {
  async dash() { const [l, inc] = await Promise.all([api("/api/donations?mine=1"), api("/api/requests")]);
    const al = inc.filter(r => r.status == "ALLOCATED" || r.status == "COMPLETED").length, pend = inc.filter(r => r.status == "ALLOCATED").length;
    return head("Donor Dashboard", "Share surplus food, make an impact") + `<div class="sts">${st("box", "g", l.length, "My Donations")}${st("check", "g", al, "Allocated")}${st("clock", "o", pend, "Waiting for pickup")}</div>
    <div class="two"><div class="panel"><h3>Add a New Donation</h3><p>Fill in the details of available food.</p><button onclick="go('add')">${t("Add Donation")}</button><div class="art">${art("box")}</div></div>
    <div class="panel"><h3>${t("My Donations")}</h3><p>View and manage your donations.</p><button onclick="go('mine')">${t("View All")}</button><div class="art">${art("rice")}</div></div></div>
    <section class="panel" style="margin-top:16px"><h3>Recent donations</h3>${donTable(l.slice(-5).reverse())}</section>`; },
  async add() { PR = initAdd; return head("Add Donation", "Fill in the details of available food.") + `<section class="panel" style="margin-top:18px"><div class="row">
    <div><input class="plain" id="n" placeholder="Food name (e.g. Khichuri)"></div><div><input class="plain" id="c" list="cats" placeholder="Category (e.g. rice)"><datalist id="cats"><option>rice</option><option>bread</option><option>vegetables</option><option>dal</option><option>fruits</option><option>biryani</option><option>khichuri</option></datalist></div>
    <div><input class="plain" id="q" type="number" placeholder="Quantity"></div><div><select class="plain" id="u"><option>kg</option><option>packets</option><option>plates</option><option>pieces</option><option>litres</option></select></div>
    <div><input class="plain" id="l" list="areas" placeholder="Pickup area (e.g. Dhanmondi, Dhaka)" oninput="areaPick(this.value)"><datalist id="areas">${Object.keys(AREAS).map(a => `<option>${a}</option>`).join("")}</datalist></div>
    <div><input class="plain" id="e" type="number" placeholder="Expires in (hours)"></div></div>
    <p class="hint">Tap the map to mark exactly where the food can be picked up.</p><div id="pm" class="map"></div><button class="soft" onclick="locate(PK)">${ic("pin", 16)} Use my location</button>
    <label class="chk"><input type="checkbox" id="cover"> I will pay the delivery fee (the receiver gets free delivery)</label>
    <button onclick="addDon()">${ic("plus", 18)}${t("Add Donation")}</button></section>`; },
  async mine() { const l = await api("/api/donations?mine=1"); return head("My Donations", "View and manage your donations.") + `<section class="panel" style="margin-top:18px">${donTable(l, 1)}</section>`; },
  async hand() { const inc = await api("/api/requests"); return head("Handovers", "Orders for your food. For pickups, press “Handed over” when the receiver has collected it.") + `<section class="panel" style="margin-top:18px">${tbl(["#", "Receiver", "Food", "Qty", "How", "Status", ""], inc.map(r => [r.id, esc(r.ngoName), esc(r.matchedFood || "—"), r.quantity, r.mode == "DELIVERY" ? "Rider delivery" : "Pickup", bd(r.status),
    r.mode == "DELIVERY" ? (r.status == "ALLOCATED" || r.status == "ON_THE_WAY" ? `<button class="soft" onclick="go('track/${r.id}')">Track</button>` : "") : r.status == "ALLOCATED" ? `<button onclick="doneReq(${r.id})">${t("Handed over")}</button>` : ""]))}</section>`; }
 },
 NGO: {
  async dash() { const [all, reqs, me] = await Promise.all([api("/api/donations"), api("/api/requests"), api("/api/me")]); S.verified = me.verified; S.rejected = me.rejected;
    FOODS = all.slice().sort((a, b) => a.expiryAt - b.expiryAt);
    const list = FOODS.filter(d => (!Q || (d.name + d.category + d.location + d.donorName).toLowerCase().includes(Q.toLowerCase())) && (!CAT || d.category == CAT)), soon = FOODS.filter(d => d.urgency == "HIGH"), cats = [...new Set(all.map(d => d.category))];
    return head("NGO Portal", "Find food, help your community") + gate() +
    `<div class="srch" style="margin-top:16px"><input class="plain" id="sq" value="${esc(Q)}" placeholder="Search for food (e.g. Rice, Vegetables...)" onkeydown="if(event.key=='Enter')setQ(this.value)"><button onclick="setQ(v('sq'))">${ic("search", 18)}${t("Search")}</button></div>
    <div class="chips"><button class="chip2 ${CAT ? "" : "on"}" onclick="setCat('')">All</button>${cats.map(c => `<button class="chip2 ${CAT == c ? "on" : ""}" data-c="${esc(c)}" onclick="setCat(this.dataset.c)">${art(c)}${esc(c)}</button>`).join("")}</div>
    ${soon.length && !Q && !CAT ? `<h3 class="sec2">Expiring soon</h3><div class="hs">${soon.map(card).join("")}</div>` : ""}
    <h3 class="sec2">${t("Available Food")}</h3><div class="cards">${list.map(card).join("") || `<div class="empty">No food matches. Try another search.</div>`}</div>
    <section class="panel" style="margin-top:22px"><h3>Can’t find it? Ask for it</h3><p>Tell us the food type. Smart matching reserves the soonest-expiring food for you when it arrives.</p><div class="row"><input class="plain" id="rc" placeholder="Category (e.g. rice)"><input class="plain" id="rq" type="number" placeholder="Quantity"></div><button onclick="addSmart()">${ic("send", 18)}Send request</button></section>`; },
  async mine() { const r = await api("/api/requests"); return head("My Orders", "Track every order you have placed.") + `<div class="orders">${r.slice().reverse().map(orderCard).join("") || `<div class="empty">No orders yet. Pick something from the Dashboard.</div>`}</div>`; }
 },
 RIDER: {
  async dash() { const [jobs, me] = await Promise.all([api("/api/requests"), api("/api/me")]); S.verified = me.verified; S.rejected = me.rejected; const open = jobs.filter(r => !r.rider);
    return head("Delivery jobs", "Accept a delivery. The fee is paid by the donor or the receiver.") + gate() + `<div class="orders">${open.map(r => `<div class="oc"><div class="art2">${art(r.category)}</div><div class="ob"><b>${esc(r.matchedFood)}</b> × ${r.quantity}<br><small>${esc(r.donorName)} · ${esc(r.pickAddress || "")} → ${esc(r.dropAddress)} · ${km(r.pickLat, r.pickLng, r.dropLat, r.dropLng).toFixed(1)} km</small></div>
      <div><b>৳${r.fee}</b><br><small>${r.feePayer == "DONOR" ? "paid by donor" : "paid by receiver"}</small></div><button onclick="acceptJob(${r.id})">Accept job</button></div>`).join("") || `<div class="empty">No delivery jobs right now. New ones appear here.</div>`}</div>`; },
  async mine() { const j = (await api("/api/requests")).filter(r => r.rider); return head("My deliveries", "Update each step so the receiver can follow you on the map.") + `<div class="orders">${j.map(r => `<div class="oc"><div class="art2">${art(r.category)}</div><div class="ob"><b>${esc(r.matchedFood)}</b> × ${r.quantity}<br><small>${esc(r.donorName)} · ${esc(r.pickAddress || "")} → ${esc(r.dropAddress)}</small></div><div>${bd(r.status)}</div>
      <div><button class="soft" onclick="go('track/${r.id}')">Map</button> ${r.status == "ALLOCATED" ? `<button onclick="pickup(${r.id})">Picked up</button>` : r.status == "ON_THE_WAY" ? `<button onclick="doneReq(${r.id})">Delivered</button>` : ""}</div></div>`).join("") || `<div class="empty">No deliveries yet. Accept a job from Delivery jobs.</div>`}</div>`; }
 },
 ADMIN: {
  async dash() { const [r, reqs] = await Promise.all([api("/api/report"), api("/api/requests")]);
    const pr = r.requests ? Math.round(r.allocated / r.requests * 100) : 0, pd = r.totalQty ? Math.round(r.remainingQty / r.totalQty * 100) : 0;
    return head("Admin Dashboard", "Monitor & manage the system", `<button onclick="report()">${ic("file", 18)}${t("Generate Report")}</button>`) +
    `<div class="sts">${st("box", "g", r.donations, "Total Donations")}${st("send", "b", r.requests, "Total Requests")}${st("users", "p", r.users, "Registered Users")}${st("id", "o", r.unverified, "Pending approvals")}</div>
    <div class="two">${`<div class="panel"><h3>Donation status</h3>${donut(pd, "Food units", "Still available", "Given out or expired")}</div><div class="panel"><h3>Request status</h3>${donut(pr, "Requests", "Allocated", "Waiting")}</div>`}</div>
    <section class="panel" style="margin-top:16px"><h3>Recent requests</h3>${tbl(["#", "NGO", "Category", "Qty", "Status", "Food"], reqRows(reqs.slice(-5).reverse()))}</section>`; },
  async match() { const reqs = await api("/api/requests"), done = reqs.filter(r => r.status != "PENDING" && r.status != "CANCELLED");
    return head("Smart Matching & Allocation", "Matching food with the right need…", `<button id="mb" onclick="runMatch()">${ic("sync", 18)}${t("Run Matching")}</button>`) +
    `<section class="panel" style="margin-top:18px"><div class="flow"><div class="node"><span class="ico g">${art("rice")}</span>Available Food</div><div class="sym">+</div><div class="node"><span class="ico b">${ic("users", 40)}</span>NGO Request</div><div class="sym">→</div><div class="node"><span class="ico g">${ic("check", 40)}</span>Allocated</div></div>
    <div class="prog"><i id="pb"></i></div><small id="ms" style="color:var(--mut)">Same category, enough quantity, soonest expiry first. Runs automatically every 30 seconds on the real server.</small>
    ${API_URL ? "" : `<div style="margin-top:14px"><button class="soft" onclick="seed()">Load sample data</button> <button class="soft" onclick="resetDemo()">Reset demo</button></div>`}</section>
    <section class="panel"><h3>Allocation log</h3>${tbl(["#", "NGO", "Category", "Qty", "Status", "Food"], reqRows(done))}</section>`; },
  async reqs() { const r = await api("/api/requests"); return head("All Requests", "Every request in the system") + `<section class="panel" style="margin-top:18px">${tbl(["#", "NGO", "Category", "Qty", "Status", "Food"], reqRows(r))}</section>`; },
  async users() { const u = (await api("/api/users")).filter(x => x.role != "ADMIN");
    const det = x => x.role == "NGO" ? "Reg. " + esc(x.regNo || "—") : x.role == "INDIVIDUAL" ? esc(x.address) + "<br><small>" + esc(x.reason) + "</small>" : x.role == "RIDER" ? esc(x.vehicle) : "—";
    const pf = p => !p ? "—" : p.type == "video" ? `<video class="pf" src="${esc(p.url)}" controls></video>` : `<img class="pf" src="${esc(p.url)}" alt="proof" onclick="zoom(this.src)">`;
    return head("Users & NGOs", "Check the proof, then approve or reject") + `<section class="panel" style="margin-top:18px">${tbl(["Who", "Mobile", "Details", "Proof", "Status", ""], u.map(x => [`<b>${esc(x.name)}</b><br><small>${esc(x.username)} · ${x.role}</small>`, esc(x.phone || "—"), det(x), pf(x.proof),
      x.verified ? `<span class="bd">Approved</span>` : x.rejected ? `<span class="bd CANCELLED">Rejected</span>` : `<span class="bd PENDING">Waiting</span>`,
      x.role != "DONOR" && !x.verified ? `<button data-u="${esc(x.username)}" onclick="verify(this.dataset.u)">Approve</button> <button class="warn" data-u="${esc(x.username)}" onclick="reject(this.dataset.u)">Reject</button>` : ""]))}</section>`; }
 }
};
VIEWS.INDIVIDUAL = VIEWS.NGO;

/* ---------- actions ---------- */
const addDon = act(async () => { await api("/api/donations", "POST", { name: v("n"), category: v("c"), quantity: v("q"), unit: v("u"), location: v("l"), expiryHours: v("e"), lat: PL.lat, lng: PL.lng, coversDelivery: $("#cover").checked }); toast("Donation added"); go("mine"); });
const editDon = act(async (id, q) => { const n = prompt("Quantity left:", q); if (n === null) return; await api("/api/donations/" + id, "PUT", { quantity: n }); toast("Donation updated"); render(); });
const delDon = act(async id => { if (!confirm("Delete this donation?")) return; await api("/api/donations/" + id, "DELETE"); toast("Donation deleted"); render(); });
const doneReq = act(async id => { await api("/api/requests/" + id + "/complete", "POST"); if (gps != null && navigator.geolocation) navigator.geolocation.clearWatch(gps); toast("Marked as done"); render(); });
const cancelReq = act(async id => { if (!confirm("Cancel this request?")) return; await api("/api/requests/" + id + "/cancel", "POST"); toast("Request cancelled"); render(); });
const addSmart = act(async () => { await api("/api/requests", "POST", { category: v("rc"), quantity: v("rq") }); toast("Request sent. Run matching to allocate."); go("mine"); });
const verify = act(async u => { await api("/api/users/" + u + "/verify", "POST"); toast("Approved"); render(); });
const reject = act(async u => { if (!confirm("Reject this registration?")) return; await api("/api/users/" + u + "/reject", "POST"); toast("Rejected"); render(); });
const acceptJob = act(async id => { await api("/api/requests/" + id + "/accept", "POST"); toast("Job accepted. Go to the pickup point."); go("mine"); });
const pickup = act(async id => { await api("/api/requests/" + id + "/pickup", "POST");
  if (API_URL && navigator.geolocation) gps = navigator.geolocation.watchPosition(p => api("/api/requests/" + id + "/location", "POST", { lat: p.coords.latitude, lng: p.coords.longitude }).catch(() => {}), () => toast("Turn on location so the receiver can track you.", 1), { enableHighAccuracy: true });
  toast("On the way. Drive safe!"); render(); });
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const feeFor = k => Math.round(30 + 15 * k);
const AREAS = {"Dhanmondi, Dhaka":[23.7461,90.3742],"Mirpur, Dhaka":[23.8069,90.3687],"Uttara, Dhaka":[23.8759,90.3795],"Mohammadpur, Dhaka":[23.7662,90.3589],"Gulshan, Dhaka":[23.7925,90.4078],"Agrabad, Chattogram":[22.3242,91.812],"Zindabazar, Sylhet":[24.8949,91.8687],"Khulna Sadar":[22.8456,89.5403],"Rajshahi Sadar":[24.3745,88.6042]};
const gate = () => S.verified === false || S.rejected ? `<div class="warnbox"><b>${S.rejected ? "Your registration was not approved." : "Waiting for approval."}</b> ${S.rejected ? "Please contact the খাও দাও team." : "You can look around now. An admin must check your details and proof before you can start."}</div>` : "";
const mkMap = (id, c = [23.7806, 90.4073], z = 12) => { if (MAP) MAP.remove(); MAP = L.map(id).setView(c, z); L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(MAP); return MAP; };
function pickMap(id, set) { const m = mkMap(id); let mk = null; const put = (la, ln) => { if (mk) mk.setLatLng([la, ln]); else mk = L.marker([la, ln]).addTo(m); set(la, ln); }; m.on("click", e => put(e.latlng.lat, e.latlng.lng)); return { m, put }; }
const locate = pk => navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { pk.put(p.coords.latitude, p.coords.longitude); pk.m.setView([p.coords.latitude, p.coords.longitude], 16); }, () => toast("Could not get your location. Tap the map instead.", 1)) : toast("Location is not available on this device.", 1);
const initAdd = () => { PL = { lat: 23.7806, lng: 90.4073 }; PK = pickMap("pm", (la, ln) => { PL = { lat: la, lng: ln }; }); };
const areaPick = val => { const a = AREAS[val]; if (a && PK) { PK.put(a[0], a[1]); PK.m.setView(a, 15); } };
const card = d => `<div class="fd" onclick="openSheet(${d.id})"><div class="fi">${art(d.category)}<span class="tg ${d.urgency}">${d.urgency == "HIGH" ? "Expiring soon" : "Fresh"}</span>${d.coversDelivery ? `<span class="tg free">Free delivery</span>` : ""}<button class="add" aria-label="Order ${esc(d.name)}">+</button></div>
  <h3>${esc(d.name)}</h3><small>${esc(d.donorName)} · ${esc(d.location)}</small><div class="meta"><span>${ic("clock", 15)}<b class="cd" data-t="${d.expiryAt}"></b></span><span>${d.quantity} ${esc(d.unit)}</span></div></div>`;
const orderCard = r => `<div class="oc"><div class="art2">${art(r.category)}</div><div class="ob"><b>${esc(r.matchedFood || r.category)}</b> × ${r.quantity}<br><small>${r.donorName ? esc(r.donorName) + " · " : ""}${r.status == "PENDING" ? "Waiting for smart matching" : r.mode == "DELIVERY" ? "Delivery · fee ৳" + r.fee + (r.feePayer == "DONOR" ? " (donor pays)" : "") : "Pickup"}</small></div><div>${bd(r.status)}</div>
  <div>${r.status != "PENDING" && r.status != "CANCELLED" ? `<button onclick="go('track/${r.id}')">${r.mode == "DELIVERY" ? "Track" : "Details"}</button>` : ""}${r.status == "PENDING" ? `<button class="warn" onclick="cancelReq(${r.id})">Cancel</button>` : ""}</div></div>`;
function openSheet(id) { SH = { d: FOODS.find(x => x.id == id), qty: 1, mode: "PICKUP", lat: 0, lng: 0, addr: "" }; drawSheet(); }
function drawSheet() {
  const { d, qty, mode } = SH;
  $("#sheet").innerHTML = `<div class="ov" onclick="closeSheet()"></div><div class="sh" role="dialog" aria-modal="true"><button class="x" onclick="closeSheet()" aria-label="Close">×</button>
   <div class="shh">${art(d.category)}<div><h2>${esc(d.name)}</h2><small>${esc(d.donorName)} · ${esc(d.location)}</small><br>${d.quantity} ${esc(d.unit)} left · <b class="cd" data-t="${d.expiryAt}"></b></div></div>
   <label class="lb">Quantity</label><div class="step2"><button onclick="shQty(-1)" aria-label="Less">−</button><b id="qv">${qty}</b><button onclick="shQty(1)" aria-label="More">+</button><span>${esc(d.unit)}</span></div>
   <div class="seg"><button class="${mode == "PICKUP" ? "on" : ""}" onclick="shMode('PICKUP')">${ic("box", 18)} Pickup</button><button class="${mode == "DELIVERY" ? "on" : ""}" onclick="shMode('DELIVERY')">${ic("truck", 18)} Delivery</button></div>
   ${mode == "DELIVERY" ? `<p class="hint">Tap the map where the rider should bring the food.</p><div id="sm" class="map"></div><button class="soft" onclick="locate(PK2)">${ic("pin", 16)} Use my location</button>
     <input class="plain" id="da" placeholder="House, road, area (for the rider)" style="margin-top:10px" value="${esc(SH.addr)}" oninput="SH.addr=this.value"><div class="bill"><span>Delivery fee<span id="bl"></span></span><b id="bf">Mark location</b></div>` : `<p class="hint">Collect it yourself from ${esc(d.location)}. You will see directions after ordering.</p>`}
   <div class="bill"><span>Food</span><b>Free</b></div><div class="bill tot"><span>You pay</span><b id="bp">৳0</b></div><button class="full" onclick="placeOrder()">Place order</button></div>`;
  if (mode == "DELIVERY") { PK2 = pickMap("sm", (la, ln) => { SH.lat = la; SH.lng = ln; refreshBill(); }); if (SH.lat) { PK2.put(SH.lat, SH.lng); PK2.m.setView([SH.lat, SH.lng], 15); } else PK2.m.setView([d.lat, d.lng], 13); }
}
function refreshBill() { const { d } = SH, dist = km(d.lat, d.lng, SH.lat, SH.lng), fee = feeFor(dist); $("#bf").innerHTML = d.coversDelivery ? `<s>৳${fee}</s> Free · paid by donor` : "৳" + fee; $("#bl").textContent = ` (${dist.toFixed(1)} km)`; $("#bp").textContent = d.coversDelivery ? "৳0" : "৳" + fee; }
const shQty = n => { SH.qty = Math.max(1, Math.min(SH.d.quantity, SH.qty + n)); $("#qv").textContent = SH.qty; };
const shMode = m => { SH.mode = m; drawSheet(); };
const closeSheet = () => { $("#sheet").innerHTML = ""; if (MAP) { MAP.remove(); MAP = null; } SH = null; };
const zoom = src => { $("#sheet").innerHTML = `<div class="ov" onclick="closeSheet()"></div><img class="zm" src="${src}" alt="">`; };
const placeOrder = act(async () => { const { d, qty, mode } = SH;
  if (mode == "DELIVERY" && !SH.lat) throw new Error("Please mark the delivery location on the map.");
  if (mode == "DELIVERY" && !SH.addr.trim()) throw new Error("Please write the house or road for the rider.");
  const r = await api("/api/requests", "POST", { donationId: d.id, quantity: qty, mode, dropLat: SH.lat, dropLng: SH.lng, dropAddress: SH.addr }); closeSheet(); toast("Order placed"); go("track/" + r.id); });
async function trackView(id) { const o = await api("/api/requests/" + id + "/track"); PR = () => startTrack(id);
  return `<a class="back" href="javascript:history.back()">← Back</a>` + head("Order #" + id, o.food + " × " + o.qty + " · from " + o.donorName) + `<div class="trk"><div class="panel"><ol class="stp" id="stp"></ol><p id="eta"></p><div id="rd"></div><small id="fee" style="color:var(--mut)"></small></div><div id="tm" class="map tall"></div></div>`; }
function startTrack(id) {
  const m = mkMap("tm"), pin = (i, c) => L.divIcon({ className: "", html: `<div class="pin" style="background:${c}">${ic(i, 18)}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
  let fit = false, mp, md, mr;
  const draw = o => {
    const del = o.mode == "DELIVERY", steps = del ? ["Order placed", "Rider assigned", "On the way", "Delivered"] : ["Order placed", "Ready for pickup", "Collected"];
    const cur = o.status == "COMPLETED" ? steps.length - 1 : del ? (o.status == "ON_THE_WAY" ? 2 : o.rider ? 1 : 0) : 1;
    $("#stp").innerHTML = steps.map((s, i) => `<li class="${i <= cur ? "done" : ""} ${i == cur ? "cur" : ""}"><i></i>${s}</li>`).join("");
    if (!mp) mp = L.marker([o.pick.lat, o.pick.lng], { icon: pin("box", "#e08a12") }).addTo(m).bindTooltip("Pickup · " + o.donorName);
    if (del && !md) { md = L.marker([o.drop.lat, o.drop.lng], { icon: pin("pin", "#e8452c") }).addTo(m).bindTooltip("Delivery"); L.polyline([[o.pick.lat, o.pick.lng], [o.drop.lat, o.drop.lng]], { color: "#1f7a3f", weight: 4, dashArray: "8 8" }).addTo(m); }
    if (o.rider) { const p = [o.rider.lat, o.rider.lng]; if (mr) mr.setLatLng(p); else mr = L.marker(p, { icon: pin("truck", "#1f7a3f") }).addTo(m).bindTooltip(o.rider.name); }
    if (!fit) { fit = true; m.fitBounds(L.latLngBounds([[o.pick.lat, o.pick.lng]].concat(del ? [[o.drop.lat, o.drop.lng]] : [])).pad(.4), { maxZoom: 16 }); }
    $("#eta").innerHTML = o.status == "COMPLETED" ? "Done. Thank you for rescuing food!" : del ? (o.status == "ON_THE_WAY" && o.etaMin ? `Arriving in about <b>${o.etaMin} min</b>` : o.rider ? "Rider is heading to the pickup point" : "Finding a rider near the pickup point…") : `Collect from <b>${esc(o.pick.address)}</b>. <a href="https://www.google.com/maps/dir/?api=1&destination=${o.pick.lat},${o.pick.lng}" target="_blank" rel="noopener">Get directions</a>`;
    $("#rd").innerHTML = o.rider ? `<b>${esc(o.rider.name)}</b><br><small>${esc(o.rider.vehicle || "")}</small><br><a href="tel:${esc(o.rider.phone)}">${esc(o.rider.phone)}</a>` : "";
    $("#fee").textContent = del ? "Delivery fee ৳" + o.fee + (o.feePayer == "DONOR" ? " · paid by donor" : " · paid by receiver") : "Pickup · no fee";
    if (o.status == "COMPLETED") clearInterval(trk);
  };
  const poll = async () => { try { draw(await api("/api/requests/" + id + "/track")); } catch (e) {} };
  poll(); trk = setInterval(poll, 3000);
}
const setQ = q => { Q = q; render(); }, setCat = c => { CAT = c; render(); };
const runMatch = act(async () => { $("#mb").classList.add("busy"); $("#pb").style.width = "94%"; $("#ms").textContent = "Matching in progress…"; await sleep(1700); const r = await api("/api/match", "POST"); toast(r.allocated + " request(s) allocated"); render(); });
const seed = act(async () => { await api("/api/seed", "POST"); toast("Sample data loaded (demo accounts use password: demo)"); render(); });
const resetDemo = act(async () => { await api("/api/reset", "POST"); toast("Demo reset"); render(); });
const report = act(async () => {
  const [r, q] = await Promise.all([api("/api/report"), api("/api/requests")]);
  const rows = [["খাও দাও report", new Date().toLocaleString()], [], ...Object.entries(r), [], ["id", "ngo", "category", "quantity", "status", "matched food"], ...q.map(x => [x.id, x.ngoName || x.ngo, x.category, x.quantity, x.status, x.matchedFood])];
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + rows.map(z => z.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n")], { type: "text/csv" })); a.download = "foodrescue-report.csv"; a.click();
});

/* ---------- router ---------- */
function after() {
  document.querySelectorAll("[data-n]").forEach(e => { const n = +e.dataset.n; let i = 0; e.textContent = 0; const id = setInterval(() => { i = Math.min(n, i + Math.max(1, Math.ceil(n / 18))); e.textContent = i; if (i >= n) clearInterval(id); }, 35); });
  const upd = () => document.querySelectorAll(".cd").forEach(e => e.textContent = left(e.dataset.t - Date.now())); upd(); tick = setInterval(upd, 1000);
}
async function render() {
  stopHeroSlideshow();
  clearInterval(tick); clearInterval(trk); if (MAP) { MAP.remove(); MAP = null; } $("#sheet").innerHTML = "";
  const r = R();
  const isAuth = !S && (r === "login" || r === "register");
  document.body.classList.toggle("auth-route", isAuth);
  document.documentElement.lang = lang;
  $("#nav").innerHTML = isAuth ? authNav() : nav(r);
  if (r == "about" || r == "team") { $("#app").innerHTML = r == "about" ? aboutPage() : teamPage(); if (typeof scrollTo == "function") scrollTo(0, 0); return; }
  if (!S) return r == "login" || r == "register" ? authPage(r == "register") : landing();
  const [base, arg] = r.split("/");
  if (base != "track" && !MENU[S.role].some(m => m[0] == base)) return go("dash");
  const cur = base == "track" ? "mine" : base;
  $("#app").innerHTML = `<div class="shell"><aside class="side"><div class="me"><div class="av">${esc((S.name || "?")[0]).toUpperCase()}</div><b>${esc(S.name)}</b><small>${t({ DONOR: "Donor", NGO: "NGO", INDIVIDUAL: "Individual", RIDER: "Rider", ADMIN: "Admin" }[S.role])}</small></div>
    ${MENU[S.role].map(m => `<a href="#/${m[0]}" class="${m[0] == cur ? "on" : ""}">${ic(m[2])}${t(m[1])}</a>`).join("")}<a href="#" onclick="logout();return false">${ic("out")}${t("Log out")}</a></aside><main class="main" id="main"><p class="empty">Loading…</p></main></div>`;
  try { $("#main").innerHTML = await (base == "track" ? trackView(arg) : VIEWS[S.role][base]()); after(); if (PR) { const f = PR; PR = null; f(); } } catch (e) { toast(e.message, 1); }
}

/* ---------- Interaction without game mechanics ---------- */
const b = (en,bn) => lang === "bn" ? bn : en;
const CH = [["DONOR","donor","দাতা","Donor"],["NGO","ngo","এনজিও","NGO"],["INDIVIDUAL","family","পরিবার","Family"],["RIDER","rider","রাইডার","Rider"]];
const charPick = () => `<div class="ptitle">${b("Choose your role","আপনি কীভাবে যুক্ত হবেন?")}<small>${b("Pick the option that best describes you.","আপনার জন্য উপযুক্ত অপশনটি বেছে নিন।")}</small></div><div class="chars" role="group" aria-label="Account role">${CH.map(c=>`<button type="button" class="${c[0]===preferredRole?"on":""}" aria-pressed="${c[0]===preferredRole}" onclick="pickChar(this,'${c[0]}')"><img src="assets/illustrations/role-${c[1]}.svg" alt=""><span>${b(c[3],c[2])}</span></button>`).join("")}</div>`;
const pickChar = (el,r) => {preferredRole=r;$("#role").value=r;el.form.dataset.role=r;el.parentNode.querySelectorAll("button").forEach(x=>{let on=x===el;x.classList.toggle("on",on);x.setAttribute("aria-pressed",String(on));});};
const revealSelector = ".hs2,.feat>div,.strip>div,.vals>div,.mem,.card2,.teaser .panel,.band,.st,.panel,.fd,.oc,.sec h2,.food-type";
let revealObserver=null;
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add("revealed");revealObserver.unobserve(entry.target);}),{threshold:.07,rootMargin:"0px 0px 40px 0px"});
}
function enhanceUI(){
  if(revealObserver)document.querySelectorAll(revealSelector).forEach((el,i)=>{if(el.dataset.revealed)return;el.dataset.revealed="1";el.classList.add("soft-scroll");el.style.transitionDelay=((i%3)*.055)+"s";revealObserver.observe(el);});
}
let preloadClosed=false;
let kdIntroTimer=null;
let kdIntroKeyHandler=null;
function closePreloader(){
  if(preloadClosed)return;
  preloadClosed=true;
  if(kdIntroTimer!==null)clearTimeout(kdIntroTimer);
  if(kdIntroKeyHandler){document.removeEventListener("keydown",kdIntroKeyHandler);kdIntroKeyHandler=null;}
  const el=$("#preloader");
  if(!el)return;
  el.classList.add("done");
  try{sessionStorage.setItem("khao-dao-intro-seen","1")}catch(e){}
  setTimeout(()=>el.remove(),600);
}
function startPreloader(){
  const el=$("#preloader");if(!el)return;
  let seen=false;
  try{seen=sessionStorage.getItem("khao-dao-intro-seen")==="1"}catch(e){}
  if(seen||["login","register"].includes(R())||window.matchMedia("(prefers-reduced-motion: reduce)").matches){closePreloader();return;}
  kdIntroTimer=setTimeout(closePreloader,3350);
  kdIntroKeyHandler=e=>{if(e.key==="Escape")closePreloader();};
  document.addEventListener("keydown",kdIntroKeyHandler);
}
const aboutExtra = () => `<section class="sec"><span class="section-eyebrow">${b("The idea","ভাবনা থেকে উদ্যোগ")}</span><h2>${b("The challenge, and a simpler way forward","সমস্যা ও সম্ভাবনা")}</h2><div class="two">
  <div class="panel"><h3>${b("Food that goes unused","বাড়তি খাবার")}</h3><p>${b("Fresh, properly stored extra food can be left unused after events, at restaurants and in homes, while other people nearby need it.","অনুষ্ঠান, রেস্তোরাঁ বা বাসায় ভালোভাবে রাখা বাড়তি খাবার অনেক সময় অব্যবহৃত থেকে যায়।")}</p></div>
  <div class="panel"><h3>${b("Sharing, made easier","সহজ ভাগাভাগি")}</h3><p>${b("খাও দাও is designed to help donors post food, receivers request it and riders coordinate handovers, all with care and transparency.","খাও দাও-তে দাতা খাবার পোস্ট করতে পারবেন, গ্রহীতা অনুরোধ করতে পারবেন এবং রাইডার খাবার পৌঁছাতে সাহায্য করবেন।")}</p></div></div></section>
  <section class="sec" style="padding-top:20px"><span class="section-eyebrow">${b("What guides us","আমাদের অগ্রাধিকার")}</span><h2>${b("Thoughtful features for real people","বাস্তব মানুষের জন্য সহজ সেবা")}</h2><ol class="tlv">
  <li data-l="01"><b>${b("Easy food listings","সহজ খাবারের তালিকা")}</b><span>${b("Donors describe their available food, quantity and pickup point.","দাতা খাবারের ধরন, পরিমাণ ও অবস্থান জানান।")}</span></li>
  <li data-l="02"><b>${b("Responsible requests","দায়িত্বশীল অনুরোধ")}</b><span>${b("Receiver verification and clear information are important to us.","গ্রহীতা যাচাই ও স্পষ্ট তথ্য আমাদের কাছে গুরুত্বপূর্ণ।")}</span></li>
  <li data-l="03"><b>${b("Clear pickup and delivery","পিকআপ ও ডেলিভারি")}</b><span>${b("Designed to keep handovers organised from pickup to delivery.","খাবার সংগ্রহ থেকে পৌঁছে দেওয়া পর্যন্ত ধাপগুলো সহজ রাখা।")}</span></li>
  <li class="nx" data-l="04"><b>${b("Growing with communities","মানুষের সঙ্গে এগিয়ে যাওয়া")}</b><span>${b("We aim to improve access, trust and reach as the platform grows.","সেবার পরিধি বাড়ানোর পাশাপাশি বিশ্বাস ও নিরাপত্তা নিশ্চিত করাই লক্ষ্য।")}</span></li></ol></section>
  <section class="sec" style="padding-top:15px"><span class="section-eyebrow">${b("Join the community","আমাদের সঙ্গে যুক্ত হন")}</span><h2>${b("There is a role for everyone","সবার অংশগ্রহণ গুরুত্বপূর্ণ")}</h2><div class="roles">
  <div><em><img src="assets/illustrations/role-donor.svg" alt="" width="56" height="56"></em><h3>${b("Donor","দাতা")}</h3><p>${b("Share safe, fresh surplus food from a home or business.","বাসা বা ব্যবসা প্রতিষ্ঠানের নিরাপদ, তাজা খাবার দিন।")}</p></div>
  <div><em><img src="assets/illustrations/role-ngo.svg" alt="" width="56" height="56"></em><h3>${b("NGO","এনজিও")}</h3><p>${b("Help direct available food toward the communities you serve.","আপনার সেবাগ্রহীতাদের কাছে খাবার পৌঁছাতে সাহায্য করুন।")}</p></div>
  <div><em><img src="assets/illustrations/role-family.svg" alt="" width="56" height="56"></em><h3>${b("Family","পরিবার")}</h3><p>${b("Find nearby food support through a respectful process.","সম্মানজনক প্রক্রিয়ায় আশেপাশের খাবারের সহায়তা খুঁজুন।")}</p></div>
  <div><em><img src="assets/illustrations/role-rider.svg" alt="" width="56" height="56"></em><h3>${b("Rider","রাইডার")}</h3><p>${b("Help deliver available food from one neighbour to another.","একজনের বাড়তি খাবার আরেকজনের কাছে পৌঁছে দিন।")}</p></div></div></section>
  <section class="sec faq" style="padding-top:20px"><h2>${b("Frequently asked questions","প্রায়ই যে প্রশ্নগুলো আসে")}</h2>
  <details><summary>${b("Is the food free?","খাবার কি বিনামূল্যে?")}</summary><p>${b("The food is shared without a food price. A delivery fee may apply, depending on the route and who chooses to cover it.","খাবারের দাম নেই। তবে ডেলিভারির ক্ষেত্রে দূরত্ব ও কে খরচ বহন করবেন, তার ওপর ফি নির্ভর করতে পারে।")}</p></details>
  <details><summary>${b("How are receivers verified?","গ্রহীতা কীভাবে যাচাই হয়?")}</summary><p>${b("The platform is designed for an admin to review relevant registration details or proof before requests are approved.","অনুরোধের অনুমোদনের আগে অ্যাডমিন প্রয়োজনীয় তথ্য বা প্রমাণ যাচাই করার ব্যবস্থা থাকবে।")}</p></details>
  <details><summary>${b("Is every shared meal guaranteed safe?","সব খাবারের নিরাপত্তা কি নিশ্চিত?")}</summary><p>${b("No. The platform does not physically inspect food. Donors should follow safe handling guidance, and receivers should check food before consuming.","না। প্ল্যাটফর্ম নিজে খাবার পরীক্ষা করে না। দাতা নিরাপদে খাবার সংরক্ষণ করবেন এবং গ্রহীতা খাওয়ার আগে যাচাই করবেন।")}</p></details>
  <details><summary>${b("How will delivery updates work?","ডেলিভারির খবর কীভাবে পাব?")}</summary><p>${b("Where rider tracking is enabled, order details can show the pickup, delivery status and map updates.","রাইডার ট্র্যাকিং চালু থাকলে অর্ডারে পিকআপ, ডেলিভারি স্ট্যাটাস এবং ম্যাপ আপডেট দেখা যাবে।")}</p></details></section>`;
const _render = render; render = async function () { await _render(); enhanceUI(); };
addEventListener("hashchange", render);
/*BOOT*/render(); startPreloader();
