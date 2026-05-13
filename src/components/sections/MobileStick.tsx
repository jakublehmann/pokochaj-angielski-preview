export default function MobileStick() {
  return (
    <>
      <div className="mobile-stick" aria-label="Szybkie akcje mobilne">
        <a href="#oferta" className="btn btn-outline mobile-stick-btn">Oferta</a>
        <a href="#kontakt" className="btn btn-amber mobile-stick-btn">Umów konsultację</a>
      </div>
      <style>{`
        .mobile-stick {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
          background: rgba(242,235,217,.97); backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          padding: .65rem 1rem; display: none; gap: .55rem;
        }
        .mobile-stick-btn { flex: 1; padding: .72rem .8rem; }
        @media (max-width: 768px) { .mobile-stick { display: flex; } }
      `}</style>
    </>
  );
}
