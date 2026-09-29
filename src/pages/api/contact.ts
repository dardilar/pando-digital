// Endpoint de servidor: recibe el formulario y envía el correo con Resend.
// Es la única ruta del sitio que NO se genera en el build: corre en una
// Vercel Function en cada petición (por eso `prerender = false`).
import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO_EMAIL } from 'astro:env/server';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Helper para responder siempre con la misma forma: { ok, error? }
function json(body: { ok: boolean; error?: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Leer el cuerpo. Si no es JSON válido, alguien nos llamó "a mano" mal.
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Petición inválida.' }, 400);
  }

  // 2. Nunca confiar en lo que llega: forzar a string y recortar.
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(data.name);
  const business = str(data.business);
  const email = str(data.email);
  const message = str(data.message);

  // 3. Honeypot: un bot lo llenó → fingimos éxito sin enviar nada.
  if (str(data.botcheck)) return json({ ok: true });

  // 4. Validación de servidor (la del navegador se puede saltar con curl).
  if (!name || !email || !message) {
    return json({ ok: false, error: 'Faltan campos obligatorios.' }, 400);
  }
  if (!EMAIL_RE.test(email) || name.length > 200 || business.length > 200 || message.length > 5000) {
    return json({ ok: false, error: 'Datos inválidos.' }, 400);
  }

  // 5. Sin clave: en desarrollo simulamos; en producción es un error real
  //    (fingir éxito ahí significaría perder mensajes de clientes en silencio).
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    if (import.meta.env.DEV) {
      console.log('[contact] Modo simulado (falta RESEND_API_KEY o CONTACT_TO_EMAIL):', { name, email });
      return json({ ok: true });
    }
    console.error('[contact] Faltan variables de entorno de Resend');
    return json({ ok: false, error: 'El servidor no está configurado.' }, 500);
  }

  // 6. Llamar a la API de Resend. Mismo fetch que ya conoces, pero desde el
  //    servidor y con la clave secreta en la cabecera Authorization.
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Solo funciona si pandodigital.co está verificado en Resend (registros
      // DNS SPF/DKIM); si no, Resend rechaza el envío con un 403.
      from: 'Formulario Pando Digital <hola@pandodigital.co>',
      to: CONTACT_TO_EMAIL,
      // Al darle "Responder" en tu bandeja, le escribes directo al cliente
      reply_to: email,
      subject: `Nuevo mensaje de ${name} — pandodigital.co`,
      // Texto plano a propósito: así no hay que escapar HTML que venga del usuario
      text: [
        `Nombre: ${name}`,
        `Negocio: ${business || '—'}`,
        `Correo: ${email}`,
        '',
        message,
      ].join('\n'),
    }),
  });

  if (!res.ok) {
    // El detalle va a los logs de Vercel, NO al navegador
    console.error('[contact] Resend respondió', res.status, await res.text());
    return json({ ok: false, error: 'No se pudo enviar el correo.' }, 502);
  }

  return json({ ok: true });
};
