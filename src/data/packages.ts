// Contenido de los 3 paquetes de servicios.
// Para cambiar precios o textos, edita SOLO este archivo:
// el componente Services.astro se encarga de pintarlo.

export interface ServicePackage {
  number: string; // el numeral grande de la escalera ('01', '02'…)
  title: string;
  tag: string; // la etiqueta tipo píldora ("Para estar en línea")
  description: string;
  price: string; // texto del precio, o el CTA si no hay precio fijo
  showFrom: boolean; // ¿mostrar la palabrita "DESDE" antes del precio?
  featured: boolean; // true = tarjeta verde invertida (destaca)
}

export const packages: ServicePackage[] = [
  {
    number: '01',
    title: 'Landing Page',
    tag: 'Para estar en línea',
    description:
      'Una web clara, rápida y profesional para presentar tu negocio, mostrar lo que ofreces y facilitar que tus clientes te contacten. Con detalles modernos y con vida, no una página estática de las de siempre. Se ve bien en el celular, aparece en Google, y le quita presión a tu bandeja de entrada.',
    price: '$800.000 – $1.000.000 COP',
    showFrom: true,
    featured: false,
  },
  {
    number: '02',
    title: 'E-commerce',
    tag: 'Para vender en línea',
    description:
      '¿Listo para vender o recibir reservas en línea? Agregamos una tienda o sistema de reservas fácil de manejar, con productos, pagos, recogida o entrega, configurado para que puedas actualizarlo tú mismo cuando lo necesites.',
    price: '$2.500.000 COP',
    showFrom: true,
    featured: false,
  },
  {
    number: '03',
    title: 'Automatización e IA',
    tag: 'Para recuperar tiempo',
    description:
      'Analizamos cómo trabajas y conectamos herramientas que te quitan lo repetitivo: recordatorios automáticos, facturas que se envían solas, un asistente para preguntas frecuentes. Ideal si ya tienes tu negocio funcionando y quieres recuperar tiempo, sin complicarte con la parte técnica.',
    price: 'Cuéntanos de tu negocio',
    showFrom: false,
    featured: true,
  },
];
