// ===== S P L A S H   L O A D E R =====
window.addEventListener('load', function () {
    let progress = 0;
    const progressBar = document.getElementById('splashProgress');
    const splash = document.getElementById('splash-loader');
    const mainContent = document.getElementById('main-content');

    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressBar.style.width = '100%';
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                        mainContent.style.transition = 'opacity 0.8s ease';
                    }, 50);
                }, 500);
            }, 300);
        }
        progressBar.style.width = progress + '%';
    }, 100);
});

// ===== H A M B U R G E R   M E N U =====
const hamburger = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== S M O O T H   S C R O L L =====
document.querySelectorAll('.nav-links a, .hero-btn, .footer-links a, .scroll-indicator').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (hash && hash.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(hash);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== T Y P E W R I T E R   H E R O =====
const heroSloganEl = document.getElementById('heroSlogan');
const heroSloganText = "آبی پرشور، زرد افتخار • قدرت، تعصب، پیروزی";

if (heroSloganEl) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let i = 0;
                heroSloganEl.innerHTML = "";
                function typeHero() {
                    if (i < heroSloganText.length) {
                        heroSloganEl.innerHTML += heroSloganText.charAt(i);
                        i++;
                        setTimeout(typeHero, 80);
                    }
                }
                typeHero();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    heroObserver.observe(heroSloganEl);
}

// ===== T Y P E W R I T E R   A B O U T =====
const aboutText = "باشگاه فوتسال مبلمان پرنس بیرجند در سال ۱۳۹۸ با هدف پرورش استعدادهای جوان و ایجاد یک خانواده قدرتمند در عرصه فوتسال استان خراسان جنوبی تأسیس شد. ما با تکیه بر رنگ‌های آبی پررنگ و زرد پر افتخار، توانسته‌ایم در لیگ‌های استانی بدرخشیم و هواداران وفاداری را گرد هم آوریم.";
let aboutIndex = 0;
const typewriterEl = document.getElementById('typewriter-text');

function typeAbout() {
    if (typewriterEl && aboutIndex < aboutText.length) {
        typewriterEl.innerHTML += aboutText.charAt(aboutIndex);
        aboutIndex++;
        setTimeout(typeAbout, 40);
    }
}
window.addEventListener('load', () => {
    if (typewriterEl) {
        typewriterEl.innerHTML = "";
        typeAbout();
    }
});

// ===== C O U N T E R S =====
function startCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                counterObserver.unobserve(aboutSection);
            }
        });
    }, { threshold: 0.5 });
    counterObserver.observe(aboutSection);
}

// ===== P A R T I C L E S =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        const container = document.querySelector('.about-section');
        if (container) {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.3,
                color: `hsl(${Math.random() > 0.7 ? 45 : 210}, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 40}%)`
            });
        }
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    draw();
}

// ===== S C R O L L   R E V E A L =====
const revealElements = document.querySelectorAll('.glass-box, .coach-card, .match-super-card, .register-glow-card');
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('revealed');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== M O B I L E   C O A C H   C L I C K =====
document.querySelectorAll('.coach-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            document.querySelectorAll('.coach-card').forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            card.classList.toggle('active');
        }
    });
});

