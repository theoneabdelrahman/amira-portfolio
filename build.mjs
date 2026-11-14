import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { films, locales, site, writing } from './content.mjs';

const locale = locales.en;

const root = fileURLToPath(new URL('./', import.meta.url));
const versioned = file => `${file}?v=${createHash('sha256').update(readFileSync(join(root, file))).digest('hex').slice(0, 12)}`;
const stylesheet = versioned('style.css');
const script = versioned('site.js');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
const outbound = 'target="_blank" rel="noopener noreferrer"';
const external = (url, label, className = 'line-link') => `<a class="${className}" href="${escape(url)}" ${outbound}>${escape(label)} ${icon('arrow-external')}</a>`;
const filmPath = film => `film-${film.id}.html`;
const poster = film => [`${film.id}-poster.jpg`, film.posterWidth, 900, `${film.title} poster`];
const arabic = film => film.arabic ? `<span class="arabic-title" lang="ar" dir="rtl">${escape(film.arabic)}</span>` : '';
const runtime = seconds => `${Math.floor(seconds / 60)} min${seconds % 60 ? ` ${seconds % 60} sec` : ''}`;
const meta = film => [film.genre, film.year, film.seconds && runtime(film.seconds)].filter(Boolean).join(' · ');
const sectionTag = (number, label) => `<p class="section-tag"><span aria-hidden="true">${number}</span>${label}</p>`;
const intro = '<p>Amira’s documentaries pay attention to familiar places and the routines that give them meaning. In <i>Mamina</i>, a grandmother’s kitchen holds the memory of a relationship. <i>Biophilia</i> looks outward, at how nature persists amid city life.</p>';

const symbols = `<svg class="symbols" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <symbol id="arrow-external" viewBox="0 0 24 24"><path d="M6 18 18 6M7 6h11v11"/></symbol>
  <symbol id="arrow-right" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6"/></symbol>
  <symbol id="arrow-left" viewBox="0 0 24 24"><path d="M20 12H5m6-6-6 6 6 6"/></symbol>
  <symbol id="close-icon" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
  <symbol id="expand-icon" viewBox="0 0 24 24"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></symbol>
  <symbol id="instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-fill" cx="17.4" cy="6.7" r="1"/></symbol>
  <symbol id="tiktok" viewBox="0 0 24 24"><path class="icon-fill" d="M14 2h3c.4 2.3 1.8 3.7 4 4v3.2c-1.5 0-2.8-.4-4-1.2v7.1a6 6 0 1 1-6-6v3.2a2.9 2.9 0 1 0 2.9 2.8z"/></symbol>
  <symbol id="linkedin" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7m4 0v-7m0 3a2.5 2.5 0 0 1 5 0v4"/><circle class="icon-fill" cx="8" cy="7" r=".9"/></symbol>
</svg>`;

function socialProfiles() {
  return `<ul class="social-profiles" aria-label="Official social profiles">${site.socials.map(profile => `<li><a href="${escape(profile.url)}" ${outbound}>${icon(profile.id)}<span><strong>${profile.name}</strong><span>${escape(profile.profile)}</span><small>${profile.label}</small></span>${icon('arrow-external')}</a></li>`).join('')}</ul>`;
}

function navigationLinks(page, placement = 'footer') {
  const links = placement === 'shortcuts'
    ? locale.navigation.filter(([, url]) => url === '#work' || url === 'contact.html')
    : locale.navigation;
  return links.map(([label, url]) => {
    const contact = url === 'contact.html';
    const shortcut = contact || url === '#work';
    const current = page === url || (url === '#work' && page.startsWith('film-'));
    const href = url.startsWith('#') ? `index.html${url}` : url;
    const classes = [contact && 'nav-contact', placement === 'panel' && shortcut && 'nav-wide-only'].filter(Boolean);
    return `<a href="${href}"${classes.length ? ` class="${classes.join(' ')}"` : ''}${current ? ' aria-current="page"' : ''}>${escape(contact && placement !== 'footer' ? 'Contact Me' : label)}</a>`;
  }).join('');
}

