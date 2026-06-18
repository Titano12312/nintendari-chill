import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import logoImg from "@/assets/logo-wii.jpg";

const DISCORD = "https://discord.gg/Hw5m2G6pe";
const TIKTOK_SERVER = "https://www.tiktok.com/@gliamici_pazzi12";
const TIKTOK_FREEZER = "https://www.tiktok.com/@freezertime2000";
const EMAIL = "u8826144619@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Contatto dal sito - I Nintendari Chill")}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I Nintendari Chill — Server Discord dedicato alle vecchie console" },
      {
        name: "description",
        content:
          "Entra nel server Discord italiano dedicato alle vecchie console: Wii, Wii U, 3DS, Xbox 360, PS3 e tutto il retrogaming. Community nata il 20 luglio 2025.",
      },
      { property: "og:title", content: "I Nintendari Chill — Retro Gaming Discord" },
      {
        property: "og:description",
        content:
          "Una delle poche community italiane Discord dedicate alle vecchie console. Unisciti ai Nintendari Chill!",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap",
      },
    ],
  }),
  component: Index,
});

function Pad({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden>
      <rect x="2" y="14" rx="14" ry="14" width="116" height="44" fill="oklch(0.3 0.06 280)" stroke="oklch(0.85 0.22 145)" strokeWidth="2" />
      <circle cx="86" cy="36" r="5" fill="oklch(0.78 0.22 50)" />
      <circle cx="100" cy="36" r="5" fill="oklch(0.7 0.28 340)" />
      <rect x="20" y="32" width="14" height="4" fill="oklch(0.96 0.02 90)" />
      <rect x="25" y="27" width="4" height="14" fill="oklch(0.96 0.02 90)" />
    </svg>
  );
}