// ===== C O U N T D O W N   T I M E R S =====
function updateCountdowns() {
    const now = new Date();

    const game1 = new Date();
    game1.setDate(now.getDate() + 1);
    game1.setHours(16, 0, 0, 0);

    const game2 = new Date();
    game2.setDate(now.getDate() + 3);
    game2.setHours(15, 0, 0, 0);

    const game3 = new Date();
    game3.setDate(now.getDate() + 7);
    game3.setHours(19, 0, 0, 0);

    const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const weekdayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

    const games = [
        { date: game1, timerId: 'timer1', dayId: 'day1', monthId: 'month1', weekdayId: 'weekday1' },
        { date: game2, timerId: 'timer2', dayId: 'day2', monthId: 'month2', weekdayId: 'weekday2' },
        { date: game3, timerId: 'timer3', dayId: 'day3', monthId: 'month3', weekdayId: 'weekday3' }
    ];

    games.forEach(game => {
        const diff = game.date - now;

        if (document.getElementById(game.dayId)) {
            document.getElementById(game.dayId).innerText = game.date.getDate();
            document.getElementById(game.monthId).innerText = monthNames[game.date.getMonth()];
            document.getElementById(game.weekdayId).innerText = weekdayNames[game.date.getDay()];
        }

        const timer = document.getElementById(game.timerId);
        if (timer) {
            if (diff <= 0) {
                timer.innerHTML = `<div class="time-box"><span class="days">۰</span><span class="label">روز</span></div>
                    <div class="time-box"><span class="hours">۰</span><span class="label">ساعت</span></div>
                    <div class="time-box"><span class="minutes">۰</span><span class="label">دقیقه</span></div>
                    <div class="time-box"><span class="seconds">۰</span><span class="label">ثانیه</span></div>`;
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (86400000)) / (3600000));
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            const daysSpan = timer.querySelector('.days');
            const hoursSpan = timer.querySelector('.hours');
            const minutesSpan = timer.querySelector('.minutes');
            const secondsSpan = timer.querySelector('.seconds');

            if (daysSpan) daysSpan.innerText = days;
            if (hoursSpan) hoursSpan.innerText = hours;
            if (minutesSpan) minutesSpan.innerText = minutes;
            if (secondsSpan) secondsSpan.innerText = seconds;
        }
    });
}

setInterval(updateCountdowns, 1000);
updateCountdowns();

// ===== T A B   S W I T C H E R =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const tabGlow = document.querySelector('.tab-glow');

function switchTab(tabId, activeBtn) {
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab') === 'upcoming' ? 'upcoming-tab' : 'past-tab';
            switchTab(tabId, btn);
        });
    });
}

// ===== R E G I S T E R   F O R M =====
const registerForm = document.getElementById('playerRegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const position = document.getElementById('position').value;
        const experience = document.getElementById('experience').value;

        if (!fullname) { alert("❌ لطفاً نام خود را وارد کنید"); return; }
        if (!birthdate) { alert("❌ لطفاً تاریخ تولد را وارد کنید"); return; }
        if (!mobile || !/^09[0-9]{9}$/.test(mobile)) { alert("❌ شماره موبایل صحیح نیست"); return; }
        if (!position) { alert("❌ لطفاً پست تخصصی را انتخاب کنید"); return; }
        if (!experience) { alert("❌ لطفاً سابقه بازی را انتخاب کنید"); return; }

        const players = JSON.parse(localStorage.getItem('prince_futsal_players') || '[]');
        players.push({
            name: fullname,
            birthdate: birthdate,
            mobile: mobile,
            position: document.getElementById('position').options[document.getElementById('position').selectedIndex]?.text,
            experience: document.getElementById('experience').options[document.getElementById('experience').selectedIndex]?.text,
            message: document.getElementById('message').value,
            date: new Date().toISOString()
        });
        localStorage.setItem('prince_futsal_players', JSON.stringify(players));

        alert(`✅ ${fullname} عزیز!\n\nدرخواست شما با موفقیت ثبت شد.\nتیم ما به زودی با شما تماس خواهد گرفت.\n\nبه خانواده پرنس خوش آمدید!`);
        registerForm.reset();
    });
}
function updateMatchTimers() {
    const timers = document.querySelectorAll('.cd-timer[data-match]');
    timers.forEach(timer => {
        const targetDate = new Date(timer.getAttribute('data-match'));
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            timer.closest('.match-new-card').querySelector('.match-status').innerHTML = '⏳ شروع شده';
            timer.innerHTML = `
                <div class="cd-box"><span class="days">۰</span><span>روز</span></div>
                <div class="cd-box"><span class="hours">۰</span><span>ساعت</span></div>
                <div class="cd-box"><span class="minutes">۰</span><span>دقیقه</span></div>
                <div class="cd-box"><span class="seconds">۰</span><span>ثانیه</span></div>
            `;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (3600000));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        timer.querySelector('.days').innerText = days;
        timer.querySelector('.hours').innerText = hours;
        timer.querySelector('.minutes').innerText = minutes;
        timer.querySelector('.seconds').innerText = seconds;
    });
}

