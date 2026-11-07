// ─────────────────────────────────────────────────────────────
//  DATOS GENERALES DE LA PÁGINA
//  Edita aquí tus enlaces y los textos cortos que se repiten.
//  Deja un campo vacío ('') para que no aparezca en la página.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Simón Rodríguez Arango',
  // Dos líneas del nombre tal como aparecen dentro del detector
  nameLines: ['Simón', 'Rodríguez Arango'],
  email: 'simon.rodrigueza@udea.edu.co',
  github: 'https://github.com/simonrodrigueza',
  orcid: '', // ej. 'https://orcid.org/0000-0000-0000-0000'
  ads: '', // enlace a tu biblioteca pública de ADS
  linkedin: '',
};

// Textos que dependen del idioma
export const ui = {
  en: {
    htmlLang: 'en',
    description:
      'Simón Rodríguez Arango — astronomy undergraduate at Universidad de Antioquia working on the chemistry of protoplanetary disks with JWST.',
    intro: 'Astronomy undergraduate at Universidad de Antioquia, working on disk chemistry with JWST. Looking for a PhD position starting in 2027.',
    cv: 'CV (PDF)',
    cvTitle: 'Curriculum vitae (PDF)',
    openPdf: 'Open in a new tab ↗',
    downloadPdf: 'Download PDF ↓',
    email: 'Email',
    plate: 'Plate',
    simulated: 'Simulated',
    animation: 'Animation',
    hint: 'hover over the name',
    hintTouch: 'touch the name',
    fig: 'Fig.',
    switchTo: 'Español',
    switchLabel: 'Ver en español',
    sectionsLabel: 'Sections',
    figureAlt: 'Simulated detector image of a protoplanetary disk, with the name Simón Rodríguez Arango exposed in the lower-left corner.',
  },
  es: {
    htmlLang: 'es',
    description:
      'Simón Rodríguez Arango — estudiante de Astronomía en la Universidad de Antioquia; química de discos protoplanetarios con JWST.',
    intro: 'Estudiante de Astronomía en la Universidad de Antioquia; trabajo en química de discos con JWST. Busco un doctorado que empiece en 2027.',
    cv: 'CV (PDF)',
    cvTitle: 'Hoja de vida (PDF)',
    openPdf: 'Abrir en otra pestaña ↗',
    downloadPdf: 'Descargar PDF ↓',
    email: 'Correo',
    plate: 'Lámina',
    simulated: 'Simulado',
    animation: 'Animación',
    hint: 'pasa el cursor por el nombre',
    hintTouch: 'toca el nombre',
    fig: 'Fig.',
    switchTo: 'English',
    switchLabel: 'View in English',
    sectionsLabel: 'Secciones',
    figureAlt: 'Imagen simulada de detector de un disco protoplanetario, con el nombre Simón Rodríguez Arango en la esquina inferior izquierda.',
  },
} as const;

export type Lang = keyof typeof ui;
