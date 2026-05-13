import { ContentMap, Review } from "@/types/content";

interface Props { content: ContentMap; reviews: Review[] }

const DEFAULT_REVIEWS: Review[] = [
  { id: "1", sort_order: 1, quote: "Po 3 miesiącach przestałam unikać spotkań po angielsku. Lekcje są konkretne i bez niepotrzebnego spięcia.", author: "Agnieszka", role: "UX Designer" },
  { id: "2", sort_order: 2, quote: "Najlepsze jest to, że po każdej lekcji wiem, co mam robić dalej. W końcu mam system i spokój.", author: "Mateusz", role: "Programista" },
  { id: "3", sort_order: 3, quote: "Miałam duży opór przed mówieniem. Tutaj nie boję się błędów i pierwszy raz czuję, że to ma sens.", author: "Karolina", role: "Psycholożka" },
  { id: "4", sort_order: 4, quote: "Profesjonalnie i po ludzku. Dużo praktyki, zero nadęcia, dużo wsparcia.", author: "Piotr", role: "Project Manager" },
];

const CARD_ROTATIONS = ["1.64deg", "-6.2deg", "-1.39deg", "0.3deg"];

export default function Reviews({ content, reviews }: Props) {
  const r = content.reviews ?? {};
  const items = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <>
      <section id="opinie" className="reviews-section reveal" aria-labelledby="reviews-title">
        <div className="reviews-inner">

          <div className="reviews-head">
            <p className="reviews-kicker">Opinie klientów</p>
            <h2 id="reviews-title" className="reviews-h2">
              <span className="reviews-h2-line1">{r.headline_line1 ?? "To nie są puste obietnice."}</span>
              <span className="reviews-h2-line2 gloria">{r.headline_accent ?? "To realne zmiany."}</span>
            </h2>
          </div>

          <div className="reviews-cards">
            {items.map((rev, i) => (
              <div key={rev.id} className="review-slot">
                <article
                  className="review-card"
                  style={{ "--rot": CARD_ROTATIONS[i % CARD_ROTATIONS.length] } as React.CSSProperties}
                >
                  <p className="review-stars">★★★★★</p>
                  <blockquote>{rev.quote}</blockquote>
                  <cite>{rev.author}, {rev.role}</cite>
                </article>
              </div>
            ))}
          </div>

          <div className="reviews-foot">
            <span>{items.length} opinie&nbsp;·&nbsp;★★★★★ 5.0</span>
          </div>

        </div>
      </section>

      <style>{`
        .reviews-section {
          background: var(--cream);
          margin-top: clamp(2rem, 5vw, 4rem);
        }

        .reviews-inner {
          max-width: 1332px;
          margin: 0 auto;
          padding: clamp(2rem, 4vw, 3.2rem) clamp(1.5rem, 4vw, 3.25rem);
          display: flex;
          flex-direction: column;
        }

        /* ─── Heading ───────────────────────────────────── */
        .reviews-head {
          margin-bottom: 13px;
        }

        .reviews-kicker {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #888;
          line-height: 1.1;
          margin-bottom: 13px;
        }

        .reviews-h2 {
          display: flex;
          flex-direction: column;
          font-size: clamp(1.8rem, 3.5vw, 2.625rem);
          font-weight: 500;
          letter-spacing: -0.029em;
          color: #111;
          line-height: 1.1;
        }

        .reviews-h2-line2 {
          line-height: 1;
        }

        /* ─── Cards row ─────────────────────────────────── */
        .reviews-cards {
          display: flex;
          height: 284px;
          align-items: stretch;
        }

        .review-slot {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px 10px;
        }

        .review-card {
          width: 250px;
          background: #e9e4d9;
          padding: 25.5px 23.7px;
          display: flex;
          flex-direction: column;
          transform: rotate(var(--rot, 0deg));
          transition: transform .35s cubic-bezier(.34, 1.56, .64, 1);
        }

        .review-card:hover {
          transform: rotate(calc(var(--rot, 0deg) + 3deg));
        }

        .review-stars {
          font-size: 16px;
          letter-spacing: 0.051em;
          color: #111;
          margin-bottom: 11.85px;
          line-height: 1.1;
        }

        .review-card blockquote {
          font-size: 16px;
          color: #333;
          line-height: 1.35;
          flex: 1;
          margin-bottom: 16.4px;
          font-style: normal;
        }

        .review-card cite {
          font-style: normal;
          font-size: 14px;
          font-weight: 500;
          color: #888;
          line-height: 1.1;
        }

        /* ─── Footer ────────────────────────────────────── */
        .reviews-foot {
          border-top: 1.14px solid #e8e8e8;
          padding-top: 10px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }

        /* ─── Responsive ────────────────────────────────── */
        @media (max-width: 900px) {
          .reviews-cards {
            height: auto;
            flex-wrap: wrap;
            gap: 24px 12px;
          }
          .review-slot {
            flex: 1 1 calc(50% - 12px);
          }
        }

        @media (max-width: 560px) {
          .reviews-cards {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .review-slot {
            flex: none;
            width: 100%;
            padding: 0;
          }
          .review-card {
            width: min(280px, 100%);
          }
        }
      `}</style>
    </>
  );
}
