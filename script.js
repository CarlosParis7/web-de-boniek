lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

// ACCESIBILIDAD: si el usuario pide menos movimiento, los reveals de GSAP
// (que parten de opacity:0 / clipPath colapsado) NO deben dejar el contenido
// oculto. Saltamos al estado final visible sin animar nada.
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function settleReducedMotion() {
    if (!REDUCE_MOTION) return;
    // Mostrar todo el contenido que los reveals dejarían oculto
    gsap.set([
        '.loader-text', '.hero-title', '.hero-subtitle', '.hero-cta',
        '.hero-scroll-indicator', '.nav-minimal', '.floating-wa',
        '.img-wrapper', '.about-img-wrapper', '.timeline-item',
        '.split-text-quote', '.quote-author', '.reveal-text'
    ], { clearProps: 'all', opacity: 1, y: 0, scale: 1, clipPath: 'none' });
    gsap.set('.mockup-frame', { clearProps: 'transform', rotateX: 0, scale: 1 });
    gsap.set('.loader', { display: 'none' });
    document.body.classList.remove('loading');
}

// AUDIO EXPERIENCE (Micro-interactions only)
let audioCtx;
let audioInitialized = false;

function initAudio() {
    if (audioInitialized && audioCtx && audioCtx.state === 'running') return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        
        if (!audioCtx) {
            audioCtx = new AudioContextClass();
        }
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        audioInitialized = true;
    } catch(e) {}
}

function playHoverSound() {
    if(!audioInitialized || !audioCtx) return;
    if(audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.03);
        
        gainNode.gain.setValueAtTime(0.003, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    } catch(e) {}
}

function playClickSound() {
    if(!audioInitialized || !audioCtx) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
}

// Initialize audio on first valid user interaction
const activateAudio = () => {
    initAudio();
    // Play a silent wave to unlock the AudioContext completely
    if (audioInitialized && audioCtx) {
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.01);
        } catch(e) {}
    }
};

document.addEventListener('click', activateAudio, { once: true });
document.addEventListener('mousedown', activateAudio, { once: true });
document.addEventListener('touchstart', activateAudio, { once: true });
document.addEventListener('keydown', activateAudio, { once: true });

function playFocusSound() {
    if(!audioInitialized || !audioCtx) return;
    try {
        const playBeep = (timeOffset) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 2400;
            gain.gain.setValueAtTime(0, audioCtx.currentTime + timeOffset);
            gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + timeOffset + 0.01);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + timeOffset + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + timeOffset);
            osc.stop(audioCtx.currentTime + timeOffset + 0.06);
        };
        playBeep(0);
        playBeep(0.12);
    } catch(e){}
}

function playShutterSound() {
    if(!audioInitialized || !audioCtx) return;
    try {
        // Mechanical click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
        
        // Mirror slap noise
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.1);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.002, audioCtx.currentTime + 0.1);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start();
    } catch(e){}
}

