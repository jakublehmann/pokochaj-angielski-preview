import Image from "next/image";
import { ContentMap, Offer, OfferExtra } from "@/types/content";

interface Props { content: ContentMap; offers: Offer[]; extras: OfferExtra[] }

const DEFAULT_OFFERS: Offer[] = [
  { id: "1", sort_order: 1, duration: "Zajęcia 30 min",         description: "Krótka, intensywna sesja — idealna na regularne ćwiczenie konwersacji.",                    price: "60 zł",  price_note: "za zajęcia",   is_featured: false },
  { id: "2", sort_order: 2, duration: "Zajęcia 45 min",         description: "Zbalansowany format — czas na konwersację, gramatykę i feedback.",                          price: "100 zł", price_note: "za zajęcia",   is_featured: false },
  { id: "3", sort_order: 3, duration: "Zajęcia 60 min",         description: "Pełna godzina — najwięcej czasu na praktyczne mówienie i utrwalenie materiału.",            price: "120 zł", price_note: "za zajęcia",   is_featured: true  },
  { id: "4", sort_order: 4, duration: "Zajęcia w parach (60 min)", description: "Nauka z partnerem lub znajomym — wygodna opcja dla dwóch osób w podobnym poziomie.",    price: "160 zł", price_note: "80 zł / osoba", is_featured: false },
];

const DEFAULT_EXTRAS: OfferExtra[] = [
  { id: "1", sort_order: 1, label: "Pakiet",         title: "10 zajęć — rabat 10%",                        description: "Kup pakiet 10 dowolnych zajęć i oszczędź 10% na każdym spotkaniu. Ważność pakietu ustalamy indywidualnie.", price: "-10%",  price_note: "od ceny regularnej"   },
  { id: "2", sort_order: 2, label: "Dla znajomych",  title: "Zaproś znajomego — zgarnij darmowe zajęcia",  description: "Poleć mnie osobie, która zacznie regularne lekcje, a Ty otrzymasz jedno zajęcie gratis. Szczegóły do ustalenia.",  price: "Gratis", price_note: "1 zajęcie za polecenie" },
];

const EXTRA_ROTATION = ["8.54deg", "-5.88deg"];

function computePackage(price: string, priceNote: string) {
  const mainMatch = price.match(/(\d+)/);
  if (!mainMatch) return null;
  const mainVal = parseInt(mainMatch[1], 10);
  const pkgVal = Math.round(mainVal * 0.9);
  const savePerSession = mainVal - pkgVal;
  const saveTotal = savePerSession * 10;

  const personMatch = priceNote.match(/(\d+)\s*zł\s*\/\s*osoba/i);
  const pkgNote = personMatch
    ? `${Math.round(parseInt(personMatch[1], 10) * 0.9)} zł/osoba`
    : priceNote;

  return {
    price: `${pkgVal} zł`,
    note: pkgNote,
    savings: `${saveTotal} zł taniej`,
  };
}

