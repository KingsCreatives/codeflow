import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeStamp(createdAt: Date | string): string {
  if (typeof createdAt === "string") {
    createdAt = new Date(createdAt);
  }

  if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
    return "Invalid date";
  }

  const now = new Date(); // Current time
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 0) {
    return "In the future";
  }

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "Just now";
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}