const translations = {
    ES: {
        brand: "Boniek Aparicio",
        portfolio: "Portafolio",
        studio: "Sobre mí",
        portal: "Portal Privado",
        book: "Reservar Sesión",
        hero_title: "Tus momentos,<br><em>para siempre.</em>",
        hero_subtitle: "Soy Boniek Aparicio, fotógrafo en Panamá. Capturo lo que de verdad importa: tu gente, tu historia, tu momento.",
        hero_btn_portfolio: "Ver Portafolio",
        hero_btn_book: "Reservar Sesión",
        hero_scroll: "Desliza para explorar",
        work_eyebrow: "Portafolio",
        work_title: "Algunos de mis trabajos",
        work_more: "Ver Más Archivos",
        about_title: "Más que fotos, <em>recuerdos</em> que perduran.",
        about_body: "Soy Boniek Aparicio, fotógrafo panameño. Me encanta capturar esos momentos reales: una sonrisa, una mirada, un abrazo. Detrás de cada foto hay una historia, y mi trabajo es contarla tal como pasó, sin poses forzadas. Vamos a crear recuerdos que de verdad valgan la pena.",
        process_eyebrow: "Cómo trabajo",
        process_title: "Así de fácil es trabajar conmigo",
        step_1_title: "Hablamos",
        step_1_desc: "Me cuentas qué tienes en mente, para qué es la sesión y cómo te gustaría que salieran las fotos. Sin compromiso.",
        step_2_title: "Planeamos",
        step_2_desc: "Escogemos juntos el lugar, la fecha y los detalles. Te oriento con todo para que llegues tranquilo el día de la sesión.",
        step_3_title: "La sesión de fotos",
        step_3_desc: "El día llegó. Nos relajamos, nos reímos y disfrutamos. Yo me encargo de capturar los momentos sin que tengas que posar a la fuerza.",
        step_4_title: "Recibes tus fotos",
        step_4_desc: "Edito cada foto con cuidado y te las entrego listas para que las disfrutes, las compartas y las guardes para siempre.",
        portal_title: "Tu Galería Privada",
        portal_desc: "Cuando termino de editar, subo todas tus fotos a una galería privada para que las veas, descargues y compartas cuando quieras, desde donde sea.",
        portal_nav_coll: "<i data-lucide='image'></i> Colección",
        portal_nav_fav: "<i data-lucide='heart'></i> Favoritos",
        portal_nav_dl: "<i data-lucide='download'></i> Descargar Todo",
        portal_nav_share: "<i data-lucide='share-2'></i> Compartir Seguro",
        portal_main_title: "Carpeta de Fotografías",
        portal_main_desc: "Tus mejores momentos &middot; Listas para descargar",
        portal_btn_slideshow: "Presentación",
        quote: "\"Boniek nos hizo sentir en confianza desde el primer momento. Nada de poses tiesas, puras risas y naturalidad. Las fotos quedaron brutales, tal cual vivimos ese día.\"",
        quote_author_detail: "Boda en Casco Antiguo, Ciudad de Panamá",
        booking_eyebrow: "Consultas",
        studio_label: "El Estudio",
        booking_title: "Reserva<br>tu sesión.",
        booking_desc: "Cuéntame qué tienes en mente y te respondo lo antes posible. Escríbeme por aquí o por WhatsApp y vemos juntos cómo capturar tu momento.",
        form_name: "Nombre",
        form_name_ph: "Tu nombre",
        form_email: "Correo",
        form_email_ph: "tu@correo.com",
        form_interest: "Área de Interés",
        form_interest_ph: "Selecciona un tipo de sesión",
        form_opt_editorial: "Retrato Editorial",
        form_opt_wedding: "Boda de Lujo",
        form_opt_commercial: "Comercial / Moda",
        form_date: "Fecha Estimada",
        form_date_ph: "Seleccionar fecha",
        form_details: "Detalles del Proyecto",
        form_details_ph: "Cuéntanos sobre tu visión...",
        form_submit: "Enviar Consulta",
        footer_massive: "Tu historia merece<br><em>más</em> que lo ordinario.",
        footer_rights: "&copy; 2026 Boniek Aparicio. Todos los derechos reservados.",
        footer_privacy: "Privacidad",
        loader_btn: "Entrar"
    },
    EN: {
        brand: "Boniek Aparicio",
        portfolio: "Portfolio",
        studio: "About me",
        portal: "Private Portal",
        book: "Book Session",
        hero_title: "Your moments,<br><em>forever.</em>",
        hero_subtitle: "I'm Boniek Aparicio, a photographer in Panama. I capture what truly matters: your people, your story, your moment.",
        hero_btn_portfolio: "View Portfolio",
        hero_btn_book: "Book Session",
        hero_scroll: "Scroll to explore",
        work_eyebrow: "Portfolio",
        work_title: "Some of my work",
        work_more: "View More Archives",
        about_title: "More than photos, <em>memories</em> that last.",
        about_body: "I'm Boniek Aparicio, a Panamanian photographer. I love capturing those real moments: a smile, a glance, a hug. Behind every photo there's a story, and my job is to tell it just as it happened, with no forced poses. Let's create memories that are truly worth keeping.",
        process_eyebrow: "How I work",
        process_title: "Working with me is this easy",
        step_1_title: "We talk",
        step_1_desc: "Tell me what you have in mind, what the session is for, and how you'd like your photos to look. No commitment.",
        step_2_title: "We plan",
        step_2_desc: "We pick the place, the date and the details together. I'll guide you through everything so you arrive relaxed on the day.",
        step_3_title: "The photo session",
        step_3_desc: "The day is here. We relax, we laugh and we enjoy. I take care of capturing the moments without you having to force a pose.",
        step_4_title: "You get your photos",
        step_4_desc: "I edit each photo carefully and deliver them ready for you to enjoy, share and keep forever.",
        portal_title: "Your Private Gallery",
        portal_desc: "Once I'm done editing, I upload all your photos to a private gallery so you can view, download and share them whenever you want, from anywhere.",
        portal_nav_coll: "<i data-lucide='image'></i> Collection",
        portal_nav_fav: "<i data-lucide='heart'></i> Favorites",
        portal_nav_dl: "<i data-lucide='download'></i> Download All",
        portal_nav_share: "<i data-lucide='share-2'></i> Secure Share",
        portal_main_title: "Photo Folder",
        portal_main_desc: "Your best moments &middot; Ready to download",
        portal_btn_slideshow: "Slideshow",
        quote: "\"Boniek made us feel comfortable from the very first moment. No stiff poses, just laughter and real moments. The photos came out amazing, exactly how we lived that day.\"",
        quote_author_detail: "Wedding in Casco Antiguo, Panama City",
        booking_eyebrow: "Inquiries",
        studio_label: "The Studio",
        booking_title: "Book<br>your session.",
        booking_desc: "Tell me what you have in mind and I'll get back to you as soon as possible. Message me here or on WhatsApp and let's figure out how to capture your moment together.",
        form_name: "Name",
        form_name_ph: "Your name",
        form_email: "Email",
        form_email_ph: "your@email.com",
        form_interest: "Area of Interest",
        form_interest_ph: "Select a session type",
        form_opt_editorial: "Editorial Portrait",
        form_opt_wedding: "Luxury Wedding",
        form_opt_commercial: "Commercial / Fashion",
        form_date: "Estimated Date",
        form_date_ph: "Select date",
        form_details: "Project Details",
        form_details_ph: "Tell us about your vision...",
        form_submit: "Send Inquiry",
        footer_massive: "Your story deserves<br><em>more</em> than the ordinary.",
        footer_rights: "&copy; 2026 Boniek Aparicio. All rights reserved.",
        footer_privacy: "Privacy",
        loader_btn: "Enter"
    }
};

