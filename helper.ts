export function calculateDV(nit: number | string | null) {
  const nitAsNumber = Number(nit);
  if (!nit || isNaN(nitAsNumber)) return 0;

  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let nitStr = String(nit).split('').reverse(); // Reverse the NIT to apply the weights from right to left
  let sum = nitStr.reduce((acc, digit, i) => acc + parseInt(digit) * weights[i], 0);
  let remainder = sum % 11;

  if (remainder === 0 || remainder === 1) {
    return 0;
  } else {
    return 11 - remainder;
  }
}
