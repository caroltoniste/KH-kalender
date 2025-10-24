import { getCalendarDays, getPostsForDay } from "@/lib/date-utils";
import { WEEKDAYS_SHORT_ET, POST_TYPE_EMOJIS } from "@/lib/constants";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  year: number;
  month: number;
  posts: Post[];
  selectedDate?: Date | null;
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({
  year,
  month,
  posts,
  selectedDate,
  onDayClick,
}: CalendarGridProps) {
  const calendarDays = getCalendarDays(year, month);
  
  const isSameDay = (date1: Date, date2: Date | null | undefined) => {
    if (!date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS_SHORT_ET.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dayPosts = getPostsForDay(posts, day.date);
          const displayPosts = dayPosts.slice(0, 3);
          const overflowCount = dayPosts.length - 3;

          const isSelected = isSameDay(day.date, selectedDate);
          
          return (
            <button
              key={index}
              onClick={() => onDayClick(day.date)}
              className={cn(
                "calendar-day",
                day.isToday && "today",
                !day.isCurrentMonth && "inactive",
                isSelected && "ring-2 ring-accent1 bg-accent3"
              )}
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {day.date.getDate()}
              </div>
              <div className="flex flex-wrap gap-0.5 justify-center items-center">
                {displayPosts.map((post) => (
                  <span key={post.id} className="text-base leading-none">
                    {POST_TYPE_EMOJIS[post.type]}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="text-xs text-gray-500 font-medium">
                    +{overflowCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