export default function OfferSection({ content, offers, extras }: Props) {
  const o = content.offer ?? {};
  const items  = offers.length > 0 ? offers     : DEFAULT_OFFERS;
  const extraItems = extras.length > 0 ? extras : DEFAULT_EXTRAS;

  return (
    <>
      <section id="oferta" className="offer-section reveal" aria-labelledby="offer-title">

        {/* ── Dark header ─────────────────────────────────────── */}
        <div className="offer-header">
          <div className="offer-header-copy">
            <p className="offer-kicker">{o.kicker ?? "Oferta"}</p>
            <h2 id="offer-title">
              <span className="offer-h2-main">{o.headline ?? "Wybierz format, który pasuje do"}</span>
              <span className="offer-h2-gloria gloria">{o.headline_accent ?? "Twojego tempa życia."}</span>
            </h2>
          </div>

          <p className="offer-header-desc">
            {o.description ?? "Zajęcia indywidualne lub w parach, online. Każdy format można łączyć w pakiet 10 spotkań z rabatem 10%."}
          </p>

          <div className="offer-header-photo" aria-label="Zdjęcie lektorki">
            <div className="offer-photo-bleed">
              <Image
                src="/IZA-3.png"
                alt="Iza — lektorka języka angielskiego"
                fill
                style={{ objectFit: "contain", objectPosition: "bottom center" }}
                quality={100}
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* ── Extras ───────────────────────────────────────────── */}
        <div className="offer-extras">
          {extraItems.map((ex, i) => (
            <div key={ex.id} className="offer-extra">
              <div className="offer-extra-copy">
                <p className="extra-label">{ex.label}</p>
                <p className="extra-title">{ex.title}</p>
                <p className="extra-desc">{ex.description}</p>
              </div>
              <div
                className="extra-badge-wrap"
                style={{ "--rot": EXTRA_ROTATION[i] ?? "0deg" } as React.CSSProperties}
              >
                <div className="extra-badge">
                  <span className="extra-badge-value gloria">{ex.price}</span>
                  <span className="extra-badge-note">{ex.price_note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pricing rows ─────────────────────────────────────── */}
        <ul className="offer-list">
          {items.map((item, i) => {
            const pkg = computePackage(item.price, item.price_note);
            return (
              <li key={item.id} className={`offer-row${item.is_featured ? " featured" : ""}`}>
                <span className="offer-idx">{String(i + 1).padStart(2, "0")}</span>
                <div className="offer-body">
                  <p className="offer-title">
                    {item.duration}
                    {item.is_featured && <span className="offer-badge">Najpopularniejsze</span>}
                  </p>
                  <p className="offer-desc">{item.description}</p>
                </div>
                <div className="offer-price">
                  <span className="offer-price-value">{item.price}</span>
                  <span className="offer-price-note">{item.price_note}</span>
                  {pkg && <span className="offer-pkg-inline">w pakiecie {pkg.price}</span>}
                </div>
              </li>
            );
          })}
        </ul>

      </section>

      <style>{`
        /* ─── Section ─────────────────────────────────────────── */
        .offer-section {
          padding-top: clamp(10rem, 15vw, 13.5rem);
          margin-top: clamp(1rem, 2vw, 2rem);
        }

        /* ─── Dark header ─────────────────────────────────────── */
        .offer-header {
          background: #053536;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          min-height: clamp(220px, 22vw, 304px);
          overflow: visible;
          position: relative;
        }

        .offer-header-copy {
          padding: clamp(2rem, 3.5vw, 3.25rem) clamp(1.5rem, 3.5vw, 3.25rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: .5rem;
        }
        .offer-kicker {
          font-size: .875rem;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: .1rem;
        }
        .offer-h2-main {
          display: block;
          font-size: clamp(1.6rem, 2.9vw, 2.625rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -.02em;
          color: #fff;
        }
        .offer-h2-gloria {
          display: block;
          font-size: clamp(1.5rem, 2.7vw, 2.5rem);
          line-height: 1.15;
          color: #fff;
          margin-top: .04em;
        }

        .offer-header-desc {
          font-size: clamp(.85rem, 1vw, 1rem);
          color: #888;
          line-height: 1.6;
          padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 2.5vw, 2rem);
          align-self: center;
        }

        .offer-header-photo {
          position: relative;
          align-self: stretch;
        }

        .offer-photo-bleed {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 165%;
        }

        /* ─── Extras ──────────────────────────────────────────── */
        .offer-extras {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--cream);
          border-top: 1px solid #e6dfd1;
          border-bottom: 1px solid #c8bfb5;
        }

        .offer-extra {
          padding: clamp(1.2rem, 1.8vw, 1.5rem) clamp(1.5rem, 3.5vw, 3.2rem);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .offer-extra-copy {
          flex: 1;
          min-width: 0;
        }
        .offer-extra:first-child {
          border-right: 1px solid #c8bfb5;
        }

        .extra-label {
          font-size: .875rem;
          font-weight: 500;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: .2rem;
        }
        .extra-title {
          font-size: 1.25rem;
          font-weight: 500;
          color: #111;
          line-height: 1.2;
          letter-spacing: -.02em;
          margin-bottom: .3rem;
        }
        .extra-desc {
          font-size: 1rem;
          color: #555;
          line-height: 1.55;
        }

        .extra-badge-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: rotate(var(--rot, 0deg));
          transition: transform .35s cubic-bezier(.34,1.56,.64,1);
          cursor: default;
        }
        .extra-badge-wrap:hover {
          transform: rotate(calc(var(--rot, 0deg) + 4deg));
        }
        .extra-badge {
          background: #e1d8c7;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .15rem;
          min-width: 9.5rem;
          text-align: center;
        }
        .extra-badge-value {
          font-size: 1.5rem;
          color: #111;
          line-height: 1;
        }
        .extra-badge-note {
          font-size: .875rem;
          color: #888;
          line-height: 1.3;
        }

        /* ─── Pricing list ────────────────────────────────────── */
        .offer-list {
          list-style: none;
        }

        .offer-row {
          display: grid;
          grid-template-columns: 2.25rem 1fr auto;
          align-items: center;
          gap: clamp(1rem, 1.7vw, 1.7rem);
          padding: clamp(1.2rem, 1.6vw, 1.4rem) clamp(1.5rem, 3.5vw, 3.2rem);
          border-bottom: 1px solid #c8bfb5;
          transition: background .15s;
        }
        .offer-row:last-child { border-bottom: none; }
        .offer-row:hover { background: #e0ddd5 !important; }

        .offer-row            { background: #eceae1; }
        .offer-row.featured   { background: #b5a898; }
        .offer-row.featured:hover { background: #a3978a !important; }

        .offer-idx {
          font-size: .75rem;
          font-weight: 500;
          letter-spacing: .055em;
          color: #000;
          line-height: 1;
        }

        .offer-title {
          font-size: 1.25rem;
          font-weight: 500;
          color: #000;
          line-height: 1.1;
          margin-bottom: .25rem;
          display: flex;
          align-items: center;
          gap: .75rem;
          flex-wrap: wrap;
        }
        .offer-badge {
          font-size: .6875rem;
          font-weight: 500;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #444;
        }
        .offer-desc {
          font-size: 1rem;
          color: #000;
          line-height: 1.45;
        }

        .offer-price {
          text-align: right;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .offer-price-value {
          display: block;
          font-size: 1.125rem;
          font-weight: 500;
          color: #000;
          letter-spacing: -.02em;
          line-height: 1.2;
        }
        .offer-price-note {
          display: block;
          font-size: .75rem;
          color: #000;
          margin-top: .1rem;
        }
        .offer-pkg-inline {
          display: block;
          font-size: .75rem;
          color: #053536;
          font-weight: 500;
          margin-top: .2rem;
        }

        /* ─── Responsive ──────────────────────────────────────── */
        @media (max-width: 900px) {
          .offer-header {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          .offer-header-photo { min-height: 240px; }
          .offer-header-desc { padding: 0 clamp(1.5rem, 3.5vw, 3.25rem) clamp(1rem, 2vw, 1.5rem); }
        }
        @media (max-width: 640px) {
          .offer-row { grid-template-columns: 1fr auto; }
          .offer-idx { display: none; }
          .offer-extras { grid-template-columns: 1fr; }
          .offer-extra:first-child { border-right: none; border-bottom: 1px solid #c8bfb5; }
          .offer-extra { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
