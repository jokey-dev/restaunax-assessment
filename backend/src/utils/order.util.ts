import crypto from "crypto";

export function generateOrderNumber(length: number = 6): string {
  const randomStr = crypto
    .randomBytes(length)
    .toString("hex")
    .toUpperCase()
    .slice(0, length);
  return `ORDER-${randomStr}`;
}
