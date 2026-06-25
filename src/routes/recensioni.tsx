import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Star, Send, MessageSquare, ArrowLeft, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo-wii.jpg";

const STAFF_NICK = "NINTENDARI";

export const Route = createFileRoute("/recensioni")({
  head: () => ({
    meta: [
      { title: "Recensioni — I Nintendari Chill" },
      {
        name: "description",
        content:
          "Lascia la tua recensione sul server Discord I Nintendari Chill. Scegli un nickname, assegna le stelle e racconta la tua esperienza.",
      },
      { property: "og:title", content: "Recensioni — I Nintendari Chill" },
      {
        property: "og:description",
        content: "Recensioni della community e risposte ufficiali dello staff Nintendari.",
      },
    ],
  }),
  component: RecensioniPage,
});

type Review = {
  id: string;
  nickname: string;
  rating: number;
  content: string;
  created_at: string;
};

type Reply = {
  id: string;
  review_id: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick) return setError("Inserisci un nickname.");
    if (rating < 1 || rating > 5) return setError("Scegli un punteggio da 1 a 5 stelle.");
    if (!text) return setError("Scrivi la tua recensione.");
    if (text.length > 1000) return setError("Recensione troppo lunga (max 1000 caratteri).");

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      nickname: nick.slice(0, 40),
      rating,
      content: text,
    });
    setSubmitting(false);
    if (error) return setError("Errore nell'invio: " + error.message);
    setNickname("");
    setRating(0);
    setContent("");
    load();
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
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-sm hover:text-primary transition"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
      </header>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <p className="font-mono text-accent text-lg mb-3">
          <span className="blink">▶</span> PLAYER FEEDBACK
        </p>
        <h1 className="font-display text-2xl sm:text-4xl text-primary text-glow">
          RECENSIONI
        </h1>
        <p className="mt-6 max-w-2xl mx-auto font-mono text-base text-muted-foreground">
          Racconta la tua esperienza nel server. Scegli un nickname, assegna le stelle e
          condividi il tuo pensiero. Lo staff{" "}
          <span className="text-accent">NINTENDARI</span> può risponderti direttamente qui.
        </p>
      </section>

      {/* FORM */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-12">
        <form
          onSubmit={submitReview}
          className="pixel-border p-6 bg-card/60 backdrop-blur space-y-5"
        >
          <h2 className="font-display text-base text-primary">LASCIA UNA RECENSIONE</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="font-mono text-sm block mb-2">Nickname</span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={40}
                placeholder="Es. PixelMario99"
                className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div>
              <span className="font-mono text-sm block mb-2">Valutazione</span>
              <StarRow value={rating} onChange={setRating} size={26} />
            </div>
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

          {error && (
            <p className="font-mono text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="font-display text-xs px-6 py-3 bg-primary text-primary-foreground pixel-border hover:translate-y-[-2px] transition-transform box-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={14} />
            {submitting ? "INVIO..." : "PUBBLICA"}
          </button>

          <p className="font-mono text-[10px] text-muted-foreground">
            Suggerimento: se fai parte dello staff, usa il nickname{" "}
            <span className="text-accent">NINTENDARI</span> per rispondere ufficialmente.
          </p>
        </form>
      </section>

      {/* LIST */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 space-y-6">
        <h2 className="font-display text-base text-primary">
          ULTIME RECENSIONI {!loading && `(${reviews.length})`}
        </h2>

        {loading && <p className="font-mono text-muted-foreground">Caricamento...</p>}

        {!loading && reviews.length === 0 && (
          <p className="font-mono text-muted-foreground">
            Nessuna recensione ancora. Sii il primo!
          </p>
        )}

        {reviews.map((rev) => {
          const reviewReplies = repliesFor(rev.id);
          const isStaffAuthor = rev.nickname.trim().toUpperCase() === STAFF_NICK;
          return (
            <article key={rev.id} className="pixel-border p-5 bg-card/60 backdrop-blur space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-sm text-primary">{rev.nickname}</span>
                  {isStaffAuthor && (
                    <span className="font-mono text-[10px] px-2 py-1 bg-accent text-accent-foreground flex items-center gap-1">
                      <Shield size={10} /> STAFF
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(rev.created_at)}
                </span>
              </div>
              <StarRow value={rev.rating} size={16} />
              <p className="font-mono text-sm whitespace-pre-wrap">{rev.content}</p>

              {reviewReplies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-primary/40 space-y-3">
                  {reviewReplies.map((rep) => (
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
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {formatDate(rep.created_at)}
                        </span>
                      </div>
                      <p className="font-mono text-sm whitespace-pre-wrap">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                {replyOpen === rev.id ? (
                  <ReplyForm
                    reviewId={rev.id}
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
            </article>
          );
        })}
      </section>
    </div>
  );
}

function ReplyForm({
  reviewId,
  onClose,
  onPosted,
}: {
  reviewId: string;
  onClose: () => void;
  onPosted: () => void;
}) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick) return setError("Inserisci un nickname.");
    if (!text) return setError("Scrivi una risposta.");
    setSubmitting(true);
    const { error } = await supabase.from("review_replies").insert({
      review_id: reviewId,
      nickname: nick.slice(0, 40),
      content: text,
      is_staff: false,
    });
    setSubmitting(false);
    if (error) return setError("Errore: " + error.message);
    onPosted();
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-2">
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={40}
        placeholder="Nickname"
        className="w-full bg-background pixel-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
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
