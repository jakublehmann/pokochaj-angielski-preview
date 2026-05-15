import Image from "next/image";
import { ContentMap } from "@/types/content";

interface Props { content: ContentMap }

export default function Hero({ content }: Props) {
  const h = content.hero ?? {};
  return (
    <>
      <section id="start" className="hero reveal" aria-labelledby="hero-title">

        {/* LEFT — copy */}
        <div className="hero-copy">
          <div className="hero-eyebrow-outer">
            <div className="hero-eyebrow-inner">
              <span className="hero-eyebrow-text">Online 1:1 &nbsp;|&nbsp; Dla dorosłych</span>
            </div>
          </div>

          <h1 id="hero-title">
            <span className="hero-h1-main">{h.headline ?? "Pokochaj angielski"}</span>
            <span className="hero-h1-accent gloria">{h.headline_accent ?? "bez stresu."}</span>
          </h1>

          <p className="hero-lead">
            {h.lead ?? "Pracujesz z lektorką, która łączy profesjonalizm filologa z empatycznym podejściem. Uczysz się mówić naturalnie i pewnie."}
          </p>

          <div className="hero-actions">
            <a href="#kontakt" className="btn btn-amber">Zarezerwuj konsultację</a>
            <a href="#oferta" className="btn btn-white">Zobacz pakiety</a>
          </div>

          <p className="hero-note">
            {h.note ?? "Odpowiedź do 24h · wstępny plan nauki po pierwszym spotkaniu"}
          </p>
        </div>

        {/* RIGHT — visual */}
        <div className="hero-visual" aria-label="Zdjęcie lektorki">
          <div className="hero-frame" aria-hidden="true" />
          <div className="hero-photo-wrap">
            <Image
              src="/IZA-1.png"
              alt="Iza — lektorka języka angielskiego"
              fill
              style={{ objectFit: "cover", objectPosition: "top center" }}
              priority
              quality={100}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <style>{`
        /* ─── Layout ─────────────────────────────────────────── */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: clamp(500px, 56vw, 800px);
          margin-top: clamp(1rem, 2vw, 2rem);
          overflow: hidden;
        }

        /* ─── Left column ─────────────────────────────────────── */
        .hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          padding: clamp(2rem, 4.5vw, 4.5rem) clamp(1.5rem, 3.5vw, 3.5rem);
          background: var(--cream);
        }

        /* Eyebrow — rotated badge */
        .hero-eyebrow-outer {
          display: inline-flex;
          align-items: center;
          margin-bottom: 1.5rem;
          height: 44px;
          cursor: default;
        }
        .hero-eyebrow-inner {
          display: inline-flex;
          align-items: center;
          background: #e1d8c7;
          padding: .3rem .75rem;
          transform: rotate(-4.98deg);
          transition: transform .35s cubic-bezier(.34,1.56,.64,1);
        }
        .hero-eyebrow-outer:hover .hero-eyebrow-inner {
          transform: rotate(-8deg);
        }
        .hero-eyebrow-text {
          font-size: .875rem;
          font-weight: 500;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #555;
          white-space: nowrap;
        }

        /* Headings */
        #hero-title {
          margin-bottom: 1.1rem;
        }
        .hero-h1-main {
          display: block;
          font-size: clamp(2.6rem, 6vw, 5.375rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -.025em;
          color: #111;
        }
        .hero-h1-accent {
          display: block;
          font-size: clamp(2.4rem, 5.75vw, 5.25rem);
          font-weight: 400;
          line-height: 1.1;
          color: #111;
          margin-top: .05em;
        }

        /* Lead */
        .hero-lead {
          font-size: clamp(.95rem, 1.4vw, 1.25rem);
          color: #111;
          line-height: 1.6;
          max-width: 42ch;
          margin-bottom: 1.5rem;
        }

        /* CTA row */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: .625rem;
          margin-bottom: .9rem;
        }

        /* Note */
        .hero-note {
          font-size: .875rem;
          color: #888;
          line-height: 1.4;
        }

        /* ─── Right column ────────────────────────────────────── */
        .hero-visual {
          position: relative;
          overflow: hidden;
          background: var(--cream);
        }

        /* Rotated teal/blue frame behind photo */
        .hero-frame {
          position: absolute;
          background: #b5d2d7;
          transform: rotate(2.58deg);
          left: 9%;
          top: 7%;
          width: 85%;
          height: 79%;
          z-index: 0;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .hero-visual:hover .hero-frame {
          transform: rotate(5.5deg);
        }

        /* Photo — bleeds ~13% above container top, sides pulled in ~6% */
        .hero-photo-wrap {
          position: absolute;
          top: -13%;
          left: 5%;
          right: 5%;
          bottom: 0;
          z-index: 1;
        }

        /* ─── Responsive ──────────────────────────────────────── */
        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
          }
          .hero-visual {
            min-height: 380px;
          }
          .hero-photo-wrap {
            top: -8%;
            left: 8%;
            right: 8%;
          }
        }

        @media (max-width: 600px) {
          .hero-h1-main  { font-size: clamp(2.2rem, 10vw, 3rem); }
          .hero-h1-accent { font-size: clamp(2rem, 9vw, 2.8rem); }
        }
      `}</style>
    </>
  );
}