function header(page) {
  return `<header class="topbar"><div class="shell nav-inner">
    <a class="brand" href="index.html" aria-label="Amira Abdelfadil, home">amira abdelfadil</a>
    <div class="nav-actions"><nav class="nav-shortcuts" aria-label="Quick links">${navigationLinks(page, 'shortcuts')}</nav><button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="navigation-panel" hidden><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button></div>
    <div class="nav-panel" id="navigation-panel"><div><nav aria-label="Primary">${navigationLinks(page, 'panel')}</nav></div></div>
  </div><div class="read-progress" aria-hidden="true"></div></header>`;
}

function footer(page) {
  return `<footer class="footer"><div class="shell footer-inner">
    <div><p class="footer-name">Amira Abdelfadil</p><p>Filmmaker · Visual Artist</p></div>
    <nav aria-label="Footer">${navigationLinks(page)}</nav>
    <div class="footer-base"><span>© Amira Abdelfadil</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
  </div></footer>`;
}

function image(asset, { priority = false, sizes = '(max-width: 640px) 100vw, 50vw' } = {}) {
  const [file, width, height, alt] = asset;
  const src = `assets/${file.endsWith('.webp') ? 'optimized/' : ''}${file}`;
  const webp = file.replace(/\.jpg$/, '.webp');
  const smallSource = 'assets/optimized/';
  return `<picture>${file.endsWith('.jpg') ? `<source type="image/webp" srcset="${smallSource}${webp.replace('.webp', '-480.webp')} 480w, ${smallSource}${webp} ${width}w" sizes="${escape(sizes)}">` : ''}<img src="${src}" width="${width}" height="${height}" alt="${escape(alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></picture>`;
}

function galleryItem(asset, caption, group, settings, className = '') {
  const [file, width, height, alt] = asset;
  const href = `assets/${file.endsWith('.webp') ? 'optimized/' : ''}${file}`;
  return `<figure${className ? ` class="${className}"` : ''}><a class="image-link" href="${href}" data-lightbox="${group}" data-caption="${escape(caption)}" data-width="${width}" data-height="${height}" aria-label="Enlarge image: ${escape(alt)}">${image(asset, settings)}<span class="image-expand">${icon('expand-icon')}</span></a><figcaption>${escape(caption)}</figcaption></figure>`;
}

function writingList() {
  return `<div class="essay-list">${writing.map((entry, index) => `<article class="essay"><span class="folio" aria-hidden="true">0${index + 1}</span><div><h3>${external(entry.url, entry.title, 'essay-title')}</h3><p>${escape(entry.summary)}</p><p class="film-meta">Thought.is</p></div></article>`).join('')}</div>`;
}

const contactCTA = `<a class="pill" href="contact.html">Contact Amira ${icon('arrow-right')}</a>`;
const portrait = ['amira-portrait.jpg', 540, 720, 'Amira holding a camera'];
const hero = ['mamina-02.jpg', 1344, 709, 'Two women talk on a balcony overlooking Cairo'];
const lightbox = `<dialog class="lightbox" aria-labelledby="lightbox-title">
  <div class="lightbox-toolbar"><h2 id="lightbox-title">Image viewer</h2><p class="lightbox-count" aria-live="polite"></p><button class="round-button" type="button" data-close aria-label="Close image viewer">${icon('close-icon')}</button></div>
  <div class="lightbox-stage"><button class="round-button" type="button" data-step="-1" aria-label="Previous image">${icon('arrow-left')}</button><figure><img alt="" draggable="false"><figcaption></figcaption></figure><button class="round-button" type="button" data-step="1" aria-label="Next image">${icon('arrow-right')}</button></div>
</dialog>`;

