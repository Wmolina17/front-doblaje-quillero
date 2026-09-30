import { FaTiktok, FaYoutube } from "react-icons/fa6";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/ui/Logo";

export default function About() {
  const { settings } = useSettings();
  const { tiktok, youtube } = settings.socials;

  return (
    <section id="nosotros" className="relative overflow-hidden border-t border-gold-500/10 bg-ink-900/60 py-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-6 lg:grid-cols-[auto,1fr]">
        <div className="mx-auto">
          <div className="animate-float rounded-full p-1.5 shadow-gold">
            <Logo size={200} />
          </div>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">¿Quiénes somos?</p>
          <h2 className="section-title mt-2 text-gold-gradient">{settings.siteName}</h2>
          {settings.aboutText && (
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink-100">{settings.aboutText}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 font-bold text-on-gold transition hover:brightness-110"
              >
                <FaTiktok /> Ver doblajes en TikTok
              </a>
            )}
            {youtube && (
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gold-500/50 px-5 py-3 font-bold text-gold-300 transition hover:bg-gold-500/10"
              >
                <FaYoutube /> Canal de YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
