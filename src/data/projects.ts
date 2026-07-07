// Proyectos del portafolio. Los del export eran placeholders en inglés;
// quedaron traducidos. Cuando tengas proyectos reales, reemplaza estos
// objetos y agrega la imagen de cada uno.

export interface Project {
  tag: string; // rubro ("Café", "Boutique"…)
  status: string; // "En línea" | "En camino" | "Disponible"
  name: string;
  blurb: string;
}

export const projects: Project[] = [
  {
    tag: 'Café',
    status: 'En línea',
    name: 'Morning Light Coffee',
    blurb: 'Sitio de una página con horarios, menú y botón de llamada directa. En línea en una semana.',
  },
  {
    tag: 'Boutique',
    status: 'En camino',
    name: 'Thread & Fold',
    blurb: 'Una pequeña tienda en línea para una boutique de barrio. Lanzamiento próximo.',
  },
  {
    tag: 'Tu negocio',
    status: 'Disponible',
    name: 'Reservado para ti',
    blurb: 'Aquí hay un espacio para tu proyecto. Hablemos de lo que podría ser.',
  },
];
