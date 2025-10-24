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
    <div className="space-y-4">
      {weekGroups.map((group, index) => (
        <div key={`${group.year}-W${group.weekNumber}`}>
          {/* Dotted line divider between weeks */}
          {index > 0 && (
            <div className="border-t-2 border-dotted border-pink-300 my-4"></div>
          )}

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