function filmPage(film, index) {
  const previous = films[(index + films.length - 1) % films.length];
  const next = films[(index + 1) % films.length];
  const lead = film.stills.find(asset => asset[1] > asset[2]);
  return `<article class="shell section project">
    <a class="line-link back-link" href="index.html#work">${icon('arrow-left')} All films</a>
    <div class="project-heading">${sectionTag(String(index + 1).padStart(2, '0'), 'Film')}<h1>${escape(film.title)}</h1>${arabic(film)}${meta(film) ? `<p class="film-meta">${meta(film)}</p>` : ''}</div>
    ${lead ? `<figure class="project-hero">${image(lead, { priority: true, sizes: '(max-width: 1360px) 100vw, 1280px' })}<figcaption>Still from <i>${escape(film.title)}</i></figcaption></figure>` : ''}
    <div class="project-body">${galleryItem(poster(film), `Original poster · ${film.title}`, 'poster', { priority: !lead, sizes: '(max-width: 720px) 65vw, 28vw' }, 'project-poster')}<div class="prose project-copy">${film.synopsis ? `<h2>Synopsis</h2><p>${escape(film.synopsis)}</p>` : film.tagline ? `<h2>Poster tagline</h2><p>${escape(film.tagline)}</p>` : ''}<h2>Production credits</h2><dl class="credits">${film.credits.map(([role, person]) => `<div><dt>${escape(role)}</dt><dd>${escape(person)}</dd></div>`).join('')}</dl>${film.watch ? external(film.watch[1], film.watch[0]) : ''}<div class="actions">${contactCTA}</div></div></div>
    <section class="project-gallery" aria-labelledby="stills-title"><h2 id="stills-title">${film.galleryTitle ?? 'Film stills'}</h2><div class="gallery-grid">${film.stills.map((asset, assetIndex) => galleryItem(asset, `${film.galleryTitle ? 'Poster detail' : 'Film still'} ${String(assetIndex + 1).padStart(2, '0')} · ${film.title}`, film.id)).join('')}</div></section>
    <nav class="related" aria-label="Related films"><a href="${filmPath(previous)}"><span>${icon('arrow-left')} Previous film</span><strong>${escape(previous.title)}</strong></a><a href="${filmPath(next)}"><span>Next film ${icon('arrow-right')}</span><strong>${escape(next.title)}</strong></a></nav>
  </article>`;
}

function visualPage() {
  return `<section class="shell section inner-page">${sectionTag('01', 'Visual work')}<h1>Art &amp; <em>Photography</em></h1><p class="section-intro">A selection of original stills from Amira’s films, grouped by project.</p>${films.filter(film => !film.galleryTitle).map(film => `<section class="visual-group" aria-labelledby="visual-${film.id}"><div class="section-heading"><h2 id="visual-${film.id}">${escape(film.title)}</h2><a class="line-link" href="${filmPath(film)}">View film ${icon('arrow-right')}</a></div><div class="gallery-grid">${film.stills.map((asset, index) => galleryItem(asset, `Film still ${String(index + 1).padStart(2, '0')} · ${film.title}`, film.id)).join('')}</div></section>`).join('')}</section>`;
}

function aboutPage() {
  return `<section class="shell section inner-page editorial-grid about-page"><div>${sectionTag('01', 'Biography')}<p class="arabic-kicker" lang="ar" dir="rtl">أميرة عبد الفضيل</p><h1>About <em>Amira</em></h1><div class="prose"><p>Amira Mahmoud Abdel-Fadil is a Cairo-based filmmaker, photographer, writer, and visual artist. She studied broadcasting at October University for Modern Sciences and Arts.</p>${intro}<p>Her work spans directing, writing, producing, cinematography, editing, and sound. Outside her films she has worked in digital media, script development, event coordination, and education.</p></div><div class="actions">${contactCTA}</div></div><figure>${image(portrait, { priority: true })}<figcaption>Amira Abdelfadil · Portrait</figcaption></figure></section>`;
}

