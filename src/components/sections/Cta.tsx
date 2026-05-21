import { ContentMap } from "@/types/content";
import ContactForm from "@/components/ContactForm";

interface Props { content: ContentMap }

export default function Cta({ content }: Props) {
  const c = content.cta ?? {};
  return (
    <>
      <section id="kontakt" className="cta-section reveal" aria-labelledby="cta-title">
        <div className="cta-copy">
          <p className="kicker">Zacznij teraz</p>
          <h2 id="cta-title" className="cta-heading">
            <span className="cta-h2-main">{c.headline ?? "Gotowa/y zacząć już teraz?"}</span>
            <span className="cta-h2-accent gloria">{c.headline_accent ?? "spokojna nauka czeka"}</span>
          </h2>
          <p className="cta-lead">{c.subtext ?? "Zarezerwuj konsultację i sprawdź, jak może wyglądać nauka dopasowana do Ciebie: spokojna, konkretna i skuteczna."}</p>
        </div>
        <div className="cta-form-wrap">
          <ContactForm email={c.email ?? "pokochajangielski@gmail.com"} calendlyUrl={c.calendly_url ?? "https://calendly.com/pokochajangielski"} />
        </div>
      </section>

      <style>{`
        .cta-section {
          margin-top: clamp(2rem, 5vw, 4rem);
          background: #e1d8c7;
          border: 1px solid var(--border);
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0;
          overflow: hidden;
        }
        .cta-copy {
          padding: clamp(2.5rem, 5vw, 3.75rem) clamp(1.5rem, 4vw, 3rem);
          display: flex; flex-direction: column; justify-content: center; gap: 1.2rem;
          border-right: 1px solid rgba(0,0,0,.07);
        }
        .cta-heading { display: flex; flex-direction: column; gap: .1em; }
        .cta-h2-main {
          display: block;
          font-size: clamp(1.6rem, 3vw, 2.6rem);
          font-weight: 600; letter-spacing: -.025em;
          color: var(--ink); line-height: 1.1;
        }
        .cta-h2-accent {
          display: block;
          font-size: clamp(1.4rem, 2.8vw, 2.4rem);
          color: var(--ink); line-height: 1.15;
        }
        .cta-lead {
          font-size: .92rem; color: var(--ink-muted);
          line-height: 1.7; max-width: 44ch;
        }
        .cta-form-wrap {
          padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3rem);
          display: flex; align-items: center;
        }

        @media (max-width: 860px) {
          .cta-section { grid-template-columns: 1fr; }
          .cta-copy { border-right: none; border-bottom: 1px solid rgba(0,0,0,.07); }
        }
      `}</style>
    </>
  );
}
