import type { Address } from '../types';

/** Format integer cents as USD currency (e.g. 1499 → "$14.99"). */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/** Single-line US-style address string. */
export function formatAddress(
  parts: Pick<Address, 'line1' | 'line2' | 'city' | 'state' | 'postalCode'>
): string {
  const street = parts.line2 ? `${parts.line1}, ${parts.line2}` : parts.line1;
  return `${street}, ${parts.city}, ${parts.state} ${parts.postalCode}`;
}

/**
 * Compact relative time from an ISO timestamp or Date.
 * Examples: "just now", "5m ago", "2h ago", "3d ago", "Jan 12".
 */
export function formatRelativeTime(
  input: string | Date,
  now: Date = new Date()
): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = now.getTime() - date.getTime();
  const future = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const seconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const suffix = future ? '' : ' ago';
  const prefix = future ? 'in ' : '';

  if (seconds < 45) return 'just now';
  if (minutes < 60) return `${prefix}${minutes}m${suffix}`;
  if (hours < 24) return `${prefix}${hours}h${suffix}`;
  if (days < 7) return `${prefix}${days}d${suffix}`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }).format(date);
}
