"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);

  const pinned = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const hide = () => {
      if (pinned.current) return;
      nav.style.transform = "translateY(-100%)";
      nav.style.opacity = "0";
    };
    const show = () => {
      nav.style.transform = "";
      nav.style.opacity = "";
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) {
        hide();
      } else {
        show();
      }
      lastY.current = y;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        pinned.current = true;
        show();
      } else {
        pinned.current = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <header ref={navRef} className="topbar" aria-label="Nawigacja główna">
        <div className="topbar-inner">
          <Link href="#start" className="nav-logo" aria-label="Pokochaj angielski">
            <Image
              src="/logotype-pokochaj-angielski-poziom-black.svg"
              alt="Pokochaj angielski"
              width={180}
              height={26}
              style={{ height: 26, width: "auto" }}
              priority
            />
          </Link>

          <nav aria-label="Menu główne">
            <ul className="nav-menu">
              <li><a href="#o-mnie">O mnie</a></li>
              <li><a href="#jak-pracuje">Jak pracuję</a></li>
              <li><a href="#oferta">Oferta</a></li>
              <li><a href="#opinie">Opinie</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>

          <a href="#kontakt" className="nav-cta">Umów konsultację</a>
        </div>
      </header>

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          width: 100%;
          background: #ECEAE1;
          border-bottom: 1px solid #BABCAF;
          transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.25s ease;
        }

        .topbar-inner {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0.7rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .nav-menu {
          list-style: none;
          display: flex;
          gap: 0;
          margin: 0;
          padding: 0;
        }
        .nav-menu a {
          display: block;
          text-decoration: none;
          color: var(--ink-muted);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.38rem 0.9rem;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-menu a:hover { color: var(--ink); }

        .nav-cta {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
          background: #fff;
          color: var(--ink);
          border: none;
          padding: 0.5rem 1.15rem;
          transition: background 0.15s;
        }
        .nav-cta:hover {
          background: #d8d6ce;
        }

        @media (max-width: 1024px) {
          .nav-menu { display: none; }
        }
        @media (max-width: 640px) {
          .nav-cta { display: none; }
          .topbar-inner { padding: 0.6rem 1.25rem; }
        }
      `}</style>
    </>
  );
}
