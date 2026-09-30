import { useSettings } from "@/context/SettingsContext";

export default function Logo({ size = 44 }: { size?: number }) {
  const { settings } = useSettings();
  return (
    <img
      src={settings.logoUrl || "/logo.jpg"}
      alt={settings.siteName}
      width={size}
      height={size}
      className="shrink-0 rounded-full border-2 border-gold-500/70 object-cover"
      style={{ width: size, height: size }}
    />
  );
}
