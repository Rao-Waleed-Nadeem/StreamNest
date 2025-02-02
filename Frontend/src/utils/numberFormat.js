export function numberFormat(num) {
  if (num < 1000) return num.toString(); // Return the number as is if it's less than 1000

  const suffixes = ["K", "M", "B", "T"]; // Suffixes for thousands, millions, etc.
  const order = Math.floor(Math.log10(num) / 3); // Determine the order of magnitude (K, M, B, etc.)

  // Calculate the value with appropriate suffix
  const formattedNumber = (num / Math.pow(1000, order)).toFixed(1);

  return `${formattedNumber}${suffixes[order - 1]}`;
}
