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
    tag: 'E-commerce',
    status: 'En línea',
    name: 'Pet & Paint',
    blurb: 'Tienda en línea de productos para mascotas y pinturas artísticas.',
  },
  {
    tag: 'Tu negocio',
    status: 'Disponible',
    name: 'Reservado para ti',
    blurb: 'Aquí hay un espacio para tu proyecto. Hablemos de lo que podría ser.',
  },
];
