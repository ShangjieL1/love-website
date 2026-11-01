/* ============================================================
   我们的恋爱小站 · 主逻辑
   ============================================================ */
(function () {
  "use strict";
  var D = window.SITE_DATA, C = window.SITE_CONFIG;
  var $ = function (s) { return document.querySelector(s); };

  /* ---------------- 基础内容填充 ---------------- */
  document.title = D.title + " ❤️";
  $("#nav-title").textContent = D.title;
  $("#name-him").textContent = D.him.name;
  $("#name-her").textContent = D.her.name;
  $("#avatar-him").src = D.him.avatar;
  $("#avatar-her").src = D.her.avatar;
  $("#hero-text").textContent = D.heroText;
  $("#since-date").textContent = D.startDate;

  /* ---------------- 飘落爱心 ---------------- */
  var HEARTS = ["❤️", "💕", "💖", "💗", "🌸", "✨", "🩷"];
  setInterval(function () {
    var h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    var size = 12 + Math.random() * 16;
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = size + "px";
    h.style.animationDuration = 7 + Math.random() * 5 + "s";
    document.getElementById("hearts-layer").appendChild(h);
    h.addEventListener("animationend", function () { h.remove(); });
  }, 1100);

  /* ---------------- 恋爱计时 ---------------- */
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var start = new Date(D.startDate + "T00:00:00");
    var now = new Date();
    var ms = now - start;
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var totalDays = Math.floor(s / 86400);
    /* 日历精确的 年/月/日 拆分 */
    var y = start.getFullYear(), m = start.getMonth(), d = start.getDate();
    var years = 0, months = 0;
    var cursor = new Date(start);
    while (true) {
      var t = new Date(cursor); t.setFullYear(t.getFullYear() + 1);
      if (t <= now) { cursor = t; years++; } else break;
    }
    while (true) {
      var t2 = new Date(cursor); t2.setMonth(t2.getMonth() + 1);
      if (t2 <= now) { cursor = t2; months++; } else break;
    }
    var days = Math.floor((now - cursor) / 86400000);
    var rem = s % 86400;
    $("#t-years").textContent = years;
    $("#t-months").textContent = months;
    $("#t-days").textContent = days;
    $("#t-hours").textContent = pad2(Math.floor(rem / 3600));
    $("#t-mins").textContent = pad2(Math.floor(rem % 3600 / 60));
    $("#t-secs").textContent = pad2(rem % 60);
    $("#t-total").textContent = totalDays.toLocaleString();
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------- 滚动浮现 ---------------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  function watchReveal(el) { el.classList.add("reveal"); io.observe(el); }

  /* ---------------- 导航高亮 ---------------- */
  var secs = ["home", "album", "timeline", "list", "board"];
  var navIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        document.querySelectorAll(".nav-links a").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });

  /* ---------------- 相册 ---------------- */
  var grid = $("#album-grid");
  D.album.forEach(function (p, i) {
    var card = document.createElement("div");
    card.className = "photo-card";
    var img = document.createElement("img");
    img.src = p.src; img.alt = p.caption; img.loading = "lazy";
    var cap = document.createElement("div");
    cap.className = "photo-cap";
    var b = document.createElement("b"); b.textContent = p.caption;
    var dt = document.createElement("i"); dt.textContent = p.date || "";
    cap.appendChild(b); cap.appendChild(dt);
    card.appendChild(img); card.appendChild(cap);
    card.addEventListener("click", function () { openLightbox(i); });
    grid.appendChild(card);
    watchReveal(card);
  });

  /* ---------------- 图片查看器 ---------------- */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"), lbIdx = 0;
  function openLightbox(i) {
    lbIdx = (i + D.album.length) % D.album.length;
    lbImg.src = D.album[lbIdx].src;
    lbCap.textContent = D.album[lbIdx].caption + (D.album[lbIdx].date ? " · " + D.album[lbIdx].date : "");
    lb.classList.remove("hidden");
  }
  $("#lb-close").addEventListener("click", function () { lb.classList.add("hidden"); });
  $("#lb-prev").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIdx - 1); });
  $("#lb-next").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.add("hidden"); });
  document.addEventListener("keydown", function (e) {
    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape") lb.classList.add("hidden");
    if (e.key === "ArrowLeft") openLightbox(lbIdx - 1);
    if (e.key === "ArrowRight") openLightbox(lbIdx + 1);
  });

  /* ---------------- 点点滴滴 · 时间线 ---------------- */
  var tl = $("#timeline-list");
  D.timeline.forEach(function (item) {
    var li = document.createElement("div");
    li.className = "tl-item";
    var dot = document.createElement("div"); dot.className = "tl-dot"; dot.textContent = item.icon || "❤️";
    var card = document.createElement("div"); card.className = "tl-card";
    var date = document.createElement("span"); date.className = "tl-date"; date.textContent = item.date;
    var title = document.createElement("div"); title.className = "tl-title"; title.textContent = item.title;
    var text = document.createElement("p"); text.className = "tl-text"; text.textContent = item.text;
    card.appendChild(date); card.appendChild(title); card.appendChild(text);
    li.appendChild(dot); li.appendChild(card);
    tl.appendChild(li);
    watchReveal(card);
  });

  /* ---------------- 恋爱清单 ---------------- */
  var checkGrid = $("#check-grid");
  var LS_KEY = "love_check_state_v1";
  var checkState = {};
  try { checkState = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { }
  function renderChecks() {
    checkGrid.innerHTML = "";
    var done = 0;
    D.checklist.forEach(function (item, i) {
      var isDone = typeof checkState[i] === "boolean" ? checkState[i] : !!item.done;
      if (isDone) done++;
      var card = document.createElement("div");
      card.className = "check-card" + (isDone ? " done" : "");
      var box = document.createElement("div"); box.className = "box"; box.textContent = isDone ? "❤️" : "";
      var txt = document.createElement("span"); txt.className = "text"; txt.textContent = item.text;
      card.appendChild(box); card.appendChild(txt);
      card.addEventListener("click", function (ev) {
        checkState[i] = !(typeof checkState[i] === "boolean" ? checkState[i] : !!item.done);
        localStorage.setItem(LS_KEY, JSON.stringify(checkState));
        renderChecks();
        var sp = document.createElement("span");
        sp.className = "spark"; sp.textContent = "✨";
        sp.style.left = ev.clientX + "px"; sp.style.top = (ev.clientY - 10) + "px";
        document.body.appendChild(sp);
        setTimeout(function () { sp.remove(); }, 900);
      });
      checkGrid.appendChild(card);
    });
    var pct = D.checklist.length ? Math.round(done / D.checklist.length * 100) : 0;
    $("#list-progress-bar").style.width = pct + "%";
    $("#list-progress-text").textContent = done + " / " + D.checklist.length + " · " + pct + "%";
  }
  renderChecks();

  /* ============================================================
     留言板 · 云端同步
     读取：jsonblob(可选) → kvdb(可选) → GitHub API/CDN → 本地缓存
     写入：jsonblob/kvdb(可选) → GitHub Contents API（需密钥）
     ============================================================ */
  var MSGS_LS = "love_msgs_cache_v1", KEY_LS = "love_github_key";
  var msgWall = $("#msg-wall"), syncTip = $("#board-sync");
  var messages = [];

  function esc(s) { return String(s); }
  function timeStr(ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }
  function b64utf8(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin);
  }
  function unb64utf8(b64) {
    var bin = atob(b64.replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function renderMsgs() {
    msgWall.innerHTML = "";
    if (!messages.length) {
      var e = document.createElement("div"); e.className = "msg-empty";
      e.textContent = "还没有留言，来写下第一句吧 🥰";
      msgWall.appendChild(e); return;
    }
    messages.slice().sort(function (a, b) { return b.ts - a.ts; }).forEach(function (m) {
      var card = document.createElement("div"); card.className = "msg-card";
      var t = document.createElement("div"); t.className = "msg-text"; t.textContent = m.t;
      var meta = document.createElement("div"); meta.className = "msg-meta";
      var name = document.createElement("span"); name.className = "msg-name"; name.textContent = "💌 " + esc(m.n);
      var time = document.createElement("span"); time.textContent = timeStr(m.ts);
      meta.appendChild(name); meta.appendChild(time);
      card.appendChild(t); card.appendChild(meta);
      msgWall.appendChild(card);
    });
  }
  function cacheMsgs() { try { localStorage.setItem(MSGS_LS, JSON.stringify(messages)); } catch (e) { } }
  function setTip(txt, ok) { syncTip.textContent = txt; syncTip.style.color = ok ? "var(--rose)" : "#c0392b"; }

  var readURLs = [];
  if (C.messages.jsonblobUrl) readURLs.push({ url: C.messages.jsonblobUrl, type: "array" });
  if (C.messages.kvdbUrl) readURLs.push({ url: C.messages.kvdbUrl, type: "array" });
  (function () {
    var r = C.repo, p = C.messages.githubPath;
    readURLs.push({ url: "https://api.github.com/repos/" + r.owner + "/" + r.name + "/contents/" + p + "?ref=" + r.branch + "&t=" + Date.now(), type: "gh" });
    readURLs.push({ url: "https://raw.githubusercontent.com/" + r.owner + "/" + r.name + "/" + r.branch + "/" + p + "?t=" + Date.now(), type: "raw" });
    readURLs.push({ url: "https://cdn.jsdelivr.net/gh/" + r.owner + "/" + r.name + "@" + r.branch + "/" + p, type: "raw" });
  })();

  function loadMessages() {
    setTip("正在同步云端留言…");
    var i = 0;
    function tryNext() {
      if (i >= readURLs.length) {
        try { messages = JSON.parse(localStorage.getItem(MSGS_LS) || "[]"); } catch (e) { messages = []; }
        renderMsgs();
        setTip("云端暂时连不上，先看看本机留言 ✍️");
        return;
      }
      var src = readURLs[i++];
      fetch(src.url, { headers: { "Accept": "application/json" }, cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          var list = src.type === "gh" ? JSON.parse(unb64utf8(data.content)) :
                     src.type === "raw" ? (typeof data === "string" ? JSON.parse(data) : data) : data;
          if (!Array.isArray(list)) throw new Error("bad data");
          messages = list;
          cacheMsgs(); renderMsgs();
          setTip("已同步 " + list.length + " 条云端留言 ✓", true);
        })
        .catch(tryNext);
    }
    tryNext();
  }

  /* GitHub 密钥（保存在本机浏览器） */
  function getKey() { return localStorage.getItem(KEY_LS) || ""; }
  function askKey(cb) {
    var overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:600;background:rgba(40,16,26,.7);display:flex;align-items:center;justify-content:center;padding:20px;";
    var box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:20px;padding:26px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);";
    var h = document.createElement("h3"); h.textContent = "🔑 设置留言密钥"; h.style.marginBottom = "10px";
    var p = document.createElement("p"); p.style.cssText = "font-size:13px;color:#93707f;line-height:1.8;margin-bottom:14px;";
    p.textContent = "为了防止陌生人乱写留言，写入云端需要一把「钥匙」（GitHub 访问令牌）。生成方法见管理后台 admin.html，生成后把它粘贴到这里，本机只需设置一次。";
    var input = document.createElement("input");
    input.type = "password"; input.placeholder = "粘贴你的 GitHub 令牌…";
    input.style.cssText = "width:100%;padding:11px 14px;border:1.5px solid #ffb9cc;border-radius:12px;font-size:14px;outline:none;margin-bottom:12px;";
    var row = document.createElement("div"); row.style.cssText = "display:flex;gap:10px;justify-content:flex-end;";
    var cancel = document.createElement("button"); cancel.textContent = "取消";
    cancel.style.cssText = "padding:9px 18px;border-radius:999px;border:1px solid #ffb9cc;background:#fff;color:#e64980;cursor:pointer;";
    var ok = document.createElement("button"); ok.textContent = "保存并留言";
    ok.style.cssText = "padding:9px 18px;border-radius:999px;border:none;background:linear-gradient(135deg,#ff8fab,#ff5c8a);color:#fff;font-weight:700;cursor:pointer;";
    cancel.onclick = function () { overlay.remove(); };
    ok.onclick = function () {
      if (!input.value.trim()) return;
      localStorage.setItem(KEY_LS, input.value.trim());
      overlay.remove(); cb();
    };
    row.appendChild(cancel); row.appendChild(ok);
    box.appendChild(h); box.appendChild(p); box.appendChild(input); box.appendChild(row);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    input.focus();
  }

  function pushGitHub(list, cb) {
    var r = C.repo, p = C.messages.githubPath, key = getKey();
    var api = "https://api.github.com/repos/" + r.owner + "/" + r.name + "/contents/" + p;
    /* 先拿当前文件的 sha（保证不覆盖别人刚写的留言） */
    fetch(api + "?ref=" + r.branch, { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : (res.status === 404 ? { sha: null } : Promise.reject(res.status)); })
      .then(function (info) {
        var body = {
          message: "💌 新留言 by " + (localStorage.getItem("love_my_name") || "someone"),
          content: b64utf8(JSON.stringify(list, null, 2)),
          branch: r.branch
        };
        if (info.sha) body.sha = info.sha;
        return fetch(api, {
          method: "PUT",
          headers: { "Authorization": "Bearer " + key, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      })
      .then(function (res) { if (!res.ok) throw new Error("GitHub " + res.status); return res.json(); })
      .then(cb)
      .catch(function (err) { cb(null, err); });
  }
  function pushJsonblob(list, cb) {
    fetch(C.messages.jsonblobUrl, {
      method: "PUT", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(list)
    }).then(function (r) { if (!r.ok) throw new Error(r.status); cb(); }).catch(function (err) { cb(null, err); });
  }
  function pushKvdb(list, cb) {
    fetch(C.messages.kvdbUrl, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list)
    }).then(function (r) { if (!r.ok) throw new Error(r.status); cb(); }).catch(function (err) { cb(null, err); });
  }

  $("#board-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#msg-name").value.trim();
    var text = $("#msg-text").value.trim();
    if (!name || !text) return;
    localStorage.setItem("love_my_name", name);
    var m = { n: name, t: text, ts: Date.now() };
    messages.push(m); renderMsgs(); cacheMsgs();
    $("#msg-text").value = "";
    $("#msg-name").value = name;
    setTip("正在送上云端…✈️");

    function after(ok, err) {
      if (ok) { setTip("留言已送到云端啦 ✓", true); loadMessages(); }
      else {
        setTip("云端开小差了（" + err + "），留言先存在本机", false);
      }
    }
    if (C.messages.jsonblobUrl) { pushJsonblob(messages, after); return; }
    if (C.messages.kvdbUrl) { pushKvdb(messages, after); return; }
    if (!getKey()) {
      setTip("首次留言需要设置留言密钥 🔑");
      askKey(function () { pushGitHub(messages, after); });
      return;
    }
    pushGitHub(messages, after);
  });

  /* 密钥管理入口 */
  var keyLink = document.createElement("a");
  keyLink.href = "javascript:void(0)";
  keyLink.textContent = "🔑 密钥设置";
  keyLink.style.cssText = "color:var(--rose);text-decoration:underline;cursor:pointer;margin-left:6px;";
  keyLink.addEventListener("click", function () { askKey(function () { setTip("密钥已保存 ✓", true); }); });
  syncTip.parentNode.insertBefore(keyLink, syncTip.nextSibling);

  $("#msg-name").value = localStorage.getItem("love_my_name") || "";
  loadMessages();

  /* ============================================================
     音乐播放器
     ============================================================ */
  var audio = $("#music-audio"), player = $("#music-player"), vinyl = $("#vinyl");
  var trackIdx = 0, started = false;
  function loadTrack(i) {
    trackIdx = (i + D.music.length) % D.music.length;
    audio.src = D.music[trackIdx].src;
    $("#music-title").textContent = D.music[trackIdx].title;
  }
  function play() {
    audio.play().then(function () {
      player.classList.add("playing");
      $("#music-toggle").textContent = "⏸";
      $("#music-hint").classList.add("gone");
      started = true;
    }).catch(function () { /* 浏览器拦截时等下次点击 */ });
  }
  function pause() {
    audio.pause();
    player.classList.remove("playing");
    $("#music-toggle").textContent = "▶";
  }
  $("#music-toggle").addEventListener("click", function () { started && !audio.paused ? pause() : play(); });
  vinyl.addEventListener("click", function () { started && !audio.paused ? pause() : play(); });
  $("#music-next").addEventListener("click", function () { var was = !audio.paused; loadTrack(trackIdx + 1); if (was) play(); });
  $("#music-prev").addEventListener("click", function () { var was = !audio.paused; loadTrack(trackIdx - 1); if (was) play(); });
  audio.addEventListener("ended", function () { if (D.music.length > 1) { loadTrack(trackIdx + 1); play(); } });
  loadTrack(0);
  /* 首次任意点击/触摸即开启 BGM（浏览器要求用户交互后才能出声） */
  var kick = function (e) {
    document.removeEventListener("pointerdown", kick);
    if (!e || !player.contains(e.target)) play(); /* 点播放器自身时交给它自己的事件处理 */
    $("#music-hint").classList.add("gone");
  };
  document.addEventListener("pointerdown", kick);
  setTimeout(function () { $("#music-hint").classList.add("gone"); }, 12000);
})();
