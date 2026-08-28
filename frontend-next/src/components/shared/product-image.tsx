import { cn } from "@/lib/utils";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import Image from "next/image";

interface PriceDisplayProps {
  price: number | string;
  className?: string;
  currency?: string;
}

export function PriceDisplay({
  price,
  className,
  currency = "$",
}: PriceDisplayProps) {
  const numericPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]/g, ""))
      : price;

  const formatted = isNaN(numericPrice)
    ? "0.00"
    : numericPrice.toFixed(2);

  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {currency}
      {formatted}
    </span>
  );
}

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: ProductImageProps) {
  const imageSrc = src || IMAGE_PLACEHOLDER;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}