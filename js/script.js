/* ════════════════════════════════════════════════════════════
   مبلمان پرنس بیرجند — موتور انیمیشن و تعامل (نسخه سوپر)
   ════════════════════════════════════════════════════════════ */
(function () {
    'use strict';
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

    /* ── اعداد فارسی ── */
    const FA = '۰۱۲۳۴۵۶۷۸۹';
    const faNum = v => String(v).replace(/[0-9]/g, d => FA[d]).replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    const faGrouped = n => Number(n).toLocaleString('en-US').replace(/[0-9]/g, d => FA[d]).replace(/,/g, '٬');
    const toEnDigits = s => s.replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

    /* ── تست (جایگزین alert) ── */
    const toastWrap = $('#toastWrap');
    function toast(msg, type = 'info') {
        if (!toastWrap) return;
        const icons = { info: 'fa-bell', ok: 'fa-circle-check', err: 'fa-triangle-exclamation' };
        const el = document.createElement('div');
        el.className = 'toast ' + type;
        el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
        toastWrap.appendChild(el);
        setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 420); }, 4200);
    }

    /* ═══════════ PRELOADER ═══════════ */
    const preloader = $('#preloader'), loadBar = $('#loadBar'), loadPct = $('#loadPercent');
    document.body.classList.add('locked');
    let progress = 0, preloaderDone = false;
    function finishPreloader() {
        if (preloaderDone) return;
        preloaderDone = true;
        clearInterval(tick);
        if (loadBar) loadBar.style.width = '100%';
        if (loadPct) loadPct.textContent = faNum(100);
        setTimeout(() => {
            preloader?.classList.add('done');
            document.body.classList.remove('locked');
            document.body.classList.add('loaded');
            setTimeout(() => preloader?.remove(), 700);
        }, 240);
    }
    const tick = setInterval(() => {
        progress = Math.min(100, progress + Math.random() * 18 + 8);
        if (loadBar) loadBar.style.width = progress + '%';
        if (loadPct) loadPct.textContent = faNum(Math.floor(progress));
        if (progress >= 100) finishPreloader();
    }, reduced ? 10 : 90);
    setTimeout(finishPreloader, 3500); /* بیمه: تحت هیچ شرایطی بیشتر نمی‌ماند */
    addEventListener('load', () => setTimeout(finishPreloader, 1400));

    /* ═══════════ کرسر سفارشی ═══════════ */
    if (finePointer && !reduced) {
        document.body.classList.add('fx-cursor');
        const dot = $('#cursorDot'), ring = $('#cursorRing');
        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
        addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        }, { passive: true });
        (function loop() {
            rx += (mx - rx) * .16; ry += (my - ry) * .16;
            ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
            requestAnimationFrame(loop);
        })();
        $$('a,button,[data-tilt],.g-item,.pitch-dot,input,select,textarea').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('grow'));
            el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
        });
    }

    /* ═══════════ هدر + پیشرفت اسکرول + پارالاکس + دکمه بالا ═══════════ */
    const navbar = $('#navbar'), scrollBar = $('#scrollProgress'), toTop = $('#toTop'), ringFg = $('.ring-fg', toTop || document);
    const parallaxEls = $$('[data-parallax]');
    let ticking = false;
    function onScroll() {
        const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
        const pct = max > 0 ? y / max : 0;
        navbar?.classList.toggle('scrolled', y > 40);
        if (scrollBar) scrollBar.style.width = (pct * 100) + '%';
        toTop?.classList.toggle('show', y > 600);
        if (ringFg) ringFg.style.strokeDashoffset = 119.4 * (1 - pct);
        if (!reduced) parallaxEls.forEach(el => {
            const sp = parseFloat(el.dataset.parallax || .2);
            el.style.translate = `0 ${y * sp}px`;
        });
        ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

    /* لینک فعال منو بر اساس سکشن دیده‌شده */
    const navMap = {};
    $$('.nav-link').forEach(a => navMap[a.getAttribute('href')?.slice(1)] = a);
    const secObs = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting && navMap[e.target.id]) {
            $$('.nav-link').forEach(a => a.classList.remove('active'));
            navMap[e.target.id].classList.add('active');
        }
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('section[id]').forEach(s => secObs.observe(s));

    /* منوی موبایل */
    const burger = $('#hamburgerBtn'), mobileMenu = $('#mobileMenu');
    function setMenu(open) {
        burger.classList.toggle('open', open);
        mobileMenu.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
        mobileMenu.setAttribute('aria-hidden', !open);
        document.body.classList.toggle('locked', open);
    }
    burger?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    /* اسکرول نرم با جبران ارتفاع هدر ثابت */
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = $(id); if (!t) return;
        e.preventDefault();
        const top = t.getBoundingClientRect().top + scrollY - 84;
        scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
        history.replaceState(null, '', id);
    }));

    /* ═══════════ ریویل هنگام اسکرول ═══════════ */
    $$('[data-reveal]').forEach(el => {
        if (el.dataset.delay) el.style.setProperty('--d', el.dataset.delay + 'ms');
    });
    const revealObs = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('inview'); revealObs.unobserve(e.target); }
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], .league').forEach(el => revealObs.observe(el));

    /* ═══════════ شمارنده‌های فارسی ═══════════ */
    function animateCount(el) {
        const target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || '';
        if (reduced) { el.textContent = faGrouped(target) + suffix; return; }
        const dur = 1900, t0 = performance.now();
        (function step(t) {
            const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(2, -10 * p);
            el.textContent = faGrouped(Math.round(target * ease)) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    }
    const countObs = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
    }), { threshold: .5 });
    $$('.count[data-target]').forEach(el => countObs.observe(el));

    /* ═══════════ تایپ‌رایتر چرخشی هیرو ═══════════ */
    const rotator = $('#rotator');
    const phrases = ['آبی پرشور، زرد افتخار', 'قدرت • تعصب • پیروزی', 'باور کن، بجنگ، پیروز شو ⚽', 'خانهٔ شاهزاده‌های فوتسال 👑'];
    if (rotator && !reduced) {
        let pi = 0, ci = phrases[0].length, del = false;
        (function type() {
            const word = phrases[pi];
            rotator.textContent = word.slice(0, ci);
            let wait = del ? 34 : 78;
            if (!del && ci === word.length) { wait = 2100; del = true; }
            else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
            ci += del ? -1 : 1;
            setTimeout(type, wait);
        })();
    }

    /* ═══════════ تایپ‌رایتر «درباره» — شروع هنگام دیده‌شدن ═══════════ */
    const twEl = $('#typewriter-text');
    const aboutText = 'باشگاه فوتسال مبلمان پرنس بیرجند در سال ۱۳۹۸ با هدف پرورش استعدادهای جوان و ساختن یک خانوادهٔ قدرتمند در عرصهٔ فوتسال خراسان جنوبی تأسیس شد. ما با تکیه بر آبیِ پرشور و زردِ پرافتخار، در لیگ‌های استانی درخشیده‌ایم و هزاران هوادار وفادار را گرد هم آورده‌ایم؛ چون اینجا فقط یک تیم نیست، یک سبک زندگی است. 👑⚽';
    if (twEl) {
        if (reduced) { twEl.textContent = aboutText; }
        else {
            let i = 0;
            const twObs = new IntersectionObserver(es => es.forEach(e => {
                if (!e.isIntersecting) return;
                twObs.disconnect();
                (function step() {
                    twEl.textContent = aboutText.slice(0, ++i);
                    if (i < aboutText.length) setTimeout(step, 26);
                })();
            }), { threshold: .4 });
            twObs.observe(twEl);
        }
    }

    /* ═══════════ نوارهای قدرت + احتمال برد ═══════════ */
    function runBars(scope, fillSel, pctSel) {
        $$(fillSel, scope).forEach(f => f.style.width = f.dataset.val + '%');
        if (!pctSel) return;
        $$(pctSel, scope).forEach(p => {
            const target = parseInt(p.dataset.prob || p.closest('[data-val]')?.dataset.val || 0);
            if (reduced) { p.textContent = faNum(target) + '٪'; return; }
            const t0 = performance.now();
            (function step(t) {
                const k = Math.min(1, (t - t0) / 1500);
                p.textContent = faNum(Math.round(target * (1 - Math.pow(1 - k, 3)))) + '٪';
                if (k < 1) requestAnimationFrame(step);
            })(t0);
        });
    }
    const barObs = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains('skills')) runBars(e.target, '.skill-fill', '.skill-pct');
        if (e.target.classList.contains('prob-box')) {
            $$('.skill', e.target); // noop guard
            $$('.prob-fill', e.target).forEach(f => f.style.width = f.dataset.val + '%');
            $$('[data-prob]', e.target).forEach(p => {
                const target = parseInt(p.dataset.prob);
                if (reduced) { p.textContent = faNum(target) + '٪'; return; }
                const t0 = performance.now();
                (function step(t) {
                    const k = Math.min(1, (t - t0) / 1500);
                    p.textContent = faNum(Math.round(target * (1 - Math.pow(1 - k, 3)))) + '٪';
                    if (k < 1) requestAnimationFrame(step);
                })(t0);
            });
        }
        barObs.unobserve(e.target);
    }), { threshold: .45 });
    $$('.skills, .prob-box').forEach(el => barObs.observe(el));
    /* پر کردن مهارت‌ها با data-val والد */
    $$('.skill').forEach(s => { const f = $('.skill-fill', s); if (f) f.dataset.val = s.dataset.val; });

    /* ═══════════ ذرات تعاملی هیرو ═══════════ */
    const canvas = $('#heroCanvas');
    if (canvas && !reduced) {
        const ctx = canvas.getContext('2d');
        let W, H, parts = [], running = true, mouse = { x: -9999, y: -9999 };
        function resize() {
            const r = canvas.parentElement.getBoundingClientRect();
            W = canvas.width = r.width; H = canvas.height = r.height;
            const n = Math.min(110, Math.floor(W * H / 16000));
            parts = Array.from({ length: n }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - .5) * .55, vy: (Math.random() - .5) * .55,
                r: Math.random() * 2.2 + .7, gold: Math.random() > .55,
                ph: Math.random() * Math.PI * 2
            }));
        }
        canvas.parentElement.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; });
        new IntersectionObserver(es => es.forEach(e => running = e.isIntersecting)).observe(canvas);
        (function draw(t) {
            requestAnimationFrame(draw);
            if (!running) return;
            ctx.clearRect(0, 0, W, H);
            for (const p of parts) {
                p.x += p.vx + Math.sin(t / 1400 + p.ph) * .12;
                p.y += p.vy + Math.cos(t / 1600 + p.ph) * .12;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                const tw = .55 + Math.sin(t / 500 + p.ph) * .35;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
                ctx.fillStyle = p.gold ? `rgba(245,197,66,${tw})` : `rgba(140,180,255,${tw * .85})`;
                ctx.shadowBlur = p.gold ? 12 : 6; ctx.shadowColor = p.gold ? '#F5C542' : '#7db4ff';
                ctx.fill(); ctx.shadowBlur = 0;
                const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (dm < 170) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(245,197,66,${(1 - dm / 170) * .5})`; ctx.lineWidth = 1; ctx.stroke();
                }
            }
            for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
                const a = parts[i], b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 115) {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(120,170,255,${(1 - d / 115) * .16})`; ctx.stroke();
                }
            }
        })(0);
        addEventListener('resize', resize); resize();
    }

    /* ═══════════ تیلت سه‌بعدی + اسپات‌لایت + دکمه مغناطیسی ═══════════ */
    let tiltBound = false;
    function bindTiltMagnetic() {
        if (tiltBound || reduced) return;
        tiltBound = true;
        $$('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
                card.style.transform = `perspective(1100px) rotateY(${(x - .5) * -13}deg) rotateX(${(y - .5) * 11}deg) translateY(-6px)`;
                card.style.setProperty('--gx', x * 100 + '%'); card.style.setProperty('--gy', y * 100 + '%');
            });
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });
        $$('.magnetic').forEach(el => {
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
            });
            el.addEventListener('mouseleave', () => el.style.transform = '');
        });
    }
    if (finePointer) bindTiltMagnetic();
    else addEventListener('mousemove', bindTiltMagnetic, { once: true }); /* بیمه: اولین حرکت واقعی موس فعالش می‌کند */
    $$('.spotlight').forEach(el => el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }));

    /* ریپل دکمه‌ها */
    $$('.ripple').forEach(btn => btn.addEventListener('click', function (e) {
        if (reduced) return;
        const r = this.getBoundingClientRect(), s = Math.max(r.width, r.height);
        const ink = document.createElement('span');
        ink.className = 'ripple-ink';
        ink.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
        this.appendChild(ink); setTimeout(() => ink.remove(), 680);
    }));

    /* ═══════════ شمارش معکوس بازی بزرگ (ذخیره‌شده، تمدیدشونده) ═══════════ */
    function getNextMatch() {
        let t = +localStorage.getItem('prince_next_match') || 0;
        if (!t || t < Date.now()) {
            const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(18, 0, 0, 0);
            t = d.getTime(); localStorage.setItem('prince_next_match', t);
        }
        return t;
    }
    const matchTarget = getNextMatch();
    const dateEl = $('#match-date-display');
    if (dateEl) dateEl.textContent = new Date(matchTarget).toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' — ساعت ۱۸:۰۰';
    const cdNums = {};
    $$('#superCountdown .cd-num').forEach(n => cdNums[n.dataset.unit] = n);
    function setCd(unit, val) {
        const el = cdNums[unit]; if (!el) return;
        const txt = faNum(String(val).padStart(2, '0'));
        if (el.textContent !== txt) {
            el.textContent = txt;
            el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
        }
    }
    function tickCountdown() {
        let diff = Math.max(0, matchTarget - Date.now());
        setCd('days', Math.floor(diff / 864e5));
        setCd('hours', Math.floor(diff % 864e5 / 36e5));
        setCd('minutes', Math.floor(diff % 36e5 / 6e4));
        setCd('seconds', Math.floor(diff % 6e4 / 1e3));
    }
    tickCountdown(); setInterval(tickCountdown, 1000);

    /* تاریخ بازی‌های کوچک به شمسی */
    $$('.mini-match[data-days]').forEach(card => {
        const d = new Date(); d.setDate(d.getDate() + (+card.dataset.days)); d.setHours(+card.dataset.hour || 18, 0, 0, 0);
        const rel = { 1: 'فردا 🔥', 3: '۳ روز دیگر', 7: 'هفتهٔ آینده' }[card.dataset.days] || '';
        const relEl = $('.mm-rel', card); if (relEl) relEl.textContent = rel;
        const dateNode = $('.mm-date', card);
        if (dateNode) dateNode.innerHTML = `<i class="fas fa-calendar-days"></i> ${d.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })} — ساعت ${faNum(card.dataset.hour || 18)}:۰۰`;
    });

    /* تب مسابقات با قرص متحرک */
    const tabBtns = $$('.tab-btn'), pill = $('.tab-pill');
    function movePill(btn) {
        if (!pill || !btn) return;
        pill.style.width = btn.offsetWidth + 'px';
        pill.style.right = btn.offsetLeft + 'px';
    }
    tabBtns.forEach(btn => btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        movePill(btn);
        $$('.tab-panel').forEach(p => p.classList.remove('active'));
        $('#panel-' + btn.dataset.tab)?.classList.add('active');
        $$('#panel-' + btn.dataset.tab + ' [data-reveal]').forEach(el => el.classList.add('inview'));
    }));
    movePill($('.tab-btn.active'));
    addEventListener('resize', () => movePill($('.tab-btn.active')));
    addEventListener('load', () => movePill($('.tab-btn.active')));

    /* دکمه‌های بلیت */
    $$('.ticket-btn').forEach(b => b.addEventListener('click', () =>
        toast('🎟️ درخواست رزرو بلیتت ثبت شد! برای قطعی‌کردن، دفتر باشگاه باهات تماس می‌گیره. ظرفیت دربی محدوده!', 'ok')));

    /* ═══════════ لایت‌باکس گالری ═══════════ */
    const items = $$('.g-item'), lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCaption'), lbCount = $('#lbCounter');
    let cur = 0;
    function openLb(i) {
        cur = (i + items.length) % items.length;
        const img = $('img', items[cur]);
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCap.textContent = items[cur].dataset.caption || img.alt;
        lbCount.textContent = faNum(cur + 1) + ' از ' + faNum(items.length);
        lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
        lb.classList.add('open'); document.body.classList.add('locked');
    }
    const closeLb = () => { lb.classList.remove('open'); document.body.classList.remove('locked'); };
    items.forEach((it, i) => {
        it.addEventListener('click', () => openLb(i));
        it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); } });
    });
    $('#lbClose')?.addEventListener('click', closeLb);
    $('#lbNext')?.addEventListener('click', () => openLb(cur + 1));
    $('#lbPrev')?.addEventListener('click', () => openLb(cur - 1));
    lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') openLb(cur + 1);
        if (e.key === 'ArrowRight') openLb(cur - 1);
    });

    /* ═══════════ FAQ آکاردئونی ═══════════ */
    $$('.faq-item').forEach(item => {
        const q = $('.faq-q', item), a = $('.faq-a', item);
        q.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            $$('.faq-item.open').forEach(o => { o.classList.remove('open'); $('.faq-a', o).style.maxHeight = '0px'; });
            if (!wasOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
        });
    });

    /* ═══════════ کانفتی 🎉 ═══════════ */
    const cCanvas = $('#confettiCanvas'), cCtx = cCanvas?.getContext('2d');
    let confs = [], confRunning = false;
    function sizeConfetti() { if (cCanvas) { cCanvas.width = innerWidth; cCanvas.height = innerHeight; } }
    addEventListener('resize', sizeConfetti); sizeConfetti();
    function confettiBurst(x = innerWidth / 2, y = innerHeight * .6, n = 130) {
        if (!cCtx || reduced) return;
        const colors = ['#F5C542', '#ffd966', '#1550b0', '#ffffff', '#ea7b1e'];
        for (let i = 0; i < n; i++) {
            const ang = Math.random() * Math.PI * 2, sp = Math.random() * 11 + 4;
            confs.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 7, s: Math.random() * 8 + 4, c: colors[i % colors.length], rot: Math.random() * 7, vr: (Math.random() - .5) * .3, life: 1, rect: Math.random() > .4 });
        }
        if (!confRunning) { confRunning = true; requestAnimationFrame(confLoop); }
    }
    function confLoop() {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        confs = confs.filter(p => p.life > 0 && p.y < cCanvas.height + 30);
        for (const p of confs) {
            p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .006;
            cCtx.save(); cCtx.translate(p.x, p.y); cCtx.rotate(p.rot); cCtx.globalAlpha = Math.max(0, p.life);
            cCtx.fillStyle = p.c;
            if (p.rect) cCtx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
            else { cCtx.beginPath(); cCtx.arc(0, 0, p.s / 2, 0, 7); cCtx.fill(); }
            cCtx.restore();
        }
        if (confs.length) requestAnimationFrame(confLoop);
        else { confRunning = false; cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height); }
    }

    /* ═══════════ انتخاب پست روی زمین + فرم ثبت‌نام ═══════════ */
    const pitchDots = $$('.pitch-dot'), posSelect = $('#ctaPosition'), posLabel = $('#posLabel');
    function selectPosition(val, label, fromPitch) {
        pitchDots.forEach(d => {
            const on = d.dataset.pos === val;
            d.classList.toggle('selected', on); d.setAttribute('aria-checked', on);
        });
        if (posSelect && posSelect.value !== val) {
            posSelect.value = val;
            posSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (posLabel) posLabel.textContent = label || 'هنوز انتخاب نکردی 😉';
        if (fromPitch && val) toast('پست انتخاب شد: ' + label, 'ok');
    }
    pitchDots.forEach(d => d.addEventListener('click', () => selectPosition(d.dataset.pos, d.dataset.label, true)));
    posSelect?.addEventListener('change', () => {
        const dot = pitchDots.find(d => d.dataset.pos === posSelect.value);
        selectPosition(posSelect.value, dot?.dataset.label || posSelect.selectedOptions[0]?.text, false);
    });

    const form = $('#ctaPlayerForm');
    const fields = {
        fullname:   { el: $('#ctaFullname'),   test: v => v.trim().length >= 3,                       msg: 'نام کاملت رو بنویس (حداقل ۳ حرف)' },
        birthdate:  { el: $('#ctaBirthdate'),  test: v => /^\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}$/.test(toEnDigits(v.trim())), msg: 'فرمت درست: ۱۳۸۵/۰۴/۱۲' },
        mobile:     { el: $('#ctaMobile'),     test: v => /^09\d{9}$/.test(toEnDigits(v.trim()).replace(/[\s-]/g, '')), msg: 'شماره موبایل ۱۱ رقمی با ۰۹ شروع می‌شه' },
        position:   { el: posSelect,           test: v => !!v,                                          msg: 'پست تخصصی رو انتخاب کن (از زمین هم می‌شه!)' },
        experience: { el: $('#ctaExperience'), test: v => !!v,                                          msg: 'سابقهٔ بازی رو انتخاب کن' },
    };
    const fpFill = $('#formProgress'), fpText = $('#formProgressText');
    function validateField(key, showErr = true) {
        const f = fields[key]; if (!f.el) return true;
        const box = f.el.closest('.input-box'), ok = f.test(f.el.value);
        box?.classList.toggle('filled', !!f.el.value);
        if (showErr) {
            box?.classList.toggle('valid', ok);
            box?.classList.toggle('invalid', !ok && !!f.el.value);
            const err = box?.querySelector('.err'); if (err) err.textContent = ok ? '' : f.msg;
        }
        return ok;
    }
    function updateProgress() {
        const done = Object.keys(fields).filter(k => fields[k].test(fields[k].el.value)).length;
        const pct = Math.round(done / Object.keys(fields).length * 100);
        if (fpFill) fpFill.style.width = pct + '%';
        if (fpText) fpText.textContent = 'تکمیل فرم: ' + faNum(pct) + '٪' + (pct === 100 ? ' — آمادهٔ ارسال! 🚀' : '');
    }
    Object.keys(fields).forEach(k => {
        const el = fields[k].el; if (!el) return;
        el.addEventListener('input', () => { validateField(k); updateProgress(); });
        el.addEventListener('change', () => { validateField(k); updateProgress(); });
        el.addEventListener('blur', () => { if (el.value) validateField(k); });
    });
    updateProgress();

    const modal = $('#successModal');
    const openModal = () => { modal.classList.add('open'); document.body.classList.add('locked'); };
    const closeModal = () => { modal.classList.remove('open'); document.body.classList.remove('locked'); };
    $('.modal-close', modal)?.addEventListener('click', closeModal);
    $('.modal-ok', modal)?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    form?.addEventListener('submit', e => {
        e.preventDefault();
        let firstBad = null;
        Object.keys(fields).forEach(k => {
            if (!validateField(k)) {
                const box = fields[k].el.closest('.input-box');
                box?.classList.add('invalid');
                const err = box?.querySelector('.err'); if (err) err.textContent = fields[k].msg;
                box?.classList.remove('shake'); void box?.offsetWidth; box?.classList.add('shake');
                if (!firstBad) firstBad = fields[k].el;
            }
        });
        if (firstBad) {
            toast('یه جای فرم ناقصه؛ فیلدهای قرمز رو کامل کن 🙏', 'err');
            firstBad.focus(); firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const btn = $('#submitBtn');
        btn.classList.add('loading');
        $('.btn-text', btn).textContent = 'در حال ارسال به باشگاه…';
        setTimeout(() => {
            const data = {
                name: fields.fullname.el.value.trim(),
                birthdate: fields.birthdate.el.value.trim(),
                mobile: toEnDigits(fields.mobile.el.value.trim()),
                position: posSelect.selectedOptions[0]?.text || posSelect.value,
                positionKey: posSelect.value,
                experience: fields.experience.el.value,
                message: $('#ctaMessage')?.value.trim() || '',
                date: new Date().toISOString()
            };
            try {
                const list = JSON.parse(localStorage.getItem('prince_players') || '[]');
                list.push(data); localStorage.setItem('prince_players', JSON.stringify(list));
                localStorage.setItem('prince_futsal_players', JSON.stringify(list)); // سازگاری با نسخه قبلی
            } catch (_) { /* localStorage unavailable */ }

            btn.classList.remove('loading');
            $('.btn-text', btn).textContent = 'ارسال درخواست عضویت';
            $('#successSummary').innerHTML =
                `<b style="color:#F5C542">${data.name}</b> عزیز، درخواستت به‌عنوان <b style="color:#F5C542">${data.position}</b> ثبت شد.<br>کارشناسان باشگاه ظرف ۲۴ ساعت با شمارهٔ <b dir="ltr">${faNum(data.mobile)}</b> تماس می‌گیرن. به خانوادهٔ پرنس خوش آمدی! 👑`;
            openModal();
            const r = btn.getBoundingClientRect();
            confettiBurst(r.left + r.width / 2, r.top, 150);
            setTimeout(() => confettiBurst(innerWidth * .3, innerHeight * .4, 80), 250);
            setTimeout(() => confettiBurst(innerWidth * .7, innerHeight * .4, 80), 450);
            form.reset();
            $$('.input-box', form).forEach(b => b.classList.remove('valid', 'invalid', 'filled'));
            selectPosition('', 'هنوز انتخاب نکردی 😉', false);
            updateProgress();
        }, 900);
    });

    /* ═══════════ متفرقه ═══════════ */
    const yearEl = $('#yearNow');
    if (yearEl) yearEl.textContent = new Date().toLocaleDateString('fa-IR', { year: 'numeric' }).replace(/\s.*$/, '');
    /* کلیک روی لوگو = جشن کانفتی کوچولو 🎉 */
    $('.brand')?.addEventListener('dblclick', e => confettiBurst(e.clientX, e.clientY, 70));
})();
