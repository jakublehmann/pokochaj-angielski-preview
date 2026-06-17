"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ContentMap, Review } from "@/types/content";

interface Props { content: ContentMap; reviews: Review[] }

const DEFAULT_REVIEWS: Review[] = [
  { id: "1", sort_order: 1, quote: "Po 3 miesiącach przestałam unikać spotkań po angielsku. Lekcje są konkretne i bez niepotrzebnego spięcia.", author: "Agnieszka", role: "UX Designer", date_label: "2 tygodnie temu", rating: 5 },
  { id: "2", sort_order: 2, quote: "Najlepsze jest to, że po każdej lekcji wiem, co mam robić dalej. W końcu mam system i spokój.", author: "Mateusz", role: "Programista", date_label: "miesiąc temu", rating: 5 },
  { id: "3", sort_order: 3, quote: "Miałam duży opór przed mówieniem. Tutaj nie boję się błędów i pierwszy raz czuję, że to ma sens.", author: "Karolina", role: "Psycholożka", date_label: "3 tygodnie temu", rating: 5 },
  { id: "4", sort_order: 4, quote: "Profesjonalnie i po ludzku. Dużo praktyki, zero nadęcia, dużo wsparcia.", author: "Piotr", role: "Project Manager", date_label: "2 miesiące temu", rating: 5 },
  { id: "5", sort_order: 5, quote: "Wreszcie nauka skrojona pod mnie, a nie pod podręcznik. Czuję realny postęp z tygodnia na tydzień.", author: "Natalia", role: "Marketing Manager", date_label: "tydzień temu", rating: 5 },
  { id: "6", sort_order: 6, quote: "Potrzebowałem angielskiego do pracy w międzynarodowym zespole. Po kilku miesiącach prowadzę spotkania bez stresu.", author: "Tomasz", role: "Team Lead", date_label: "miesiąc temu", rating: 5 },
];

// Deterministyczny kolor awatara z inicjałów — jak w Google dla osób bez zdjęcia.
const AVATAR_COLORS = ["#1A73E8", "#D93025", "#188038", "#E37400", "#9334E6", "#1A8AA0", "#B0207E"];
function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initialOf(name: string) {
  return (name.trim()[0] ?? "?").toUpperCase();
}

function Stars({ rating = 5 }: { rating?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="g-stars" aria-label={`Ocena ${filled} na 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill={i < filled ? "#FBBC04" : "#D8D2C4"}
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ content, reviews }: Props) {
  const r = content.reviews ?? {};
  const items = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(".g-slot");
    const step = first ? first.offsetWidth + 18 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // Przeciąganie myszą (drag-to-scroll) dla desktopu.
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch") return;
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => { drag.current.down = false; };

  return (
    <>
      <section id="opinie" className="reviews-section reveal" aria-labelledby="reviews-title">
        <div className="reviews-inner">

          <div className="reviews-head">
            <div className="reviews-head-text">
              <p className="reviews-kicker">Opinie klientów</p>
              <h2 id="reviews-title" className="reviews-h2">
                <span className="reviews-h2-line1">{r.headline_line1 ?? "To nie są puste obietnice."}</span>
                <span className="reviews-h2-line2 gloria">{r.headline_accent ?? "To realne zmiany."}</span>
              </h2>
            </div>

            <div className="reviews-controls">
              <button
                type="button"
                className="g-arrow"
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                aria-label="Poprzednia opinia"
              >
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                type="button"
                className="g-arrow"
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                aria-label="Następna opinia"
              >
                <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="g-track"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
          >
            {items.map((rev) => (
              <div key={rev.id} className="g-slot">
                <article className="g-card">
                  <header className="g-card-head">
                    <span
                      className="g-avatar"
                      style={rev.avatar_url ? undefined : { background: colorFor(rev.author) }}
                    >
                      {rev.avatar_url
                        ? <img src={rev.avatar_url} alt={rev.author} loading="lazy" />
                        : initialOf(rev.author)}
                    </span>
                    <div className="g-id">
                      <span className="g-name">{rev.author}</span>
                      <span className="g-meta">
                        {[rev.role, rev.date_label].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </header>

                  <Stars rating={rev.rating ?? 5} />

                  <blockquote className="g-quote">{rev.quote}</blockquote>
                </article>
              </div>
            ))}
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

        /* ─── Heading + sterowanie ──────────────────────── */
        .reviews-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: clamp(2.25rem, 5vw, 3.5rem);
        }

        .reviews-kicker {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          line-height: 1.1;
          margin-bottom: 13px;
        }

        .reviews-h2 {
          display: flex;
          flex-direction: column;
          font-size: clamp(1.8rem, 3.5vw, 2.625rem);
          font-weight: 500;
          letter-spacing: -0.029em;
          color: var(--ink);
          line-height: 1.1;
        }

        .reviews-h2-line2 { line-height: 1; }

        .reviews-controls {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .g-arrow {
          width: 48px;
          height: 48px;
          border: none;
          background: #fff;
          color: #A8967B;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background .2s, color .2s, box-shadow .2s, transform .12s;
        }
        .g-arrow svg { transition: transform .2s ease; }
        .g-arrow:hover:not(:disabled) {
          color: var(--ink);
          box-shadow: 0 6px 18px rgba(28,23,20,.14);
        }
        .reviews-controls .g-arrow:first-child:hover:not(:disabled) svg { transform: translateX(-3px); }
        .reviews-controls .g-arrow:last-child:hover:not(:disabled) svg { transform: translateX(3px); }
        .g-arrow:active:not(:disabled) { transform: scale(.93); }
        .g-arrow:disabled { background: var(--cream-dark); color: #C9BCA3; cursor: default; }

        /* ─── Karuzela ──────────────────────────────────── */
        .g-track {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 2px;
          margin: -2px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          cursor: grab;
        }
        .g-track::-webkit-scrollbar { display: none; }
        .g-track:active { cursor: grabbing; }

        .g-slot {
          /* 4 karty mieszczą się w pełni przy max szerokości sekcji (1332px) — ostatnia nie jest ucięta */
          flex: 0 0 290px;
          max-width: 290px;
          scroll-snap-align: start;
        }

        .g-card {
          height: 100%;
          background: #fff;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          user-select: none;
        }

        .g-card-head { display: flex; align-items: center; gap: 12px; }

        .g-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          overflow: hidden;
        }
        .g-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .g-id { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .g-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.2;
        }
        .g-meta {
          font-size: 13px;
          color: var(--ink-muted);
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .g-stars { display: inline-flex; gap: 1px; line-height: 0; }

        .g-quote {
          font-size: 15px;
          color: var(--ink-mid);
          line-height: 1.5;
          flex: 1;
          font-style: normal;
        }

        /* ─── Responsywność ─────────────────────────────── */
        @media (max-width: 720px) {
          .reviews-head { align-items: center; }
          .g-slot { flex-basis: 84vw; max-width: 84vw; }
        }
      `}</style>
    </>
  );
}