function Cartridge({ label, color }: { label: string; color: string }) {
  return (
    <div className="relative w-full">
      <div
        className="rounded-sm p-4 pixel-border"
        style={{ background: color }}
      >
        <div className="bg-background/80 px-3 py-2 border-2 border-foreground/40">
          <p className="font-display text-[10px] sm:text-xs text-foreground tracking-wider text-center">
            {label}
          </p>
        </div>
        <div className="mt-3 flex justify-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-2 h-3 bg-foreground/70" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* CRT scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, oklch(0 0 0 / 0.4) 2px, oklch(0 0 0 / 0.4) 3px)",
        }}
      />

      {/* NAV */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden pixel-border">
            <img src={logoImg} alt="I Nintendari Chill" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-xs sm:text-sm text-primary text-glow">
            I NINTENDARI CHILL
          </span>
        </div>
        <nav className="hidden md:flex gap-6 font-mono text-lg">
          <a href="#about" className="hover:text-primary transition">Server</a>
          <a href="#features" className="hover:text-primary transition">Cosa facciamo</a>
          <a href="#contatti" className="hover:text-primary transition">Contatti</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <p className="font-mono text-accent text-xl mb-4">
          <span className="blink">▶</span> INSERT COIN — PRESS START
        </p>
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl leading-tight text-foreground">
          <span className="text-primary text-glow">I NINTENDARI</span>
          <br />
          <span className="text-glow" style={{ color: "oklch(0.7 0.28 340)" }}>
            CHILL
          </span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto font-mono text-xl text-muted-foreground">
          Il server Discord italiano dedicato alle{" "}
          <span className="text-accent">vecchie console</span>.
          Pixel, cartucce, joypad consumati e ricordi a 8 e 16 bit. Server di questo
          tipo in Italia ce ne sono pochi — questo è uno di quelli.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={DISCORD}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs sm:text-sm px-8 py-5 bg-primary text-primary-foreground pixel-border hover:translate-y-[-2px] transition-transform box-glow"
          >
            ENTRA NEL SERVER ▸
          </a>
          <a
            href="#about"
            className="font-display text-xs sm:text-sm px-8 py-5 bg-secondary text-secondary-foreground pixel-border hover:translate-y-[-2px] transition-transform"
          >
            SCOPRI DI PIÙ
          </a>
        </div>

        <div className="mt-16 flex justify-center gap-6 opacity-80">
          <Pad className="w-24 sm:w-32 float" />
          <Pad className="w-24 sm:w-32 float" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-accent text-lg">// CHI SIAMO</p>
            <h2 className="font-display text-2xl sm:text-3xl mt-3 text-primary text-glow">
              UNA COMMUNITY RARA IN ITALIA
            </h2>
            <p className="font-mono text-xl mt-6 text-muted-foreground leading-relaxed">
              I Nintendari Chill è nato il{" "}
              <span className="text-foreground">20 luglio 2025</span> con un'idea
              semplice: creare uno spazio italiano dove parlare delle console di una
              volta senza nostalgia finta. Wii, Wii U, 3DS, Xbox 360, PS3 — la
              generazione che ha cresciuto un'intera community.
            </p>
            <p className="font-mono text-xl mt-4 text-muted-foreground leading-relaxed">
              Server di questo tipo in Italia ne esistono pochissimi. Noi siamo uno di
              quelli.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Cartridge label="WII" color="oklch(0.95 0.02 240)" />
            <Cartridge label="WII U" color="oklch(0.75 0.15 220)" />
            <Cartridge label="3DS" color="oklch(0.55 0.22 25)" />
            <Cartridge label="XBOX 360" color="oklch(0.65 0.2 145)" />
            <Cartridge label="PS3" color="oklch(0.25 0.03 280)" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <p className="font-mono text-accent text-lg text-center">// COSA TROVI DENTRO</p>
        <h2 className="font-display text-2xl sm:text-3xl mt-3 text-center text-primary text-glow">
          LIVELLI SBLOCCATI
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "RETRO CHAT", d: "Discussioni quotidiane su console, giochi, emulazione e collezionismo." },
            { t: "CONSIGLI & FIX", d: "Aiuto su mod, riparazioni, scaling video e setup CRT." },
            { t: "EVENTI", d: "Sessioni in vocale, tornei retro e serate a tema sui classici." },
            { t: "SCAMBI", d: "Una zona per parlare di cartucce, console e accessori d'epoca." },
            { t: "MEMORIA", d: "Storie, screenshot e ricordi della golden age del gaming." },
            { t: "AMICIZIA", d: "Una community piccola, italiana e vera. Niente toxic, niente filtri." },
          ].map((f) => (
            <div
              key={f.t}
              className="relative bg-card border-2 border-border p-6 hover:border-primary hover:translate-y-[-4px] transition-all"
            >
              <div className="font-display text-xs text-accent mb-3">★ {f.t}</div>
              <p className="font-mono text-lg text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIPE */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="bg-primary text-primary-foreground p-10 pixel-border text-center">
          <h3 className="font-display text-lg sm:text-2xl">PRONTO A PREMERE START?</h3>
          <p className="font-mono text-xl mt-4">
            Unisciti ai Nintendari Chill su Discord. È gratis, è italiano, è retro.
          </p>
          <a
            href={DISCORD}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 font-display text-xs sm:text-sm px-8 py-5 bg-background text-foreground pixel-border hover:translate-y-[-2px] transition-transform"
          >
            ▸ UNISCITI ORA
          </a>
        </div>
      </section>

      {/* CONTATTI */}
      <section id="contatti" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <p className="font-mono text-accent text-lg text-center">// CONTATTI</p>
        <h2 className="font-display text-2xl sm:text-3xl mt-3 text-center text-primary text-glow">
          PARLA CON LO STAFF
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a
            href={MAILTO}
            className="group bg-card border-2 border-border p-6 hover:border-primary transition"
          >
            <div className="font-display text-xs text-accent mb-3">✉ EMAIL UFFICIALE</div>
            <p className="font-mono text-xl text-foreground break-all group-hover:text-primary transition">
              {EMAIL}
            </p>
            <p className="font-mono text-base mt-3 text-muted-foreground">
              Clicca per scrivere direttamente all'owner e allo staff dalla tua casella email.
            </p>
          </a>

          <a
            href={DISCORD}
            target="_blank"
            rel="noreferrer"
            className="group bg-card border-2 border-border p-6 hover:border-primary transition"
          >
            <div className="font-display text-xs text-accent mb-3">◆ DISCORD</div>
            <p className="font-mono text-xl text-foreground group-hover:text-primary transition">
              discord.gg/Hw5m2G6pe
            </p>
            <p className="font-mono text-base mt-3 text-muted-foreground">
              Il modo più rapido per parlare con la community.
            </p>
          </a>

          <a
            href={TIKTOK_SERVER}
            target="_blank"
            rel="noreferrer"
            className="group bg-card border-2 border-border p-6 hover:border-primary transition"
          >
            <div className="font-display text-xs text-accent mb-3">♪ TIKTOK SERVER</div>
            <p className="font-mono text-xl text-foreground group-hover:text-primary transition">
              @gliamici_pazzi12
            </p>
            <p className="font-mono text-base mt-3 text-muted-foreground">
              Il profilo TikTok ufficiale della community.
            </p>
          </a>

          <a
            href={TIKTOK_FREEZER}
            target="_blank"
            rel="noreferrer"
            className="group bg-card border-2 border-border p-6 hover:border-primary transition"
          >
            <div className="font-display text-xs text-accent mb-3">♪ TIKTOK FREEZERTIME</div>
            <p className="font-mono text-xl text-foreground group-hover:text-primary transition">
              @freezertime2000
            </p>
            <p className="font-mono text-base mt-3 text-muted-foreground">
              Il profilo TikTok di Freezertime.
            </p>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-12 border-t-2 border-border mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-base text-muted-foreground">
            © 2025 I Nintendari Chill — dal 20 luglio 2025
          </p>
          <p className="font-mono text-base text-muted-foreground">
            Sito realizzato da{" "}
            <span className="text-primary text-glow">Titano</span>{" "}
            <span className="text-accent">(titano_12)</span>
          </p>
        </div>
        <p className="font-display text-[10px] text-center mt-8 text-muted-foreground/70">
          GAME OVER? <span className="blink">_</span> PRESS START TO CONTINUE
        </p>
      </footer>
    </div>
  );
}
