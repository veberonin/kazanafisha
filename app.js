(() => {
  "use strict";

  /* ===================== PRELOADER: гарантированное скрытие ===================== */
  function initPreloaderSafety() {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    const hide = () => pre.classList.add("hidden");
    document.addEventListener("DOMContentLoaded", () => setTimeout(hide, 150));
    window.addEventListener("load", () => setTimeout(hide, 150));
    setTimeout(hide, 4000);
  }
  initPreloaderSafety();

  /* ===================== CONSTANTS ===================== */
  const OWNER_EMAIL = "noterlore@gmail.com";
  const CREATOR_NAME = "VOTERLORE";
  const CREATOR_EMAIL = "noterlore@gmail.com";
  const VIP_PRICE = 499;

  const EMAILJS = {
    PUBLIC_KEY: "PASTE_PUBLIC_KEY_HERE",
    SERVICE_ID: "PASTE_SERVICE_ID_HERE",
    TEMPLATE_SUPPORT: "PASTE_TEMPLATE_ID_SUPPORT_HERE",
    TEMPLATE_TICKET: "PASTE_TEMPLATE_ID_TICKET_HERE",
  };

  const METRO = [
    "Кремлёвская","Проспект Победы","Суконная слобода","Аметьево",
    "Площадь Тукая","Козья слобода","Яшьлек"
  ];

  const CATEGORIES = [
    "Музеи","Выставки","Научные мероприятия","Концерты","Театры","Кино","Фестивали","Спорт","Экскурсии","Детям"
  ];

  const WHEEL_PRIZES = [
    { type:"percent", value:5,  label:"-5%"  },
    { type:"percent", value:8,  label:"-8%"  },
    { type:"percent", value:10, label:"-10%" },
    { type:"percent", value:12, label:"-12%" },
    { type:"percent", value:15, label:"-15%" },
    { type:"percent", value:18, label:"-18%" },
    { type:"percent", value:20, label:"-20%" },
    { type:"percent", value:25, label:"-25%" },
    { type:"percent", value:30, label:"-30%" },
    { type:"percent", value:35, label:"-35%" },
    { type:"percent", value:40, label:"-40%" },
    { type:"percent", value:45, label:"-45%" },
    { type:"percent", value:50, label:"-50%" },
    { type:"percent", value:60, label:"-60%" },
    { type:"free", value:100, label:"Бесплатный билет" },
  ];
  /* ===================== NEWS ADS ===================== */
  const NEWS_ADS = [
    {
      href: "https://kapusta.shop/5opkaMellsher", // сюда ссылку, куда ведёт реклама
      src: "https://media1.tenor.com/m/8f3IuKXk7V4AAAAC/streaming-for-alex.gif",
      title: "Реклама 1"
    },
    {
      href: "https://www.tiktok.com/@voterlore?lang=ru-RU", // сюда ссылку, куда ведёт реклама
      src: "https://media1.tenor.com/m/4jbUCERfMZsAAAAC/fire-flame.gif",
      title: "Реклама 2"
    },
  ];

  let newsAdsTimer = null;

  function initNewsAdsRotation(){
    const card = $("#newsAdCard");
    const link = $("#newsAdLink");
    const img  = $("#newsAdGif");

    if (!card || !link || !img) return;

    const ads = NEWS_ADS.filter(a => a && String(a.src || "").trim());

    if (!ads.length){
      card.classList.add("hidden");
      return;
    }

    card.classList.remove("hidden");

    let idx = 0;

    const showAd = () => {
      const ad = ads[idx];

      link.href = ad.href || "#";
      img.src = ad.src;
      img.alt = ad.title || "Реклама";
    };

    showAd();

    if (newsAdsTimer) clearInterval(newsAdsTimer);

    if (ads.length > 1){
      newsAdsTimer = setInterval(() => {
        idx = (idx + 1) % ads.length;
        showAd();
      }, 60_000);
    }
  }

  const K = {
    EVENTS: "kzn_events",
    NEWS: "kzn_news",
    USERS: "kzn_users",
    CUR_USER: "kzn_current_user",
    BAL: "kzn_balances",
    PURCHASES: "kzn_purchases",
    COUPONS: "kzn_coupons",
    CHATS: "kzn_chats",
    NOTIFS_BY_USER: "kzn_notifs_by_user",
    SPINS: "kzn_spins",
    THEME_MODE: "kzn_theme_mode",
    INBOX: "kzn_inbox",
  };
const NEWS_SEED_VERSION = 2; // увеличивай число, когда меняешь seedNews()
const K_NEWS_VER = "kzn_news_seed_version";
  /* ===================== HELPERS ===================== */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const page = document.body?.dataset?.page || "";
  const fmt = (n) => new Intl.NumberFormat("ru-RU").format(n);
  const dayKey = () => new Date().toISOString().slice(0, 10);

  function uid(){ return (crypto?.randomUUID?.() || `id_${Date.now()}_${Math.random().toString(16).slice(2)}`); }
  function qs(name){ return new URL(location.href).searchParams.get(name); }
  function esc(s){ return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m])); }

  function jget(key, fallback){
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function jset(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  /* ===================== THEME auto 19:00/07:00 ===================== */
  function themeModeGet(){ return jget(K.THEME_MODE, "auto"); }
  function themeModeSet(v){ jset(K.THEME_MODE, v); }
  function autoThemeByTime(){
    const h = new Date().getHours();
    return (h >= 19 || h < 7) ? "dark" : "light";
  }
  function applyTheme(){
    const mode = themeModeGet();
    const theme = mode === "auto" ? autoThemeByTime() : mode;
    document.documentElement.dataset.theme = theme;
    const btn = $("#themeBtn");
    if (btn) btn.textContent = `Тема: ${mode === "auto" ? "Авто" : (mode === "dark" ? "Тёмная" : "Светлая")}`;
  }
  function cycleTheme(){
    const cur = themeModeGet();
    const next = cur === "auto" ? "light" : cur === "light" ? "dark" : "auto";
    themeModeSet(next);
    applyTheme();
    toast(`Тема: ${next === "auto" ? "Авто (19:00/07:00)" : (next==="dark" ? "Тёмная" : "Светлая")}`);
  }
  setInterval(() => { if (themeModeGet()==="auto") applyTheme(); }, 60_000);

  /* ===================== TOAST ===================== */
  let toastTimer = null;
  function toast(text){
    const el = $("#toast");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 5000);
  }

  /* ===================== EmailJS ===================== */
  function emailjsReady(){
    return !!window.emailjs
      && EMAILJS.PUBLIC_KEY && !EMAILJS.PUBLIC_KEY.includes("PASTE_")
      && EMAILJS.SERVICE_ID && !EMAILJS.SERVICE_ID.includes("PASTE_");
  }
  function emailjsInit(){
    try{
      if (!emailjsReady()) return false;
      emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY });
      return true;
    }catch{ return false; }
  }
  async function sendSupportEmail({subject,message,from_name,from_email}){
    if (!emailjsInit() || EMAILJS.TEMPLATE_SUPPORT.includes("PASTE_")) throw new Error("EmailJS not configured");
    return emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_SUPPORT, {
      to_email: OWNER_EMAIL, subject, message, from_name, from_email
    });
  }
  async function sendTicketEmail({to_email,to_name,event_title,ticket_code,tier,paid,pay_method}){
    if (!emailjsInit() || EMAILJS.TEMPLATE_TICKET.includes("PASTE_")) throw new Error("EmailJS not configured");
    return emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_TICKET, {
      to_email,to_name,event_title,ticket_code,tier,paid,pay_method
    });
  }

  /* ===================== STATE ===================== */
const state = {
  user: null,
  authMode: "login",
  events: [],
  news: [],
  search: "",
  filters: { min:null, max:null, age:null, metros:[], cats:[] },
  activeTab: "Все",
  map: null,
  wheelRot: 0,
  selectedChatEventId: null,
  orgEditingEventId: null,
  selectedInboxMsgId: null,

  // === НОВОСТИ: настройки сортировки/фильтра ===
  newsSort: jget("kzn_news_sort", "date_desc"),
  newsOnlyHidden: false,
};

  /* ===================== USERS/AUTH ===================== */
  function usersGet(){ return jget(K.USERS, []); }
  function usersSet(v){ jset(K.USERS, v); }
  function curUserGet(){ return jget(K.CUR_USER, null); }
  function curUserSet(v){ jset(K.CUR_USER, v); }

  function updateUserFields(username, patch){
    const users = usersGet();
    const idx = users.findIndex(u => u.username === username);
    if (idx < 0) return false;
    users[idx] = { ...users[idx], ...patch };
    usersSet(users);
    return true;
  }

  function isCreator(u){
    return (u?.username || "").toLowerCase() === CREATOR_NAME.toLowerCase()
      || (u?.email || "").toLowerCase() === CREATOR_EMAIL.toLowerCase();
  }

  function validatePassword(pass){
    const errors = [];
    if (pass.length < 8) errors.push("минимум 8 символов");
    if (!/[A-ZА-Я]/.test(pass)) errors.push("заглавная буква");
    if (!/[a-zа-я]/.test(pass)) errors.push("строчная буква");
    if (!/\d/.test(pass)) errors.push("цифра");
    if (!/[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>/?]/.test(pass)) errors.push("спецсимвол");
    return errors;
  }

 function renderUserLabel(u){
  if (!u) return "Гость";
  const display = (u.displayName?.trim() ? u.displayName.trim() : u.username);
  const creator = isCreator(u);

  let badge = "&nbsp;";
  if (creator) badge = "👑";
  else if (u.role === "organizer") badge = "🎤";
  else if (u.role === "media") badge = "📝";

  const cls = creator
    ? "nickName nick--creator"
    : (u.role === "media"
        ? "nickName nick--media"
        : (u.vip ? "nickName nick--vip" : "nickName"));

  const letter = firstLetter(display);
  const avatarUrl = (u.photoUrl || "").trim();

  return `
    <span class="nickWrap" style="display:inline-flex;align-items:center;gap:8px;">
      <span class="nickAvatar" style="width:26px;height:26px;border-radius:9px;overflow:hidden;border:1px solid var(--border);background:var(--soft);display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;">
        <span class="nickAvatar__fallback">${letter}</span>
        ${avatarUrl ? `<img src="${safeUrl(avatarUrl)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"
             onload="this.previousElementSibling.style.display='none'"
             onerror="this.style.display='none'">` : ``}
      </span>

      <span class="${cls}">${esc(display)}</span>

      <span class="nickBadge" style="font-size:12px;opacity:.9">${badge}</span>
    </span>
  `;
}