setInterval(updateMatchTimers, 1000);
updateMatchTimers();

// ===== انیمیشن اسکرول برای جدول مسابقات =====
const matchRows = document.querySelectorAll('.super-row');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

matchRows.forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    observer.observe(row);
});
// ===== تایمر ویژه بازی بعدی (۷ روز دیگر، ساعت ۱۸:۰۰) =====
function setNextMatchTimer() {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 7);  // 7 روز بعد
    targetDate.setHours(18, 0, 0, 0);       // ساعت ۱۸:۰۰

    // نمایش تاریخ فارسی (اختیاری)
    const matchDateElem = document.getElementById('match-date-display');
    if (matchDateElem) {
        const persianDate = targetDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
        matchDateElem.innerHTML = `${persianDate} - ساعت ۱۸:۰۰`;
    }

    const timerElement = document.getElementById('superCountdown');
    if (!timerElement) return;

    function updateTimer() {
        const diff = targetDate - new Date();
        if (diff <= 0) {
            timerElement.innerHTML = `<div class="cd-unit"><span class="days">۰</span><span>روز</span></div>
                                      <div class="cd-unit"><span class="hours">۰</span><span>ساعت</span></div>
                                      <div class="cd-unit"><span class="minutes">۰</span><span>دقیقه</span></div>
                                      <div class="cd-unit"><span class="seconds">۰</span><span>ثانیه</span></div>`;
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (3600000));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        const daysElem = timerElement.querySelector('.days');
        const hoursElem = timerElement.querySelector('.hours');
        const minutesElem = timerElement.querySelector('.minutes');
        const secondsElem = timerElement.querySelector('.seconds');
        if (daysElem) daysElem.innerText = days;
        if (hoursElem) hoursElem.innerText = hours;
        if (minutesElem) minutesElem.innerText = minutes;
        if (secondsElem) secondsElem.innerText = seconds;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

setNextMatchTimer();
// ===== ثبت‌نام بازیکنان (فرم سوپر گرافیک) =====
const ctaForm = document.getElementById('ctaPlayerForm');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('ctaFullname').value.trim();
        const birthdate = document.getElementById('ctaBirthdate').value.trim();
        const mobile = document.getElementById('ctaMobile').value.trim();
        const position = document.getElementById('ctaPosition').value;
        const experience = document.getElementById('ctaExperience').value;

        if (!fullname) { alert("❌ نام و نام خانوادگی را وارد کنید"); return; }
        if (!birthdate) { alert("❌ تاریخ تولد را وارد کنید"); return; }
        if (!mobile.match(/^09[0-9]{9}$/)) { alert("❌ شماره موبایل صحیح نیست (۰۹XXXXXXXXX)"); return; }
        if (!position) { alert("❌ پست تخصصی را انتخاب کنید"); return; }
        if (!experience) { alert("❌ سابقه بازی را انتخاب کنید"); return; }

        let players = JSON.parse(localStorage.getItem('prince_players') || '[]');
        players.push({
            name: fullname,
            birthdate: birthdate,
            mobile: mobile,
            position: position,
            experience: experience,
            message: document.getElementById('ctaMessage').value,
            date: new Date().toISOString()
        });
        localStorage.setItem('prince_players', JSON.stringify(players));
        alert(`✅ ${fullname} عزیز! ثبت‌نام شما با موفقیت انجام شد.\nبه زودی تماس می‌گیریم.`);
        ctaForm.reset();
    });
}