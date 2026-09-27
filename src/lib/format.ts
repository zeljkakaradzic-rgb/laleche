export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("sr-RS").format(Math.round(value))} RSD`;
}
