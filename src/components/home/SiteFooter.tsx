import { FiCheckCircle, FiClock, FiLock, FiMail, FiPhone, FiShield, FiSpeaker } from "react-icons/fi";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/ui/Logo";
import SocialLinks from "@/components/ui/SocialLinks";
import { whatsappLink } from "@/utils/format";

const BADGES = [
  { icon: FiLock, text: "Pagos verificados" },
  { icon: FiShield, text: "Datos protegidos" },
  { icon: FiCheckCircle, text: "Proceso transparente" },
];

export default function SiteFooter() {
  const { settings } = useSettings();
  const whatsapp = settings.supportWhatsapp || settings.supportPhone;

  return (
    <footer className="border-t border-gold-500/20 bg-ink-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex items-center gap-3">
            <Logo size={52} />
            <p className="font-display text-3xl tracking-wide text-gold-gradient">{settings.siteName}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-200">{settings.tagline}</p>
        </div>

        <div className="text-center md:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Soporte</p>
          <ul className="space-y-2 text-sm text-ink-100">
            {whatsapp && (
              <li>
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-300">
                  <FiPhone className="text-gold-400" /> {whatsapp}
                </a>
              </li>
            )}
            {settings.supportPhone && settings.supportPhone !== whatsapp && (
              <li>
                <a href={`tel:${settings.supportPhone}`} className="inline-flex items-center gap-2 hover:text-gold-300">
                  <FiPhone className="text-gold-400" /> {settings.supportPhone}
                </a>
              </li>
            )}
            {settings.supportEmail && (
              <li>
                <a href={`mailto:${settings.supportEmail}`} className="inline-flex items-center gap-2 hover:text-gold-300">
                  <FiMail className="text-gold-400" /> {settings.supportEmail}
                </a>
              </li>
            )}
            {settings.supportHours && (
              <li className="inline-flex items-center gap-2">
                <FiClock className="text-gold-400" /> {settings.supportHours}
              </li>
            )}
            {settings.advertisingPhone && (
              <li>
                <a
                  href={whatsappLink(settings.advertisingPhone, "Hola, quiero información sobre publicidad")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold-300"
                >
                  <FiSpeaker className="text-gold-400" /> Publicidad: {settings.advertisingPhone}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Síguenos</p>
          <div className="md:[&>div]:justify-start">
            <SocialLinks size="sm" />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start">
            {BADGES.map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 text-xs text-ink-200">
                <Icon className="text-gold-400" /> {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-ink-600 py-5 text-center text-xs text-ink-300">
        © {new Date().getFullYear()} {settings.siteName} · doblajequillero.com
      </div>
    </footer>
  );
}
