import {format} from 'date-fns';

/**
 * Format to a string version of a percent which will show only
 * a minimal amount of precision as well as include a leading symbol
 *
 * Ex: formatPercent(0.033)
 * Returns: +3.3%
 *
 * Ex: formatPercent(-0.6)
 * Returns: -60%
 */
export function formatPercent(
  value: number,
  precision: number = 2,
  showDirection: boolean = true
): string {
  if (value === undefined) return;

  const directionSymbol = value >= 0 ? '+' : '';
  let formattedValue = `${formatNumber(value * 100, precision)}%`;
  if (showDirection) formattedValue = `${directionSymbol}${formattedValue}`;
  return formattedValue;
}

/**
 * Format to a number version of a float which will limit the decimals
 * to only two
 *
 * Ex: formatNumber(2.1)
 * Returns: 2.10
 */
export function formatNumber(value: number, precision: number = 2): number {
  if (value === undefined) return;
  return +value.toFixed(precision);
}

/**
 * Format to a string version of a float which will limit the decimals
 *
 * Ex: formatNumberAsString(2.1)
 * Returns: "+2.10"
 */
export function formatNumberAsString(
  value: number,
  precision: number = 2,
  showDirection: boolean = true
): string {
  let formattedValue = `${formatNumber(value, precision)}`;
  const directionSymbol = value >= 0 ? '+' : '';
  if (showDirection) formattedValue = `${directionSymbol}${formattedValue}`;
  return formattedValue;
}

/**
 * Format to a string version of a float which will limit the decimals
 * to only two
 *
 * Ex: formatCurrency(2.1)
 * Returns: 2.10
 *
 * Ex: formatCurrency(2.1, true)
 * Returns: +2.10
 */
export function formatCurrency(value: number, showDirection = false): string {
  if (value === undefined) return;
  const directionSymbol = value >= 0 ? '+' : '';
  let formattedValue = value.toFixed(2);
  if (showDirection) formattedValue = `${directionSymbol}${formattedValue}`;
  return formattedValue;
}

/**
 * Formats the date as it is used by Tradier.
 * yyyy-MM-dd
 */
export function formatDate(date: string | number | Date) {
  return format(date, 'yyyy-MM-dd');
}
