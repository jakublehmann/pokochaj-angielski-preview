import { ContentMap } from "@/types/content";
import Image from "next/image";

interface Props { content: ContentMap }

export default function Footer({ content }: Props) {
  const f = content.footer ?? {};
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="footer-inner">

          <div className="footer-top">

            <div className="footer-brand">
              <div className="footer-icon">
                <Image
                  src="/logomark-pokochaj-angielski-black.svg"
                  alt=""
                  width={23}
                  height={23}
                  style={{ transform: "rotate(-21.98deg)", display: "block" }}
                />
              </div>
              <p className="footer-tagline">
                {f.tagline ?? "Empatia, profesjonalizm i autentyczne wsparcie w rozwoju językowym dorosłych."}
              </p>
            </div>

            <div className="footer-contact">
              <p className="footer-contact-head">Kontakt</p>
              <div className="footer-contact-list">
                <p>
                  <a href={`mailto:${f.email ?? "kontakt@pokochajangielski.com"}`}>
                    {f.email ?? "kontakt@pokochajangielski.com"}
                  </a>
                </p>
                <p>
                  <a href="https://www.instagram.com/pokochaj.angielski/" target="_blank" rel="noopener noreferrer">
                    Instagram: {f.instagram ?? "@pokochaj.angielski"}
                  </a>
                </p>
                <p>
                  <a href="https://www.facebook.com/pokochajangielski" target="_blank" rel="noopener noreferrer">
                    Facebook: {f.facebook ?? "Pokochaj angielski"}
                  </a>
                </p>
              </div>
            </div>

          </div>

          <div className="footer-divider" />

          <div className="footer-bottom">
            <p>© {year} Pokochaj Angielski</p>
            <p>Pokochaj Angielski. All Rights Reserved.</p>
          </div>

        </div>
      </footer>

      <style>{`
        .site-footer {
          background: #e9e4d9;
          margin-top: clamp(2rem, 4vw, 3.5rem);
          margin-bottom: 0;
        }

        .footer-inner {
          padding: 30px clamp(1.5rem, 4.5vw, 3.75rem) 18px;
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        /* ─── Top row ────────────────────────────────── */
        .footer-top {
          display: flex;
          gap: clamp(2rem, 18vw, 14.75rem);
          align-items: flex-start;
        }

        .footer-brand {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 29px;
          height: 29px;
        }

        .footer-tagline {
          font-size: 12px;
          font-weight: 500;
          color: #8c8880;
          line-height: 1.1;
        }

        .footer-contact {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-contact-head {
          font-size: 14px;
          font-weight: 700;
          color: #2e2e2a;
          line-height: 1.1;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
          font-weight: 500;
          color: #5a5750;
          line-height: 1.1;
        }

        .footer-contact-list a {
          color: #5a5750;
          text-decoration: none;
        }

        .footer-contact-list a:hover { color: #2e2e2a; }

        /* ─── Divider ────────────────────────────────── */
        .footer-divider {
          height: 1px;
          background: #cdc8c0;
          width: 100%;
        }

        /* ─── Bottom bar ─────────────────────────────── */
        .footer-bottom {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 12px;
          color: #c8c3b8;
        }

        .footer-bottom p:first-child { flex: 1; }
        .footer-bottom p:last-child { text-align: right; white-space: nowrap; }

        /* ─── Responsive ─────────────────────────────── */
        @media (max-width: 600px) {
          .footer-top { flex-direction: column; gap: 1.25rem; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 4px; }
          .footer-bottom p:last-child { text-align: left; white-space: normal; }
        }
      `}</style>
    </>
  );
}
