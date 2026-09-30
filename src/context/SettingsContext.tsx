import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  siteName: "Doblaje Quillero",
  tagline: "Eventos oficiales de Doblaje Quillero Inc.",
  aboutText: "",
  logoUrl: "",
  supportPhone: "",
  supportWhatsapp: "",
  supportEmail: "",
  supportHours: "",
  advertisingPhone: "",
  usdRate: 4000,
  socials: {
    tiktok: "",
    instagram: "",
    facebook: "",
    facebookAlt: "",
    youtube: "",
    x: "",
    threads: "",
    kick: "",
    twitch: "",
    telegram: "",
    whatsappChannel: "",
  },
};

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  setSettings: (settings: Settings) => void;
  reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings({ ...DEFAULT_SETTINGS, ...data, socials: { ...DEFAULT_SETTINGS.socials, ...data.socials } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings, reload }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return context;
};
