interface CompressOptions {
  maxSize: number;
  maxBytes: number;
  quality?: number;
  minQuality?: number;
}

const MAX_INPUT_BYTES = 25 * 1024 * 1024;

export const IMAGE_PRESETS = {
  voucher: { maxSize: 1280, maxBytes: 300 * 1024, quality: 0.78 },
  raffle: { maxSize: 1600, maxBytes: 500 * 1024, quality: 0.82 },
} satisfies Record<string, CompressOptions>;

export const dataUrlBytes = (dataUrl: string) => Math.ceil(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("El archivo no es una imagen válida"));
    };
    img.src = url;
  });

const render = (img: HTMLImageElement, maxSize: number, quality: number) => {
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const webp = canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp")) return webp;

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
};

export const compressImage = async (
  file: File,
  { maxSize, maxBytes, quality = 0.8, minQuality = 0.55 }: CompressOptions,
): Promise<string> => {
  if (!file.type.startsWith("image/")) throw new Error("Solo se permiten imágenes");
  if (file.size > MAX_INPUT_BYTES) throw new Error("La imagen es demasiado grande (máx. 25 MB)");

  const img = await loadImage(file);
  let size = maxSize;
  let currentQuality = quality;
  let result = render(img, size, currentQuality);

  while (dataUrlBytes(result) > maxBytes && size > 480) {
    if (currentQuality > minQuality) currentQuality = Math.max(minQuality, currentQuality - 0.08);
    else size = Math.round(size * 0.85);
    result = render(img, size, currentQuality);
  }

  if (dataUrlBytes(result) > maxBytes) throw new Error("No se pudo reducir la imagen lo suficiente");
  return result;
};
