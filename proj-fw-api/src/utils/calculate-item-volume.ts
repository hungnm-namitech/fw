export function calculateItemVolume(
  width: number,
  thickness: number,
  length: number,
  quantityPerPack: number = 1,
  fractionDigits?: number,
): number {
  return +(
    (length * thickness * width * quantityPerPack) /
    Math.pow(1000, 3)
  ).toFixed(fractionDigits || 4);
}
