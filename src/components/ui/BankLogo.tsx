import { useState } from "react";
import { findProvider, providerLogo } from "@/utils/banks";

interface Props {
  provider?: string;
  logoUrl?: string;
  name: string;
  size?: number;
}

export default function BankLogo({ provider, logoUrl, name, size = 44 }: Props) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl || providerLogo(findProvider(provider));
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-inner"
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        <img src={src} alt={name} className="h-full w-full object-contain" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="text-sm font-extrabold text-ink-900">{initials}</span>
      )}
    </span>
  );
}