function firstLetter(name){
  const s = String(name || "").trim();
  return s ? esc(s[0].toUpperCase()) : "?";
}

  function setUser(u){
    state.user = u;
    curUserSet(u);

    const cu = $("#currentUser");
    if (cu) cu.innerHTML = renderUserLabel(u);

    $("#authBtns")?.classList.toggle("hidden", !!u);
    $("#btnLogout")?.classList.toggle("hidden", !u);
    $("#profileLink")?.classList.toggle("hidden", !u);

    const canManage = !!(u && (u.role === "organizer" || isCreator(u)));
    $("#btnOrgPanel")?.classList.toggle("hidden", !canManage);
    $("#btnOrgEvents")?.classList.toggle("hidden", !canManage);

    $("#orgEventsCard")?.classList.toggle("hidden", !(u && u.role === "organizer"));

    renderBalance();
    renderTickets();
    renderCoupons();
    renderNotifs();

    if (u) toast(isCreator(u) ? "добро пожаловать создатель" : `добро пожаловать, ${u.username}`);
  }

  function requireAuth(){
    if (state.user) return true;
    toast("Нужно войти в аккаунт");
    openAuth("login");
    return false;
  }

  function openAuth(mode){
    state.authMode = mode;
    $("#authTitle") && ($("#authTitle").textContent = mode === "login" ? "Вход" : "Регистрация");
    $("#authSubmit") && ($("#authSubmit").textContent = mode === "login" ? "Войти" : "Зарегистрироваться");
    $("#authSwitch") && ($("#authSwitch").textContent = mode === "login" ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти");
    $("#orgCheckRow")?.classList.toggle("hidden", mode !== "register");
    $("#mediaCheckRow")?.classList.toggle("hidden", mode !== "register");
    openModal("modalAuth");
  }

  function authSubmit(){
    const username = $("#authUser")?.value.trim();
    const email = $("#authEmail")?.value.trim();
    const pass = $("#authPass")?.value || "";
    const isOrg = !!$("#authIsOrg")?.checked;
    const isMedia = !!$("#authIsMedia")?.checked;

    if (!username || !email || !pass) return pushNotifOrToast("Заполни никнейм, email и пароль.");

    const users = usersGet();
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (state.authMode === "register"){
      if (found) return pushNotifOrToast("Такой никнейм уже существует.");

      const errs = validatePassword(pass);
      if (errs.length) return pushNotifOrToast("Пароль слабый: нужно " + errs.join(", "));

      const role = isMedia ? "media" : (isOrg ? "organizer" : "user");
      users.push({ username, email, pass, role, vip:false, displayName:"", photoUrl:"", about:"" });
      usersSet(users);

      balAdd(username, 200);
      setUser({ username, email, role, vip:false, displayName:"", photoUrl:"", about:"" });

      closeModal("modalAuth");
      pushNotifTo(username, `Регистрация успешна (${role}). Бонус 200 ₭.`);
      return;
    }

    if (!found || found.pass !== pass || found.email.toLowerCase() !== email.toLowerCase()){
      return pushNotifOrToast("Неверные данные для входа.");
    }

    setUser({
      username: found.username,
      email: found.email,
      role: found.role || "user",
      vip: !!found.vip,
      displayName: found.displayName || "",
      photoUrl: found.photoUrl || "",
      about: found.about || ""
    });

    closeModal("modalAuth");
    pushNotifTo(found.username, `Вход выполнен: ${found.username}`);
  }

  /* ===================== BALANCE ===================== */
  function balGet(username){ const b=jget(K.BAL,{}); return b[username] ?? 0; }
  function balSet(username, amount){ const b=jget(K.BAL,{}); b[username]=Math.max(0,amount); jset(K.BAL,b); }
  function balAdd(username, delta){ balSet(username, balGet(username)+delta); }
  function renderBalance(){
    const el = $("#balance");
    if (!el) return;
    el.textContent = fmt(state.user ? balGet(state.user.username) : 0);
  }

  /* ===================== PER-USER NOTIFICATIONS ===================== */
  function notifsAll(){ return jget(K.NOTIFS_BY_USER, {}); }
  function notifsSetAll(v){ jset(K.NOTIFS_BY_USER, v); }
  function notifsFor(username){
    const all = notifsAll();
    return all[username] ?? [];
  }
  function pushNotifTo(username, text){
    const all = notifsAll();
    const arr = all[username] ?? [];
    arr.unshift({ id: uid(), ts: Date.now(), text });
    all[username] = arr;
    notifsSetAll(all);
    if (state.user?.username === username) renderNotifs();
  }
  function pushNotifOrToast(text){
    if (state.user) pushNotifTo(state.user.username, text);
    else toast(text);
  }
  function deleteNotif(id){
    if (!state.user) return;
    const username = state.user.username;
    const all = notifsAll();
    all[username] = (all[username] ?? []).filter(n => n.id !== id);
    notifsSetAll(all);
    renderNotifs();
  }
  function renderNotifs(){
    const drop = $("#notifDrop");
    const count = $("#notifCount");
    if (!drop || !count) return;

    if (!state.user){
      count.textContent = "0";
      drop.innerHTML = `<div class="muted small">Войди, чтобы видеть уведомления.</div>`;
      return;
    }

    const arr = notifsFor(state.user.username);
    count.textContent = String(arr.length);

    if (!arr.length){
      drop.innerHTML = `<div class="muted small">Уведомлений нет.</div>`;
      return;
    }

    drop.innerHTML = arr.slice(0, 30).map(n => `
      <div class="item">
        <div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">${esc(n.text)}</div>
          <button class="btn btn--soft btn--sm" data-del-notif="${esc(n.id)}">✕</button>
        </div>
        <div class="muted small" style="margin-top:6px">${new Date(n.ts).toLocaleString("ru-RU")}</div>
      </div>
    `).join("");

    $$("[data-del-notif]").forEach(b => b.addEventListener("click", () => deleteNotif(b.dataset.delNotif)));
  }

  /* ===================== EVENT ID ===================== */
  function eventCode(id){ return `EVT-${String(id).padStart(4, "0")}`; }

  /* ===================== EVENTS ===================== */
  function normalizeEvent(ev){
    return {
      ...ev,
      coverUrl: ev.coverUrl ?? "",
      cardImageUrl: ev.cardImageUrl ?? "",
      videoUrl: ev.videoUrl ?? "",
      rules: ev.rules ?? "",
      coords: Array.isArray(ev.coords) ? ev.coords : [55.7963,49.1088],
      tickets: ev.tickets || { regular:0, vip:0, meet:0 },
      startDate: ev.startDate ?? "",
      endDate: ev.endDate ?? "",
      promoted: !!ev.promoted,
      createdBy: ev.createdBy ?? null,
      metro: ev.metro ?? METRO[0],
      category: ev.category ?? CATEGORIES[0],
      age: Number.isFinite(ev.age) ? ev.age : 0,
      basePrice: Number.isFinite(ev.basePrice) ? ev.basePrice : 0,
      dateText: ev.dateText ?? "",
      venue: ev.venue ?? "",
    };
  }

  function mkEvent(id, category, basePrice, tickets, coverUrl="", coords=[55.7963,49.1088], startDate="", endDate="", promoted=false, videoUrl="", rules=""){
    return normalizeEvent({
      id,
      title: `Название ${id} (вставь сам)`,
      desc: `Описание ${id} (вставь сам)`,
      category,
      metro: METRO[id % METRO.length],
      age: [0,6,12,16,18][id % 5],
      basePrice,
      dateText: "Дата/время (вставь сам)",
      venue: "Место (вставь сам)",

      // ВСТАВЬ СЮДА КАРТИНКУ (фон event.html)
      coverUrl,

      // ВСТАВЬ СЮДА КООРДИНАТЫ (lat,lng)
      coords,

      // ВСТАВЬ СЮДА ВИДЕО (необязательно)
      videoUrl,

      // ПРАВИЛА (можешь заполнить для сидов)
      rules,

      tickets,
      startDate,
      endDate,
      promoted,
      createdBy: CREATOR_NAME
    });
  }

  function seedEvents(){
  // ТУТ ТЫ РУЧНОЙ ЗАПОЛНЯЕШЬ СВОИ СОБЫТИЯ
  return [
    // --- Событие 1: Выставки (Пример) ---
    normalizeEvent({
      id: 1,
      title: "Свет / Тень",        // <--- НАЗВАНИЕ
      desc: "Нестандартное искусство, зрелищные инсталляции современного искусства в стиле Shadow Art (искусство теней).!", // <--- ОПИСАНИЕ
      category: "Выставки",                     // <--- КАТЕГОРИЯ (как в списке CATEGORIES)
      metro: "Кремлёвская",                 // <--- МЕТРО (как в списке METRO)
      age: 0,                                  // <--- ВОЗРАСТ
      basePrice: 1000,                          // <--- БАЗОВАЯ ЦЕНА (₭)
      
      // КАРТИНКИ (прямые ссылки .jpg/.png)
      coverUrl: "https://галереязайцева.рф/sites/default/files/styles/wide/public/2026-04/photo_2024-06-24%2001.56.03_2.jpeg.webp?itok=DKU_jaB3",  // Фон на странице события
      cardImageUrl: "https://галереязайцева.рф/sites/default/files/styles/wide/public/2026-04/2025-10-05%2002.15.55_0.jpg.webp?itok=imIolJIM", // Картинка на главной
      
      // КООРДИНАТЫ (для карты)
      coords: [55.790875, 49.113331],               // [LAT, LNG]
      
      dateText: "15 июня 2026, 19:00",          // Текст даты
      venue: "Галерея Славы Зайцева",         // Место
      startDate: "2026-06-05",                  // Дата начала показа
      endDate: "2026-06-15",                    // Дата скрытия
      
      tickets: { regular: 150, vip: 0, meet: 0 }, // Количество билетов
      promoted: true,                           // Реклама (true/false)
      createdBy: CREATOR_NAME,
      videoUrl: "",                             // Видео (если есть)
      rules: "Фотографирование запрещено."
    }),

    // --- Событие 2: Концерты ---
       // --- Событие 2: Концерты ---
    normalizeEvent({
      id: 2,
      title: "OG Buda",
      desc: "Лето невозможно представить без живого выступления OG Buda с музыкантами.\nНе пропустите!",
      category: "Концерты",
      metro: "Суконная слобода", 
      age: 16,                 // <-- Убрали лишний "+"
      basePrice: 3300,
      coverUrl: "https://i.pinimg.com/736x/a3/09/2b/a3092bcc0ce3f1f42efa27dc648f8d5e.jpg",
      cardImageUrl:"https://i.pinimg.com/1200x/63/21/6e/63216e04f9137d4a960fc5bac273eb57.jpg",
      coords: [55.766318, 49.148784],
      dateText: "26 июля, воскресенье, 20:00",
      venue: "Roof Place",
      startDate: "2026-02-11",
      endDate: "2026-07-27",
      tickets: { regular: 1500, vip: 100, meet: 30 },
      promoted: false,
      createdBy: CREATOR_NAME,
      videoUrl: "",
      rules: "запрещены алкогольные напитки."
    }),

    // --- Событие 3: музеи ---
    normalizeEvent({
      id: 3,
      title: "Машина времени",
      desc: "Участников программы ждёт увлекательное путешествие на машине времени по разным эпохам и встречи с историческими персонажами. Рассказы тюркских кочевников о бескрайних степях, традициях и событиях, встреча с жителем Волжской Булгарии и курсисткой Казанского Императорского Университета, знакомство с представителями эпохи Петра I и Екатерины II и другими историческими личностями. Мгновенное перевоплощение, показ костюмов средневековья и эпохи модерна с элементами театрализации. Блиц-опрос и сюрпризы от действующих персонажей..",
      category: "Музеи",
      metro: "Кремлёвская",
      age: 12,
      basePrice: 500,
      coverUrl: "https://tatmuseum.ru/upload/iblock/624/jk27gk3dlhn46ukkq3dxs2p33r03t99n.jpg", // Если пусто - будет градиент
      cardImageUrl: "https://iskatel.com/wp-content/uploads/2022/10/natsionalnyi-muzei-respubliki-tatarstan-1200x627.jpg",
      coords: [55.795764, 49.108608],
      dateText: "Каждый день, с 10.00 до 18.00 Время:60 мин.",
      venue: "Национальный музей Республики Татарстан",
      startDate: "2026-03-01",
      endDate: "2028-09-30",
      tickets: { regular: 100, vip: 0, meet: 0 },
      promoted: false,
      createdBy: CREATOR_NAME,
      videoUrl: "https://www.youtube.com/watch?v=5lfDtSGM-ks",
      rules: ""
    }),

    // --- Событие 4: Театры ---
    normalizeEvent({
      id: 4,
      title: "Евгений Онегин",
      desc: "«Энциклопедии русской жизни» как личный дневник Пушкина. Ироничная версия Егора Перегудова для тех, кто готов к экспериментам",
      category: "Театры",
      metro: "Козья слобода",
      age: 12,
      basePrice: 1000,
      coverUrl: "https://www.mayakovsky.ru/upload/resize_cache/iblock/0df/813_945_2/0df03de2d543f7721de001ded8169e0a.jpg",
      cardImageUrl: "https://avatars.mds.yandex.net/get-afishanew/18327892/e1abff54-efc4-4b72-bb95-2729ac5fba6d/s190x280",
      coords: [55.827253, 49.093406],
      dateText: "16 июня 2026. 15:00 180 мин.",
      venue: "Киномакс-Тандем",
      startDate: "2026-05-01",
      endDate: "2026-06-17",
      tickets: { regular: 125, vip: 20, meet: 0 },
      promoted: false,
      createdBy: CREATOR_NAME,
      videoUrl: "",
      rules: "Мобильные телефоны выключить."
    }),

    // --- Событие 5: Кино ---
    normalizeEvent({
      id: 5,
      title: "Бойцовский клуб",
      desc: "Бойцовский клуб — психологический триллер Дэвида Финчера по роману Чака Паланика, в котором офисный клерк, уставший от бессмысленной жизни и бессонницы, встречает харизматичного Тайлера Дёрдена. Вместе они создают подпольный клуб, бросающий вызов устоям общества. Фильм известен провокационной философией, визуальной смелостью и стал культовым, хотя и остаётся спорным — одни считают его вдохновляющим, другие видят критику потребительства и поиска свободы.",
      category: "Кино",
      metro: "Козья слобода",
      age: 18,
      basePrice: 300, // Бесплатное событие
      coverUrl: "https://i.pinimg.com/736x/27/17/8c/27178c92fa828f94eb0c8a48ab093979.jpg",
      cardImageUrl: "https://tse3.mm.bing.net/th/id/OIP.7l6N1DInfif1jVohygNfygAAAA?rs=1&pid=ImgDetMain&o=7&rm=3", 
      coords: [55.8198, 49.0927],
      dateText: "16 июня, 19:00",
      venue: "Киномакс-Тандем",
      startDate: "2026-06-12",
      endDate: "2026-06-16",
      tickets: { regular: 350, vip: 0, meet: 0 },
      promoted: true,
      createdBy: CREATOR_NAME,
      videoUrl: "https://rutube.ru/video/df90c64749f7e553ff97b20a54e0f3b5/?r=wd",
      rules: "Не пытайтесь повторяться сцены из фильма, детям вход запрещен"
    }),

    // --- Событие 6: Спорт ---
    normalizeEvent({
      id: 6,
      title: "SMP Formula 4. 2 этап",
      desc: "Формула-4 — в России! 2025 год стал историей российского автоспорта — в России появилась российская Формула! Новый сезон и новые победы! Невероятные эмоции на каждом этапе Чемпионата России Формула-4, которые нельзя пропустить!",
      category: "Спорт",
      metro: "Кремлёвская",
      age: 12,
      basePrice: 1000,
      coverUrl: "https://smpkarting.ru/storage/2025/05/19/3f4372ccf34070614cb76f48cc2fb48103207163.webp", 
      cardImageUrl:"https://sun9-38.userapi.com/s/v1/ig2/vYRpVfEQQ4Gdfd1J-4mtIY92DcysM405FUhvSoya18vde3IoFeBhh8iccOzODhqzTRUrVNKaaskzoSP_kD3lx0hd.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,1600x1600&from=bu&u=lhTa1hzS9K_IKNPLj_jaHvikBfLQlMDAkBDOoySxMHQ&cs=1600x0",
      coords: [55.8406, 49.3508],
      dateText: "17 июня 2026, 10:00",
      venue: "Kazanring Canyon",
      startDate: "2026-05-17",
      endDate: "2026-06-18",
      tickets: { regular: 1500, vip: 50, meet: 0 },
      promoted: false,
      createdBy: CREATOR_NAME,
      videoUrl: "https://vkvideo.ru/video-220934049_456241023",
      rules: "Не мешать проведению мероприятия, помните вы не одни"
    }),

    // --- Событие 7: Детям (Добавь свои данные) ---
    normalizeEvent({
      id: 7,
      title: "Smile Park",
      desc: "Если вы в поисках места для семейного отдыха, где понравится и детям, и взрослым, или хотите весело провести время с друзьями, интерактивный парк развлечений Smile Park — это то, что вам нужно! Приходите к нам за яркими эмоциями и незабываемыми впечатлениями!",
      category: "Детям",
      metro: "Площадь Тукая",
      age: 0,
      basePrice: 1500,
      coverUrl: "https://smile-park.ru/assets/221b4c62c37c70d6b81f2f06d7dfddf80b56d82e-no_2R-7O.webp",
      cardImageUrl: "https://smile-park.ru/assets/smile-park-header-B2DX7b52.webp",
      coords: [55.7899, 49.1218],
      dateText: "Каждую день, 10:00-22:00",
      venue: "Smile Park",
      startDate: "2026-06-01",
      endDate: "2027-06-30",
      tickets: { regular: 150, vip: 50, meet: 0 },
      promoted: false,
      createdBy: CREATOR_NAME,
      videoUrl: "https://youtu.be/1a-F_0okCrA?si=hUTPCLLfYh5Sy1qh",
      rules: "Присутствие родителей обязательно."
    }),

    // --- Событие 8: Фестивали ---
    normalizeEvent({
      id: 8,
      title: "Тату фест",
      desc: "Тату фест — это захватывающая тату-битва и искусство в новом прочтении. На крупнейший тату-фестиваль России соберутся звезды индустрии со всей страны, чтобы продемонстрировать свой талант и побороться за звание лучшего в своём деле.",
      category: "Фестивали",
      metro: "Кремлёвская",
      age: 16,
      basePrice: 300,
      coverUrl: "https://i.pinimg.com/736x/45/65/74/4565747f6637a17174dfd83bf728c964.jpg",
      cardImageUrl: "https://i.pinimg.com/736x/c3/52/3b/c3523b2e8f29d65c16438a9e6d255343.jpg",
      coords: [55.7937, 49.1158],
      dateText: "20 июня 2026",
      venue: "Адонис",
      startDate: "2026-06-01",
      endDate: "2026-06-20",
      tickets: { regular: 250, vip: 40, meet: 0 },
      promoted: true,
      createdBy: CREATOR_NAME,
      videoUrl: "",
      rules: "Без животных."
    })
  ];
}

  function eventsGet(){
    const stored = jget(K.EVENTS, null);
    if (Array.isArray(stored) && stored.length) return stored.map(normalizeEvent);
    const seeded = seedEvents();
    jset(K.EVENTS, seeded);
    return seeded;
  }
  function eventsSet(arr){ jset(K.EVENTS, arr); }

  function addEvent(ev){
    const arr = eventsGet();
    arr.unshift(ev);
    eventsSet(arr);
    state.events = arr;
  }
  function updateEvent(ev){
    const arr = eventsGet().map(x => x.id === ev.id ? ev : x);
    eventsSet(arr);
    state.events = arr;
  }
  function deleteEventById(id){
    const arr = eventsGet().filter(x => x.id !== id);
    eventsSet(arr);
    state.events = arr;
  }

  function totalTickets(ev){
    return (ev.tickets.regular||0) + (ev.tickets.vip||0) + (ev.tickets.meet||0);
  }

  function parseISODate(s){
    if (!s) return null;
    const d = new Date(s + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function isEventActiveNow(ev){
    const now = new Date();
    const s = parseISODate(ev.startDate);
    const e = parseISODate(ev.endDate);
    if (s && now < s) return false;
    if (e){
      const endPlus = new Date(e.getTime() + 24*60*60*1000 - 1);
      if (now > endPlus) return false;
    }
    return true;
  }

  function canManageEvents(){
    return !!(state.user && (state.user.role === "organizer" || isCreator(state.user)));
  }

  function canEditOrDeleteEvent(ev){
    if (!state.user) return false;
    if (isCreator(state.user)) return true;                 // создатель: любое
    if (state.user.role === "organizer") return ev.createdBy === state.user.username; // организатор: только своё
    return false;                                           // обычный: ничего
  }

/* ===================== NEWS ===================== */

function canManageNews(){
  return !!(state.user && (state.user.role === "media" || isCreator(state.user)));

}

function normalizeNews(n){
  const blocks =
    Array.isArray(n?.blocks) ? n.blocks :
    (typeof n?.contentHtml === "string" && n.contentHtml.trim())
      ? [{ type:"html", value: n.contentHtml }]
      : (typeof n?.content === "string" && n.content.trim())
        ? [{ type:"html", value: n.content }]
        : [];

  return {
    id: String(n?.id ?? uid()),
    title: String(n?.title ?? ""),
    date: String(n?.date ?? ""),
    summary: String(n?.summary ?? ""),
    imageUrl: String(n?.imageUrl ?? n?.heroImage ?? ""),       // поддержка старого heroImage
    backgroundUrl: String(n?.backgroundUrl ?? n?.bgUrl ?? ""), // отдельный фон новости
    blocks,
    hidden: !!n?.hidden,
    createdBy: String(n?.createdBy ?? ""),
    ts: Number(n?.ts ?? Date.now())
  };
}

function seedNews(){
  return [
    normalizeNews({
      id: "n1",
      title: "Инклюзивный туризм Казани",
      date: "2026-06-01",
      imageUrl: "https://stcdn.business-online.ru/v3/26-06-04/metshin.jpg_2026_06_04_11_14_09.jpg",
      backgroundUrl: "",
      summary: "Метшин поручил проработать вопрос инклюзивного туризма Казани.",
      blocks: [
        { type:"text", value:"Мэр Казани Ильсур Метшин поручил взять на контроль тему инклюзивного туризма в Казани. Во время встречи с волонтерами агентства «Особый тур» ему рассказали, что в России есть лишь один аналог адаптированных маршрутов для людей с ограниченными возможностями здоровья — в Санкт-Петербурге. Об этом сообщает пресс-служба мэрии столицы РТ.\nМожно делать переносы строк. Сегодня Метшин посетил ресурсный центр АНО «Добрая Казань» на улице Калинина, в котором находятся 9 некоммерческих организаций. Здесь оказывают помощь инвалидам, бойцам СВО и их семьям, а также беременным женщинам и матерям, оказавшимся в трудной жизненной ситуации. Метшин пообщался с волонтерами, чтобы узнать, какая помощь им необходима.\n" },
        { type:"image", value:"https://stcdn.business-online.ru/v3/26-06-04/metshin.jpg_2026_06_04_11_14_09.jpg" },
        { type:"text", value:"Продолжение текста после картинки..." }
      ],
      createdBy: "Редакция"
    }),

    normalizeNews({
      id: "n2",
      title: "Готовить пиццу и работать с VIP-гостями",
      date: "2026-06-10",
      imageUrl: "https://i.pinimg.com/736x/6e/b9/5f/6eb95f5513358f3179e30f0c7a04c844.jpg",
      backgroundUrl: "https://n1s1.hsmedia.ru/6e/b5/68/6eb56804eaefbad9b39a05262bfc9c54/656x493_1_6213126bed127d045260e37fc1120979@1421x1066_0xQU1kp0kx_3202609347768756924.jpg.webp",
      summary: "в новый аквакомплекс в Казани продолжают набирать сотрудников. Появились свежие вакансии",
      blocks: [
        { type:"text", value:"новый аквакомплекс на Кировской дамбе в Казани продолжает набирать сотрудников — свежие вакансии появились в сервисах по поиску работы.\nКомплексу требуется снабженец-экспедитор с зарплатой 80 тысяч рублей в месяц: из требований — опыт от двух лет, навыки переговоров и стрессоустойчивость. В задачи войдут мониторинг рынка, поиск поставщиков, обсуждение цен и документооборот.\nТакже в клуб нужен пиццамейкер на график 3/3 с оплатой 438 рублей в час. Всё, что требуется — уметь готовить пиццу, соблюдать порядок и санитарные нормы, опыт работы не обязателен.\nМенеджеру ресторана предлагают 470 рублей в час, но он должен иметь опыт работы в ресторанах и лидерские качества. Среди задач: управление, решение конфликтов, работа с VIP-гостями, обеспечение персонального подхода и ведение отчетов.\nРанее там уже искали главного бухгалтера за 120 тысяч рублей, среди требований — знание специфики общепита и понимание, как выявлять «левые» списания и недостачу. Повару-универсалу обещают 75 тысяч, администратору-кассиру в открытый бассейн — 60 тысяч рублей в месяц, а инструктору-спасателю — от 3600 рублей за смену. Кроме того, комплексу требуются раннер-официант (300–350 рублей в час), заготовщик барной продукции (столько же), бармен-кассир (390 рублей в час), сотрудник клининга (3500 рублей за смену) и инженер-электрик (2300 рублей в час).\nНапомним, 1 июня комплекс уже открывался в тестовом режиме. Туда приезжал глава республики Рустам Минниханов и лично поздоровался с посетителями. В соцсетях обещают, что официальное открытие скоро, но точную дату пока не называют.\nОсобое возмущение у казанцев вызвали шумозащитные экраны, которыми закрыли комплекс, а заодно и виды на Казанский кремль. Сначала они были сплошными, затем по поручению главы Татарстана щиты заменили на прозрачные. Однако недовольство осталось: горожане призвали вообще отказаться от такого забора.\n" },
        { type:"image", value:"https://n1s1.hsmedia.ru/5d/84/a3/5d84a3b74d4857114b1206000dcf3f77/590x1048_1_0ba6f7baedd05232c59e4582dd9a7ed0@590x1048_0xZZ3p3iZ1_3177314251471864479.jpg.webp" }
      ],
      createdBy: "Редакция"
    })
  ];
}

function newsGet(){
  const storedVer = jget(K_NEWS_VER, 0);
  const stored = jget(K.NEWS, null);

  // Если версия seed-новостей изменилась — перезаписываем новости из seedNews()
  if (storedVer !== NEWS_SEED_VERSION){
    const seeded = seedNews();
    jset(K.NEWS, seeded);
    jset(K_NEWS_VER, NEWS_SEED_VERSION);
    return seeded.map(normalizeNews);
  }

  // Если новости уже есть и версия актуальная — берём из localStorage
  if (Array.isArray(stored) && stored.length){
    return stored.map(normalizeNews);
  }

  // Если новостей нет — создаём из seedNews()
  const seeded = seedNews();
  jset(K.NEWS, seeded);
  jset(K_NEWS_VER, NEWS_SEED_VERSION);
  return seeded.map(normalizeNews);
}

function newsSet(arr){
  jset(K.NEWS, arr.map(normalizeNews));
}

function newsVisibleList(){
  return canManageNews() ? state.news : state.news.filter(n => !n.hidden);
}

function sortNews(arr){
  const list = arr.slice();

  const byDateDesc = (a,b) => (b.date||"").localeCompare(a.date||"");
  const byDateAsc  = (a,b) => (a.date||"").localeCompare(b.date||"");
  const byHiddenFirst  = (a,b) => (Number(!!b.hidden) - Number(!!a.hidden)) || byDateDesc(a,b);
  const byVisibleFirst = (a,b) => (Number(!!a.hidden) - Number(!!b.hidden)) || byDateDesc(a,b);

  switch(state.newsSort){
    case "date_asc": return list.sort(byDateAsc);
    case "hidden_first": return list.sort(byHiddenFirst);
    case "visible_first": return list.sort(byVisibleFirst);
    case "date_desc":
    default: return list.sort(byDateDesc);
  }
}

function newsListForRender(){
  // обычные пользователи скрытые не видят
  let arr = newsVisibleList();

  // админ может включить "только скрытые"
  if (canManageNews() && state.newsOnlyHidden){
    arr = arr.filter(n => !!n.hidden);
  }

  return sortNews(arr);
}

function newsPreviewImage(n){
  if (n.imageUrl) return n.imageUrl;
  const imgBlock = (n.blocks || []).find(b => b.type === "image" && String(b.value||"").trim());
  
  return imgBlock ? imgBlock.value : "";
}

function newsBlocksToHtml(blocks){
  return (blocks || []).map(b => {
    if (b.type === "text"){
      return `<p class="newsP">${esc(b.value || "")}</p>`;
    }
    if (b.type === "image"){
      const u = String(b.value || "").trim();
      if (!u) return "";
      return `<img class="newsImg" src="${safeUrl(u)}" alt="">`;
    }
    if (b.type === "html"){
      // осторожно: это “сырой” HTML (для старых новостей)
      return String(b.value || "");
    }
    return "";
  }).join("");
}
  /* ===================== COUPONS/WHEEL ===================== */
  function couponsAll(){ return jget(K.COUPONS, []); }
  function couponsSet(v){ jset(K.COUPONS, v); }

  function couponsForUser(){
  if (!state.user) return [];
  return couponsAll().filter(c => c.username === state.user.username && !c.used);
}
  function activeCoupon(){
    return couponsForUser().find(c => !c.used) || null;
  }
  function renderCoupons(){
    const box = $("#myCoupons");
    if (!box) return;
    if (!state.user) return box.innerHTML = `<div class="muted">Войди, чтобы видеть купоны.</div>`;

    const arr = couponsForUser();
    if (!arr.length) return box.innerHTML = `<div class="muted">Купонов нет. Крути колесо.</div>`;
    box.innerHTML = arr.map(c => `
      <div class="item">
        <div><b>Купон:</b> ${c.type==="free" ? "Бесплатный билет" : `Скидка ${c.value}%`}</div>
        <div class="muted small" style="margin-top:6px">Статус: ${c.used ? "использован":"активен"}</div>
      </div>
    `).join("");
  }
  function canSpin(){
    if (!state.user) return false;
    const spins = jget(K.SPINS, {});
    return spins[state.user.username] !== dayKey();
  }
  function markSpin(){
    const spins = jget(K.SPINS, {});
    spins[state.user.username] = dayKey();
    jset(K.SPINS, spins);
  }
  function buildWheelGradient(){
    const colors = ["#ff3d6e","#ffb300","#00c2ff","#7cff6b","#b56bff"];
    const n = WHEEL_PRIZES.length;
    const stops = [];
    for (let i=0;i<n;i++){
      const c = colors[i % colors.length];
      const from = (i/n)*100;
      const to = ((i+1)/n)*100;
      stops.push(`${c} ${from}% ${to}%`);
    }
    return `conic-gradient(${stops.join(",")})`;
  }
  function spinWheel(){
    if (!requireAuth()) return;
    const info = $("#spinInfo");
    if (!canSpin()){
      if (info) info.textContent = "Сегодня уже крутили. Возвращайся завтра.";
      return;
    }
    const idx = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[idx];

    const wheel = $("#wheel");
    if (wheel){
      const sector = 360 / WHEEL_PRIZES.length;
      const extra = 360*(3 + Math.floor(Math.random()*3)) + idx*sector;
      state.wheelRot += extra;
      wheel.style.transform = `rotate(${state.wheelRot}deg)`;
    }

    const all = couponsAll();
    all.unshift({ id:uid(), username:state.user.username, type:prize.type, value:prize.value, used:false, ts:Date.now() });
    couponsSet(all);
    markSpin();
    renderCoupons();
    if (info) info.textContent = `Выпало: ${prize.label}. Купон добавлен.`;
    pushNotifTo(state.user.username, `Колесо фортуны: ${prize.label}`);
  }

  /* ===================== PURCHASES + REFUND ===================== */
  function purchasesGet(){ return jget(K.PURCHASES, []); }
  function purchasesSet(v){ jset(K.PURCHASES, v); }

  function tierLabel(t){
    if (t === "vip") return "VIP";
    if (t === "meet") return "Meet&Greed";
    return "Обычный";
  }
  function computePrice(ev, tier){
    const mult = tier === "vip" ? 1.8 : tier === "meet" ? 2.6 : 1;
    const base = Math.round(ev.basePrice * mult);
    const c = activeCoupon();
    if (!c) return { base, final: base, coupon:null };
    if (c.type === "free") return { base, final: 0, coupon:c };
    return { base, final: Math.max(0, Math.round(base*(1 - c.value/100))), coupon:c };
  }

  function openBuy(eventId){
    if (!requireAuth()) return;
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;

    const tiers = [
      { key:"regular", label:"Обычный", left: ev.tickets.regular||0 },
      { key:"vip", label:"VIP", left: ev.tickets.vip||0 },
      { key:"meet", label:"Meet&Greed", left: ev.tickets.meet||0 },
    ].filter(t => t.left > 0);

    const body = $("#buyBody");
    if (!body) return;

    body.innerHTML = `
      <div><b>${esc(ev.title)}</b> <span class="muted small">(${eventCode(ev.id)})</span></div>
      <div class="muted small" style="margin-top:6px">${esc(ev.category)} • ${esc(ev.metro)} • ${ev.age}+</div>

      <div class="form" style="margin-top:12px">
        <label class="field">
          <span>Уровень</span>
          <select id="buyTier" class="input">
            ${tiers.map(t => `<option value="${t.key}">${t.label} (осталось: ${t.left})</option>`).join("")}
          </select>
        </label>

        <label class="field">
          <span>Оплата</span>
          <select id="buyPay" class="input">
            <option value="currency">Валюта сайта (₭)</option>
            <option value="qr">QR (симуляция)</option>
          </select>
        </label>

        <div id="buyInfo" class="note"></div>

        <div class="row">
          <button id="buyConfirm" class="btn btn--primary">Купить</button>
          <button class="btn btn--soft" data-close="modalBuy">Отмена</button>
        </div>
      </div>
    `;

    const update = () => {
      const tier = $("#buyTier").value;
      const pay = $("#buyPay").value;
      const p = computePrice(ev, tier);
      const cText = p.coupon
        ? (p.coupon.type==="free" ? "Купон: бесплатный билет" : `Купон: -${p.coupon.value}%`)
        : "Купон: нет";
      $("#buyInfo").innerHTML = `
        <div><b>Цена:</b> ${fmt(p.final)} ₭ <span class="muted small">(база ${fmt(p.base)} ₭)</span></div>
        <div class="muted small" style="margin-top:6px">${cText}</div>
        <div class="muted small">Баланс: ${fmt(balGet(state.user.username))} ₭</div>
        <div class="muted small">Оплата: ${pay==="currency" ? "валюта" : "QR (демо)"}</div>
      `;
    };

    $("#buyTier").addEventListener("change", update);
    $("#buyPay").addEventListener("change", update);
    $("#buyConfirm").addEventListener("click", () => confirmBuy(ev));
    update();

    openModal("modalBuy");
  }

  async function confirmBuy(ev){
    const tier = $("#buyTier").value;
    const pay = $("#buyPay").value;

    if ((ev.tickets[tier]||0) <= 0) return pushNotifOrToast("Билеты этого уровня закончились.");

    const p = computePrice(ev, tier);
    if (pay === "currency"){
      const b = balGet(state.user.username);
      if (b < p.final) return pushNotifOrToast("Недостаточно валюты.");
      balAdd(state.user.username, -p.final);
    }

    ev.tickets[tier] -= 1;

   // coupon used -> удаляем купон из хранилища (чтобы он исчезал)
if (p.coupon){
  const all = couponsAll().filter(x => x.id !== p.coupon.id);
  couponsSet(all);
}

    state.events = state.events.map(e => e.id === ev.id ? ev : e);
    eventsSet(state.events);

    const ticketCode = `T-${eventCode(ev.id)}-${Date.now().toString(36).toUpperCase()}`;

    const buys = purchasesGet();
    buys.unshift({
      id: uid(),
      username: state.user.username,
      email: state.user.email,
      eventId: ev.id,
      eventCode: eventCode(ev.id),
      eventTitle: ev.title,
      tier,
      tierLabel: tierLabel(tier),
      payMethod: pay,
      paid: p.final,
      ticketCode,
      ts: Date.now()
    });
    purchasesSet(buys);

    closeModal("modalBuy");
    renderBalance();
    renderTickets();
    renderCoupons();
    renderEvents();

    pushNotifTo(state.user.username, `Покупка успешна: ${ev.title} (${eventCode(ev.id)}). Билет: ${ticketCode}. Доступ к чату открыт.`);

    try{
      await sendTicketEmail({
        to_email: state.user.email,
        to_name: state.user.username,
        event_title: ev.title,
        ticket_code: ticketCode,
        tier: tierLabel(tier),
        paid: `${fmt(p.final)} ₭`,
        pay_method: pay === "currency" ? "Валюта" : "QR"
      });
    } catch {}
  }

  function refundPurchase(purchaseId){
    if (!requireAuth()) return;

    const arr = purchasesGet();
    const p = arr.find(x => x.id === purchaseId);
    if (!p) return pushNotifOrToast("Покупка не найдена.");
    if (p.username !== state.user.username) return pushNotifOrToast("Нельзя вернуть чужой билет.");

    const ev = state.events.find(e => e.id === p.eventId);
    if (!ev) return pushNotifOrToast("Событие не найдено.");

    if (!confirm(`Вернуть билет "${p.eventTitle}" (${p.eventCode})?`)) return;

    // возвращаем билет в пул
    const tier = p.tier;
    ev.tickets[tier] = (ev.tickets[tier] || 0) + 1;

    // возвращаем деньги: в прототипе ВСЕГДА на баланс в ₭ (включая QR)
    balAdd(state.user.username, Number(p.paid || 0));

    // удаляем покупку
    const newArr = arr.filter(x => x.id !== purchaseId);
    purchasesSet(newArr);

    // сохраняем событие
    state.events = state.events.map(e => e.id === ev.id ? ev : e);
    eventsSet(state.events);

    // если чат открыт по этому событию — закроем
    if (state.selectedChatEventId === ev.id) closeModal("modalChat");

    renderBalance();
    renderTickets();
    renderEvents();

    pushNotifTo(state.user.username, `Возврат выполнен: ${p.eventTitle} (${p.eventCode}). Возврат: ${fmt(p.paid)} ₭. Доступ к чату снят.`);
  }

  function renderTickets(){
    const box = $("#myTickets");
    if (!box) return;

    if (!state.user) return box.innerHTML = `<div class="muted">Войди, чтобы видеть билеты.</div>`;

    const arr = purchasesGet().filter(p => p.username === state.user.username);
    if (!arr.length) return box.innerHTML = `<div class="muted">Покупок пока нет.</div>`;

    box.innerHTML = arr.map(p => `
      <div class="item">
        <div><b>${esc(p.eventTitle)}</b> <span class="muted small">(${esc(p.eventCode)})</span></div>
        <div class="muted small" style="margin-top:6px">
          Уровень: ${esc(p.tierLabel)} • Оплата: ${p.payMethod === "currency" ? "Валюта" : "QR"} • Сумма: ${fmt(p.paid)} ₭
        </div>
        <div class="muted small" style="margin-top:6px">Билет: <b>${esc(p.ticketCode)}</b></div>
        <div class="row" style="margin-top:10px">
          <button class="btn btn--soft btn--sm" data-chat="${p.eventId}">Чат</button>
          <a class="btn btn--soft btn--sm" href="event.html?id=${p.eventId}">Страница</a>
          <button class="btn btn--soft btn--sm" data-refund="${p.id}">Возврат</button>
        </div>
      </div>
    `).join("");

    $$("[data-chat]").forEach(b => b.addEventListener("click", () => openChat(Number(b.dataset.chat))));
    $$("[data-refund]").forEach(b => b.addEventListener("click", () => refundPurchase(b.dataset.refund)));
  }

  /* ===================== CHAT (доступ по наличию покупки) ===================== */
  function chatsGet(){ return jget(K.CHATS, {}); }
  function chatsSet(v){ jset(K.CHATS, v); }

  function hasChatAccess(eventId){
    if (!state.user) return false;
    return purchasesGet().some(p => p.username === state.user.username && p.eventId === eventId);
  }

  function openChat(eventId){
    if (!requireAuth()) return;

    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;

    if (!hasChatAccess(eventId)) return pushNotifOrToast("Нет доступа к чату. Купи билет.");

    state.selectedChatEventId = eventId;
    $("#chatTitle") && ($("#chatTitle").textContent = `Чат: ${ev.title} (${eventCode(ev.id)})`);
    renderChat();
    openModal("modalChat");
  }

function userByUsername(name){
  return usersGet().find(u => u.username === name) || null;
}

 function renderChat(){
  const box = $("#chatBox");
  if (!box) return;

  const chats = chatsGet();
  const key = String(state.selectedChatEventId);
  const msgs = chats[key] || [];

  box.innerHTML = "";

  msgs.forEach(m => {
    const u = userByUsername(m.username);
    const display = (u?.displayName?.trim() ? u.displayName.trim() : m.username);

    const photo = (u?.photoUrl || "").trim();
    const letter = firstLetter(display);

    const div = document.createElement("div");
    div.className = "msg" + (m.username === state.user.username ? " msg--me" : "");

    div.innerHTML = `
      <div class="msg__avatar">
        <span class="msg__fallback">${letter}</span>
        ${photo ? `<img src="${safeUrl(photo)}" alt=""
          onload="this.previousElementSibling.style.display='none'"
          onerror="this.style.display='none'">` : ``}
      </div>

      <div class="msg__body">
        <div class="msg__name">${esc(display)}</div>
        <div class="msg__text">${esc(m.text)}</div>
      </div>
    `;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

  function sendChat(){
    const inp = $("#chatInput");
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;

    const chats = chatsGet();
    const key = String(state.selectedChatEventId);
    const msgs = chats[key] || [];
    msgs.push({ username: state.user.username, text, ts: Date.now() });
    chats[key] = msgs;
    chatsSet(chats);

    inp.value = "";
    renderChat();
  }

  /* ===================== ORGANIZER: CREATE/EDIT/DELETE ===================== */
  function initOrganizerForm(){
    $("#orgCategory") && ($("#orgCategory").innerHTML = CATEGORIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(""));
    $("#orgMetro") && ($("#orgMetro").innerHTML = METRO.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join(""));

    $("#orgSaveBtn")?.addEventListener("click", () => {
      if (!requireAuth()) return;
      if (!canManageEvents()) return pushNotifOrToast("Нет прав.");
      saveOrganizerEvent();
    });
  }

  function openOrgCreate(){
    state.orgEditingEventId = null;
    $("#orgModalTitle").textContent = "Добавить событие";
    $("#orgTitle").value = "";
    $("#orgDesc").value = "";
    $("#orgRules").value = "";
    $("#orgVenue").value = "";
    $("#orgDateText").value = "";
    $("#orgCoverUrl").value = "";
    $("#orgVideoUrl").value = "";
    $("#orgLat").value = "";
    $("#orgLng").value = "";
    $("#orgStartDate").value = "";
    $("#orgEndDate").value = "";
    $("#orgPrice").value = 500;
    $("#orgTRegular").value = 300;
    $("#orgTVip").value = 50;
    $("#orgTMeet").value = 20;
    $("#orgPromote").checked = false;
    openModal("modalOrg");
  }

function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Для фона
$("#orgCoverFile")?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (file) $("#orgCoverUrl").value = await fileToDataUrl(file);
});

// Для карточки
$("#orgCardImageFile")?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (file) $("#orgCardImageUrl").value = await fileToDataUrl(file);
}); 

  function openOrgEdit(eventId){
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;
    if (!canEditOrDeleteEvent(ev)) return pushNotifOrToast("Нельзя редактировать чужое событие.");

    state.orgEditingEventId = eventId;
    $("#orgModalTitle").textContent = `Редактирование: ${ev.title} (${eventCode(ev.id)})`;

    $("#orgTitle").value = ev.title || "";
    $("#orgDesc").value = ev.desc || "";
    $("#orgRules").value = ev.rules || "";
    $("#orgVenue").value = ev.venue || "";
    $("#orgDateText").value = ev.dateText || "";
    $("#orgCoverUrl").value = ev.coverUrl || "";
    $("#orgCardImageUrl").value = ev.cardImageUrl || "";
    $("#orgVideoUrl").value = ev.videoUrl || "";
    $("#orgLat").value = ev.coords?.[0] ?? "";
    $("#orgLng").value = ev.coords?.[1] ?? "";
    $("#orgStartDate").value = ev.startDate || "";
    $("#orgEndDate").value = ev.endDate || "";
    $("#orgPrice").value = ev.basePrice ?? 0;

    $("#orgCategory").value = ev.category;
    $("#orgMetro").value = ev.metro;
    $("#orgAge").value = ev.age;

    $("#orgTRegular").value = ev.tickets?.regular ?? 0;
    $("#orgTVip").value = ev.tickets?.vip ?? 0;
    $("#orgTMeet").value = ev.tickets?.meet ?? 0;

    $("#orgPromote").checked = !!ev.promoted;
    openModal("modalOrg");
  }

  function saveOrganizerEvent(){
    const title = $("#orgTitle").value.trim();
    const desc = $("#orgDesc").value.trim();
    const rules = $("#orgRules").value.trim();
    const category = $("#orgCategory").value;
    const metro = $("#orgMetro").value;
    const age = Number($("#orgAge").value);
    const basePrice = Number($("#orgPrice").value);
    const venue = $("#orgVenue").value.trim() || "Место (укажи)";
    const dateText = $("#orgDateText").value.trim() || "Дата/время (укажи)";
    const coverUrl = $("#orgCoverUrl").value.trim();
    const cardImageUrl = $("#orgCardImageUrl").value.trim();
    const videoUrl = $("#orgVideoUrl").value.trim();
    const lat = parseFloat($("#orgLat").value);
    const lng = parseFloat($("#orgLng").value);
    const startDate = $("#orgStartDate").value.trim();
    const endDate = $("#orgEndDate").value.trim();
    const tRegular = Number($("#orgTRegular").value);
    const tVip = Number($("#orgTVip").value);
    const tMeet = Number($("#orgTMeet").value);
    const promoted = !!$("#orgPromote").checked;

    if (!title || !desc) return pushNotifOrToast("Заполни название и описание.");
    if (!Number.isFinite(basePrice) || basePrice < 0) return pushNotifOrToast("Некорректная цена.");
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return pushNotifOrToast("Введи корректные LAT/LNG.");
    const total = (tRegular||0)+(tVip||0)+(tMeet||0);
    if (total < 50 || total > 1000) return pushNotifOrToast("Всего билетов должно быть 50..1000.");

    const editingId = state.orgEditingEventId;
    if (editingId){
      const old = state.events.find(e => e.id === editingId);
      if (!old) return pushNotifOrToast("Событие не найдено.");
      if (!canEditOrDeleteEvent(old)) return pushNotifOrToast("Нельзя редактировать чужое.");

      const updated = normalizeEvent({
        ...old,
        title, desc, rules, category, metro, age,
        basePrice, venue, dateText,
        coverUrl, videoUrl, cardImageUrl,
        coords: [lat,lng],
        startDate, endDate,
        tickets: { regular:tRegular||0, vip:tVip||0, meet:tMeet||0 },
        promoted
      });

      state.events = state.events.map(e => e.id === updated.id ? updated : e);
      eventsSet(state.events);
      pushNotifTo(state.user.username, `Событие обновлено: ${updated.title} (${eventCode(updated.id)})`);
    } else {
      const newId = Math.max(0, ...state.events.map(e => e.id)) + 1;
      const ev = normalizeEvent({
        id:newId,
        title, desc, rules, category, metro, age,
        basePrice, venue, dateText,
        coverUrl, 
        cardImageUrl,
        videoUrl,
        coords:[lat,lng],
        startDate, endDate,
        tickets:{ regular:tRegular||0, vip:tVip||0, meet:tMeet||0 },
        promoted,
        createdBy: state.user.username
      });
      addEvent(ev);
      pushNotifTo(state.user.username, `Событие добавлено: ${ev.title} (${eventCode(ev.id)})`);
    }

    closeModal("modalOrg");
    renderEvents();
    renderOrgEventsModal();
  }

  function confirmDeleteEvent(eventId){
    const ev = state.events.find(e => e.id === eventId);
    if (!ev) return;
    if (!canEditOrDeleteEvent(ev)) return pushNotifOrToast("Нельзя удалить чужое событие.");
    if (!confirm(`Удалить событие "${ev.title}" (${eventCode(ev.id)})?`)) return;
    deleteEventById(eventId);
    pushNotifTo(state.user.username, `Событие удалено: ${ev.title} (${eventCode(ev.id)})`);
    renderEvents();
    renderOrgEventsModal();
  }

  function renderOrgEventsModal(){
    const box = $("#orgEventsBody");
    const title = $("#orgEventsTitle");
    if (!box) return;

    if (!state.user || !canManageEvents()){
      box.innerHTML = `<div class="muted">Нет доступа.</div>`;
      return;
    }

    const creator = isCreator(state.user);
    if (title) title.textContent = creator ? "Управление событиями (все)" : "Управление событиями (мои)";

    const list = creator
      ? state.events
      : state.events.filter(e => e.createdBy === state.user.username);

    if (!list.length){
      box.innerHTML = `<div class="muted">Событий нет.</div>`;
      return;
    }

    box.innerHTML = list.map(ev => `
      <div class="item">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-start;">
          <div>
            <div style="font-weight:900">${esc(ev.title)}</div>
            <div class="muted small">ID: ${eventCode(ev.id)} • ${esc(ev.category)} • ${esc(ev.metro)} • ${ev.age}+ • от ${fmt(ev.basePrice)} ₭</div>
            <div class="muted small">Создатель: ${esc(ev.createdBy || "—")}</div>
          </div>
          <div class="row">
            <button class="btn btn--soft btn--sm" data-edit="${ev.id}">Редактировать</button>
            <button class="btn btn--soft btn--sm" data-del="${ev.id}">Удалить</button>
          </div>
        </div>
      </div>
    `).join("");

    $$("[data-edit]").forEach(b => b.addEventListener("click", () => openOrgEdit(Number(b.dataset.edit))));
    $$("[data-del]").forEach(b => b.addEventListener("click", () => confirmDeleteEvent(Number(b.dataset.del))));
  }

  /* ===================== INDEX BACKGROUND SCROLL DIM ===================== */
  function initIndexBgDimming(){
    const bg = $("#pageBg");
    if (!bg) return;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const max = 900;
      const t = Math.min(1, y / max);

      // чем ниже — тем темнее (0.25 -> 0.80)
      const dark = 0.25 + 0.55 * t;
      document.documentElement.style.setProperty("--pageBgDark", dark.toFixed(3));

      // немного уменьшим прозрачность (0.35 -> 0.25)
      const op = 0.35 - 0.10 * t;
      document.documentElement.style.setProperty("--pageBgOpacity", op.toFixed(3));
    };

    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }

  /* ===================== FILTER/RENDER INDEX ===================== */
  function matchEvent(ev){
    if (!isEventActiveNow(ev)) return false;
    if (state.activeTab !== "Все" && ev.category !== state.activeTab) return false;

    const q = state.search.trim().toLowerCase();
    if (q){
      const hay = `${ev.title} ${ev.desc} ${ev.category} ${ev.metro} ${eventCode(ev.id)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    const f = state.filters;
    if (f.min != null && ev.basePrice < f.min) return false;
    if (f.max != null && ev.basePrice > f.max) return false;
    if (f.age != null && ev.age !== f.age) return false;
    if (f.metros.length && !f.metros.includes(ev.metro)) return false;
    if (f.cats.length && !f.cats.includes(ev.category)) return false;

    return true;
  }

  function renderTabs(){
    const box = $("#catTabs");
    if (!box) return;
    const tabs = ["Все", ...CATEGORIES];
    box.innerHTML = tabs.map(t => `<div class="tab ${t===state.activeTab ? "isActive":""}" data-tab="${esc(t)}">${esc(t)}</div>`).join("");
    $$("[data-tab]").forEach(el => el.addEventListener("click", () => {
      state.activeTab = el.dataset.tab;
      renderEvents();
    }));
  }

  function renderChips(){
    const box = $("#activeChips");
    if (!box) return;

    const chips = [];
    const f = state.filters;

    if (state.activeTab !== "Все") chips.push(`Категория: ${state.activeTab}`);
    if (state.search.trim()) chips.push(`Поиск: "${state.search.trim()}"`);
    if (f.min != null) chips.push(`Цена от: ${fmt(f.min)}₭`);
    if (f.max != null) chips.push(`Цена до: ${fmt(f.max)}₭`);
    if (f.age != null) chips.push(`Возраст: ${f.age}+`);
    if (f.metros.length) chips.push(`Метро: ${f.metros.join(", ")}`);
    if (f.cats.length) chips.push(`Категории: ${f.cats.join(", ")}`);

    box.innerHTML = chips.map(c => `<div class="chip">${esc(c)}</div>`).join("");
  }

  function renderEvents(){
    const grid = $("#eventsGrid");
    if (!grid) return;

    renderChips();

    const list = state.events.filter(matchEvent).sort((a,b) => (b.promoted?1:0) - (a.promoted?1:0));
    if (!list.length){
      grid.innerHTML = `<div class="muted">Нет доступных событий (возможно скрыты по датам).</div>`;
      return;
    }

    grid.innerHTML = list.map(ev => `
      <article class="event">
        <div class="event__in">
          <div class="event__img"
     style="background-image: ${ev.cardImageUrl
       ? `url('${safeUrl(ev.cardImageUrl)}')`
       : `linear-gradient(135deg, rgba(255,61,110,.55), rgba(0,194,255,.35))`};">
</div>
          <div style="flex:1">
            <h3 class="event__title">${esc(ev.title)}</h3>
            <div class="event__desc">${esc(ev.desc)}</div>

            <div class="meta">
              <span class="tag">${esc(ev.category)}</span>
              <span class="tag">${esc(ev.metro)}</span>
              <span class="tag">${ev.age}+</span>
              <span class="tag">ID: ${eventCode(ev.id)}</span>
              <span class="tag tag--price">от ${fmt(ev.basePrice)} ₭</span>
              <span class="tag">осталось: ${fmt(totalTickets(ev))}</span>
              ${ev.promoted ? `<span class="tag tag--price">Реклама</span>` : ""}
            </div>

            <div class="event__bottom">
              <div class="muted small">${esc(ev.dateText)} • ${esc(ev.venue)}</div>
              <div class="event__actions">
                <a class="btn btn--soft" href="event.html?id=${ev.id}">Открыть</a>
                <button class="btn btn--primary" data-buy="${ev.id}">Купить</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    $$("[data-buy]").forEach(b => b.addEventListener("click", () => openBuy(Number(b.dataset.buy))));
  }

  function renderFilterSelects(){
    $("#fMetro") && ($("#fMetro").innerHTML = METRO.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join(""));
    $("#fCats") && ($("#fCats").innerHTML = CATEGORIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join(""));
  }

  function renderCatsModal(){
    const box = $("#catsBox");
    if (!box) return;
    box.innerHTML = CATEGORIES.map(c => `<div class="cat" data-cat="${esc(c)}">${esc(c)}</div>`).join("");
    $$("[data-cat]").forEach(el => el.addEventListener("click", () => {
      state.filters.cats = [el.dataset.cat];
      closeModal("modalCats");
      renderEvents();
    }));
  }

  function openFilter(){
    $("#fMin").value = state.filters.min ?? "";
    $("#fMax").value = state.filters.max ?? "";
    $("#fAge").value = state.filters.age ?? "";
    Array.from($("#fMetro").options).forEach(o => o.selected = state.filters.metros.includes(o.value));
    Array.from($("#fCats").options).forEach(o => o.selected = state.filters.cats.includes(o.value));
    openModal("modalFilter");
  }
  function readMulti(sel){ return Array.from(sel.selectedOptions).map(o => o.value); }
  function applyFilter(){
    const min = $("#fMin").value.trim();
    const max = $("#fMax").value.trim();
    const age = $("#fAge").value;
    state.filters.min = min === "" ? null : Number(min);
    state.filters.max = max === "" ? null : Number(max);
    state.filters.age = age === "" ? null : Number(age);
    state.filters.metros = readMulti($("#fMetro"));
    state.filters.cats = readMulti($("#fCats"));
    closeModal("modalFilter");
    renderEvents();
  }
  function resetFilter(){
    state.filters = { min:null, max:null, age:null, metros:[], cats:[] };
    state.search = "";
    $("#searchInput") && ($("#searchInput").value = "");
    closeModal("modalFilter");
    renderEvents();
  }

  /* ===================== AD SLOT ===================== */
  function initAdSlot(){
    const img = $("#adGif");
    const card = $("#adCard");
    if (!img || !card) return;
    if (!img.getAttribute("src")) card.classList.add("hidden");
  }

  /* ===================== NEWS WIDGET/PAGE ===================== */
  function renderNewsWidget(){
  const box = $("#newsWidget");
  if (!box) return;

  const arr = newsVisibleList()
    .slice()
    .sort((a,b)=> (b.date||"").localeCompare(a.date||""))
    .slice(0,4);

  if (!arr.length){
    box.innerHTML = `<div class="muted">Новостей нет.</div>`;
    return;
  }

  box.innerHTML = arr.map(n => `
    <a class="item" href="news.html?id=${encodeURIComponent(n.id)}" style="text-decoration:none;color:inherit">
      <div style="font-weight:900">${esc(n.title)}</div>
      <div class="muted small" style="margin-top:6px">${esc(n.summary||"")}</div>
      <div class="muted small" style="margin-top:6px">Дата: ${esc(n.date||"")}</div>
    </a>
  `).join("");
}

  function applyHeroScrollEffect(){
    const onScroll = () => {
      const y = window.scrollY;
      const max = 450;
      const t = Math.min(1, y / max);
      const dark = 0.10 + 0.65 * t;
      const op = 1.0 - 0.65 * t;
      document.documentElement.style.setProperty("--heroDark", dark.toFixed(3));
      document.documentElement.style.setProperty("--heroOpacity", op.toFixed(3));
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }

function renderNewsPage(){
  const listBox = $("#newsList");
  if (!listBox) return;

  const id = qs("id");
  const hero = $("#newsHero");
  const heroBg = $("#newsHeroBg");
  const titleEl = $("#newsTitle");
  const metaEl = $("#newsMeta");
  const detail = $("#newsDetail");
  const content = $("#newsContent");

  const adminBar = $("#newsAdminBar");
const isDetail = !!id; // если открыта конкретная новость ?id=...
if (adminBar) adminBar.classList.toggle("hidden", !canManageNews() || isDetail);

  if (!id){
    const arr = newsListForRender();

    if (!arr.length){
      listBox.innerHTML = `<div class="muted">Новостей нет.</div>`;
      return;
    }

    listBox.innerHTML = arr.map(n => {
      const img = newsPreviewImage(n);
      const hiddenTag = n.hidden ? `<span class="tag">Скрыто</span>` : "";
      return `
        <div class="event">
          <a href="news.html?id=${encodeURIComponent(n.id)}" style="text-decoration:none;color:inherit">
            <div class="event__in">
              <div class="event__img"
                style="background-image: ${img
                  ? `url('${safeUrl(img)}')`
                  : `linear-gradient(135deg, rgba(255,61,110,.55), rgba(0,194,255,.35))`};">
              </div>
              <div style="flex:1">
                <h3 class="event__title">${esc(n.title)}</h3>
                <div class="event__desc">${esc(n.summary||"")}</div>
                <div class="meta">
                  <span class="tag">Дата: ${esc(n.date||"")}</span>
                  ${hiddenTag}
                  <span class="tag tag--price">Открыть</span>
                </div>
              </div>
            </div>
          </a>

          ${canManageNews() ? `
            <div class="row" style="padding:0 14px 14px 14px;">
              <button class="btn btn--soft btn--sm" data-news-edit="${esc(n.id)}">Редактировать</button>
              <button class="btn btn--soft btn--sm" data-news-hide="${esc(n.id)}">${n.hidden ? "Показать" : "Скрыть"}</button>
              <button class="btn btn--soft btn--sm" data-news-del="${esc(n.id)}">Удалить</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    // bind admin actions in list
    if (canManageNews()){
      $$("[data-news-edit]").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openNewsEditor(b.dataset.newsEdit); }));
      $$("[data-news-hide]").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); toggleNewsHidden(b.dataset.newsHide); }));
      $$("[data-news-del]").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); deleteNewsById(b.dataset.newsDel); }));
    }

    return;
  }

  const n = state.news.find(x => x.id === id);
  if (!n || (n.hidden && !canManageNews())){
    listBox.innerHTML = `<div class="muted">Новость не найдена.</div>`;
    return;
  }

  listBox.classList.add("hidden");
  hero.classList.remove("hidden");
  detail.classList.remove("hidden");

  titleEl.textContent = n.title;
  metaEl.innerHTML = `
    <span class="tag">Дата: ${esc(n.date||"")}</span>
    ${n.createdBy ? `<span class="tag">Автор: ${esc(n.createdBy)}</span>` : ""}
    ${n.hidden ? `<span class="tag">Скрыто</span>` : ""}
  `;

  const bg = (n.backgroundUrl || newsPreviewImage(n) || "").trim();
  heroBg.style.backgroundImage = bg
    ? `url('${safeUrl(bg)}')`
    : `linear-gradient(135deg, rgba(255,61,110,.55), rgba(0,194,255,.35))`;

  content.innerHTML = newsBlocksToHtml(n.blocks);
