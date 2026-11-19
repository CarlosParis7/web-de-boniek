// PORTFOLIO DATA
// size: "vertical" (4 cols) | "horizontal" (6 cols) | "large" (8 cols)
// offset: "mt-medium" | "mt-large" | ""
const portfolioData = [
    {
        id: 1,
        title_es: "Retrato",
        title_en: "Portrait",
        location_es: "Estudio",
        location_en: "Studio",
        image: "./images/retrato-1.webp",
        size: "vertical",
        offset: ""
    },
    {
        id: 2,
        title_es: "Maternidad",
        title_en: "Maternity",
        location_es: "Panamá",
        location_en: "Panama",
        image: "./images/maternidad-1.webp",
        size: "vertical",
        offset: "mt-medium"
    },
    {
        id: 3,
        title_es: "Cumpleaños",
        title_en: "Birthday",
        location_es: "Estudio",
        location_en: "Studio",
        image: "./images/glamour-1.webp",
        size: "vertical",
        offset: ""
    },
    {
        id: 4,
        title_es: "Bodas",
        title_en: "Weddings",
        location_es: "Ciudad de Panamá",
        location_en: "Panama City",
        image: "./images/boda-1.webp",
        size: "large",
        offset: "mt-medium"
    },
    {
        id: 5,
        title_es: "Traje Típico",
        title_en: "Traditional",
        location_es: "Panamá",
        location_en: "Panama",
        image: "./images/tipico-1.webp",
        size: "vertical",
        offset: ""
    },
    {
        id: 6,
        title_es: "Graduaciones",
        title_en: "Graduations",
        location_es: "Estudio",
        location_en: "Studio",
        image: "./images/graduacion-2.webp",
        size: "vertical",
        offset: "mt-medium"
    },
    {
        id: 7,
        title_es: "Niños",
        title_en: "Kids",
        location_es: "Estudio",
        location_en: "Studio",
        image: "./images/ninos-1.webp",
        size: "vertical",
        offset: "mt-medium"
    },
    {
        id: 8,
        title_es: "Primera Comunión",
        title_en: "First Communion",
        location_es: "Ciudad de Panamá",
        location_en: "Panama City",
        image: "./images/familia-1.webp",
        size: "vertical",
        offset: ""
    },
    {
        id: 9,
        title_es: "Parejas",
        title_en: "Couples",
        location_es: "Estudio",
        location_en: "Studio",
        image: "./images/parejas-2.webp",
        size: "vertical",
        offset: "mt-medium"
    },
    {
        id: 10,
        title_es: "Familiar Navideño",
        title_en: "Christmas Family",
        location_es: "Ciudad de Panamá",
        location_en: "Panama City",
        image: "./images/familia-2.webp",
        size: "vertical",
        offset: ""
    },
    {
        id: 11,
        title_es: "Quinceaños",
        title_en: "Quinceañera",
        location_es: "Parque",
        location_en: "Park",
        image: "./images/quinceanera-blue.webp",
        size: "vertical",
        offset: "mt-medium"
    }
];

// Ancho que ocupa cada foto en pantalla: el navegador elige el archivo justo (600, 1000 o 1600px)
const SIZES = {
    vertical:   '(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 34vw',
    horizontal: '(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 50vw',
    large:      '(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 66vw'
};

const VIEW_ICON =`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

function renderPortfolioGrid() {
    const grid = document.querySelector('.masonry-grid');
    if (!grid) return;

    grid.innerHTML = '';

    portfolioData.forEach((item) => {
        const baseClass = item.hidden
            ? `work-item ${item.size} magnetic-wrap hidden-item`
            : `work-item ${item.size} magnetic-wrap`;
        const offset   = item.offset || '';
        const title    = currentLang === 'ES' ? item.title_es    : item.title_en;
        const location = currentLang === 'ES' ? item.location_es : item.location_en;
        const base     = item.image.replace(/\.webp$/, '');

        const html = `
            <div class="${baseClass} ${offset}" data-id="${item.id}" role="button" tabindex="0" aria-label="Ver foto: ${title}, ${location}">
                <div class="img-wrapper">
                    <img src="${item.image}" srcset="${base}-600.webp 600w, ${item.image} 1000w, ${base}-1600.webp 1600w" sizes="${SIZES[item.size] || SIZES.vertical}" data-full="${base}-1600.webp" alt="${title}, ${location}" loading="lazy" decoding="async">
                    <span class="work-tag">${title}</span>
                    <div class="work-view">${VIEW_ICON}</div>
                    <div class="work-meta">
                        <h3>${title}</h3>
                        <p>${location}</p>
                    </div>
                </div>
            </div>
        `;

        grid.insertAdjacentHTML('beforeend', html);
    });

    attachLightboxListeners();
    attachMagneticEffect();
    createIcons();

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.img-wrapper').forEach(wrapper => {
            if (wrapper._gsapReady) return;
            wrapper._gsapReady = true;
            gsap.set(wrapper, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
            const img = wrapper.querySelector('img');
            if (img) gsap.to(img, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        ScrollTrigger.refresh();
    }
}

document.addEventListener('DOMContentLoaded', renderPortfolioGrid);