let currentLang = 'ES';

function setLanguage(lang) {
    currentLang = lang;
    
    // Translate normal elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Re-create icons for navigation elements that had nested icons updated
    lucide.createIcons();
}

const langToggle = document.querySelector('.lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const nextLang = currentLang === 'ES' ? 'EN' : 'ES';
        this.textContent = nextLang === 'ES' ? 'EN' : 'ES'; // Shows the target language on the button
        setLanguage(nextLang);
    });
}

// LENIS SMOOTH SCROLL — solo en desktop. En móvil usamos scroll nativo (más fluido en touch).
const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;

if (isMobile || prefersReducedMotion) {
    // Quitar el smooth scroll por JS y dejar el scroll nativo del navegador
    document.documentElement.classList.remove('lenis', 'lenis-smooth');
    // Objeto compatible para que el resto del código no falle
    lenis = {
        stop() { document.body.style.overflow = 'hidden'; },
        start() { document.body.style.overflow = ''; },
        on() {},
        raf() {},
        scrollTo(target) {
            if (typeof target === 'number') {
                window.scrollTo({ top: target, behavior: 'smooth' });
            } else if (target && target.scrollIntoView) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
} else {
    lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);
}

// CURSOR
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (window.matchMedia("(pointer: fine)").matches) {
    // Activa el cursor custom solo aquí; el body conserva el cursor nativo si esto no corre.
    document.body.classList.add('has-custom-cursor');
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let dotX = mouseX, dotY = mouseY, ringX = mouseX, ringY = mouseY;
    
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    const renderCursor = () => {
        dotX += (mouseX - dotX) * 0.2; dotY += (mouseY - dotY) * 0.2;
        ringX += (mouseX - ringX) * 0.1; ringY += (mouseY - ringY) * 0.1;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const interactables = document.querySelectorAll('a, button, input, textarea, select, .work-item, .nav-brand, .menu-item, .lightbox-close');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            playHoverSound();
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        el.addEventListener('click', () => {
            playClickSound();
        });
    });
}