// Admin buttons in detail
const adminBox = $("#newsDetailAdmin");
if (adminBox){
  const can = canManageNews();
  adminBox.classList.toggle("hidden", !can);

  if (can){
    adminBox.innerHTML = `
      <button class="btn btn--soft btn--sm" id="newsDetailEditBtn">Редактировать</button>
      <button class="btn btn--soft btn--sm" id="newsDetailHideBtn">${n.hidden ? "Показать" : "Скрыть"}</button>
      <button class="btn btn--soft btn--sm" id="newsDetailDelBtn">Удалить</button>
    `;

    $("#newsDetailEditBtn").onclick = () => openNewsEditor(n.id);
    $("#newsDetailHideBtn").onclick = () => toggleNewsHidden(n.id);
    $("#newsDetailDelBtn").onclick = () => deleteNewsById(n.id);
  } else {
    adminBox.innerHTML = "";
  }
}

  applyHeroScrollEffect();
}

// ===== NEWS editor =====
let newsEditorBlocks = [];

function openNewsEditor(newsId = null){
  if (!canManageNews()) return toast("Нет прав.");

  const n = newsId ? state.news.find(x => x.id === newsId) : null;

  $("#newsEdModalTitle").textContent = n ? `Редактирование: ${n.title}` : "Добавить новость";
  $("#newsEdId").value = n ? n.id : "";
  $("#newsEdTitle").value = n ? n.title : "";
  $("#newsEdDate").value = n ? (n.date || "") : new Date().toISOString().slice(0,10);
  $("#newsEdSummary").value = n ? (n.summary || "") : "";
  $("#newsEdImageUrl").value = n ? (n.imageUrl || "") : "";
  $("#newsEdBgUrl").value = n ? (n.backgroundUrl || "") : "";

  newsEditorBlocks = n ? JSON.parse(JSON.stringify(n.blocks || [])) : [];
  if (!newsEditorBlocks.length) newsEditorBlocks = [{ type:"text", value:"" }];

  renderNewsEditorBlocks();
  openModal("modalNewsEdit");
}

