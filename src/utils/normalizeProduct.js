// Makes every product (old one-colour or new multi-colour) look the same
export function normalizeVariant(v, fallbackImages = []) {
  const images = Array.isArray(v?.images) ? v.images.filter(Boolean) : [];

  return {
    colour: String(v?.colour || "").trim(),
    hex: v?.hex || "#cccccc",
    images: images.length > 0 ? images : fallbackImages,
    stock: Math.max(0, Number(v?.stock) || 0)
  };
}

export default function normalizeProduct(data) {
  const legacyImages =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images.filter(Boolean)
      : data.image
      ? [data.image]
      : [];

  const variants =
    Array.isArray(data.variants) && data.variants.length > 0
      ? data.variants.map((v) => normalizeVariant(v, legacyImages))
      : [
          {
            colour: "",
            hex: "#cccccc",
            images: legacyImages,
            stock: Math.max(0, Number(data.stock) || 0)
          }
        ];

  const first = variants[0];

  return {
    ...data,
    id: Number(data.id) || 0,
    variants,
    image: first.images[0] || "",
    images: first.images,
    price: String(data.price ?? "0"),
    originalPrice: data.originalPrice ? String(data.originalPrice) : "",
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
    badge: data.badge || ""
  };
}