import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCreditCard, FiKey, FiLock, FiShare2, FiTag, FiTrendingUp, FiUser } from "react-icons/fi";
import { api, tokenStorage } from "@/services/api";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

const FEATURES = [
  { icon: FiTag, text: "Aprueba pagos y envía números al instante" },
  { icon: FiCreditCard, text: "Administra tus métodos de pago y llaves" },
  { icon: FiShare2, text: "Edita redes, WhatsApp y correo de soporte" },
  { icon: FiTrendingUp, text: "Ranking de compradores y balance total" },
];

function AdminLogin() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenStorage.get()) navigate("/admin/panel", { replace: true });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(username.trim(), password);
      navigate("/admin/panel");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen bg-ink-950 md:grid-cols-2">
      <ThemeToggle className="absolute right-4 top-4 z-10" />
      <div className="relative hidden flex-col justify-center overflow-hidden border-r border-gold-500/20 p-16 md:flex">
        <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
        <div className="relative max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <Logo size={56} />
            <div>
              <p className="font-display text-3xl text-gold-gradient">{settings.siteName}</p>
              <p className="text-sm text-ink-200">Panel de administración</p>
            </div>
          </div>
          <h1 className="font-display text-5xl leading-tight text-ink-50">
            Controla tus eventos <span className="text-gold-gradient">desde un solo lugar</span>
          </h1>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-ink-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/40 text-gold-300">
                  <Icon />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="mb-2 md:hidden">
            <Logo size={64} />
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-on-gold">
            <FiLock size={22} />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-ink-50">Iniciar sesión</h2>
            <p className="text-sm text-ink-200">Ingresa tu usuario y contraseña.</p>
          </div>
          <Input
            label="Usuario"
            icon={<FiUser />}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
          />
          <Input
            type="password"
            label="Contraseña"
            icon={<FiKey />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading} icon={<FiArrowRight />} className="flex-row-reverse">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
