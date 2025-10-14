import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getWeek,
  getYear,
  parseISO,
  isSameDay,
} from "date-fns";
import { WEEKDAYS_ET, MONTHS_ET } from "./constants";
import type { CalendarDay, Post, WeekGroup } from "@/types";

/**
 * Get calendar days for a given month (including padding days from prev/next months)
 * Estonian week starts on Monday
 */
export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  // Monday start (weekStartsOn: 1)
  const calendarStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, firstDayOfMonth),
    isToday: isToday(date),
    posts: [],
  }));
}

/**
 * Get week number based on Estonian ISO 8601 standard (Monday start)
 */
export function getWeekNumber(date: Date): { week: number; year: number } {
  return {
    week: getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 }),
    year: getYear(date),
  };
}

/**
 * Get Estonian weekday name
 */
export function getWeekdayName(date: Date): string {
  // getDay returns 0 for Sunday, we need Monday = 0
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return WEEKDAYS_ET[dayIndex];
}

/**
 * Get Estonian month name
 */
export function getMonthName(monthIndex: number): string {
  return MONTHS_ET[monthIndex];
}

/**
 * Format date as DD.MM.YYYY (Estonian format)
 */
export function formatEstonianDate(date: Date): string {
  return format(date, "dd.MM.yyyy");
}

/**
 * Format time as HH:mm
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm");
}

/**
 * Format datetime as "DD.MM.YYYY HH:mm"
 */
export function formatEstonianDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd.MM.yyyy HH:mm");
}

/**
 * Group posts by week and sort
 */
export function groupPostsByWeek(posts: Post[]): WeekGroup[] {
  const weekMap = new Map<string, WeekGroup>();

  posts.forEach((post) => {
    const postDate = parseISO(post.datetime);
    const { week, year } = getWeekNumber(postDate);
    const key = `${year}-W${week}`;

    if (!weekMap.has(key)) {
      // Calculate date range for the week
      const weekStart = startOfWeek(postDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(postDate, { weekStartsOn: 1 });
      const dateRange = `${format(weekStart, "d")}-${format(weekEnd, "d.M")}`;

      weekMap.set(key, {
        weekNumber: week,
        year,
        dateRange,
        posts: [],
      });
    }

    weekMap.get(key)!.posts.push(post);
  });

  // Convert to array and sort by week
  return Array.from(weekMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.weekNumber - b.weekNumber;
  });
}

/**
 * Get posts for a specific day
 */
export function getPostsForDay(posts: Post[], date: Date): Post[] {
  return posts.filter((post) => {
    const postDate = parseISO(post.datetime);
    return isSameDay(postDate, date);
  });
}

/**
 * Sort posts by datetime
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });
}
