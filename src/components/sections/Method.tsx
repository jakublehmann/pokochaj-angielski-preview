import { ContentMap, MethodStep } from "@/types/content";

interface Props { content: ContentMap; steps: MethodStep[] }

const DEFAULT_STEPS: MethodStep[] = [
  { id: "1", sort_order: 1, title: "Diagnoza celu",        description: "Ustalamy, gdzie i kiedy potrzebujesz angielskiego najbardziej." },
  { id: "2", sort_order: 2, title: "Praktyka mówienia",    description: "Skupiamy się na komunikacji i wymowie, nie na teorii bez kontekstu." },
  { id: "3", sort_order: 3, title: "Feedback po zajęciach",description: "Po każdej lekcji dostajesz krótkie podsumowanie i zadania dopasowane do Ciebie." },
  { id: "4", sort_order: 4, title: "Stały progres",        description: "Co miesiąc sprawdzamy postęp i dopasowujemy plan do nowych potrzeb." },
];

const STEP_BG = ["#eceae1", "#e9e4d9", "#e1d8c7", "#d3cabd"];

export default function Method({ content, steps }: Props) {
  const m = content.method ?? {};
  const items = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <>
      <section id="jak-pracuje" className="method-section reveal" aria-labelledby="method-title">
        <div className="method-card">

          {/* Header */}
          <div className="method-head">
            <p className="method-kicker">{m.kicker ?? "Jak pracuję"}</p>
            <h2 id="method-title">{m.headline ?? "Prosty rytm, który daje widoczne efekty."}</h2>
          </div>

          {/* Steps */}
          <div className="method-steps">
            {items.map((step, i) => (
              <div
                key={step.id}
                className="method-step"
                style={{ background: STEP_BG[i] ?? STEP_BG[STEP_BG.length - 1] }}
              >
                <div className="method-num-row">
                  <span className="method-num gloria">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="method-body">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        /* ─── Section wrapper ─────────────────────────────────── */
        .method-section {
          margin-top: clamp(2rem, 5vw, 4rem);
          background: var(--cream);
          padding: 0 0 clamp(1rem, 2vw, 2rem);
        }

        /* White card */
        .method-card {
          background: #fff;
          overflow: hidden;
        }

        /* ─── Header ──────────────────────────────────────────── */
        .method-head {
          padding: clamp(2rem, 3.6vw, 3.25rem) clamp(1.5rem, 3.6vw, 3.25rem);
        }
        .method-kicker {
          font-size: .875rem;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: .6rem;
        }
        .method-head h2 {
          font-size: clamp(1.6rem, 3vw, 2.625rem);
          font-weight: 500;
          letter-spacing: -.02em;
          color: #111;
          line-height: 1.1;
        }

        /* ─── Steps grid ──────────────────────────────────────── */
        .method-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .method-step {
          display: flex;
          flex-direction: column;
        }

        /* Number row — 100px tall, matches Figma VerticalBorder */
        .method-num-row {
          height: 100px;
          display: flex;
          align-items: center;
          padding: 0 1.125rem 0 2.275rem;
          overflow: hidden;
        }

        .method-num {
          font-size: 2.375rem;
          line-height: 1;
          letter-spacing: -.03em;
          color: #2a2a2a;
          white-space: nowrap;
        }

        /* Title + description */
        .method-body {
          padding: 1.25rem;
          flex: 1;
        }
        .method-body h3 {
          font-size: 1.25rem;
          font-weight: 500;
          color: #111;
          line-height: 1.1;
          margin-bottom: .4rem;
        }
        .method-body p {
          font-size: 1rem;
          color: #555;
          line-height: 1.55;
        }

        /* ─── Responsive ──────────────────────────────────────── */
        @media (max-width: 900px) {
          .method-steps { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .method-steps { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
