import { useState } from "react";
import { FiImage, FiMail, FiPhone, FiSave, FiShare2 } from "react-icons/fi";
import { api } from "@/services/api";
import { useSettings } from "@/context/SettingsContext";
import type { Settings } from "@/types";
import { SOCIAL_KEYS } from "@/types";
import { SOCIAL_META } from "@/utils/socials";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { notifyError, notifySuccess } from "@/utils/swal";

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-gold-200">
        <span className="text-gold-400">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function SettingsSection() {
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { usdRate: _usdRate, ...data } = form;
      const saved = await api.updateSettings(data);
      setSettings(saved);
      setForm(saved);
      notifySuccess("Configuración guardada");
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      <Panel icon={<FiPhone />} title="Soporte y contacto">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="WhatsApp de soporte"
            value={form.supportWhatsapp}
            onChange={(e) => set("supportWhatsapp", e.target.value)}
            placeholder="+57 300 123 4567"
            hint="Botón flotante y enlaces de ayuda"
          />
          <Input
            label="Teléfono de soporte"
            value={form.supportPhone}
            onChange={(e) => set("supportPhone", e.target.value)}
            placeholder="+57 300 123 4567"
          />
          <Input
            label="Correo de soporte"
            type="email"
            icon={<FiMail />}
            value={form.supportEmail}
            onChange={(e) => set("supportEmail", e.target.value)}
            placeholder="soporte@doblajequillero.com"
          />
          <Input
            label="Horario de atención"
            value={form.supportHours}
            onChange={(e) => set("supportHours", e.target.value)}
            placeholder="Lun a Sáb · 8:00 a.m. – 8:00 p.m."
          />
          <Input
            label="Contacto para publicidad"
            value={form.advertisingPhone}
            onChange={(e) => set("advertisingPhone", e.target.value)}
            placeholder="+57 300 123 4567"
          />
        </div>
      </Panel>

      <Panel icon={<FiShare2 />} title="Redes sociales">
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_KEYS.map((key) => {
            const { label, icon: Icon, placeholder } = SOCIAL_META[key];
            return (
              <Input
                key={key}
                label={label}
                icon={<Icon />}
                type="url"
                value={form.socials[key]}
                placeholder={placeholder}
                onChange={(e) => set("socials", { ...form.socials, [key]: e.target.value })}
              />
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-200">Deja vacío lo que no uses: esa red no aparecerá en la página.</p>
      </Panel>

      <Panel icon={<FiImage />} title="Marca">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre del sitio" value={form.siteName} onChange={(e) => set("siteName", e.target.value)} required />
          <Input label="Logo (URL)" type="url" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div className="mt-4 space-y-4">
          <Input label="Frase corta" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          <Textarea label="Texto “¿Quiénes somos?”" rows={4} value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} />
        </div>
      </Panel>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="lg" loading={saving} icon={<FiSave />}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
