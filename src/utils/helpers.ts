import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind classes merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
