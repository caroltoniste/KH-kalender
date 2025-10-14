import { getCalendarDays, getPostsForDay } from "@/lib/date-utils";
import { WEEKDAYS_SHORT_ET, POST_TYPE_EMOJIS } from "@/lib/constants";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  year: number;
  month: number;
  posts: Post[];
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({
  year,
  month,
  posts,
  onDayClick,
}: CalendarGridProps) {
  const calendarDays = getCalendarDays(year, month);

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS_SHORT_ET.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-semibold text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayPosts = getPostsForDay(posts, day.date);
          const displayPosts = dayPosts.slice(0, 3);
          const overflowCount = dayPosts.length - 3;

          return (
            <button
              key={index}
              onClick={() => onDayClick(day.date)}
              className={cn(
                "calendar-day",
                day.isToday && "today",
                !day.isCurrentMonth && "inactive"
              )}
            >
              <div className="text-xs md:text-sm font-medium mb-1">
                {day.date.getDate()}
              </div>
              <div className="flex flex-col items-center gap-0.5">
                {displayPosts.map((post) => (
                  <span key={post.id} className="text-sm md:text-base">
                    {POST_TYPE_EMOJIS[post.type]}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="text-[10px] text-muted-foreground font-medium">
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
