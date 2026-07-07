// La isla React: lo ÚNICO del sitio que corre como aplicación en el navegador.
// Los componentes React no tienen el <style> scoped de Astro, así que los
// estilos viven en un CSS aparte que se importa aquí:
import './ContactForm.css';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';

// La clave llega desde .env (PUBLIC_ = Astro la expone al navegador; esta
// clave de Web3Forms es pública por diseño: solo enruta mensajes a tu correo).
// Si no hay clave, el formulario funciona en modo simulado.
const ACCESS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY;

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

    // Honeypot: si el campo invisible viene lleno, fue un bot.
    // Le fingimos éxito y no enviamos nada.
    if (new FormData(e.currentTarget).get('botcheck')) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    try {
      if (!ACCESS_KEY) {
        // Modo simulado mientras no exista PUBLIC_WEB3FORMS_KEY en .env
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus('success');
        return;
      }

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Nuevo mensaje de ${name} — pandodigital.co`,
          name,
          business,
          email,
          message,
        }),
      });
      const result = await res.json();

      if (result.success) {
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
          placeholder="Ana Bovier"
        />
      </label>

      <label>
        Nombre del negocio
        <input
          value={business}
          onChange={field(setBusiness)}
          placeholder="Compumundo Hypermegared"
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          value={email}
          onChange={field(setEmail)}
          placeholder="ana@hypermegared.co"
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
