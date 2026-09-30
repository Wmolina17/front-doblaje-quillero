import Swal from "sweetalert2";

const button = "!rounded-xl !px-5 !py-2.5 !font-semibold !mx-1.5 !shadow-none";

const base = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: "!rounded-2xl !border !border-gold-500/30 !bg-ink-800 !text-ink-50 !font-sans",
    title: "!text-gold-300",
    htmlContainer: "!text-ink-100",
    input: "!w-[calc(100%-2.5em)] !box-border !mx-auto !bg-ink-900 !text-ink-50 !border-ink-400",
    confirmButton: `${button} !bg-gold-500 hover:!bg-gold-400 !text-on-gold`,
    cancelButton: `${button} !bg-ink-500 hover:!bg-ink-400 !text-ink-50`,
  },
});

export const swal = base;

export const swalDanger = base.mixin({
  customClass: {
    popup: "!rounded-2xl !border !border-danger/40 !bg-ink-800 !text-ink-50 !font-sans",
    title: "!text-red-500",
    htmlContainer: "!text-ink-100",
    confirmButton: `${button} !bg-danger hover:!bg-red-600 !text-white`,
    cancelButton: `${button} !bg-ink-500 hover:!bg-ink-400 !text-ink-50`,
  },
});

export const confirmAction = async (title: string, text: string, danger = false) => {
  const result = await (danger ? swalDanger : swal).fire({
    title,
    text,
    icon: danger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
};

export const notifyError = (error: unknown) =>
  swalDanger.fire({
    title: "Error",
    text: error instanceof Error ? error.message : "Ocurrió un error inesperado",
    icon: "error",
  });

export const notifySuccess = (title: string, text?: string) =>
  swal.fire({ title, text, icon: "success", timer: 2200, showConfirmButton: false });
