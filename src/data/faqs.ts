// Preguntas frecuentes. Agregar una = agregar un objeto { q, a }.

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: '¿Puedo pedir cambios después de que mi sitio esté publicado?',
    a: 'Incluimos dos rondas de ajustes para Landing Page y tres para E-commerce. Los cambios pequeños de texto no cuentan como una ronda completa. Y si más adelante necesitas cambios más grandes o actualizaciones constantes, podemos ayudarte con rondas adicionales o con un plan mensual de mantenimiento.',
  },
  {
    q: '¿El dominio y el hosting están incluidos?',
    a: 'No están incluidos dentro del precio de construcción del sitio. El dominio y el hosting son servicios que se renuevan cada año y se pagan por separado. Te explicamos exactamente cuánto cuestan, cómo funcionan y quién debería ser el dueño de cada cuenta, para que tengas control y claridad desde el principio.',
  },
  {
    q: '¿Qué pasa después de que el sitio esté listo?',
    a: 'Nada obligatorio, el sitio es tuyo y puedes dejarlo funcionando sin más costos, exceptuando los del dominio y el hosting anualmente. Si prefieres que sigamos acompañándote (pequeños cambios, actualizaciones, revisiones periódicas), ofrecemos un plan de mantenimiento mensual desde $140.000 COP. Las automatizaciones o funciones nuevas se cotizan aparte, según lo que necesites.',
  },
  {
    q: '¿Puedo agregar más automatizaciones después?',
    a: 'Claro. Los paquetes no son pasos obligatorios. Puedes empezar con una web clara y funcional, y sumar tienda, reservas o automatización más adelante, cuando tu negocio lo necesite.',
  },
];
