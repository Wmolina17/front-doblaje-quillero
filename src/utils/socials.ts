import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import type { SocialKey } from "@/types";

export const SOCIAL_META: Record<SocialKey, { label: string; icon: IconType; placeholder: string }> = {
  tiktok: { label: "TikTok", icon: FaTiktok, placeholder: "https://www.tiktok.com/@usuario" },
  instagram: { label: "Instagram", icon: FaInstagram, placeholder: "https://www.instagram.com/usuario" },
  facebook: { label: "Facebook", icon: FaFacebookF, placeholder: "https://www.facebook.com/pagina" },
  facebookAlt: { label: "Facebook (página alterna)", icon: FaFacebookF, placeholder: "https://www.facebook.com/pagina-alterna" },
  youtube: { label: "YouTube", icon: FaYoutube, placeholder: "https://www.youtube.com/@canal" },
  x: { label: "X (Twitter)", icon: FaXTwitter, placeholder: "https://x.com/usuario" },
  threads: { label: "Threads", icon: FaThreads, placeholder: "https://www.threads.net/@usuario" },
  kick: { label: "Kick", icon: SiKick, placeholder: "https://kick.com/usuario" },
  twitch: { label: "Twitch", icon: FaTwitch, placeholder: "https://www.twitch.tv/usuario" },
  telegram: { label: "Telegram", icon: FaTelegram, placeholder: "https://t.me/canal" },
  whatsappChannel: { label: "Canal de WhatsApp", icon: FaWhatsapp, placeholder: "https://whatsapp.com/channel/..." },
};
