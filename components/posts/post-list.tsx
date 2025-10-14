import { groupPostsByWeek, sortPostsByDate } from "@/lib/date-utils";
import type { Post } from "@/types";
import PostItem from "./post-item";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onUpdate: (id: string, data: Partial<Post>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function PostList({
  posts,
  loading,
  onUpdate,
  onDelete,
}: PostListProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Laadin...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selle kuu kohta pole postitusi. Lisa esimene! 😺
      </div>
    );
  }

  const weekGroups = groupPostsByWeek(sortPostsByDate(posts));

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-xl font-semibold">
        Postitused ({posts.length})
      </h3>

      {weekGroups.map((group) => (
        <div key={`${group.year}-W${group.weekNumber}`}>
          {/* Week Divider */}
          <div className="week-divider">
            <span className="text-sm font-semibold text-muted-foreground">
              Nädal {group.weekNumber} ({group.dateRange})
            </span>
          </div>

          {/* Posts in this week */}
          <div className="space-y-3">
            {sortPostsByDate(group.posts).map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
