"use client";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: { getResponse: () => string; reset: () => void };
  }
}

interface Props { email: string; calendlyUrl?: string }

export default function ContactForm({ email, calendlyUrl }: Props) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaErr, setCaptchaErr] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCaptchaErr(false);

    if (!window.grecaptcha?.getResponse()) {
      setCaptchaErr(true);
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
      form.reset();
    }
  }

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit} className="cf-form">
        {sent && (
          <p className="cf-success">Wiadomość wysłana! Iza odezwie się wkrótce.</p>
        )}
        <input
          name="name" type="text" required
          placeholder="Imię i nazwisko"
          aria-label="Imię i nazwisko"
          className="cf-input"
        />
        <input
          name="email" type="email" required
          placeholder="Twój adres email"
          aria-label="Twój adres email"
          className="cf-input"
        />
        <textarea
          name="message" required rows={5}
          placeholder="Treść wiadomości"
          aria-label="Treść wiadomości"
          className="cf-input cf-textarea"
        />

        <div className="cf-captcha-wrap">
          {siteKey
            ? <div className="g-recaptcha" data-sitekey={siteKey} />
            : <p className="cf-captcha-missing">⚠ Brak klucza reCAPTCHA — dodaj NEXT_PUBLIC_RECAPTCHA_SITE_KEY do .env.local</p>
          }
          {captchaErr && (
            <p className="cf-captcha-err" role="alert">Potwierdź, że nie jesteś robotem.</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="cf-btn-submit">
          {loading ? "Otwieranie…" : "Napisz do mnie"}
        </button>

        <div className="cf-divider">
          <span className="cf-divider-line" />
          <span className="cf-divider-text">lub</span>
          <span className="cf-divider-line" />
        </div>

        <a
          href={calendlyUrl ?? "#kontakt"}
          target={calendlyUrl ? "_blank" : undefined}
          rel={calendlyUrl ? "noopener noreferrer" : undefined}
          className="cf-btn-cal"
        >
          <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Umów konsultację w Calendly
        </a>
      </form>

      <style>{`
        .cf-form {
          width: 100%;
          display: flex; flex-direction: column; gap: 12px;
        }
        .cf-success {
          font-size: .82rem; color: #2a7a4a;
          background: #eaf7f0;
          padding: .55rem .85rem;
          border: 1px solid #b4dfc8;
          border-radius: 4px;
        }
        .cf-input {
          width: 100%;
          height: 50px;
          padding: 0 16px;
          background: rgba(255,255,255,.38);
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
          color: var(--ink);
          outline: none;
          transition: border-color .15s, background .15s;
        }
        .cf-input::placeholder { color: rgba(28,23,20,.45); }
        .cf-input:focus {
          background: rgba(255,255,255,.6);
          border-color: rgba(255,255,255,.8);
        }
        .cf-textarea {
          height: 160px;
          padding-top: 12px;
          resize: vertical;
        }

        .cf-captcha-wrap { display: flex; flex-direction: column; gap: 6px; }
        .cf-captcha-missing {
          font-size: .78rem; color: #b45309;
          background: #fef3c7;
          padding: .5rem .75rem;
          border: 1px solid #fcd34d;
          border-radius: 4px;
        }
        .cf-captcha-err {
          font-size: .78rem; color: #c0392b;
          margin: 0;
        }

        .cf-btn-submit {
          width: 100%; height: 52px;
          background: var(--amber);
          color: #1c1714;
          border: none;
          font-family: inherit;
          font-size: .9rem;
          font-weight: 600;
          letter-spacing: .01em;
          cursor: pointer;
          transition: background .15s, transform .12s;
        }
        .cf-btn-submit:hover:not(:disabled) { background: var(--amber-dark); color: #fff; transform: translateY(-1px); }
        .cf-btn-submit:disabled { opacity: .65; cursor: default; }

        .cf-divider {
          display: flex; align-items: center; gap: .75rem;
        }
        .cf-divider-line { flex: 1; height: 1px; background: rgba(0,0,0,.1); }
        .cf-divider-text { font-size: .78rem; color: var(--ink-muted); }

        .cf-btn-cal {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; height: 52px;
          background: #fff;
          border: none;
          font-family: inherit;
          font-size: .9rem;
          font-weight: 500;
          color: var(--ink);
          text-decoration: none;
          cursor: pointer;
          transition: background .15s, transform .12s;
        }
        .cf-btn-cal:hover { background: #f5f3ee; transform: translateY(-1px); }
      `}</style>
    </>
  );
}