// MAGNETIC - Reusable function
function attachMagneticEffect() {
    document.querySelectorAll('.magnetic').forEach((el) => {
        // Remove previous listeners if exists
        el.removeEventListener('mousemove', el._magneticHandler);
        el.removeEventListener('mouseleave', el._magneticLeaveHandler);

        el._magneticHandler = (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = e.clientX - (left + width/2);
            const y = e.clientY - (top + height/2);
            const strength = el.dataset.strength || 20;
            gsap.to(el, { x: (x/width)*strength, y: (y/height)*strength, duration: 1, ease: "power4.out" });
        };

        el._magneticLeaveHandler = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });

        el.addEventListener('mousemove', el._magneticHandler);
        el.addEventListener('mouseleave', el._magneticLeaveHandler);
    });
}

attachMagneticEffect();



// LIGHTBOX
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = document.querySelector('.lightbox-close');
let lastFocusedElement = null;

function openLightbox(src) {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = src;
    lightbox.style.visibility = 'visible';
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'auto';
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
    
    // Focus the close button for keyboard users
    lightboxClose.setAttribute('tabindex', '0');
    lightboxClose.focus();
    
    if (typeof lenis !== 'undefined' && lenis.stop) lenis.stop();
}

// Focus trap inside lightbox
lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault(); // Only one focusable element (close button)
        lightboxClose.focus();
    }
});

// Event delegation en el grid
document.addEventListener('click', (e) => {
    const item = e.target.closest('.work-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img || !img.src) return;
    openLightbox(img.src);
}, true);

// Teclado: las fotos del portafolio (role="button" tabindex="0") abren con Enter / Espacio.
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest && e.target.closest('.work-item');
    if (!item) return;
    e.preventDefault();
    const img = item.querySelector('img');
    if (img && img.src) openLightbox(img.src);
});

function attachLightboxListeners() {}

function closeLightbox() {
    document.body.style.overflow = '';
    lightbox.style.opacity = '0';
    lightbox.style.visibility = 'hidden';
    lightbox.style.pointerEvents = 'none';
    lightboxImg.style.opacity = '0';
    
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
    
    if (typeof lenis !== 'undefined') lenis.start();
    if (typeof gsap !== 'undefined') {
        gsap.to(lightboxImg, { scale: 0.95, opacity: 0, duration: 0.4 });
        gsap.to(lightbox, { autoAlpha: 0, duration: 0.5, delay: 0.2 });
    }
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeLightbox();
    }
});

lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
});

// ESC key to close lightbox
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && lightbox.style.visibility !== 'hidden') closeLightbox();
});

attachLightboxListeners();

