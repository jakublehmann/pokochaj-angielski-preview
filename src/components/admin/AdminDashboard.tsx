"use client";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { ContentMap, Offer, OfferExtra, MethodStep, Review, FaqItem } from "@/types/content";

interface Props {
  content: ContentMap;
  offers: Offer[];
  extras: OfferExtra[];
  steps: MethodStep[];
  reviews: Review[];
  faqs: FaqItem[];
}

type Tab = "hero" | "about" | "method" | "offer" | "reviews" | "faq" | "cta" | "footer";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "O mnie" },
  { id: "method", label: "Jak pracuję" },
  { id: "offer", label: "Oferta" },
  { id: "reviews", label: "Opinie" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CTA / Kontakt" },
  { id: "footer", label: "Stopka" },
];

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label style={s.field}>
      <span style={s.fieldLabel}>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={s.input} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={s.input} />
      )}
    </label>
  );
}

export default function AdminDashboard({ content: initContent, offers: initOffers, extras: initExtras, steps: initSteps, reviews: initReviews, faqs: initFaqs }: Props) {
  const [tab, setTab] = useState<Tab>("hero");
  const [content, setContent] = useState<ContentMap>(initContent);
  const [offers, setOffers] = useState<Offer[]>(initOffers);
  const [extras, setExtras] = useState<OfferExtra[]>(initExtras);
  const [steps, setSteps] = useState<MethodStep[]>(initSteps);
  const [reviews, setReviews] = useState<Review[]>(initReviews);
  const [faqs, setFaqs] = useState<FaqItem[]>(initFaqs);
  const [deletedFaqIds, setDeletedFaqIds] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  function setField(section: string, key: string, value: string) {
    setContent((prev) => ({ ...prev, [section]: { ...(prev[section] ?? {}), [key]: value } }));
  }

  function get(section: string, key: string) {
    return content[section]?.[key] ?? "";
  }

  async function save() {
    const rows = Object.entries(content).flatMap(([section, fields]) =>
      Object.entries(fields).map(([key, value]) => ({ section, key, value }))
    );

    await supabase.from("site_content").upsert(rows, { onConflict: "section,key" });

    if (tab === "method" && steps.length > 0) {
      await supabase.from("method_steps").upsert(steps, { onConflict: "id" });
    }
    if (tab === "offer") {
      if (offers.length > 0) await supabase.from("offers").upsert(offers, { onConflict: "id" });
      if (extras.length > 0) await supabase.from("offer_extras").upsert(extras, { onConflict: "id" });
    }
    if (tab === "reviews" && reviews.length > 0) {
      await supabase.from("reviews").upsert(reviews, { onConflict: "id" });
    }
    if (tab === "faq") {
      if (deletedFaqIds.length > 0) {
        await supabase.from("faq_items").delete().in("id", deletedFaqIds);
        setDeletedFaqIds([]);
      }
      if (faqs.length > 0) {
        await supabase.from("faq_items").upsert(faqs, { onConflict: "id" });
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    startTransition(() => router.refresh());
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div>
          <p style={s.sideTitle}>Pokochaj angielski</p>
          <p style={s.sideRole}>Panel admina</p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "1.5rem" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ ...s.tabBtn, ...(tab === t.id ? s.tabBtnActive : {}) }}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid #222", display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="/" target="_blank" style={s.sideLink}>← Podgląd strony</a>
          <button onClick={logout} style={s.logoutBtn}>Wyloguj się</button>
        </div>
      </aside>

      <main style={s.main}>
        <div style={s.topbar}>
          <h1 style={s.pageTitle}>{TABS.find((t) => t.id === tab)?.label}</h1>
          <button onClick={save} style={s.saveBtn}>
            {saved ? "✓ Zapisano" : "Zapisz zmiany"}
          </button>
        </div>

        <div style={s.content}>
          {tab === "hero" && (
            <Section title="Sekcja Hero">
              <Field label="Nagłówek (h1)" value={get("hero", "headline")} onChange={(v) => setField("hero", "headline", v)} />
              <Field label="Lead (opis pod nagłówkiem)" value={get("hero", "lead")} onChange={(v) => setField("hero", "lead", v)} multiline />
              <Field label="Dopisek pod przyciskami" value={get("hero", "note")} onChange={(v) => setField("hero", "note", v)} />
              <Divider label="Statystyki" />
              <Row>
                <Field label="Stat 1 — wartość" value={get("hero", "stat1_value")} onChange={(v) => setField("hero", "stat1_value", v)} />
                <Field label="Stat 1 — opis" value={get("hero", "stat1_label")} onChange={(v) => setField("hero", "stat1_label", v)} />
              </Row>
              <Row>
                <Field label="Stat 2 — wartość" value={get("hero", "stat2_value")} onChange={(v) => setField("hero", "stat2_value", v)} />
                <Field label="Stat 2 — opis" value={get("hero", "stat2_label")} onChange={(v) => setField("hero", "stat2_label", v)} />
              </Row>
              <Row>
                <Field label="Stat 3 — wartość" value={get("hero", "stat3_value")} onChange={(v) => setField("hero", "stat3_value", v)} />
                <Field label="Stat 3 — opis" value={get("hero", "stat3_label")} onChange={(v) => setField("hero", "stat3_label", v)} />
              </Row>
            </Section>
          )}

          {tab === "about" && (
            <Section title="O mnie">
              <Field label="Nagłówek" value={get("about", "headline")} onChange={(v) => setField("about", "headline", v)} multiline />
              <Field label="Lead (opis)" value={get("about", "lead")} onChange={(v) => setField("about", "lead", v)} multiline />
              <Divider label="Statystyki (4 kafelki)" />
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#888", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".1em" }}>Stat {n}</p>
                  <Row>
                    <Field label="Wartość (np. 10+)" value={get("about", `stat${n}_value`)} onChange={(v) => setField("about", `stat${n}_value`, v)} />
                    <Field label="Tytuł" value={get("about", `stat${n}_title`)} onChange={(v) => setField("about", `stat${n}_title`, v)} />
                  </Row>
                  <Field label="Opis" value={get("about", `stat${n}_desc`)} onChange={(v) => setField("about", `stat${n}_desc`, v)} multiline />
                </div>
              ))}
            </Section>
          )}

          {tab === "method" && (
            <Section title="Jak pracuję — kroki">
              <Field label="Nagłówek sekcji" value={get("method", "headline")} onChange={(v) => setField("method", "headline", v)} />
              <Divider label="Kroki" />
              {steps.map((step, i) => (
                <div key={step.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#888", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".1em" }}>Krok {i + 1}</p>
                  <Field label="Tytuł" value={step.title} onChange={(v) => setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, title: v } : s))} />
                  <Field label="Opis" value={step.description} onChange={(v) => setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, description: v } : s))} multiline />
                </div>
              ))}
              {steps.length === 0 && <p style={{ color: "#888", fontSize: ".85rem" }}>Brak kroków w bazie — najpierw dodaj dane przez SQL schema.</p>}
            </Section>
          )}

          {tab === "offer" && (
            <Section title="Oferta — cennik">
              <Field label="Nagłówek sekcji" value={get("offer", "headline")} onChange={(v) => setField("offer", "headline", v)} />
              <Field label="Tekst dodatkowy (prawa kolumna)" value={get("offer", "subtext")} onChange={(v) => setField("offer", "subtext", v)} multiline />
              <Divider label="Formaty zajęć" />
              {offers.map((offer, i) => (
                <div key={offer.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <Row>
                    <Field label="Nazwa formatu" value={offer.duration} onChange={(v) => setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, duration: v } : o))} />
                    <Field label="Cena" value={offer.price} onChange={(v) => setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, price: v } : o))} />
                    <Field label="Dopisek ceny" value={offer.price_note} onChange={(v) => setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, price_note: v } : o))} />
                  </Row>
                  <Field label="Opis" value={offer.description} onChange={(v) => setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, description: v } : o))} multiline />
                  <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".82rem", color: "#555", marginTop: ".5rem" }}>
                    <input type="checkbox" checked={offer.is_featured} onChange={(e) => setOffers((prev) => prev.map((o, idx) => idx === i ? { ...o, is_featured: e.target.checked } : o))} />
                    Wyróżniony (czarne tło)
                  </label>
                </div>
              ))}
              <Divider label="Pakiet i polecenie" />
              {extras.map((ex, i) => (
                <div key={ex.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <Row>
                    <Field label="Etykieta" value={ex.label} onChange={(v) => setExtras((prev) => prev.map((e, idx) => idx === i ? { ...e, label: v } : e))} />
                    <Field label="Tytuł" value={ex.title} onChange={(v) => setExtras((prev) => prev.map((e, idx) => idx === i ? { ...e, title: v } : e))} />
                    <Field label="Cena" value={ex.price} onChange={(v) => setExtras((prev) => prev.map((e, idx) => idx === i ? { ...e, price: v } : e))} />
                  </Row>
                  <Field label="Opis" value={ex.description} onChange={(v) => setExtras((prev) => prev.map((e, idx) => idx === i ? { ...e, description: v } : e))} multiline />
                  <Field label="Dopisek ceny" value={ex.price_note} onChange={(v) => setExtras((prev) => prev.map((e, idx) => idx === i ? { ...e, price_note: v } : e))} />
                </div>
              ))}
            </Section>
          )}

          {tab === "reviews" && (
            <Section title="Opinie klientów">
              <Field label="Nagłówek sekcji" value={get("reviews", "headline")} onChange={(v) => setField("reviews", "headline", v)} />
              <Divider label="Opinie (4 kafelki)" />
              {reviews.map((rev, i) => (
                <div key={rev.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#888", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".1em" }}>Opinia {i + 1}</p>
                  <Field label="Cytat" value={rev.quote} onChange={(v) => setReviews((prev) => prev.map((r, idx) => idx === i ? { ...r, quote: v } : r))} multiline />
                  <Row>
                    <Field label="Imię" value={rev.author} onChange={(v) => setReviews((prev) => prev.map((r, idx) => idx === i ? { ...r, author: v } : r))} />
                    <Field label="Rola/zawód" value={rev.role} onChange={(v) => setReviews((prev) => prev.map((r, idx) => idx === i ? { ...r, role: v } : r))} />
                  </Row>
                </div>
              ))}
              {reviews.length === 0 && <p style={{ color: "#888", fontSize: ".85rem" }}>Brak opinii w bazie — dodaj dane przez SQL schema.</p>}
            </Section>
          )}

          {tab === "faq" && (
            <Section title="FAQ">
              <Field label="Nagłówek sekcji" value={get("faq", "headline")} onChange={(v) => setField("faq", "headline", v)} />
              <Divider label="Pytania i odpowiedzi" />
              {faqs.map((faq, i) => (
                <div key={faq.id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
                    <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: ".1em" }}>Pytanie {i + 1}</p>
                    <button
                      onClick={() => {
                        setDeletedFaqIds((prev) => [...prev, faq.id]);
                        setFaqs((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      style={{ background: "transparent", border: "1px solid #e0e0e0", color: "#c00", padding: ".25rem .6rem", fontSize: ".75rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Usuń
                    </button>
                  </div>
                  <Field label="Pytanie" value={faq.question} onChange={(v) => setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, question: v } : f))} />
                  <Field label="Odpowiedź" value={faq.answer} onChange={(v) => setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, answer: v } : f))} multiline />
                </div>
              ))}
              {faqs.length === 0 && <p style={{ color: "#888", fontSize: ".85rem", marginBottom: "1rem" }}>Brak pytań — dodaj pierwsze poniżej.</p>}
              <button
                onClick={() => {
                  const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0;
                  setFaqs((prev) => [...prev, { id: crypto.randomUUID(), sort_order: maxOrder + 1, question: "", answer: "" }]);
                }}
                style={{ background: "#111", color: "#fff", border: "none", padding: ".55rem 1.1rem", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", marginTop: ".5rem" }}
              >
                + Dodaj pytanie
              </button>
            </Section>
          )}

          {tab === "cta" && (
            <Section title="CTA / Kontakt">
              <Field label="Nagłówek" value={get("cta", "headline")} onChange={(v) => setField("cta", "headline", v)} />
              <Field label="Opis" value={get("cta", "subtext")} onChange={(v) => setField("cta", "subtext", v)} multiline />
              <Field label="Adres email (widoczny na stronie)" value={get("cta", "email")} onChange={(v) => setField("cta", "email", v)} />
            </Section>
          )}

          {tab === "footer" && (
            <Section title="Stopka">
              <Field label="Tagline" value={get("footer", "tagline")} onChange={(v) => setField("footer", "tagline", v)} multiline />
              <Field label="Email kontaktowy" value={get("footer", "email")} onChange={(v) => setField("footer", "email", v)} />
              <Field label="Instagram (np. @pokochaj.angielski)" value={get("footer", "instagram")} onChange={(v) => setField("footer", "instagram", v)} />
              <Field label="Facebook" value={get("footer", "facebook")} onChange={(v) => setField("footer", "facebook", v)} />
            </Section>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "1.5rem", paddingBottom: ".75rem", borderBottom: "2px solid #111" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: ".75rem" }}>{children}</div>;
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#aaa", paddingTop: ".5rem", paddingBottom: ".25rem", borderTop: "1px solid #eee", marginTop: ".5rem" }}>
      {label}
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif" } as const,
  sidebar: { width: 220, background: "#0d0d0d", padding: "1.5rem 1.2rem", display: "flex", flexDirection: "column" as const, gap: 0, flexShrink: 0 },
  sideTitle: { fontSize: ".95rem", fontWeight: 700, color: "#fff", letterSpacing: "-.01em" },
  sideRole: { fontSize: ".68rem", color: "#555", marginTop: ".2rem", textTransform: "uppercase" as const, letterSpacing: ".1em" },
  tabBtn: { background: "transparent", border: "none", padding: ".5rem .7rem", textAlign: "left" as const, fontSize: ".82rem", color: "#777", cursor: "pointer", fontWeight: 500, transition: "color .1s, background .1s" },
  tabBtnActive: { color: "#fff", background: "#1e1e1e" },
  sideLink: { fontSize: ".75rem", color: "#555", textDecoration: "none", padding: ".3rem 0", display: "block" },
  logoutBtn: { background: "transparent", border: "1px solid #222", color: "#555", padding: ".4rem .7rem", fontSize: ".78rem", cursor: "pointer", textAlign: "left" as const },
  main: { flex: 1, display: "flex", flexDirection: "column" as const, background: "#fafafa" },
  topbar: { background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#111" },
  saveBtn: { background: "#111", color: "#fff", border: "none", padding: ".6rem 1.2rem", fontWeight: 600, fontSize: ".85rem", cursor: "pointer" },
  content: { flex: 1, padding: "2rem", maxWidth: 860 },
  field: { display: "flex", flexDirection: "column" as const, gap: ".3rem" },
  fieldLabel: { fontSize: ".75rem", fontWeight: 600, color: "#555", textTransform: "uppercase" as const, letterSpacing: ".08em" },
  input: { border: "1px solid #ccc", padding: ".55rem .7rem", fontSize: ".88rem", outline: "none", width: "100%", resize: "vertical" as const, fontFamily: "inherit", background: "#fff" },
};
