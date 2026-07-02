/* =========================================================
   EVENT.ZAGORJE — script.js
   3D disco-kugla (Three.js + bloom) · GSAP scroll · UI
   Klasične skripte; sve degradira ako biblioteke/WebGL nedostaju.
   ========================================================= */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasTHREE = typeof window.THREE !== "undefined";

  document.documentElement.classList.add("js");

  /* ---------- malo helpera ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); }

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    // hero intro odmah zakačen — i uz grešku dolje sadržaj se pokaže
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add("is-loaded"); });
    });
    setTimeout(function () { document.body.classList.add("is-loaded"); }, 900); // fallback
    try {
      var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
      setupHeader();
      setupMobileNav();
      setupLightbox();
      setupForm();
      setupScrollSpy();
      setupReveals();
      setupCounters();
      heroFx();
      magnetic();
      heroParallax();
      splitTitle();
      fitTitle();
      scrollProgress();
      var fitT;
      on(window, "resize", function () { clearTimeout(fitT); fitT = setTimeout(fitTitle, 120); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);
    } catch (e) {
      // u slučaju greške: sve vidljivo, bez animacija
      document.body.classList.add("is-loaded");
      $all("[data-reveal], [data-reveal-group] > *").forEach(function (el) { el.classList.add("is-revealed"); });
    }
  }

  /* =========================================================
     HEADER — sakrij na scroll-dolje, pokaži na scroll-gore
     ========================================================= */
  function setupHeader() {
    var header = $(".site-header");
    if (!header) return;
    var last = 0;
    function onScroll() {
      var sc = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", sc > 24);
      if (sc > last && sc > 320) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      last = sc;
    }
    on(window, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =========================================================
     MOBILNI IZBORNIK
     ========================================================= */
  function setupMobileNav() {
    var toggle = $("#navToggle");
    var menu = $("#mobileNav");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Zatvori izbornik" : "Otvori izbornik");
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }
    on(toggle, "click", function () { setOpen(menu.hidden); });
    $all("a", menu).forEach(function (a) { on(a, "click", function () { setOpen(false); }); });
    on(document, "keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setOpen(false); });
  }

  /* =========================================================
     SCROLLSPY — aktivni link u navigaciji
     ========================================================= */
  function setupScrollSpy() {
    var links = $all('.nav a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = l;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var active = map[en.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* =========================================================
     LIGHTBOX galerija
     ========================================================= */
  function setupLightbox() {
    var box = $("#lightbox");
    var img = $("#lbImg");
    var btnClose = $("#lbClose");
    var btnPrev = $("#lbPrev");
    var btnNext = $("#lbNext");
    var shots = $all("[data-gallery] .shot");
    if (!box || !img || !shots.length) return;

    var items = shots.map(function (s) {
      var im = $("img", s);
      return { full: s.getAttribute("data-full"), alt: im ? im.alt : "" };
    });
    var idx = 0;

    function open(i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].full;
      img.alt = items[idx].alt;
      box.hidden = false;
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnClose.focus();
    }
    function close() {
      box.hidden = true;
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (shots[idx]) shots[idx].focus();
    }
    shots.forEach(function (s, i) { on(s, "click", function () { open(i); }); });
    on(btnClose, "click", close);
    on(btnPrev, "click", function () { open(idx - 1); });
    on(btnNext, "click", function () { open(idx + 1); });
    on(box, "click", function (e) { if (e.target === box) close(); });
    on(document, "keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") open(idx - 1);
      else if (e.key === "ArrowRight") open(idx + 1);
    });
  }

  /* =========================================================
     KONTAKT FORMA → mailto
     ========================================================= */
  function setupForm() {
    $all(".upit-form").forEach(function (form) {
      on(form, "submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        function val(n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value : ""; }
        var ime = val("ime"), tel = val("telefon"), tip = val("tip");
        var datum = val("datum") || "nije navedeno", poruka = val("poruka");
        var subject = "Upit za event: " + tip;
        var body =
          "Ime: " + ime + "\r\n" +
          (tel ? "Telefon: " + tel + "\r\n" : "") +
          "Tip eventa: " + tip + "\r\n" +
          "Datum: " + datum + "\r\n" +
          (poruka ? "\r\nPoruka:\r\n" + poruka : "");
        window.location.href =
          "mailto:marko.kantolic@gmail.com?subject=" +
          encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      });
    });
  }

  /* =========================================================
     REVEAL — IntersectionObserver + CSS tranzicija (otporno).
     Ne ovisi o rAF/GSAP tickeru → sadržaj se uvijek pokaže.
     ========================================================= */
  function setupReveals() {
    var els = [];
    $all("[data-reveal-group]").forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.07).toFixed(2) + "s";
        els.push(child);
      });
    });
    $all("[data-reveal]").forEach(function (el) { els.push(el); });

    if (REDUCED || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-revealed"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* brojači — IO okida rAF count-up */
  function setupCounters() {
    var nums = $all(".stat__num");
    if (!nums.length) return;
    if (REDUCED || !("IntersectionObserver" in window)) {
      nums.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* opcionalni parallax na reference slikama (samo ako GSAP postoji) */
  function setupParallax() {
    gsap.registerPlugin(ScrollTrigger);
    $all(".ref-card__media img").forEach(function (im) {
      gsap.fromTo(im, { yPercent: -5 }, {
        yPercent: 5, ease: "none",
        scrollTrigger: { trigger: im, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* =========================================================
     BRUTALNA ANIMACIJA — hero canvas (equalizer + crveni snopovi)
     Vanilla canvas, offline, 60fps (transform/clear). Reduced → 1 frame.
     ========================================================= */
  function heroFx() {
    var canvas = document.getElementById("heroFx");
    if (!canvas) return;
    var ctx; try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
    if (!ctx) return;
    var hero = $(".hero");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size();
    on(window, "resize", size);

    var BARS = 46, phases = [];
    for (var i = 0; i < BARS; i++) phases.push(Math.random() * Math.PI * 2);

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      // dva crvena snopa (spotlight)
      for (var b = 0; b < 2; b++) {
        var bx = W * (0.32 + 0.42 * b) + Math.sin(t * 0.3 + b * 2) * W * 0.16;
        var g = ctx.createRadialGradient(bx, H * 0.18, 0, bx, H * 0.18, H * 0.95);
        g.addColorStop(0, "rgba(228,24,31," + (0.10 + 0.04 * b) + ")");
        g.addColorStop(1, "rgba(228,24,31,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      // equalizer trake (dno)
      var bw = W / BARS;
      for (var j = 0; j < BARS; j++) {
        var v = 0.1 + 0.45 * Math.abs(Math.sin(t * 1.5 + phases[j] + j * 0.2)) * (0.55 + 0.45 * Math.sin(t * 0.5 + j));
        var bh = v * H * 0.4, x = j * bw;
        var grd = ctx.createLinearGradient(0, H - bh, 0, H);
        grd.addColorStop(0, j % 5 === 0 ? "rgba(228,24,31,0.85)" : "rgba(201,202,206,0.26)");
        grd.addColorStop(1, "rgba(201,202,206,0.02)");
        ctx.fillStyle = grd; ctx.fillRect(x + bw * 0.18, H - bh, bw * 0.64, bh);
      }
    }

    if (REDUCED) { frame(0); return; }
    var running = true, t0 = (window.performance && performance.now) ? performance.now() : 0;
    function loop(now) { if (!running) return; frame((now - t0) / 1000); requestAnimationFrame(loop); }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) {
        var was = running; running = e[0].isIntersecting;
        if (running && !was) requestAnimationFrame(loop);
      }, { threshold: 0.01 });
      io.observe(hero);
    }
    requestAnimationFrame(loop);
  }

  /* kinetički naslov — slova ulijeću sa staggerom */
  function splitTitle() {
    if (REDUCED) return;
    $all(".hero__title .line").forEach(function (line, li) {
      var text = line.textContent;
      line.textContent = "";
      line.style.overflow = "hidden";
      for (var i = 0; i < text.length; i++) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = text[i];
        s.style.setProperty("--chd", (0.18 + li * 0.28 + i * 0.035).toFixed(3) + "s");
        line.appendChild(s);
      }
    });
  }

  /* naslov: svaka linija skalirana točno na širinu stupca — nikad lom u 2 reda */
  function fitTitle() {
    $all(".hero__title .line").forEach(function (line) {
      var parent = line.parentElement;
      if (!parent) return;
      line.style.fontSize = "";
      var base = parseFloat(getComputedStyle(line).fontSize);
      var cw = parent.clientWidth;
      var w = line.scrollWidth;
      if (!w || !cw) return;
      var size = base * (cw / w) * 0.99;
      size = Math.max(28, Math.min(size, base * 1.9));
      line.style.fontSize = size.toFixed(1) + "px";
    });
  }

  /* crvena scroll-progress traka (seamless orijentir) */
  function scrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.pageYOffset || 0) / max : 0;
      bar.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1).toFixed(4) + ")";
    }
    on(window, "scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* magnetic dugmad u herou */
  function magnetic() {
    if (REDUCED) return;
    $all(".hero__actions .btn").forEach(function (btn) {
      var r = null;
      on(btn, "mouseenter", function () { r = btn.getBoundingClientRect(); });
      on(btn, "mousemove", function (e) {
        if (!r) r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (mx * 0.25).toFixed(1) + "px," + (my * 0.4).toFixed(1) + "px)";
      });
      on(btn, "mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* parallax na scroll (rAF) */
  function heroParallax() {
    if (REDUCED) return;
    var title = $(".hero__title"), canvas = $("#heroFx");
    var ticking = false, sy = 0;
    function update() {
      ticking = false;
      var p = Math.min(sy, 800);
      if (title) title.style.transform = "translateY(" + (p * 0.1).toFixed(1) + "px)";
      if (canvas) canvas.style.transform = "translateY(" + (p * 0.05).toFixed(1) + "px)";
    }
    on(window, "scroll", function () {
      sy = window.pageYOffset || 0;
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* =========================================================
     3D DISCO SCENA — Three.js
     Zrcalna kugla od instanci + orbitirajuća svjetla + bloom.
     ========================================================= */
  function startDiscoScene() {
    var canvas = $("#hero-canvas");
    if (!canvas) return;

    var gl;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) { gl = null; }
    if (!gl) return; // bez WebGL-a hero ostaje čist (CSS veil + ink)

    var THREE = window.THREE;
    var W = window.innerWidth, H = window.innerHeight;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var isMobile = W < 760;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H);
    if (renderer.outputEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080b, 0.05);

    var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    /* ---- disco kugla: instancirane zrcalne pločice ---- */
    var ballGroup = new THREE.Group();
    // pomakni kuglu desno (tekst je lijevo poravnat) — na mobitelu centrirano gore
    ballGroup.position.x = isMobile ? 0 : 1.9;
    ballGroup.position.y = isMobile ? 1.6 : 0.25;
    scene.add(ballGroup);

    var R = isMobile ? 2.4 : 2.9;
    var rings = isMobile ? 22 : 34;
    var tile = isMobile ? 0.42 : 0.36;
    var dummy = new THREE.Object3D();

    // izgradi pozicije na sferi (po prstenovima geografske širine)
    var positions = [];
    for (var i = 0; i < rings; i++) {
      var phi = Math.PI * (i + 0.5) / rings;            // 0..PI
      var vv = Math.sin(phi);
      var circ = Math.max(1, Math.round((isMobile ? 26 : 34) * vv));
      for (var j = 0; j < circ; j++) {
        var theta = (2 * Math.PI * j) / circ;
        positions.push({
          x: R * Math.sin(phi) * Math.cos(theta),
          y: R * Math.cos(phi),
          z: R * Math.sin(phi) * Math.sin(theta)
        });
      }
    }
    var COUNT = positions.length;

    var tileGeo = new THREE.PlaneGeometry(tile, tile);
    var tileMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, metalness: 1.0, roughness: 0.18,
      emissive: 0x111118, side: THREE.DoubleSide
    });
    var mirrors = new THREE.InstancedMesh(tileGeo, tileMat, COUNT);
    mirrors.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // per-instance boje (pretežno bijelo, povremeno neon)
    var colorArr = new Float32Array(COUNT * 3);
    var palette = [
      new THREE.Color(0xffffff), new THREE.Color(0xc9cace),
      new THREE.Color(0xe4181f), new THREE.Color(0xffffff),
      new THREE.Color(0xc9cace)
    ];
    for (var k = 0; k < COUNT; k++) {
      var p = positions[k];
      dummy.position.set(p.x, p.y, p.z);
      dummy.lookAt(0, 0, 0); // pločice okrenute prema centru (zrcalo van)
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mirrors.setMatrixAt(k, dummy.matrix);
      var useWhite = Math.random() > 0.32;
      var col = useWhite ? palette[0] : palette[(Math.random() * palette.length) | 0];
      colorArr[k * 3] = col.r; colorArr[k * 3 + 1] = col.g; colorArr[k * 3 + 2] = col.b;
    }
    if (mirrors.instanceColor === null && THREE.InstancedBufferAttribute) {
      mirrors.instanceColor = new THREE.InstancedBufferAttribute(colorArr, 3);
    }
    mirrors.instanceMatrix.needsUpdate = true;
    ballGroup.add(mirrors);

    // unutarnja tamna jezgra (da se ne vidi kroz rupe između pločica)
    var core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.92, 32, 24),
      new THREE.MeshStandardMaterial({ color: 0x0b0b12, metalness: 0.6, roughness: 0.5 })
    );
    ballGroup.add(core);

    // tanka žičana aura oko kugle (brutalist wireframe)
    var aura = new THREE.Mesh(
      new THREE.IcosahedronGeometry(R * 1.28, 1),
      new THREE.MeshBasicMaterial({ color: 0xe4181f, wireframe: true, transparent: true, opacity: 0.1 })
    );
    ballGroup.add(aura);

    /* ---- svjetla: orbitirajući neon reflektori ---- */
    scene.add(new THREE.AmbientLight(0x202028, 0.6));
    var lights = [];
    function addLight(color) {
      var l = new THREE.PointLight(color, 1.5, 30, 1.6);
      scene.add(l); lights.push(l); return l;
    }
    var Lmag = addLight(0xe4181f);   // crvena (brand)
    var Lcya = addLight(0xfff3e8);   // topla bijela
    var Lacid = addLight(0xc9cace);  // srebrna
    var Lvio = addLight(0xe4181f);   // crvena
    var keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    /* ---- pozadinske zvjezdane čestice ---- */
    var starGeo = new THREE.BufferGeometry();
    var STAR = isMobile ? 120 : 260;
    var starPos = new Float32Array(STAR * 3);
    for (var sIdx = 0; sIdx < STAR; sIdx++) {
      starPos[sIdx * 3] = (Math.random() - 0.5) * 40;
      starPos[sIdx * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[sIdx * 3 + 2] = -2 - Math.random() * 22;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.55 }));
    scene.add(stars);

    /* ---- bloom postprocessing (preskoči na mobitelu) ---- */
    var composer = null, useBloom = false;
    if (!isMobile && THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass) {
      try {
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 0.55, 0.5, 0.2);
        composer.addPass(bloomPass);
        useBloom = true;
      } catch (e) { useBloom = false; }
    }

    /* ---- interakcija: parallax mišem + scroll ---- */
    var targetX = 0, targetY = 0, curX = 0, curY = 0, scrollY = 0;
    on(window, "mousemove", function (e) {
      targetX = (e.clientX / W - 0.5);
      targetY = (e.clientY / H - 0.5);
    }, { passive: true });
    on(window, "scroll", function () { scrollY = window.pageYOffset || 0; }, { passive: true });

    on(window, "resize", function () {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      if (composer) composer.setSize(W, H);
    });

    /* ---- render petlja ---- */
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    var running = true;
    if ("IntersectionObserver" in window) {
      var hio = new IntersectionObserver(function (en) {
        var was = running;
        running = en[0].isIntersecting;
        if (running && !was) requestAnimationFrame(loop);
      }, { threshold: 0.01 });
      hio.observe($(".hero"));
    }

    function loop(now) {
      if (!running) return;
      var t = (now - t0) / 1000;

      ballGroup.rotation.y = t * (REDUCED ? 0.05 : 0.2);
      ballGroup.rotation.x = Math.sin(t * 0.25) * 0.12;
      aura.rotation.y = -t * 0.18;
      aura.rotation.z = t * 0.12;

      var sp = REDUCED ? 0.15 : 1;
      Lmag.position.set(Math.cos(t * 0.8 * sp) * 6, Math.sin(t * 0.6 * sp) * 4 + 1, Math.sin(t * 0.7 * sp) * 6);
      Lcya.position.set(Math.cos(t * 0.8 * sp + 2.1) * 6, Math.cos(t * 0.5 * sp) * 4, Math.sin(t * 0.7 * sp + 2.1) * 6);
      Lacid.position.set(Math.cos(t * 0.6 * sp + 4.2) * 7, Math.sin(t * 0.7 * sp + 1) * 3 - 1, Math.sin(t * 0.6 * sp + 4.2) * 7);
      Lvio.position.set(Math.cos(-t * 0.7 * sp) * 5, Math.sin(t * 0.4 * sp) * 5, Math.sin(-t * 0.7 * sp) * 5);

      Lmag.intensity = 1.4 + Math.sin(t * 2.2) * 0.25;
      Lcya.intensity = 1.3 + Math.sin(t * 1.8 + 1.5) * 0.2;
      Lacid.intensity = 1.2 + Math.sin(t * 2.6 + 3) * 0.2;

      stars.rotation.y = t * 0.02;

      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      camera.position.x = curX * 2.2;
      camera.position.y = 0.4 - curY * 1.4 - Math.min(scrollY, 800) * 0.0016;
      camera.lookAt(0, 0, 0);

      if (useBloom && composer) composer.render();
      else renderer.render(scene, camera);

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
})();
