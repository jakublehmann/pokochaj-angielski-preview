import { ContentMap, FaqItem } from "@/types/content";

interface Props { content: ContentMap; faqs: FaqItem[] }

const DEFAULT_FAQS: FaqItem[] = [
  { id: "1", sort_order: 1, question: "Czy mogę odwołać lub przełożyć spotkanie?", answer: "Tak. Termin możesz przełożyć zgodnie z zasadami pakietu. Wszystko jest jasno opisane." },
  { id: "2", sort_order: 2, question: "Czy lekcje są tylko online?", answer: "Tak, dzięki temu łatwo łączysz naukę z pracą i życiem prywatnym, niezależnie od miasta." },
  { id: "3", sort_order: 3, question: "Kiedy płacę za zajęcia?", answer: "Płatność z góry, przed rozpoczęciem pakietu. Nie pobieramy zaliczek za pojedyncze zajęcia." },
  { id: "4", sort_order: 4, question: "Jakie są formy płatności?", answer: "Płatność przelewem przed startem pakietu. Szczegóły ustalimy na konsultacji." },
  { id: "5", sort_order: 5, question: "W jakich dniach i godzinach odbywają się zajęcia?", answer: "Terminy ustalamy indywidualnie — dopasowujemy do Twojego grafiku, także weekendy." },
  { id: "6", sort_order: 6, question: "W jakich dniach i godzinach odbywają się zajęcia?", answer: "Nie. Pracuję z osobami na każdym poziomie — od podstawowego do zaawansowanego." },
];

export default function Faq({ content, faqs }: Props) {
  const f = content.faq ?? {};
  const items = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <>
      <section id="faq" className="faq-section reveal" aria-labelledby="faq-title">
        <div className="faq-head">
          <p className="kicker">FAQ</p>
          <h2 id="faq-title">{f.headline ?? "Najczęstsze pytania przed startem."}</h2>
        </div>
        <div className="faq-grid">
          {items.map((item) => (
            <details key={item.id} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        .faq-section {
          margin-top: clamp(2rem, 5vw, 4rem);
          
          background: var(--cream);
          overflow: hidden;
        }
        .faq-head {
          padding: clamp(1.8rem, 3.5vw, 2.8rem) clamp(1.5rem, 4vw, 3rem);
          border-bottom: 1px solid var(--border-light);
          text-align: center;
        }
        .faq-head .kicker { margin-bottom: .6rem; }
        .faq-head h2 {
          font-size: clamp(1.6rem, 3.5vw, 2.6rem);
          font-weight: 700; letter-spacing: -.025em; color: var(--ink);
        }

        .faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
        .faq-item {
          border-bottom: 1px solid var(--border-light);
          border-right: 1px solid var(--border-light);
          transition: background .15s;
        }
        .faq-item:nth-child(even) { border-right: none; }
        .faq-item:nth-last-child(-n+2) { border-bottom: none; }
        .faq-item:hover { background: var(--cream); }

        .faq-item summary {
          list-style: none; cursor: pointer;
          font-weight: 500; font-size: .9rem; color: var(--ink);
          padding: 1.1rem clamp(1.2rem, 2.5vw, 2rem);
          display: flex; justify-content: space-between;
          align-items: center; gap: 1rem;
          transition: color .15s;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after {
          content: "+"; font-size: 1.3rem; color: var(--border);
          flex-shrink: 0; transition: transform .2s, color .2s;
          font-weight: 300;
        }
        .faq-item[open] summary::after { transform: rotate(45deg); color: var(--amber); }
        .faq-item[open] summary { color: var(--amber); }
        .faq-item p {
          padding: 0 clamp(1.2rem, 2.5vw, 2rem) 1.1rem;
          color: var(--ink-muted); font-size: .86rem;
          line-height: 1.65; max-width: 54ch;
        }

        @media (max-width: 640px) {
          .faq-grid { grid-template-columns: 1fr; }
          .faq-item { border-right: none !important; }
          .faq-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--border-light) !important; }
          .faq-item:last-child { border-bottom: none !important; }
        }
      `}</style>
    </>
  );
}