const person = { '@type': 'Person', '@id': `${site.url}#amira`, name: site.name, url: site.url, image: `${site.url}assets/amira-portrait.jpg`, jobTitle: 'Filmmaker and visual artist', sameAs: site.socials.map(profile => profile.url) };
const pages = [
  { file: 'art.html', title: 'Art & Photography', description: 'Original film stills from the work of filmmaker and visual artist Amira Abdelfadil.', content: visualPage() },
  { file: 'about.html', title: 'About', description: 'About Cairo-based filmmaker, photographer, writer, and visual artist Amira Abdelfadil.', content: aboutPage(), structured: person },
  { file: 'writing.html', title: 'Writing', description: 'Selected essays by Amira Abdelfadil on memory, writing, and taking chances.', content: `<section class="shell section inner-page">${sectionTag('01', 'Archive')}<h1>Beyond the <em>frame</em></h1><p class="section-intro">Selected essays by Amira Abdelfadil, published at Thought.is.</p>${writingList()}</section>`, structured: { '@type': 'ItemList', itemListElement: writing.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Article', headline: entry.title, url: entry.url, author: { '@id': person['@id'] } } })) } },
  { file: 'contact.html', title: 'Contact', description: 'Contact filmmaker and visual artist Amira Abdelfadil by email or through her official social profiles.', content: `<section class="shell section inner-page contact-page">${sectionTag('01', 'Enquiries')}<h1>Contact <em>Amira</em></h1><p class="contact-lead">Let’s collaborate on stories worth telling.</p><p class="section-intro">Get in touch for filmmaking, documentary projects, creative collaborations, and professional enquiries.</p><a class="line-link contact-email" href="mailto:${escape(site.email)}">${escape(site.email)} ${icon('arrow-right')}</a>${socialProfiles()}</section>` },
  ...films.map((film, index) => ({ file: filmPath(film), title: film.title, description: film.excerpt ?? `${film.title}, a film by Amira Abdel-Fadil. View the original poster, film stills, and production credits.`, image: `${film.id}-poster.jpg`, content: filmPage(film, index), structured: { '@type': 'Movie', name: film.title, ...(film.arabic ? { alternateName: film.arabic } : {}), ...(film.genre ? { genre: film.genre } : {}), ...(film.seconds ? { duration: `PT${Math.floor(film.seconds / 60)}M${film.seconds % 60}S` } : {}), image: `${site.url}assets/${film.id}-poster.jpg` } })),
];

const address = file => new URL(file, site.url).href;

function render(page) {
  const url = address(page.file);
  const title = `${page.title} | ${site.name}`;
  return `<!doctype html>
<html lang="${locale.lang}" dir="${locale.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f4ec">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(page.description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${locale.ogLocale}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:image" content="${site.url}assets/${page.image ?? 'mamina-02.jpg'}">
  <meta property="og:image:alt" content="${escape(page.image ? `${page.title} poster` : hero[3])}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="${stylesheet}">
  <script src="${script}" defer></script>
  ${page.structured ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', url, ...page.structured }).replaceAll('<', '\\u003c')}</script>` : ''}
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  ${symbols}
  ${header(page.file)}
  <main id="main" tabindex="-1">
  ${page.content}
  </main>
  ${footer(page.file)}
  ${lightbox}
</body>
</html>
`;
}

const outputs = pages.map(page => [page.file, render(page)]);
outputs.push(['sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[site.url, ...pages.map(page => address(page.file))].map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`]);
outputs.push(['robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}sitemap.xml\n`]);

for (const [file, contents] of outputs) {
  const destination = join(root, file);
  if (!process.argv.includes('--check')) writeFileSync(destination, contents);
  else if (readFileSync(destination, 'utf8') !== contents) {
    console.error(`Regenerate ${file}`);
    process.exitCode = 1;
  }
}