function renderNewsEditorBlocks(){
  const box = $("#newsEdBlocks");
  if (!box) return;

  box.innerHTML = newsEditorBlocks.map((b, i) => {
    if (b.type === "image"){
      const u = String(b.value || "").trim();
      return `
        <div class="newsBlock">
          <div class="newsBlock__head">
            <div class="newsBlock__type">Картинка (URL)</div>
            <button class="btn btn--soft btn--sm" data-nb-del="${i}">Удалить</button>
          </div>
          <input class="input" data-nb-img="${i}" placeholder="https://..." value="${esc(u)}">
          ${u ? `<img class="newsImgPreview" src="${safeUrl(u)}" alt="">` : ``}
        </div>
      `;
    }

    // text by default
    return `
      <div class="newsBlock">
        <div class="newsBlock__head">
          <div class="newsBlock__type">Текст</div>
          <button class="btn btn--soft btn--sm" data-nb-del="${i}">Удалить</button>
        </div>
        <textarea class="input" data-nb-text="${i}" rows="4" placeholder="Абзац...">${esc(b.value || "")}</textarea>
      </div>
    `;
  }).join("");

  $$("[data-nb-del]").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.nbDel);
    newsEditorBlocks.splice(i, 1);
    if (!newsEditorBlocks.length) newsEditorBlocks = [{ type:"text", value:"" }];
    renderNewsEditorBlocks();
  }));

  $$("[data-nb-text]").forEach(el => el.addEventListener("input", () => {
    const i = Number(el.dataset.nbText);
    newsEditorBlocks[i].value = el.value;
  }));

  $$("[data-nb-img]").forEach(el => el.addEventListener("input", () => {
    const i = Number(el.dataset.nbImg);
    newsEditorBlocks[i].value = el.value.trim();
  }));
}

