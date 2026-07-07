// La isla React: lo ÚNICO del sitio que corre como aplicación en el navegador.
// Los componentes React no tienen el <style> scoped de Astro, así que los
// estilos viven en un CSS aparte que se importa aquí:
import './ContactForm.css';
import { useState, type SubmitEvent } from 'react';

export default function ContactForm() {
  // Cada useState es un par [valor, función-para-cambiarlo].
  // Cambiar el valor con el setter hace que React re-ejecute esta función
  // y repinte lo que haya cambiado.
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Sin esto, el navegador recargaría la página al enviar (comportamiento
    // por defecto de <form>). Queremos manejarlo nosotros.
    e.preventDefault();
    // v1: envío simulado. En el Paso 8 aquí irá la validación y el fetch real.
    setSubmitted(true);
  }

  function handleReset() {
    setName('');
    setBusiness('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  }

  // Render condicional: una de dos pantallas, según el estado.
  if (submitted) {
    return (
      <div className="success">
        <div className="check">✓</div>
        <h3>¡Gracias — recibido!</h3>
        <p>
          Lo leeré con calma y te responderé personalmente en el siguiente día hábil. ¡Hablamos
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
      <label>
        Tu nombre
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ana Gómez"
        />
      </label>

      <label>
        Nombre del negocio
        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Panadería La Espiga"
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ana@panaderialaespiga.co"
        />
      </label>

      <label>
        ¿En qué necesitas ayuda?
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Unas líneas sobre tu negocio y dónde estás atascado…"
        />
      </label>

      <button type="submit">Enviar →</button>
      <span className="footnote">Normalmente respondemos en un día · tus datos son privados</span>
    </form>
  );
}
