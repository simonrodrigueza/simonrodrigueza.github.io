// ─────────────────────────────────────────────────────────────
//  ETAPAS DE LA ANIMACIÓN (una por sección, en orden)
//  Al bajar por la página, el detector pasa de una etapa a la siguiente:
//  nube → disco → anillos → planetas → fotoevaporación → sistema despejado.
//  "id" debe coincidir con el campo id de los archivos en src/content/.
//  Normalmente no necesitas tocar esto, salvo los textos "plate".
// ─────────────────────────────────────────────────────────────

export interface Stage {
  id: string;
  roman: string;
  cmap: string;
  stops: string[]; // mapa de color, de oscuro a brillante
  color: string; // color de acento (tinte del fondo, números, subrayados)
  zoom: number;
  inc: number; // inclinación del disco en grados
  name: { en: string; es: string }; // nombre de la etapa (se ve en el detector)
  plate: { en: string; es: string }; // frase bajo el detector
}

export const visuals: Stage[] = [
  {
    id: 'about', roman: 'I', cmap: 'inferno', stops: ['#000004', '#57106E', '#BC3754', '#F98E09', '#FCFFA4'], color: '#F98E09', zoom: 0.7, inc: 40,
    name: { en: 'prestellar core', es: 'núcleo preestelar' },
    plate: { en: 'A cold cloud of gas and dust, before anything has formed.', es: 'Una nube fría de gas y polvo, antes de que algo se forme.' },
  },
  {
    id: 'research', roman: 'II', cmap: 'viridis', stops: ['#440154', '#3B528B', '#21918C', '#5EC962', '#FDE725'], color: '#5EC962', zoom: 0.9, inc: 62,
    name: { en: 'protoplanetary disk', es: 'disco protoplanetario' },
    plate: { en: 'The cloud has collapsed: a star ignites inside a rotating disk.', es: 'La nube colapsó: una estrella se enciende dentro de un disco que gira.' },
  },
  {
    id: 'publications', roman: 'III', cmap: 'magma', stops: ['#000004', '#3B0F70', '#8C2981', '#DE4968', '#FCFDBF'], color: '#DE4968', zoom: 0.95, inc: 30,
    name: { en: 'rings & gaps', es: 'anillos y brechas' },
    plate: { en: 'Rings and gaps open up in the dust.', es: 'Se abren anillos y brechas en el polvo.' },
  },
  {
    id: 'projects', roman: 'IV', cmap: 'cividis', stops: ['#00224E', '#3B496C', '#7C7B78', '#BCAF6F', '#FEE838'], color: '#D9C35A', zoom: 0.95, inc: 26,
    name: { en: 'forming planets', es: 'planetas en formación' },
    plate: { en: 'Young planets appear inside the gaps.', es: 'Aparecen planetas jóvenes dentro de las brechas.' },
  },
  {
    id: 'outreach', roman: 'V', cmap: 'mako', stops: ['#0B0405', '#382A54', '#395D9C', '#3497A9', '#DEF5E5'], color: '#49C1AD', zoom: 0.85, inc: 56,
    name: { en: 'external photoevaporation', es: 'fotoevaporación externa' },
    plate: { en: 'A massive neighbour’s UV light strips the outer disk.', es: 'La luz UV de una vecina masiva arranca el disco externo.' },
  },
  {
    id: 'cv', roman: 'VI', cmap: 'gray', stops: ['#000000', '#3C3C3C', '#8A8A8A', '#D0D0D0', '#FFFFFF'], color: '#ECE8DF', zoom: 0.9, inc: 22,
    name: { en: 'a cleared system', es: 'un sistema despejado' },
    plate: { en: 'The gas is gone: a star and its planets remain.', es: 'El gas se fue: quedan la estrella y sus planetas.' },
  },
];