function addNewsTextBlock(){
  newsEditorBlocks.push({ type:"text", value:"" });
  renderNewsEditorBlocks();
}
function addNewsImageBlock(){
  newsEditorBlocks.push({ type:"image", value:"" });
  renderNewsEditorBlocks();
}

function saveNewsEditor(){
  if (!canManageNews()) return toast("Нет прав.");

  const id = ($("#newsEdId").value || "").trim();
  const title = ($("#newsEdTitle").value || "").trim();
  const date = ($("#newsEdDate").value || "").trim();
  const summary = ($("#newsEdSummary").value || "").trim();
  const imageUrl = ($("#newsEdImageUrl").value || "").trim();
  const backgroundUrl = ($("#newsEdBgUrl").value || "").trim();

  if (!title) return toast("Заполни заголовок.");

  const blocks = newsEditorBlocks
    .map(b => ({ type: b.type, value: String(b.value || "") }))
    .filter(b => (b.type === "text" ? b.value.trim() : b.value.trim()));

  const finalSummary = summary || (blocks.find(b=>b.type==="text")?.value || "").slice(0, 140);

  const newsObj = normalizeNews({
    id: id || uid(),
    title,
    date,
    summary: finalSummary,
    imageUrl,
    backgroundUrl,
    blocks,
    createdBy: state.user?.username || ""
  });

  if (id){
    state.news = state.news.map(x => x.id === id ? { ...x, ...newsObj } : x);
  } else {
    state.news.unshift(newsObj);
  }

  newsSet(state.news);
  closeModal("modalNewsEdit");
  renderNewsPage();
  renderNewsWidget();
}

