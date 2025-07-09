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

export function getJoinedDate(date: Date): string {
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${month} ${year}`;
}

type SortableItem = {
  _count?: {
    upvotes?: number;
  };
  views?: number;
  createdAt?: Date;
};

export function sortByUpvotesAndViews<T extends SortableItem>(items: T[]): T[] {
  return items.sort((a, b) => {
    const upvotesA = a._count?.upvotes ?? 0;
    const upvotesB = b._count?.upvotes ?? 0;

    if (upvotesB !== upvotesA) return upvotesB - upvotesA;

    const viewsA = a.views ?? 0;
    const viewsB = b.views ?? 0;

    if (viewsB !== viewsA) return viewsB - viewsA;

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateB - dateA;
  });
}