// LOADER
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    if (REDUCE_MOTION) { settleReducedMotion(); return; }
    const tl = gsap.timeline();

    tl.to('.loader-text', { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
      .to('.loader-text', { opacity: 0, duration: 0.8, delay: 0.5, ease: "power2.inOut" })
      .to('.loader', { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "-=0.3")
      .from('.hero-image', { scale: 1.3, duration: 2, ease: "expo.out" }, "-=0.8")
      .fromTo('.hero-title', 
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 50 },
          { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0, duration: 1.5, ease: "expo.out" }, "-=1.5"
      )
      .from('.hero-subtitle, .hero-cta, .hero-scroll-indicator', { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1.2")
      .from('.nav-minimal', { y: -20, opacity: 0, duration: 1, ease: "power3.out" }, "-=1.5")
      .to('.floating-wa', { opacity: 1, pointerEvents: 'auto', duration: 1, ease: "power3.out" }, "-=1.0")
      .add(() => {
          document.body.classList.remove('loading');
      });
});

// REVEALS & PARALLAX
if (!REDUCE_MOTION) {
// NOTA: el reveal de los .img-wrapper del portafolio lo maneja portfolio-data.js
// tras renderizar el grid. Aquí solo el .about-img-wrapper (existe en el HTML estático).
gsap.utils.toArray('.about-img-wrapper').forEach(wrapper => {
    gsap.to(wrapper, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: "power4.inOut", scrollTrigger: { trigger: wrapper, start: "top 85%" } });
    const img = wrapper.querySelector('img');
    if(img) gsap.to(img, { yPercent: -20, ease: "none", scrollTrigger: { trigger: wrapper, start: "top bottom", end: "bottom top", scrub: true } });
});

gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.to(item, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 85%" } });
});

gsap.to('.mockup-frame', { rotateX: 0, scale: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: '.portal', start: "top 70%", end: "top 20%", scrub: 1 } });

const splitQuote = document.querySelector('.split-text-quote');
if(splitQuote) {
    gsap.fromTo(splitQuote, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 40 }, { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: '.testimonials', start: "top 75%" } });
    gsap.fromTo('.quote-author', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out", scrollTrigger: { trigger: '.testimonials', start: "top 75%" } });
}

gsap.fromTo('.reveal-text', { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: '.final-cta', start: "top 70%" } });
} // fin !REDUCE_MOTION (reveals)

// FORM SUBMISSION
const premiumForm = document.querySelector('.premium-form');
const btnSubmit = document.querySelector('.btn-submit');

if(premiumForm && btnSubmit) {
    premiumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        lenis.stop();
        initAudio();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const interest = document.getElementById('interest').value;
        const date = document.getElementById('date').value;
        const details = document.getElementById('details').value.trim();

        // Basic validation
        if(!name || !email || !interest || !details) {
            alert(currentLang === 'ES' ? 'Por favor completa todos los campos' : 'Please fill all fields');
            lenis.start();
            return;
        }

        // Play camera animation
        const tl = gsap.timeline({
            onComplete: () => {
                btnSubmit.querySelector('span').textContent = currentLang === 'ES' ? 'RECIBIDO' : 'RECEIVED';
                btnSubmit.style.background = '#00ff66';
                btnSubmit.style.color = '#000';
                premiumForm.reset();
                lenis.start();

                // Reset after 3 seconds
                setTimeout(() => {
                    btnSubmit.querySelector('span').textContent = currentLang === 'ES' ? 'Enviar Consulta' : 'Send Inquiry';
                    btnSubmit.style.background = '';
                    btnSubmit.style.color = '';
                }, 3000);
            }
        });

        tl.to('.focus-brackets', { opacity: 1, duration: 0.1 })
          .fromTo('.focus-brackets', { scale: 1.5 }, { scale: 1, duration: 0.4, ease: "power3.out", onStart: () => playFocusSound() })
          .to('.bracket', { borderColor: '#00ff66', duration: 0.1 }, "+=0.2")
          .to('.camera-flash', { opacity: 1, duration: 0.05, onStart: () => playShutterSound() }, "+=0.1")
          .to('.focus-brackets', { opacity: 0, duration: 0 })
          .to('.camera-flash', { opacity: 0, duration: 0.8, ease: "power2.out" });

        // Enviar la consulta por WhatsApp a Boniek con todos los datos del formulario
        try {
            const interestText = {
                editorial: currentLang === 'ES' ? 'Retrato Editorial' : 'Editorial Portrait',
                wedding: currentLang === 'ES' ? 'Boda de Lujo' : 'Luxury Wedding',
                commercial: currentLang === 'ES' ? 'Comercial / Moda' : 'Commercial / Fashion'
            }[interest] || interest;

            const msg = currentLang === 'ES'
                ? `Hola Boniek! Quiero reservar una sesión.\n\n*Nombre:* ${name}\n*Correo:* ${email}\n*Tipo de sesión:* ${interestText}\n*Fecha estimada:* ${date || 'Por definir'}\n*Detalles:* ${details}`
                : `Hi Boniek! I'd like to book a session.\n\n*Name:* ${name}\n*Email:* ${email}\n*Session type:* ${interestText}\n*Estimated date:* ${date || 'TBD'}\n*Details:* ${details}`;

            const waUrl = `https://wa.me/50769200753?text=${encodeURIComponent(msg)}`;
            setTimeout(() => window.open(waUrl, '_blank'), 1200);
        } catch(err) {
            console.warn('No se pudo abrir WhatsApp:', err);
        }
    });

    // Optional: Show validation on input focus
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', () => playHoverSound());
    });
}