function toggleNewsHidden(id){
  if (!canManageNews()) return;
  state.news = state.news.map(n => n.id === id ? { ...n, hidden: !n.hidden } : n);
  newsSet(state.news);
  renderNewsPage();
  renderNewsWidget();
}

function deleteNewsById(id){
  if (!canManageNews()) return;
  if (!confirm("Удалить новость навсегда?")) return;
  state.news = state.news.filter(n => n.id !== id);
  newsSet(state.news);
  renderNewsPage();
  renderNewsWidget();
}

  /* ===================== EVENT PAGE (rules + video) ===================== */
  function applyHeroBackground(url){
    const bg = $("#heroBg");
    if (!bg) return;
    bg.style.backgroundImage = url ? `url('${url}')` : `linear-gradient(135deg, rgba(255,61,110,.55), rgba(0,194,255,.35))`;
    applyHeroScrollEffect();
  }

  function renderEventPage(){
    const id = Number(qs("id"));
    const ev = state.events.find(e => e.id === id);
    if (!ev){ toast("Событие не найдено"); return; }

    $("#evTitle").textContent = ev.title;
    $("#evMeta").innerHTML = `
      <span class="tag">${esc(ev.category)}</span>
      <span class="tag">${esc(ev.metro)}</span>
      <span class="tag">${ev.age}+</span>
      <span class="tag">ID: ${eventCode(ev.id)}</span>
      <span class="tag tag--price">от ${fmt(ev.basePrice)} ₭</span>
    `;

    $("#evDesc").innerHTML = `<div style="white-space:pre-wrap">${esc(ev.desc)}</div>`;
    $("#evInfo").innerHTML = `
      <div><b>ID:</b> ${eventCode(ev.id)}</div>
      <div style="margin-top:6px"><b>Категория:</b> ${esc(ev.category)}</div>
      <div style="margin-top:6px"><b>Метро:</b> ${esc(ev.metro)}</div>
      <div style="margin-top:6px"><b>Возраст:</b> ${ev.age}+</div>
      <div style="margin-top:6px"><b>Цена от:</b> ${fmt(ev.basePrice)} ₭</div>
      <div style="margin-top:6px"><b>Осталось билетов:</b> ${fmt(totalTickets(ev))}</div>
      <div style="margin-top:6px"><b>Дата/время:</b> ${esc(ev.dateText)}</div>
      <div style="margin-top:6px"><b>Место:</b> ${esc(ev.venue)}</div>
    `;

    $("#evRules").textContent = ev.rules?.trim() ? ev.rules.trim() : "Правила не указаны организатором.";

    applyHeroBackground(ev.coverUrl);

    // optional video
    const v = (ev.videoUrl || "").trim();
    const videoCard = $("#videoCard");
    const videoBox = $("#videoBox");
    if (videoCard && videoBox){
      if (!v){
        videoCard.hidden = true;
      } else {
        videoCard.hidden = false;
        if (/\.(mp4|webm|ogg)$/i.test(v)){
          videoBox.innerHTML = `
            <video controls style="width:100%;max-width:920px;border-radius:16px;">
              <source src="${esc(v)}">
              Видео не поддерживается.
            </video>
          `;
        } else {
          videoBox.innerHTML = `
            <div style="position:relative;padding-top:56.25%;border-radius:16px;overflow:hidden;">
              <iframe src="${esc(v)}" style="position:absolute;inset:0;width:100%;height:100%;border:0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          `;
        }
      }
    }

    $("#evBuyBtn")?.addEventListener("click", () => openBuy(ev.id));
    $("#evChatBtn")?.addEventListener("click", () => openChat(ev.id));
    $("#chatSend")?.addEventListener("click", sendChat);
    $("#chatInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });
  }

  /* ===================== MAP ===================== */
  function openMap(){
    openModal("modalMap");
    setTimeout(() => {
      if (!window.L) return;

      if (!state.map){
        state.map = L.map("map").setView([55.7963, 49.1088], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap"
        }).addTo(state.map);
      }

      state.map.eachLayer(layer => { if (layer instanceof L.Marker) layer.remove(); });

      state.events.filter(matchEvent).forEach(ev => {
        const marker = L.marker(ev.coords).addTo(state.map);
        marker.bindPopup(`
          <div style="min-width:240px">
            <div><b>${esc(ev.title)}</b></div>
            <div style="font-size:12px;opacity:.85;margin-top:4px">
              ID: ${eventCode(ev.id)} • ${esc(ev.category)} • ${esc(ev.metro)} • ${ev.age}+
            </div>
            <div style="font-size:12px;opacity:.85;margin-top:4px">
              от ${fmt(ev.basePrice)} ₭ • осталось: ${fmt(totalTickets(ev))}
            </div>
            <div style="margin-top:10px"><a href="event.html?id=${ev.id}">Открыть</a></div>
          </div>
        `);
      });

      state.map.invalidateSize();
    }, 120);
  }

  /* ===================== MODALS ===================== */
  function openModal(id){
    $("#overlay")?.classList.remove("hidden");
    document.getElementById(id)?.classList.remove("hidden");
  }
  function closeModal(id){
    document.getElementById(id)?.classList.add("hidden");
    $("#overlay")?.classList.add("hidden");
  }
  function closeAllModals(){
    $("#overlay")?.classList.add("hidden");
    $$(".modal").forEach(m => m.classList.add("hidden"));
  }

  function bindModalClose(){
    $("#overlay")?.addEventListener("click", closeAllModals);
    $$("[data-close]").forEach(b => b.addEventListener("click", () => closeModal(b.dataset.close)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllModals(); });
  }

  /* ===================== SUPPORT (минимально) ===================== */
  function botAnswer(q){
    const t = q.toLowerCase();
    if (/(куп(ить|лю)|оплат|qr)/.test(t)) return "Купить: открой событие → Купить → уровень → валюта/QR. После покупки откроется чат.";
    if (/(валют|баланс|попол|подар)/.test(t)) return "Валюта: 1 ₭ = 1 руб. Пополнение: Купить валюту. Подарок: Подарить.";
    if (/(колес|форту|купон)/.test(t)) return "Колесо: 1 раз в день, 15 исходов. Купон применяется к следующей покупке.";
    if (/(возврат)/.test(t)) return "Возврат: открой «Мои билеты» → «Возврат». Деньги вернутся на баланс, доступ к чату снимется.";
    return "Уточни: покупка/оплата, валюта, колесо, чат, возврат.";
  }
  function pushBotMsg(text, mine=false){
    const box = $("#botChat");
    if (!box) return;
    const div = document.createElement("div");
    div.className = "msg" + (mine ? " msg--me" : "");
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  function bindBotQuickButtons(){
    $$("[data-botq]").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.dataset.botq;
        pushBotMsg(q, true);
        setTimeout(() => pushBotMsg(botAnswer(q), false), 140);
      });
    });
  }

  async function supportSendToCreator(){
    if (!requireAuth()) return;
    const subject = ($("#supSubject")?.value || "").trim() || "Сообщение с сайта";
    const message = ($("#supMessage")?.value || "").trim();
    if (!message) return pushNotifOrToast("Напиши сообщение.");

    const mailto = `mailto:${encodeURIComponent(OWNER_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    $("#supMailto") && ($("#supMailto").href = mailto);

    try{
      await sendSupportEmail({ subject, message, from_name: state.user.username, from_email: state.user.email });
      pushNotifTo(state.user.username, "Сообщение отправлено создателю (EmailJS).");
    }catch{
      pushNotifTo(state.user.username, "(EmailJS не настроен) Используй mailto.");
    }
  }

  function sendQuestionToOrganizer(){
    if (!requireAuth()) return;
    const to = ($("#msgToOrg")?.value || "").trim();
    const text = ($("#msgToOrgText")?.value || "").trim();
    if (!to || !text) return pushNotifOrToast("Заполни ник организатора и вопрос.");
    const u = usersGet().find(x => x.username.toLowerCase() === to.toLowerCase());
    if (!u) return pushNotifOrToast("Пользователь не найден.");
    if ((u.role || "user") !== "organizer") return pushNotifOrToast("Этот пользователь не организатор.");
    pushNotifTo(u.username, `Вопрос от ${state.user.username}: ${text.slice(0, 80)}${text.length>80?"...":""}`);
    pushNotifTo(state.user.username, "Сообщение организатору отправлено (уведомлением).");
    $("#msgToOrgText").value = "";
  }

  /* ===================== TOPUP/GIFT/VIP ===================== */
  function topup(){
    if (!requireAuth()) return;
    const amount = Number($("#topupAmount")?.value);
    if (!Number.isFinite(amount) || amount <= 0) return pushNotifOrToast("Некорректная сумма.");
    balAdd(state.user.username, amount);
    renderBalance();
    closeModal("modalTopup");
    pushNotifTo(state.user.username, `Баланс пополнен на ${fmt(amount)} ₭.`);
  }
  function gift(){
    if (!requireAuth()) return;
    const to = ($("#giftTo")?.value || "").trim();
    const amount = Number($("#giftAmount")?.value);
    if (!to) return pushNotifOrToast("Укажи никнейм получателя.");
    if (!Number.isFinite(amount) || amount <= 0) return pushNotifOrToast("Некорректная сумма.");
    if (balGet(state.user.username) < amount) return pushNotifOrToast("Недостаточно средств.");
    const u = usersGet().find(x => x.username.toLowerCase() === to.toLowerCase());
    if (!u) return pushNotifOrToast("Получатель не найден (демо: в этом браузере).");
    balAdd(state.user.username, -amount);
    balAdd(u.username, +amount);
    renderBalance();
    closeModal("modalGift");
    pushNotifTo(state.user.username, `Подарок: ${fmt(amount)} ₭ пользователю ${u.username}.`);
    pushNotifTo(u.username, `Тебе подарили ${fmt(amount)} ₭ от ${state.user.username}.`);
  }
  function buyVip(){
    if (!requireAuth()) return;
    if (isCreator(state.user)) return pushNotifOrToast("Создателю VIP не нужен.");
    if (state.user.vip) return pushNotifOrToast("VIP уже активирован.");
    const b = balGet(state.user.username);
    if (b < VIP_PRICE) return pushNotifOrToast("Недостаточно валюты для VIP.");
    balAdd(state.user.username, -VIP_PRICE);
    updateUserFields(state.user.username, { vip: true });
    state.user.vip = true;
    curUserSet(state.user);
    renderBalance();
    setUser({ ...state.user });
    pushNotifTo(state.user.username, `VIP активирован! Цена: ${VIP_PRICE} ₭.`);
  }

  /* ===================== MODAL BINDINGS + PAGE BINDINGS ===================== */
  function bindCommon(){
    applyTheme();
    $("#themeBtn")?.addEventListener("click", cycleTheme);

    bindModalClose();

    // restore user
    const cu = curUserGet();
    if (cu && cu.username){
      const u = usersGet().find(x => x.username === cu.username);
      if (u){
        setUser({
          username: u.username, email: u.email,
          role: u.role || "user",
          vip: !!u.vip,
          displayName: u.displayName || "",
          photoUrl: u.photoUrl || "",
          about: u.about || ""
        });
      } else setUser(null);
    } else setUser(null);

    // notif dropdown
    $("#btnNotif")?.addEventListener("click", () => $("#notifDrop")?.classList.toggle("hidden"));
    document.addEventListener("click", (e) => {
      const n = document.querySelector(".notif");
      if (n && !n.contains(e.target)) $("#notifDrop")?.classList.add("hidden");
    });
  }

  function bindIndex(){
    initIndexBgDimming();

    $("#btnRegister")?.addEventListener("click", () => openAuth("register"));
    $("#btnLogin")?.addEventListener("click", () => openAuth("login"));
    $("#authSwitch")?.addEventListener("click", () => openAuth(state.authMode === "login" ? "register" : "login"));
    $("#authSubmit")?.addEventListener("click", authSubmit);
    // взаимоисключающие роли: организатор и СМИ
$("#authIsOrg")?.addEventListener("change", () => {
  if ($("#authIsOrg").checked) $("#authIsMedia").checked = false;
});
$("#authIsMedia")?.addEventListener("change", () => {
  if ($("#authIsMedia").checked) $("#authIsOrg").checked = false;
});

    $("#btnLogout")?.addEventListener("click", () => {
      setUser(null);
      toast("Вы вышли из аккаунта");
      renderEvents();
    });

    $("#searchBtn")?.addEventListener("click", () => { state.search = $("#searchInput").value; renderEvents(); });
    $("#searchInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter"){ state.search = $("#searchInput").value; renderEvents(); } });

    $("#btnFilter")?.addEventListener("click", openFilter);
    $("#applyFilter")?.addEventListener("click", applyFilter);
    $("#resetFilter")?.addEventListener("click", resetFilter);
    $("#btnCategories")?.addEventListener("click", () => openModal("modalCats"));

    $("#btnMap")?.addEventListener("click", openMap);

    $("#btnWheel")?.addEventListener("click", () => {
      $("#spinInfo").textContent = state.user
        ? (canSpin() ? "Готово! Можешь крутить." : "Сегодня уже крутили. Возвращайся завтра.")
        : "Войди, чтобы крутить.";
      openModal("modalWheel");
    });
    $("#spin")?.addEventListener("click", spinWheel);

    $("#btnSupport")?.addEventListener("click", () => openModal("modalSupport"));
    if ($("#botChat")){
      $("#botChat").innerHTML = "";
      pushBotMsg("Привет! Я бот поддержки. Нажми кнопку или напиши вопрос.", false);
    }
    $("#botSend")?.addEventListener("click", () => {
      const q = ($("#botInput")?.value || "").trim();
      if (!q) return;
      pushBotMsg(q, true);
      $("#botInput").value = "";
      setTimeout(() => pushBotMsg(botAnswer(q), false), 140);
    });
    $("#botInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#botSend")?.click(); });
    bindBotQuickButtons();

    $("#supSend")?.addEventListener("click", supportSendToCreator);
    $("#supMailto")?.addEventListener("click", () => {
      const subject = ($("#supSubject")?.value || "").trim() || "Сообщение с сайта";
      const message = ($("#supMessage")?.value || "").trim() || "(пусто)";
      $("#supMailto").href = `mailto:${encodeURIComponent(OWNER_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    });
    $("#msgToOrgSend")?.addEventListener("click", sendQuestionToOrganizer);

    $("#btnTopup")?.addEventListener("click", () => { if (!requireAuth()) return; openModal("modalTopup"); });
    $("#topupConfirm")?.addEventListener("click", topup);

    $("#btnGift")?.addEventListener("click", () => { if (!requireAuth()) return; openModal("modalGift"); });
    $("#giftConfirm")?.addEventListener("click", gift);

    $("#chatSend")?.addEventListener("click", sendChat);
    $("#chatInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });

    // organizer/admin
    initOrganizerForm();
    $("#btnOrgPanel")?.addEventListener("click", openOrgCreate);
    $("#btnOrgEvents")?.addEventListener("click", () => { renderOrgEventsModal(); openModal("modalOrgEvents"); });

    $("#wheel") && ($("#wheel").style.background = buildWheelGradient());

    initAdSlot();
  }

function bindNews(){
  $("#btnNewsAdd")?.addEventListener("click", () => openNewsEditor(null));
  $("#btnNewsResetSeed")?.addEventListener("click", () => {
    if (!canManageNews()) return;
    if (!confirm("Сбросить новости к сид-новостям? (перезапишет текущие)")) return;
    state.news = seedNews();
    newsSet(state.news);
    renderNewsPage();
    renderNewsWidget();
    initNewsAdsRotation();
  });

  // сортировка
  const sortSel = $("#newsSort");
  if (sortSel){
    sortSel.value = state.newsSort || "date_desc";
    sortSel.addEventListener("change", () => {
      state.newsSort = sortSel.value;
      jset("kzn_news_sort", state.newsSort);
      renderNewsPage();
    });
  }

  // только скрытые (видно только СМИ/создателю — панель и так скрыта для обычных)
  const onlyHidden = $("#newsOnlyHidden");
  if (onlyHidden){
    onlyHidden.checked = !!state.newsOnlyHidden;
    onlyHidden.addEventListener("change", () => {
      state.newsOnlyHidden = !!onlyHidden.checked;
      renderNewsPage();
    });
  }

    $("#newsAddTextBlock")?.addEventListener("click", addNewsTextBlock);
  $("#newsAddImageBlock")?.addEventListener("click", addNewsImageBlock);
  $("#newsSaveBtn")?.addEventListener("click", saveNewsEditor);

  // запуск рекламы на странице новостей
  initNewsAdsRotation();
}

  function bindProfile(){
    $("#pSaveBtn")?.addEventListener("click", () => {
      if (!state.user) return;
      updateUserFields(state.user.username, {
        displayName: ($("#pDisplayName")?.value || "").trim(),
        photoUrl: ($("#pPhotoUrl")?.value || "").trim(),
        about: ($("#pAbout")?.value || "").trim(),
      });
      const u = usersGet().find(x => x.username === state.user.username);
      state.user = { username:u.username, email:u.email, role:u.role||"user", vip:!!u.vip, displayName:u.displayName||"", photoUrl:u.photoUrl||"", about:u.about||"" };
      curUserSet(state.user);
      setUser({ ...state.user });
      toast("Профиль сохранён");
      renderProfilePage();
    });

    $("#buyVipBtn")?.addEventListener("click", buyVip);
  }

  function renderProfilePage(){
    if (!state.user){
      toast("Нужно войти");
      location.href = "index.html";
      return;
    }

    $("#profileHeader").innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div style="width:64px;height:64px;border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--panel2)">
          <img src="${esc(state.user.photoUrl||"")}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
        </div>
        <div>
          <div>${renderUserLabel(state.user)}</div>
          <div class="muted small">Логин: ${esc(state.user.username)} • Роль: ${esc(state.user.role||"user")} • VIP: ${state.user.vip ? "да":"нет"}</div>
        </div>
      </div>
    `;

    $("#pDisplayName").value = state.user.displayName || "";
    $("#pPhotoUrl").value = state.user.photoUrl || "";
    $("#pAbout").value = state.user.about || "";

    $("#buyVipBtn")?.classList.toggle("hidden", isCreator(state.user));

    // organizer list
    if (state.user.role === "organizer"){
      const mine = state.events.filter(e => e.createdBy === state.user.username);
      $("#orgEventsInline").innerHTML = mine.length ? mine.map(ev => `
        <div class="item">
          <div style="font-weight:900">${esc(ev.title)} <span class="muted small">(${eventCode(ev.id)})</span></div>
          <div class="muted small" style="margin-top:6px">${esc(ev.dateText)} • ${esc(ev.venue)}</div>
          <div class="row" style="margin-top:10px">
            <a class="btn btn--soft btn--sm" href="event.html?id=${ev.id}">Открыть</a>
          </div>
        </div>
      `).join("") : `<div class="muted">Событий нет.</div>`;
    }
  }

  /* ===================== MODAL CLOSE BIND ===================== */
  function bindCloseButtons(){
    $$("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => closeModal(btn.dataset.close));
    });
  }

  /* ===================== BOOT ===================== */
  function boot(){
    state.events = eventsGet();
    state.news = newsGet();

    // render user label on pages with #currentUser
    const cu = $("#currentUser");
    if (cu) cu.innerHTML = renderUserLabel(state.user);

    if (page === "index"){
      renderFilterSelects();
      renderCatsModal();
      renderTabs();
      renderEvents();
      renderNewsWidget();
      renderTickets();
      renderCoupons();
      renderBalance();
      renderOrgEventsModal();
    }

    if (page === "event"){
      renderEventPage();
    }

    if (page === "news"){
      renderNewsPage();
    }

    if (page === "profile"){
      renderProfilePage();
    }
  }
function safeUrl(u){
  u = String(u || "").trim();
  if (!u) return "";
  if (/^javascript:/i.test(u)) return ""; // минимальная защита
  return u.replace(/"/g, "%22").replace(/'/g, "%27");
}
function openModal(id){
  $("#overlay")?.classList.remove("hidden");
  const m = document.getElementById(id);
  m?.classList.remove("hidden");
  const body = m?.querySelector(".modal__body");
  if (body) body.scrollTop = 0;
}

  /* ===================== START ===================== */
  try{
    bindCommon();
    bindCloseButtons();
    if (page === "index") bindIndex();
    if (page === "profile") bindProfile();
    if (page === "news") bindNews();
    boot();
  }catch(err){
    console.error(err);
    // даже если всё упало — убираем прелоудер
    document.getElementById("preloader")?.classList.add("hidden");
    toast("Ошибка скрипта. Открой консоль (F12) для деталей.");
  }

})();
