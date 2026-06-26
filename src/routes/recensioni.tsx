import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Star, Send, MessageSquare, ArrowLeft, Shield, LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import logoImg from "@/assets/logo-wii.jpg";

const ADMIN_EMAIL = "u8826144619@gmail.com";

export const Route = createFileRoute("/recensioni")({
  head: () => ({
    meta: [
      { title: "Recensioni — I Nintendari Chill" },
      {
        name: "description",
        content:
          "Lascia la tua recensione sul server Discord I Nintendari Chill. Registrati con email e password per pubblicare la tua esperienza.",
      },
      { property: "og:title", content: "Recensioni — I Nintendari Chill" },
      {
        property: "og:description",
        content: "Recensioni della community verificate via email.",
      },
    ],
  }),
  component: RecensioniPage,
});

type Review = {
  id: string;
  user_id: string;
  nickname: string;
  rating: number;
  content: string;
  created_at: string;
};

type Reply = {
  id: string;
  review_id: string;
  user_id: string;
  nickname: string;
  content: string;
  is_staff: boolean;
  created_at: string;
};

function StarRow({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const interactive = !!onChange;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}
          aria-label={`${n} stelle`}
        >
          <Star
            size={size}
            className={n <= value ? "fill-accent text-accent" : "text-muted-foreground"}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RecensioniPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nicknameMe, setNicknameMe] = useState<string>("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      setNicknameMe("");
      return;
    }
    setIsAdmin(session.user.email === ADMIN_EMAIL);
    supabase
      .from("profiles")
      .select("nickname")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.nickname) setNicknameMe(data.nickname);
      });
  }, [session]);

  const load = useCallback(async () => {
    setLoading(true);
    const [r, rp] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("review_replies").select("*").order("created_at", { ascending: true }),
    ]);
    if (!r.error && r.data) setReviews(r.data as Review[]);
    if (!rp.error && rp.data) setReplies(rp.data as Reply[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const myReview = session ? reviews.find((r) => r.user_id === session.user.id) : undefined;

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!session) return setError("Devi accedere per lasciare una recensione.");
    if (myReview) return setError("Hai già pubblicato una recensione.");
    const text = content.trim();
    if (rating < 1 || rating > 5) return setError("Scegli un punteggio da 1 a 5 stelle.");
    if (!text) return setError("Scrivi la tua recensione.");
    if (text.length > 1000) return setError("Recensione troppo lunga (max 1000 caratteri).");

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: session.user.id,
      nickname: (nicknameMe || session.user.email || "Utente").slice(0, 40),
      rating,
      content: text,
    });
    setSubmitting(false);
    if (error) return setError("Errore nell'invio: " + error.message);
    setRating(0);
    setContent("");
    load();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Eliminare questa recensione?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return alert("Errore: " + error.message);
    load();
  };

  const deleteReply = async (id: string) => {
    if (!confirm("Eliminare questa risposta?")) return;
    const { error } = await supabase.from("review_replies").delete().eq("id", id);
    if (error) return alert("Errore: " + error.message);
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const repliesFor = (reviewId: string) => replies.filter((r) => r.review_id === reviewId);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, oklch(0 0 0 / 0.4) 2px, oklch(0 0 0 / 0.4) 3px)",
        }}
      />

      <header className="relative z-10 max-w-4xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 overflow-hidden pixel-border">
            <img src={logoImg} alt="I Nintendari Chill" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-xs sm:text-sm text-primary text-glow group-hover:underline">
            I NINTENDARI CHILL
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {session && (
            <button
              onClick={signOut}
              className="font-mono text-xs flex items-center gap-1 hover:text-primary transition"
            >
              <LogOut size={14} /> Esci
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 font-mono text-sm hover:text-primary transition">
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <p className="font-mono text-accent text-lg mb-3">
          <span className="blink">▶</span> PLAYER FEEDBACK
        </p>
        <h1 className="font-display text-2xl sm:text-4xl text-primary text-glow">RECENSIONI</h1>
        <p className="mt-6 max-w-2xl mx-auto font-mono text-base text-muted-foreground">
          Registrati con email e password, conferma l'indirizzo e lascia la tua recensione.
          Una sola recensione per utente.
        </p>
        {session && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Accesso effettuato come{" "}
            <span className="text-primary">{nicknameMe || session.user.email}</span>
            {isAdmin && (
              <span className="ml-2 px-2 py-1 bg-accent text-accent-foreground text-[10px]">
                ADMIN
              </span>
            )}
          </p>
        )}
      </section>

      {/* AUTH or REVIEW FORM */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-12">
        {!session ? (
          <AuthForms onAuthed={load} />
        ) : myReview ? (
          <div className="pixel-border p-6 bg-card/60 backdrop-blur">
            <p className="font-mono text-sm text-muted-foreground">
              Hai già pubblicato la tua recensione. Puoi eliminarla qui sotto se vuoi riscriverla.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submitReview}
            className="pixel-border p-6 bg-card/60 backdrop-blur space-y-5"
          >
            <h2 className="font-display text-base text-primary">LASCIA UNA RECENSIONE</h2>

            <div>
              <span className="font-mono text-sm block mb-2">Valutazione</span>
              <StarRow value={rating} onChange={setRating} size={26} />
            </div>

            <label className="block">
              <span className="font-mono text-sm block mb-2">La tua recensione</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Cosa ne pensi del server?"
                className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <span className="font-mono text-xs text-muted-foreground mt-1 block text-right">
                {content.length}/1000
              </span>
            </label>

            {error && <p className="font-mono text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="font-display text-xs px-6 py-3 bg-primary text-primary-foreground pixel-border hover:translate-y-[-2px] transition-transform box-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={14} />
              {submitting ? "INVIO..." : "PUBBLICA"}
            </button>
          </form>
        )}
      </section>

      {/* LIST */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 space-y-6">
        <h2 className="font-display text-base text-primary">
          ULTIME RECENSIONI {!loading && `(${reviews.length})`}
        </h2>

        {loading && <p className="font-mono text-muted-foreground">Caricamento...</p>}

        {!loading && reviews.length === 0 && (
          <p className="font-mono text-muted-foreground">Nessuna recensione ancora. Sii il primo!</p>
        )}

        {reviews.map((rev) => {
          const reviewReplies = repliesFor(rev.id);
          const canDeleteReview = session && (session.user.id === rev.user_id || isAdmin);
          return (
            <article key={rev.id} className="pixel-border p-5 bg-card/60 backdrop-blur space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-sm text-primary">{rev.nickname}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(rev.created_at)}
                  </span>
                  {canDeleteReview && (
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="text-destructive hover:scale-110 transition"
                      aria-label="Elimina recensione"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <StarRow value={rev.rating} size={16} />
              <p className="font-mono text-sm whitespace-pre-wrap">{rev.content}</p>

              {reviewReplies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-primary/40 space-y-3">
                  {reviewReplies.map((rep) => {
                    const canDeleteReply = session && (session.user.id === rep.user_id || isAdmin);
                    const repIsAdmin = false; // marker not used; admin badge below uses email match unavailable client-side
                    return (
                      <div key={rep.id} className="bg-background/40 p-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs text-primary">
                              {rep.nickname}
                            </span>
                            {rep.is_staff && (
                              <span className="font-mono text-[10px] px-2 py-0.5 bg-accent text-accent-foreground flex items-center gap-1">
                                <Shield size={10} /> STAFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {formatDate(rep.created_at)}
                            </span>
                            {canDeleteReply && (
                              <button
                                onClick={() => deleteReply(rep.id)}
                                className="text-destructive hover:scale-110 transition"
                                aria-label="Elimina risposta"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="font-mono text-sm whitespace-pre-wrap">{rep.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {session && (
                <div className="pt-2">
                  {replyOpen === rev.id ? (
                    <ReplyForm
                      reviewId={rev.id}
                      userId={session.user.id}
                      nickname={nicknameMe || session.user.email || "Utente"}
                      onClose={() => setReplyOpen(null)}
                      onPosted={() => {
                        setReplyOpen(null);
                        load();
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReplyOpen(rev.id)}
                      className="font-mono text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                    >
                      <MessageSquare size={12} /> Rispondi
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function AuthForms({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signup") {
      const nick = nickname.trim();
      if (!nick) {
        setBusy(false);
        return setError("Scegli un nickname.");
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/recensioni`,
          data: { nickname: nick.slice(0, 40) },
        },
      });
      setBusy(false);
      if (error) return setError(error.message);
      setInfo("Controlla la tua email per confermare l'account, poi torna qui.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      onAuthed();
    }
  };

  return (
    <form onSubmit={submit} className="pixel-border p-6 bg-card/60 backdrop-blur space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`font-display text-xs px-4 py-2 pixel-border ${
            mode === "login" ? "bg-primary text-primary-foreground" : "bg-transparent"
          }`}
        >
          ACCEDI
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`font-display text-xs px-4 py-2 pixel-border ${
            mode === "signup" ? "bg-primary text-primary-foreground" : "bg-transparent"
          }`}
        >
          REGISTRATI
        </button>
      </div>

      {mode === "signup" && (
        <label className="block">
          <span className="font-mono text-sm block mb-2">Nickname</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={40}
            placeholder="Es. PixelMario99"
            className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      )}

      <label className="block">
        <span className="font-mono text-sm block mb-2">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <label className="block">
        <span className="font-mono text-sm block mb-2">Password</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      {error && <p className="font-mono text-sm text-destructive">{error}</p>}
      {info && <p className="font-mono text-sm text-accent">{info}</p>}

      <button
        type="submit"
        disabled={busy}
        className="font-display text-xs px-6 py-3 bg-primary text-primary-foreground pixel-border hover:translate-y-[-2px] transition-transform box-glow disabled:opacity-50"
      >
        {busy ? "..." : mode === "login" ? "ACCEDI" : "CREA ACCOUNT"}
      </button>
    </form>
  );
}

function ReplyForm({
  reviewId,
  userId,
  nickname,
  onClose,
  onPosted,
}: {
  reviewId: string;
  userId: string;
  nickname: string;
  onClose: () => void;
  onPosted: () => void;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const text = content.trim();
    if (!text) return setError("Scrivi una risposta.");
    setSubmitting(true);
    const { error } = await supabase.from("review_replies").insert({
      review_id: reviewId,
      user_id: userId,
      nickname: nickname.slice(0, 40),
      content: text,
    });
    setSubmitting(false);
    if (error) return setError("Errore: " + error.message);
    onPosted();
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="La tua risposta..."
        className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      {error && <p className="font-mono text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="font-display text-[10px] px-4 py-2 bg-primary text-primary-foreground pixel-border hover:translate-y-[-2px] transition disabled:opacity-50"
        >
          {submitting ? "INVIO..." : "RISPONDI"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs px-3 py-2 text-muted-foreground hover:text-foreground transition"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
