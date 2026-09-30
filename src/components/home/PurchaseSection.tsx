import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FiAlertTriangle,
  FiCreditCard,
  FiHash,
  FiMail,
  FiMinus,
  FiPhone,
  FiPlus,
  FiShoppingBag,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import type { PaymentMethod, Raffle } from "@/types";
import { api } from "@/services/api";
import { calculateTotal, escapeHtml, formatMoney } from "@/utils/format";
import { compressImage, IMAGE_PRESETS } from "@/utils/image";
import { notifyError, swal } from "@/utils/swal";
import { Input } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import PaymentPicker from "./PaymentPicker";
import PhonePrefixSelect from "./PhonePrefixSelect";

interface Props {
  raffle: Raffle;
  maxPurchasable: number;
  availablePercent: number;
  methods: PaymentMethod[];
  usdRate: number;
  onPurchased: () => void;
}

const QUICK_PICKS = [2, 5, 10, 20, 50, 100];

export default function PurchaseSection({ raffle, maxPurchasable, availablePercent, methods, usdRate, onPurchased }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<PaymentMethod | undefined>(methods[0]);
  const [prefix, setPrefix] = useState("+57");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const min = raffle.minTickets;
  const max = maxPurchasable;

  const formik = useFormik({
    initialValues: {
      numberTickets: min,
      fullName: "",
      email: "",
      phone: "",
      reference: "",
      voucher: "",
    },
    validationSchema: Yup.object({
      numberTickets: Yup.number().min(min, `Mínimo ${min} boletos`).max(max, `Máximo ${max} boletos`).required(),
      fullName: Yup.string().trim().min(3, "Escribe tu nombre completo").required("Este campo es obligatorio"),
      email: Yup.string().email("Correo inválido").required("Este campo es obligatorio"),
      phone: Yup.string().matches(/^\+\d{8,16}$/, "Número inválido").required("Este campo es obligatorio"),
      reference: Yup.string().trim().required("Este campo es obligatorio"),
      voucher: Yup.string().required("Sube la captura de tu pago"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!method?._id) {
        notifyError(new Error("Selecciona un método de pago"));
        return;
      }
      try {
        const { ticket } = await api.createTicket({ ...values, paymentMethodId: method._id });
        await swal.fire({
          icon: "success",
          title: "¡Compra registrada!",
          width: 560,
          html: `
            <p style="margin-bottom:14px">Cuando verifiquemos tu pago te enviaremos tus números a <b>${escapeHtml(values.email)}</b>.</p>
            <div style="text-align:left;background:rgb(var(--ink-900));border:1px solid rgb(var(--gold-500) / .3);border-radius:14px;padding:14px;line-height:1.9">
              <div><b>Nombre:</b> ${escapeHtml(values.fullName)}</div>
              <div><b>Boletos:</b> ${values.numberTickets}</div>
              <div><b>Método:</b> ${escapeHtml(ticket.paymentMethod)}</div>
              <div><b>Referencia:</b> ${escapeHtml(values.reference)}</div>
              <div><b>Total:</b> ${formatMoney(ticket.amountPaid, ticket.currency)}</div>
            </div>
            <p style="margin-top:14px;font-size:13px;opacity:.8">La verificación puede tardar entre 24 y 36 horas.</p>`,
          confirmButtonText: "¡De una!",
        });
        resetForm();
        setPhoneNumber("");
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        onPurchased();
      } catch (error) {
        notifyError(error);
      }
    },
  });

  const { setFieldValue } = formik;

  useEffect(() => {
    setFieldValue("phone", phoneNumber ? `${prefix}${phoneNumber}` : "");
  }, [prefix, phoneNumber, setFieldValue]);

  const quantity = Number(formik.values.numberTickets) || 0;
  const total = method ? calculateTotal(raffle.ticketPrice, quantity, method.currency, usdRate) : 0;

  const setQuantity = (value: number) => {
    const clamped = Math.max(min, Math.min(max, Math.floor(value) || min));
    setNotice(value > max ? `Máximo ${max} boletos por compra` : "");
    setFieldValue("numberTickets", clamped);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, IMAGE_PRESETS.voucher);
      setPreview(base64);
      setFieldValue("voucher", base64);
    } catch (error) {
      notifyError(error);
    }
  };

  const errorOf = (key: keyof typeof formik.values) =>
    formik.touched[key] && formik.errors[key] ? String(formik.errors[key]) : undefined;

  return (
    <section id="comprar" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
          {availablePercent.toFixed(1)}% disponible · ¡Asegura los tuyos!
        </p>
        <h2 className="section-title mt-2 text-gold-gradient">Compra tus boletos</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid items-start gap-6 lg:grid-cols-2" noValidate>
        <div className="space-y-6">
          <div className="card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="label !mb-0">
                <FiHash className="text-gold-400" /> Cantidad de boletos
              </p>
              <span className="text-xs text-ink-200">
                Mín. {min} · Máx. {max}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 rounded-2xl border border-ink-400 bg-ink-900 py-4">
              <button
                type="button"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= min}
                aria-label="Restar boleto"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-500/10 disabled:opacity-30"
              >
                <FiMinus />
              </button>
              <input
                type="number"
                name="numberTickets"
                value={formik.values.numberTickets}
                onChange={(event) => setFieldValue("numberTickets", event.target.value)}
                onBlur={(event) => setQuantity(Number(event.target.value))}
                className="w-24 bg-transparent text-center font-display text-5xl text-gold-200 outline-none"
                aria-label="Cantidad de boletos"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= max}
                aria-label="Sumar boleto"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-on-gold transition hover:brightness-110 disabled:opacity-30"
              >
                <FiPlus />
              </button>
            </div>

            {notice && (
              <p className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-red-300">
                <FiAlertTriangle /> {notice}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_PICKS.filter((value) => value >= min && value <= max).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setQuantity(value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
                    quantity === value
                      ? "border-gold-500 bg-gold-gradient text-on-gold"
                      : "border-ink-400 text-ink-100 hover:border-gold-500 hover:text-gold-300"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5 md:p-6">
            <p className="label mb-4">
              <FiCreditCard className="text-gold-400" /> Método de pago
            </p>
            <PaymentPicker methods={methods} selectedId={method?._id} onSelect={setMethod} total={total} />
          </div>
        </div>

        <div className="card space-y-4 p-5 md:p-6 lg:sticky lg:top-24">
          <p className="label !mb-0 text-lg">
            <FiShoppingBag className="text-gold-400" /> Tus datos
          </p>

          <Input
            label="Nombre y apellido"
            icon={<FiUser />}
            name="fullName"
            placeholder="Ej: Jason David"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={errorOf("fullName")}
            required
          />
          <Input
            label="Correo electrónico"
            icon={<FiMail />}
            type="email"
            name="email"
            placeholder="tucorreo@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={errorOf("email")}
            hint="Aquí te enviaremos tus números"
            required
          />

          <div>
            <label htmlFor="phone" className="label">
              <FiPhone className="text-gold-400" /> Celular / WhatsApp <span className="text-gold-400">*</span>
            </label>
            <div className="flex">
              <PhonePrefixSelect value={prefix} onChange={setPrefix} />
              <input
                id="phone"
                type="tel"
                name="phone"
                inputMode="numeric"
                placeholder="3001234567"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, ""))}
                onBlur={formik.handleBlur}
                className="field !rounded-l-none"
              />
            </div>
            {errorOf("phone") && <p className="mt-1 text-xs text-red-400">{errorOf("phone")}</p>}
          </div>

          <Input
            label="Referencia o N° de comprobante"
            icon={<FiHash />}
            name="reference"
            placeholder="Ej: M123456 o nombre de quien paga"
            value={formik.values.reference}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={errorOf("reference")}
            required
          />

          <div>
            <p className="label">
              <FiUploadCloud className="text-gold-400" /> Comprobante de pago <span className="text-gold-400">*</span>
            </p>
            <label
              htmlFor="voucher"
              className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gold-500/40 bg-ink-900/60 transition hover:bg-gold-500/5"
            >
              {preview ? (
                <img src={preview} alt="Comprobante" className="h-full w-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm text-ink-200">
                  <FiUploadCloud size={28} className="text-gold-400" />
                  Toca para subir la captura
                </span>
              )}
            </label>
            <input id="voucher" ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {formik.submitCount > 0 && formik.errors.voucher && (
              <p className="mt-1 text-xs text-red-400">{formik.errors.voucher}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gold-500/30 bg-ink-950/60 px-4 py-3">
            <span className="text-sm text-ink-100">
              {quantity} boleto{quantity === 1 ? "" : "s"}
            </span>
            <span className="font-display text-3xl text-gold-300">
              {method ? formatMoney(total, method.currency) : formatMoney(raffle.ticketPrice * quantity)}
            </span>
          </div>

          <Button type="submit" size="lg" fullWidth loading={formik.isSubmitting} disabled={!method}>
            Confirmar compra
          </Button>
          <p className="text-center text-xs text-ink-200">
            Verificamos tu pago en un plazo de 24 a 36 horas y te enviamos tus números por correo.
          </p>
        </div>
      </form>
    </section>
  );
}
