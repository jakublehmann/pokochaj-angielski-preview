"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4" }}>
      <form
        onSubmit={handleLogin}
        style={{ background: "#fff", border: "1px solid #aaa", padding: "2.5rem 2rem", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-.02em", marginBottom: ".5rem" }}>Panel admina</h1>
        {error && <p style={{ fontSize: ".82rem", color: "#cc0000", background: "#fff0f0", padding: ".5rem .75rem", border: "1px solid #fcc" }}>{error}</p>}
        <label style={{ fontSize: ".8rem", fontWeight: 600, color: "#555", display: "flex", flexDirection: "column", gap: ".3rem" }}>
          Email
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: ".6rem .75rem", border: "1px solid #aaa", fontSize: ".9rem", outline: "none" }}
          />
        </label>
        <label style={{ fontSize: ".8rem", fontWeight: 600, color: "#555", display: "flex", flexDirection: "column", gap: ".3rem" }}>
          Hasło
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ padding: ".6rem .75rem", border: "1px solid #aaa", fontSize: ".9rem", outline: "none" }}
          />
        </label>
        <button
          type="submit" disabled={loading}
          style={{ marginTop: ".5rem", background: "#111", color: "#fff", border: "none", padding: ".75rem 1rem", fontWeight: 600, fontSize: ".9rem", cursor: "pointer", opacity: loading ? .6 : 1 }}
        >
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
