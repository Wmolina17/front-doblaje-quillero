import { useSettings } from "@/context/SettingsContext";
import { SOCIAL_META } from "@/utils/socials";
import { SOCIAL_KEYS } from "@/types";

export default function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const { settings } = useSettings();
  const links = SOCIAL_KEYS.filter((key) => settings.socials[key]);
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {links.map((key) => {
        const { icon: Icon, label } = SOCIAL_META[key];
        return (
          <a
            key={key}
            href={settings.socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={`${box} inline-flex items-center justify-center rounded-full border border-gold-500/30 bg-ink-800 text-gold-300 transition hover:bg-gold-gradient hover:text-on-gold`}
          >
            <Icon size={size === "sm" ? 15 : 18} />
          </a>
        );
      })}
    </div>
  );
}