// SHOW MORE PORTFOLIO ITEMS
const btnMore = document.querySelector('.btn-more');
if(btnMore) {
    btnMore.addEventListener('click', () => {
        initAudio();
        playHoverSound();
        
        const hiddenItems = document.querySelectorAll('.hidden-item');
        
        // 1. Show hidden items in grid
        gsap.set(hiddenItems, { display: 'block' });
        
        // 2. Animate them beautifully with stagger
        gsap.fromTo(hiddenItems, 
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", onComplete: () => {
                ScrollTrigger.refresh();
            }}
        );
        
        // 3. Fade out and hide the "Ver Más" button
        gsap.to('.work-more-trigger', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                document.querySelector('.work-more-trigger').style.display = 'none';
            }
        });
    });
}

// SCROLL TO TOP ON BRAND CLICK
const navBrand = document.querySelector('.nav-brand');
if (navBrand) {
    navBrand.style.cursor = 'pointer';
    navBrand.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5 });
    });
}

// ── STATS COUNTER ────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const item = entry.target;
            item.classList.add('visible');
            const numEl = item.querySelector('.stat-number');
            if (numEl && !numEl.dataset.animated) {
                numEl.dataset.animated = 'true';
                const target = parseInt(numEl.dataset.target, 10);
                animateCounter(numEl, target);
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
    statsObserver.observe(el);
});

// ── SCROLL REVEAL WORDS ──────────────────────────────────────
function wrapWordsInSpans(el) {
    const text = el.innerHTML;
    // Preserve HTML tags AND whitespace — only wrap actual word tokens
    const wrapped = text.replace(/(<[^>]+>|[^\s<]+|\s+)/g, (match) => {
        if (match.startsWith('<')) return match;   // HTML tag → keep as-is
        if (/^\s+$/.test(match)) return match;     // whitespace → keep as-is
        return `<span class="scroll-reveal-word">${match}</span>`;
    });
    el.innerHTML = wrapped;
}

const revealTargets = document.querySelectorAll('.section-header h2, .about-content-col h2, .booking-text h2');
revealTargets.forEach(el => wrapWordsInSpans(el));

const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll('.scroll-reveal-word');
            words.forEach((word, i) => {
                setTimeout(() => word.classList.add('revealed'), i * 60);
            });
            wordObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

revealTargets.forEach(el => wordObserver.observe(el));
