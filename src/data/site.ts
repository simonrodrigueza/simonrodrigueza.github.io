// ─────────────────────────────────────────────────────────────
//  DATOS GENERALES DE LA PÁGINA
//  Edita aquí tus enlaces y los textos cortos que se repiten.
//  Deja un campo vacío ('') para que no aparezca en la página.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Simón Rodríguez Arango',
  // Dos líneas del nombre tal como aparecen dentro del detector
  nameLines: ['Simón', 'Rodríguez Arango'],
  // Foto del encabezado: pon el archivo en public/images/ y escribe aquí su ruta, ej. '/images/foto.jpg'
  photo: '',
  email: 'simon.rodrigueza@udea.edu.co',
  github: 'https://github.com/simonrodrigueza',
  orcid: 'https://orcid.org/0009-0005-7958-3759',
  linkedin: 'https://www.linkedin.com/in/simonrodrigueza23/',
  ads: '', // enlace a tu biblioteca pública de ADS
};

// Textos que dependen del idioma
export const ui = {
  en: {
    htmlLang: 'en',
    description:
      'Simón Rodríguez Arango — astronomy undergraduate at Universidad de Antioquia working on the chemistry of protoplanetary disks with JWST.',
    role: 'Astronomy undergraduate, Universidad de Antioquia',
    topics: 'Protoplanetary disks, astrochemistry and extreme UV environments, with JWST. Looking for a PhD position starting in 2027.',
    photoAlt: 'Portrait of Simón Rodríguez Arango',
    photoPlaceholder: '[photo]',
    downloadCv: 'Download CV',
    openTo: 'Open to',
    basedIn: 'Based in',
    copy: 'Copy',
    copied: 'Copied',
    lastUpdated: 'Last updated',
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
    role: 'Estudiante de Astronomía, Universidad de Antioquia',
    topics: 'Discos protoplanetarios, astroquímica y ambientes UV extremos, con JWST. Busco un doctorado que empiece en 2027.',
    photoAlt: 'Retrato de Simón Rodríguez Arango',
    photoPlaceholder: '[foto]',
    downloadCv: 'Descargar CV',
    openTo: 'Abierto a',
    basedIn: 'Desde',
    copy: 'Copiar',
    copied: 'Copiado',
    lastUpdated: 'Última actualización',
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
