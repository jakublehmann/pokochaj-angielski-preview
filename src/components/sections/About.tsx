import Image from "next/image";
import { ContentMap } from "@/types/content";

interface Props { content: ContentMap }

export default function About({ content }: Props) {
  const a = content.about ?? {};
  const stats = [
    { n: a.stat1_value ?? "10+", title: a.stat1_title ?? "Lat doświadczenia", desc: a.stat1_desc ?? "Pracuję wyłącznie z dorosłymi — wiem, jakie bariery mają i jak je pokonać." },
    { n: a.stat2_value ?? "MA",  title: a.stat2_title ?? "Filologia angielska", desc: a.stat2_desc ?? "Wykształcenie lingwistyczne i praktyczna wiedza o tym, jak działa język." },
    { n: a.stat3_value ?? "1:1", title: a.stat3_title ?? "Indywidualnie lub w parach", desc: a.stat3_desc ?? "Każda lekcja zaplanowana specjalnie dla Ciebie lub Waszej pary." },
    { n: a.stat4_value ?? "100%", title: a.stat4_title ?? "Online, bez stresu", desc: a.stat4_desc ?? "Uczysz się z domu, we własnym rytmie, z pełnym wsparciem po każdych zajęciach." },
  ];

  return (
    <>
      <section id="o-mnie" className="about-section reveal" aria-labelledby="about-title">
        <div className="about-main">
          <div className="about-photo">
            <Image
              src="/IZA-2.png"
              alt="Iza — lektorka języka angielskiego"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              quality={90}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="about-copy">
            <p className="kicker about-kicker">O mnie</p>
            <h2 id="about-title">{a.headline ?? "Filolog, lektorka i osoba, która naprawdę lubi uczyć dorosłych."}</h2>
            <p className="about-lead">{a.lead ?? "Mam ponad 10 lat doświadczenia w pracy z dorosłymi. Wiem, że nauka języka to nie tylko gramatyka — to też pewność siebie, rytm i metoda dopasowana do Ciebie."}</p>
          </div>
        </div>
        <div className="about-stats">
          {stats.map((s) => (
            <div key={s.n + s.title} className="about-stat">
              <div className="about-stat-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .about-section {
          margin-top: clamp(2rem, 5vw, 4rem);
          
          overflow: hidden;
        }

        .about-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: clamp(320px, 42vw, 480px);
        }

        .about-photo {
          
          overflow: hidden;
          position: relative;
          min-height: 320px;
        }

        .about-copy {
          background: var(--cream);
          padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem);
          display: flex; flex-direction: column; justify-content: center;
        }
        .about-kicker { color: var(--ink-muted); margin-bottom: .9rem; }
        .about-copy h2 {
          font-size: clamp(1.7rem, 3.5vw, 2.8rem);
          font-weight: 700; line-height: 1.12;
          letter-spacing: -.025em; color: var(--ink);
          margin-bottom: 1.4rem;
        }
        .about-lead {
          font-size: .95rem; color: var(--ink-muted);
          line-height: 1.7; max-width: 46ch;
        }

        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #B5D2D8;
          border-top: 1px solid rgba(0,0,0,.1);
        }
        .about-stat {
          padding: 1.6rem 1.4rem;
          border-right: 1px solid rgba(0,0,0,.1);
          transition: background .15s;
        }
        .about-stat:last-child { border-right: none; }
        .about-stat:hover { background: #9FBFC6; }
        .about-stat-n {
          font-family: var(--font-gloria), cursive;
          font-size: 2.2rem; font-weight: 400;
          color: var(--ink); letter-spacing: 0;
          line-height: 1; margin-bottom: .6rem;
        }
        .about-stat h3 {
          font-size: .95rem; font-weight: 600;
          color: var(--ink); margin-bottom: .3rem;
        }
        .about-stat p { font-size: .8rem; color: var(--ink-mid); line-height: 1.55; }

        @media (max-width: 900px) {
          .about-main { grid-template-columns: 1fr; }
          .about-photo { border-right: none; border-bottom: 1px solid var(--border); min-height: 260px; }
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .about-stat:nth-child(2) { border-right: none; }
          .about-stat:nth-child(3), .about-stat:nth-child(4) { border-top: 1px solid rgba(0,0,0,.1); }
          .about-stat:nth-child(4) { border-right: none; }
        }
      `}</style>
    </>
  );
}
