// La isla React: lo ÚNICO del sitio que corre como aplicación en el navegador.
// Los componentes React no tienen el <style> scoped de Astro, así que los
// estilos viven en un CSS aparte que se importa aquí:
import './ContactForm.css';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';

// Ya no hay ninguna clave aquí: la isla solo habla con NUESTRO endpoint
// (src/pages/api/contact.ts), y es el servidor quien usa la clave secreta
// de Resend. Lo que corre en el navegador no puede guardar secretos.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Status = 'idle' | 'sending' | 'success';

export default function ContactForm() {
  // Cada useState es un par [valor, función-para-cambiarlo].
  // Cambiar el valor con el setter hace que React re-ejecute esta función
  // y repinte lo que haya cambiado.
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // El formulario está siempre en exactamente UNO de estos estados:
  const [status, setStatus] = useState<Status>('idle');
  // El error vive aparte porque coexiste con 'idle' (validación o fallo de red)
  const [error, setError] = useState('');

  // Fabrica los onChange: recibe el setter de un campo y devuelve el handler
  // listo, que además limpia el error cuando el usuario vuelve a escribir.
  function field(setter: (value: string) => void) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setError('');
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Sin esto, el navegador recargaría la página al enviar (comportamiento
    // por defecto de <form>). Queremos manejarlo nosotros.
    e.preventDefault();

    // Validación: nombre, correo y mensaje son obligatorios
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Por favor completa tu nombre, correo y un mensaje breve.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Ese correo parece incorrecto — ¿lo revisas?');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          business,
          email,
          message,
          // El honeypot ahora lo revisa el servidor (un bot podría saltarse
          // este componente entero y llamar al endpoint directo).
          botcheck: new FormData(e.currentTarget).get('botcheck') ?? '',
        }),
      });
      const result: { ok: boolean } = await res.json();

      if (result.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        setError('No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos a hola@pandodigital.co.');
      }
    } catch {
      // fetch lanza excepción si ni siquiera hubo respuesta (sin conexión)
      setStatus('idle');
      setError('No pudimos enviar tu mensaje. Revisa tu conexión o escríbenos a hola@pandodigital.co.');
    }
  }

  function handleReset() {
    setName('');
    setBusiness('');
    setEmail('');
    setMessage('');
    setStatus('idle');
    setError('');
  }

  // Render condicional: una de dos pantallas, según el estado.
  if (status === 'success') {
    return (
      <div className="success">
        <div className="check">✓</div>
        <h3>¡Gracias — recibido!</h3>
        <p>
          Lo leeremos con calma y te responderemos personalmente en el siguiente día hábil. ¡Hablamos
          pronto!
        </p>
        <button type="button" onClick={handleReset}>
          Enviar otro
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Honeypot: oculto con CSS; los humanos jamás lo ven ni lo llenan */}
      <input type="text" name="botcheck" className="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label>
        Tu nombre
        <input
          value={name}
          onChange={field(setName)}
          placeholder="Ana Restrepo"
        />
      </label>

      <label>
        Nombre del negocio
        <input
          value={business}
          onChange={field(setBusiness)}
          placeholder="A&D Store"
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          value={email}
          onChange={field(setEmail)}
          placeholder="ana@adstore.com"
        />
      </label>

      <label>
        ¿En qué necesitas ayuda?
        <textarea
          value={message}
          onChange={field(setMessage)}
          rows={4}
          placeholder="Unas líneas sobre tu negocio y dónde estás atascad@…"
        />
      </label>

      {error && <span className="error">{error}</span>}

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar →'}
      </button>
      <span className="footnote">Normalmente respondemos en un día · tus datos son privados</span>
    </form>
  );
}
